#!/usr/bin/env tsx
/**
 * Gallery Image Optimization Script
 *
 * Converts PNG gallery images to WebP format with multiple responsive sizes:
 * - 400w: Mobile
 * - 800w: Tablet
 * - 1200w: Desktop
 *
 * Quality: 85, Effort: 6 (high quality with good compression)
 *
 * Input: website/public/gallery/originals/*.png
 * Output: website/public/gallery/optimized/*-{size}.webp
 * Manifest: website/public/gallery/optimized/manifest.json
 */

import sharp from 'sharp';
import { readdir, mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

interface OptimizedImage {
  original: string;
  baseName: string;
  sizes: {
    width: number;
    path: string;
    size: number; // File size in bytes
  }[];
  originalSize: number;
  totalOptimizedSize: number;
  compressionRatio: number;
}

const SIZES = [400, 800, 1200];
const QUALITY = 85;
const EFFORT = 6;

const ORIGINALS_DIR = join(process.cwd(), 'public/gallery/originals');
const OPTIMIZED_DIR = join(process.cwd(), 'public/gallery/optimized');

async function getFileSize(filePath: string): Promise<number> {
  const fs = await import('fs/promises');
  const stats = await fs.stat(filePath);
  return stats.size;
}

async function optimizeImage(inputPath: string, baseName: string): Promise<OptimizedImage> {
  console.log(`\n📸 Processing: ${baseName}`);

  const originalSize = await getFileSize(inputPath);
  const optimized: OptimizedImage = {
    original: inputPath,
    baseName,
    sizes: [],
    originalSize,
    totalOptimizedSize: 0,
    compressionRatio: 0,
  };

  // Process each size
  for (const width of SIZES) {
    const outputFileName = `${baseName.replace(/\.(png|jpg|jpeg)$/i, '')}-${width}w.webp`;
    const outputPath = join(OPTIMIZED_DIR, outputFileName);

    try {
      // Convert and resize
      await sharp(inputPath)
        .resize(width, null, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({
          quality: QUALITY,
          effort: EFFORT,
        })
        .toFile(outputPath);

      const size = await getFileSize(outputPath);
      optimized.sizes.push({
        width,
        path: `/gallery/optimized/${outputFileName}`,
        size,
      });

      console.log(`  ✓ ${width}w: ${(size / 1024).toFixed(1)}KB`);
    } catch (error) {
      console.error(`  ✗ Failed to create ${width}w:`, error);
    }
  }

  // Calculate totals
  optimized.totalOptimizedSize = optimized.sizes.reduce((sum, s) => sum + s.size, 0);
  optimized.compressionRatio = optimized.originalSize / optimized.totalOptimizedSize;

  console.log(`  📊 Original: ${(originalSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`  📊 Optimized (all sizes): ${(optimized.totalOptimizedSize / 1024).toFixed(1)}KB`);
  console.log(`  📊 Compression: ${optimized.compressionRatio.toFixed(1)}x smaller`);

  return optimized;
}

async function main() {
  console.log('🎨 Gallery Image Optimization Pipeline\n');
  console.log(`📂 Source: ${ORIGINALS_DIR}`);
  console.log(`📂 Output: ${OPTIMIZED_DIR}\n`);
  console.log(`⚙️  Settings: Quality=${QUALITY}, Effort=${EFFORT}`);
  console.log(`⚙️  Sizes: ${SIZES.join('w, ')}w\n`);

  // Create output directory if it doesn't exist
  if (!existsSync(OPTIMIZED_DIR)) {
    await mkdir(OPTIMIZED_DIR, { recursive: true });
    console.log('✓ Created optimized directory\n');
  }

  // Read all PNG files
  const files = await readdir(ORIGINALS_DIR);
  const imageFiles = files.filter(f => /\.(png|jpg|jpeg)$/i.test(f));

  console.log(`Found ${imageFiles.length} images to optimize\n`);
  console.log('─'.repeat(60));

  // Process all images
  const results: OptimizedImage[] = [];
  for (const file of imageFiles) {
    const inputPath = join(ORIGINALS_DIR, file);
    const result = await optimizeImage(inputPath, file);
    results.push(result);
  }

  // Generate manifest
  const manifest = {
    generatedAt: new Date().toISOString(),
    totalImages: results.length,
    totalOriginalSize: results.reduce((sum, r) => sum + r.originalSize, 0),
    totalOptimizedSize: results.reduce((sum, r) => sum + r.totalOptimizedSize, 0),
    images: results.map(r => ({
      original: r.baseName,
      sizes: r.sizes,
    })),
  };

  await writeFile(
    join(OPTIMIZED_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  // Summary
  console.log('\n' + '─'.repeat(60));
  console.log('\n📊 SUMMARY\n');
  console.log(`Images processed: ${results.length}`);
  console.log(`Original total: ${(manifest.totalOriginalSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Optimized total: ${(manifest.totalOptimizedSize / 1024).toFixed(1)}KB`);
  console.log(`Overall compression: ${(manifest.totalOriginalSize / manifest.totalOptimizedSize).toFixed(1)}x`);
  console.log(`Average per image: ${(manifest.totalOptimizedSize / results.length / 1024).toFixed(1)}KB`);
  console.log('\n✅ Optimization complete!\n');
}

main().catch(console.error);
