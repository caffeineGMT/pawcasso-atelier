#!/usr/bin/env tsx
/**
 * Batch Video Metadata Generator
 *
 * Generates 60 TikTok video metadata entries with:
 * - Captions (AI-generated via GPT-4)
 * - Viral hooks
 * - Trending hashtags
 * - Optimal posting schedule (2x daily for 30 days)
 * - Video URLs (from existing gallery)
 *
 * Usage:
 *   npx tsx scripts/generate-video-batch.ts
 *   npx tsx scripts/generate-video-batch.ts --count 90 --output batch-90.json
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { generateCaption, generateFallbackCaption } from './generate-captions';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

interface GalleryImage {
  file: string;
  animal: string;
  breed: string;
  style: string;
}

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

const GALLERY_IMAGES: GalleryImage[] = [
  { file: 'alfie_border_collie_portrait_2048x2048.webp', animal: 'Border Collie', breed: 'Border Collie', style: 'Ink Wash' },
  { file: 'alfie_imperial_portrait_2048x2048.webp', animal: 'Border Collie', breed: 'Border Collie', style: 'Chinese Classical' },
  { file: 'alfie_portrait_final.webp', animal: 'Border Collie', breed: 'Border Collie', style: 'Pixar 3D' },
  { file: 'border_collie_portrait_2048x2048.webp', animal: 'Border Collie', breed: 'Border Collie', style: 'Needle Felt' },
  { file: 'cat_vermeer.webp', animal: 'Cat', breed: 'Cat', style: 'Renaissance' },
  { file: 'chihuahua_portrait_16x9.webp', animal: 'Chihuahua', breed: 'Chihuahua', style: 'Pixel Art' },
  { file: 'chihuahua_portrait_square_2048.jpg', animal: 'Chihuahua', breed: 'Chihuahua', style: 'Pixar 3D' },
  { file: 'golden_retriever_portrait_square.webp', animal: 'Golden Retriever', breed: 'Golden Retriever', style: 'Pixar 3D' },
  { file: 'pomeranian_portrait_final.webp', animal: 'Pomeranian', breed: 'Pomeranian', style: 'Needle Felt' },
  { file: 'shiba_inu_felt_portrait_2048x2048.webp', animal: 'Shiba Inu', breed: 'Shiba Inu', style: 'Needle Felt' },
  { file: 'shiba_inu_vinyl_toy_portrait_final.webp', animal: 'Shiba Inu', breed: 'Shiba Inu', style: 'Vinyl Toy' },
  { file: 'shiba_portrait_final_2048x2048.webp', animal: 'Shiba Inu', breed: 'Shiba Inu', style: 'Pixar 3D' },
  { file: 'shiba_portrait_final.webp', animal: 'Shiba Inu', breed: 'Shiba Inu', style: 'Needle Felt' },
  { file: 'white_pomeranian_portrait_final.webp', animal: 'Pomeranian', breed: 'Pomeranian', style: 'Pixar 3D' },
];

const VIRAL_HOOKS = [
  "POV: Your {breed} becomes a {style} masterpiece",
  "What if your dog was a {style} painting?",
  "This AI turned my {breed} into art and I'm OBSESSED",
  "Tell me this isn't the cutest thing you've seen today",
  "My {breed} got the royal {style} treatment",
  "Etsy: $500 + 6 weeks. Me: $9 + 24 hours",
  "I turned my {breed} into a $10K {style} painting",
  "Your {breed} deserves to be {style} art",
  "AI pet portraits hit different",
  "When your dog becomes a museum piece",
  "This $9 gift made my friend cry",
  "Best thing I've bought for my dog all year",
  "If Pixar made pet portraits",
  "Your pet as a Renaissance painting? Yes please",
  "This is why I love the future",
];

const TRENDING_HASHTAGS = [
  '#petportrait #customart #doglovers #aiart #petparent #dogsoftiktok',
  '#petportrait #dogportrait #aiart #customart #petlovers #furbaby',
  '#aiart #petart #doglovers #customportrait #petsoftiktok #digitalpet',
  '#petportrait #dogmom #catmom #aiart #petart #customart',
  '#dogsoftiktok #petportrait #aiart #digitalpet #customart #petlovers',
  '#petart #aiartwork #dogportrait #customart #petparent #dogtok',
  '#petportrait #customdogportrait #aiart #doglovers #petmemories',
  '#aiart #petportrait #dogsoftiktok #customart #furbaby #petparent',
];

/**
 * Generate posting schedule (2x daily: 9 AM & 6 PM PT for 30 days)
 */
