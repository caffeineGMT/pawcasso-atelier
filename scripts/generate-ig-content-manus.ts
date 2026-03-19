#!/usr/bin/env tsx
/**
 * Automated Instagram Content Generator with Manus Integration
 *
 * Generates 7+ pieces of Instagram content per week:
 * - AI animal portraits (1:1 posts)
 * - Emoji/sticker sets (carousel posts)
 * - Zodiac animals (shareable astrology content)
 * - Reel concepts (video-ready images)
 *
 * NOW WITH AUTOMATIC IMAGE GENERATION via Manus API!
 */

import * as fs from 'fs';
import * as path from 'path';
import { randomBytes } from 'crypto';
import { ManusClient } from './lib/manus-client';
import {
  portraitPrompt,
  emojiPrompt,
  zodiacPrompt,
  reelPrompt,
  randomAnimal,
  randomArtStyle,
  randomZodiacSign,
  type AnimalType,
  type ArtStyle,
  type ZodiacSign,
} from './lib/ig-content-prompts';

// ============================================================================
// CONFIGURATION
// ============================================================================

const OUTPUT_DIR = path.join(__dirname, '../website/public/ig-queue');
const GALLERY_DIR = path.join(__dirname, '../website/public/gallery');
const METADATA_DIR = path.join(GALLERY_DIR, 'metadata');

