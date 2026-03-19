import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { PrismaClient } from "@prisma/client";
import { generatePostDeliveryReviewEmail } from "@/lib/email-templates/post-delivery-review-request-html";

const prisma = new PrismaClient();

// GET /api/cron/review-emails
// Sends review request emails to customers 7 days after delivery.
// Runs daily via Vercel cron.
export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://pawcasso-atelier.vercel.app";

    // Find orders delivered ~7 days ago (6.5 to 7.5 day window)
    const now = new Date();
    const sixAndHalfDaysAgo = new Date(
      now.getTime() - 6.5 * 24 * 60 * 60 * 1000
    );
    const sevenAndHalfDaysAgo = new Date(
      now.getTime() - 7.5 * 24 * 60 * 60 * 1000
    );

    const eligibleOrders = await prisma.order.findMany({
      where: {
        status: "completed",
        deliveryStatus: "completed",
        deliveredAt: {
          gte: sevenAndHalfDaysAgo,
          lte: sixAndHalfDaysAgo,
        },
        // Only send to orders that haven't received a review email
        reviewRequestEmailSentAt: null,
        // Don't send to refunded orders
        refunded: false,
      },
      orderBy: { deliveredAt: "desc" },
    });

    let sent = 0;
    let errors = 0;
    const results: Array<{ email: string; status: string }> = [];

    for (const order of eligibleOrders) {
      try {
        // Check if the customer already left a review for this order
        const existingReview = await prisma.customerReview.findFirst({
          where: { customerEmail: order.customerEmail },
        });

        if (existingReview) {
          // Mark as sent so we don't retry, but skip the email
          await prisma.order.update({
            where: { id: order.id },
            data: { reviewRequestEmailSentAt: now },
          });
          results.push({
            email: order.customerEmail,
            status: "skipped_already_reviewed",
          });
          continue;
        }

        const firstName =
          order.customerName.split(" ")[0] || "there";
        const petName = order.petName || "your pet";

        // Pre-fill the review URL with customer info
        const reviewUrl = `${baseUrl}/submit-review?email=${encodeURIComponent(
          order.customerEmail
        )}&name=${encodeURIComponent(
          order.customerName
        )}&pet=${encodeURIComponent(petName)}&orderId=${order.id}`;

        const emailHtml = generatePostDeliveryReviewEmail({
          customerName: firstName,
          petName,
          reviewUrl,
          baseUrl,
        });

        await resend.emails.send({
          from: "Pawcasso Atelier <portraits@pawcasso-atelier.com>",
          to: order.customerEmail,
          subject: `How's ${petName}'s portrait? We'd love your feedback!`,
          html: emailHtml,
        });

        // Mark this order as having received a review email
        await prisma.order.update({
          where: { id: order.id },
          data: { reviewRequestEmailSentAt: now },
        });

        // Track the event
        await prisma.analyticsEvent.create({
          data: {
            eventName: "review_email_sent",
            userId: order.customerEmail,
            pathname: "/api/cron/review-emails",
            metadata: JSON.stringify({
              orderId: order.id,
              petName,
              daysAfterDelivery: 7,
            }),
          },
        });

        sent++;
        results.push({ email: order.customerEmail, status: "sent" });
      } catch (error) {
        console.error(
          `Failed to send review email to ${order.customerEmail}:`,
          error
        );
        errors++;
        results.push({ email: order.customerEmail, status: "error" });
      }
    }

    return NextResponse.json({
      success: true,
      eligible: eligibleOrders.length,
      sent,
      skipped: eligibleOrders.length - sent - errors,
      errors,
      results,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("Cron review email error:", error);
    return NextResponse.json(
      { error: "Failed to process review emails" },
      { status: 500 }
    );
  }
}
