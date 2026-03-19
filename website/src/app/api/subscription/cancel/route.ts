import { NextRequest, NextResponse } from "next/server";
import { cancelSubscription, reactivateSubscription } from "@/lib/subscription";

/**
 * POST /api/subscription/cancel
 *
 * Cancel customer's subscription at period end
 *
 * Body params:
 * - email: Customer email
 * - action: "cancel" | "reactivate"
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, action } = body;

    if (!email || !action) {
      return NextResponse.json(
        { error: "Email and action are required" },
        { status: 400 }
      );
    }

    if (action === "cancel") {
      const result = await cancelSubscription(email);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, message: "Subscription will be canceled at the end of the billing period" });
    } else if (action === "reactivate") {
      const result = await reactivateSubscription(email);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, message: "Subscription reactivated successfully" });
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error managing subscription:", error);
    return NextResponse.json(
      { error: "Failed to manage subscription" },
      { status: 500 }
    );
  }
}
