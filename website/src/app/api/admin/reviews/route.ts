import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/admin/reviews - Fetch all reviews (admin only)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filter = searchParams.get("filter") || "all";

    let where: any = {};

    if (filter === "pending") {
      where.approved = false;
    } else if (filter === "approved") {
      where.approved = true;
    }

    const reviews = await prisma.customerReview.findMany({
      where,
      orderBy: { submittedAt: "desc" },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews", reviews: [] }, { status: 500 });
  }
}
