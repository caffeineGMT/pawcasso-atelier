import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { sql } from "@vercel/postgres";
import { rejectPortrait } from "@/lib/quality-db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_id, portrait_id, reason } = body;

    if (!order_id) {
      return NextResponse.json(
        { error: "order_id is required" },
        { status: 400 }
      );
    }

    if (!portrait_id) {
      return NextResponse.json(
        { error: "portrait_id is required" },
        { status: 400 }
      );
    }

    const stripe = getStripe();

    // Get the Stripe session ID from order_id (assuming order_id is the session_id)
    // In a real implementation, you'd have a mapping table
    try {
      const session = await stripe.checkout.sessions.retrieve(order_id);

      if (!session.payment_intent) {
        return NextResponse.json(
          { error: "No payment intent found for this order" },
          { status: 400 }
        );
      }

      // Create refund
      const refund = await stripe.refunds.create({
        payment_intent: session.payment_intent as string,
        reason: "requested_by_customer",
        metadata: {
          portrait_id: portrait_id.toString(),
          refund_reason: reason || "Quality issue",
        },
      });

      // Update portrait status
      await rejectPortrait(
        portrait_id,
        `Refunded: ${reason || "Quality issue"}. Refund ID: ${refund.id}`
      );

      // Update order metadata (if needed)
      await stripe.checkout.sessions.update(order_id, {
        metadata: {
          ...session.metadata,
          refund_status: "refunded",
          refund_id: refund.id,
          refund_date: new Date().toISOString(),
        },
      });

      return NextResponse.json({
        success: true,
        refund_id: refund.id,
        amount: refund.amount,
        status: refund.status,
      });
    } catch (stripeError: any) {
      console.error("Stripe error:", stripeError);
      return NextResponse.json(
        { error: stripeError.message || "Failed to process refund" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error processing refund:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
