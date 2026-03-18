import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { influencers } = body;

    if (!influencers || !Array.isArray(influencers)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    const created = [];
    const errors = [];

    for (const inf of influencers) {
      try {
        const { name, handle, platform, followerCount, email, notes, profileUrl } = inf;

        if (!name || !handle || !platform || !followerCount) {
          errors.push({ handle: handle || "unknown", error: "Missing required fields" });
          continue;
        }

        // Check if already exists
        const existing = await prisma.influencer.findUnique({
          where: { handle },
        });

        if (existing) {
          errors.push({ handle, error: "Already exists" });
          continue;
        }

        const discountCode = `${handle.toUpperCase().replace(/[^A-Z0-9]/g, "").substring(0, 10)}20`;
        const utmSource = platform;
        const utmMedium = "influencer";
        const utmCampaign = handle;
        const affiliateLink = `https://pawcasso-atelier.vercel.app/?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}&discount=${discountCode}`;
        const estimatedReach = Math.floor(followerCount * 0.1);

        const influencer = await prisma.influencer.create({
          data: {
            name,
            handle,
            platform,
            followerCount,
            email,
            notes,
            profileUrl,
            discountCode,
            affiliateLink,
            utmSource,
            utmMedium,
            utmCampaign,
            estimatedReach,
          },
        });

        // Create Stripe coupon
        if (process.env.STRIPE_SECRET_KEY) {
          try {
            const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
            await stripe.coupons.create({
              id: discountCode,
              percent_off: 20,
              duration: "forever",
              name: `Influencer: ${name} (@${handle})`,
            });
          } catch (stripeError) {
            console.error("Stripe coupon error:", stripeError);
          }
        }

        created.push(influencer);
      } catch (error) {
        errors.push({ handle: inf.handle || "unknown", error: String(error) });
      }
    }

    return NextResponse.json({ created: created.length, errors });
  } catch (error) {
    console.error("Error bulk importing:", error);
    return NextResponse.json({ error: "Failed to bulk import" }, { status: 500 });
  }
}
