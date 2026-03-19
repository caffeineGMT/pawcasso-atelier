import { NextRequest, NextResponse } from "next/server";
import { getPricingTestStats, DEFAULT_TEST_CONFIG } from "@/lib/ab-pricing";

export const dynamic = 'force-dynamic';

/**
 * API endpoint to retrieve A/B test statistics
 * Supports date range filtering via query params
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    const startDate = startDateParam ? new Date(startDateParam) : undefined;
    const endDate = endDateParam ? new Date(endDateParam) : undefined;

    const stats = await getPricingTestStats(
      DEFAULT_TEST_CONFIG.id,
      startDate,
      endDate
    );

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching A/B test stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
