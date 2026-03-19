#!/usr/bin/env tsx
/**
 * Instagram Insights Generator
 *
 * Analyzes Instagram content performance and generates actionable insights.
 * Stores insights in the database for the dashboard to display.
 *
 * Usage: npx tsx scripts/generate-instagram-insights.ts
 *
 * Generates insights for:
 * - Best performing content type
 * - Optimal posting times
 * - Trending animals/breeds
 * - Best caption tone
 * - High-performing art styles
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Analyzing Instagram content performance...\n');

  // Get all posted content
  const allContent = await prisma.instagramContent.findMany({
    where: { status: 'posted' },
    orderBy: { postedAt: 'desc' },
  });

  if (allContent.length < 10) {
    console.log(`⚠️  Need at least 10 posts for meaningful insights. Currently: ${allContent.length}`);
    console.log('   Keep posting and run this script again later!');
    return;
  }

  console.log(`📊 Analyzing ${allContent.length} posts...\n`);

  // Deactivate old insights
  await prisma.contentInsight.updateMany({
    where: { active: true },
    data: { active: false },
  });

  const insights: Array<{
    insightType: string;
    title: string;
    description: string;
    recommendation: string;
    confidence: number;
    dataPoints: number;
    metadata?: string;
  }> = [];

  // 1. Best Content Type Analysis
  const contentTypes = ['portrait', 'emoji_set', 'zodiac', 'reel'];
  const typeStats = contentTypes.map(type => {
    const posts = allContent.filter(c => c.contentType === type);
    const count = posts.length;

    if (count === 0) return null;

    const avgEngagement = posts.reduce((sum, c) => sum + c.engagementRate, 0) / count;
    const avgLikes = posts.reduce((sum, c) => sum + c.likes, 0) / count;
    const avgSaves = posts.reduce((sum, c) => sum + c.saves, 0) / count;

    return { type, count, avgEngagement, avgLikes, avgSaves };
  }).filter(Boolean);

  const bestType = typeStats.sort((a, b) => b!.avgEngagement - a!.avgEngagement)[0];
  if (bestType && bestType.count >= 3) {
    insights.push({
      insightType: 'best_content_type',
      title: `${formatContentType(bestType.type)} Content Drives Highest Engagement`,
      description: `${formatContentType(bestType.type)} posts achieve ${bestType.avgEngagement.toFixed(2)}% average engagement rate, outperforming other content types.`,
      recommendation: `Prioritize creating ${formatContentType(bestType.type).toLowerCase()} content. Aim for 3-4 ${bestType.type} posts per week.`,
      confidence: Math.min(0.95, 0.6 + (bestType.count / 20)),
      dataPoints: bestType.count,
      metadata: JSON.stringify({
        avgEngagement: bestType.avgEngagement,
        avgLikes: bestType.avgLikes,
        avgSaves: bestType.avgSaves,
      }),
    });
  }

  // 2. Caption Tone Analysis
  const toneStats = ['witty', 'heartfelt', 'minimal', 'bold'].map(tone => {
    const posts = allContent.filter(c => c.captionTone === tone);
    const count = posts.length;

    if (count === 0) return null;

    const avgEngagement = posts.reduce((sum, c) => sum + c.engagementRate, 0) / count;
    const avgComments = posts.reduce((sum, c) => sum + c.comments, 0) / count;

    return { tone, count, avgEngagement, avgComments };
  }).filter(Boolean);

  const bestTone = toneStats.sort((a, b) => b!.avgEngagement - a!.avgEngagement)[0];
  if (bestTone && bestTone.count >= 3) {
    insights.push({
      insightType: 'caption_tone_winner',
      title: `${capitalize(bestTone.tone)} Captions Resonate Best`,
      description: `Posts with ${bestTone.tone} captions achieve ${bestTone.avgEngagement.toFixed(2)}% engagement and ${bestTone.avgComments.toFixed(1)} avg comments.`,
      recommendation: `Use ${bestTone.tone} tone for your next 5 posts to maximize engagement.`,
      confidence: Math.min(0.9, 0.5 + (bestTone.count / 15)),
      dataPoints: bestTone.count,
      metadata: JSON.stringify({
        avgEngagement: bestTone.avgEngagement,
        avgComments: bestTone.avgComments,
      }),
    });
  }

  // 3. Trending Animal Analysis
  const animalStats: Record<string, { count: number; totalEngagement: number; totalReach: number }> = {};
  allContent.forEach(c => {
    if (!animalStats[c.animal]) {
      animalStats[c.animal] = { count: 0, totalEngagement: 0, totalReach: 0 };
    }
    animalStats[c.animal].count++;
    animalStats[c.animal].totalEngagement += c.engagementRate;
    animalStats[c.animal].totalReach += c.reach;
  });

  const topAnimals = Object.entries(animalStats)
    .map(([animal, stats]) => ({
      animal,
      count: stats.count,
      avgEngagement: stats.totalEngagement / stats.count,
      totalReach: stats.totalReach,
    }))
    .sort((a, b) => b.avgEngagement - a.avgEngagement)
    .slice(0, 3);

  if (topAnimals.length > 0 && topAnimals[0].count >= 3) {
    const top = topAnimals[0];
    insights.push({
      insightType: 'trending_animal',
      title: `${top.animal} Content is Trending`,
      description: `${top.animal} posts drive ${top.avgEngagement.toFixed(2)}% engagement and ${top.totalReach.toLocaleString()} total reach.`,
      recommendation: `Feature more ${top.animal.toLowerCase()} content. Consider creating a ${top.animal} themed series.`,
      confidence: Math.min(0.85, 0.55 + (top.count / 18)),
      dataPoints: top.count,
      metadata: JSON.stringify({ topAnimals }),
    });
  }

  // 4. Posting Time Analysis (if we have timestamps)
  const postsWithTime = allContent.filter(c => c.postedAt).map(c => ({
    hour: new Date(c.postedAt!).getHours(),
    engagementRate: c.engagementRate,
    reach: c.reach,
  }));

  if (postsWithTime.length >= 10) {
    const hourStats: Record<number, { count: number; totalEngagement: number }> = {};
    postsWithTime.forEach(p => {
      if (!hourStats[p.hour]) hourStats[p.hour] = { count: 0, totalEngagement: 0 };
      hourStats[p.hour].count++;
      hourStats[p.hour].totalEngagement += p.engagementRate;
    });

    const bestHours = Object.entries(hourStats)
      .map(([hour, stats]) => ({
        hour: parseInt(hour),
        avgEngagement: stats.totalEngagement / stats.count,
        count: stats.count,
      }))
      .filter(h => h.count >= 2)
      .sort((a, b) => b.avgEngagement - a.avgEngagement)
      .slice(0, 3);

    if (bestHours.length > 0) {
      const bestHour = bestHours[0];
      const timeRange = formatTimeRange(bestHour.hour);

      insights.push({
        insightType: 'optimal_posting_time',
        title: `Peak Engagement at ${timeRange}`,
        description: `Posts published around ${timeRange} achieve ${bestHour.avgEngagement.toFixed(2)}% engagement on average.`,
        recommendation: `Schedule your next posts for ${timeRange} to maximize reach and engagement.`,
        confidence: Math.min(0.8, 0.4 + (bestHour.count / 12)),
        dataPoints: bestHour.count,
        metadata: JSON.stringify({ bestHours }),
      });
    }
  }

  // 5. Save Rate Analysis (high save rate = valuable content)
  const highSavePosts = allContent
    .filter(c => c.reach > 0)
    .map(c => ({
      ...c,
      saveRate: c.reach > 0 ? (c.saves / c.reach) * 100 : 0,
    }))
    .filter(c => c.saveRate > 5)
    .sort((a, b) => b.saveRate - a.saveRate)
    .slice(0, 5);

  if (highSavePosts.length >= 3) {
    const avgSaveRate = highSavePosts.reduce((sum, c) => sum + c.saveRate, 0) / highSavePosts.length;
    const commonTypes = countOccurrences(highSavePosts.map(p => p.contentType));

    insights.push({
      insightType: 'high_value_content',
      title: 'High-Save Content Drives Long-Term Value',
      description: `${highSavePosts.length} posts have ${avgSaveRate.toFixed(2)}% save rate, indicating valuable evergreen content.`,
      recommendation: `Create more ${formatContentType(commonTypes[0])} content similar to your top saved posts. These posts continue driving traffic long after publishing.`,
      confidence: 0.75,
      dataPoints: highSavePosts.length,
      metadata: JSON.stringify({
        topSavedPosts: highSavePosts.slice(0, 3).map(p => ({
          title: p.title,
          saveRate: p.saveRate,
          contentType: p.contentType,
        })),
      }),
    });
  }

  // Store insights in database
  console.log(`💡 Generated ${insights.length} insights:\n`);
  for (const insight of insights) {
    await prisma.contentInsight.create({
      data: {
        ...insight,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Valid for 30 days
        active: true,
      },
    });

    console.log(`✅ ${insight.title}`);
    console.log(`   ${insight.description}`);
    console.log(`   💪 Confidence: ${(insight.confidence * 100).toFixed(0)}% | Data points: ${insight.dataPoints}\n`);
  }

  console.log('🎉 Insights generation complete!');
}

function formatContentType(type: string): string {
  const map: Record<string, string> = {
    portrait: 'Portrait',
    emoji_set: 'Emoji Set',
    zodiac: 'Zodiac',
    reel: 'Reel',
  };
  return map[type] || type;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatTimeRange(hour: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:00 ${period}`;
}

function countOccurrences(arr: string[]): string[] {
  const counts = arr.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => key);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
