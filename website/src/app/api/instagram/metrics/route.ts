import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * POST /api/instagram/metrics
 * Update engagement metrics for an Instagram post
 *
 * Body: {
 *   contentId: string;
 *   likes: number;
 *   comments: number;
 *   saves: number;
 *   shares: number;
 *   reach: number;
 *   impressions: number;
 *   createSnapshot?: boolean; // Create a snapshot for time-series tracking
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      contentId,
      likes = 0,
      comments = 0,
      saves = 0,
      shares = 0,
      reach = 0,
      impressions = 0,
      createSnapshot = false,
    } = body;

    if (!contentId) {
      return NextResponse.json(
        { error: 'Missing required field: contentId' },
        { status: 400 }
      );
    }

    // Find the content
    const content = await prisma.instagramContent.findUnique({
      where: { contentId },
    });

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    // Calculate engagement rate
    const engagementRate = reach > 0
      ? parseFloat((((likes + comments + saves) / reach) * 100).toFixed(2))
      : 0;

    // Update content metrics
    const updated = await prisma.instagramContent.update({
      where: { contentId },
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

    // Create snapshot if requested
    if (createSnapshot && content.postedAt) {
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
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating Instagram metrics:', error);
    return NextResponse.json(
      { error: 'Failed to update metrics' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
