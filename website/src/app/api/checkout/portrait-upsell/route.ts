import { NextRequest, NextResponse } from "next/server";
import { getStripe, PORTRAIT_UPSELL, TIER_CONFIG, type TierId } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      style,
      petName,
      notes,
      petPhotoUrl,
      tier,
      discountCode,
      referralCode,
      badge,
      utmSource,
      utmMedium,
      utmCampaign,
      giftCardCode,
      applyCredits,
      creditApplied,
      abTestVariant,
      abSessionId,
    } = body;

    if (!name || !email || !style) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate that second portrait price is configured
    if (!PORTRAIT_UPSELL.stripeId) {
      return NextResponse.json(
        { error: "Second portrait price not configured in Stripe" },
        { status: 500 }
      );
    }

    // Get the primary tier config
    const selectedTier: TierId = tier || 'basic';
    const tierConfig = TIER_CONFIG.find((t) => t.id === selectedTier);

    if (!tierConfig) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    if (!tierConfig.stripeId) {
      return NextResponse.json({ error: `Stripe Price ID not configured for tier: ${tier}` }, { status: 400 });
    }

    const stripe = getStripe();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Create checkout session with BOTH the original portrait AND the upsell portrait
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price: tierConfig.stripeId,
          quantity: 1,
        },
        {
          price: PORTRAIT_UPSELL.stripeId,
          quantity: 1,
        },
      ],
      metadata: {
        tier: tier,
        tierName: tierConfig.name,
        features: tierConfig.features.join(', '),
        customerName: name,
        petName,
        style,
        notes: notes || "",
        petPhotoUrl: petPhotoUrl || "",
        discountCode: discountCode || "",
        referralCode: referralCode || "",
        badge: badge || "",
        utmSource: utmSource || "",
        utmMedium: utmMedium || "",
        utmCampaign: utmCampaign || "",
        giftCardCode: giftCardCode || "",
        creditApplied: (creditApplied || 0).toString(),
        abTestVariant: abTestVariant || "control",
        abSessionId: abSessionId || "",
        hasPortraitUpsell: "true",
        upsellQuantity: "1",
        upsellPrice: PORTRAIT_UPSELL.discountedPrice.toString(),
      },
      // Expire session after 24 hours to trigger abandoned cart webhook
      expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
      success_url: `${baseUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/order?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("Portrait upsell checkout error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create checkout session with upsell";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
