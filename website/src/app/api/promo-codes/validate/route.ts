import { NextRequest, NextResponse } from "next/server";
import { validatePromoCode } from "@/lib/promo-codes";

/**
 * POST /api/promo-codes/validate
 * Validate a promo code in real-time (for order form)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, email, orderAmount, tier } = body;

    if (!code || !email || !orderAmount || !tier) {
      return NextResponse.json(
        { error: "Missing required fields: code, email, orderAmount, tier" },
        { status: 400 }
      );
    }

    const validation = await validatePromoCode(code, email, orderAmount, tier);

    if (!validation.valid) {
      return NextResponse.json(
        { valid: false, error: validation.error },
        { status: 200 } // Still return 200, error is in body
      );
    }

    return NextResponse.json({
      valid: true,
      discountAmount: validation.discountAmount,
      discountPercent: validation.discountPercent,
      finalAmount: orderAmount - (validation.discountAmount || 0),
      promoCode: validation.promoCode,
    });
  } catch (error) {
    console.error("Promo code validation error:", error);
    return NextResponse.json(
      { error: "Failed to validate promo code" },
      { status: 500 }
    );
  }
}
