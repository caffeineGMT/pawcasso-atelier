import { NextRequest, NextResponse } from 'next/server';

/**
 * TikTok conversion tracking API endpoint
 * Records events server-side for reliable attribution
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, postId, source, value, currency } = body;

    if (!event) {
      return NextResponse.json({ error: 'Missing event' }, { status: 400 });
    }

    // Server-side TikTok Events API for reliable conversion tracking
    const pixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
    const accessToken = process.env.TIKTOK_EVENTS_API_TOKEN;

    if (pixelId && accessToken) {
      const eventData = {
        pixel_code: pixelId,
        event: event,
        event_id: `${event}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        timestamp: new Date().toISOString(),
        context: {
          page: {
            url: request.headers.get('referer') || '',
          },
          user_agent: request.headers.get('user-agent') || '',
          ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '',
        },
        properties: {
          content_type: 'product',
          content_id: postId || 'pet_portrait',
          value: value || 9,
          currency: currency || 'USD',
          source: source || 'tiktok',
        },
      };

      await fetch('https://business-api.tiktok.com/open_api/v1.3/event/track/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Token': accessToken,
        },
        body: JSON.stringify({
          event_source: 'web',
          event_source_id: pixelId,
          data: [eventData],
        }),
      }).catch(() => {
        // Don't block response on TikTok API failure
      });
    }

    // Also log to analytics for internal tracking
    console.log(`[TikTok Track] ${event}`, {
      postId,
      source,
      value,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
