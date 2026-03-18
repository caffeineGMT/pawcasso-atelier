import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { put } from "@vercel/blob";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

const resend = new Resend(process.env.RESEND_API_KEY!);

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

      // Step 3: Build email HTML with download links
      const portraitLinksHtml = portraitUrls
        .map(
          (url, index) =>
            `<a href="${url}" style="display: inline-block; background: #C9A96E; color: #000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 10px 5px;">Download Portrait ${
              index + 1
            }</a>`
        )
        .join("\n");

      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #000;
      color: #F5F5F7;
      padding: 40px;
      margin: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #111;
      border-radius: 16px;
      padding: 40px;
      border: 1px solid #1d1d1f;
    }
    h1 {
      color: #C9A96E;
      margin-bottom: 20px;
      font-size: 28px;
    }
    .portrait {
      margin: 30px 0;
      text-align: center;
    }
    .download-btn {
      display: inline-block;
      background: #C9A96E;
      color: #000;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      margin: 10px 5px;
    }
    .download-btn:hover {
      background: #E8D5A8;
    }
    p {
      line-height: 1.6;
      margin: 15px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Your Pawcasso Portrait is Ready! 🎨</h1>
    <p>Hi ${customerName},</p>
    <p>We're thrilled to deliver ${petName}'s stunning AI-generated portrait${
        portraitCount > 1 ? "s" : ""
      } in the <strong>${style}</strong> style!</p>
    <div class="portrait">
      <h3 style="color: #C9A96E; margin-bottom: 20px;">Download Your Portrait${
        portraitCount > 1 ? "s" : ""
      }:</h3>
      ${portraitLinksHtml}
    </div>
    <p>These high-resolution files are ready for printing or sharing on social media.</p>
    <p><strong>Pro tip:</strong> Tag us <a href="https://instagram.com/pawcasso.atelier" style="color: #C9A96E;">@pawcasso.atelier</a> on Instagram and get featured in our gallery!</p>
    <p style="margin-top: 30px;">With love,<br/><strong>The Pawcasso Atelier Team</strong></p>
  </div>
</body>
</html>
      `;

      // Step 4: Send email via Resend
      console.log(`Sending email to: ${customerEmail}`);
      await resend.emails.send({
        from: "portraits@pawcasso-atelier.com",
        to: customerEmail,
        subject: "Your Pawcasso Portrait is Ready! 🎨",
        html: emailHtml,
      });

      // Step 5: Update Stripe session metadata
      console.log("Updating Stripe session metadata...");
      await stripe.checkout.sessions.update(session.id, {
        metadata: {
          ...metadata,
          delivery_status: "completed",
          delivered_at: new Date().toISOString(),
          portrait_urls: portraitUrls.join(","),
        },
      });

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
