import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession, type TierId } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, style, petName, notes, petPhotoUrl, tier, discountCode } = body;

    if (!name || !email || !style) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Default to 'basic' tier if not provided
    const selectedTier: TierId = tier || 'basic';

    const session = await createCheckoutSession({
      tier: selectedTier,
      customerEmail: email,
      customerName: name,
      petName,
      style,
      notes,
      petPhotoUrl,
      discountCode,
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
