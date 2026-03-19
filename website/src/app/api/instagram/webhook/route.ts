import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/instagram/webhook
 *
 * Webhook endpoint called by n8n after GChat approval.
 * Receives the approval decision and triggers the appropriate action.
 *
 * This is the glue between:
 *   n8n GChat Wait → this endpoint → Instagram publish API
 *
 * Body from n8n: {
 *   action: 'approve' | 'skip' | 'edit',
 *   postId: number,
 *   imageUrl: string,
 *   caption: string,
 *   hashtags: string,
 *   editedCaption?: string  // only if action is 'edit'
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.INSTAGRAM_WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, postId, imageUrl, caption, hashtags, editedCaption } = body;

    if (!action || !postId) {
      return NextResponse.json(
        { error: 'action and postId required' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pawcassoatelier.com';

    switch (action) {
      case 'approve': {
        // Publish to Instagram
        const publishRes = await fetch(`${baseUrl}/api/instagram/publish`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.INSTAGRAM_WEBHOOK_SECRET}`,
          },
          body: JSON.stringify({
            imageUrl,
            caption: caption,
            hashtags,
            postId,
          }),
        });

        const publishData = await publishRes.json();

        if (!publishRes.ok) {
          return NextResponse.json(
            { error: 'Publish failed', details: publishData },
            { status: 502 }
          );
        }

        // Record in schedule
        await fetch(`${baseUrl}/api/instagram/schedule`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.INSTAGRAM_WEBHOOK_SECRET}`,
          },
          body: JSON.stringify({
            action: 'posted',
            postId,
            instagramMediaId: publishData.mediaId,
            caption,
          }),
        });

        // Notify GChat of success
        const gchatWebhook = process.env.GCHAT_WEBHOOK_URL;
        if (gchatWebhook) {
          await fetch(gchatWebhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: `Posted to Instagram! Post #${postId}\nMedia ID: ${publishData.mediaId}\n${publishData.permalink || ''}`,
            }),
          });
        }

        return NextResponse.json({
          success: true,
          action: 'published',
          mediaId: publishData.mediaId,
        });
      }

      case 'edit': {
        // Update caption then publish
        const finalCaption = editedCaption || caption;

        await fetch(`${baseUrl}/api/instagram/schedule`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.INSTAGRAM_WEBHOOK_SECRET}`,
          },
          body: JSON.stringify({
            action: 'update_caption',
            postId,
            caption: finalCaption,
          }),
        });

        // Now publish with the edited caption
        const editPublishRes = await fetch(
          `${baseUrl}/api/instagram/publish`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.INSTAGRAM_WEBHOOK_SECRET}`,
            },
            body: JSON.stringify({
              imageUrl,
              caption: finalCaption,
              hashtags,
              postId,
            }),
          }
        );

        const editPublishData = await editPublishRes.json();

        if (!editPublishRes.ok) {
          return NextResponse.json(
            { error: 'Publish failed after edit', details: editPublishData },
            { status: 502 }
          );
        }

        await fetch(`${baseUrl}/api/instagram/schedule`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.INSTAGRAM_WEBHOOK_SECRET}`,
          },
          body: JSON.stringify({
            action: 'posted',
            postId,
            instagramMediaId: editPublishData.mediaId,
            caption: finalCaption,
          }),
        });

        return NextResponse.json({
          success: true,
          action: 'edited_and_published',
          mediaId: editPublishData.mediaId,
        });
      }

      case 'skip': {
        await fetch(`${baseUrl}/api/instagram/schedule`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.INSTAGRAM_WEBHOOK_SECRET}`,
          },
          body: JSON.stringify({ action: 'skipped', postId }),
        });

        return NextResponse.json({ success: true, action: 'skipped' });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
