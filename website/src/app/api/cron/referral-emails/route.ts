import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { PrismaClient } from "@prisma/client";
import { getOrCreateCustomer } from "@/lib/referral";
import { generatePostDeliveryReferralEmail } from "@/lib/email-templates/post-delivery-referral";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pawcasso-atelier.vercel.app";

    // Find orders delivered ~24 hours ago that haven't received a referral email yet
    // We look for orders delivered between 20-28 hours ago to give a buffer window
    const now = new Date();
    const twentyHoursAgo = new Date(now.getTime() - 20 * 60 * 60 * 1000);
    const twentyEightHoursAgo = new Date(now.getTime() - 28 * 60 * 60 * 1000);

    const eligibleOrders = await prisma.order.findMany({
      where: {
        status: "completed",
        deliveryStatus: "completed",
        deliveredAt: {
          gte: twentyEightHoursAgo,
          lte: twentyHoursAgo,
        },
        // Exclude orders that already have a referral email event tracked
        NOT: {
          customerEmail: {
            in: await getAlreadySentEmails(),
          },
        },
      },
      orderBy: { deliveredAt: "desc" },
    });

    let sent = 0;
    let errors = 0;

    for (const order of eligibleOrders) {
      try {
        // Get or create customer to ensure they have a referral code
        const customer = await getOrCreateCustomer(
          order.customerEmail,
          order.customerName
        );

        const emailHtml = generatePostDeliveryReferralEmail({
          customerName: order.customerName.split(" ")[0] || "there",
          petName: order.petName || "your pet",
          referralCode: customer.referralCode,
          baseUrl,
        });

        await resend.emails.send({
          from: "Pawcasso Atelier <portraits@pawcasso-atelier.com>",
          to: order.customerEmail,
          subject: `Love ${order.petName || "your pet"}'s portrait? Share with friends and earn $5!`,
          html: emailHtml,
        });

        // Track that we sent this email
        await prisma.analyticsEvent.create({
          data: {
            eventName: "referral_email_sent",
            userId: order.customerEmail,
            pathname: "/api/cron/referral-emails",
            metadata: JSON.stringify({
              orderId: order.id,
              referralCode: customer.referralCode,
              petName: order.petName,
            }),
          },
        });

        sent++;
      } catch (error) {
        console.error(
          `Failed to send referral email to ${order.customerEmail}:`,
          error
        );
        errors++;
      }
    }

    return NextResponse.json({
      success: true,
      eligible: eligibleOrders.length,
      sent,
      errors,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("Cron referral email error:", error);
    return NextResponse.json(
      { error: "Failed to process referral emails" },
      { status: 500 }
    );
  }
}

async function getAlreadySentEmails(): Promise<string[]> {
  const events = await prisma.analyticsEvent.findMany({
    where: { eventName: "referral_email_sent" },
    select: { userId: true },
    distinct: ["userId"],
  });

  return events
    .map((e) => e.userId)
    .filter((email): email is string => email !== null);
}
