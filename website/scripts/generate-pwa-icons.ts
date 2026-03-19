import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join } from 'path';

const sizes = [
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
];

async function generateIcons() {
  const svgBuffer = readFileSync(join(process.cwd(), 'public', 'favicon.svg'));

  for (const { size, name } of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(join(process.cwd(), 'public', name));

    console.log(`✓ Generated ${name} (${size}x${size})`);
  }

  console.log('\n✓ All PWA icons generated successfully!');
}

generateIcons().catch(console.error);
