import { NextRequest, NextResponse } from "next/server";
import {
  assignPricingVariant,
  generateSessionId,
  DEFAULT_TEST_CONFIG,
  PricingVariant,
} from "@/lib/ab-pricing";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

/**
 * API endpoint to assign a user to a pricing variant
 * Sets a cookie with the variant assignment
 */
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();

    // Check if user already has a variant assigned
    const existingVariant = cookieStore.get('pricing_variant')?.value as PricingVariant | undefined;
    const existingSessionId = cookieStore.get('ab_session_id')?.value;

    // If already assigned, return existing variant
    if (existingVariant && existingSessionId) {
      return NextResponse.json({
        variant: existingVariant,
        sessionId: existingSessionId,
        assigned: false, // Not newly assigned
      });
    }

    // Generate new session ID
    const sessionId = existingSessionId || generateSessionId();

    // Assign variant
    const variant = await assignPricingVariant(sessionId, DEFAULT_TEST_CONFIG);

    // Set cookies (30 days expiration)
    const cookieOptions = {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      httpOnly: false, // Allow client-side access
      sameSite: 'lax' as const,
      path: '/',
    };

    const response = NextResponse.json({
      variant,
      sessionId,
      assigned: true, // Newly assigned
    });

    response.cookies.set('pricing_variant', variant, cookieOptions);
    response.cookies.set('ab_session_id', sessionId, cookieOptions);

    return response;
  } catch (error) {
    console.error('Error assigning pricing variant:', error);
    // Fallback to control variant on error
    return NextResponse.json({
      variant: 'control',
      sessionId: 'error',
      assigned: false,
      error: 'Failed to assign variant',
    });
  }
}
