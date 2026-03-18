import { NextRequest, NextResponse } from "next/server";
import { trackReferralClick } from "@/lib/referral";

export async function POST(req: NextRequest) {
  try {
    const { referralCode, email } = await req.json();

    if (!referralCode) {
      return NextResponse.json({ error: "Referral code is required" }, { status: 400 });
    }

    const referrer = await trackReferralClick(referralCode, email);

    if (!referrer) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
    }

    return NextResponse.json({ success: true, referrerEmail: referrer.email });
  } catch (error) {
    console.error("Failed to track referral click:", error);
    return NextResponse.json({ error: "Failed to track click" }, { status: 500 });
  }
}
