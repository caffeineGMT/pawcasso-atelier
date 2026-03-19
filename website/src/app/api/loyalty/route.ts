import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getLoyaltyStatus } from "@/lib/loyalty";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    const email = session?.user?.email || req.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const status = await getLoyaltyStatus(email);

    if (!status) {
      return NextResponse.json({
        tier: "bronze",
        tierLabel: "Bronze",
        totalOrders: 0,
        totalSpent: 0,
        currentPoints: 0,
        lifetimePoints: 0,
        nextTier: "silver",
        ordersToNextTier: 2,
        spentToNextTier: 50,
        tierBenefits: { pointsMultiplier: 1, discountPercent: 0 },
        repeatDiscountCode: null,
        repeatDiscountUsed: false,
        rewards: [],
      });
    }

    return NextResponse.json(status);
  } catch (error) {
    console.error("Loyalty status error:", error);
    return NextResponse.json({ error: "Failed to get loyalty status" }, { status: 500 });
  }
}
