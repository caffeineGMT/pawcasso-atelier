/**
 * Posting Schedule Manager for Pawcasso Atelier
 *
 * Reads from content/captions/ready-to-post.json and manages
 * a posting queue with status tracking.
 */

import * as fs from 'fs';
import * as path from 'path';

const CONTENT_DIR = path.resolve(__dirname, '../../content');
const READY_TO_POST_PATH = path.join(CONTENT_DIR, 'captions/ready-to-post.json');
const POSTING_LOG_PATH = path.join(CONTENT_DIR, 'posting-log.json');

export interface ScheduledPost {
  id: number;
  image: string;
  pillar: string;
  style: string;
  animal: string;
  title: string;
  caption: string;
  hashtags: string;
  status: 'ready' | 'pending_approval' | 'approved' | 'posted' | 'skipped';
  scheduledDate?: string;
  postedAt?: string;
  instagramMediaId?: string;
  engagementRate?: number;
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

/**
 * Load all posts from ready-to-post.json
 */
export function loadPosts(): ScheduledPost[] {
  if (!fs.existsSync(READY_TO_POST_PATH)) {
    throw new Error(`Posts file not found: ${READY_TO_POST_PATH}`);
  }

  const raw = fs.readFileSync(READY_TO_POST_PATH, 'utf-8');
  return JSON.parse(raw);
}

/**
 * Load the posting log (tracks what's been posted).
 */
function loadPostingLog(): PostingLog {
  if (!fs.existsSync(POSTING_LOG_PATH)) {
    return { lastPostedId: 0, lastPostedDate: '', posts: [] };
  }
  const raw = fs.readFileSync(POSTING_LOG_PATH, 'utf-8');
  return JSON.parse(raw);
}

/**
 * Save the posting log.
 */
function savePostingLog(log: PostingLog): void {
  fs.writeFileSync(POSTING_LOG_PATH, JSON.stringify(log, null, 2));
}

/**
 * Get the next unposted entry from the schedule.
 */
export function getNextPost(): ScheduledPost | null {
  const posts = loadPosts();
  const log = loadPostingLog();

  const postedIds = new Set(log.posts.map((p) => p.id));
  const nextPost = posts.find((p) => p.status === 'ready' && !postedIds.has(p.id));

  return nextPost || null;
}

/**
 * Mark a post as posted and record it in the log.
 */
export function markAsPosted(
  postId: number,
  instagramMediaId: string,
  caption: string
): void {
  const log = loadPostingLog();

  log.lastPostedId = postId;
  log.lastPostedDate = new Date().toISOString();
  log.posts.push({
    id: postId,
    postedAt: new Date().toISOString(),
    instagramMediaId,
    caption: caption.slice(0, 200),
  });

  savePostingLog(log);

  // Update status in ready-to-post.json
  const posts = loadPosts();
  const post = posts.find((p) => p.id === postId);
  if (post) {
    post.status = 'posted';
    (post as ScheduledPost).postedAt = new Date().toISOString();
    (post as ScheduledPost).instagramMediaId = instagramMediaId;
    fs.writeFileSync(READY_TO_POST_PATH, JSON.stringify(posts, null, 2));
  }
}

/**
 * Mark a post as skipped.
 */
export function markAsSkipped(postId: number): void {
  const posts = loadPosts();
  const post = posts.find((p) => p.id === postId);
  if (post) {
    post.status = 'skipped';
    fs.writeFileSync(READY_TO_POST_PATH, JSON.stringify(posts, null, 2));
  }
}

/**
 * Update a post's caption before posting.
 */
export function updateCaption(postId: number, newCaption: string): void {
  const posts = loadPosts();
  const post = posts.find((p) => p.id === postId);
  if (post) {
    post.caption = newCaption;
    fs.writeFileSync(READY_TO_POST_PATH, JSON.stringify(posts, null, 2));
  }
}

/**
 * Get all posted entries with their Instagram media IDs (for metrics collection).
 */
export function getPostedEntries(): Array<{
  id: number;
  postedAt: string;
  instagramMediaId: string;
  caption: string;
}> {
  const log = loadPostingLog();
  return log.posts;
}

/**
 * Get posting stats.
 */
export function getPostingStats(): {
  totalPosts: number;
  posted: number;
  ready: number;
  skipped: number;
  daysActive: number;
} {
  const posts = loadPosts();
  const log = loadPostingLog();

  const firstPost = log.posts[0];
  const daysActive = firstPost
    ? Math.ceil(
        (Date.now() - new Date(firstPost.postedAt).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  return {
    totalPosts: posts.length,
    posted: log.posts.length,
    ready: posts.filter((p) => p.status === 'ready').length,
    skipped: posts.filter((p) => p.status === 'skipped').length,
    daysActive,
  };
}
