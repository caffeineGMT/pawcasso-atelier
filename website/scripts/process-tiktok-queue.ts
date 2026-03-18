#!/usr/bin/env tsx
/**
 * TikTok Queue Processor (Cron Job)
 *
 * Processes scheduled posts from tiktok-queue.json and publishes them via TikTok API.
 * Should be run every 30 minutes via cron.
 *
 * Usage:
 *   npx tsx scripts/process-tiktok-queue.ts
 *
 * Cron setup:
 *   (asterisk)/30 * * * * cd /path/to/website && npx tsx scripts/process-tiktok-queue.ts >> logs/tiktok-cron.log 2>&1
 */

import { processScheduledPosts } from '../src/lib/tiktok-api';

async function main() {
  console.log(`\n[${new Date().toISOString()}] Processing TikTok queue...`);

  try {
    await processScheduledPosts();
    console.log(`[${new Date().toISOString()}] Queue processing completed successfully`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error processing queue:`, error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
