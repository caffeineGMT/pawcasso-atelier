import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import { getPromoCodeStats } from "@/lib/promo-codes";

const prisma = new PrismaClient();

/**
 * GET /api/admin/promo-codes
 * List all promo codes with stats
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession();

  // TODO: Add proper admin authentication
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const active = searchParams.get("active");
  const campaignType = searchParams.get("campaignType");

  const where: any = {};
  if (active) {
    where.active = active === "true";
  }
  if (campaignType) {
    where.campaignType = campaignType;
  }

  const promoCodes = await prisma.promoCode.findMany({
    where,
    include: {
      usages: true,
      _count: {
        select: { usages: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Enhance with stats
  const promoCodesWithStats = await Promise.all(
    promoCodes.map(async (code) => {
      const stats = await getPromoCodeStats(code.id);
      return {
        ...code,
        stats,
      };
    })
  );

  return NextResponse.json({ promoCodes: promoCodesWithStats });
}

/**
 * POST /api/admin/promo-codes
 * Create a new promo code
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession();

  // TODO: Add proper admin authentication
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      code,
      name,
      description,
      discountType,
      discountPercent,
      discountAmount,
      minOrderAmount,
      maxUses,
      maxUsesPerCustomer,
      applicableTiers,
      startsAt,
      expiresAt,
      active,
      campaignType,
      utmCampaign,
    } = body;

    // Validation
    if (!code || !name || !discountType) {
      return NextResponse.json(
        { error: "Missing required fields: code, name, discountType" },
        { status: 400 }
      );
    }

    if (discountType === "percent" && !discountPercent) {
      return NextResponse.json(
        { error: "discountPercent is required for percent discount type" },
        { status: 400 }
      );
    }

    if (discountType === "fixed_amount" && !discountAmount) {
      return NextResponse.json(
        { error: "discountAmount is required for fixed_amount discount type" },
        { status: 400 }
      );
    }

    // Check if code already exists
    const existing = await prisma.promoCode.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A promo code with this code already exists" },
        { status: 409 }
      );
    }

    const promoCode = await prisma.promoCode.create({
      data: {
        code: code.trim().toUpperCase(),
        name,
        description: description || null,
        discountType,
        discountPercent: discountType === "percent" ? discountPercent : null,
        discountAmount: discountType === "fixed_amount" ? discountAmount : null,
        minOrderAmount: minOrderAmount || null,
        maxUses: maxUses || null,
        maxUsesPerCustomer: maxUsesPerCustomer || 1,
        applicableTiers: applicableTiers ? JSON.stringify(applicableTiers) : null,
        startsAt: startsAt ? new Date(startsAt) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        active: active !== false, // Default to true
        campaignType: campaignType || null,
        utmCampaign: utmCampaign || null,
        createdBy: session.user.email || null,
      },
    });

    return NextResponse.json({ promoCode }, { status: 201 });
  } catch (error) {
    console.error("Failed to create promo code:", error);
    return NextResponse.json(
      { error: "Failed to create promo code" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/promo-codes/[id]
 * Update an existing promo code
 */
export async function PATCH(req: NextRequest) {
  const session = await getServerSession();

  // TODO: Add proper admin authentication
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing promo code ID" }, { status: 400 });
    }

    // Don't allow changing code or usage stats
    delete updates.code;
    delete updates.currentUses;
    delete updates.createdAt;

    // Handle applicableTiers JSON serialization
    if (updates.applicableTiers) {
      updates.applicableTiers = JSON.stringify(updates.applicableTiers);
    }

    // Handle date conversions
    if (updates.startsAt) {
      updates.startsAt = new Date(updates.startsAt);
    }
    if (updates.expiresAt) {
      updates.expiresAt = new Date(updates.expiresAt);
    }

    const promoCode = await prisma.promoCode.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json({ promoCode });
  } catch (error) {
    console.error("Failed to update promo code:", error);
    return NextResponse.json(
      { error: "Failed to update promo code" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/promo-codes/[id]
 * Delete a promo code (soft delete by setting active = false)
 */
export async function DELETE(req: NextRequest) {
  const session = await getServerSession();

  // TODO: Add proper admin authentication
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing promo code ID" }, { status: 400 });
    }

    // Soft delete by setting active = false
    await prisma.promoCode.update({
      where: { id },
      data: { active: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete promo code:", error);
    return NextResponse.json(
      { error: "Failed to delete promo code" },
      { status: 500 }
    );
  }
}
