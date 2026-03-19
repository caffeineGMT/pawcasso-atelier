/**
 * Instagram Metrics Tracker for Pawcasso Atelier
 *
 * Collects engagement data from Instagram Graph API and writes
 * weekly snapshots to content/instagram-metrics.csv.
 */

import * as fs from 'fs';
import * as path from 'path';
import { getMediaInsights, getAccountInsights } from './client';
import { getPostedEntries } from './schedule';

const METRICS_CSV_PATH = path.resolve(
  __dirname,
  '../../content/instagram-metrics.csv'
);

const CSV_HEADER =
  'date,followers,weekly_reach,weekly_impressions,posts_count,avg_likes,avg_comments,avg_saves,avg_shares,avg_engagement_rate,top_post_id,top_post_engagement';

interface WeeklySnapshot {
  date: string;
  followers: number;
  weeklyReach: number;
  weeklyImpressions: number;
  postsCount: number;
  avgLikes: number;
  avgComments: number;
  avgSaves: number;
  avgShares: number;
  avgEngagementRate: number;
  topPostId: string;
  topPostEngagement: number;
}

/**
 * Collect metrics for all posts from the last 7 days.
 */
export async function collectWeeklyMetrics(): Promise<WeeklySnapshot> {
  const accountInsights = await getAccountInsights();
  const postedEntries = getPostedEntries();

  // Filter to posts from the last 7 days
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentPosts = postedEntries.filter(
    (p) => new Date(p.postedAt).getTime() > oneWeekAgo
  );

  let totalLikes = 0;
  let totalComments = 0;
  let totalSaves = 0;
  let totalShares = 0;
  let totalEngagement = 0;
  let topPostId = '';
  let topPostEngagement = 0;

  for (const post of recentPosts) {
    try {
      const insights = await getMediaInsights(post.instagramMediaId);
      totalLikes += insights.likes;
      totalComments += insights.comments;
      totalSaves += insights.saves;
      totalShares += insights.shares;
      totalEngagement += insights.engagement;

      if (insights.engagement > topPostEngagement) {
        topPostEngagement = insights.engagement;
        topPostId = post.instagramMediaId;
      }
    } catch (error) {
      console.error(`Failed to get insights for ${post.instagramMediaId}:`, error);
    }
  }

  const count = recentPosts.length || 1;
  const followers = accountInsights.followers || 1;

  const snapshot: WeeklySnapshot = {
    date: new Date().toISOString().split('T')[0],
    followers: accountInsights.followers,
    weeklyReach: accountInsights.reach,
    weeklyImpressions: accountInsights.impressions,
    postsCount: recentPosts.length,
    avgLikes: Math.round(totalLikes / count),
    avgComments: Math.round(totalComments / count),
    avgSaves: Math.round(totalSaves / count),
    avgShares: Math.round(totalShares / count),
    avgEngagementRate: parseFloat(
      (((totalLikes + totalComments) / count / followers) * 100).toFixed(2)
    ),
    topPostId,
    topPostEngagement,
  };

  return snapshot;
}

/**
 * Append a weekly snapshot to the CSV file.
 */
export function appendMetricsToCSV(snapshot: WeeklySnapshot): void {
  const exists = fs.existsSync(METRICS_CSV_PATH);

  if (!exists) {
    fs.writeFileSync(METRICS_CSV_PATH, CSV_HEADER + '\n');
  }

  const row = [
    snapshot.date,
    snapshot.followers,
    snapshot.weeklyReach,
    snapshot.weeklyImpressions,
    snapshot.postsCount,
    snapshot.avgLikes,
    snapshot.avgComments,
    snapshot.avgSaves,
    snapshot.avgShares,
    snapshot.avgEngagementRate,
    snapshot.topPostId,
    snapshot.topPostEngagement,
  ].join(',');

  fs.appendFileSync(METRICS_CSV_PATH, row + '\n');
}

/**
 * Read all metrics from the CSV file.
 */
export function readMetricsCSV(): WeeklySnapshot[] {
  if (!fs.existsSync(METRICS_CSV_PATH)) {
    return [];
  }

  const raw = fs.readFileSync(METRICS_CSV_PATH, 'utf-8');
  const lines = raw.trim().split('\n').slice(1); // skip header

  return lines.map((line) => {
    const [
      date,
      followers,
      weeklyReach,
      weeklyImpressions,
      postsCount,
      avgLikes,
      avgComments,
      avgSaves,
      avgShares,
      avgEngagementRate,
      topPostId,
      topPostEngagement,
    ] = line.split(',');

    return {
      date,
      followers: parseInt(followers),
      weeklyReach: parseInt(weeklyReach),
      weeklyImpressions: parseInt(weeklyImpressions),
      postsCount: parseInt(postsCount),
      avgLikes: parseInt(avgLikes),
      avgComments: parseInt(avgComments),
      avgSaves: parseInt(avgSaves),
      avgShares: parseInt(avgShares),
      avgEngagementRate: parseFloat(avgEngagementRate),
      topPostId,
      topPostEngagement: parseInt(topPostEngagement),
    };
  });
}
