/**
 * Pawcasso Instagram Reels - Batch Content Generator
 * Generates 30 days of Reels content using the n8n + Manus pipeline.
 * Creates video specs, captions, hashtags, and posting schedules.
 */

import * as fs from 'fs';
import * as path from 'path';
import { generateHashtagsForDay, formatHashtagString } from './hashtag-engine';

interface ReelSpec {
  day: number;
  date: string;
  postTime: string;
  theme: string;
  title: string;
  hook: string;
  imageFile: string;
  imagePath: string;
  imageUrl: string;
  videoStyle: string;
  duration: string;
  caption: string;
  hashtags: string[];
  hashtagString: string;
  trendingAudio: string;
  cta: string;
  engagementPrompt: string;
  n8nPayload: N8nPayload;
  status: 'pending' | 'generated' | 'reviewed' | 'scheduled' | 'posted';
  filename: string;
}

interface N8nPayload {
  'field-0': string; // animal type
  'field-1': string; // breed
  'field-2': string; // style
  'field-3': string; // mood/concept
  'field-4': string; // special instructions
  'field-5': string; // reference notes
}

interface BatchResult {
  campaign: string;
  generatedAt: string;
  totalReels: number;
  startDate: string;
  endDate: string;
  postingTime: string;
  reels: ReelSpec[];
  n8nWorkflowUrl: string;
  n8nFormUrl: string;
  summary: BatchSummary;
}

interface BatchSummary {
  byTheme: Record<string, number>;
  byAnimal: Record<string, number>;
  byStyle: Record<string, number>;
  totalHashtags: number;
  uniqueHashtags: number;
}

const N8N_FORM_URL = 'https://n8n.aws.metafb.cloud/form/8ae3cd62-13ea-4c8a-9ffc-2c1148783ee2';
const N8N_WEBHOOK_URL = 'https://n8n.aws.metafb.cloud/webhook/pawcasso-batch';
const GALLERY_DIR = path.join(__dirname, '..', 'website', 'public', 'gallery');
const BASE_IMAGE_URL = 'https://pawcasso-atelier.vercel.app/gallery';

// Map image files to animal/breed/style
const IMAGE_METADATA: Record<string, { animal: string; breed: string; style: string }> = {
  'alfie_border_collie_portrait_2048x2048.webp': { animal: 'Dog', breed: 'Border Collie', style: 'Ink Wash' },
  'alfie_imperial_portrait_2048x2048.webp': { animal: 'Dog', breed: 'Border Collie', style: 'Chinese Classical' },
  'alfie_portrait_final.webp': { animal: 'Dog', breed: 'Border Collie', style: 'Pixar 3D' },
  'border_collie_portrait_2048x2048.webp': { animal: 'Dog', breed: 'Border Collie', style: 'Needle Felt' },
  'cat_vermeer.webp': { animal: 'Cat', breed: 'Cat', style: 'Renaissance' },
  'chihuahua_portrait_16x9.webp': { animal: 'Dog', breed: 'Chihuahua', style: 'Pixel Art' },
  'chihuahua_portrait_square_2048.jpg': { animal: 'Dog', breed: 'Chihuahua', style: 'Pixar 3D' },
  'golden_retriever_portrait_square.webp': { animal: 'Dog', breed: 'Golden Retriever', style: 'Pixar 3D' },
  'pomeranian_portrait_final.webp': { animal: 'Dog', breed: 'Pomeranian', style: 'Needle Felt' },
  'shiba_inu_felt_portrait_2048x2048.webp': { animal: 'Dog', breed: 'Shiba Inu', style: 'Needle Felt' },
  'shiba_inu_vinyl_toy_portrait_final.webp': { animal: 'Dog', breed: 'Shiba Inu', style: 'Vinyl Toy' },
  'shiba_portrait_final_2048x2048.webp': { animal: 'Dog', breed: 'Shiba Inu', style: 'Pixar 3D' },
  'shiba_portrait_final.webp': { animal: 'Dog', breed: 'Shiba Inu', style: 'Needle Felt' },
  'white_pomeranian_portrait_final.webp': { animal: 'Dog', breed: 'Pomeranian', style: 'Pixar 3D' },
};

function getImageMetadata(filename: string) {
  return IMAGE_METADATA[filename] || { animal: 'Dog', breed: 'Mixed', style: 'Pixar 3D' };
}

