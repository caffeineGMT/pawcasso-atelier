import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "Gift card code is required" },
        { status: 400 }
      );
    }

    // Find gift card by code
    const giftCard = await prisma.giftCard.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!giftCard) {
      return NextResponse.json(
        { valid: false, error: "Invalid gift card code" },
        { status: 404 }
      );
    }

    // Check if gift card is active
    if (!giftCard.active) {
      return NextResponse.json(
        { valid: false, error: "This gift card has been deactivated" },
        { status: 400 }
      );
    }

    // Check if gift card has expired
    if (giftCard.expiresAt && new Date() > giftCard.expiresAt) {
      return NextResponse.json(
        { valid: false, error: "This gift card has expired" },
        { status: 400 }
      );
    }

    // Check if gift card has balance
    if (giftCard.currentBalance <= 0) {
      return NextResponse.json(
        { valid: false, error: "This gift card has no remaining balance" },
        { status: 400 }
      );
    }

    // Return gift card info
    return NextResponse.json({
      valid: true,
      code: giftCard.code,
      balance: giftCard.currentBalance,
      initialBalance: giftCard.initialBalance,
    });
  } catch (error) {
    console.error("Gift card validation error:", error);
    return NextResponse.json(
      { error: "Failed to validate gift card" },
      { status: 500 }
    );
  }
}