// Ensure directories exist
[OUTPUT_DIR, GALLERY_DIR, METADATA_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// ============================================================================
// TYPES
// ============================================================================

type ContentType = 'portrait' | 'emoji_set' | 'zodiac' | 'reel_concept' | 'carousel';

interface GeneratedContent {
  id: string;
  date: string;
  contentType: ContentType;
  title: string;
  animal: AnimalType;
  breed?: string;
  style: ArtStyle;
  concept: string;
  prompt: string;
  imageUrls: string[];
  localImagePaths: string[];
  captions: Caption[];
  hashtags: string[];
  bestPostingTime: PostingTime;
  manusTaskIds: string[];
}

interface Caption {
  tone: 'witty' | 'heartfelt' | 'minimal' | 'bold';
  toneName: string;
  toneEmoji: string;
  text: string;
  hook: string;
}

interface PostingTime {
  time: string;
  timezone: string;
  reasoning: string;
}

// ============================================================================
// CONTENT GENERATORS
// ============================================================================

/**
 * Generate single portrait
 */
async function generatePortrait(manus: ManusClient): Promise<GeneratedContent> {
  const animal = randomAnimal();
  const breed = getRandomBreed(animal);
  const style = randomArtStyle();
  const concept = getRandomPortraitConcept();
  const prompt = portraitPrompt(animal, breed, style, concept);

  console.log(`\n🎨 Generating portrait: ${breed} ${animal} in ${style} style`);
  console.log(`   Concept: ${concept}`);

  const imageUrl = await manus.generate({ prompt }, {
    onProgress: (status, attempt) => {
      console.log(`   Poll ${attempt}: ${status.status}`);
    },
  });

  const id = randomBytes(4).toString('hex');
  const localPath = await downloadAndSave(imageUrl, `portrait-${id}.jpg`);

  return {
    id,
    date: new Date().toISOString().split('T')[0],
    contentType: 'portrait',
    title: `${breed} ${animal} - ${style}`,
    animal,
    breed,
    style,
    concept,
    prompt,
    imageUrls: [imageUrl],
    localImagePaths: [localPath],
    manusTaskIds: [],
    captions: generateCaptions('portrait', animal, breed, style),
    hashtags: generateHashtags('portrait', animal),
    bestPostingTime: getPostingTime('portrait'),
  };
}

/**
 * Generate emoji/sticker set (4-6 emotions)
 */
async function generateEmojiSet(manus: ManusClient): Promise<GeneratedContent> {
  const animal = randomAnimal();
  const moods = ['happy', 'sad', 'excited', 'sleepy', 'love', 'silly'];
  const selectedMoods = moods.slice(0, 4); // 4 stickers per set

  console.log(`\n😊 Generating emoji set: ${animal} (${selectedMoods.length} stickers)`);

  const prompts = selectedMoods.map((mood, i) => ({
    prompt: emojiPrompt(animal, mood, i),
  }));

  const imageUrls = await manus.generateBatch(prompts, {
    onProgress: (index, status, attempt) => {
      console.log(`   Sticker ${index + 1}/${selectedMoods.length} (${selectedMoods[index]}): ${status.status}`);
    },
  });

  const id = randomBytes(4).toString('hex');
  const localPaths = await Promise.all(
    imageUrls.map((url, i) => downloadAndSave(url, `emoji-${id}-${i + 1}.png`))
  );

  return {
    id,
    date: new Date().toISOString().split('T')[0],
    contentType: 'emoji_set',
    title: `${capitalizeFirst(animal)} Emoji Set`,
    animal,
    style: 'kawaii sticker' as ArtStyle,
    concept: `${selectedMoods.join(', ')} emotions`,
    prompt: `${animal} emoji set: ${selectedMoods.join(', ')}`,
    imageUrls,
    localImagePaths: localPaths,
    manusTaskIds: [],
    captions: generateCaptions('emoji_set', animal, undefined, 'sticker'),
    hashtags: generateHashtags('emoji_set', animal),
    bestPostingTime: getPostingTime('emoji_set'),
  };
}

/**
 * Generate zodiac animal
 */
async function generateZodiac(manus: ManusClient): Promise<GeneratedContent> {
  const animal = randomAnimal();
  const sign = randomZodiacSign();
  const prompt = zodiacPrompt(sign, animal);

  console.log(`\n♈ Generating zodiac: ${animal} as ${sign.toUpperCase()}`);

  const imageUrl = await manus.generate({ prompt }, {
    onProgress: (status, attempt) => {
      console.log(`   Poll ${attempt}: ${status.status}`);
    },
  });

  const id = randomBytes(4).toString('hex');
  const localPath = await downloadAndSave(imageUrl, `zodiac-${sign}-${id}.jpg`);

  return {
    id,
    date: new Date().toISOString().split('T')[0],
    contentType: 'zodiac',
    title: `${capitalizeFirst(sign)} ${capitalizeFirst(animal)}`,
    animal,
    style: 'astrological art' as ArtStyle,
    concept: `${sign} zodiac sign embodied`,
    prompt,
    imageUrls: [imageUrl],
    localImagePaths: [localPath],
    manusTaskIds: [],
    captions: generateCaptions('zodiac', animal, sign),
    hashtags: generateHashtags('zodiac', animal, sign),
    bestPostingTime: getPostingTime('zodiac'),
  };
}

/**
 * Generate Reel concept
 */
async function generateReelConcept(manus: ManusClient): Promise<GeneratedContent> {
  const animal = randomAnimal();
  const concept = getRandomReelConcept();
  const prompt = reelPrompt(animal, concept);

  console.log(`\n🎬 Generating Reel: ${animal} - ${concept}`);

  const imageUrl = await manus.generate({
    prompt,
    aspect_ratio: '9:16', // Vertical for Reels
  }, {
    onProgress: (status, attempt) => {
      console.log(`   Poll ${attempt}: ${status.status}`);
    },
  });

  const id = randomBytes(4).toString('hex');
  const localPath = await downloadAndSave(imageUrl, `reel-${id}.jpg`);

  return {
    id,
    date: new Date().toISOString().split('T')[0],
    contentType: 'reel_concept',
    title: `Reel: ${capitalizeFirst(animal)} - ${concept}`,
    animal,
    style: 'cinematic' as ArtStyle,
    concept,
    prompt,
    imageUrls: [imageUrl],
    localImagePaths: [localPath],
    manusTaskIds: [],
    captions: generateCaptions('reel_concept', animal, undefined, concept),
    hashtags: generateHashtags('reel_concept', animal),
    bestPostingTime: getPostingTime('reel_concept'),
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function downloadAndSave(url: string, filename: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download: ${response.statusText}`);
  }

  const buffer = await response.arrayBuffer();
  const outputPath = path.join(GALLERY_DIR, filename);
  fs.writeFileSync(outputPath, Buffer.from(buffer));

  console.log(`   ✓ Saved: ${filename}`);
  return outputPath;
}

function getRandomBreed(animal: AnimalType): string {
  const breeds: Record<AnimalType, string[]> = {
    dog: ['Golden Retriever', 'Border Collie', 'Husky', 'Corgi', 'Shiba Inu', 'Poodle'],
    cat: ['Maine Coon', 'Persian', 'Siamese', 'Ragdoll', 'British Shorthair', 'Sphynx'],
    duck: ['Mallard', 'Pekin', 'Wood Duck', 'Mandarin Duck'],
    rabbit: ['Holland Lop', 'Flemish Giant', 'Lionhead', 'Mini Rex'],
    fox: ['Red Fox', 'Arctic Fox', 'Fennec Fox'],
    owl: ['Barn Owl', 'Great Horned Owl', 'Snowy Owl'],
    bear: ['Brown Bear', 'Polar Bear', 'Panda Bear'],
    panda: ['Giant Panda', 'Red Panda'],
    koala: ['Koala'],
    lion: ['African Lion', 'Asiatic Lion'],
    tiger: ['Bengal Tiger', 'Siberian Tiger'],
    elephant: ['African Elephant', 'Asian Elephant'],
    giraffe: ['Reticulated Giraffe', 'Masai Giraffe'],
  };

  const options = breeds[animal] || [capitalizeFirst(animal)];
  return options[Math.floor(Math.random() * options.length)];
}

function getRandomPortraitConcept(): string {
  const concepts = [
    'wearing a crown like royalty',
    'surrounded by flowers',
    'in a magical forest',
    'as a superhero',
    'wearing vintage clothing',
    'in space with stars',
    'as a renaissance painting',
    'in cyberpunk city',
    'beach vacation vibes',
    'cozy winter scene',
  ];
  return concepts[Math.floor(Math.random() * concepts.length)];
}

function getRandomReelConcept(): string {
  const concepts = [
    'transforming through different art styles',
    'dancing to music',
    'on an adventure',
    'magical transformation sequence',
    'before and after glow-up',
  ];
  return concepts[Math.floor(Math.random() * concepts.length)];
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateCaptions(
  type: ContentType,
  animal: AnimalType,
  breed?: string | ZodiacSign,
  style?: string
): Caption[] {
  const subject = breed ? `${breed} ${animal}` : animal;

  const templates: Record<ContentType, Caption[]> = {
    portrait: [
      {
        tone: 'witty',
        toneName: 'Witty & Playful',
        toneEmoji: '😄',
        text: `POV: You're a ${subject} living your best ${style} life ✨\n\nWho else needs a portrait like this? 🎨`,
        hook: 'POV:',
      },
      {
        tone: 'heartfelt',
        toneName: 'Heartfelt & Warm',
        toneEmoji: '💛',
        text: `Every ${animal} deserves to be immortalized as art. This ${subject} is giving main character energy 🌟\n\nTag someone whose pet needs this treatment!`,
        hook: 'Every pet deserves',
      },
      {
        tone: 'minimal',
        toneName: 'Minimalist & Cool',
        toneEmoji: '✨',
        text: `${capitalizeFirst(subject)}.\n${capitalizeFirst(style || 'art')} style.\nPure magic.`,
        hook: 'Pure magic.',
      },
      {
        tone: 'bold',
        toneName: 'Bold & Dramatic',
        toneEmoji: '🔥',
        text: `THIS ${subject.toUpperCase()} IS SERVING LOOKS 👑\n\nIF YOUR PET ISN'T WALL ART YET, WHAT ARE YOU WAITING FOR? 🎨✨`,
        hook: 'SERVING LOOKS',
      },
    ],
    emoji_set: [
      {
        tone: 'witty',
        toneName: 'Witty & Playful',
        toneEmoji: '😄',
        text: `New ${animal} sticker pack just dropped! Which mood are you today? 😊\n\nSave this post and send these to your friends! 🎨`,
        hook: 'Which mood?',
      },
      {
        tone: 'heartfelt',
        toneName: 'Heartfelt & Warm',
        toneEmoji: '💛',
        text: `Because every ${animal} lover needs these in their life 🥹\n\nSwipe to see all the moods! Which one is your vibe?`,
        hook: 'Every mood',
      },
      {
        tone: 'minimal',
        toneName: 'Minimalist & Cool',
        toneEmoji: '✨',
        text: `${capitalizeFirst(animal)} energy.\nAll moods.\nYours to share.`,
        hook: 'All moods.',
      },
      {
        tone: 'bold',
        toneName: 'Bold & Dramatic',
        toneEmoji: '🔥',
        text: `SWIPE FOR THE CUTEST ${animal.toUpperCase()} STICKERS YOU'LL SEE TODAY 😍\n\nSAVE & SHARE WITH YOUR SQUAD! 🎨`,
        hook: 'CUTEST STICKERS',
      },
    ],
    zodiac: [
      {
        tone: 'witty',
        toneName: 'Witty & Playful',
        toneEmoji: '😄',
        text: `${capitalizeFirst(breed as string)} szn ♈✨\n\nTag a ${breed} who acts EXACTLY like a ${animal}! (We all know one 😂)`,
        hook: 'Zodiac szn',
      },
      {
        tone: 'heartfelt',
        toneName: 'Heartfelt & Warm',
        toneEmoji: '💛',
        text: `If ${breed} was a ${animal}... this would be it 🌙✨\n\nWhich zodiac ${animal} should I create next? Drop your sign below! ⬇️`,
        hook: 'Zodiac energy',
      },
      {
        tone: 'minimal',
        toneName: 'Minimalist & Cool',
        toneEmoji: '✨',
        text: `${capitalizeFirst(breed as string)}.\n${capitalizeFirst(animal)}.\nPerfect match.`,
        hook: 'Perfect match.',
      },
      {
        tone: 'bold',
        toneName: 'Bold & Dramatic',
        toneEmoji: '🔥',
        text: `${(breed as string).toUpperCase()} ENERGY AS A ${animal.toUpperCase()} 🔮✨\n\nIF THIS ISN'T YOU, YOU'RE LYING 😤`,
        hook: 'ZODIAC ENERGY',
      },
    ],
    reel_concept: [
      {
        tone: 'witty',
        toneName: 'Witty & Playful',
        toneEmoji: '😄',
        text: `This ${animal} said "I'm main character energy only" 💅\n\nDouble tap if you relate! 🎬`,
        hook: 'Main character',
      },
      {
        tone: 'heartfelt',
        toneName: 'Heartfelt & Warm',
        toneEmoji: '💛',
        text: `Watch this ${animal} ${style} ✨\n\nPure cinematic magic! Should I make more like this?`,
        hook: 'Pure magic',
      },
      {
        tone: 'minimal',
        toneName: 'Minimalist & Cool',
        toneEmoji: '✨',
        text: `${capitalizeFirst(animal)}.\nCinema.\nVibes.`,
        hook: 'Cinema.',
      },
      {
        tone: 'bold',
        toneName: 'Bold & Dramatic',
        toneEmoji: '🔥',
        text: `THIS ${animal.toUpperCase()} IS GIVING OSCAR-WORTHY PERFORMANCE 🎬✨\n\nSAVE THIS BEFORE IT GOES VIRAL! 🔥`,
        hook: 'OSCAR-WORTHY',
      },
    ],
    carousel: [],
  };

  return templates[type] || templates.portrait;
}

