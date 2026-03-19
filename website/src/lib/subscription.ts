/**
 * Subscription Management Utilities
 *
 * Centralized functions for managing customer subscriptions:
 * - Check subscription status
 * - Track portrait usage quota
 * - Update subscription in database
 * - Cancel subscriptions
 */

import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const prisma = new PrismaClient();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "placeholder", {
  apiVersion: "2026-02-25.clover",
});

export interface SubscriptionDetails {
  id: string;
  status: string;
  plan: string;
  amount: number;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  portraitsPerMonth: number;
  portraitsUsedThisPeriod: number;
  portraitsRemainingThisPeriod: number;
  cancelAtPeriodEnd: boolean;
  canceledAt: Date | null;
}

/**
 * Get customer's active subscription
 */
export async function getCustomerSubscription(
  customerEmail: string
): Promise<SubscriptionDetails | null> {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        customerEmail,
        status: {
          in: ["active", "trialing", "past_due"],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!subscription) {
      return null;
    }

    return {
      id: subscription.id,
      status: subscription.status,
      plan: subscription.plan,
      amount: subscription.amount,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      portraitsPerMonth: subscription.portraitsPerMonth,
      portraitsUsedThisPeriod: subscription.portraitsUsedThisPeriod,
      portraitsRemainingThisPeriod: subscription.portraitsRemainingThisPeriod,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      canceledAt: subscription.canceledAt,
    };
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }
}

/**
 * Check if customer can order a portrait (has quota available)
 */
export async function canOrderPortrait(
  customerEmail: string
): Promise<{ canOrder: boolean; reason?: string }> {
  try {
    const subscription = await getCustomerSubscription(customerEmail);

    if (!subscription) {
      return { canOrder: false, reason: "No active subscription" };
    }

    if (subscription.portraitsRemainingThisPeriod <= 0) {
      return {
        canOrder: false,
        reason: `Portrait quota exhausted. Renews on ${subscription.currentPeriodEnd.toLocaleDateString()}`,
      };
    }

    return { canOrder: true };
  } catch (error) {
    console.error("Error checking portrait quota:", error);
    return { canOrder: false, reason: "Error checking subscription status" };
  }
}

/**
 * Use one portrait from subscription quota
 */
export async function usePortraitQuota(
  subscriptionId: string
): Promise<boolean> {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      console.error("Subscription not found:", subscriptionId);
      return false;
    }

    if (subscription.portraitsRemainingThisPeriod <= 0) {
      console.error("No portraits remaining for subscription:", subscriptionId);
      return false;
    }

    // Decrement remaining quota
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        portraitsUsedThisPeriod: subscription.portraitsUsedThisPeriod + 1,
        portraitsRemainingThisPeriod: subscription.portraitsRemainingThisPeriod - 1,
      },
    });

    return true;
  } catch (error) {
    console.error("Error using portrait quota:", error);
    return false;
  }
}

/**
 * Reset monthly portrait quota for a billing period
 */
export async function resetPortraitQuota(
  subscriptionId: string,
  periodStart: Date,
  periodEnd: Date
): Promise<boolean> {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      console.error("Subscription not found:", subscriptionId);
      return false;
    }

    // Reset quota
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
        portraitsUsedThisPeriod: 0,
        portraitsRemainingThisPeriod: subscription.portraitsPerMonth,
      },
    });

    // Track usage in SubscriptionUsage model
    await prisma.subscriptionUsage.upsert({
      where: {
        subscriptionId_periodStart: {
          subscriptionId: subscriptionId,
          periodStart: periodStart,
        },
      },
      create: {
        subscriptionId: subscriptionId,
        periodStart: periodStart,
        periodEnd: periodEnd,
        portraitsAllowed: subscription.portraitsPerMonth,
        portraitsUsed: 0,
        portraitsRemaining: subscription.portraitsPerMonth,
      },
      update: {
        portraitsAllowed: subscription.portraitsPerMonth,
        portraitsUsed: 0,
        portraitsRemaining: subscription.portraitsPerMonth,
      },
    });

    return true;
  } catch (error) {
    console.error("Error resetting portrait quota:", error);
    return false;
  }
}

/**
 * Create or update subscription in database from Stripe subscription
 */
