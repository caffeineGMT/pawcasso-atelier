import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getPerformanceSummary, loadAnalytics } from '@/lib/tiktok-analytics';

export async function GET() {
  try {
    // Load queue
    const queuePath = path.join(process.cwd(), 'tiktok-queue.json');
    let queue = [];
    if (fs.existsSync(queuePath)) {
      queue = JSON.parse(fs.readFileSync(queuePath, 'utf-8'));
    }

    // Load analytics
    const analytics = loadAnalytics();
    const summary = getPerformanceSummary();

    return NextResponse.json({
      queue,
      analytics,
      summary,
    });
  } catch (error) {
    console.error('Failed to load TikTok stats:', error);
    return NextResponse.json(
      { error: 'Failed to load stats' },
      { status: 500 }
    );
  }
}
