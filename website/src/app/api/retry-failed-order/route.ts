import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { put } from "@vercel/blob";
import { Resend } from "resend";
import { processReferralConversion, getOrCreateCustomer } from "@/lib/referral";
import { generateOrderCompleteEmailWithReferral } from "@/lib/email-templates/order-complete-with-referral";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getStripeInstance() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || "placeholder", {
    apiVersion: "2026-02-25.clover",
  });
}

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || "placeholder");
}

const TIER_PORTRAIT_COUNT: Record<string, number> = {
  basic: 1,
  premium: 3,
  deluxe: 5,
  bundle: 5,
};

const TIER_POLL_TIMEOUT: Record<string, number> = {
  basic: 5 * 60 * 1000,
  premium: 8 * 60 * 1000,
  deluxe: 10 * 60 * 1000,
  bundle: 10 * 60 * 1000,
};

const POLL_INTERVALS = [5000, 10000, 15000, 20000, 30000];
const MAX_RETRIES = 3;
const RETRY_DELAYS = [10000, 30000, 90000];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type DeliveryStep = 'pending' | 'downloading_photo' | 'generating' | 'uploading' | 'sending_email' | 'completed' | 'failed';

async function updateDeliveryStatus(stripeSessionId: string, status: DeliveryStep) {
  try {
    await prisma.order.update({
      where: { stripeSessionId },
      data: { deliveryStatus: status },
    });
  } catch (err) {
    console.error(`Failed to update delivery status to ${status}:`, err);
  }
}

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

async function generatePortrait(
  petPhotoBuffer: Buffer,
  petName: string,
  style: string,
  tier: string = 'basic',
  retryCount = 0
): Promise<string> {
  try {
    const base64Image = petPhotoBuffer.toString("base64");

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

    const maxPollTime = TIER_POLL_TIMEOUT[tier] || TIER_POLL_TIMEOUT.basic;
    const startTime = Date.now();
    let pollAttempt = 0;

    while (Date.now() - startTime < maxPollTime) {
      const interval = POLL_INTERVALS[Math.min(pollAttempt, POLL_INTERVALS.length - 1)];
      await sleep(interval);
      pollAttempt++;

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
    }

    throw new Error(`Manus generation timed out after ${maxPollTime / 60000} minutes (tier: ${tier})`);
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.log(`Manus generation failed, retrying (${retryCount + 1}/${MAX_RETRIES})...`);
      await sleep(RETRY_DELAYS[retryCount]);
      return generatePortrait(petPhotoBuffer, petName, style, tier, retryCount + 1);
    }
    throw error;
  }
}

