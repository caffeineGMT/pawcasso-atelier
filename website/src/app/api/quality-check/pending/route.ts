import { NextResponse } from "next/server";
import { getPortraitsForReview } from "@/lib/quality-db";

export async function GET() {
  try {
    const portraits = await getPortraitsForReview();

    return NextResponse.json({
      portraits,
      count: portraits.length,
    });
  } catch (error) {
    console.error("Error fetching pending portraits:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
