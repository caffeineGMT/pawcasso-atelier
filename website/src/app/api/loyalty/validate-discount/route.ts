import { NextRequest, NextResponse } from "next/server";
import { validateLoyaltyDiscount } from "@/lib/loyalty";

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Discount code required" }, { status: 400 });
    }

    const result = await validateLoyaltyDiscount(code);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Validate loyalty discount error:", error);
    return NextResponse.json({ valid: false, error: "Validation failed" }, { status: 500 });
  }
}
