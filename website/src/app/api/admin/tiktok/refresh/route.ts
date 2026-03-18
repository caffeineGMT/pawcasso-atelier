import { NextResponse } from 'next/server';
import { updateAllAnalytics, getPerformanceSummary } from '@/lib/tiktok-analytics';

export async function POST() {
  try {
    const analytics = await updateAllAnalytics();
    const summary = getPerformanceSummary();

    return NextResponse.json({
      analytics,
      summary,
      message: 'Analytics refreshed successfully',
    });
  } catch (error) {
    console.error('Failed to refresh analytics:', error);
    return NextResponse.json(
      { error: 'Failed to refresh analytics' },
      { status: 500 }
    );
  }
}
