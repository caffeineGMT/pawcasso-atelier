#!/usr/bin/env tsx
/**
 * Instagram Metrics Sync Script
 *
 * Syncs engagement metrics from Instagram Graph API for all posted content.
 * Creates engagement snapshots for time-series analysis.
 *
 * Usage: npx tsx scripts/sync-instagram-metrics.ts
 *
 * Required env vars:
 *   INSTAGRAM_ACCESS_TOKEN
 *   INSTAGRAM_ACCOUNT_ID
 *
 * Optional env vars:
 *   CREATE_SNAPSHOTS=true  // Create engagement snapshots for time-series
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const GRAPH_API_BASE = 'https://graph.facebook.com/v18.0';

async function main() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID;
  const createSnapshots = process.env.CREATE_SNAPSHOTS === 'true';

  if (!accessToken || !accountId) {
    console.error('❌ Missing INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_ACCOUNT_ID');
    process.exit(1);
  }

  console.log('📊 Syncing Instagram engagement metrics...\n');

  // Get all posted content from database
  const postedContent = await prisma.instagramContent.findMany({
    where: {
      status: 'posted',
      instagramMediaId: { not: null },
    },
    orderBy: { postedAt: 'desc' },
  });

  console.log(`Found ${postedContent.length} posted content items\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const content of postedContent) {
    if (!content.instagramMediaId) continue;

    try {
      console.log(`📥 Fetching metrics for: ${content.title}`);
      console.log(`   Content ID: ${content.contentId} | Instagram ID: ${content.instagramMediaId}`);

      // Fetch metrics from Instagram Graph API
      const metricsRes = await fetch(
        `${GRAPH_API_BASE}/${content.instagramMediaId}/insights?metric=reach,impressions,likes,comments,saved,shares,total_interactions&access_token=${accessToken}`
      );

      if (!metricsRes.ok) {
        const error = await metricsRes.json();
        console.error(`   ❌ Error: ${JSON.stringify(error)}`);
        errorCount++;
        continue;
      }

      const data = await metricsRes.json();

      const getValue = (name: string): number => {
        const metric = data.data?.find((m: { name: string }) => m.name === name);
        return metric?.values?.[0]?.value ?? 0;
      };

      const likes = getValue('likes');
      const comments = getValue('comments');
      const saves = getValue('saved');
      const shares = getValue('shares');
      const reach = getValue('reach');
      const impressions = getValue('impressions');

      const engagementRate = reach > 0
        ? parseFloat((((likes + comments + saves) / reach) * 100).toFixed(2))
        : 0;

      console.log(`   ❤️  Likes: ${likes} | 💬 Comments: ${comments} | 🔖 Saves: ${saves}`);
      console.log(`   📈 Reach: ${reach} | 👁️  Impressions: ${impressions}`);
      console.log(`   📊 Engagement Rate: ${engagementRate}%`);

      // Update content metrics
      await prisma.instagramContent.update({
        where: { id: content.id },
        data: {
          likes,
          comments,
          saves,
          shares,
          reach,
          impressions,
          engagementRate,
          lastMetricsSync: new Date(),
        },
      });

      // Create engagement snapshot if requested
      if (createSnapshots && content.postedAt) {
        const hoursAfterPost = Math.floor(
          (Date.now() - new Date(content.postedAt).getTime()) / (1000 * 60 * 60)
        );

        const viralityScore = impressions > 0
          ? parseFloat((((shares + saves) / impressions) * 100).toFixed(2))
          : 0;

        await prisma.engagementSnapshot.create({
          data: {
            instagramContentId: content.id,
            likes,
            comments,
            saves,
            shares,
            reach,
            impressions,
            engagementRate,
            viralityScore,
            hoursAfterPost,
          },
        });

        console.log(`   📸 Snapshot created (${hoursAfterPost}h after posting)`);
      }

      console.log(`   ✅ Updated successfully\n`);
      successCount++;

      // Rate limiting - Instagram Graph API has limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`   ❌ Error syncing ${content.contentId}:`, error);
      errorCount++;
    }
  }

  console.log('\n📊 Sync Complete:');
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📊 Total: ${postedContent.length}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
