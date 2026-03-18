#!/usr/bin/env tsx

/**
 * Reddit Content Kit Generator
 *
 * Generates Reddit-ready post packages with:
 * - Gallery image selection
 * - Multiple caption variants for different subreddits
 * - UTM tracking links
 * - Posting guidelines
 */

import * as fs from "fs";
import * as path from "path";

interface GalleryImage {
  filename: string;
  title: string;
  animal: string;
  style: string;
}

interface CaptionVariant {
  subreddit: string;
  tone: string;
  caption: string;
  suggested_title?: string;
}

interface RedditContentKit {
  image: GalleryImage;
  captions: CaptionVariant[];
  utm_link: string;
  posting_guidelines: string[];
}

// Parse gallery metadata
function getGalleryImages(): GalleryImage[] {
  const galleryDir = path.join(__dirname, "../website/public/gallery");
  const metadataDir = path.join(galleryDir, "metadata");

  if (!fs.existsSync(metadataDir)) {
    console.warn("No metadata directory found. Using basic file scan.");
    const files = fs.readdirSync(galleryDir).filter(f =>
      f.endsWith(".webp") || f.endsWith(".png") || f.endsWith(".jpg")
    );
    return files.map(f => ({
      filename: f,
      title: f.replace(/\.(webp|png|jpg)$/, "").replace(/_/g, " "),
      animal: "Unknown",
      style: "Unknown"
    }));
  }

  const metadataFiles = fs.readdirSync(metadataDir).filter(f => f.endsWith(".json"));
  return metadataFiles.map(f => {
    const metadata = JSON.parse(fs.readFileSync(path.join(metadataDir, f), "utf-8"));
    return {
      filename: f.replace(".json", ""),
      title: metadata.title,
      animal: metadata.animal,
      style: metadata.style
    };
  });
}

// Generate caption variants for different subreddits
function generateCaptions(image: GalleryImage): CaptionVariant[] {
  return [
    {
      subreddit: "r/somethingimade",
      tone: "maker/builder",
      caption: `I built an AI tool to turn pet photos into art portraits. Here's my ${image.animal.toLowerCase()} in ${image.style} style.

No commissions, no waiting weeks—just upload a photo and get gallery-quality art in 24 hours.

What do you think? Would love feedback on the quality.`,
      suggested_title: `I built an AI pet portrait generator - here's my ${image.animal.toLowerCase()} as ${image.style} art`
    },
    {
      subreddit: "r/aww",
      tone: "wholesome/casual",
      caption: `Meet ${image.title}! Turned my ${image.animal.toLowerCase()}'s photo into this ${image.style} portrait using an AI tool I've been working on.

Thought you all might appreciate this 🎨`,
      suggested_title: `My ${image.animal.toLowerCase()} as ${image.style} art ❤️`
    },
    {
      subreddit: "r/dogs or r/cats",
      tone: "community-first",
      caption: `I've been experimenting with AI art and turned my ${image.animal.toLowerCase()}'s photo into this ${image.style}-style portrait.

Sharing here because I think it turned out really cool! The AI captured their personality perfectly.`,
      suggested_title: `Turned my ${image.animal.toLowerCase()} into ${image.style} art`
    },
    {
      subreddit: "r/InternetIsBeautiful",
      tone: "product showcase",
      caption: `I built a web tool that transforms pet photos into artistic portraits in any style you want. Renaissance, Ghibli, Pixar 3D, etc.

Here's my ${image.animal.toLowerCase()} as ${image.style} art - took 2 minutes to generate.

Not trying to spam, just genuinely proud of how this turned out and wanted to share with people who appreciate cool web projects.`,
      suggested_title: `AI pet portrait generator I built - turns your pet into any art style in seconds`
    },
    {
      subreddit: "General Reply (Comments)",
      tone: "helpful/organic",
      caption: `Hey! I've been using a tool I built that does this automatically. Turns pet photos into portraits in different art styles. If you want, I can send you the link - no pressure though!

(This is what my ${image.animal.toLowerCase()} looks like in ${image.style} style)`,
    }
  ];
}

// Generate UTM tracking link
function generateUTMLink(subreddit: string = "reddit", campaign: string = "community"): string {
  const baseUrl = "https://pawcasso-atelier.vercel.app/reddit";
  const params = new URLSearchParams({
    utm_source: "reddit",
    utm_medium: "organic",
    utm_campaign: campaign,
    sub: subreddit.replace("r/", "")
  });
  return `${baseUrl}?${params.toString()}`;
}

