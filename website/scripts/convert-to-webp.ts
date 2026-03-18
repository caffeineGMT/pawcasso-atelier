import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

const GALLERY_DIR = path.join(__dirname, '../public/gallery');
const ORIGINALS_DIR = path.join(GALLERY_DIR, 'originals');

interface ConversionResult {
  filename: string;
  originalSize: number;
  webpSize: number;
  reduction: number;
}

async function convertToWebP(): Promise<void> {
  console.log('🎨 Starting PNG to WebP conversion...\n');

  // Create originals directory if it doesn't exist
  if (!fs.existsSync(ORIGINALS_DIR)) {
    fs.mkdirSync(ORIGINALS_DIR, { recursive: true });
    console.log(`✅ Created backup directory: ${ORIGINALS_DIR}\n`);
  }

  // Get all PNG files in the gallery directory (excluding subdirectories)
  const files = fs.readdirSync(GALLERY_DIR)
    .filter(file => file.endsWith('.png') && fs.statSync(path.join(GALLERY_DIR, file)).isFile());

  if (files.length === 0) {
    console.log('⚠️  No PNG files found in gallery directory.');
    return;
  }

  console.log(`Found ${files.length} PNG files to convert:\n`);

  const results: ConversionResult[] = [];
  let totalOriginalSize = 0;
  let totalWebPSize = 0;

  for (const filename of files) {
    const inputPath = path.join(GALLERY_DIR, filename);
    const outputFilename = filename.replace(/\.png$/i, '.webp');
    const outputPath = path.join(GALLERY_DIR, outputFilename);
    const backupPath = path.join(ORIGINALS_DIR, filename);

    try {
      // Get original file size
      const originalStats = fs.statSync(inputPath);
      const originalSize = originalStats.size;

      // Convert to WebP
      await sharp(inputPath)
        .webp({ quality: 82, effort: 6 })
        .toFile(outputPath);

      // Get WebP file size
      const webpStats = fs.statSync(outputPath);
      const webpSize = webpStats.size;

      // Move original to backup directory
      fs.renameSync(inputPath, backupPath);

      // Calculate reduction
      const reduction = ((originalSize - webpSize) / originalSize) * 100;

      results.push({
        filename,
        originalSize,
        webpSize,
        reduction
      });

      totalOriginalSize += originalSize;
      totalWebPSize += webpSize;

      console.log(`✓ ${filename}`);
      console.log(`  Original: ${formatBytes(originalSize)} → WebP: ${formatBytes(webpSize)}`);
      console.log(`  Reduction: ${reduction.toFixed(1)}%\n`);
    } catch (error) {
      console.error(`❌ Error converting ${filename}:`, error);
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 CONVERSION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total files converted: ${results.length}`);
  console.log(`Total original size: ${formatBytes(totalOriginalSize)}`);
  console.log(`Total WebP size: ${formatBytes(totalWebPSize)}`);
  console.log(`Total reduction: ${formatBytes(totalOriginalSize - totalWebPSize)} (${((totalOriginalSize - totalWebPSize) / totalOriginalSize * 100).toFixed(1)}%)`);
  console.log('='.repeat(60));
  console.log('\n✅ Conversion complete! Original PNGs backed up to:');
  console.log(`   ${ORIGINALS_DIR}`);
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Run the conversion
convertToWebP().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
