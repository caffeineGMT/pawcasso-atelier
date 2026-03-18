import { NextRequest, NextResponse } from "next/server";
import { validateReferralCode } from "@/lib/referral";

export async function POST(req: NextRequest) {
  try {
    const { referralCode } = await req.json();

    if (!referralCode) {
      return NextResponse.json({ error: "Referral code is required" }, { status: 400 });
    }

    const result = await validateReferralCode(referralCode);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to validate referral code:", error);
    return NextResponse.json({ error: "Failed to validate code" }, { status: 500 });
  }
}
