/**
 * Pinterest Pin Generator
 *
 * Creates Pinterest-optimized pins with text overlays for all gallery images.
 * Generates multiple variations for A/B testing.
 *
 * Usage: npm run generate-pins
 */

import sharp from "sharp";
import fs from "fs";
import path from "path";
import { artworks } from "../website/src/lib/data";

const GALLERY_DIR = path.join(process.cwd(), "website", "public", "gallery");
const OUTPUT_DIR = path.join(process.cwd(), "website", "public", "pinterest-pins");

// Pinterest recommended sizes
const PIN_SIZES = {
  standard: { width: 1000, height: 1500 }, // 2:3 ratio (recommended)
  square: { width: 1000, height: 1000 }, // 1:1 ratio
  tall: { width: 1000, height: 2000 }, // 1:2 ratio (extra tall for more real estate)
};

// Brand colors from design system
const COLORS = {
  gold: "#C9A96E",
  goldLight: "#E8D5A8",
  black: "#000000",
  white: "#F5F5F7",
  blackTransparent: "rgba(0, 0, 0, 0.7)",
};

interface PinVariation {
  name: string;
  textConfig: {
    title: string;
    subtitle: string;
    price?: string;
    cta?: string;
  };
}

// Generate text overlay SVG
function generateTextOverlay(
  width: number,
  height: number,
  config: PinVariation["textConfig"]
): string {
  const padding = 40;
  const bottomPadding = 60;

  return `
    <svg width="${width}" height="${height}">
      <!-- Bottom dark gradient overlay -->
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:rgba(0,0,0,0);stop-opacity:0" />
          <stop offset="70%" style="stop-color:rgba(0,0,0,0.5);stop-opacity:0.5" />
          <stop offset="100%" style="stop-color:rgba(0,0,0,0.85);stop-opacity:0.85" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad)"/>

      <!-- Text content at bottom -->
      <text
        x="${padding}"
        y="${height - bottomPadding - 120}"
        font-family="Inter, -apple-system, sans-serif"
        font-size="48"
        font-weight="700"
        fill="${COLORS.white}"
        letter-spacing="-0.02em"
      >
        ${escapeXml(config.title)}
      </text>

      <text
        x="${padding}"
        y="${height - bottomPadding - 70}"
        font-family="Inter, -apple-system, sans-serif"
        font-size="32"
        font-weight="400"
        fill="${COLORS.goldLight}"
      >
        ${escapeXml(config.subtitle)}
      </text>

      ${
        config.price
          ? `
      <text
        x="${padding}"
        y="${height - bottomPadding - 20}"
        font-family="Inter, -apple-system, sans-serif"
        font-size="36"
        font-weight="600"
        fill="${COLORS.gold}"
      >
        ${escapeXml(config.price)}
      </text>
      `
          : ""
      }

      ${
        config.cta
          ? `
      <!-- CTA badge -->
      <rect
        x="${padding}"
        y="${height - bottomPadding + 20}"
        width="${config.cta.length * 14 + 40}"
        height="44"
        rx="22"
        fill="${COLORS.gold}"
      />
      <text
        x="${padding + 20}"
        y="${height - bottomPadding + 48}"
        font-family="Inter, -apple-system, sans-serif"
        font-size="18"
        font-weight="600"
        fill="${COLORS.black}"
        letter-spacing="0.02em"
      >
        ${escapeXml(config.cta)}
      </text>
      `
          : ""
      }

      <!-- Website URL at very bottom -->
      <text
        x="${width / 2}"
        y="${height - 20}"
        font-family="Inter, -apple-system, sans-serif"
        font-size="16"
        font-weight="500"
        fill="${COLORS.white}"
        text-anchor="middle"
        letter-spacing="0.05em"
      >
        pawcasso-atelier.vercel.app
      </text>
    </svg>
  `;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

// Generate pin variations for an artwork
function getPinVariations(artwork: {
  title: string;
  animal: string;
  style: string;
}): PinVariation[] {
  return [
    {
      name: "product-cta",
      textConfig: {
        title: `Custom ${artwork.animal} Portrait`,
        subtitle: `${artwork.style} Style`,
        price: "$9 • 24hr Delivery",
        cta: "Order Now",
      },
    },
    {
      name: "minimal",
      textConfig: {
        title: artwork.title,
        subtitle: `${artwork.style} Pet Portrait`,
        price: "$9",
      },
    },
    {
      name: "style-focus",
      textConfig: {
        title: `${artwork.style} Pet Art`,
        subtitle: `Custom AI Portrait`,
        price: "From $9",
      },
    },
    {
      name: "animal-focus",
      textConfig: {
        title: `${artwork.animal} Lovers`,
        subtitle: `Custom ${artwork.style} Portrait`,
        price: "$9 • Fast Delivery",
      },
    },
    {
      name: "gift-angle",
      textConfig: {
        title: `Perfect Pet Gift`,
        subtitle: `${artwork.style} Custom Portrait`,
        price: "$9",
        cta: "Shop Gift",
      },
    },
  ];
}

async function generatePins() {
  console.log("🎨 Generating Pinterest pins...\n");

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let totalPinsGenerated = 0;

  for (const artwork of artworks) {
    // Determine source image path
    const sourceImagePath = path.join(GALLERY_DIR, path.basename(artwork.imageUrl));

    if (!fs.existsSync(sourceImagePath)) {
      console.warn(`⚠️  Source image not found: ${sourceImagePath}`);
      continue;
    }

    console.log(`Processing: ${artwork.title} (${artwork.style})`);

    const variations = getPinVariations(artwork);

    for (const variation of variations) {
      for (const [sizeName, size] of Object.entries(PIN_SIZES)) {
        try {
          // Load and resize base image
          const image = sharp(sourceImagePath);
          const metadata = await image.metadata();

          // Calculate crop dimensions to maintain aspect ratio
          const targetRatio = size.width / size.height;
          const sourceRatio = (metadata.width || 1) / (metadata.height || 1);

          let cropWidth = metadata.width || size.width;
          let cropHeight = metadata.height || size.height;

          if (sourceRatio > targetRatio) {
            // Image is wider than target, crop width
            cropWidth = Math.round((metadata.height || size.height) * targetRatio);
          } else {
            // Image is taller than target, crop height
            cropHeight = Math.round((metadata.width || size.width) / targetRatio);
          }

          // Create base image (cropped and resized)
          const baseImage = await sharp(sourceImagePath)
            .extract({
              left: Math.round(((metadata.width || size.width) - cropWidth) / 2),
              top: Math.round(((metadata.height || size.height) - cropHeight) / 2),
              width: cropWidth,
              height: cropHeight,
            })
            .resize(size.width, size.height, {
              fit: "cover",
              position: "center",
            })
            .toBuffer();

          // Generate text overlay
          const textOverlay = Buffer.from(generateTextOverlay(size.width, size.height, variation.textConfig));

          // Composite text overlay onto image
          const outputFileName = `${artwork.id}_${variation.name}_${sizeName}.png`;
          const outputPath = path.join(OUTPUT_DIR, outputFileName);

          await sharp(baseImage)
            .composite([
              {
                input: textOverlay,
                top: 0,
                left: 0,
              },
            ])
            .png({ quality: 90 })
            .toFile(outputPath);

          totalPinsGenerated++;
        } catch (error) {
          console.error(`  ❌ Failed to generate ${variation.name} (${sizeName}):`, error);
        }
      }
    }

    console.log(`  ✅ Generated ${variations.length * Object.keys(PIN_SIZES).length} pin variations\n`);
  }

  console.log(`\n🎉 Done! Generated ${totalPinsGenerated} Pinterest pins in ${OUTPUT_DIR}\n`);

  // Generate CSV for bulk upload to Pinterest
  await generatePinCSV();
}

// Generate CSV file with pin metadata for bulk upload
async function generatePinCSV() {
  const csvPath = path.join(OUTPUT_DIR, "pinterest_bulk_upload.csv");
  const pins: string[] = [];

  pins.push("title,description,link,image_url,board,keywords");

  for (const artwork of artworks) {
    const variations = getPinVariations(artwork);

    for (const variation of variations) {
      for (const sizeName of Object.keys(PIN_SIZES)) {
        const imageFileName = `${artwork.id}_${variation.name}_${sizeName}.png`;
        const imageUrl = `https://pawcasso-atelier.vercel.app/pinterest-pins/${imageFileName}`;

        const title = `${variation.textConfig.title} — ${variation.textConfig.subtitle}`;
        const description = `Transform your ${artwork.animal.toLowerCase()} into a stunning ${artwork.style} portrait. Custom AI-generated artwork delivered in 24 hours for just $9. Choose from 16+ artistic styles including Renaissance, Baroque, Impressionist, Ghibli, Pixar 3D, and Needle Felt. High-resolution digital download ready to print. Perfect gift for pet lovers. Click to create your custom pet portrait now! #custompetportrait #${artwork.animal.toLowerCase().replace(/\s+/g, "")}portrait #${artwork.style.toLowerCase().replace(/\s+/g, "")}art`;

        const board = determineBoardName(artwork);
        const keywords = generateKeywords(artwork);

        pins.push(
          `"${title}","${description}","https://pawcasso-atelier.vercel.app/order?utm_source=pinterest&utm_medium=pin&utm_campaign=${artwork.style.toLowerCase().replace(/\s+/g, "-")}","${imageUrl}","${board}","${keywords}"`
        );
      }
    }
  }

  fs.writeFileSync(csvPath, pins.join("\n"));
  console.log(`📊 Generated CSV for bulk upload: ${csvPath}\n`);
}

function determineBoardName(artwork: { animal: string; style: string }): string {
  const animal = artwork.animal.toLowerCase();
  const style = artwork.style.toLowerCase();

  // Map to specific boards based on content
  if (animal.includes("dog") || animal.includes("collie") || animal.includes("retriever") || animal.includes("chihuahua") || animal.includes("pomeranian") || animal.includes("shiba")) {
    if (animal.includes("border collie")) return "Border Collie Art";
    if (animal.includes("shiba")) return "Shiba Inu Artwork";
    return "Dog Portrait Ideas";
  }

  if (animal.includes("cat")) {
    return "Cat Portrait Art";
  }

  if (style.includes("pixar") || style.includes("3d")) {
    return "Pixar-Style Pet Art";
  }

  if (style.includes("needle felt") || style.includes("felt")) {
    return "Needle Felt Pet Portraits";
  }

  return "AI Pet Portraits ($9 — Official Products)";
}

function generateKeywords(artwork: { animal: string; style: string }): string {
  const keywords = [
    "custom pet portrait",
    "ai pet art",
    `${artwork.animal.toLowerCase()} portrait`,
    `${artwork.style.toLowerCase()} pet art`,
    "affordable pet portrait",
    "custom dog art",
    "pet gift ideas",
    "digital pet portrait",
  ];

  return keywords.join(", ");
}

// Run the script
generatePins().catch((error) => {
  console.error("❌ Error generating pins:", error);
  process.exit(1);
});