function buildN8nPayload(imageFile: string, hook: string, style: string): N8nPayload {
  const meta = getImageMetadata(imageFile);
  return {
    'field-0': meta.animal,
    'field-1': meta.breed,
    'field-2': style || meta.style,
    'field-3': hook,
    'field-4': `Instagram Reel content. Create a visually striking ${meta.style} portrait suitable for 1080x1920 vertical format.`,
    'field-5': `Source image: ${imageFile}. Optimize for Instagram Reels engagement.`,
  };
}

function generateFilename(day: number, date: string, hook: string): string {
  const hookSlug = hook
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 30);
  return `reel_day${String(day).padStart(2, '0')}_${date}_${hookSlug}.mp4`;
}

function generateBatch(): BatchResult {
  const calendarPath = path.join(__dirname, 'reels-calendar-30day.json');
  const calendar = JSON.parse(fs.readFileSync(calendarPath, 'utf-8'));

  const reels: ReelSpec[] = [];
  const allHashtags = new Set<string>();
  const themeCount: Record<string, number> = {};
  const animalCount: Record<string, number> = {};
  const styleCount: Record<string, number> = {};

  for (const day of calendar.days) {
    const post = day.post;
    const meta = getImageMetadata(post.image_file);

    // Generate optimized hashtags
    const hashtags = generateHashtagsForDay(day.day, day);
    hashtags.forEach(tag => allHashtags.add(tag));

    // Build n8n payload for content generation
    const n8nPayload = buildN8nPayload(post.image_file, post.hook, meta.style);

    // Track counts
    themeCount[day.theme] = (themeCount[day.theme] || 0) + 1;
    animalCount[meta.animal + ' - ' + meta.breed] = (animalCount[meta.animal + ' - ' + meta.breed] || 0) + 1;
    styleCount[meta.style] = (styleCount[meta.style] || 0) + 1;

    const reel: ReelSpec = {
      day: day.day,
      date: day.date,
      postTime: `${day.date}T11:00:00-07:00`, // 11 AM PT
      theme: day.theme,
      title: day.title,
      hook: post.hook,
      imageFile: post.image_file,
      imagePath: path.join(GALLERY_DIR, post.image_file),
      imageUrl: `${BASE_IMAGE_URL}/${post.image_file}`,
      videoStyle: post.video_style,
      duration: post.duration,
      caption: post.caption,
      hashtags,
      hashtagString: formatHashtagString(hashtags),
      trendingAudio: post.trending_audio,
      cta: post.cta,
      engagementPrompt: post.engagement_prompt,
      n8nPayload,
      status: 'pending',
      filename: generateFilename(day.day, day.date, post.hook),
    };

    reels.push(reel);
  }

  return {
    campaign: 'Pawcasso Instagram Reels - 30 Day Sprint',
    generatedAt: new Date().toISOString(),
    totalReels: reels.length,
    startDate: calendar.days[0].date,
    endDate: calendar.days[calendar.days.length - 1].date,
    postingTime: '11:00 AM PT daily',
    reels,
    n8nWorkflowUrl: N8N_WEBHOOK_URL,
    n8nFormUrl: N8N_FORM_URL,
    summary: {
      byTheme: themeCount,
      byAnimal: animalCount,
      byStyle: styleCount,
      totalHashtags: Array.from(allHashtags).length * reels.length,
      uniqueHashtags: allHashtags.size,
    },
  };
}

