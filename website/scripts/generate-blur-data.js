const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const galleryDir = path.join(__dirname, '../public/gallery');
const outputPath = path.join(__dirname, '../blur-data.json');

async function generateBlurData() {
  console.log('Generating blur data URLs for gallery images...\n');

  const files = fs.readdirSync(galleryDir)
    .filter(f => f.match(/\.(png|jpg|jpeg|webp)$/i))
    .sort();

  const blurMap = {};

  for (const filename of files) {
    const filePath = path.join(galleryDir, filename);
    const publicPath = `/gallery/${filename}`;

    try {
      const buffer = await sharp(filePath)
        .resize(10) // 10px width, auto height
        .webp({ quality: 20 })
        .toBuffer();

      const base64 = buffer.toString('base64');
      const dataUrl = `data:image/webp;base64,${base64}`;

      blurMap[publicPath] = dataUrl;

      const sizeKB = (dataUrl.length / 1024).toFixed(2);
      console.log(`✓ ${filename.padEnd(50)} ${sizeKB} KB`);
    } catch (error) {
      console.error(`✗ Failed to process ${filename}:`, error);
    }
  }

  // Write to JSON file
  fs.writeFileSync(outputPath, JSON.stringify(blurMap, null, 2));

  console.log(`\n✓ Generated blur data for ${Object.keys(blurMap).length} images`);
  console.log(`✓ Output saved to: ${outputPath}`);
  console.log('\nNext steps:');
  console.log('1. Review blur-data.json');
  console.log('2. Update src/lib/data.ts ArtworkItem interface to include blurDataURL');
  console.log('3. Add blurDataURL field to each artwork in the array');
  console.log('4. Update Image components to use placeholder="blur" and blurDataURL prop');
}

generateBlurData().catch(console.error);
