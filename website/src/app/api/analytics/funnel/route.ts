import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Track funnel progression events for conversion rate optimization
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { step, sessionId, timestamp, metadata } = body;

    // Validate required fields
    if (!step || !sessionId) {
      return NextResponse.json(
        { success: false, error: 'step and sessionId are required' },
        { status: 400 }
      );
    }

    // Store funnel event in database
    await prisma.funnelEvent.create({
      data: {
        step,
        sessionId,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Funnel tracking error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track funnel event' },
      { status: 500 }
    );
  }
}

/**
 * Get funnel analytics - conversion rates and drop-off analysis
 * Supports device-type filtering for mobile vs desktop comparison
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const deviceFilter = searchParams.get('device'); // 'mobile', 'tablet', 'desktop', or null for all

    // Build date filter
    const dateFilter = {
      timestamp: {
        gte: startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        lte: endDate ? new Date(endDate) : new Date(),
      },
    };

    // Get all funnel events in date range
    const events = await prisma.funnelEvent.findMany({
      where: dateFilter,
      orderBy: { timestamp: 'asc' },
    });

    // Helper to check device type from metadata
    const getDeviceType = (metadata: string | null): string => {
      if (!metadata) return 'unknown';
      try {
        const parsed = JSON.parse(metadata);
        return parsed.device_type || 'unknown';
      } catch { return 'unknown'; }
    };

    // All checkout funnel steps (new granular + legacy steps)
    const allSteps = [
      'landing', 'gallery', 'order_page',
      'view_product', 'photo_upload', 'style_selection',
      'tier_selection', 'checkout_form', 'checkout_initiate',
      'payment_redirect', 'purchase_complete', 'purchase',
      'funnel_complete',
    ];

    // Build per-device counts
    type DeviceCounts = Record<string, Set<string>>;
    const deviceGroups: Record<string, DeviceCounts> = {
      all: {},
      mobile: {},
      tablet: {},
      desktop: {},
    };

    for (const group of Object.values(deviceGroups)) {
      for (const step of allSteps) {
        group[step] = new Set();
      }
    }

    // Collect dropoff signals separately
    const dropoffSignals: Record<string, { count: number; sessions: Set<string> }> = {};

    events.forEach((event) => {
      const device = getDeviceType(event.metadata);
      const step = event.step;

      // Handle dropoff signal events
      if (step.startsWith('dropoff_')) {
        const signalType = step.replace('dropoff_', '');
        if (!dropoffSignals[signalType]) {
          dropoffSignals[signalType] = { count: 0, sessions: new Set() };
        }
        dropoffSignals[signalType].count++;
        dropoffSignals[signalType].sessions.add(event.sessionId);
        return;
      }

      // Regular funnel steps
      if (deviceGroups.all[step]) {
        deviceGroups.all[step].add(event.sessionId);
      }

      if (device && deviceGroups[device] && deviceGroups[device][step]) {
        deviceGroups[device][step].add(event.sessionId);
      }
    });

    // Convert sets to counts
    const toCountMap = (group: DeviceCounts): Record<string, number> => {
      const result: Record<string, number> = {};
      for (const [step, sessions] of Object.entries(group)) {
        result[step] = sessions.size;
      }
      return result;
    };

    // Calculate conversion rates between checkout steps
    const calcConversionRates = (counts: Record<string, number>) => {
      // Use the granular checkout steps
      const viewProduct = counts.view_product || counts.order_page || 0;
      const photoUpload = counts.photo_upload || 0;
      const styleSelection = counts.style_selection || 0;
      const tierSelection = counts.tier_selection || 0;
      const checkoutForm = counts.checkout_form || counts.checkout_initiate || 0;
      const paymentRedirect = counts.payment_redirect || 0;
      const purchaseComplete = counts.purchase_complete || counts.purchase || 0;

      return {
        view_to_upload: viewProduct > 0 ? (photoUpload / viewProduct) * 100 : 0,
        upload_to_style: photoUpload > 0 ? (styleSelection / photoUpload) * 100 : 0,
        style_to_tier: styleSelection > 0 ? (tierSelection / styleSelection) * 100 : 0,
        tier_to_form: tierSelection > 0 ? (checkoutForm / tierSelection) * 100 : 0,
        form_to_payment: checkoutForm > 0 ? (paymentRedirect / checkoutForm) * 100 : 0,
        payment_to_purchase: paymentRedirect > 0 ? (purchaseComplete / paymentRedirect) * 100 : 0,
        overall: viewProduct > 0 ? (purchaseComplete / viewProduct) * 100 : 0,
      };
    };

    // Build response based on device filter
    const targetGroup = deviceFilter && deviceGroups[deviceFilter]
      ? deviceFilter
      : 'all';

    const counts = toCountMap(deviceGroups[targetGroup]);
    const conversionRates = calcConversionRates(counts);

    // Drop-off rates
    const dropOffRates: Record<string, number> = {};
    for (const [key, rate] of Object.entries(conversionRates)) {
      if (key !== 'overall') {
        dropOffRates[key] = 100 - rate;
      }
    }

    // Build device comparison
    const deviceComparison = {
      mobile: {
        counts: toCountMap(deviceGroups.mobile),
        conversionRates: calcConversionRates(toCountMap(deviceGroups.mobile)),
      },
      tablet: {
        counts: toCountMap(deviceGroups.tablet),
        conversionRates: calcConversionRates(toCountMap(deviceGroups.tablet)),
      },
      desktop: {
        counts: toCountMap(deviceGroups.desktop),
        conversionRates: calcConversionRates(toCountMap(deviceGroups.desktop)),
      },
    };

    // Identify biggest mobile drop-off point
    const mobileRates = deviceComparison.mobile.conversionRates;
    const desktopRates = deviceComparison.desktop.conversionRates;
    const dropoffGaps: Array<{ step: string; mobile: number; desktop: number; gap: number }> = [];

    for (const key of Object.keys(mobileRates) as Array<keyof typeof mobileRates>) {
      if (key === 'overall') continue;
      const gap = (desktopRates[key] || 0) - (mobileRates[key] || 0);
      if (gap > 0) {
        dropoffGaps.push({
          step: key,
          mobile: mobileRates[key] || 0,
          desktop: desktopRates[key] || 0,
          gap,
        });
      }
    }
    dropoffGaps.sort((a, b) => b.gap - a.gap);

    // Format dropoff signals
    const formattedSignals: Record<string, { count: number; unique_sessions: number }> = {};
    for (const [type, data] of Object.entries(dropoffSignals)) {
      formattedSignals[type] = {
        count: data.count,
        unique_sessions: data.sessions.size,
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        funnelCounts: counts,
        conversionRates,
        dropOffRates,
        overallConversion: conversionRates.overall,
        deviceComparison,
        mobileDropoffHotspots: dropoffGaps.slice(0, 5),
        dropoffSignals: formattedSignals,
        dateRange: {
          start: dateFilter.timestamp.gte.toISOString(),
          end: dateFilter.timestamp.lte.toISOString(),
        },
        deviceFilter: targetGroup,
      },
    });
  } catch (error) {
    console.error('Error fetching funnel analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch funnel analytics' },
      { status: 500 }
    );
  }
}
