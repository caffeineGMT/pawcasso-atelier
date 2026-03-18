import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/admin/reviews/feature - Toggle featured status
export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Review ID required" }, { status: 400 });
    }

    // Get current review
    const currentReview = await prisma.customerReview.findUnique({
      where: { id },
    });

    if (!currentReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Toggle featured status
    const review = await prisma.customerReview.update({
      where: { id },
      data: {
        featured: !currentReview.featured,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Error toggling featured status:", error);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}
