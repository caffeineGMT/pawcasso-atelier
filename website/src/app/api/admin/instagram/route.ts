import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/admin/instagram
 * Get Instagram analytics dashboard data
 *
 * Returns:
 * - Overall stats (total posts, avg engagement, etc.)
 * - Performance by content type
 * - Top performing posts
 * - Recent posts
 * - Insights and recommendations
 */
export async function GET(request: NextRequest) {
  try {
    // Get all posted content
    const allContent = await prisma.instagramContent.findMany({
      where: { status: 'posted' },
      orderBy: { postedAt: 'desc' },
    });

    // Overall stats
    const totalPosts = allContent.length;
    const totalLikes = allContent.reduce((sum, c) => sum + c.likes, 0);
    const totalComments = allContent.reduce((sum, c) => sum + c.comments, 0);
    const totalSaves = allContent.reduce((sum, c) => sum + c.saves, 0);
    const totalReach = allContent.reduce((sum, c) => sum + c.reach, 0);
    const avgEngagementRate = totalPosts > 0
      ? parseFloat((allContent.reduce((sum, c) => sum + c.engagementRate, 0) / totalPosts).toFixed(2))
      : 0;

    // Performance by content type
    const contentTypes = ['portrait', 'emoji_set', 'zodiac', 'reel'];
    const performanceByType = contentTypes.map(type => {
      const posts = allContent.filter(c => c.contentType === type);
      const count = posts.length;

      if (count === 0) {
        return {
          contentType: type,
          count: 0,
          avgLikes: 0,
          avgComments: 0,
          avgSaves: 0,
          avgEngagementRate: 0,
          totalReach: 0,
        };
      }

      return {
        contentType: type,
        count,
        avgLikes: Math.round(posts.reduce((sum, c) => sum + c.likes, 0) / count),
        avgComments: Math.round(posts.reduce((sum, c) => sum + c.comments, 0) / count),
        avgSaves: Math.round(posts.reduce((sum, c) => sum + c.saves, 0) / count),
        avgEngagementRate: parseFloat(
          (posts.reduce((sum, c) => sum + c.engagementRate, 0) / count).toFixed(2)
        ),
        totalReach: posts.reduce((sum, c) => sum + c.reach, 0),
      };
    });

    // Top 10 performing posts by engagement rate
    const topPosts = [...allContent]
      .sort((a, b) => b.engagementRate - a.engagementRate)
      .slice(0, 10)
      .map(post => ({
        id: post.id,
        contentId: post.contentId,
        title: post.title,
        contentType: post.contentType,
        animal: post.animal,
        breed: post.breed,
        likes: post.likes,
        comments: post.comments,
        saves: post.saves,
        engagementRate: post.engagementRate,
        postedAt: post.postedAt,
        instagramPostUrl: post.instagramPostUrl,
      }));

    // Recent 20 posts
    const recentPosts = allContent.slice(0, 20).map(post => ({
      id: post.id,
      contentId: post.contentId,
      title: post.title,
      contentType: post.contentType,
      animal: post.animal,
      likes: post.likes,
      comments: post.comments,
      saves: post.saves,
      reach: post.reach,
      engagementRate: post.engagementRate,
      postedAt: post.postedAt,
    }));

    // Get active insights
    const insights = await prisma.contentInsight.findMany({
      where: { active: true },
      orderBy: { confidence: 'desc' },
      take: 5,
    });

    // Generate recommendations if we have enough data
    const recommendations = [];
    if (totalPosts >= 5) {
      // Find best performing content type
      const bestType = performanceByType
        .filter(t => t.count > 0)
        .sort((a, b) => b.avgEngagementRate - a.avgEngagementRate)[0];

      if (bestType) {
        recommendations.push({
          type: 'content_type',
          message: `${bestType.contentType} posts are your top performers with ${bestType.avgEngagementRate}% avg engagement rate`,
          action: `Create more ${bestType.contentType} content`,
        });
      }

      // Find best performing caption tone
      const captionTones = ['witty', 'heartfelt', 'minimal', 'bold'];
      const tonePerformance = captionTones.map(tone => {
        const posts = allContent.filter(c => c.captionTone === tone);
        const count = posts.length;
        if (count === 0) return null;

        return {
          tone,
          count,
          avgEngagementRate: posts.reduce((sum, c) => sum + c.engagementRate, 0) / count,
        };
      }).filter(Boolean);

      const bestTone = tonePerformance.sort((a, b) => b!.avgEngagementRate - a!.avgEngagementRate)[0];
      if (bestTone) {
        recommendations.push({
          type: 'caption_tone',
          message: `${bestTone.tone} captions perform best (${bestTone.avgEngagementRate.toFixed(2)}% engagement)`,
          action: `Use ${bestTone.tone} tone for future posts`,
        });
      }
    }

    return NextResponse.json({
      overview: {
        totalPosts,
        totalLikes,
        totalComments,
        totalSaves,
        totalReach,
        avgEngagementRate,
      },
      performanceByType,
      topPosts,
      recentPosts,
      insights: insights.map(i => ({
        type: i.insightType,
        title: i.title,
        description: i.description,
        recommendation: i.recommendation,
        confidence: i.confidence,
      })),
      recommendations,
    });
  } catch (error) {
    console.error('Error fetching Instagram analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