function generateN8nCurlCommands(batch: BatchResult): string {
  const commands: string[] = [
    '#!/bin/bash',
    '# Pawcasso Instagram Reels - n8n Batch Generation Commands',
    `# Generated: ${batch.generatedAt}`,
    `# Total Reels: ${batch.totalReels}`,
    '',
    '# Each curl command triggers the n8n workflow to generate content',
    '# for one Instagram Reel via the Manus AI pipeline.',
    '',
    'set -e',
    '',
  ];

  for (const reel of batch.reels) {
    commands.push(`# Day ${reel.day}: ${reel.title} (${reel.date})`);
    commands.push(`echo "Generating Reel ${reel.day}/30: ${reel.hook}"`);
    commands.push(`curl -X POST "${N8N_FORM_URL}" \\`);
    commands.push(`  -H "Content-Type: application/x-www-form-urlencoded" \\`);
    commands.push(`  -d "field-0=${encodeURIComponent(reel.n8nPayload['field-0'])}" \\`);
    commands.push(`  -d "field-1=${encodeURIComponent(reel.n8nPayload['field-1'])}" \\`);
    commands.push(`  -d "field-2=${encodeURIComponent(reel.n8nPayload['field-2'])}" \\`);
    commands.push(`  -d "field-3=${encodeURIComponent(reel.n8nPayload['field-3'])}" \\`);
    commands.push(`  -d "field-4=${encodeURIComponent(reel.n8nPayload['field-4'])}" \\`);
    commands.push(`  -d "field-5=${encodeURIComponent(reel.n8nPayload['field-5'])}"`);
    commands.push('echo "Done."');
    commands.push('sleep 30  # Wait for Manus AI processing');
    commands.push('');
  }

  commands.push('echo "All 30 Reels submitted for generation!"');
  return commands.join('\n');
}

function generatePostingSchedule(batch: BatchResult): string {
  const lines: string[] = [
    'Pawcasso Instagram Reels - 30 Day Posting Schedule',
    '='.repeat(60),
    '',
    `Account: @pawcasso.atelier`,
    `Posting Time: 11:00 AM PT daily`,
    `Date Range: ${batch.startDate} to ${batch.endDate}`,
    '',
    'DAY | DATE       | THEME            | HOOK (first 50 chars)           | CTA',
    '-'.repeat(100),
  ];

  for (const reel of batch.reels) {
    const hookTrunc = reel.hook.substring(0, 48).padEnd(48);
    const theme = reel.theme.padEnd(16);
    lines.push(
      `${String(reel.day).padStart(3)} | ${reel.date} | ${theme} | ${hookTrunc} | ${reel.cta}`
    );
  }

  lines.push('');
  lines.push('THEME DISTRIBUTION:');
  Object.entries(batch.summary.byTheme).forEach(([theme, count]) => {
    lines.push(`  ${theme}: ${count} reels`);
  });

  lines.push('');
  lines.push('ANIMAL DISTRIBUTION:');
  Object.entries(batch.summary.byAnimal).forEach(([animal, count]) => {
    lines.push(`  ${animal}: ${count} reels`);
  });

  lines.push('');
  lines.push('STYLE DISTRIBUTION:');
  Object.entries(batch.summary.byStyle).forEach(([style, count]) => {
    lines.push(`  ${style}: ${count} reels`);
  });

  return lines.join('\n');
}

// Main execution
if (require.main === module) {
  console.log('Generating Pawcasso Instagram Reels batch...\n');

  const batch = generateBatch();

  // Save batch specification
  const batchOutputPath = path.join(__dirname, 'batch-output.json');
  fs.writeFileSync(batchOutputPath, JSON.stringify(batch, null, 2));
  console.log(`Batch spec saved to: ${batchOutputPath}`);

  // Save n8n curl commands
  const curlPath = path.join(__dirname, 'generate-reels.sh');
  fs.writeFileSync(curlPath, generateN8nCurlCommands(batch));
  fs.chmodSync(curlPath, '755');
  console.log(`n8n generation script saved to: ${curlPath}`);

  // Save posting schedule
  const schedulePath = path.join(__dirname, 'posting-schedule.txt');
  fs.writeFileSync(schedulePath, generatePostingSchedule(batch));
  console.log(`Posting schedule saved to: ${schedulePath}`);

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('BATCH GENERATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Reels: ${batch.totalReels}`);
  console.log(`Date Range: ${batch.startDate} to ${batch.endDate}`);
  console.log(`Posting Time: 11:00 AM PT daily`);
  console.log(`Unique Hashtags: ${batch.summary.uniqueHashtags}`);
  console.log('\nTheme Distribution:');
  Object.entries(batch.summary.byTheme).forEach(([theme, count]) => {
    console.log(`  ${theme}: ${count} reels`);
  });
  console.log('\nNext Steps:');
  console.log('  1. Run ./generate-reels.sh to submit all 30 reels to n8n pipeline');
  console.log('  2. Review generated content via GitHub Issues');
  console.log('  3. Approve and schedule via Instagram Creator Studio');
  console.log('  4. Monitor engagement via ./engagement-bot.ts');
}

export { generateBatch, generateN8nCurlCommands, generatePostingSchedule };
