import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventName, metadata, revenue, sessionId, userId, utm } = body;

    // Validate required fields
    if (!eventName) {
      return NextResponse.json(
        { success: false, error: 'eventName is required' },
        { status: 400 }
      );
    }

    // Create analytics event
    await prisma.analyticsEvent.create({
      data: {
        eventName,
        sessionId: sessionId || crypto.randomUUID(),
        userId: userId || null,
        utmSource: utm?.utmSource || null,
        utmMedium: utm?.utmMedium || null,
        utmCampaign: utm?.utmCampaign || null,
        utmContent: utm?.utmContent || null,
        utmTerm: utm?.utmTerm || null,
        pathname: metadata?.pathname || '/',
        referrer: metadata?.referrer || null,
        metadata: metadata ? JSON.stringify(metadata) : null,
        revenue: revenue || 0,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track event' },
      { status: 500 }
    );
  }
}