function generateHashtags(type: ContentType, animal: AnimalType, zodiac?: ZodiacSign): string[] {
  const base = [
    '#pawcasso',
    '#pawcassoatelier',
    '#aiart',
    '#petportrait',
    '#artisticpets',
  ];

  const animalTags = [`#${animal}sofinstagram`, `#${animal}art`, `#${animal}love`];

  const typeTags: Record<ContentType, string[]> = {
    portrait: ['#petportraits', '#customart', '#digitalart', '#artcommission'],
    emoji_set: ['#stickers', '#emojis', '#cuteart', '#kawaii'],
    zodiac: ['#zodiac', '#astrology', `#${zodiac}`, '#zodiacsigns'],
    reel_concept: ['#reels', '#trending', '#viral', '#cinematic'],
    carousel: ['#carousel', '#swipe', '#gallery'],
  };

  return [...base, ...animalTags, ...typeTags[type]];
}

function getPostingTime(type: ContentType): PostingTime {
  const times: Record<ContentType, PostingTime> = {
    portrait: {
      time: '9:00 AM',
      timezone: 'PT',
      reasoning: 'Morning coffee scroll — users engage with beautiful imagery',
    },
    emoji_set: {
      time: '12:30 PM',
      timezone: 'PT',
      reasoning: 'Lunch break — shareable content performs best',
    },
    zodiac: {
      time: '7:00 PM',
      timezone: 'PT',
      reasoning: 'Evening — astrology content peaks when users relax',
    },
    reel_concept: {
      time: '8:00 PM',
      timezone: 'PT',
      reasoning: 'Prime time video consumption window',
    },
    carousel: {
      time: '10:00 AM',
      timezone: 'PT',
      reasoning: 'Mid-morning engagement for multi-image content',
    },
  };

  return times[type];
}

