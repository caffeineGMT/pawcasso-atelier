import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Track conversions from influencer affiliate links
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, revenue, utmSource, utmMedium, utmCampaign, discountCode } = body;

    if (!orderId || !revenue) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Find influencer by UTM campaign (handle) or discount code
    let influencer = null;

    if (utmCampaign && utmMedium === "influencer") {
      influencer = await prisma.influencer.findFirst({
        where: { utmCampaign },
      });
    }

    if (!influencer && discountCode) {
      influencer = await prisma.influencer.findFirst({
        where: { discountCode },
      });
    }

    if (!influencer) {
      console.log("No influencer found for conversion tracking");
      return NextResponse.json({ success: true, tracked: false });
    }

    // Calculate 15% commission
    const commission = revenue * 0.15;

    // Create conversion record
    await prisma.influencerConversion.create({
      data: {
        influencerId: influencer.id,
        orderId,
        revenue,
        commission,
        utmSource,
        utmMedium,
        utmCampaign,
      },
    });

    return NextResponse.json({ success: true, tracked: true, commission });
  } catch (error) {
    console.error("Error tracking conversion:", error);
    return NextResponse.json({ error: "Failed to track conversion" }, { status: 500 });
  }
}