export async function POST(req: NextRequest) {
  // Authenticate: require admin API key
  const authHeader = req.headers.get("authorization");
  const adminKey = process.env.ADMIN_API_KEY;

  if (!adminKey || !authHeader || authHeader !== `Bearer ${adminKey}`) {
    return NextResponse.json(
      { error: "Unauthorized. Provide valid Authorization: Bearer <ADMIN_API_KEY>" },
      { status: 401 }
    );
  }

  let body: { sessionId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body. Expected: { sessionId: string }" },
      { status: 400 }
    );
  }

  const { sessionId } = body;

  if (!sessionId) {
    return NextResponse.json(
      { error: "Missing required field: sessionId" },
      { status: 400 }
    );
  }

  const stripe = getStripeInstance();
  const resend = getResend();

  // Fetch session from Stripe
  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to retrieve Stripe session: ${msg}` },
      { status: 404 }
    );
  }

  if (session.payment_status !== "paid") {
    return NextResponse.json(
      { error: "Session is not paid. Cannot retry unfulfilled payment." },
      { status: 400 }
    );
  }

  const metadata = session.metadata || {};
  const petPhotoUrl = metadata.petPhotoUrl;
  const tier = metadata.tier || "basic";
  const customerEmail = session.customer_email!;
  const customerName = metadata.customerName || "Customer";
  const petName = metadata.petName || "your pet";
  const style = metadata.style || "renaissance";

  // Check if already completed
  const existingOrder = await prisma.order.findUnique({
    where: { stripeSessionId: sessionId },
  });

  if (existingOrder?.deliveryStatus === 'completed') {
    return NextResponse.json({
      success: true,
      skipped: true,
      reason: 'already_completed',
      session_id: sessionId,
      portrait_urls: existingOrder.portraitUrls,
    });
  }

  if (!petPhotoUrl) {
    return NextResponse.json(
      { error: "Missing pet photo URL in session metadata. Manual intervention required." },
      { status: 400 }
    );
  }

  let currentStep: DeliveryStep = 'downloading_photo';

  try {
    // Ensure order record exists
    await prisma.order.upsert({
      where: { stripeSessionId: sessionId },
      update: { deliveryStatus: 'pending' },
      create: {
        stripeSessionId: sessionId,
        stripePaymentIntentId: typeof session.payment_intent === 'string'
          ? session.payment_intent
          : null,
        customerEmail,
        customerName,
        tier,
        tierName: metadata.tierName || tier,
        amount: (session.amount_total || 0) / 100,
        subtotal: ((session.amount_total || 0) + (session.total_details?.amount_discount || 0)) / 100,
        discount: (session.total_details?.amount_discount || 0) / 100,
        tax: (session.total_details?.amount_tax || 0) / 100,
        petName,
        style,
        notes: metadata.notes || '',
        petPhotoUrl: metadata.petPhotoUrl || '',
        portraitUrls: '',
        portraitCount: TIER_PORTRAIT_COUNT[tier] || 1,
        utmSource: metadata.utmSource || null,
        utmMedium: metadata.utmMedium || null,
        utmCampaign: metadata.utmCampaign || null,
        referralCode: metadata.referralCode || null,
        discountCode: metadata.discountCode || null,
        pricingBadge: metadata.badge || null,
        giftCardCode: metadata.giftCardCode || null,
        giftCardAmount: 0,
        status: 'completed',
        deliveryStatus: 'pending',
        paidAt: new Date(),
      },
    });

    // Step 1: Download pet photo
    currentStep = 'downloading_photo';
    await updateDeliveryStatus(sessionId, currentStep);
    console.log(`[RETRY] Downloading pet photo from: ${petPhotoUrl}`);
    const petPhotoBuffer = await downloadFile(petPhotoUrl);

    // Step 2: Generate portraits
    currentStep = 'generating';
    await updateDeliveryStatus(sessionId, currentStep);
    const portraitCount = TIER_PORTRAIT_COUNT[tier] || 1;
    console.log(`[RETRY] Generating ${portraitCount} portrait(s) for tier: ${tier}`);

    const portraitUrls: string[] = [];

    for (let i = 0; i < portraitCount; i++) {
      console.log(`[RETRY] Generating portrait ${i + 1}/${portraitCount}...`);

      const outputUrl = await generatePortrait(petPhotoBuffer, petName, style, tier);

      // Step 3: Upload
      currentStep = 'uploading';
      await updateDeliveryStatus(sessionId, currentStep);

      const generatedImageResponse = await fetch(outputUrl);
      const generatedImageBuffer = Buffer.from(
        await generatedImageResponse.arrayBuffer()
      );

      const timestamp = Date.now();
      const blobPath = `portraits/${sessionId}_${petName.replace(/\s+/g, "_")}_${i + 1}_${timestamp}.png`;

      const blob = await put(blobPath, generatedImageBuffer, {
        access: "public",
        contentType: "image/png",
      });

      portraitUrls.push(blob.url);
      console.log(`[RETRY] Portrait ${i + 1} uploaded: ${blob.url}`);

      if (i < portraitCount - 1) {
        currentStep = 'generating';
        await updateDeliveryStatus(sessionId, currentStep);
      }
    }

    // Step 4: Send delivery email
    currentStep = 'sending_email';
    await updateDeliveryStatus(sessionId, currentStep);

    const customer = await getOrCreateCustomer(customerEmail, customerName);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const emailHtml = generateOrderCompleteEmailWithReferral({
      customerName,
      petName,
      style,
      portraitUrls,
      portraitCount,
      referralCode: customer.referralCode,
      baseUrl,
    });

    console.log(`[RETRY] Sending email to: ${customerEmail}`);
    await resend.emails.send({
      from: "portraits@pawcasso-atelier.com",
      to: customerEmail,
      subject: "Your Pawcasso Portrait is Ready! 🎨",
      html: emailHtml,
    });

    // Step 5: Mark completed
    await prisma.order.update({
      where: { stripeSessionId: sessionId },
      data: {
        portraitUrls: portraitUrls.join(','),
        deliveryStatus: 'completed',
        deliveredAt: new Date(),
      },
    });

    // Update Stripe metadata
    await stripe.checkout.sessions.update(sessionId, {
      metadata: {
        ...metadata,
        delivery_status: "completed",
        delivered_at: new Date().toISOString(),
        portrait_urls: portraitUrls.join(","),
        retried: "true",
      },
    });

    // Mark any existing error logs as resolved
    await prisma.fulfillmentErrorLog.updateMany({
      where: { stripeSessionId: sessionId, resolved: false },
      data: { resolved: true, resolvedAt: new Date(), resolvedBy: 'manual_retry' },
    });

    // Process referral if applicable
    const referralCode = metadata.referralCode;
    if (referralCode) {
      try {
        const amountTotal = session.amount_total ? session.amount_total / 100 : 0;
        await processReferralConversion(referralCode, customerEmail, sessionId, amountTotal);
      } catch (referralError) {
        console.error("[RETRY] Failed to process referral:", referralError);
      }
    }

    console.log(`[RETRY] Successfully retried order for session: ${sessionId}`);

    // Send success notification to admin
    try {
      await resend.emails.send({
        from: "alerts@pawcasso-atelier.com",
        to: "michaelguo@meta.com",
        subject: `[RESOLVED] Order Retry Successful - ${sessionId}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; background: #111; color: #F5F5F7; border-radius: 12px;">
            <h2 style="color: #51cf66;">Order Retry Successful</h2>
            <p><strong>Session ID:</strong> ${sessionId}</p>
            <p><strong>Customer:</strong> ${customerEmail}</p>
            <p><strong>Portraits Generated:</strong> ${portraitCount}</p>
            <p style="color: #86868b;">Email delivered and order marked as completed.</p>
          </div>
        `,
      });
    } catch {
      // Non-critical
    }

    return NextResponse.json({
      success: true,
      retried: true,
      portraits_generated: portraitCount,
      portrait_urls: portraitUrls,
      session_id: sessionId,
    });
  } catch (error) {
    console.error("[RETRY] Error retrying portrait generation:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const stackTrace = error instanceof Error ? error.stack : undefined;

    let errorType = 'unknown';
    if (errorMessage.includes('download')) errorType = 'download_failed';
    else if (errorMessage.includes('Manus') || errorMessage.includes('generation')) errorType = 'generation_failed';
    else if (errorMessage.includes('upload') || errorMessage.includes('Blob')) errorType = 'upload_failed';
    else if (errorMessage.includes('email') || errorMessage.includes('Resend')) errorType = 'email_failed';
    else if (errorMessage.includes('timed out')) errorType = 'timeout';

    await updateDeliveryStatus(sessionId, 'failed');

    // Log the retry failure
    await prisma.fulfillmentErrorLog.create({
      data: {
        stripeSessionId: sessionId,
        customerEmail,
        errorType,
        errorMessage,
        stackTrace: stackTrace || null,
        step: currentStep,
        metadata: JSON.stringify({ tier, petName, style, retried: true }),
        retryCount: 1,
      },
    }).catch(err => console.error('Failed to log retry error:', err));

    return NextResponse.json(
      { error: "Retry failed", details: errorMessage, step: currentStep },
      { status: 500 }
    );
  }
}