// ============================================================================
// CONTENT STRATEGY (day-based rotation)
// ============================================================================

function selectContentType(): ContentType {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
  const dateNum = today.getDate();

  // Weekly rotation
  const weeklyStrategy: Record<number, ContentType> = {
    0: 'reel_concept',  // Sunday - video content
    1: 'portrait',      // Monday - strong start
    2: dateNum % 2 === 0 ? 'emoji_set' : 'portrait',  // Tuesday - mixed
    3: 'emoji_set',     // Wednesday - shareable
    4: dateNum % 2 === 0 ? 'zodiac' : 'portrait',     // Thursday - mixed
    5: 'zodiac',        // Friday - weekend astrology
    6: 'reel_concept',  // Saturday - video content
  };

  return weeklyStrategy[dayOfWeek];
}

// ============================================================================
// METADATA GENERATION
// ============================================================================

function saveMetadata(content: GeneratedContent) {
  const metadata = {
    title: content.title,
    animal: content.animal,
    style: content.style,
    breed: content.breed,
    provenance: {
      prompt: content.prompt,
      manus_task_ids: content.manusTaskIds,
      generated_at: new Date().toISOString(),
      content_type: content.contentType,
    },
    captions: content.captions,
    hashtags: content.hashtags,
    status: 'pending_review',
    posted: false,
  };

  // Save metadata for each image
  content.localImagePaths.forEach((imagePath, i) => {
    const filename = path.basename(imagePath, path.extname(imagePath));
    const metadataPath = path.join(METADATA_DIR, `${filename}.json`);
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`   ✓ Metadata saved: ${filename}.json`);
  });
}

