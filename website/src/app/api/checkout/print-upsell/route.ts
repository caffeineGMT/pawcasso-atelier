import { NextRequest, NextResponse } from "next/server";
import { getStripe, PRINT_UPSELL_PRICES, type PrintProductType } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { originalSessionId, productType } = body as {
      originalSessionId: string;
      productType: PrintProductType;
    };

    if (!originalSessionId || !productType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate product type
    if (!PRINT_UPSELL_PRICES[productType]) {
      return NextResponse.json(
        { error: "Invalid product type" },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const productConfig = PRINT_UPSELL_PRICES[productType];

    // Retrieve original order session to get portrait URL and customer info
    const originalSession = await stripe.checkout.sessions.retrieve(originalSessionId, {
      expand: ['line_items'],
    });

    if (!originalSession) {
      return NextResponse.json(
        { error: "Original order not found" },
        { status: 404 }
      );
    }

    // Extract portrait URL from metadata (will be available after order completion)
    const portraitUrls = originalSession.metadata?.portrait_urls || '';
    const firstPortraitUrl = portraitUrls.split(',')[0] || '';
    const customerEmail = originalSession.customer_email || '';
    const customerName = originalSession.metadata?.customerName || '';
    const petName = originalSession.metadata?.petName || '';

    // Validate that Stripe Price ID is configured
    if (!productConfig.stripeId) {
      return NextResponse.json(
        { error: `Stripe Price ID not configured for ${productType}` },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Create checkout session for print upsell with discounted price
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerEmail,
      line_items: [
        {
          price: productConfig.stripeId,
          quantity: 1,
        },
      ],
      metadata: {
        order_type: 'print_upsell',
        product_type: productType,
        original_order_id: originalSessionId,
        portrait_url: firstPortraitUrl,
        customer_name: customerName,
        pet_name: petName,
        printful_product_id: productConfig.printfulProductId,
      },
      success_url: `${baseUrl}/order/success?session_id={CHECKOUT_SESSION_ID}&print_upsell=true`,
      cancel_url: `${baseUrl}/order/success?session_id=${originalSessionId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("Print upsell checkout error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create print upsell checkout";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
