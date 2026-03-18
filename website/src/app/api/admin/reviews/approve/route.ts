import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/admin/reviews/approve - Approve a review
export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Review ID required" }, { status: 400 });
    }

    const review = await prisma.customerReview.update({
      where: { id },
      data: {
        approved: true,
        approvedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Error approving review:", error);
    return NextResponse.json({ error: "Failed to approve review" }, { status: 500 });
  }
}