// Generate posting guidelines
function getPostingGuidelines(): string[] {
  return [
    "✅ Week 1-2: ONLY comment and engage. Build karma. Be genuinely helpful.",
    "✅ Week 3+: Share in r/somethingimade as \"I built this\" (NOT a sales pitch)",
    "✅ NEVER directly sell or drop links unless someone asks",
    "✅ If someone asks where to get it, reply with: \"I set up a simple site for it - I can DM you if you're interested\" (wait for them to say yes)",
    "✅ Offer free portraits to top commenters who engage positively",
    "✅ Track which posts/comments drive traffic via UTM codes",
    "✅ Create r/pawcasso subreddit for user submissions once you have 50+ customers",
    "❌ NEVER spam multiple subs on the same day",
    "❌ NEVER use the same title/caption across multiple posts",
    "❌ NEVER argue with critics - acknowledge feedback and move on",
  ];
}

// Generate the content kit
function generateContentKit(imageIndex?: number): RedditContentKit {
  const images = getGalleryImages();

  if (images.length === 0) {
    throw new Error("No gallery images found!");
  }

  // Pick a random image or use specified index
  const selectedIndex = imageIndex !== undefined && imageIndex < images.length
    ? imageIndex
    : Math.floor(Math.random() * images.length);

  const image = images[selectedIndex];
  const captions = generateCaptions(image);
  const utm_link = generateUTMLink();

  return {
    image,
    captions,
    utm_link,
    posting_guidelines: getPostingGuidelines()
  };
}

// CLI Interface
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === "list") {
    console.log("\n📚 Available Gallery Images:\n");
    const images = getGalleryImages();
    images.forEach((img, idx) => {
      console.log(`[${idx}] ${img.title} (${img.animal}, ${img.style})`);
    });
    console.log(`\nTotal: ${images.length} images\n`);
    return;
  }

  if (command === "generate") {
    const imageIndex = args[1] ? parseInt(args[1], 10) : undefined;
    const kit = generateContentKit(imageIndex);

    console.log("\n🎨 REDDIT CONTENT KIT GENERATED\n");
    console.log("═".repeat(60));

    console.log("\n📸 SELECTED IMAGE:");
    console.log(`   File: ${kit.image.filename}`);
    console.log(`   Title: ${kit.image.title}`);
    console.log(`   Animal: ${kit.image.animal} | Style: ${kit.image.style}`);

    console.log("\n📝 CAPTION VARIANTS:\n");
    kit.captions.forEach((variant, idx) => {
      console.log(`[${idx + 1}] ${variant.subreddit} (${variant.tone})`);
      if (variant.suggested_title) {
        console.log(`    Title: "${variant.suggested_title}"`);
      }
      console.log(`    Caption:\n`);
      variant.caption.split("\n").forEach(line => {
        console.log(`    ${line}`);
      });
      console.log();
    });

    console.log("\n🔗 UTM TRACKING LINK:");
    console.log(`   ${kit.utm_link}\n`);

    console.log("\n📋 POSTING GUIDELINES:\n");
    kit.posting_guidelines.forEach(guideline => {
      console.log(`   ${guideline}`);
    });

    console.log("\n" + "═".repeat(60));
    console.log("\n✅ Content kit ready! Copy the caption that fits your target subreddit.\n");

    // Save to file for easy reference
    const outputPath = path.join(__dirname, `reddit-kit-${Date.now()}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(kit, null, 2));
    console.log(`💾 Saved to: ${outputPath}\n`);

    return;
  }

  // Default: show usage
  console.log(`
🎨 Reddit Content Kit Generator

USAGE:
  tsx reddit-content-kit.ts list              - List all available gallery images
  tsx reddit-content-kit.ts generate [index]  - Generate content kit for a specific image (or random if no index)

EXAMPLES:
  tsx reddit-content-kit.ts generate          - Generate kit with random image
  tsx reddit-content-kit.ts generate 5        - Generate kit with image #5
  tsx reddit-content-kit.ts list              - Show all available images

STRATEGY:
  Week 1-2: Engage authentically in target subs (r/aww, r/dogs, r/cats)
  Week 3:   Post "I built this" in r/somethingimade with gallery example
  Week 4+:  Offer free portraits to engaged commenters, track via UTM codes
  `);
}

main();
