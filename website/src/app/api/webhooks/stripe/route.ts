import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { put } from "@vercel/blob";
import { Resend } from "resend";
import { processReferralConversion, getOrCreateCustomer } from "@/lib/referral";
import { generateOrderCompleteEmailWithReferral } from "@/lib/email-templates/order-complete-with-referral";

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
    const petPhotoUrl = metadata.petPhotoUrl;
    const tier = metadata.tier || "basic";
    const customerEmail = session.customer_email!;
    const customerName = metadata.customerName || "Customer";
    const petName = metadata.petName || "your pet";
    const style = metadata.style || "renaissance";

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

      // Step 8: Track influencer conversion (if applicable)
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

  // Return 200 for other event types
  return NextResponse.json({ received: true });
}

// Disable body parsing for webhook signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};
