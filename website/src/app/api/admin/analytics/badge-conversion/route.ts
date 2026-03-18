import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /api/admin/analytics/badge-conversion
 *
 * Analyzes conversion rates for pricing badges (Most Popular vs Best Value)
 * Returns metrics to determine which badge converts better
 */
export async function GET(req: NextRequest) {
  try {
    // Get all orders with badge tracking
    const orders = await prisma.order.findMany({
      where: {
        status: 'completed',
        paidAt: {
          not: null,
        },
      },
      select: {
        id: true,
        tier: true,
        tierName: true,
        amount: true,
        pricingBadge: true,
        createdAt: true,
        paidAt: true,
      },
      orderBy: {
        paidAt: 'desc',
      },
    });

    // Calculate conversion metrics by badge
    const badgeMetrics: Record<string, {
      badge: string;
      views: number;
      conversions: number;
      conversionRate: number;
      revenue: number;
      avgOrderValue: number;
      tierBreakdown: Record<string, number>;
    }> = {};

    // Initialize metrics for each badge type
    const badgeTypes = ['Most Popular', 'Best Value', 'none'];
    badgeTypes.forEach(badge => {
      badgeMetrics[badge] = {
        badge,
        views: 0,
        conversions: 0,
        conversionRate: 0,
        revenue: 0,
        avgOrderValue: 0,
        tierBreakdown: {},
      };
    });

    // Process orders
    orders.forEach(order => {
      const badge = order.pricingBadge || 'none';

      if (!badgeMetrics[badge]) {
        badgeMetrics[badge] = {
          badge,
          views: 0,
          conversions: 0,
          conversionRate: 0,
          revenue: 0,
          avgOrderValue: 0,
          tierBreakdown: {},
        };
      }

      badgeMetrics[badge].conversions++;
      badgeMetrics[badge].revenue += order.amount;

      // Track tier breakdown
      const tier = order.tier;
      if (!badgeMetrics[badge].tierBreakdown[tier]) {
        badgeMetrics[badge].tierBreakdown[tier] = 0;
      }
      badgeMetrics[badge].tierBreakdown[tier]++;
    });

    // Calculate averages and conversion rates
    Object.values(badgeMetrics).forEach(metric => {
      if (metric.conversions > 0) {
        metric.avgOrderValue = metric.revenue / metric.conversions;
      }
      // Note: We can't calculate true conversion rate without view tracking
      // This would require additional analytics events
    });

    // Tier-specific analysis
    const tierAnalysis = {
      premium: {
        mostPopularConversions: orders.filter(o => o.tier === 'premium' && o.pricingBadge === 'Most Popular').length,
        noBadgeConversions: orders.filter(o => o.tier === 'premium' && !o.pricingBadge).length,
        totalRevenue: orders.filter(o => o.tier === 'premium').reduce((sum, o) => sum + o.amount, 0),
      },
      deluxe: {
        bestValueConversions: orders.filter(o => o.tier === 'deluxe' && o.pricingBadge === 'Best Value').length,
        noBadgeConversions: orders.filter(o => o.tier === 'deluxe' && !o.pricingBadge).length,
        totalRevenue: orders.filter(o => o.tier === 'deluxe').reduce((sum, o) => sum + o.amount, 0),
      },
    };

    // Overall summary
    const summary = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + o.amount, 0),
      avgOrderValue: orders.length > 0 ? orders.reduce((sum, o) => sum + o.amount, 0) / orders.length : 0,
      ordersWithBadges: orders.filter(o => o.pricingBadge).length,
      ordersWithoutBadges: orders.filter(o => !o.pricingBadge).length,
    };

    // Winner determination (basic heuristic)
    const winner = {
      badge: '',
      reason: '',
      recommendation: '',
    };

    const mostPopular = badgeMetrics['Most Popular'];
    const bestValue = badgeMetrics['Best Value'];

    if (mostPopular.conversions > bestValue.conversions && mostPopular.avgOrderValue > bestValue.avgOrderValue) {
      winner.badge = 'Most Popular';
      winner.reason = `Higher conversions (${mostPopular.conversions} vs ${bestValue.conversions}) and AOV ($${mostPopular.avgOrderValue.toFixed(2)} vs $${bestValue.avgOrderValue.toFixed(2)})`;
      winner.recommendation = 'Apply "Most Popular" badge to Premium tier';
    } else if (bestValue.conversions > mostPopular.conversions && bestValue.avgOrderValue > mostPopular.avgOrderValue) {
      winner.badge = 'Best Value';
      winner.reason = `Higher conversions (${bestValue.conversions} vs ${mostPopular.conversions}) and AOV ($${bestValue.avgOrderValue.toFixed(2)} vs $${mostPopular.avgOrderValue.toFixed(2)})`;
      winner.recommendation = 'Apply "Best Value" badge to Deluxe tier (or test on Premium)';
    } else if (mostPopular.revenue > bestValue.revenue) {
      winner.badge = 'Most Popular';
      winner.reason = `Higher total revenue ($${mostPopular.revenue.toFixed(2)} vs $${bestValue.revenue.toFixed(2)})`;
      winner.recommendation = 'Optimize for "Most Popular" messaging';
    } else {
      winner.badge = 'Inconclusive';
      winner.reason = 'Not enough data or metrics are too close';
      winner.recommendation = 'Continue testing with more orders (need at least 50+ conversions per badge)';
    }

    return NextResponse.json({
      summary,
      badgeMetrics: Object.values(badgeMetrics),
      tierAnalysis,
      winner,
      dataQuality: {
        sampleSize: orders.length,
        ordersWithBadgeData: orders.filter(o => o.pricingBadge).length,
        confidence: orders.length >= 100 ? 'high' : orders.length >= 50 ? 'medium' : 'low',
      },
    });
  } catch (error) {
    console.error("Badge conversion analytics error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch analytics";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
