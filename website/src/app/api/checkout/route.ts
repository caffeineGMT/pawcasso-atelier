import { NextRequest, NextResponse } from "next/server";
import { getStripe, PRODUCTS } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, style, tier, petName, notes } = body;

    if (!name || !email || !style || !tier) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const product = tier === "print" ? PRODUCTS.print : PRODUCTS.digital;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${product.name} — ${style}`,
              description: `Portrait of ${petName}. ${notes || ""}`.trim(),
            },
            unit_amount: product.price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        customerName: name,
        petName,
        style,
        tier,
        notes: notes || "",
      },
      success_url: `${baseUrl}/?success=true`,
      cancel_url: `${baseUrl}/order?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
