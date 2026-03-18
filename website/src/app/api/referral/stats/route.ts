import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getReferralStats, getStripeCustomerId } from "@/lib/stripe";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const customerId = await getStripeCustomerId(session.user.email);
    const stats = await getReferralStats(customerId);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Failed to fetch referral stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
