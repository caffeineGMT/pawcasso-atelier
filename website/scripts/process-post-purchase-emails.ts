#!/usr/bin/env tsx

/**
 * Scheduled Job: Process Post-Purchase Drip Emails
 *
 * This script should be run daily via cron to send:
 * - 7-day review request emails
 * - 30-day reorder incentive emails
 *
 * Add to crontab:
 * 0 10 * * * cd /path/to/website && tsx scripts/process-post-purchase-emails.ts
 *
 * Or use Vercel Cron:
 * Add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/post-purchase-emails",
 *     "schedule": "0 10 * * *"
 *   }]
 * }
 */

import { PrismaClient } from "@prisma/client";
import {
  sendReviewRequestEmail,
  sendReorderIncentiveEmail,
  getOrdersNeedingScheduledEmails,
} from "../src/lib/post-purchase-emails";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting post-purchase email job...");
  console.log(`⏰ Run time: ${new Date().toISOString()}`);

  try {
    // Get orders needing scheduled emails
    const pendingOrders = await getOrdersNeedingScheduledEmails();

    console.log(
      `📧 Found ${pendingOrders.reviewRequests.length} orders needing review request emails`
    );
    console.log(
      `📧 Found ${pendingOrders.reorderIncentives.length} orders needing reorder incentive emails`
    );

    const results = {
      reviewRequestsSent: 0,
      reorderIncentivesSent: 0,
      errors: [] as any[],
    };

    // Send 7-day review request emails
    for (const order of pendingOrders.reviewRequests) {
      try {
        console.log(`  → Sending review request to ${order.customerEmail} (${order.petName})`);
        await sendReviewRequestEmail(order.id);
        results.reviewRequestsSent++;
      } catch (error: any) {
        console.error(
          `  ❌ Failed to send review request for order ${order.id}:`,
          error.message
        );
        results.errors.push({
          orderId: order.id,
          type: "review-request",
          error: error.message,
        });
      }
    }

    // Send 30-day reorder incentive emails
    for (const order of pendingOrders.reorderIncentives) {
      try {
        console.log(
          `  → Sending reorder incentive to ${order.customerEmail} (${order.petName})`
        );
        await sendReorderIncentiveEmail(order.id);
        results.reorderIncentivesSent++;
      } catch (error: any) {
        console.error(
          `  ❌ Failed to send reorder incentive for order ${order.id}:`,
          error.message
        );
        results.errors.push({
          orderId: order.id,
          type: "reorder-incentive",
          error: error.message,
        });
      }
    }

    // Summary
    console.log("\n✅ Job completed successfully!");
    console.log(`   Review requests sent: ${results.reviewRequestsSent}`);
    console.log(`   Reorder incentives sent: ${results.reorderIncentivesSent}`);
    console.log(`   Errors: ${results.errors.length}`);

    if (results.errors.length > 0) {
      console.log("\n❌ Errors encountered:");
      results.errors.forEach((err) => {
        console.log(`   - Order ${err.orderId} (${err.type}): ${err.error}`);
      });
    }

    return results;
  } catch (error) {
    console.error("❌ Job failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the job
main()
  .then((results) => {
    console.log("\n🎉 Post-purchase email job finished");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Post-purchase email job failed:", error);
    process.exit(1);
  });