// ============================================================================
// REVIEW PAGE GENERATION
// ============================================================================

function generateReviewPage(content: GeneratedContent) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.title} - Review</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .header {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      padding: 24px;
      text-align: center;
    }
    .header h1 { font-size: 24px; margin-bottom: 8px; }
    .header p { opacity: 0.9; font-size: 14px; }
    .images {
      display: grid;
      grid-template-columns: ${content.imageUrls.length > 1 ? 'repeat(2, 1fr)' : '1fr'};
      gap: 0;
    }
    .images img {
      width: 100%;
      height: auto;
      display: block;
    }
    .captions {
      padding: 24px;
    }
    .caption-option {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 16px;
      border-left: 4px solid #667eea;
    }
    .caption-option h3 {
      font-size: 14px;
      color: #667eea;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .caption-option p {
      font-size: 15px;
      line-height: 1.6;
      color: #333;
      white-space: pre-wrap;
    }
    .hashtags {
      padding: 0 24px 24px;
    }
    .hashtags h3 {
      font-size: 16px;
      margin-bottom: 12px;
      color: #333;
    }
    .hashtags p {
      font-size: 13px;
      color: #667eea;
      line-height: 1.8;
    }
    .posting-time {
      background: #e3f2fd;
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
    }
    .posting-time strong { color: #1976d2; }
    .actions {
      padding: 24px;
      display: flex;
      gap: 12px;
    }
    .btn {
      flex: 1;
      padding: 16px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
      display: block;
    }
    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .btn-secondary {
      background: #f5f5f5;
      color: #333;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${content.title}</h1>
      <p>${content.contentType.replace('_', ' ').toUpperCase()} • ${content.date}</p>
    </div>

    <div class="images">
      ${content.imageUrls.map(url => `<img src="${url}" alt="${content.title}" />`).join('')}
    </div>

    <div class="captions">
      <h2 style="margin-bottom: 16px; font-size: 18px;">📝 Caption Options</h2>
      ${content.captions.map(cap => `
        <div class="caption-option">
          <h3>${cap.toneEmoji} ${cap.toneName}</h3>
          <p>${cap.text}</p>
        </div>
      `).join('')}
    </div>

    <div class="hashtags">
      <h3>🏷️ Hashtags</h3>
      <p>${content.hashtags.join(' ')}</p>
    </div>

    <div class="posting-time">
      <strong>⏰ Best Time to Post:</strong> ${content.bestPostingTime.time} ${content.bestPostingTime.timezone}<br>
      <small style="color: #666;">${content.bestPostingTime.reasoning}</small>
    </div>

    <div class="actions">
      <a href="/gallery" class="btn btn-secondary">View Gallery</a>
      <a href="/" class="btn btn-primary">Approve & Post</a>
    </div>
  </div>
</body>
</html>`;

  const htmlPath = path.join(OUTPUT_DIR, `${content.date}-${content.id}.html`);
  fs.writeFileSync(htmlPath, html);
  console.log(`   ✓ Review page: ${content.date}-${content.id}.html`);

  return htmlPath;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  console.log('\n🎨 PAWCASSO DAILY INSTAGRAM CONTENT GENERATOR\n');
  console.log('═'.repeat(60));

  // Initialize Manus client
  const manus = new ManusClient();

  // Select content type based on day
  const contentType = selectContentType();
  console.log(`\n📅 Today's content type: ${contentType.toUpperCase()}\n`);

  let content: GeneratedContent;

  try {
    // Generate content based on type
    switch (contentType) {
      case 'portrait':
        content = await generatePortrait(manus);
        break;
      case 'emoji_set':
        content = await generateEmojiSet(manus);
        break;
      case 'zodiac':
        content = await generateZodiac(manus);
        break;
      case 'reel_concept':
        content = await generateReelConcept(manus);
        break;
      default:
        throw new Error(`Unknown content type: ${contentType}`);
    }

    // Save metadata
    console.log('\n💾 Saving metadata...');
    saveMetadata(content);

    // Generate review page
    console.log('\n📄 Generating review page...');
    const reviewPath = generateReviewPage(content);

    // Save content spec as JSON
    const jsonPath = path.join(OUTPUT_DIR, `${content.date}-${content.id}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(content, null, 2));

    console.log('\n' + '═'.repeat(60));
    console.log('\n✅ CONTENT GENERATED SUCCESSFULLY!\n');
    console.log(`📁 Gallery images: ${content.localImagePaths.length}`);
    console.log(`📄 Review page: https://pawcasso-atelier.vercel.app/ig-queue/${path.basename(reviewPath)}`);
    console.log(`🔗 Direct link: ${reviewPath}\n`);
    console.log('Next step: Review the content and post to Instagram!');
    console.log('\n' + '═'.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ ERROR:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}
