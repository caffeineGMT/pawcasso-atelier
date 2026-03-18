import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getStripe, getStripeCustomerId } from "@/lib/stripe";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const stripe = getStripe();
    const customerId = await getStripeCustomerId(session.user.email);

    if (!customerId) {
      return NextResponse.json({ orders: [] });
    }

    // Fetch payment intents for this customer
    const paymentIntents = await stripe.paymentIntents.list({
      customer: customerId,
      limit: 100,
    });

    // Fetch orders with receipt URLs by retrieving charges
    const orders = await Promise.all(
      paymentIntents.data
        .filter((pi) => pi.status === "succeeded")
        .map(async (pi) => {
          let receiptUrl = "#";

          // Get receipt URL from the latest charge if available
          if (pi.latest_charge && typeof pi.latest_charge === "string") {
            try {
              const charge = await stripe.charges.retrieve(pi.latest_charge);
              receiptUrl = charge.receipt_url || "#";
            } catch (error) {
              console.error("Failed to retrieve charge:", error);
            }
          }

          return {
            id: pi.id,
            date: new Date(pi.created * 1000).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            tier: pi.metadata.tierName || "Basic",
            status: "Completed",
            receiptUrl,
          };
        })
    );

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
