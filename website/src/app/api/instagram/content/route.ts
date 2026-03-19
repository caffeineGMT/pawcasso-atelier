import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * POST /api/instagram/content
 * Log Instagram content when posted
 *
 * Body: {
 *   contentId: string;  // From ig-queue (e.g., "8a4a00d3")
 *   contentType: 'portrait' | 'emoji_set' | 'zodiac' | 'reel';
 *   title: string;
 *   description?: string;
 *   animal: string;
 *   breed?: string;
 *   style: string;
 *   captionTone?: 'witty' | 'heartfelt' | 'minimal' | 'bold';
 *   captionText?: string;
 *   hashtags?: string[];
 *   instagramMediaId?: string;
 *   instagramPostUrl?: string;
 *   instagramMediaType?: 'IMAGE' | 'CAROUSEL_ALBUM' | 'VIDEO';
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      contentId,
      contentType,
      title,
      description,
      animal,
      breed,
      style,
      captionTone,
      captionText,
      hashtags,
      instagramMediaId,
      instagramPostUrl,
      instagramMediaType,
    } = body;

    // Validation
    if (!contentId || !contentType || !title || !animal || !style) {
      return NextResponse.json(
        { error: 'Missing required fields: contentId, contentType, title, animal, style' },
        { status: 400 }
      );
    }

    // Check if content already exists
    const existing = await prisma.instagramContent.findUnique({
      where: { contentId },
    });

    if (existing) {
      // Update existing content
      const updated = await prisma.instagramContent.update({
        where: { contentId },
        data: {
          captionTone,
          captionText,
          hashtags: hashtags ? JSON.stringify(hashtags) : undefined,
          instagramMediaId,
          instagramPostUrl,
          instagramMediaType,
          status: instagramMediaId ? 'posted' : 'queued',
          postedAt: instagramMediaId && !existing.postedAt ? new Date() : undefined,
        },
      });

      return NextResponse.json(updated);
    }

    // Create new content entry
    const content = await prisma.instagramContent.create({
      data: {
        contentId,
        contentType,
        title,
        description,
        animal,
        breed,
        style,
        captionTone,
        captionText,
        hashtags: hashtags ? JSON.stringify(hashtags) : undefined,
        instagramMediaId,
        instagramPostUrl,
        instagramMediaType,
        status: instagramMediaId ? 'posted' : 'generated',
        postedAt: instagramMediaId ? new Date() : undefined,
      },
    });

    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    console.error('Error logging Instagram content:', error);
    return NextResponse.json(
      { error: 'Failed to log Instagram content' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * GET /api/instagram/content
 * Get all Instagram content with optional filters
 *
 * Query params:
 *   - status: 'generated' | 'queued' | 'posted' | 'archived'
 *   - contentType: 'portrait' | 'emoji_set' | 'zodiac' | 'reel'
 *   - limit: number (default: 50)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const contentType = searchParams.get('contentType');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const where: any = {};
    if (status) where.status = status;
    if (contentType) where.contentType = contentType;

    const content = await prisma.instagramContent.findMany({
      where,
      orderBy: { generatedAt: 'desc' },
      take: limit,
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching Instagram content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Instagram content' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
