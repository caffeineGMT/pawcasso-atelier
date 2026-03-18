import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { AbandonedCartEmail } from "@/lib/email-templates/abandoned-cart";

export async function POST(req: NextRequest) {
  // Initialize Resend inside the handler to avoid build-time errors
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY not configured");
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 500 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      console.error("Missing stripe-signature header");
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET_ABANDONED) {
      console.error("STRIPE_WEBHOOK_SECRET_ABANDONED not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    // Verify webhook signature
    const stripe = getStripe();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET_ABANDONED
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err instanceof Error ? err.message : "Unknown error"}` },
        { status: 400 }
      );
    }

    // Handle the checkout.session.expired event
    if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Extract customer details and metadata
      const customerEmail = session.customer_email || session.customer_details?.email;
      const metadata = session.metadata || {};
      const tier = metadata.tier || "Basic";
      const petName = metadata.petName || "Your Pet";
      const tierName = metadata.tierName || tier;

      if (!customerEmail) {
        console.error("No customer email found in session:", session.id);
        return NextResponse.json(
          { error: "No customer email found" },
          { status: 400 }
        );
      }

      // Generate a unique 10% discount code via Stripe Coupons API
      const sessionIdPrefix = session.id.slice(0, 8);
      const couponId = `CART10-${sessionIdPrefix}`;
      const expiresAt = Math.floor(Date.now() / 1000) + 48 * 60 * 60; // 48 hours from now

      let coupon: Stripe.Coupon;
      try {
        // Check if coupon already exists (in case webhook is retried)
        try {
          coupon = await stripe.coupons.retrieve(couponId);
          console.log("Coupon already exists:", couponId);
        } catch (retrieveError) {
          // Coupon doesn't exist, create it
          coupon = await stripe.coupons.create({
            id: couponId,
            percent_off: 10,
            duration: "once",
            max_redemptions: 1,
            redeem_by: expiresAt,
            name: `Abandoned Cart Recovery - ${tierName}`,
          });
          console.log("Created new coupon:", couponId);
        }
      } catch (couponError) {
        console.error("Failed to create coupon:", couponError);
        return NextResponse.json(
          { error: "Failed to create discount code" },
          { status: 500 }
        );
      }

      // Build checkout URL with tier and discount code
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pawcasso-atelier.vercel.app";
      const checkoutUrl = `${baseUrl}/order?tier=${tier.toLowerCase()}&code=${couponId}`;

      // Send abandoned cart email using Resend
      try {
        const emailFrom = process.env.EMAIL_FROM || "hello@pawcasso-atelier.com";

        const { data, error } = await resend.emails.send({
          from: emailFrom,
          to: customerEmail,
          subject: `Your ${tierName} portrait for ${petName} is waiting! 🎨`,
          react: AbandonedCartEmail({
            tier: tierName,
            petName,
            discountCode: couponId,
            checkoutUrl,
          }),
        });

        if (error) {
          console.error("Failed to send email:", error);
          return NextResponse.json(
            { error: "Failed to send email" },
            { status: 500 }
          );
        }

        console.log("Abandoned cart email sent:", {
          emailId: data?.id,
          to: customerEmail,
          couponId,
          sessionId: session.id,
        });

        return NextResponse.json({
          success: true,
          emailId: data?.id,
          couponId,
        });
      } catch (emailError) {
        console.error("Email sending error:", emailError);
        return NextResponse.json(
          { error: "Failed to send email" },
          { status: 500 }
        );
      }
    }

    // Return 200 for other event types
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
