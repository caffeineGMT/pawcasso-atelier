import { NextRequest, NextResponse } from "next/server";
import { getCustomerSubscription } from "@/lib/subscription";

/**
 * GET /api/subscription/status
 *
 * Get customer's active subscription status
 *
 * Query params:
 * - email: Customer email
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const subscription = await getCustomerSubscription(email);

    if (!subscription) {
      return NextResponse.json(
        { subscription: null, hasSubscription: false },
        { status: 200 }
      );
    }

    return NextResponse.json({
      subscription,
      hasSubscription: true,
    });
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription status" },
      { status: 500 }
    );
  }
}
