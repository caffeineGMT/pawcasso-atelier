import { NextRequest, NextResponse } from "next/server";
import { trackPricingConversion, DEFAULT_TEST_CONFIG } from "@/lib/ab-pricing";
import type { PricingVariant } from "@/lib/ab-pricing";

/**
 * API endpoint to track A/B test conversions
 * Called after successful checkout
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, variant, revenue, tier, orderId } = body;

    if (!sessionId || !variant || !revenue || !tier || !orderId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await trackPricingConversion({
      testId: DEFAULT_TEST_CONFIG.id,
      variant: variant as PricingVariant,
      sessionId,
      revenue: parseFloat(revenue),
      tier,
      orderId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking A/B test conversion:', error);
    return NextResponse.json(
      { error: 'Failed to track conversion' },
      { status: 500 }
    );
  }
}
