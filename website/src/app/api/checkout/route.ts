import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession, type TierId } from "@/lib/stripe";
import { validateReferralCode, trackReferralClick } from "@/lib/referral";

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
      utmSource,
      utmMedium,
      utmCampaign
    } = body;

    if (!name || !email || !style) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Default to 'basic' tier if not provided
    const selectedTier: TierId = tier || 'basic';

    // Validate and track referral code if provided
    let validatedReferralCode: string | undefined;
    if (referralCode) {
      const validation = await validateReferralCode(referralCode);
      if (validation.valid) {
        validatedReferralCode = referralCode;
        // Track the referral conversion attempt
        await trackReferralClick(referralCode, email);
      }
    }

    const session = await createCheckoutSession({
      tier: selectedTier,
      customerEmail: email,
      customerName: name,
      petName,
      style,
      notes,
      petPhotoUrl,
      discountCode,
      referralCode: validatedReferralCode,
      utmSource,
      utmMedium,
      utmCampaign,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("Stripe checkout error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create checkout session";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
