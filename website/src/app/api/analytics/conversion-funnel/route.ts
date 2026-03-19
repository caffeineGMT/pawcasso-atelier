import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Conversion Funnel API - Track customer journey from homepage to purchase
 *
 * Funnel Steps:
 * 1. Homepage View (page_view on /)
 * 2. Product Page View (order_start on /order)
 * 3. Add to Cart (photo_upload - when user uploads pet photo)
 * 4. Checkout Started (checkout_start - when user enters checkout form)
 * 5. Payment Complete (purchase_complete - successful payment)
 */

interface FunnelStepData {
  step: string;
  label: string;
  count: number;
  uniqueSessions: number;
  conversionRate: number;
  dropOffRate: number;
  dropOffCount: number;
}

interface TimeSeriesData {
  date: string;
  [key: string]: number | string;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const timeRange = searchParams.get('timeRange') || '7d'; // 1d, 7d, 30d, 90d

    // Calculate date range
    const daysMap: Record<string, number> = {
      '1d': 1,
      '7d': 7,
      '30d': 30,
      '90d': 90,
    };
    const days = daysMap[timeRange] || 7;

    const startDateTime = startDate
      ? new Date(startDate)
      : new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const endDateTime = endDate
      ? new Date(endDate)
      : new Date();

    // Fetch all analytics events in the time range
    const events = await prisma.analyticsEvent.findMany({
      where: {
        createdAt: {
          gte: startDateTime,
          lte: endDateTime,
        },
        eventName: {
          in: ['page_view', 'order_start', 'photo_upload', 'checkout_start', 'purchase_complete'],
        },
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        eventName: true,
        sessionId: true,
        userId: true,
        pathname: true,
        revenue: true,
        createdAt: true,
        utmSource: true,
        utmMedium: true,
        utmCampaign: true,
      },
    });

    // Define funnel steps
    const funnelSteps = [
      { name: 'page_view', label: 'Homepage View', filter: (e: typeof events[0]) => e.pathname === '/' },
      { name: 'order_start', label: 'Product Page View' },
      { name: 'photo_upload', label: 'Add to Cart' },
      { name: 'checkout_start', label: 'Checkout Started' },
      { name: 'purchase_complete', label: 'Payment Complete' },
    ];

    // Track unique sessions for each step
    const sessionsByStep: Record<string, Set<string>> = {};
    const eventsByStep: Record<string, typeof events> = {};

    funnelSteps.forEach(step => {
      sessionsByStep[step.name] = new Set();
      eventsByStep[step.name] = [];
    });

    // Process events
    events.forEach(event => {
      const step = funnelSteps.find(s => {
        if (s.name === 'page_view') {
          return event.eventName === 'page_view' && event.pathname === '/';
        }
        return event.eventName === s.name;
      });

      if (step) {
        sessionsByStep[step.name].add(event.sessionId);
        eventsByStep[step.name].push(event);
      }
    });

    // Calculate funnel metrics
    const funnelData: FunnelStepData[] = [];
    let previousCount = 0;

    funnelSteps.forEach((step, index) => {
      const count = sessionsByStep[step.name].size;
      const firstStepCount = sessionsByStep[funnelSteps[0].name].size;

      const conversionRate = firstStepCount > 0
        ? (count / firstStepCount) * 100
        : 0;

      const dropOffFromPrevious = index > 0 && previousCount > 0
        ? ((previousCount - count) / previousCount) * 100
        : 0;

      const dropOffCount = index > 0 ? previousCount - count : 0;

      funnelData.push({
        step: step.name,
        label: step.label,
        count,
        uniqueSessions: count,
        conversionRate,
        dropOffRate: dropOffFromPrevious,
        dropOffCount,
      });

      previousCount = count;
    });

    // Calculate overall metrics
    const totalRevenue = eventsByStep.purchase_complete.reduce(
      (sum, event) => sum + (event.revenue || 0),
      0
    );

    const overallConversionRate = sessionsByStep.page_view.size > 0
      ? (sessionsByStep.purchase_complete.size / sessionsByStep.page_view.size) * 100
      : 0;

    const avgOrderValue = sessionsByStep.purchase_complete.size > 0
      ? totalRevenue / sessionsByStep.purchase_complete.size
      : 0;

    // Identify biggest drop-off points
    const dropOffPoints = funnelData
      .filter((step, index) => index > 0)
      .sort((a, b) => b.dropOffRate - a.dropOffRate)
      .slice(0, 3);

    // Time series data (daily breakdown)
    const timeSeriesData: TimeSeriesData[] = [];
    const dayInMs = 24 * 60 * 60 * 1000;

    for (let date = new Date(startDateTime); date <= endDateTime; date = new Date(date.getTime() + dayInMs)) {
      const dateStr = date.toISOString().split('T')[0];
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));

      const dayData: TimeSeriesData = { date: dateStr };

      funnelSteps.forEach(step => {
        const sessionSet = new Set<string>();
        events.forEach(event => {
          if (
            event.createdAt >= dayStart &&
            event.createdAt <= dayEnd &&
            ((step.name === 'page_view' && event.eventName === 'page_view' && event.pathname === '/') ||
             (step.name !== 'page_view' && event.eventName === step.name))
          ) {
            sessionSet.add(event.sessionId);
          }
        });
        dayData[step.name] = sessionSet.size;
      });

      timeSeriesData.push(dayData);
    }

    // UTM source breakdown
    const sourceBreakdown: Record<string, {
      sessions: Set<string>;
      conversions: number;
      revenue: number;
    }> = {};

    events.forEach(event => {
      const source = event.utmSource || 'direct';
      if (!sourceBreakdown[source]) {
        sourceBreakdown[source] = {
          sessions: new Set(),
          conversions: 0,
          revenue: 0,
        };
      }

      sourceBreakdown[source].sessions.add(event.sessionId);

      if (event.eventName === 'purchase_complete') {
        sourceBreakdown[source].conversions++;
        sourceBreakdown[source].revenue += event.revenue || 0;
      }
    });

    const sourceData = Object.entries(sourceBreakdown).map(([source, data]) => ({
      source,
      sessions: data.sessions.size,
      conversions: data.conversions,
      revenue: data.revenue,
      conversionRate: data.sessions.size > 0
        ? (data.conversions / data.sessions.size) * 100
        : 0,
    })).sort((a, b) => b.sessions - a.sessions);

    return NextResponse.json({
      success: true,
      data: {
        funnel: funnelData,
        metrics: {
          totalSessions: sessionsByStep.page_view.size,
          totalConversions: sessionsByStep.purchase_complete.size,
          overallConversionRate,
          totalRevenue,
          avgOrderValue,
        },
        dropOffPoints,
        timeSeries: timeSeriesData,
        sourceBreakdown: sourceData,
        dateRange: {
          start: startDateTime.toISOString(),
          end: endDateTime.toISOString(),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching conversion funnel:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch conversion funnel data' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
