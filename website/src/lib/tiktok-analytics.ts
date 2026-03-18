/**
 * TikTok Analytics Tracker
 *
 * Tracks video performance metrics including:
 * - Views, likes, comments, shares
 * - Link clicks (via UTM parameters)
 * - Engagement rate
 * - Conversion tracking
 */

import { createTikTokClient } from './tiktok-api';
import type { TikTokVideoAnalytics } from './tiktok-api';
import fs from 'fs';
import path from 'path';

export interface VideoPerformance extends TikTokVideoAnalytics {
  postId: string;
  postedAt: string;
  caption: string;
  breed: string;
  style: string;
  linkClicks: number;
  websiteVisits: number;
  orders: number;
  revenue: number;
  costPerClick?: number;
  conversionRate?: number;
  roas?: number; // Return on ad spend
  lastUpdated: string;
}

export interface PerformanceSummary {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  avgEngagementRate: number;
  totalLinkClicks: number;
  totalWebsiteVisits: number;
  totalOrders: number;
  totalRevenue: number;
  avgConversionRate: number;
  topPerformingPost: VideoPerformance | null;
  lastUpdated: string;
}

const ANALYTICS_FILE = 'tiktok-analytics.json';

/**
 * Load analytics data from file
 */
export function loadAnalytics(): VideoPerformance[] {
  const filePath = path.join(process.cwd(), ANALYTICS_FILE);

  if (!fs.existsSync(filePath)) {
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

/**
 * Save analytics data to file
 */
export function saveAnalytics(analytics: VideoPerformance[]): void {
  const filePath = path.join(process.cwd(), ANALYTICS_FILE);
  fs.writeFileSync(filePath, JSON.stringify(analytics, null, 2));
}

/**
 * Fetch analytics for a single video from TikTok API
 */
export async function fetchVideoAnalytics(videoId: string): Promise<TikTokVideoAnalytics> {
  const client = createTikTokClient();
  return await client.getVideoAnalytics(videoId);
}

/**
 * Update analytics for all published videos
 */
export async function updateAllAnalytics(): Promise<VideoPerformance[]> {
  console.log('Fetching analytics from TikTok API...');

  // Load current analytics
  const currentAnalytics = loadAnalytics();

  // Load queue to get list of published videos
  const queuePath = path.join(process.cwd(), 'tiktok-queue.json');
  if (!fs.existsSync(queuePath)) {
    console.log('No queue file found');
    return currentAnalytics;
  }

  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf-8'));
  const publishedPosts = queue.filter((post: any) => post.status === 'published' && post.tiktokVideoId);

  const updatedAnalytics: VideoPerformance[] = [];

  for (const post of publishedPosts) {
    try {
      // Fetch latest analytics from TikTok
      const analytics = await fetchVideoAnalytics(post.tiktokVideoId);

      // Find existing performance data or create new
      const existing = currentAnalytics.find(a => a.postId === post.id);

      const performance: VideoPerformance = {
        postId: post.id,
        videoId: post.tiktokVideoId,
        postedAt: post.scheduledFor,
        caption: post.caption,
        breed: extractBreed(post.caption),
        style: extractStyle(post.caption),
        views: analytics.views,
        likes: analytics.likes,
        comments: analytics.comments,
        shares: analytics.shares,
        playDuration: analytics.playDuration,
        watchedFull: analytics.watchedFull,
        engagementRate: analytics.engagementRate,
        clickedLink: existing?.linkClicks || 0, // Preserve link clicks from UTM tracking
        linkClicks: existing?.linkClicks || 0,
        websiteVisits: existing?.websiteVisits || 0,
        orders: existing?.orders || 0,
        revenue: existing?.revenue || 0,
        conversionRate: existing?.websiteVisits ? (existing.orders / existing.websiteVisits) * 100 : 0,
        lastUpdated: new Date().toISOString(),
      };

      updatedAnalytics.push(performance);

      console.log(`✓ Updated analytics for ${post.id}: ${analytics.views} views, ${analytics.engagementRate.toFixed(2)}% engagement`);
    } catch (error) {
      console.error(`Failed to fetch analytics for ${post.id}:`, error);
      // Keep existing data if API fails
      const existing = currentAnalytics.find(a => a.postId === post.id);
      if (existing) {
        updatedAnalytics.push(existing);
      }
    }
  }

  // Save updated analytics
  saveAnalytics(updatedAnalytics);

  console.log(`\n✅ Analytics updated for ${updatedAnalytics.length} videos`);

  return updatedAnalytics;
}

/**
 * Track link click from UTM parameter
 */
export function trackLinkClick(postId: string, source: string = 'tiktok'): void {
  const analytics = loadAnalytics();
  const post = analytics.find(a => a.postId === postId);

  if (post) {
    post.linkClicks++;
    post.lastUpdated = new Date().toISOString();
    saveAnalytics(analytics);
  } else {
    // Create placeholder entry for link click before video analytics are fetched
    const newEntry: VideoPerformance = {
      postId,
      videoId: '',
      postedAt: new Date().toISOString(),
      caption: '',
      breed: '',
      style: '',
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      playDuration: 0,
      watchedFull: 0,
      engagementRate: 0,
      clickedLink: 1,
      linkClicks: 1,
      websiteVisits: 0,
      orders: 0,
      revenue: 0,
      lastUpdated: new Date().toISOString(),
    };
    analytics.push(newEntry);
    saveAnalytics(analytics);
  }
}

/**
 * Track website visit from TikTok traffic
 */
export function trackWebsiteVisit(postId: string): void {
  const analytics = loadAnalytics();
  const post = analytics.find(a => a.postId === postId);

  if (post) {
    post.websiteVisits++;
    post.conversionRate = (post.orders / post.websiteVisits) * 100;
    post.lastUpdated = new Date().toISOString();
    saveAnalytics(analytics);
  }
}

/**
 * Track order from TikTok traffic
 */
export function trackOrder(postId: string, revenue: number = 9): void {
  const analytics = loadAnalytics();
  const post = analytics.find(a => a.postId === postId);

  if (post) {
    post.orders++;
    post.revenue += revenue;
    post.conversionRate = (post.orders / post.websiteVisits) * 100;
    post.lastUpdated = new Date().toISOString();
    saveAnalytics(analytics);
  }
}

/**
 * Get performance summary
 */
export function getPerformanceSummary(): PerformanceSummary {
  const analytics = loadAnalytics();

  if (analytics.length === 0) {
    return {
      totalPosts: 0,
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      avgEngagementRate: 0,
      totalLinkClicks: 0,
      totalWebsiteVisits: 0,
      totalOrders: 0,
      totalRevenue: 0,
      avgConversionRate: 0,
      topPerformingPost: null,
      lastUpdated: new Date().toISOString(),
    };
  }

  const totalViews = analytics.reduce((sum, a) => sum + a.views, 0);
  const totalLikes = analytics.reduce((sum, a) => sum + a.likes, 0);
  const totalComments = analytics.reduce((sum, a) => sum + a.comments, 0);
  const totalShares = analytics.reduce((sum, a) => sum + a.shares, 0);
  const totalLinkClicks = analytics.reduce((sum, a) => sum + a.linkClicks, 0);
  const totalWebsiteVisits = analytics.reduce((sum, a) => sum + a.websiteVisits, 0);
  const totalOrders = analytics.reduce((sum, a) => sum + a.orders, 0);
  const totalRevenue = analytics.reduce((sum, a) => sum + a.revenue, 0);

  const avgEngagementRate = analytics.reduce((sum, a) => sum + a.engagementRate, 0) / analytics.length;
  const avgConversionRate = totalWebsiteVisits > 0 ? (totalOrders / totalWebsiteVisits) * 100 : 0;

  const topPerformingPost = analytics.reduce((top, current) =>
    current.views > top.views ? current : top
  );

  return {
    totalPosts: analytics.length,
    totalViews,
    totalLikes,
    totalComments,
    totalShares,
    avgEngagementRate,
    totalLinkClicks,
    totalWebsiteVisits,
    totalOrders,
    totalRevenue,
    avgConversionRate,
    topPerformingPost,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Get top performing videos
 */
export function getTopPerformers(limit: number = 10): VideoPerformance[] {
  const analytics = loadAnalytics();
  return analytics
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

/**
 * Get recent posts
 */
export function getRecentPosts(limit: number = 10): VideoPerformance[] {
  const analytics = loadAnalytics();
  return analytics
    .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
    .slice(0, limit);
}

/**
 * Helper: Extract breed from caption
 */
function extractBreed(caption: string): string {
  const breeds = ['Border Collie', 'Shiba Inu', 'Pomeranian', 'Golden Retriever', 'Chihuahua', 'Cat'];
  for (const breed of breeds) {
    if (caption.includes(breed)) {
      return breed;
    }
  }
  return 'Unknown';
}

/**
 * Helper: Extract style from caption
 */
function extractStyle(caption: string): string {
  const styles = ['Pixar 3D', 'Renaissance', 'Needle Felt', 'Ink Wash', 'Chinese Classical', 'Pixel Art', 'Vinyl Toy'];
  for (const style of styles) {
    if (caption.includes(style)) {
      return style;
    }
  }
  return 'Unknown';
}
