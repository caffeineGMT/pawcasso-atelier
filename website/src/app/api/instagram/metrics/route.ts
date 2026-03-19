import { NextRequest, NextResponse } from 'next/server';

const GRAPH_API_BASE = 'https://graph.facebook.com/v18.0';

/**
 * GET /api/instagram/metrics
 * Fetches Instagram account and post-level metrics.
 *
 * Query params:
 *   ?mediaId=<id>  - Get insights for a specific post
 *   (no params)    - Get account-level metrics
 */
export async function GET(req: NextRequest) {
  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const accountId = process.env.INSTAGRAM_ACCOUNT_ID;

    if (!accessToken || !accountId) {
      return NextResponse.json(
        { error: 'Instagram credentials not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const mediaId = searchParams.get('mediaId');

    if (mediaId) {
      // Post-level insights
      const res = await fetch(
        `${GRAPH_API_BASE}/${mediaId}/insights?metric=reach,impressions,likes,comments,saved,shares,total_interactions&access_token=${accessToken}`
      );

      if (!res.ok) {
        const error = await res.json();
        return NextResponse.json(
          { error: 'Failed to fetch media insights', details: error },
          { status: 502 }
        );
      }

      const data = await res.json();
      const getValue = (name: string): number => {
        const metric = data.data?.find(
          (m: { name: string }) => m.name === name
        );
        return metric?.values?.[0]?.value ?? 0;
      };

      return NextResponse.json({
        mediaId,
        reach: getValue('reach'),
        impressions: getValue('impressions'),
        likes: getValue('likes'),
        comments: getValue('comments'),
        saves: getValue('saved'),
        shares: getValue('shares'),
        engagement: getValue('total_interactions'),
      });
    }

    // Account-level insights
    const profileRes = await fetch(
      `${GRAPH_API_BASE}/${accountId}?fields=followers_count,media_count,username,name&access_token=${accessToken}`
    );

    if (!profileRes.ok) {
      const error = await profileRes.json();
      return NextResponse.json(
        { error: 'Failed to fetch profile', details: error },
        { status: 502 }
      );
    }

    const profile = await profileRes.json();

    // Get 7-day insights
    const now = Math.floor(Date.now() / 1000);
    const weekAgo = now - 7 * 24 * 60 * 60;
    const insightsRes = await fetch(
      `${GRAPH_API_BASE}/${accountId}/insights?metric=reach,impressions&period=day&since=${weekAgo}&until=${now}&access_token=${accessToken}`
    );

    let weeklyReach = 0;
    let weeklyImpressions = 0;

    if (insightsRes.ok) {
      const insights = await insightsRes.json();
      for (const metric of insights.data || []) {
        const total = (metric.values || []).reduce(
          (sum: number, v: { value: number }) => sum + v.value,
          0
        );
        if (metric.name === 'reach') weeklyReach = total;
        if (metric.name === 'impressions') weeklyImpressions = total;
      }
    }

    return NextResponse.json({
      username: profile.username,
      name: profile.name,
      followers: profile.followers_count,
      mediaCount: profile.media_count,
      weeklyReach,
      weeklyImpressions,
    });
  } catch (error) {
    console.error('Metrics fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
