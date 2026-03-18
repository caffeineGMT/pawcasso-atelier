import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, upsellType } = body;

    if (!sessionId || !upsellType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (upsellType !== 'print' && upsellType !== 'license') {
      return NextResponse.json({ error: "Invalid upsell type" }, { status: 400 });
    }

    // Get price IDs from environment variables
    const priceId = upsellType === 'print'
      ? process.env.STRIPE_PRICE_PRINT_PACKAGE
      : process.env.STRIPE_PRICE_COMMERCIAL_LICENSE;

    if (!priceId) {
      return NextResponse.json(
        { error: `Missing Stripe Price ID for ${upsellType}` },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const stripe = getStripe();

    // Create new checkout session for the upsell
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        original_session_id: sessionId,
        upsell_type: upsellType,
      },
      success_url: `${baseUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/order/success?session_id=${sessionId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("Upsell checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create upsell checkout session" },
      { status: 500 }
    );
  }
}
