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
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

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

    // Calculate unique sessions per step
    const stepCounts: Record<string, Set<string>> = {
      landing: new Set(),
      gallery: new Set(),
      order_page: new Set(),
      photo_upload: new Set(),
      tier_selection: new Set(),
      checkout_initiate: new Set(),
      purchase: new Set(),
    };

    events.forEach((event) => {
      if (stepCounts[event.step]) {
        stepCounts[event.step].add(event.sessionId);
      }
    });

    // Convert to counts
    const funnelData = {
      landing: stepCounts.landing.size,
      gallery: stepCounts.gallery.size,
      order_page: stepCounts.order_page.size,
      photo_upload: stepCounts.photo_upload.size,
      tier_selection: stepCounts.tier_selection.size,
      checkout_initiate: stepCounts.checkout_initiate.size,
      purchase: stepCounts.purchase.size,
    };

    // Calculate conversion rates between steps
    const conversionRates = {
      landing_to_gallery: funnelData.landing > 0 ? (funnelData.gallery / funnelData.landing) * 100 : 0,
      gallery_to_order: funnelData.gallery > 0 ? (funnelData.order_page / funnelData.gallery) * 100 : 0,
      order_to_upload: funnelData.order_page > 0 ? (funnelData.photo_upload / funnelData.order_page) * 100 : 0,
      upload_to_tier: funnelData.photo_upload > 0 ? (funnelData.tier_selection / funnelData.photo_upload) * 100 : 0,
      tier_to_checkout: funnelData.tier_selection > 0 ? (funnelData.checkout_initiate / funnelData.tier_selection) * 100 : 0,
      checkout_to_purchase: funnelData.checkout_initiate > 0 ? (funnelData.purchase / funnelData.checkout_initiate) * 100 : 0,
    };

    // Overall conversion rate (landing → purchase)
    const overallConversion = funnelData.landing > 0 ? (funnelData.purchase / funnelData.landing) * 100 : 0;

    // Calculate drop-off rates (inverse of conversion)
    const dropOffRates = {
      landing_to_gallery: 100 - conversionRates.landing_to_gallery,
      gallery_to_order: 100 - conversionRates.gallery_to_order,
      order_to_upload: 100 - conversionRates.order_to_upload,
      upload_to_tier: 100 - conversionRates.upload_to_tier,
      tier_to_checkout: 100 - conversionRates.tier_to_checkout,
      checkout_to_purchase: 100 - conversionRates.checkout_to_purchase,
    };

    return NextResponse.json({
      success: true,
      data: {
        funnelCounts: funnelData,
        conversionRates,
        dropOffRates,
        overallConversion,
        totalSessions: funnelData.landing,
        totalPurchases: funnelData.purchase,
        dateRange: {
          start: dateFilter.timestamp.gte.toISOString(),
          end: dateFilter.timestamp.lte.toISOString(),
        },
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
