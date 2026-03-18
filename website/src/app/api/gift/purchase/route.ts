import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      amount,
      recipientEmail,
      recipientName,
      senderName,
      senderEmail,
      message,
      deliveryDate,
    } = body;

    // Validation
    if (!amount || amount < 10) {
      return NextResponse.json(
        { error: "Gift card amount must be at least $10" },
        { status: 400 }
      );
    }

    if (!recipientEmail || !recipientName || !senderName || !senderEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Create Stripe checkout session for gift card
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: senderEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Pawcasso Gift Card",
              description: `Gift card for ${recipientName} ($${amount})`,
              images: [
                `${baseUrl}/gift-card-preview.jpg`, // TODO: Create nice gift card image
              ],
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "gift_card",
        amount: amount.toString(),
        recipientEmail,
        recipientName,
        senderName,
        senderEmail,
        message: message || "",
        deliveryDate: deliveryDate || new Date().toISOString(),
      },
      success_url: `${baseUrl}/gift/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/gift?canceled=true`,
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Gift card purchase error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create gift card checkout",
      },
      { status: 500 }
    );
  }
}
