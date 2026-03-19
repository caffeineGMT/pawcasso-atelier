import { NextRequest, NextResponse } from 'next/server';

const GRAPH_API_BASE = 'https://graph.facebook.com/v18.0';

/**
 * POST /api/instagram/publish
 *
 * Two-step Instagram Graph API publishing:
 * 1. Creates a media container with the image + caption
 * 2. Polls until container is processed
 * 3. Publishes the container
 * 4. Optionally adds hashtags as first comment
 *
 * Body: { imageUrl, caption, hashtags?, postId? }
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.INSTAGRAM_WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { imageUrl, caption, hashtags, postId } = await req.json();

    if (!imageUrl || !caption) {
      return NextResponse.json(
        { error: 'imageUrl and caption are required' },
        { status: 400 }
      );
    }

    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const accountId = process.env.INSTAGRAM_ACCOUNT_ID;

    if (!accessToken || !accountId) {
      return NextResponse.json(
        { error: 'Instagram credentials not configured' },
        { status: 500 }
      );
    }

    // Step 1: Create media container
    const createRes = await fetch(`${GRAPH_API_BASE}/${accountId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: imageUrl,
        caption,
        access_token: accessToken,
      }),
    });

    if (!createRes.ok) {
      const error = await createRes.json();
      return NextResponse.json(
        { error: 'Failed to create media container', details: error },
        { status: 502 }
      );
    }

    const { id: containerId } = await createRes.json();

    // Step 2: Poll for container readiness
    let containerReady = false;
    for (let i = 0; i < 10; i++) {
      await new Promise((r) => setTimeout(r, 3000));

      const statusRes = await fetch(
        `${GRAPH_API_BASE}/${containerId}?fields=status_code&access_token=${accessToken}`
      );
      const statusData = await statusRes.json();

      if (statusData.status_code === 'FINISHED') {
        containerReady = true;
        break;
      }

      if (statusData.status_code === 'ERROR') {
        return NextResponse.json(
          { error: 'Container processing failed', containerId },
          { status: 502 }
        );
      }
    }

    if (!containerReady) {
      return NextResponse.json(
        { error: 'Container processing timed out', containerId },
        { status: 504 }
      );
    }

    // Step 3: Publish
    const publishRes = await fetch(
      `${GRAPH_API_BASE}/${accountId}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: containerId,
          access_token: accessToken,
        }),
      }
    );

    if (!publishRes.ok) {
      const error = await publishRes.json();
      return NextResponse.json(
        { error: 'Failed to publish media', details: error },
        { status: 502 }
      );
    }

    const { id: mediaId } = await publishRes.json();

    // Step 4: Add hashtags as first comment (if provided)
    let commentId: string | null = null;
    if (hashtags) {
      try {
        const commentRes = await fetch(
          `${GRAPH_API_BASE}/${mediaId}/comments`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: hashtags,
              access_token: accessToken,
            }),
          }
        );

        if (commentRes.ok) {
          const commentData = await commentRes.json();
          commentId = commentData.id;
        }
      } catch {
        // Non-critical: hashtag comment failed but post is live
        console.error('Failed to add hashtag comment');
      }
    }

    return NextResponse.json({
      success: true,
      mediaId,
      containerId,
      commentId,
      postId,
      permalink: `https://www.instagram.com/p/${mediaId}/`,
    });
  } catch (error) {
    console.error('Instagram publish error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
