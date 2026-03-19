/**
 * Google Chat Webhook Integration for Pawcasso Atelier
 *
 * Sends approval requests and notifications to a GChat space.
 *
 * Required env vars:
 *   GCHAT_WEBHOOK_URL  - Google Chat incoming webhook URL
 *   GCHAT_SPACE_ID     - Google Chat space ID (for Workspace API, optional)
 */

interface PostPreview {
  date: string;
  pillar: string;
  style: string;
  animal: string;
  caption: string;
  hashtags: string;
  imageUrl: string;
  postId: number;
}

interface GChatCard {
  cardsV2: Array<{
    cardId: string;
    card: {
      header: {
        title: string;
        subtitle: string;
        imageUrl?: string;
        imageType?: string;
      };
      sections: Array<{
        header?: string;
        widgets: Array<Record<string, unknown>>;
      }>;
    };
  }>;
}

/**
 * Send a rich card message to GChat for post approval.
 */
export async function sendApprovalRequest(post: PostPreview): Promise<void> {
  const webhookUrl = process.env.GCHAT_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error('GCHAT_WEBHOOK_URL not configured');
  }

  const truncatedCaption =
    post.caption.length > 300
      ? post.caption.slice(0, 297) + '...'
      : post.caption;

  const card: GChatCard = {
    cardsV2: [
      {
        cardId: `pawcasso-approval-${post.postId}`,
        card: {
          header: {
            title: 'New Instagram Post Ready',
            subtitle: `${post.pillar} | ${post.style}`,
            imageUrl: post.imageUrl,
            imageType: 'CIRCLE',
          },
          sections: [
            {
              header: 'Post Details',
              widgets: [
                {
                  decoratedText: {
                    topLabel: 'Date',
                    text: post.date,
                    startIcon: { knownIcon: 'CLOCK' },
                  },
                },
                {
                  decoratedText: {
                    topLabel: 'Animal',
                    text: post.animal,
                    startIcon: { knownIcon: 'STAR' },
                  },
                },
                {
                  decoratedText: {
                    topLabel: 'Post ID',
                    text: `#${post.postId}`,
                    startIcon: { knownIcon: 'BOOKMARK' },
                  },
                },
              ],
            },
            {
              header: 'Caption Preview',
              widgets: [
                {
                  textParagraph: {
                    text: truncatedCaption,
                  },
                },
              ],
            },
            {
              header: 'Image',
              widgets: [
                {
                  image: {
                    imageUrl: post.imageUrl,
                    altText: `${post.animal} - ${post.style}`,
                  },
                },
              ],
            },
            {
              widgets: [
                {
                  textParagraph: {
                    text: `<b>Reply "yes" to approve and post to Instagram.</b>\nReply "skip" to skip this post.\nReply "edit: [new caption]" to modify the caption before posting.`,
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  };

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(card),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GChat webhook error: ${error}`);
  }
}

/**
 * Send a simple text notification to GChat.
 */
export async function sendNotification(message: string): Promise<void> {
  const webhookUrl = process.env.GCHAT_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error('GCHAT_WEBHOOK_URL not configured');
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: message }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GChat notification error: ${error}`);
  }
}

/**
 * Send a post-success notification with engagement link.
 */
export async function sendPostSuccess(
  postId: number,
  mediaId: string,
  caption: string
): Promise<void> {
  const message = [
    `Posted to Instagram! Post #${postId}`,
    `Media ID: ${mediaId}`,
    `Caption: ${caption.slice(0, 100)}...`,
    '',
    `View on Instagram: https://www.instagram.com/p/${mediaId}/`,
    '',
    'Engagement tracking will begin in 24 hours.',
  ].join('\n');

  await sendNotification(message);
}

/**
 * Send a weekly metrics summary to GChat.
 */
export async function sendMetricsSummary(metrics: {
  followers: number;
  followerGrowth: number;
  postsThisWeek: number;
  avgEngagement: number;
  topPost: string;
  totalReach: number;
}): Promise<void> {
  const message = [
    'Weekly Instagram Report',
    '═══════════════════════════════',
    '',
    `Followers: ${metrics.followers.toLocaleString()} (${metrics.followerGrowth >= 0 ? '+' : ''}${metrics.followerGrowth})`,
    `Posts this week: ${metrics.postsThisWeek}`,
    `Avg engagement rate: ${metrics.avgEngagement.toFixed(1)}%`,
    `Total reach: ${metrics.totalReach.toLocaleString()}`,
    `Top post: ${metrics.topPost}`,
    '',
    'Full metrics: content/instagram-metrics.csv',
  ].join('\n');

  await sendNotification(message);
}
