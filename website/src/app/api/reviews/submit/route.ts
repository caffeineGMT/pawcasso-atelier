import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { put } from "@vercel/blob";

const prisma = new PrismaClient();

// POST /api/reviews/submit - Public review submission form with photo upload
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
    const orderId = formData.get("orderId") as string | null;
    const petPhoto = formData.get("petPhoto") as File | null;

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

    // Upload photo to Vercel Blob if provided
    let petPhotoUrl: string | null = null;
    if (petPhoto && petPhoto.size > 0) {
      if (petPhoto.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Photo must be under 10MB" },
          { status: 400 }
        );
      }

      if (!petPhoto.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Please upload an image file" },
          { status: 400 }
        );
      }

      try {
        const ext = petPhoto.name.split(".").pop() || "jpg";
        const filename = `reviews/${customerEmail.replace(/[^a-zA-Z0-9]/g, "_")}_${Date.now()}.${ext}`;
        const blob = await put(filename, petPhoto, {
          access: "public",
          contentType: petPhoto.type,
        });
        petPhotoUrl = blob.url;
      } catch (uploadError) {
        console.error("Failed to upload review photo:", uploadError);
        // Continue without photo
      }
    }

    // Look up portrait URL from the order if we have an orderId
    let portraitUrl: string | null = null;
    let artStyle: string | null = null;
    let orderValue: number | null = null;

    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: {
          portraitUrls: true,
          style: true,
          amount: true,
        },
      });

      if (order) {
        portraitUrl = order.portraitUrls?.split(",")[0] || null;
        artStyle = order.style;
        orderValue = order.amount;
      }
    }

    // Create review (pending approval)
    await prisma.customerReview.create({
      data: {
        customerEmail,
        customerName,
        petName,
        rating: ratingNum,
        reviewText,
        petPhotoUrl: petPhotoUrl || null,
        portraitUrl: portraitUrl || null,
        instagramHandle: instagramHandle || null,
        instagramPostUrl: instagramPostUrl || null,
        artStyle,
        orderValue,
        approved: false,
        featured: false,
      },
    });

    // Track the submission event
    await prisma.analyticsEvent.create({
      data: {
        eventName: "review_submitted",
        userId: customerEmail,
        pathname: "/submit-review",
        metadata: JSON.stringify({
          rating: ratingNum,
          hasPhoto: !!petPhotoUrl,
          hasInstagram: !!instagramPostUrl,
          source: orderId ? "email" : "organic",
        }),
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