export async function syncSubscriptionFromStripe(
  stripeSubscriptionId: string
): Promise<boolean> {
  try {
    const stripeSubscription = await stripe.subscriptions.retrieve(
      stripeSubscriptionId,
      { expand: ['default_payment_method'] }
    );

    const customer = await stripe.customers.retrieve(
      stripeSubscription.customer as string
    );

    if (customer.deleted) {
      console.error("Customer deleted:", stripeSubscription.customer);
      return false;
    }

    const customerEmail = customer.email || "";
    const customerName = customer.name || "";

    // Extract subscription details
    const amount = stripeSubscription.items.data[0]?.price.unit_amount
      ? stripeSubscription.items.data[0].price.unit_amount / 100
      : 29.0;

    const portraitsPerMonth = parseInt(
      stripeSubscription.metadata.portraitsPerMonth || "1",
      10
    );

    // Upsert subscription
    await prisma.subscription.upsert({
      where: { stripeSubscriptionId },
      create: {
        stripeSubscriptionId,
        stripeCustomerId: stripeSubscription.customer as string,
        customerEmail,
        customerName,
        plan: stripeSubscription.metadata.plan || "monthly_portrait",
        amount,
        currency: stripeSubscription.currency,
        interval: stripeSubscription.items.data[0]?.price.recurring?.interval || "month",
        intervalCount:
          stripeSubscription.items.data[0]?.price.recurring?.interval_count || 1,
        portraitsPerMonth,
        status: stripeSubscription.status,
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        canceledAt: stripeSubscription.canceled_at
          ? new Date(stripeSubscription.canceled_at * 1000)
          : null,
        currentPeriodStart: new Date(
          (stripeSubscription.current_period_start as number) * 1000
        ),
        currentPeriodEnd: new Date((stripeSubscription.current_period_end as number) * 1000),
        trialStart: stripeSubscription.trial_start
          ? new Date((stripeSubscription.trial_start as number) * 1000)
          : null,
        trialEnd: stripeSubscription.trial_end
          ? new Date((stripeSubscription.trial_end as number) * 1000)
          : null,
        defaultPaymentMethodId:
          (stripeSubscription.default_payment_method as string) || null,
        portraitsUsedThisPeriod: 0,
        portraitsRemainingThisPeriod: portraitsPerMonth,
        startedAt: new Date((stripeSubscription.created as number) * 1000),
      },
      update: {
        status: stripeSubscription.status,
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        canceledAt: stripeSubscription.canceled_at
          ? new Date((stripeSubscription.canceled_at as number) * 1000)
          : null,
        currentPeriodStart: new Date(
          (stripeSubscription.current_period_start as number) * 1000
        ),
        currentPeriodEnd: new Date((stripeSubscription.current_period_end as number) * 1000),
        defaultPaymentMethodId:
          (stripeSubscription.default_payment_method as string) || null,
        updatedAt: new Date(),
      },
    });

    return true;
  } catch (error) {
    console.error("Error syncing subscription from Stripe:", error);
    return false;
  }
}

/**
 * Cancel subscription at period end
 */
export async function cancelSubscription(
  customerEmail: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        customerEmail,
        status: {
          in: ["active", "trialing"],
        },
      },
    });

    if (!subscription) {
      return { success: false, error: "No active subscription found" };
    }

    // Cancel in Stripe
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    // Update in database
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        cancelAtPeriodEnd: true,
        canceledAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return { success: false, error: "Failed to cancel subscription" };
  }
}

/**
 * Reactivate a canceled subscription (undo cancellation)
 */
export async function reactivateSubscription(
  customerEmail: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        customerEmail,
        status: {
          in: ["active", "trialing"],
        },
        cancelAtPeriodEnd: true,
      },
    });

    if (!subscription) {
      return { success: false, error: "No canceled subscription found" };
    }

    // Reactivate in Stripe
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });

    // Update in database
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        cancelAtPeriodEnd: false,
        canceledAt: null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error reactivating subscription:", error);
    return { success: false, error: "Failed to reactivate subscription" };
  }
}

/**
 * Get customer's subscription history
 */
export async function getSubscriptionHistory(customerEmail: string) {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: { customerEmail },
      orderBy: { createdAt: "desc" },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
        },
        invoices: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return subscriptions;
  } catch (error) {
    console.error("Error fetching subscription history:", error);
    return [];
  }
}
