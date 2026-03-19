import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Check credit balance for an email
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const customer = await prisma.customer.findUnique({
      where: { email },
      select: {
        creditBalance: true,
        referralCode: true,
        totalReferrals: true,
      },
    });

    if (!customer) {
      return NextResponse.json({ creditBalance: 0, referralCode: null });
    }

    return NextResponse.json({
      creditBalance: customer.creditBalance,
      referralCode: customer.referralCode,
      totalReferrals: customer.totalReferrals,
    });
  } catch (error) {
    console.error("Failed to fetch credit balance:", error);
    return NextResponse.json(
      { error: "Failed to fetch credits" },
      { status: 500 }
    );
  }
}
