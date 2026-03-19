/**
 * Post-Purchase Email Automation Service
 *
 * 5-Email Drip Campaign:
 * 1. Order Confirmation (immediate)
 * 2. Shipping Notification (when order ships)
 * 3. Delivery Confirmation (when delivered)
 * 4. Review Request (7 days post-delivery)
 * 5. Reorder Incentive (30 days post-delivery)
 */

import { Resend } from "resend";
import { PrismaClient } from "@prisma/client";
import { render } from "@react-email/components";
import OrderConfirmation from "./email-templates/order-confirmation";
import ShippingNotification from "./email-templates/shipping-notification";
import DeliveryConfirmation from "./email-templates/delivery-confirmation";
import PostDeliveryReviewRequest from "./email-templates/post-delivery-review-request";
import ReorderIncentive from "./email-templates/reorder-incentive";

const prisma = new PrismaClient();

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || "placeholder");
}

const FROM_EMAIL = "Pawcasso Atelier <hello@pawcasso-atelier.com>";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://pawcasso-atelier.vercel.app";

// Tier delivery time estimates
const TIER_DELIVERY_ESTIMATES: Record<string, string> = {
  basic: "24 hours",
  premium: "12 hours",
  deluxe: "6 hours",
  bundle: "instant",
};

/**
 * EMAIL #1: Order Confirmation (Immediate after purchase)
 */
export async function sendOrderConfirmationEmail(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error(`Order not found: ${orderId}`);
    }

    // Skip if already sent
    if (order.orderConfirmationEmailSentAt) {
      console.log(`Order confirmation email already sent for order ${orderId}`);
      return { success: true, skipped: true };
    }

    const resend = getResend();

    const emailHtml = render(
      OrderConfirmation({
        customerName: order.customerName,
        petName: order.petName,
        tier: order.tier,
        tierName: order.tierName,
        amount: order.amount,
        orderId: order.stripeSessionId,
        style: order.style,
        estimatedDelivery: TIER_DELIVERY_ESTIMATES[order.tier] || "24 hours",
      })
    );

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: order.customerEmail,
      subject: `Order Confirmed! Your ${order.petName} portrait is on the way 🎨`,
      html: emailHtml,
    });

    // Update order with sent timestamp
    await prisma.order.update({
      where: { id: orderId },
      data: { orderConfirmationEmailSentAt: new Date() },
    });

    console.log(`✅ Order confirmation email sent for order ${orderId}`, result);
    return { success: true, result };
  } catch (error) {
    console.error(`❌ Failed to send order confirmation email for ${orderId}:`, error);
    throw error;
  }
}

/**
 * EMAIL #2: Shipping Notification (When order ships / portrait generation starts)
 */
export async function sendShippingNotificationEmail(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error(`Order not found: ${orderId}`);
    }

    // Skip if already sent
    if (order.shippingNotificationEmailSentAt) {
      console.log(`Shipping notification email already sent for order ${orderId}`);
      return { success: true, skipped: true };
    }

    const resend = getResend();

    const emailHtml = render(
      ShippingNotification({
        customerName: order.customerName,
        petName: order.petName,
        style: order.style,
        estimatedArrival: TIER_DELIVERY_ESTIMATES[order.tier] || "within 6 hours",
      })
    );

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: order.customerEmail,
      subject: `📦 Good news! ${order.petName}'s portrait is being created`,
      html: emailHtml,
    });

    // Update order with sent timestamp
    await prisma.order.update({
      where: { id: orderId },
      data: { shippingNotificationEmailSentAt: new Date() },
    });

    console.log(`✅ Shipping notification email sent for order ${orderId}`, result);
    return { success: true, result };
  } catch (error) {
    console.error(`❌ Failed to send shipping notification email for ${orderId}:`, error);
    throw error;
  }
}

/**
 * EMAIL #3: Delivery Confirmation (When portrait is delivered)
 */
export async function sendDeliveryConfirmationEmail(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error(`Order not found: ${orderId}`);
    }

    // Skip if already sent
    if (order.deliveryConfirmationEmailSentAt) {
      console.log(`Delivery confirmation email already sent for order ${orderId}`);
      return { success: true, skipped: true };
    }

    const resend = getResend();

    // Generate download URL
    const downloadUrl = `${BASE_URL}/download/${order.stripeSessionId}`;

    const emailHtml = render(
      DeliveryConfirmation({
        customerName: order.customerName,
        petName: order.petName,
        style: order.style,
        downloadUrl,
        portraitUrls: order.portraitUrls?.split(",") || [],
      })
    );

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: order.customerEmail,
      subject: `🎨 ${order.petName}'s portrait has arrived!`,
      html: emailHtml,
    });

    // Update order with sent timestamp
    await prisma.order.update({
      where: { id: orderId },
      data: { deliveryConfirmationEmailSentAt: new Date() },
    });

    console.log(`✅ Delivery confirmation email sent for order ${orderId}`, result);
    return { success: true, result };
  } catch (error) {
    console.error(`❌ Failed to send delivery confirmation email for ${orderId}:`, error);
    throw error;
  }
}

/**
 * EMAIL #4: Review Request (7 days post-delivery)
 */
