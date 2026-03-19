/**
 * Instagram Graph API Client for Pawcasso Atelier
 *
 * Handles media container creation, publishing, and insights retrieval
 * via the Instagram Graph API v18.0.
 *
 * Required env vars:
 *   INSTAGRAM_ACCESS_TOKEN  - Long-lived Page Access Token (60 days)
 *   INSTAGRAM_ACCOUNT_ID    - Instagram Business Account ID
 */

const GRAPH_API_BASE = 'https://graph.facebook.com/v18.0';

interface InstagramConfig {
  accessToken: string;
  accountId: string;
}

interface MediaContainerResponse {
  id: string;
}

interface PublishResponse {
  id: string;
}

interface InsightsMetric {
  name: string;
  period: string;
  values: Array<{ value: number }>;
  title: string;
  description: string;
}

interface InsightsResponse {
  data: InsightsMetric[];
}

interface MediaInsights {
  reach: number;
  impressions: number;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  engagement: number;
}

interface AccountInsights {
  followers: number;
  reach: number;
  impressions: number;
}

function getConfig(): InstagramConfig {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID;

  if (!accessToken || !accountId) {
    throw new Error(
      'Missing Instagram credentials. Set INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_ACCOUNT_ID env vars.'
    );
  }

  return { accessToken, accountId };
}

/**
 * Create a media container (step 1 of 2-step publishing).
 * The image_url must be publicly accessible.
 */
export async function createMediaContainer(
  imageUrl: string,
  caption: string
): Promise<string> {
  const { accessToken, accountId } = getConfig();

  const response = await fetch(`${GRAPH_API_BASE}/${accountId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image_url: imageUrl,
      caption,
      access_token: accessToken,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `Instagram API error (create container): ${JSON.stringify(error)}`
    );
  }

  const data: MediaContainerResponse = await response.json();
  return data.id;
}

/**
 * Create a carousel media container with multiple images.
 */
export async function createCarouselContainer(
  imageUrls: string[],
  caption: string
): Promise<string> {
  const { accessToken, accountId } = getConfig();

  // Step 1: Create individual item containers
  const childIds: string[] = [];
  for (const url of imageUrls) {
    const res = await fetch(`${GRAPH_API_BASE}/${accountId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: url,
        is_carousel_item: true,
        access_token: accessToken,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(`Instagram API error (carousel item): ${JSON.stringify(error)}`);
    }

    const data: MediaContainerResponse = await res.json();
    childIds.push(data.id);
  }

  // Step 2: Create carousel container
  const response = await fetch(`${GRAPH_API_BASE}/${accountId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      media_type: 'CAROUSEL',
      children: childIds.join(','),
      caption,
      access_token: accessToken,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Instagram API error (carousel container): ${JSON.stringify(error)}`);
  }

  const data: MediaContainerResponse = await response.json();
  return data.id;
}

/**
 * Publish a media container (step 2 of 2-step publishing).
 * Returns the published media ID.
 */
export async function publishMedia(creationId: string): Promise<string> {
  const { accessToken, accountId } = getConfig();

  const response = await fetch(
    `${GRAPH_API_BASE}/${accountId}/media_publish`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: creationId,
        access_token: accessToken,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `Instagram API error (publish): ${JSON.stringify(error)}`
    );
  }

  const data: PublishResponse = await response.json();
  return data.id;
}

/**
 * Check container status before publishing.
 * Returns 'FINISHED' when ready, 'IN_PROGRESS' while processing, 'ERROR' on failure.
 */
