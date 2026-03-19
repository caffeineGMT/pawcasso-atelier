/**
 * Stripe webhook utilities - Shared functions for webhook processing
 */

import { PrismaClient } from "@prisma/client";
import { type DeliveryStep, POLL_INTERVALS, TIER_POLL_TIMEOUT, MAX_RETRIES, RETRY_DELAYS } from "./webhook-config";

const prisma = new PrismaClient();

/**
 * Sleep utility
 */
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Update order delivery status
 */
export async function updateDeliveryStatus(stripeSessionId: string, status: DeliveryStep): Promise<void> {
  try {
    await prisma.order.update({
      where: { stripeSessionId },
      data: { deliveryStatus: status },
    });
  } catch (err) {
    console.error(`Failed to update delivery status to ${status}:`, err);
  }
}

/**
 * Log fulfillment error to database
 */
export async function logFulfillmentError(params: {
  stripeSessionId: string;
  customerEmail: string;
  errorType: string;
  errorMessage: string;
  stackTrace?: string;
  step: string;
  metadata?: Record<string, unknown>;
  retryCount?: number;
}): Promise<void> {
  try {
    const order = await prisma.order.findUnique({
      where: { stripeSessionId: params.stripeSessionId },
    });

    await prisma.fulfillmentErrorLog.create({
      data: {
        orderId: order?.id || null,
        stripeSessionId: params.stripeSessionId,
        customerEmail: params.customerEmail,
        errorType: params.errorType,
        errorMessage: params.errorMessage,
        stackTrace: params.stackTrace || null,
        step: params.step,
        metadata: params.metadata ? JSON.stringify(params.metadata) : null,
        retryCount: params.retryCount || 0,
      },
    });
  } catch (err) {
    console.error('Failed to log fulfillment error:', err);
  }
}

/**
 * Download file from URL
 */
export async function downloadFile(url: string): Promise<Buffer> {
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

/**
 * Generate portrait via Manus API with retry logic
 */
export async function generatePortrait(
  petPhotoBuffer: Buffer,
  petName: string,
  style: string,
  tier: string = 'basic',
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

    // Poll with exponential backoff - timeout scales with tier
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

      console.log(`Poll attempt ${pollAttempt} for task ${task_id}: ${statusData.status} (next in ${interval / 1000}s)`);
    }

    throw new Error(`Manus generation timed out after ${maxPollTime / 60000} minutes (tier: ${tier})`);
  } catch (error) {
    // Retry logic with exponential backoff
    if (retryCount < MAX_RETRIES) {
      console.warn(`Portrait generation attempt ${retryCount + 1} failed, retrying...`, error);
      await sleep(RETRY_DELAYS[retryCount]);
      return generatePortrait(petPhotoBuffer, petName, style, tier, retryCount + 1);
    }

    throw error;
  }
}

/**
 * Upload image to Vercel Blob
 */
export async function uploadImageToBlob(
  imageBuffer: Buffer,
  filename: string
): Promise<string> {
  const { put } = await import("@vercel/blob");

  const blob = await put(filename, imageBuffer, {
    access: "public",
    contentType: "image/png",
  });

  return blob.url;
}