export async function sendReviewRequestEmail(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error(`Order not found: ${orderId}`);
    }

    // Skip if already sent
    if (order.reviewRequestEmailSentAt) {
      console.log(`Review request email already sent for order ${orderId}`);
      return { success: true, skipped: true };
    }

    // Check if order was delivered
    if (!order.deliveredAt) {
      throw new Error(`Order ${orderId} has not been delivered yet`);
    }

    // Check if 7 days have passed since delivery
    const daysSinceDelivery = Math.floor(
      (Date.now() - order.deliveredAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceDelivery < 7) {
      console.log(
        `Too early to send review request for order ${orderId} (${daysSinceDelivery} days since delivery)`
      );
      return { success: false, error: "Too early", daysSinceDelivery };
    }

    const resend = getResend();

    const reviewUrl = `${BASE_URL}/submit-review?email=${encodeURIComponent(
      order.customerEmail
    )}&order=${order.id}`;

    const emailHtml = render(
      PostDeliveryReviewRequest({
        customerName: order.customerName,
        petName: order.petName,
        reviewUrl,
        instagramHandle: "@pawcasso.atelier",
      })
    );

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: order.customerEmail,
      subject: `Love your ${order.petName} portrait? Share it with us! 🎁`,
      html: emailHtml,
    });

    // Update order with sent timestamp
    await prisma.order.update({
      where: { id: orderId },
      data: { reviewRequestEmailSentAt: new Date() },
    });

    console.log(`✅ Review request email sent for order ${orderId}`, result);
    return { success: true, result };
  } catch (error) {
    console.error(`❌ Failed to send review request email for ${orderId}:`, error);
    throw error;
  }
}

/**
 * EMAIL #5: Reorder Incentive (30 days post-delivery)
 */
export async function sendReorderIncentiveEmail(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error(`Order not found: ${orderId}`);
    }

    // Skip if already sent
    if (order.reorderIncentiveEmailSentAt) {
      console.log(`Reorder incentive email already sent for order ${orderId}`);
      return { success: true, skipped: true };
    }

    // Check if order was delivered
    if (!order.deliveredAt) {
      throw new Error(`Order ${orderId} has not been delivered yet`);
    }

    // Check if 30 days have passed since delivery
    const daysSinceDelivery = Math.floor(
      (Date.now() - order.deliveredAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceDelivery < 30) {
      console.log(
        `Too early to send reorder incentive for order ${orderId} (${daysSinceDelivery} days since delivery)`
      );
      return { success: false, error: "Too early", daysSinceDelivery };
    }

    const resend = getResend();

    // Generate unique discount code for this customer
    const discountCode = `COMEBACK20-${order.customerEmail
      .split("@")[0]
      .toUpperCase()
      .slice(0, 6)}`;

    const emailHtml = render(
      ReorderIncentive({
        customerName: order.customerName,
        petName: order.petName,
        discountCode,
        discountPercent: 20,
        expiryDays: 90,
      })
    );

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: order.customerEmail,
      subject: `We miss ${order.petName}! Here's 20% off your next portrait`,
      html: emailHtml,
    });

    // Update order with sent timestamp
    await prisma.order.update({
      where: { id: orderId },
      data: { reorderIncentiveEmailSentAt: new Date() },
    });

    console.log(`✅ Reorder incentive email sent for order ${orderId}`, result);
    return { success: true, result };
  } catch (error) {
    console.error(`❌ Failed to send reorder incentive email for ${orderId}:`, error);
    throw error;
  }
}

/**
 * Utility: Send all pending emails for an order
 */
export async function sendAllPendingEmails(orderId: string) {
  const results = {
    orderConfirmation: null as any,
    shippingNotification: null as any,
    deliveryConfirmation: null as any,
    reviewRequest: null as any,
    reorderIncentive: null as any,
  };

  try {
    // Try to send each email (will skip if already sent)
    results.orderConfirmation = await sendOrderConfirmationEmail(orderId).catch(
      (e) => ({ error: e.message })
    );
    results.shippingNotification = await sendShippingNotificationEmail(orderId).catch(
      (e) => ({ error: e.message })
    );
    results.deliveryConfirmation = await sendDeliveryConfirmationEmail(orderId).catch(
      (e) => ({ error: e.message })
    );
    results.reviewRequest = await sendReviewRequestEmail(orderId).catch((e) => ({
      error: e.message,
    }));
    results.reorderIncentive = await sendReorderIncentiveEmail(orderId).catch((e) => ({
      error: e.message,
    }));

    return results;
  } catch (error) {
    console.error(`Error sending pending emails for order ${orderId}:`, error);
    return results;
  }
}

/**
 * Utility: Get orders that need scheduled emails
 */
export async function getOrdersNeedingScheduledEmails() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Find orders needing 7-day review request
  const ordersNeedingReviewRequest = await prisma.order.findMany({
    where: {
      deliveredAt: {
        lte: sevenDaysAgo,
      },
      reviewRequestEmailSentAt: null,
      deliveryStatus: "completed",
    },
  });

  // Find orders needing 30-day reorder incentive
  const ordersNeedingReorderIncentive = await prisma.order.findMany({
    where: {
      deliveredAt: {
        lte: thirtyDaysAgo,
      },
      reorderIncentiveEmailSentAt: null,
      deliveryStatus: "completed",
    },
  });

  return {
    reviewRequests: ordersNeedingReviewRequest,
    reorderIncentives: ordersNeedingReorderIncentive,
  };
}
