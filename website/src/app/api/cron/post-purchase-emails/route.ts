import { NextRequest, NextResponse } from "next/server";
import {
  sendReviewRequestEmail,
  sendReorderIncentiveEmail,
  getOrdersNeedingScheduledEmails,
} from "@/lib/post-purchase-emails";

/**
 * Vercel Cron Job: Process Post-Purchase Drip Emails
 *
 * This endpoint is triggered by Vercel Cron to send:
 * - 7-day review request emails
 * - 30-day reorder incentive emails
 *
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/post-purchase-emails",
 *     "schedule": "0 10 * * *"
 *   }]
 * }
 */
export async function GET(req: NextRequest) {
  console.log("🚀 Starting post-purchase email cron job...");
  console.log(`⏰ Run time: ${new Date().toISOString()}`);

  try {
    // Verify this is a Vercel Cron request (optional security check)
    const authHeader = req.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    console.log("\n✅ Cron job completed successfully!");
    console.log(`   Review requests sent: ${results.reviewRequestsSent}`);
    console.log(`   Reorder incentives sent: ${results.reorderIncentivesSent}`);
    console.log(`   Errors: ${results.errors.length}`);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results: {
        reviewRequestsSent: results.reviewRequestsSent,
        reorderIncentivesSent: results.reorderIncentivesSent,
        errors: results.errors.length,
      },
      details: results,
    });
  } catch (error: any) {
    console.error("❌ Cron job failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Cron job failed",
        details: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
