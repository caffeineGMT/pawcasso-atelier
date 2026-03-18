import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { put } from "@vercel/blob";
import { Resend } from "resend";
import { processReferralConversion, getOrCreateCustomer } from "@/lib/referral";
import { generateOrderCompleteEmailWithReferral } from "@/lib/email-templates/order-complete-with-referral";
import { PrismaClient } from "@prisma/client";
import { createGiftCard, markGiftCardAsSent } from "@/lib/gift-cards";
import { GiftCardEmail } from "@/lib/email-templates/gift-card-delivery";

const prisma = new PrismaClient();

function getStripeInstance() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || "placeholder", {
    apiVersion: "2026-02-25.clover",
  });
}

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || "placeholder");
}

// Tier configuration for portrait counts
const TIER_PORTRAIT_COUNT: Record<string, number> = {
  basic: 1,
  premium: 3,
  deluxe: 5,
  bundle: 5,
};

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAYS = [10000, 30000, 90000]; // 10s, 30s, 90s

// Helper function to sleep
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to download file from URL
async function downloadFile(url: string): Promise<Buffer> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// Helper function to generate portrait via Manus API
async function generatePortrait(
  petPhotoBuffer: Buffer,
  petName: string,
  style: string,
  retryCount = 0
): Promise<string> {
  try {
    // Convert buffer to base64 for Manus API
    const base64Image = petPhotoBuffer.toString("base64");

    // Create Manus task
    const createResponse = await fetch(
      "https://manus.aws.metafb.cloud/api/v1/tasks",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MANUS_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: `Professional artistic portrait of ${petName} in ${style} style, high detail, studio lighting, 8K resolution, masterpiece quality`,
          image: base64Image,
          model: "flux-pro",
          aspect_ratio: "1:1",
          num_inference_steps: 50,
        }),
      }
    );

    if (!createResponse.ok) {
      throw new Error(`Manus API error: ${createResponse.statusText}`);
    }

    const { task_id } = await createResponse.json();

    // Poll for completion (max 5 minutes)
    const maxPollTime = 5 * 60 * 1000; // 5 minutes
    const pollInterval = 10000; // 10 seconds
    const startTime = Date.now();

    while (Date.now() - startTime < maxPollTime) {
      const statusResponse = await fetch(
        `https://manus.aws.metafb.cloud/api/v1/tasks/${task_id}/status`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MANUS_API_KEY}`,
          },
        }
      );

      if (!statusResponse.ok) {
        throw new Error(`Manus status check failed: ${statusResponse.statusText}`);
      }

      const statusData = await statusResponse.json();

      if (statusData.status === "completed") {
        return statusData.output_url;
      } else if (statusData.status === "failed") {
        throw new Error("Manus generation failed");
      }

      await sleep(pollInterval);
    }

    throw new Error("Manus generation timed out after 5 minutes");
  } catch (error) {
    // Retry logic with exponential backoff
    if (retryCount < MAX_RETRIES) {
      console.log(
        `Manus generation failed, retrying (${retryCount + 1}/${MAX_RETRIES})...`
      );
      await sleep(RETRY_DELAYS[retryCount]);
      return generatePortrait(petPhotoBuffer, petName, style, retryCount + 1);
    }
    throw error;
  }
}

// Helper function to send failure notification email
async function sendFailureNotification(
  sessionId: string,
  customerEmail: string,
  error: string
) {
  try {
    const resend = getResend();
    await resend.emails.send({
      from: "alerts@pawcasso-atelier.com",
      to: "michaelguo@meta.com",
      subject: `[CRITICAL] Portrait Generation Failed - Session ${sessionId}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #ff6b6b;">Portrait Generation Failed</h2>
          <p><strong>Session ID:</strong> ${sessionId}</p>
          <p><strong>Customer Email:</strong> ${customerEmail}</p>
          <p><strong>Error:</strong> ${error}</p>
          <p>Action required: Manual fulfillment needed.</p>
        </div>
      `,
    });
  } catch (emailError) {
    console.error("Failed to send failure notification:", emailError);
  }
}

// Helper function to create Printful order
async function createPrintfulOrder(
  portraitUrl: string,
  productType: string,
  customerName: string,
  customerEmail: string,
  shippingAddress: {
    name: string;
    address1: string;
    city: string;
    state_code: string;
    country_code: string;
    zip: string;
  },
  printfulProductId: string
) {
  if (!process.env.PRINTFUL_API_KEY) {
    throw new Error("Printful API key not configured");
  }

  // Create Printful order via API
  const printfulResponse = await fetch("https://api.printful.com/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
    },
    body: JSON.stringify({
      recipient: {
        name: shippingAddress.name,
        address1: shippingAddress.address1,
        city: shippingAddress.city,
        state_code: shippingAddress.state_code,
        country_code: shippingAddress.country_code,
        zip: shippingAddress.zip,
        email: customerEmail,
      },
      items: [
        {
          variant_id: printfulProductId,
          quantity: 1,
          files: [
            {
              url: portraitUrl,
              type: "default",
            },
          ],
        },
      ],
    }),
  });

  if (!printfulResponse.ok) {
    const errorData = await printfulResponse.json();
    throw new Error(`Printful API error: ${JSON.stringify(errorData)}`);
  }

  return await printfulResponse.json();
}

// Handler for print upsell orders
async function handlePrintUpsellOrder(
  session: Stripe.Checkout.Session,
  stripe: Stripe,
  resend: any
) {
  const metadata = session.metadata || {};
  const productType = metadata.product_type;
  const originalOrderId = metadata.original_order_id;
  const portraitUrl = metadata.portrait_url;
  const customerEmail = session.customer_email!;
  const customerName = metadata.customer_name || "Customer";
  const petName = metadata.pet_name || "your pet";
  const printfulProductId = metadata.printful_product_id;

  console.log(`Processing print upsell order: ${session.id}`);
  console.log(`Product: ${productType}, Original order: ${originalOrderId}`);

  try {
    // Record the print upsell order in database
    const amountTotal = session.amount_total || 0;

    await prisma.order.create({
      data: {
        stripeSessionId: session.id,
        stripePaymentIntentId: typeof session.payment_intent === 'string'
          ? session.payment_intent
          : null,
        customerEmail,
        customerName,
        tier: 'print_upsell',
        tierName: `Print Upsell - ${productType}`,
        amount: amountTotal / 100,
        subtotal: amountTotal / 100,
        discount: 0,
        tax: (session.total_details?.amount_tax || 0) / 100,
        petName,
        style: productType,
        notes: `Print upsell from order ${originalOrderId}`,
        petPhotoUrl: '',
        portraitUrls: portraitUrl,
        portraitCount: 0,
        utmSource: null,
        utmMedium: 'upsell',
        utmCampaign: 'print_upsell',
        referralCode: null,
        discountCode: null,
        pricingBadge: null,
        status: 'completed',
        deliveryStatus: 'pending',
        paidAt: new Date(),
      },
    });

    // TODO: Create Printful order when API keys are configured
    // For now, send manual fulfillment notification to admin
    if (process.env.PRINTFUL_API_KEY) {
      // Shipping address will need to be collected in checkout
      // For MVP, we'll send a notification to manually fulfill
      console.log("Printful API configured, but shipping collection not yet implemented");
    }

    // Send notification to admin for manual Printful fulfillment
    await resend.emails.send({
      from: "orders@pawcasso-atelier.com",
      to: "michaelguo@meta.com",
      subject: `🖼️ New Print Order - ${productType} - ${petName}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #000; color: #F5F5F7; padding: 40px; margin: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #111; border-radius: 16px; padding: 40px; border: 1px solid #1d1d1f; }
    h1 { color: #C9A96E; margin-bottom: 20px; font-size: 28px; }
    .order-box { background: #1a1a1a; padding: 20px; border-radius: 12px; margin: 20px 0; }
    .label { color: #86868b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
    .value { color: #F5F5F7; font-size: 16px; margin-bottom: 15px; }
    img { max-width: 100%; border-radius: 8px; margin: 20px 0; }
    .btn { display: inline-block; background: #C9A96E; color: #000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>New Print Order 🖼️</h1>

    <div class="order-box">
      <div class="label">Product Type</div>
      <div class="value">${productType.toUpperCase()} - ${petName}</div>

      <div class="label">Customer</div>
      <div class="value">${customerName} (${customerEmail})</div>

      <div class="label">Order ID</div>
      <div class="value">${session.id}</div>

      <div class="label">Original Digital Order</div>
      <div class="value">${originalOrderId}</div>

      <div class="label">Amount Paid</div>
      <div class="value">$${(amountTotal / 100).toFixed(2)}</div>
    </div>

    <div class="label">Portrait to Print</div>
    <img src="${portraitUrl}" alt="Portrait" />

    <p><strong>Action Required:</strong> Create Printful order manually with the portrait above.</p>
    <p>Printful Product ID: ${printfulProductId}</p>

    <a href="https://dashboard.stripe.com/payments/${session.payment_intent}" class="btn">View in Stripe</a>
  </div>
</body>
</html>
      `,
    });

    // Send confirmation email to customer
    await resend.emails.send({
      from: "portraits@pawcasso-atelier.com",
      to: customerEmail,
      subject: `Your ${productType} Print Order Confirmed! 🖼️`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #000; color: #F5F5F7; padding: 40px; margin: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #111; border-radius: 16px; padding: 40px; border: 1px solid #1d1d1f; }
    h1 { color: #C9A96E; margin-bottom: 20px; font-size: 28px; }
    p { line-height: 1.6; margin: 15px 0; }
    .timeline { background: #1a1a1a; padding: 20px; border-radius: 12px; margin: 20px 0; }
    .step { display: flex; gap: 15px; margin-bottom: 15px; align-items: start; }
    .step-number { background: #C9A96E; color: #000; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
    img { max-width: 100%; border-radius: 8px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Print Order Confirmed! 🖼️</h1>

    <p>Hi ${customerName},</p>

    <p>Thank you for ordering a <strong>${productType} print</strong> of ${petName}'s portrait!</p>

    <img src="${portraitUrl}" alt="Your Portrait" />

    <div class="timeline">
      <h3 style="color: #C9A96E; margin-top: 0;">What Happens Next?</h3>

      <div class="step">
        <div class="step-number">1</div>
        <div>
          <strong style="color: #F5F5F7;">Production (2-3 business days)</strong><br>
          <span style="color: #86868b;">Your portrait is professionally printed on premium materials</span>
        </div>
      </div>

      <div class="step">
        <div class="step-number">2</div>
        <div>
          <strong style="color: #F5F5F7;">Shipping (5-7 business days)</strong><br>
          <span style="color: #86868b;">Carefully packaged and shipped to your address</span>
        </div>
      </div>

      <div class="step">
        <div class="step-number">3</div>
        <div>
          <strong style="color: #F5F5F7;">Delivery & Enjoy!</strong><br>
          <span style="color: #86868b;">Your beautiful print arrives ready to display</span>
        </div>
      </div>
    </div>

    <p><strong>Total delivery time:</strong> 7-10 business days</p>
    <p style="color: #86868b; font-size: 14px;">You'll receive tracking information once your order ships.</p>

    <p style="margin-top: 30px;">Questions? Reply to this email or DM us on Instagram <a href="https://instagram.com/pawcasso.atelier" style="color: #C9A96E;">@pawcasso.atelier</a></p>
  </div>
</body>
</html>
      `,
    });

    console.log(`Print upsell order processed successfully: ${session.id}`);

    return NextResponse.json({
      success: true,
      order_type: 'print_upsell',
      session_id: session.id,
    });
  } catch (error) {
    console.error("Error processing print upsell order:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    // Send failure notification
    await resend.emails.send({
      from: "alerts@pawcasso-atelier.com",
      to: "michaelguo@meta.com",
      subject: `[ERROR] Print Upsell Order Failed - ${session.id}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #ff6b6b;">Print Upsell Order Failed</h2>
          <p><strong>Session ID:</strong> ${session.id}</p>
          <p><strong>Product Type:</strong> ${productType}</p>
          <p><strong>Customer:</strong> ${customerEmail}</p>
          <p><strong>Error:</strong> ${errorMessage}</p>
        </div>
      `,
    });

    return NextResponse.json(
      { error: "Print upsell processing failed", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const stripe = getStripeInstance();
  const resend = getResend();

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  // Handle checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Extract metadata
    const metadata = session.metadata || {};

    // Check if this is a print upsell order
    if (metadata.order_type === 'print_upsell') {
      return handlePrintUpsellOrder(session, stripe, resend);
    }

    // Check if this is a gift card purchase
    if (metadata.type === 'gift_card') {
      try {
        console.log(`Processing gift card purchase: ${session.id}`);

        const amount = parseFloat(metadata.amount || "0");
        const recipientEmail = metadata.recipientEmail;
        const recipientName = metadata.recipientName;
        const senderName = metadata.senderName;
        const senderEmail = metadata.senderEmail || session.customer_email || "";
        const message = metadata.message || null;
        const deliveryDate = metadata.deliveryDate
          ? new Date(metadata.deliveryDate)
          : new Date();

        // Create gift card record
        const giftCard = await createGiftCard({
          amount,
          purchaserEmail: senderEmail,
          purchaserName: senderName,
          recipientEmail,
          recipientName,
          message,
          deliveryDate,
          stripeSessionId: session.id,
          stripePaymentIntentId: typeof session.payment_intent === 'string'
            ? session.payment_intent
            : undefined,
        });

        console.log(`Gift card created: ${giftCard.code}`);

        // Send email to recipient (if delivery date is now)
        const shouldSendNow = deliveryDate <= new Date();

        if (shouldSendNow) {
          const emailHtml = GiftCardEmail({
            recipientName,
            senderName,
            giftCardCode: giftCard.code,
            amount,
            message: message || undefined,
            expiresAt: giftCard.expiresAt?.toISOString() || "",
          });

          await resend.emails.send({
            from: "Pawcasso Atelier <gifts@pawcasso-atelier.com>",
            to: recipientEmail,
            subject: `🎁 ${senderName} sent you a Pawcasso gift card!`,
            html: emailHtml,
          });

          // Mark as sent
          await markGiftCardAsSent(giftCard.id);

          console.log(`Gift card email sent to: ${recipientEmail}`);
        } else {
          console.log(
            `Gift card scheduled for delivery on: ${deliveryDate.toISOString()}`
          );
          // TODO: Set up scheduled email delivery (can use a cron job or scheduled task)
        }

        // Send confirmation to purchaser
        await resend.emails.send({
          from: "Pawcasso Atelier <gifts@pawcasso-atelier.com>",
          to: senderEmail,
          subject: `Gift Card Purchase Confirmed - $${amount}`,
          html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: linear-gradient(135deg, #FEF3E2 0%, #FFFFFF 50%, #FFF1F3 100%); padding: 40px; margin: 0; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; padding: 40px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
    h1 { color: #C9A96E; margin-bottom: 20px; font-size: 28px; }
    .info-box { background: #F9FAFB; border-radius: 12px; padding: 20px; margin: 20px 0; }
    .label { color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
    .value { color: #1f2937; font-size: 16px; margin-bottom: 15px; }
    p { line-height: 1.6; color: #4b5563; }
    .highlight { background: #FEF3E2; border-left: 4px solid #C9A96E; padding: 16px; border-radius: 8px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Gift Card Purchase Confirmed! 🎁</h1>
    <p>Hi ${senderName},</p>
    <p>Thank you for purchasing a Pawcasso gift card! Here are the details:</p>

    <div class="info-box">
      <div class="label">Gift Card Amount</div>
      <div class="value">$${amount.toFixed(2)}</div>

      <div class="label">Recipient</div>
      <div class="value">${recipientName} (${recipientEmail})</div>

      <div class="label">Gift Card Code</div>
      <div class="value" style="font-family: 'Courier New', monospace; font-size: 18px; font-weight: 700; color: #C9A96E;">${giftCard.code}</div>

      <div class="label">Delivery</div>
      <div class="value">${
        shouldSendNow
          ? "Sent immediately"
          : `Scheduled for ${deliveryDate.toLocaleDateString()}`
      }</div>
    </div>

    ${
      message
        ? `
    <div class="highlight">
      <p style="margin: 0; font-style: italic;">"${message}"</p>
    </div>
    `
        : ""
    }

    <div class="highlight">
      <p style="margin: 0;"><strong>💰 Earn 10% Credit!</strong></p>
      <p style="margin: 8px 0 0;">When ${recipientName} makes their first purchase using this gift card, you'll receive 10% of the order value as account credit. It's our way of saying thanks for spreading the love!</p>
    </div>

    <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
      Questions? Reply to this email or visit our website for support.
    </p>
  </div>
</body>
</html>
          `,
        });

        console.log(`Gift card confirmation sent to purchaser: ${senderEmail}`);

        return NextResponse.json({
          success: true,
          type: "gift_card",
          gift_card_code: giftCard.code,
          delivery_scheduled: !shouldSendNow,
        });
      } catch (error) {
        console.error("Error processing gift card:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";

        // Send failure notification
        await resend.emails.send({
          from: "alerts@pawcasso-atelier.com",
          to: "michaelguo@meta.com",
          subject: `[ERROR] Gift Card Purchase Failed - ${session.id}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px;">
              <h2 style="color: #ff6b6b;">Gift Card Purchase Failed</h2>
              <p><strong>Session ID:</strong> ${session.id}</p>
              <p><strong>Amount:</strong> $${metadata.amount}</p>
              <p><strong>Recipient:</strong> ${metadata.recipientEmail}</p>
              <p><strong>Error:</strong> ${errorMessage}</p>
            </div>
          `,
        });

        return NextResponse.json(
          { error: "Gift card processing failed", details: errorMessage },
          { status: 500 }
        );
      }
    }

    // Standard digital portrait order
    const petPhotoUrl = metadata.petPhotoUrl;
    const tier = metadata.tier || "basic";
    const customerEmail = session.customer_email!;
    const customerName = metadata.customerName || "Customer";
    const petName = metadata.petName || "your pet";
    const style = metadata.style || "renaissance";

    // Create order record in database
    const amountTotal = session.amount_total || 0;
    const discount = session.total_details?.amount_discount || 0;

    try {
      await prisma.order.create({
        data: {
          stripeSessionId: session.id,
          stripePaymentIntentId: typeof session.payment_intent === 'string'
            ? session.payment_intent
            : null,
          customerEmail,
          customerName,
          tier,
          tierName: metadata.tierName || tier,
          amount: amountTotal / 100,
          subtotal: (amountTotal + discount) / 100,
          discount: discount / 100,
          tax: (session.total_details?.amount_tax || 0) / 100,
          petName,
          style,
          notes: metadata.notes || '',
          petPhotoUrl: metadata.petPhotoUrl || '',
          portraitUrls: '',
          portraitCount: tier === 'basic' ? 1 : tier === 'premium' ? 3 : tier === 'deluxe' ? 5 : 5,
          utmSource: metadata.utmSource || null,
          utmMedium: metadata.utmMedium || null,
          utmCampaign: metadata.utmCampaign || null,
          referralCode: metadata.referralCode || null,
          discountCode: metadata.discountCode || null,
          pricingBadge: metadata.badge || null,
          status: 'completed',
          deliveryStatus: 'pending',
          paidAt: new Date(),
        },
      });
    } catch (dbError) {
      console.error('Failed to create order in database:', dbError);
      // Continue with order processing even if database save fails
    }

    // Validate pet photo URL exists
    if (!petPhotoUrl) {
      console.error("Missing pet_photo_url in session metadata");
      await sendFailureNotification(
        session.id,
        customerEmail,
        "Missing pet photo URL in order metadata"
      );
      return NextResponse.json(
        { error: "Missing pet photo URL" },
        { status: 400 }
      );
    }

    try {
      // Step 1: Download pet photo from Blob storage
      console.log(`Downloading pet photo from: ${petPhotoUrl}`);
      const petPhotoBuffer = await downloadFile(petPhotoUrl);

      // Step 2: Generate portraits based on tier
      const portraitCount = TIER_PORTRAIT_COUNT[tier] || 1;
      console.log(`Generating ${portraitCount} portrait(s) for tier: ${tier}`);

      const portraitUrls: string[] = [];

      for (let i = 0; i < portraitCount; i++) {
        console.log(`Generating portrait ${i + 1}/${portraitCount}...`);

        // Generate portrait via Manus
        const outputUrl = await generatePortrait(
          petPhotoBuffer,
          petName,
          style
        );

        // Download generated image
        const generatedImageResponse = await fetch(outputUrl);
        const generatedImageBuffer = Buffer.from(
          await generatedImageResponse.arrayBuffer()
        );

        // Upload to Vercel Blob
        const timestamp = Date.now();
        const blobPath = `portraits/${session.id}_${petName.replace(
          /\s+/g,
          "_"
        )}_${i + 1}_${timestamp}.png`;

        const blob = await put(blobPath, generatedImageBuffer, {
          access: "public",
          contentType: "image/png",
        });

        portraitUrls.push(blob.url);
        console.log(`Portrait ${i + 1} uploaded: ${blob.url}`);
      }

      // Step 3: Create customer and get referral code
      const customer = await getOrCreateCustomer(customerEmail, customerName);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

      // Step 4: Build email HTML with download links and referral program
      const emailHtml = generateOrderCompleteEmailWithReferral({
        customerName,
        petName,
        style,
        portraitUrls,
        portraitCount,
        referralCode: customer.referralCode,
        baseUrl,
      });

      // Step 5: Send email via Resend
      console.log(`Sending email to: ${customerEmail}`);
      await resend.emails.send({
        from: "portraits@pawcasso-atelier.com",
        to: customerEmail,
        subject: "Your Pawcasso Portrait is Ready! 🎨",
        html: emailHtml,
      });

      // Step 6: Update Stripe session metadata
      console.log("Updating Stripe session metadata...");
      await stripe.checkout.sessions.update(session.id, {
        metadata: {
          ...metadata,
          delivery_status: "completed",
          delivered_at: new Date().toISOString(),
          portrait_urls: portraitUrls.join(","),
        },
      });

      // Step 7: Process referral conversion (if applicable)
      const referralCode = metadata.referralCode;
      const amountTotal = session.amount_total ? session.amount_total / 100 : 0;

      if (referralCode) {
        try {
          console.log(`Processing referral conversion for code: ${referralCode}`);
          const referral = await processReferralConversion(
            referralCode,
            customerEmail,
            session.id,
            amountTotal
          );

          if (referral) {
            console.log(`Referral conversion processed. Referrer earned $5 credit.`);

            // Get customer record to include referral link in referrer notification
            const referrerCustomer = await getOrCreateCustomer(referral.referrerEmail);

            // Send notification email to referrer about the credit
            try {
              await resend.emails.send({
                from: "portraits@pawcasso-atelier.com",
                to: referral.referrerEmail,
                subject: "🎉 You earned $5 credit from your referral!",
                html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #000; color: #F5F5F7; padding: 40px; margin: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #111; border-radius: 16px; padding: 40px; border: 1px solid #1d1d1f; }
    h1 { color: #C9A96E; margin-bottom: 20px; font-size: 28px; }
    .credit-box { background: #51cf66; color: #000; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0; }
    .credit-amount { font-size: 48px; font-weight: 700; }
    p { line-height: 1.6; margin: 15px 0; }
    .btn { display: inline-block; background: #C9A96E; color: #000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>You Earned a Referral Bonus! 🎉</h1>
    <div class="credit-box">
      <div class="credit-amount">$5.00</div>
      <div>Added to your account</div>
    </div>
    <p>Great news! Someone just purchased a portrait using your referral link.</p>
    <p>Your $5 credit has been automatically added to your account and can be used on your next order.</p>
    <p style="margin-top: 30px;"><a href="${baseUrl}/portal" class="btn">View Referral Dashboard</a></p>
    <p>Keep sharing your link to earn more credits and unlock milestone rewards!</p>
    <p style="margin-top: 30px; color: #86868b; font-size: 14px;">Current balance: $${referrerCustomer.creditBalance.toFixed(2)}</p>
  </div>
</body>
</html>
                `,
              });
            } catch (emailError) {
              console.error("Failed to send referral credit notification:", emailError);
            }
          }
        } catch (referralError) {
          console.error("Failed to process referral conversion:", referralError);
          // Don't fail the order if referral tracking fails
        }
      }

      // Step 8: Update order with portrait URLs
      try {
        await prisma.order.update({
          where: { stripeSessionId: session.id },
          data: {
            portraitUrls: portraitUrls.join(','),
            deliveryStatus: 'completed',
            deliveredAt: new Date(),
          },
        });
      } catch (dbError) {
        console.error('Failed to update order in database:', dbError);
      }

      // Step 9: Track influencer conversion (if applicable)
      const utmSource = metadata.utmSource;
      const utmMedium = metadata.utmMedium;
      const utmCampaign = metadata.utmCampaign;
      const discountCode = metadata.discountCode;

      if (utmMedium === "influencer" || (discountCode && discountCode.endsWith("20"))) {
        try {
          console.log("Tracking influencer conversion...");
          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/track-conversion`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: session.id,
              revenue: amountTotal,
              utmSource,
              utmMedium,
              utmCampaign,
              discountCode,
            }),
          });
        } catch (conversionError) {
          console.error("Failed to track influencer conversion:", conversionError);
          // Don't fail the order if conversion tracking fails
        }
      }

      console.log(`Successfully processed order for session: ${session.id}`);

      return NextResponse.json({
        success: true,
        portraits_generated: portraitCount,
        session_id: session.id,
      });
    } catch (error) {
      console.error("Error processing portrait generation:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      // Send failure notification to admin
      await sendFailureNotification(session.id, customerEmail, errorMessage);

      return NextResponse.json(
        { error: "Portrait generation failed", details: errorMessage },
        { status: 500 }
      );
    }
  }

  // Handle charge.refunded event
  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;

    try {
      const order = await prisma.order.findFirst({
        where: { stripePaymentIntentId: charge.payment_intent as string },
      });

      if (order) {
        const refundAmount = charge.amount_refunded / 100;
        await prisma.order.update({
          where: { id: order.id },
          data: {
            refunded: true,
            refundAmount,
            refundedAt: new Date(),
            status: charge.amount_refunded === charge.amount ? 'refunded' : 'completed',
          },
        });
        console.log(`Refund processed for order ${order.id}: $${refundAmount}`);
      }
    } catch (dbError) {
      console.error('Failed to update refund in database:', dbError);
    }
  }

  // Return 200 for other event types
  return NextResponse.json({ received: true });
}

// Note: Body parsing is handled by Next.js App Router automatically
// No need for config export in App Router