export async function checkContainerStatus(
  containerId: string
): Promise<{ status: string; statusCode?: string }> {
  const { accessToken } = getConfig();

  const response = await fetch(
    `${GRAPH_API_BASE}/${containerId}?fields=status_code&access_token=${accessToken}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Instagram API error (status): ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return { status: data.status_code || 'UNKNOWN', statusCode: data.status_code };
}

/**
 * Full publish flow: create container, wait for processing, then publish.
 * Polls container status until ready (max 30 seconds).
 */
export async function createAndPublish(
  imageUrl: string,
  caption: string
): Promise<{ mediaId: string; containerId: string }> {
  const containerId = await createMediaContainer(imageUrl, caption);

  // Poll for container readiness (image processing can take a few seconds)
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const { status } = await checkContainerStatus(containerId);

    if (status === 'FINISHED') {
      const mediaId = await publishMedia(containerId);
      return { mediaId, containerId };
    }

    if (status === 'ERROR') {
      throw new Error(`Container processing failed for ${containerId}`);
    }

    // Wait 3 seconds between polls
    await new Promise((resolve) => setTimeout(resolve, 3000));
    attempts++;
  }

  throw new Error(`Container ${containerId} timed out after ${maxAttempts * 3}s`);
}

/**
 * Get insights for a specific media post.
 */
export async function getMediaInsights(
  mediaId: string
): Promise<MediaInsights> {
  const { accessToken } = getConfig();
  const metrics = 'reach,impressions,likes,comments,saved,shares,total_interactions';

  const response = await fetch(
    `${GRAPH_API_BASE}/${mediaId}/insights?metric=${metrics}&access_token=${accessToken}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Instagram API error (insights): ${JSON.stringify(error)}`);
  }

  const data: InsightsResponse = await response.json();

  const getValue = (name: string): number => {
    const metric = data.data.find((m) => m.name === name);
    return metric?.values?.[0]?.value ?? 0;
  };

  return {
    reach: getValue('reach'),
    impressions: getValue('impressions'),
    likes: getValue('likes'),
    comments: getValue('comments'),
    saves: getValue('saved'),
    shares: getValue('shares'),
    engagement: getValue('total_interactions'),
  };
}

/**
 * Get account-level insights.
 */
export async function getAccountInsights(): Promise<AccountInsights> {
  const { accessToken, accountId } = getConfig();

  // Get follower count
  const profileRes = await fetch(
    `${GRAPH_API_BASE}/${accountId}?fields=followers_count,media_count&access_token=${accessToken}`
  );

  if (!profileRes.ok) {
    const error = await profileRes.json();
    throw new Error(`Instagram API error (profile): ${JSON.stringify(error)}`);
  }

  const profile = await profileRes.json();

  // Get reach & impressions for last 7 days
  const insightsRes = await fetch(
    `${GRAPH_API_BASE}/${accountId}/insights?metric=reach,impressions&period=day&since=${
      Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60
    }&until=${Math.floor(Date.now() / 1000)}&access_token=${accessToken}`
  );

  let reach = 0;
  let impressions = 0;

  if (insightsRes.ok) {
    const insights: InsightsResponse = await insightsRes.json();
    for (const metric of insights.data) {
      const total = metric.values.reduce((sum, v) => sum + v.value, 0);
      if (metric.name === 'reach') reach = total;
      if (metric.name === 'impressions') impressions = total;
    }
  }

  return {
    followers: profile.followers_count || 0,
    reach,
    impressions,
  };
}

/**
 * Refresh a long-lived token (call before expiry, tokens last 60 days).
 */
export async function refreshAccessToken(currentToken: string): Promise<string> {
  const response = await fetch(
    `${GRAPH_API_BASE}/oauth/access_token?grant_type=fb_exchange_token&client_id=${
      process.env.FACEBOOK_APP_ID
    }&client_secret=${process.env.FACEBOOK_APP_SECRET}&fb_exchange_token=${currentToken}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Token refresh error: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Add a comment to a media post (used for hashtag-in-first-comment strategy).
 */
export async function addComment(
  mediaId: string,
  message: string
): Promise<string> {
  const { accessToken } = getConfig();

  const response = await fetch(`${GRAPH_API_BASE}/${mediaId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      access_token: accessToken,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Instagram API error (comment): ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return data.id;
}
