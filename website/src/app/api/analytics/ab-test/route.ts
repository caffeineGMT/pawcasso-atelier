import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Track A/B test events (assignments and conversions)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { testId, variant, eventType, revenue, metadata } = body;

    // Validate required fields
    if (!testId || !variant || !eventType) {
      return NextResponse.json(
        { success: false, error: 'testId, variant, and eventType are required' },
        { status: 400 }
      );
    }

    // Get user session
    let sessionId = req.cookies.get('ab_session')?.value;
    if (!sessionId) {
      sessionId = crypto.randomUUID();
    }

    // Store A/B test event
    await prisma.aBTestEvent.create({
      data: {
        testId,
        variant,
        eventType, // 'assignment' or 'conversion'
        sessionId,
        revenue: revenue || 0,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    const response = NextResponse.json({ success: true });

    // Set session cookie if new
    if (!req.cookies.get('ab_session')) {
      response.cookies.set('ab_session', sessionId, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        httpOnly: true,
        sameSite: 'lax',
      });
    }

    return response;
  } catch (error) {
    console.error('A/B test tracking error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track A/B test event' },
      { status: 500 }
    );
  }
}

/**
 * Get A/B test results - conversion rates by variant
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const testId = searchParams.get('testId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!testId) {
      return NextResponse.json(
        { success: false, error: 'testId is required' },
        { status: 400 }
      );
    }

    // Build date filter
    const dateFilter = {
      timestamp: {
        gte: startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        lte: endDate ? new Date(endDate) : new Date(),
      },
    };

    // Get all events for this test
    const events = await prisma.aBTestEvent.findMany({
      where: {
        testId,
        ...dateFilter,
      },
      orderBy: { timestamp: 'asc' },
    });

    // Calculate stats per variant
    const variantStats: Record<
      string,
      {
        assignments: number;
        conversions: number;
        revenue: number;
        conversionRate: number;
        revenuePerUser: number;
      }
    > = {};

    const variants = ['control', 'variant_a', 'variant_b', 'variant_c'];

    for (const variant of variants) {
      const variantEvents = events.filter((e) => e.variant === variant);
      const assignments = new Set(
        variantEvents.filter((e) => e.eventType === 'assignment').map((e) => e.sessionId)
      ).size;
      const conversions = new Set(
        variantEvents.filter((e) => e.eventType === 'conversion').map((e) => e.sessionId)
      ).size;
      const revenue = variantEvents
        .filter((e) => e.eventType === 'conversion')
        .reduce((sum, e) => sum + e.revenue, 0);

      variantStats[variant] = {
        assignments,
        conversions,
        revenue,
        conversionRate: assignments > 0 ? (conversions / assignments) * 100 : 0,
        revenuePerUser: assignments > 0 ? revenue / assignments : 0,
      };
    }

    // Calculate statistical significance (simplified chi-square test)
    const control = variantStats.control;
    const variantA = variantStats.variant_a;

    let pValue = null;
    let isSignificant = false;

    if (control.assignments > 30 && variantA.assignments > 30) {
      // Simple chi-square approximation
      const pooledRate =
        (control.conversions + variantA.conversions) /
        (control.assignments + variantA.assignments);

      const expectedControl = control.assignments * pooledRate;
      const expectedVariantA = variantA.assignments * pooledRate;

      const chiSquare =
        Math.pow(control.conversions - expectedControl, 2) / expectedControl +
        Math.pow(variantA.conversions - expectedVariantA, 2) / expectedVariantA;

      // Approximate p-value (df=1, chi-square distribution)
      pValue = 1 - Math.exp(-chiSquare / 2);
      isSignificant = pValue < 0.05;
    }

    return NextResponse.json({
      success: true,
      data: {
        testId,
        variantStats,
        winner:
          variantA.conversionRate > control.conversionRate &&
          isSignificant
            ? 'variant_a'
            : 'control',
        statisticalSignificance: {
          pValue,
          isSignificant,
          sampleSize: {
            control: control.assignments,
            variant_a: variantA.assignments,
          },
        },
        dateRange: {
          start: dateFilter.timestamp.gte.toISOString(),
          end: dateFilter.timestamp.lte.toISOString(),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching A/B test results:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch A/B test results' },
      { status: 500 }
    );
  }
}
