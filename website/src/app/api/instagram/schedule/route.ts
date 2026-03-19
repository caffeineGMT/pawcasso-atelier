import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

const READY_TO_POST_PATH = path.resolve(
  process.cwd(),
  '../content/captions/ready-to-post.json'
);
const POSTING_LOG_PATH = path.resolve(
  process.cwd(),
  '../content/posting-log.json'
);

interface ScheduledPost {
  id: number;
  image: string;
  pillar: string;
  style: string;
  animal: string;
  title: string;
  caption: string;
  hashtags: string;
  status: string;
  postedAt?: string;
  instagramMediaId?: string;
}

interface PostingLog {
  lastPostedId: number;
  lastPostedDate: string;
  posts: Array<{
    id: number;
    postedAt: string;
    instagramMediaId: string;
    caption: string;
  }>;
}

function loadPosts(): ScheduledPost[] {
  if (!fs.existsSync(READY_TO_POST_PATH)) return [];
  return JSON.parse(fs.readFileSync(READY_TO_POST_PATH, 'utf-8'));
}

function loadLog(): PostingLog {
  if (!fs.existsSync(POSTING_LOG_PATH)) {
    return { lastPostedId: 0, lastPostedDate: '', posts: [] };
  }
  return JSON.parse(fs.readFileSync(POSTING_LOG_PATH, 'utf-8'));
}

function savePosts(posts: ScheduledPost[]): void {
  fs.writeFileSync(READY_TO_POST_PATH, JSON.stringify(posts, null, 2));
}

function saveLog(log: PostingLog): void {
  fs.writeFileSync(POSTING_LOG_PATH, JSON.stringify(log, null, 2));
}

/**
 * GET /api/instagram/schedule
 * Returns the next unposted entry and posting stats.
 */
export async function GET() {
  try {
    const posts = loadPosts();
    const log = loadLog();
    const postedIds = new Set(log.posts.map((p) => p.id));
    const nextPost = posts.find(
      (p) => p.status === 'ready' && !postedIds.has(p.id)
    );

    return NextResponse.json({
      nextPost: nextPost || null,
      stats: {
        total: posts.length,
        posted: log.posts.length,
        ready: posts.filter(
          (p) => p.status === 'ready' && !postedIds.has(p.id)
        ).length,
        skipped: posts.filter((p) => p.status === 'skipped').length,
      },
      recentPosts: log.posts.slice(-5).reverse(),
    });
  } catch (error) {
    console.error('Schedule fetch error:', error);
    return NextResponse.json({ error: 'Failed to load schedule' }, { status: 500 });
  }
}

/**
 * POST /api/instagram/schedule
 * Record a successful post or update post status.
 * Body: { action: 'posted' | 'skipped' | 'update_caption', postId, instagramMediaId?, caption? }
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.INSTAGRAM_WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, postId, instagramMediaId, caption } = await req.json();

    if (!action || !postId) {
      return NextResponse.json(
        { error: 'action and postId are required' },
        { status: 400 }
      );
    }

    const posts = loadPosts();
    const post = posts.find((p) => p.id === postId);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    switch (action) {
      case 'posted': {
        post.status = 'posted';
        post.postedAt = new Date().toISOString();
        post.instagramMediaId = instagramMediaId;
        savePosts(posts);

        const log = loadLog();
        log.lastPostedId = postId;
        log.lastPostedDate = new Date().toISOString();
        log.posts.push({
          id: postId,
          postedAt: new Date().toISOString(),
          instagramMediaId: instagramMediaId || '',
          caption: (caption || post.caption).slice(0, 200),
        });
        saveLog(log);
        break;
      }

      case 'skipped': {
        post.status = 'skipped';
        savePosts(posts);
        break;
      }

      case 'update_caption': {
        if (caption) {
          post.caption = caption;
          savePosts(posts);
        }
        break;
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Schedule update error:', error);
    return NextResponse.json(
      { error: 'Failed to update schedule' },
      { status: 500 }
    );
  }
}
