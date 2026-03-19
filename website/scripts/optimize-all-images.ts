#!/usr/bin/env tsx
/**
 * Comprehensive Image Optimization Script
 *
 * Optimizes all images across the website:
 * - /public/pets/ - Pet reference photos
 * - /public/refs/ - Style reference images
 * - Any other PNG/JPG files in public/
 *
 * Creates WebP versions with multiple responsive sizes and blur placeholders
 */

import sharp from 'sharp';
import { readdir, mkdir, writeFile, stat } from 'fs/promises';
import { existsSync } from 'fs';
import { join, relative, dirname, basename, extname } from 'path';

interface OptimizedImage {
  original: string;
  relativePath: string;
  sizes: {
    width: number;
    path: string;
    size: number;
  }[];
  blurDataURL: string;
  originalSize: number;
  totalOptimizedSize: number;
  compressionRatio: number;
}

const SIZES = [400, 800, 1200];
const QUALITY = 85;
const EFFORT = 6;

const PUBLIC_DIR = join(process.cwd(), 'public');
const OPTIMIZED_DIRS = {
  pets: join(PUBLIC_DIR, 'pets/optimized'),
  refs: join(PUBLIC_DIR, 'refs/optimized'),
};

async function generateBlurDataURL(imagePath: string): Promise<string> {
  const buffer = await sharp(imagePath)
    .resize(10)
    .webp({ quality: 20 })
    .toBuffer();

  const base64 = buffer.toString('base64');
  return `data:image/webp;base64,${base64}`;
}

async function getFileSize(filePath: string): Promise<number> {
  const stats = await stat(filePath);
  return stats.size;
}

async function optimizeImage(
  inputPath: string,
  outputDir: string,
  baseName: string
): Promise<OptimizedImage> {
  console.log(`\n📸 Processing: ${baseName}`);

  const originalSize = await getFileSize(inputPath);
  const nameWithoutExt = baseName.replace(/\.(png|jpg|jpeg)$/i, '');

  const optimized: OptimizedImage = {
    original: inputPath,
    relativePath: relative(PUBLIC_DIR, inputPath),
    sizes: [],
    blurDataURL: '',
    originalSize,
    totalOptimizedSize: 0,
    compressionRatio: 0,
  };

  // Generate blur data URL
  try {
    optimized.blurDataURL = await generateBlurDataURL(inputPath);
    console.log(`  ✓ Blur placeholder: ${(optimized.blurDataURL.length / 1024).toFixed(2)}KB`);
  } catch (error) {
    console.error(`  ✗ Failed to generate blur data:`, error);
  }

  // Create optimized directory if it doesn't exist
  if (!existsSync(outputDir)) {
    await mkdir(outputDir, { recursive: true });
  }

  // Process each size
  for (const width of SIZES) {
    const outputFileName = `${nameWithoutExt}-${width}w.webp`;
    const outputPath = join(outputDir, outputFileName);
    const publicPath = `/${relative(PUBLIC_DIR, outputPath)}`;

    try {
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
        path: publicPath,
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

async function findImages(dir: string): Promise<string[]> {
  if (!existsSync(dir)) {
    return [];
  }

  const files = await readdir(dir);
  const images: string[] = [];

  for (const file of files) {
    const fullPath = join(dir, file);
    const stats = await stat(fullPath);

    if (stats.isFile() && /\.(png|jpg|jpeg)$/i.test(file) && !file.includes('optimized')) {
      images.push(fullPath);
    }
  }

  return images;
}

async function main() {
  console.log('🎨 Comprehensive Image Optimization Pipeline\n');
  console.log(`📂 Public directory: ${PUBLIC_DIR}\n`);
  console.log(`⚙️  Settings: Quality=${QUALITY}, Effort=${EFFORT}`);
  console.log(`⚙️  Sizes: ${SIZES.join('w, ')}w\n`);

  const allResults: OptimizedImage[] = [];

  // Optimize pets directory
  console.log('═'.repeat(60));
  console.log('📂 OPTIMIZING PETS DIRECTORY');
  console.log('═'.repeat(60));

  const petsDir = join(PUBLIC_DIR, 'pets');
  const petsImages = await findImages(petsDir);
  console.log(`\nFound ${petsImages.length} images in /pets\n`);

  for (const imagePath of petsImages) {
    const result = await optimizeImage(
      imagePath,
      OPTIMIZED_DIRS.pets,
      basename(imagePath)
    );
    allResults.push(result);
  }

  // Optimize refs directory
  console.log('\n' + '═'.repeat(60));
  console.log('📂 OPTIMIZING REFS DIRECTORY');
  console.log('═'.repeat(60));

  const refsDir = join(PUBLIC_DIR, 'refs');
  const refsImages = await findImages(refsDir);
  console.log(`\nFound ${refsImages.length} images in /refs\n`);

  for (const imagePath of refsImages) {
    const result = await optimizeImage(
      imagePath,
      OPTIMIZED_DIRS.refs,
      basename(imagePath)
    );
    allResults.push(result);
  }

  // Generate comprehensive manifest
  const manifest = {
    generatedAt: new Date().toISOString(),
    totalImages: allResults.length,
    totalOriginalSize: allResults.reduce((sum, r) => sum + r.originalSize, 0),
    totalOptimizedSize: allResults.reduce((sum, r) => sum + r.totalOptimizedSize, 0),
    images: allResults.map(r => ({
      original: r.relativePath,
      blurDataURL: r.blurDataURL,
      sizes: r.sizes,
      compressionRatio: r.compressionRatio,
    })),
  };

  await writeFile(
    join(PUBLIC_DIR, 'optimized-images-manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  // Generate blur data map
  const blurDataMap: Record<string, string> = {};
  allResults.forEach(r => {
    const publicPath = `/${r.relativePath}`;
    blurDataMap[publicPath] = r.blurDataURL;

    // Also add paths for optimized versions
    r.sizes.forEach(s => {
      blurDataMap[s.path] = r.blurDataURL;
    });
  });

  await writeFile(
    join(PUBLIC_DIR, 'blur-data-complete.json'),
    JSON.stringify(blurDataMap, null, 2)
  );

  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('📊 FINAL SUMMARY');
  console.log('═'.repeat(60) + '\n');
  console.log(`Images processed: ${allResults.length}`);
  console.log(`Original total: ${(manifest.totalOriginalSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Optimized total: ${(manifest.totalOptimizedSize / 1024).toFixed(1)}KB`);
  console.log(`Overall compression: ${(manifest.totalOriginalSize / manifest.totalOptimizedSize).toFixed(1)}x`);
  console.log(`Average per image: ${(manifest.totalOptimizedSize / allResults.length / 1024).toFixed(1)}KB`);
  console.log('\n✅ Optimization complete!');
  console.log(`✅ Manifest saved to: ${PUBLIC_DIR}/optimized-images-manifest.json`);
  console.log(`✅ Blur data saved to: ${PUBLIC_DIR}/blur-data-complete.json\n`);
}

main().catch(console.error);