function generatePostingSchedule(count: number): Array<{ date: Date; time: 'morning' | 'evening'; dayNumber: number }> {
  const schedule = [];
  const startDate = new Date();
  startDate.setHours(9, 0, 0, 0); // Start tomorrow at 9 AM PT

  let dayNumber = 1;
  for (let i = 0; i < count; i++) {
    const isEvening = i % 2 === 1;
    const dayOffset = Math.floor(i / 2);

    const postDate = new Date(startDate);
    postDate.setDate(postDate.getDate() + dayOffset);

    if (isEvening) {
      postDate.setHours(18, 0, 0, 0); // 6 PM PT
    } else {
      postDate.setHours(9, 0, 0, 0); // 9 AM PT
    }

    schedule.push({
      date: postDate,
      time: isEvening ? 'evening' as const : 'morning' as const,
      dayNumber: dayNumber,
    });

    if (isEvening) {
      dayNumber++;
    }
  }

  return schedule;
}

/**
 * Generate caption using OpenAI or fallback
 */
async function generateCaptionForVideo(breed: string, style: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return generateFallbackCaption({ breed, style });
  }

  try {
    const caption = await generateCaption({ breed, style });
    return caption;
  } catch (error) {
    console.warn(`Failed to generate AI caption for ${breed} ${style}, using fallback`);
    return generateFallbackCaption({ breed, style });
  }
}

/**
 * Select random hook and replace placeholders
 */
function selectHook(breed: string, style: string): string {
  const hook = VIRAL_HOOKS[Math.floor(Math.random() * VIRAL_HOOKS.length)];
  return hook.replace('{breed}', breed).replace('{style}', style);
}

/**
 * Select random hashtag set
 */
function selectHashtags(): string {
  return TRENDING_HASHTAGS[Math.floor(Math.random() * TRENDING_HASHTAGS.length)];
}

/**
 * Generate batch of video metadata
 */
async function generateBatch(count: number): Promise<VideoMetadata[]> {
  const schedule = generatePostingSchedule(count);
  const batch: VideoMetadata[] = [];

  console.log(`Generating ${count} video metadata entries...`);
  console.log('Using OpenAI for captions:', !!process.env.OPENAI_API_KEY);

  for (let i = 0; i < count; i++) {
    // Cycle through gallery images
    const image = GALLERY_IMAGES[i % GALLERY_IMAGES.length];
    const scheduleEntry = schedule[i];

    // Generate caption (with rate limiting)
    if (i > 0 && i % 5 === 0) {
      console.log(`Generated ${i}/${count} captions...`);
      // Rate limit: wait 1 second every 5 captions
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const caption = await generateCaptionForVideo(image.breed, image.style);
    const hook = selectHook(image.breed, image.style);
    const hashtags = selectHashtags();

    const metadata: VideoMetadata = {
      id: `tiktok_${scheduleEntry.date.toISOString().split('T')[0]}_${scheduleEntry.time}`,
      videoUrl: `https://pawcasso-atelier.vercel.app/gallery/${image.file}`, // Placeholder - will be video URL after rendering
      imageFile: image.file,
      breed: image.breed,
      style: image.style,
      caption,
      hook,
      hashtags,
      scheduledFor: scheduleEntry.date.toISOString(),
      postingTime: scheduleEntry.time,
      dayNumber: scheduleEntry.dayNumber,
    };

    batch.push(metadata);
  }

  console.log(`Generated ${count} video metadata entries successfully!`);
  return batch;
}

/**
 * Main CLI
 */
async function main() {
  const args = process.argv.slice(2);
  let count = 60;
  let outputFile = 'tiktok-batch-60.json';

  // Parse CLI arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--count' && args[i + 1]) {
      count = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--output' && args[i + 1]) {
      outputFile = args[i + 1];
      i++;
    }
  }

  console.log(`\nPawcasso Atelier - TikTok Batch Generator\n`);
  console.log(`Generating ${count} video metadata entries...`);
  console.log(`Output: ${outputFile}\n`);

  const batch = await generateBatch(count);

  // Save to file
  const outputPath = path.join(process.cwd(), 'website', outputFile);
  fs.writeFileSync(outputPath, JSON.stringify(batch, null, 2));

  console.log(`\n✅ Batch generated successfully!`);
  console.log(`📁 Saved to: ${outputPath}`);
  console.log(`\n📊 Summary:`);
  console.log(`  Total videos: ${batch.length}`);
  console.log(`  Duration: ${Math.ceil(batch.length / 2)} days`);
  console.log(`  Start date: ${batch[0].scheduledFor.split('T')[0]}`);
  console.log(`  End date: ${batch[batch.length - 1].scheduledFor.split('T')[0]}`);
  console.log(`\n🎬 Next steps:`);
  console.log(`  1. Review generated captions in ${outputFile}`);
  console.log(`  2. Run: npx tsx scripts/schedule-tiktok-batch.ts`);
  console.log(`  3. Monitor progress via admin dashboard`);
}

if (require.main === module) {
  main().catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
}

export { generateBatch, generatePostingSchedule, GALLERY_IMAGES };
