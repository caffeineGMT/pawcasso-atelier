import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/reviews/submit - Public review submission form
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const customerEmail = formData.get("email") as string;
    const customerName = formData.get("name") as string;
    const petName = formData.get("petName") as string;
    const rating = formData.get("rating") as string;
    const reviewText = formData.get("review") as string;
    const instagramHandle = formData.get("instagramHandle") as string | null;
    const instagramPostUrl = formData.get("instagramPostUrl") as string | null;

    // Validation
    if (!customerEmail || !customerName || !petName || !rating || !reviewText) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const ratingNum = parseInt(rating);
    if (ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Create review (pending approval)
    const review = await prisma.customerReview.create({
      data: {
        customerEmail,
        customerName,
        petName,
        rating: ratingNum,
        reviewText,
        instagramHandle: instagramHandle || null,
        instagramPostUrl: instagramPostUrl || null,
        approved: false, // Admin must approve
        featured: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for your review! It will be published after approval.",
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
