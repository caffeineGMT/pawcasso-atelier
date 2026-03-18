/**
 * TikTok Content Posting API Integration
 *
 * Uses TikTok for Business API to automatically post videos to TikTok.
 * Requires TikTok Business account and API credentials.
 *
 * API Docs: https://developers.tiktok.com/doc/content-posting-api-get-started
 */

export interface TikTokCredentials {
  accessToken: string;
  refreshToken: string;
  clientKey: string;
  clientSecret: string;
}

export interface VideoUploadParams {
  videoUrl: string;
  caption: string;
  privacyLevel?: 'PUBLIC_TO_EVERYONE' | 'MUTUAL_FOLLOW_FRIENDS' | 'SELF_ONLY';
  disableComment?: boolean;
  disableDuet?: boolean;
  disableStitch?: boolean;
  brandContentToggle?: boolean;
  brandOrganicToggle?: boolean;
}

export interface TikTokPostResponse {
  publishId: string;
  status: 'processing' | 'published' | 'failed';
  shareUrl?: string;
  errorMessage?: string;
}

export interface TikTokVideoAnalytics {
  videoId: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  playDuration: number;
  watchedFull: number;
  engagementRate: number;
  clickedLink: number;
}

export class TikTokAPI {
  private accessToken: string;
  private refreshToken: string;
  private clientKey: string;
  private clientSecret: string;
  private baseUrl = 'https://open.tiktokapis.com/v2';

  constructor(credentials: TikTokCredentials) {
    this.accessToken = credentials.accessToken;
    this.refreshToken = credentials.refreshToken;
    this.clientKey = credentials.clientKey;
    this.clientSecret = credentials.clientSecret;
  }

