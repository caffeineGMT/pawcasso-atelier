import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const platform = searchParams.get("platform");

    const where: any = {};
    if (status) where.status = status;
    if (platform) where.platform = platform;

    const influencers = await prisma.influencer.findMany({
      where,
      include: {
        outreachMessages: {
          orderBy: { sentAt: "desc" },
          take: 1,
        },
        conversions: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate total conversions and revenue
    const stats = influencers.reduce(
      (acc, inf) => {
        acc.totalInfluencers++;
        if (inf.status === "posted") acc.posted++;
        if (inf.status === "agreed") acc.agreed++;
        if (inf.status === "responded") acc.responded++;
        if (inf.status === "contacted") acc.contacted++;

        const revenue = inf.conversions.reduce((sum, conv) => sum + conv.revenue, 0);
        const commission = inf.conversions.reduce((sum, conv) => sum + conv.commission, 0);
        acc.totalRevenue += revenue;
        acc.totalCommission += commission;

        return acc;
      },
      { totalInfluencers: 0, contacted: 0, responded: 0, agreed: 0, posted: 0, totalRevenue: 0, totalCommission: 0 }
    );

    return NextResponse.json({ influencers, stats });
  } catch (error) {
    console.error("Error fetching influencers:", error);
    return NextResponse.json({ error: "Failed to fetch influencers" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, handle, platform, followerCount, email, notes, profileUrl } = body;

    if (!name || !handle || !platform || !followerCount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate discount code (20% off)
    const discountCode = `${handle.toUpperCase().replace(/[^A-Z0-9]/g, "").substring(0, 10)}20`;

    // Generate UTM parameters
    const utmSource = platform;
    const utmMedium = "influencer";
    const utmCampaign = handle;

    // Generate affiliate link with UTM parameters
    const affiliateLink = `https://pawcasso-atelier.vercel.app/?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}&discount=${discountCode}`;

    // Calculate estimated reach (conservative: 10% of followers)
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

    // Create Stripe coupon for this influencer
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
        console.error("Error creating Stripe coupon:", stripeError);
        // Continue even if Stripe fails
      }
    }

    return NextResponse.json({ influencer });
  } catch (error) {
    console.error("Error creating influencer:", error);
    return NextResponse.json({ error: "Failed to create influencer" }, { status: 500 });
  }
}
