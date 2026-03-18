import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/reviews - Fetch customer reviews
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filter = searchParams.get("filter") || "all";
    const sortBy = searchParams.get("sortBy") || "recent";

    // Build query
    const where: any = { approved: true };

    if (filter === "featured") {
      where.featured = true;
    } else if (filter === "instagram") {
      where.instagramPostUrl = { not: null };
    }

    // Determine sort order
    const orderBy: any = {};
    if (sortBy === "rating") {
      orderBy.rating = "desc";
      orderBy.submittedAt = "desc"; // Secondary sort
    } else {
      orderBy.submittedAt = "desc";
    }

    const reviews = await prisma.customerReview.findMany({
      where,
      orderBy,
      take: 50, // Limit to 50 reviews
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews", reviews: [] }, { status: 500 });
  }
}

// POST /api/reviews - Submit a new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerEmail,
      customerName,
      petName,
      rating,
      reviewText,
      petPhotoUrl,
      portraitUrl,
      instagramHandle,
      instagramPostUrl,
      artStyle,
      orderValue,
    } = body;

    // Validation
    if (!customerEmail || !customerName || !petName || !rating || !reviewText) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
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
        rating: parseInt(rating),
        reviewText,
        petPhotoUrl: petPhotoUrl || null,
        portraitUrl: portraitUrl || null,
        instagramHandle: instagramHandle || null,
        instagramPostUrl: instagramPostUrl || null,
        artStyle: artStyle || null,
        orderValue: orderValue ? parseFloat(orderValue) : null,
        approved: false, // Admin must approve
        featured: false,
      },
    });

    // Update stats
    await updateSocialProofStats();

    return NextResponse.json({
      success: true,
      message: "Thank you for your review! It will be published after approval.",
      review,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}

// Helper function to update social proof stats
async function updateSocialProofStats() {
  try {
    const totalCustomers = await prisma.customer.count();
    const totalReviews = await prisma.customerReview.count({ where: { approved: true } });
    const reviews = await prisma.customerReview.findMany({ where: { approved: true } });
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 4.9;

    // Get or create stats record
    const stats = await prisma.socialProofStats.findFirst();
    if (stats) {
      await prisma.socialProofStats.update({
        where: { id: stats.id },
        data: {
          totalCustomers,
          totalReviews,
          averageRating,
        },
      });
    } else {
      await prisma.socialProofStats.create({
        data: {
          totalCustomers,
          totalReviews,
          averageRating,
          totalPortraits: 0,
          instagramFollowers: 0,
        },
      });
    }
  } catch (error) {
    console.error("Error updating social proof stats:", error);
  }
}
