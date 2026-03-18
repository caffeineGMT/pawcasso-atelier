import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/referral/influencer
 * Create influencer-specific promo code via Stripe Promotion Codes API
 *
 * Body: { influencerId: string }
 * Returns: { promoCode: string, stripePromotionCodeId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { influencerId } = body;

    if (!influencerId) {
      return NextResponse.json({ error: "Missing influencerId" }, { status: 400 });
    }

    // Get influencer from database
    const influencer = await prisma.influencer.findUnique({
      where: { id: influencerId },
    });

    if (!influencer) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }

    const stripe = getStripe();

    // Create or get the 20% off coupon
    let coupon;
    const couponId = `INFLUENCER_20PCT`;

    try {
      coupon = await stripe.coupons.retrieve(couponId);
    } catch (error) {
      // Coupon doesn't exist, create it
      coupon = await stripe.coupons.create({
        id: couponId,
        percent_off: 20,
        duration: "forever",
        name: "Influencer 20% Off",
      });
    }

    // Generate unique promo code for this influencer
    const promoCode = influencer.discountCode || `${influencer.handle.toUpperCase().replace(/[^A-Z0-9]/g, "").substring(0, 10)}20`;

    // Create Stripe Promotion Code
    const promotionCode = await stripe.promotionCodes.create({
      coupon: coupon.id,
      code: promoCode,
      metadata: {
        influencer_id: influencer.id,
        influencer_handle: influencer.handle,
        influencer_platform: influencer.platform,
        influencer_name: influencer.name,
        commission_rate: "0.15", // 15% commission
      },
    } as any);

    // Update influencer record with promo code info
    await prisma.influencer.update({
      where: { id: influencerId },
      data: {
        discountCode: promoCode,
      },
    });

    return NextResponse.json({
      promoCode: promotionCode.code,
      stripePromotionCodeId: promotionCode.id,
      couponId: coupon.id,
      discountPercent: 20,
      influencerId: influencer.id,
    });
  } catch (error: any) {
    console.error("Error creating influencer promo code:", error);

    // Handle specific Stripe errors
    if (error.type === 'StripeInvalidRequestError' && error.message?.includes('already exists')) {
      return NextResponse.json({
        error: "Promo code already exists in Stripe. Please use a different code."
      }, { status: 409 });
    }

    return NextResponse.json({
      error: error.message || "Failed to create promo code"
    }, { status: 500 });
  }
}

/**
 * GET /api/referral/influencer?influencerId=xxx
 * Fetch sales data for a specific influencer
 *
 * Query: influencerId (optional), all (boolean to get all influencers)
 * Returns: Sales data with commission calculations
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const influencerId = searchParams.get("influencerId");
    const getAll = searchParams.get("all") === "true";

    const stripe = getStripe();

    if (getAll) {
      // Get all influencers with their sales data
      const influencers = await prisma.influencer.findMany({
        include: {
          conversions: true,
        },
        orderBy: { createdAt: "desc" },
      });

      // For each influencer, fetch Stripe promotion code usage
      const influencersWithSales = await Promise.all(
        influencers.map(async (influencer) => {
          let stripeRedemptions = 0;
          let totalRevenue = 0;

          if (influencer.discountCode) {
            try {
              // Search for promotion code in Stripe
              const promotionCodes = await stripe.promotionCodes.list({
                code: influencer.discountCode,
                limit: 1,
              });

              if (promotionCodes.data.length > 0) {
                const promoCode = promotionCodes.data[0];
                stripeRedemptions = promoCode.times_redeemed || 0;

                // Fetch checkout sessions that used this promo code
                // Note: This is a simplified approach. In production, you'd track this via webhooks
                const sessions = await stripe.checkout.sessions.list({
                  limit: 100,
                });

                // Filter sessions that used this promo code
                const relevantSessions = sessions.data.filter((session) => {
                  return session.metadata?.discountCode === influencer.discountCode ||
                         session.total_details?.breakdown?.discounts?.some(d => d.discount?.promotion_code === promoCode.id);
                });

                totalRevenue = relevantSessions.reduce((sum, session) => {
                  return sum + (session.amount_total || 0) / 100; // Convert cents to dollars
                }, 0);
              }
            } catch (error) {
              console.error(`Error fetching Stripe data for ${influencer.handle}:`, error);
            }
          }

          // Calculate from database conversions as fallback/supplement
          const dbRevenue = influencer.conversions.reduce((sum, conv) => sum + conv.revenue, 0);
          const dbCommission = influencer.conversions.reduce((sum, conv) => sum + conv.commission, 0);

          return {
            id: influencer.id,
            name: influencer.name,
            handle: influencer.handle,
            platform: influencer.platform,
            followerCount: influencer.followerCount,
            status: influencer.status,
            discountCode: influencer.discountCode,
            sales: Math.max(influencer.conversions.length, stripeRedemptions),
            revenue: Math.max(dbRevenue, totalRevenue),
            commission: dbCommission || (totalRevenue * 0.15),
            stripeRedemptions,
            dbConversions: influencer.conversions.length,
          };
        })
      );

      return NextResponse.json({ influencers: influencersWithSales });
    }

    if (!influencerId) {
      return NextResponse.json({ error: "Missing influencerId or all=true parameter" }, { status: 400 });
    }

    // Get specific influencer
    const influencer = await prisma.influencer.findUnique({
      where: { id: influencerId },
      include: {
        conversions: {
          orderBy: { conversionDate: "desc" },
        },
      },
    });

    if (!influencer) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }

    // Fetch Stripe promotion code data
    let stripeData = null;
    if (influencer.discountCode) {
      try {
        const promotionCodes = await stripe.promotionCodes.list({
          code: influencer.discountCode,
          limit: 1,
        });

        if (promotionCodes.data.length > 0) {
          const promoCode = promotionCodes.data[0] as any;
          stripeData = {
            id: promoCode.id,
            code: promoCode.code,
            timesRedeemed: promoCode.times_redeemed,
            active: promoCode.active,
            coupon: {
              percentOff: promoCode.coupon?.percent_off,
              amountOff: promoCode.coupon?.amount_off,
            },
          };
        }
      } catch (error) {
        console.error("Error fetching Stripe promo code:", error);
      }
    }

    // Calculate totals from database conversions
    const totalSales = influencer.conversions.length;
    const totalRevenue = influencer.conversions.reduce((sum, conv) => sum + conv.revenue, 0);
    const totalCommission = influencer.conversions.reduce((sum, conv) => sum + conv.commission, 0);

    return NextResponse.json({
      influencer: {
        id: influencer.id,
        name: influencer.name,
        handle: influencer.handle,
        platform: influencer.platform,
        followerCount: influencer.followerCount,
        email: influencer.email,
        status: influencer.status,
        discountCode: influencer.discountCode,
        affiliateLink: influencer.affiliateLink,
      },
      sales: {
        total: totalSales,
        revenue: totalRevenue,
        commission: totalCommission,
      },
      conversions: influencer.conversions.map((conv) => ({
        id: conv.id,
        orderId: conv.orderId,
        revenue: conv.revenue,
        commission: conv.commission,
        date: conv.conversionDate,
      })),
      stripeData,
    });
  } catch (error: any) {
    console.error("Error fetching influencer sales data:", error);
    return NextResponse.json({
      error: error.message || "Failed to fetch sales data"
    }, { status: 500 });
  }
}
