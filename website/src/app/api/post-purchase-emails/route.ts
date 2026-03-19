import { NextRequest, NextResponse } from "next/server";
import {
  sendOrderConfirmationEmail,
  sendShippingNotificationEmail,
  sendDeliveryConfirmationEmail,
  sendReviewRequestEmail,
  sendReorderIncentiveEmail,
  sendAllPendingEmails,
  getOrdersNeedingScheduledEmails,
} from "@/lib/post-purchase-emails";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * POST /api/post-purchase-emails
 *
 * Manual trigger for post-purchase drip campaign emails
 *
 * Body:
 * - action: "send" | "process-scheduled" | "test"
 * - emailType?: "order-confirmation" | "shipping" | "delivery" | "review-request" | "reorder-incentive" | "all"
 * - orderId?: string (required for "send" action)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, emailType, orderId } = body;

    // ACTION: Send specific email for an order
    if (action === "send") {
      if (!orderId) {
        return NextResponse.json({ error: "orderId is required" }, { status: 400 });
      }

      if (!emailType) {
        return NextResponse.json({ error: "emailType is required" }, { status: 400 });
      }

      let result;

      switch (emailType) {
        case "order-confirmation":
          result = await sendOrderConfirmationEmail(orderId);
          break;
        case "shipping":
          result = await sendShippingNotificationEmail(orderId);
          break;
        case "delivery":
          result = await sendDeliveryConfirmationEmail(orderId);
          break;
        case "review-request":
          result = await sendReviewRequestEmail(orderId);
          break;
        case "reorder-incentive":
          result = await sendReorderIncentiveEmail(orderId);
          break;
        case "all":
          result = await sendAllPendingEmails(orderId);
          break;
        default:
          return NextResponse.json(
            { error: `Invalid emailType: ${emailType}` },
            { status: 400 }
          );
      }

      return NextResponse.json({
        success: true,
        action: "send",
        emailType,
        orderId,
        result,
      });
    }

    // ACTION: Process scheduled emails (7-day review, 30-day reorder)
    if (action === "process-scheduled") {
      const pendingOrders = await getOrdersNeedingScheduledEmails();

      const results = {
        reviewRequestsSent: [] as string[],
        reorderIncentivesSent: [] as string[],
        errors: [] as any[],
      };

      // Send 7-day review request emails
      for (const order of pendingOrders.reviewRequests) {
        try {
          await sendReviewRequestEmail(order.id);
          results.reviewRequestsSent.push(order.id);
        } catch (error: any) {
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
          await sendReorderIncentiveEmail(order.id);
          results.reorderIncentivesSent.push(order.id);
        } catch (error: any) {
          results.errors.push({
            orderId: order.id,
            type: "reorder-incentive",
            error: error.message,
          });
        }
      }

      return NextResponse.json({
        success: true,
        action: "process-scheduled",
        results: {
          reviewRequestsSent: results.reviewRequestsSent.length,
          reorderIncentivesSent: results.reorderIncentivesSent.length,
          errors: results.errors.length,
        },
        details: results,
      });
    }

    // ACTION: Test email rendering (no actual send)
    if (action === "test") {
      // Return sample data for testing
      return NextResponse.json({
        success: true,
        action: "test",
        message: "Email templates are ready. Use 'send' action to send real emails.",
        availableEmailTypes: [
          "order-confirmation",
          "shipping",
          "delivery",
          "review-request",
          "reorder-incentive",
          "all",
        ],
      });
    }

    return NextResponse.json(
      { error: `Invalid action: ${action}. Use 'send', 'process-scheduled', or 'test'.` },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Error in post-purchase-emails API:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/post-purchase-emails
 *
 * Get status of post-purchase emails for an order or get orders needing scheduled emails
 *
 * Query params:
 * - orderId?: string - Get email status for specific order
 * - action?: "pending" - Get orders needing scheduled emails
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const action = searchParams.get("action");

    // Get orders needing scheduled emails
    if (action === "pending") {
      const pendingOrders = await getOrdersNeedingScheduledEmails();

      return NextResponse.json({
        success: true,
        reviewRequestsPending: pendingOrders.reviewRequests.length,
        reorderIncentivesPending: pendingOrders.reorderIncentives.length,
        reviewRequests: pendingOrders.reviewRequests.map((o) => ({
          id: o.id,
          customerEmail: o.customerEmail,
          petName: o.petName,
          deliveredAt: o.deliveredAt,
        })),
        reorderIncentives: pendingOrders.reorderIncentives.map((o) => ({
          id: o.id,
          customerEmail: o.customerEmail,
          petName: o.petName,
          deliveredAt: o.deliveredAt,
        })),
      });
    }

    // Get email status for specific order
    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: {
          id: true,
          customerEmail: true,
          petName: true,
          deliveredAt: true,
          orderConfirmationEmailSentAt: true,
          shippingNotificationEmailSentAt: true,
          deliveryConfirmationEmailSentAt: true,
          reviewRequestEmailSentAt: true,
          reorderIncentiveEmailSentAt: true,
        },
      });

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        order: {
          id: order.id,
          customerEmail: order.customerEmail,
          petName: order.petName,
          deliveredAt: order.deliveredAt,
        },
        emailStatus: {
          orderConfirmation: {
            sent: !!order.orderConfirmationEmailSentAt,
            sentAt: order.orderConfirmationEmailSentAt,
          },
          shippingNotification: {
            sent: !!order.shippingNotificationEmailSentAt,
            sentAt: order.shippingNotificationEmailSentAt,
          },
          deliveryConfirmation: {
            sent: !!order.deliveryConfirmationEmailSentAt,
            sentAt: order.deliveryConfirmationEmailSentAt,
          },
          reviewRequest: {
            sent: !!order.reviewRequestEmailSentAt,
            sentAt: order.reviewRequestEmailSentAt,
            eligible:
              !!order.deliveredAt &&
              Date.now() - order.deliveredAt.getTime() >= 7 * 24 * 60 * 60 * 1000,
          },
          reorderIncentive: {
            sent: !!order.reorderIncentiveEmailSentAt,
            sentAt: order.reorderIncentiveEmailSentAt,
            eligible:
              !!order.deliveredAt &&
              Date.now() - order.deliveredAt.getTime() >= 30 * 24 * 60 * 60 * 1000,
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Post-purchase email automation API",
      endpoints: {
        "POST /api/post-purchase-emails": {
          description: "Send emails or process scheduled emails",
          actions: {
            send: "Send specific email type for an order",
            "process-scheduled":
              "Process all pending 7-day and 30-day scheduled emails",
            test: "Test email templates",
          },
        },
        "GET /api/post-purchase-emails": {
          description: "Get email status or pending emails",
          params: {
            orderId: "Get email status for specific order",
            "action=pending": "Get orders needing scheduled emails",
          },
        },
      },
    });
  } catch (error: any) {
    console.error("Error in post-purchase-emails GET API:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
