import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { put } from "@vercel/blob";
import { Resend } from "resend";
import { getOrCreateCustomer } from "@/lib/referral";
import { generateOrderCompleteEmailWithReferral } from "@/lib/email-templates/order-complete-with-referral";

const prisma = new PrismaClient();

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
const RETRY_DELAYS = [10000, 30000, 90000];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

    const maxPollTime = 5 * 60 * 1000;
    const pollInterval = 10000;
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
    if (retryCount < MAX_RETRIES) {
      console.log(`Manus generation failed, retrying (${retryCount + 1}/${MAX_RETRIES})...`);
      await sleep(RETRY_DELAYS[retryCount]);
      return generatePortrait(petPhotoBuffer, petName, style, retryCount + 1);
    }
    throw error;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/order?error=missing_order_id`);
  }

  try {
    const order = await prisma.order.findUnique({
      where: { stripeSessionId: orderId },
    });

    if (!order) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/order?error=order_not_found`);
    }

    if (order.deliveryStatus === 'completed') {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/order/success?session_id=${orderId}`);
    }

    const resend = getResend();
    const petPhotoUrl = order.petPhotoUrl;

    if (!petPhotoUrl) {
      throw new Error("Missing pet photo URL");
    }

    // Download pet photo
    const petPhotoBuffer = await downloadFile(petPhotoUrl);

    // Generate portraits
    const portraitCount = TIER_PORTRAIT_COUNT[order.tier] || 1;
    const portraitUrls: string[] = [];

    for (let i = 0; i < portraitCount; i++) {
      const outputUrl = await generatePortrait(
        petPhotoBuffer,
        order.petName,
        order.style
      );

      const generatedImageResponse = await fetch(outputUrl);
      const generatedImageBuffer = Buffer.from(
        await generatedImageResponse.arrayBuffer()
      );

      const timestamp = Date.now();
      const blobPath = `portraits/${orderId}_${order.petName.replace(
        /\s+/g,
        "_"
      )}_${i + 1}_${timestamp}.png`;

      const blob = await put(blobPath, generatedImageBuffer, {
        access: "public",
        contentType: "image/png",
      });

      portraitUrls.push(blob.url);
    }

    // Get customer referral code
    const customer = await getOrCreateCustomer(order.customerEmail, order.customerName);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Send email
    const emailHtml = generateOrderCompleteEmailWithReferral({
      customerName: order.customerName,
      petName: order.petName,
      style: order.style,
      portraitUrls,
      portraitCount,
      referralCode: customer.referralCode,
      baseUrl,
    });

    await resend.emails.send({
      from: "portraits@pawcasso-atelier.com",
      to: order.customerEmail,
      subject: "Your Pawcasso Portrait is Ready! 🎨",
      html: emailHtml,
    });

    // Update order
    await prisma.order.update({
      where: { stripeSessionId: orderId },
      data: {
        portraitUrls: portraitUrls.join(','),
        deliveryStatus: 'completed',
        deliveredAt: new Date(),
      },
    });

    // Redirect to success page
    return NextResponse.redirect(`${baseUrl}/order/success?session_id=${orderId}`);
  } catch (error) {
    console.error("Gift card order processing error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/order?error=processing_failed`
    );
  }
}
