#!/usr/bin/env tsx
/**
 * Instagram Metrics Collection Script
 *
 * Collects engagement data from Instagram Graph API and appends
 * a weekly snapshot to content/instagram-metrics.csv.
 *
 * Usage: npx tsx scripts/collect-instagram-metrics.ts
 *
 * Required env vars:
 *   INSTAGRAM_ACCESS_TOKEN
 *   INSTAGRAM_ACCOUNT_ID
 */

import * as fs from 'fs';
import * as path from 'path';

const GRAPH_API_BASE = 'https://graph.facebook.com/v18.0';
const METRICS_CSV_PATH = path.resolve(__dirname, '../../content/instagram-metrics.csv');
const POSTING_LOG_PATH = path.resolve(__dirname, '../../content/posting-log.json');

const CSV_HEADER =
  'date,followers,weekly_reach,weekly_impressions,posts_count,avg_likes,avg_comments,avg_saves,avg_shares,avg_engagement_rate,top_post_id,top_post_engagement';

interface PostingLogEntry {
  id: number;
  postedAt: string;
  instagramMediaId: string;
  caption: string;
}

async function main() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID;

  if (!accessToken || !accountId) {
    console.error('Missing INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_ACCOUNT_ID');
    process.exit(1);
  }

  console.log('Collecting Instagram metrics...');

  // 1. Get account profile
  const profileRes = await fetch(
    `${GRAPH_API_BASE}/${accountId}?fields=followers_count,media_count,username&access_token=${accessToken}`
  );
  const profile = await profileRes.json();
  const followers = profile.followers_count || 0;
  console.log(`Followers: ${followers}`);

  // 2. Get 7-day account insights
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
  console.log(`Weekly reach: ${weeklyReach}, impressions: ${weeklyImpressions}`);

  // 3. Get post-level metrics for recent posts
  let recentPosts: PostingLogEntry[] = [];
  if (fs.existsSync(POSTING_LOG_PATH)) {
    const log = JSON.parse(fs.readFileSync(POSTING_LOG_PATH, 'utf-8'));
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    recentPosts = (log.posts || []).filter(
      (p: PostingLogEntry) => new Date(p.postedAt).getTime() > oneWeekAgo
    );
  }

  let totalLikes = 0;
  let totalComments = 0;
  let totalSaves = 0;
  let totalShares = 0;
  let totalEngagement = 0;
  let topPostId = '';
  let topPostEngagement = 0;

  for (const post of recentPosts) {
    if (!post.instagramMediaId) continue;

    try {
      const metricsRes = await fetch(
        `${GRAPH_API_BASE}/${post.instagramMediaId}/insights?metric=reach,impressions,likes,comments,saved,shares,total_interactions&access_token=${accessToken}`
      );

      if (metricsRes.ok) {
        const data = await metricsRes.json();
        const getValue = (name: string): number => {
          const metric = data.data?.find((m: { name: string }) => m.name === name);
          return metric?.values?.[0]?.value ?? 0;
        };

        const likes = getValue('likes');
        const comments = getValue('comments');
        const saves = getValue('saved');
        const shares = getValue('shares');
        const engagement = getValue('total_interactions');

        totalLikes += likes;
        totalComments += comments;
        totalSaves += saves;
        totalShares += shares;
        totalEngagement += engagement;

        if (engagement > topPostEngagement) {
          topPostEngagement = engagement;
          topPostId = post.instagramMediaId;
        }

        console.log(`  Post #${post.id}: ${likes} likes, ${comments} comments, ${saves} saves`);
      }
    } catch (error) {
      console.error(`  Failed to get metrics for post #${post.id}:`, error);
    }
  }

  const count = recentPosts.length || 1;
  const engagementRate = followers > 0
    ? parseFloat((((totalLikes + totalComments) / count / followers) * 100).toFixed(2))
    : 0;

  // 4. Write to CSV
  const exists = fs.existsSync(METRICS_CSV_PATH);
  if (!exists) {
    fs.writeFileSync(METRICS_CSV_PATH, CSV_HEADER + '\n');
  }

  const row = [
    new Date().toISOString().split('T')[0],
    followers,
    weeklyReach,
    weeklyImpressions,
    recentPosts.length,
    Math.round(totalLikes / count),
    Math.round(totalComments / count),
    Math.round(totalSaves / count),
    Math.round(totalShares / count),
    engagementRate,
    topPostId,
    topPostEngagement,
  ].join(',');

  fs.appendFileSync(METRICS_CSV_PATH, row + '\n');

  console.log('\nMetrics snapshot written to content/instagram-metrics.csv');
  console.log(`Engagement rate: ${engagementRate}%`);
  console.log(`Posts this week: ${recentPosts.length}`);
}

main().catch(console.error);
