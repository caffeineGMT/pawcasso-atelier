#!/usr/bin/env tsx
/**
 * TikTok Batch Scheduler
 *
 * Loads video metadata batch and schedules posts via TikTok API.
 * Supports both immediate publishing and scheduled posting.
 *
 * Usage:
 *   npx tsx scripts/schedule-tiktok-batch.ts                    # Use default tiktok-batch-60.json
 *   npx tsx scripts/schedule-tiktok-batch.ts --input batch.json # Use custom input file
 *   npx tsx scripts/schedule-tiktok-batch.ts --test 3           # Test with first 3 videos only
 */

import fs from 'fs';
import path from 'path';
import { schedulePost, type ScheduledPost } from '../src/lib/tiktok-api';

interface VideoMetadata {
  id: string;
  videoUrl: string;
  imageFile: string;
  breed: string;
  style: string;
  caption: string;
  hook: string;
  hashtags: string;
  scheduledFor: string;
  postingTime: 'morning' | 'evening';
  dayNumber: number;
}

async function loadBatch(inputFile: string): Promise<VideoMetadata[]> {
  const inputPath = path.join(process.cwd(), 'website', inputFile);

  if (!fs.existsSync(inputPath)) {
    throw new Error(`Batch file not found: ${inputPath}`);
  }

  const content = fs.readFileSync(inputPath, 'utf-8');
  const batch: VideoMetadata[] = JSON.parse(content);

  return batch;
}

async function scheduleBatch(batch: VideoMetadata[], testMode: boolean = false): Promise<void> {
  const postsToSchedule = testMode ? batch.slice(0, 3) : batch;

  console.log(`Scheduling ${postsToSchedule.length} posts...`);

  for (let i = 0; i < postsToSchedule.length; i++) {
    const video = postsToSchedule[i];

    const scheduledPost: ScheduledPost = {
      id: video.id,
      videoUrl: video.videoUrl,
      caption: `${video.caption}\n\n${video.hashtags}\n\nCustom pet portraits $9 - link in bio 👆\n\n#pawcassoatelier`,
      scheduledFor: new Date(video.scheduledFor),
      status: 'pending',
    };

    await schedulePost(scheduledPost);

    console.log(`✓ Scheduled: ${video.id} for ${video.scheduledFor} (${video.postingTime})`);
  }

  console.log(`\n✅ Successfully scheduled ${postsToSchedule.length} posts!`);
}

async function main() {
  const args = process.argv.slice(2);
  let inputFile = 'tiktok-batch-60.json';
  let testMode = false;
  let testCount = 3;

  // Parse CLI arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--input' && args[i + 1]) {
      inputFile = args[i + 1];
      i++;
    } else if (args[i] === '--test') {
      testMode = true;
      if (args[i + 1] && !args[i + 1].startsWith('--')) {
        testCount = parseInt(args[i + 1], 10);
        i++;
      }
    }
  }

  console.log(`\nPawcasso Atelier - TikTok Batch Scheduler\n`);
  console.log(`Input file: ${inputFile}`);
  console.log(`Test mode: ${testMode ? `Yes (${testCount} videos)` : 'No'}\n`);

  const batch = await loadBatch(inputFile);

  console.log(`Loaded ${batch.length} video metadata entries`);
  console.log(`Date range: ${batch[0].scheduledFor.split('T')[0]} to ${batch[batch.length - 1].scheduledFor.split('T')[0]}\n`);

  if (testMode) {
    console.log(`⚠️  TEST MODE: Only scheduling first ${testCount} videos\n`);
    await scheduleBatch(batch.slice(0, testCount), true);
  } else {
    await scheduleBatch(batch, false);
  }

  console.log(`\n📋 Next steps:`);
  console.log(`  1. Set up cron job to process queue every 30 minutes`);
  console.log(`  2. Monitor tiktok-queue.json for status updates`);
  console.log(`  3. Check admin dashboard for analytics`);
  console.log(`\n🔧 Cron setup:`);
  console.log(`  crontab -e`);
  console.log(`  */30 * * * * cd /Users/michaelguo/pawcasso-atelier/website && npx tsx scripts/process-tiktok-queue.ts`);
}

if (require.main === module) {
  main().catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
}

export { loadBatch, scheduleBatch };
