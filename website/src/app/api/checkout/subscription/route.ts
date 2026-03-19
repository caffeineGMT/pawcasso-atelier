import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "placeholder", {
  apiVersion: "2026-02-25.clover",
});

/**
 * POST /api/checkout/subscription
 *
 * Create a Stripe Checkout session for subscription signup
 *
 * Body params:
 * - email: Customer email
 * - name: Customer name
 * - utmSource, utmMedium, utmCampaign: UTM tracking parameters
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      name,
      utmSource,
      utmMedium,
      utmCampaign,
    } = body;

    // Validate required fields
    if (!email || !name) {
      return NextResponse.json(
        { error: "Email and name are required" },
        { status: 400 }
      );
    }

    const subscriptionPriceId = process.env.STRIPE_SUBSCRIPTION_MONTHLY_PORTRAIT;
    if (!subscriptionPriceId || subscriptionPriceId === "price_1xxxxxxxxxxxxxxxxxxxxx") {
      return NextResponse.json(
        { error: "Subscription product not configured. Please create the subscription price in Stripe Dashboard and update STRIPE_SUBSCRIPTION_MONTHLY_PORTRAIT in .env.local" },
        { status: 500 }
      );
    }

    // Get or create Stripe customer
    let customer: Stripe.Customer | undefined;
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: email,
        name: name,
        metadata: {
          utmSource: utmSource || "",
          utmMedium: utmMedium || "",
          utmCampaign: utmCampaign || "",
        },
      });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Create subscription checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: subscriptionPriceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/subscribe?canceled=true`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      metadata: {
        customerEmail: email,
        customerName: name,
        utmSource: utmSource || "",
        utmMedium: utmMedium || "",
        utmCampaign: utmCampaign || "",
      },
      subscription_data: {
        metadata: {
          customerEmail: email,
          customerName: name,
          plan: "monthly_portrait",
          portraitsPerMonth: "1",
        },
        trial_period_days: 0, // No trial by default, can be added later
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Error creating subscription checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create subscription checkout session" },
      { status: 500 }
    );
  }
}
