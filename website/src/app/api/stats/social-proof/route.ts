import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/stats/social-proof - Get social proof statistics
export async function GET() {
  try {
    // Try to get from database
    let stats = await prisma.socialProofStats.findFirst();

    if (!stats) {
      // Calculate stats if not in database
      const totalCustomers = await prisma.customer.count();
      const totalReviews = await prisma.customerReview.count({ where: { approved: true } });
      const reviews = await prisma.customerReview.findMany({ where: { approved: true } });
      const averageRating =
        reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 4.9;

      // Create default stats
      stats = await prisma.socialProofStats.create({
        data: {
          totalCustomers: Math.max(totalCustomers, 200), // Start at 200 minimum
          totalPortraits: Math.max(totalReviews * 2, 350), // Assume 2 portraits per customer on average
          averageRating,
          totalReviews: Math.max(totalReviews, 120), // Start at 120 minimum
          instagramFollowers: 0,
        },
      });
    }

    return NextResponse.json({
      stats: {
        totalCustomers: stats.totalCustomers,
        totalPortraits: stats.totalPortraits,
        averageRating: parseFloat(stats.averageRating.toFixed(1)),
        totalReviews: stats.totalReviews,
      },
    });
  } catch (error) {
    console.error("Error fetching social proof stats:", error);
    // Return default values on error
    return NextResponse.json({
      stats: {
        totalCustomers: 200,
        totalPortraits: 350,
        averageRating: 4.9,
        totalReviews: 120,
      },
    });
  }
}
