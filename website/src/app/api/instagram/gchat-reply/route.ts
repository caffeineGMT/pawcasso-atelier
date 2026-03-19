import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/instagram/gchat-reply
 *
 * Receives GChat message replies and forwards them to the n8n wait webhook.
 * This is used when Google Chat is configured with a bot (Chat API)
 * instead of simple incoming webhooks.
 *
 * For the webhook-based flow (used by n8n Wait node), GChat replies
 * are forwarded directly to n8n's execution webhook URL.
 *
 * Body from GChat Bot API:
 * {
 *   "type": "MESSAGE",
 *   "message": {
 *     "text": "yes",
 *     "thread": { "name": "spaces/xxx/threads/yyy" }
 *   },
 *   "space": { "name": "spaces/xxx" }
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Google Chat sends a verification request on registration
    if (body.type === 'ADDED_TO_SPACE') {
      return NextResponse.json({
        text: 'Pawcasso Atelier Instagram bot connected! I will send you posts for approval.',
      });
    }

    if (body.type !== 'MESSAGE') {
      return NextResponse.json({ text: 'OK' });
    }

    const replyText = body.message?.text?.trim() || '';
    const threadName = body.message?.thread?.name || '';

    // Extract post ID from thread context (set in the approval message)
    // The thread name contains the post ID from when we sent the approval
    const postIdMatch = replyText.match(/^(\d+)\s*[:.]?\s*(.*)/);
    let postId: number | null = null;
    let actualReply = replyText;

    if (postIdMatch) {
      // User replied with format "5: yes" or "5 yes"
      postId = parseInt(postIdMatch[1]);
      actualReply = postIdMatch[2] || 'yes';
    }

    // Forward the reply to n8n's wait webhook
    const n8nWebhookBase = process.env.N8N_WEBHOOK_URL;
    if (!n8nWebhookBase) {
      return NextResponse.json({
        text: 'N8N_WEBHOOK_URL not configured. Please set up the n8n integration.',
      });
    }

    // The n8n Wait node webhook URL includes the post ID suffix
    const n8nUrl = postId
      ? `${n8nWebhookBase}/gchat-response/${postId}`
      : n8nWebhookBase;

    const n8nRes = await fetch(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reply: actualReply.toLowerCase(),
        text: actualReply,
        postId,
        threadName,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!n8nRes.ok) {
      return NextResponse.json({
        text: `Failed to forward reply to workflow. Status: ${n8nRes.status}`,
      });
    }

    // Acknowledge the reply
    const lowerReply = actualReply.toLowerCase();
    if (lowerReply === 'yes' || lowerReply === 'approve' || lowerReply === 'y') {
      return NextResponse.json({
        text: 'Approved! Publishing to Instagram now...',
      });
    } else if (lowerReply === 'skip' || lowerReply === 'no') {
      return NextResponse.json({ text: 'Post skipped.' });
    } else if (lowerReply.startsWith('edit:')) {
      return NextResponse.json({
        text: 'Caption updated. Publishing with new caption...',
      });
    }

    return NextResponse.json({
      text: `Reply received: "${actualReply}". Processing...`,
    });
  } catch (error) {
    console.error('GChat reply handler error:', error);
    return NextResponse.json(
      { text: 'Error processing reply. Please try again.' },
      { status: 500 }
    );
  }
}