  /**
   * Step 1: Initialize video upload
   * Returns an upload URL and video ID
   */
  async initializeUpload(params: {
    sourceInfo: {
      source: 'FILE_UPLOAD';
      videoSize: number;
      chunkSize: number;
      totalChunkCount: number;
    };
  }): Promise<{ uploadUrl: string; videoId: string; uploadToken: string }> {
    const response = await fetch(`${this.baseUrl}/post/publish/video/init/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        post_info: {
          title: 'Pawcasso Atelier Pet Portrait',
          privacy_level: 'PUBLIC_TO_EVERYONE',
          disable_comment: false,
          disable_duet: false,
          disable_stitch: false,
        },
        source_info: params.sourceInfo,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`TikTok API error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    return {
      uploadUrl: data.data.upload_url,
      videoId: data.data.publish_id,
      uploadToken: data.data.upload_token,
    };
  }

  /**
   * Step 2: Upload video chunks
   */
  async uploadVideoChunk(
    uploadUrl: string,
    videoBuffer: Buffer,
    uploadToken: string
  ): Promise<void> {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Range': `bytes 0-${videoBuffer.length - 1}/${videoBuffer.length}`,
      },
      body: videoBuffer,
    });

    if (!response.ok) {
      throw new Error(`Video upload failed: ${response.statusText}`);
    }
  }

  /**
   * Step 3: Publish the video with metadata
   */
  async publishVideo(params: {
    videoId: string;
    caption: string;
    privacyLevel?: string;
    disableComment?: boolean;
    disableDuet?: boolean;
    disableStitch?: boolean;
  }): Promise<TikTokPostResponse> {
    const response = await fetch(`${this.baseUrl}/post/publish/status/fetch/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        publish_id: params.videoId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Publish failed: ${JSON.stringify(error)}`);
    }

    const data = await response.json();

    return {
      publishId: data.data.publish_id,
      status: data.data.status,
      shareUrl: data.data.share_url,
      errorMessage: data.data.fail_reason,
    };
  }

  /**
   * Complete upload workflow: initialize → upload → publish
   */
  async postVideo(params: VideoUploadParams): Promise<TikTokPostResponse> {
    try {
      // Download video from Vercel Blob
      const videoResponse = await fetch(params.videoUrl);
      if (!videoResponse.ok) {
        throw new Error(`Failed to download video: ${videoResponse.statusText}`);
      }
      const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());
      const videoSize = videoBuffer.length;

      // Step 1: Initialize upload
      const { uploadUrl, videoId, uploadToken } = await this.initializeUpload({
        sourceInfo: {
          source: 'FILE_UPLOAD',
          videoSize,
          chunkSize: videoSize,
          totalChunkCount: 1,
        },
      });

      // Step 2: Upload video
      await this.uploadVideoChunk(uploadUrl, videoBuffer, uploadToken);

      // Wait 5 seconds for processing
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Step 3: Publish with metadata
      const result = await this.publishVideo({
        videoId,
        caption: params.caption,
        privacyLevel: params.privacyLevel || 'PUBLIC_TO_EVERYONE',
        disableComment: params.disableComment || false,
        disableDuet: params.disableDuet || false,
        disableStitch: params.disableStitch || false,
      });

      return result;
    } catch (error) {
      console.error('TikTok post error:', error);
      throw error;
    }
  }

  /**
   * Get video analytics
   */
  async getVideoAnalytics(videoId: string): Promise<TikTokVideoAnalytics> {
    const response = await fetch(`${this.baseUrl}/research/video/query/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filters: {
          video_id: videoId,
        },
        fields: [
          'id',
          'video_description',
          'create_time',
          'share_count',
          'view_count',
          'like_count',
          'comment_count',
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Analytics fetch failed: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    const video = data.data.videos[0];

    return {
      videoId: video.id,
      views: video.view_count || 0,
      likes: video.like_count || 0,
      comments: video.comment_count || 0,
      shares: video.share_count || 0,
      playDuration: 0, // Not available in basic API
      watchedFull: 0,
      engagementRate: ((video.like_count + video.comment_count + video.share_count) / video.view_count) * 100,
      clickedLink: 0, // Track separately via UTM parameters
    };
  }

  /**
   * Refresh access token when expired
   */
  async refreshAccessToken(): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_key: this.clientKey,
        client_secret: this.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();

    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token;

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    };
  }
}

/**
 * Helper: Create TikTok API client from environment variables
 */
export function createTikTokClient(): TikTokAPI {
  const credentials = {
    accessToken: process.env.TIKTOK_ACCESS_TOKEN!,
    refreshToken: process.env.TIKTOK_REFRESH_TOKEN!,
    clientKey: process.env.TIKTOK_CLIENT_KEY!,
    clientSecret: process.env.TIKTOK_CLIENT_SECRET!,
  };

  if (!credentials.accessToken || !credentials.clientKey) {
    throw new Error('TikTok API credentials not configured');
  }

  return new TikTokAPI(credentials);
}

/**
 * Schedule a video post for future publishing
 */
export interface ScheduledPost {
  id: string;
  videoUrl: string;
  caption: string;
  scheduledFor: Date;
  status: 'pending' | 'published' | 'failed';
  tiktokVideoId?: string;
  tiktokShareUrl?: string;
  errorMessage?: string;
}

export async function schedulePost(post: ScheduledPost): Promise<void> {
  // Store in database (Prisma)
  // This will be picked up by a cron job that runs every 30 minutes
  // and publishes any posts that are due

  // For now, we'll use a JSON file as a simple queue
  const fs = require('fs');
  const path = require('path');
  const queuePath = path.join(process.cwd(), 'tiktok-queue.json');

  let queue: ScheduledPost[] = [];
  if (fs.existsSync(queuePath)) {
    queue = JSON.parse(fs.readFileSync(queuePath, 'utf-8'));
  }

  queue.push(post);
  fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2));
}

export async function processScheduledPosts(): Promise<void> {
  const fs = require('fs');
  const path = require('path');
  const queuePath = path.join(process.cwd(), 'tiktok-queue.json');

  if (!fs.existsSync(queuePath)) {
    return;
  }

  const queue: ScheduledPost[] = JSON.parse(fs.readFileSync(queuePath, 'utf-8'));
  const now = new Date();
  const client = createTikTokClient();

  const updatedQueue: ScheduledPost[] = [];

  for (const post of queue) {
    if (post.status !== 'pending') {
      updatedQueue.push(post);
      continue;
    }

    const scheduledTime = new Date(post.scheduledFor);

    if (scheduledTime <= now) {
      // Time to publish
      try {
        const result = await client.postVideo({
          videoUrl: post.videoUrl,
          caption: post.caption,
        });

        post.status = result.status === 'published' ? 'published' : 'failed';
        post.tiktokVideoId = result.publishId;
        post.tiktokShareUrl = result.shareUrl;
        post.errorMessage = result.errorMessage;

        console.log(`Published post ${post.id}: ${result.shareUrl}`);
      } catch (error) {
        post.status = 'failed';
        post.errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Failed to publish post ${post.id}:`, error);
      }
    }

    updatedQueue.push(post);
  }

  fs.writeFileSync(queuePath, JSON.stringify(updatedQueue, null, 2));
}
