#!/usr/bin/env tsx
/**
 * Pawcasso Daily Instagram Content Generator
 *
 * Generates viral-worthy Instagram content daily:
 * - AI animal portraits (single posts)
 * - Emoji/sticker sets for specific animals
 * - Zodiac animal figures
 * - Short animated Reels concepts
 *
 * Output: Mobile-friendly review page for @pawcasso.atelier
 * Posting schedule: Optimized by content type and day of week
 */

import * as fs from 'fs';
import * as path from 'path';
import { randomBytes } from 'crypto';

// ============================================================================
// TYPES
// ============================================================================

type ContentType = 'portrait' | 'emoji_set' | 'zodiac' | 'reel_concept' | 'carousel';
type CaptionTone = 'witty' | 'heartfelt' | 'minimal' | 'bold';

interface Caption {
  tone: CaptionTone;
  toneName: string;
  toneEmoji: string;
  text: string;
  hook: string;
}

interface ContentSpec {
  id: string;
  date: string;
  contentType: ContentType;
  title: string;
  description: string;
  animal: string;
  breed?: string;
  style: string;
  concept: string;
  specialInstructions: string;
  captions: Caption[];
  hashtags: string[];
  bestPostingTime: {
    time: string;
    timezone: string;
    reasoning: string;
  };
  n8nPayload: {
    'field-0': string;
    'field-1': string;
    'field-2': string;
    'field-3': string;
    'field-4': string;
    'field-5': string;
  };
  imageUrl?: string;
  reviewUrl: string;
  status: 'pending_generation' | 'pending_review' | 'approved' | 'posted';
  generatedAt: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const N8N_FORM_URL = 'https://n8n.aws.metafb.cloud/form/8ae3cd62-13ea-4c8a-9ffc-2c1148783ee2';
const OUTPUT_DIR = path.join(__dirname, '..', 'website', 'public', 'ig-queue');
const REVIEW_DIR = path.join(__dirname, '..', 'website', 'public', 'reviews');

// ============================================================================
// CONTENT TEMPLATES
// ============================================================================

const ANIMALS = [
  { animal: 'Dog', breeds: ['Border Collie', 'Golden Retriever', 'Shiba Inu', 'Pomeranian', 'French Bulldog', 'Corgi', 'Husky', 'Dachshund', 'Beagle'] },
  { animal: 'Cat', breeds: ['Maine Coon', 'Scottish Fold', 'Siamese', 'Persian', 'Ragdoll', 'British Shorthair', 'Sphynx'] },
  { animal: 'Rabbit', breeds: ['Lionhead', 'Holland Lop', 'Flemish Giant', 'Dutch'] },
  { animal: 'Bird', breeds: ['Cockatiel', 'Parakeet', 'Lovebird', 'Cockatoo'] },
  { animal: 'Hamster', breeds: ['Syrian', 'Dwarf'] },
];

const ART_STYLES = [
  'Pixar 3D',
  'Needle Felt',
  'Chinese Classical Ink Wash',
  'Renaissance Oil Painting',
  'Pixel Art',
  'Vinyl Toy Designer',
  'Studio Ghibli Watercolor',
  'Pop Art Andy Warhol',
  'Art Deco Poster',
  'Ukiyo-e Japanese Woodblock',
  'Stained Glass Window',
  'Mosaic Tile',
  'Neon Cyberpunk',
  'Baroque Dramatic',
  'Impressionist Claude Monet',
];

const ZODIAC_SIGNS = [
  { sign: 'Aries', emoji: '♈', dates: 'Mar 21 - Apr 19', traits: 'Bold, Adventurous' },
  { sign: 'Taurus', emoji: '♉', dates: 'Apr 20 - May 20', traits: 'Loyal, Stubborn' },
  { sign: 'Gemini', emoji: '♊', dates: 'May 21 - Jun 20', traits: 'Playful, Curious' },
  { sign: 'Cancer', emoji: '♋', dates: 'Jun 21 - Jul 22', traits: 'Nurturing, Emotional' },
  { sign: 'Leo', emoji: '♌', dates: 'Jul 23 - Aug 22', traits: 'Confident, Dramatic' },
  { sign: 'Virgo', emoji: '♍', dates: 'Aug 23 - Sep 22', traits: 'Precise, Loyal' },
  { sign: 'Libra', emoji: '♎', dates: 'Sep 23 - Oct 22', traits: 'Balanced, Social' },
  { sign: 'Scorpio', emoji: '♏', dates: 'Oct 23 - Nov 21', traits: 'Intense, Mysterious' },
  { sign: 'Sagittarius', emoji: '♐', dates: 'Nov 22 - Dec 21', traits: 'Free-spirited, Adventurous' },
  { sign: 'Capricorn', emoji: '♑', dates: 'Dec 22 - Jan 19', traits: 'Ambitious, Disciplined' },
  { sign: 'Aquarius', emoji: '♒', dates: 'Jan 20 - Feb 18', traits: 'Quirky, Independent' },
  { sign: 'Pisces', emoji: '♓', dates: 'Feb 19 - Mar 20', traits: 'Dreamy, Empathetic' },
];

// ============================================================================
// CONTENT GENERATORS
// ============================================================================

function generateId(): string {
  return randomBytes(4).toString('hex');
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getBestPostingTime(contentType: ContentType, dayOfWeek: number): { time: string; timezone: string; reasoning: string } {
  // Instagram optimal posting times (PT timezone)
  // Based on engagement data: weekday mornings, lunch, and evenings perform best
  const timeSlots = {
    portrait: {
      weekday: { time: '09:00 AM', reasoning: 'Weekday morning — commuters scrolling during coffee break' },
      weekend: { time: '11:00 AM', reasoning: 'Weekend late morning — relaxed browsing time' },
    },
    emoji_set: {
      weekday: { time: '12:30 PM', reasoning: 'Lunch break — high engagement for fun, shareable content' },
      weekend: { time: '02:00 PM', reasoning: 'Weekend afternoon — casual browsing peaks' },
    },
    zodiac: {
      weekday: { time: '07:00 PM', reasoning: 'Evening wind-down — astrology content performs well' },
      weekend: { time: '05:00 PM', reasoning: 'Weekend early evening — social media prime time' },
    },
    reel_concept: {
      weekday: { time: '08:00 PM', reasoning: 'Evening peak — Reels algorithm favors 8-10 PM' },
      weekend: { time: '07:30 PM', reasoning: 'Weekend evening — maximum engagement window' },
    },
    carousel: {
      weekday: { time: '10:00 AM', reasoning: 'Mid-morning — users have time to swipe through' },
      weekend: { time: '01:00 PM', reasoning: 'Weekend early afternoon — relaxed engagement' },
    },
  };

  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const slot = timeSlots[contentType][isWeekend ? 'weekend' : 'weekday'];

  return {
    time: slot.time,
    timezone: 'PT (Pacific Time)',
    reasoning: slot.reasoning,
  };
}

function generatePortrait(): ContentSpec {
  const animalGroup = randomChoice(ANIMALS);
  const breed = randomChoice(animalGroup.breeds);
  const style = randomChoice(ART_STYLES);
  const id = generateId();
  const date = new Date().toISOString().split('T')[0];
  const dayOfWeek = new Date().getDay();

  const concepts = [
    `${breed} as a noble aristocrat in ${style} style`,
    `Majestic ${breed} portrait channeling ${style} aesthetic`,
    `${breed} reimagined through ${style} lens — pure artistic magic`,
    `Stunning ${breed} in ${style} — viral-worthy masterpiece`,
  ];
  const concept = randomChoice(concepts);

  const captions = generateCaptions('portrait', breed, style);
  const hashtags = generateHashtags('portrait', animalGroup.animal, breed);
  const bestPostingTime = getBestPostingTime('portrait', dayOfWeek);

  return {
    id,
    date,
    contentType: 'portrait',
    title: `${style} ${breed} Portrait`,
    description: `Stunning single portrait: ${breed} in ${style}`,
    animal: animalGroup.animal,
    breed,
    style,
    concept,
    specialInstructions: `Create a high-quality, Instagram-ready portrait. 1080x1080 square format. Dramatic lighting, sharp details, viral aesthetic. Think "Explore page worthy."`,
    captions,
    hashtags,
    bestPostingTime,
    n8nPayload: {
      'field-0': animalGroup.animal,
      'field-1': breed,
      'field-2': style,
      'field-3': concept,
      'field-4': `Instagram post, 1080x1080 square. High quality, viral aesthetic, dramatic lighting.`,
      'field-5': `Portrait style. Optimize for IG Explore algorithm.`,
    },
    reviewUrl: `https://pawcasso-atelier.vercel.app/ig-queue/${date}-${id}.html`,
    status: 'pending_generation',
    generatedAt: new Date().toISOString(),
  };
}

function generateEmojiSet(): ContentSpec {
  const animalGroup = randomChoice(ANIMALS);
  const breed = randomChoice(animalGroup.breeds);
  const id = generateId();
  const date = new Date().toISOString().split('T')[0];
  const dayOfWeek = new Date().getDay();

  const emojiThemes = [
    { theme: 'mood pack', emojis: '😊 😴 🤪 😍 😤 🥺' },
    { theme: 'activity stickers', emojis: '🏃‍♂️ 🛌 🍽️ 🎾 📚' },
    { theme: 'seasonal set', emojis: '☀️ 🍂 ❄️ 🌸' },
  ];
  const emojiTheme = randomChoice(emojiThemes);
  const concept = `${breed} emoji/sticker set — ${emojiTheme.theme} (${emojiTheme.emojis})`;

  const captions = generateCaptions('emoji_set', breed, emojiTheme.theme);
  const hashtags = generateHashtags('emoji_set', animalGroup.animal, breed);
  const bestPostingTime = getBestPostingTime('emoji_set', dayOfWeek);

  return {
    id,
    date,
    contentType: 'emoji_set',
    title: `${breed} Emoji/Sticker Set`,
    description: `Shareable ${breed} ${emojiTheme.theme}`,
    animal: animalGroup.animal,
    breed,
    style: 'Emoji/Sticker Design',
    concept,
    specialInstructions: `Create a carousel-ready set of 6-9 cute ${breed} stickers/emojis for ${emojiTheme.theme}. Each should be isolated on transparent or solid background, vibrant, sharable. Pixar-ish 3D or flat vector style. 1080x1080 per image.`,
    captions,
    hashtags,
    bestPostingTime,
    n8nPayload: {
      'field-0': animalGroup.animal,
      'field-1': breed,
      'field-2': 'Emoji/Sticker Set',
      'field-3': concept,
      'field-4': `Instagram carousel. Create ${emojiTheme.emojis.split(' ').length} different ${breed} stickers for ${emojiTheme.theme}. Cute, shareable, viral.`,
      'field-5': `Sticker/emoji set. Each image 1080x1080. Think LINE stickers aesthetic.`,
    },
    reviewUrl: `https://pawcasso-atelier.vercel.app/ig-queue/${date}-${id}.html`,
    status: 'pending_generation',
    generatedAt: new Date().toISOString(),
  };
}

function generateZodiacAnimal(): ContentSpec {
  const animalGroup = randomChoice(ANIMALS);
  const breed = randomChoice(animalGroup.breeds);
  const zodiac = randomChoice(ZODIAC_SIGNS);
  const style = randomChoice(['Pixar 3D', 'Vinyl Toy Designer', 'Art Deco Poster', 'Stained Glass Window']);
  const id = generateId();
  const date = new Date().toISOString().split('T')[0];
  const dayOfWeek = new Date().getDay();

  const concept = `${zodiac.emoji} ${zodiac.sign} ${breed} — ${zodiac.traits}`;

  const captions = generateCaptions('zodiac', breed, zodiac.sign, zodiac);
  const hashtags = generateHashtags('zodiac', animalGroup.animal, breed, zodiac.sign);
  const bestPostingTime = getBestPostingTime('zodiac', dayOfWeek);

  return {
    id,
    date,
    contentType: 'zodiac',
    title: `${zodiac.sign} ${breed}`,
    description: `Zodiac-themed ${breed} portrait (${zodiac.emoji} ${zodiac.sign})`,
    animal: animalGroup.animal,
    breed,
    style,
    concept,
    specialInstructions: `Create a zodiac-themed ${breed} portrait embodying ${zodiac.sign} traits: ${zodiac.traits}. Include ${zodiac.emoji} symbol subtly. ${style} aesthetic. Instagram square 1080x1080.`,
    captions,
    hashtags,
    bestPostingTime,
    n8nPayload: {
      'field-0': animalGroup.animal,
      'field-1': breed,
      'field-2': style,
      'field-3': concept,
      'field-4': `Zodiac astrology post. ${zodiac.sign} ${breed} portrait. Embody traits: ${zodiac.traits}. Include ${zodiac.emoji} symbol. 1080x1080.`,
      'field-5': `Astrology viral content. Think horoscope memes + pet portraits.`,
    },
    reviewUrl: `https://pawcasso-atelier.vercel.app/ig-queue/${date}-${id}.html`,
    status: 'pending_generation',
    generatedAt: new Date().toISOString(),
  };
}

function generateReelConcept(): ContentSpec {
  const animalGroup = randomChoice(ANIMALS);
  const breed = randomChoice(animalGroup.breeds);
  const id = generateId();
  const date = new Date().toISOString().split('T')[0];
  const dayOfWeek = new Date().getDay();

  const reelConcepts = [
    { hook: 'Art style transformation', concept: `${breed} morphing through 5 art styles in 15 seconds` },
    { hook: 'Before/After reveal', concept: `Photo to masterpiece transformation — ${breed} portrait` },
    { hook: 'Choose your style poll', concept: `Which ${breed} portrait style wins? Renaissance vs Pixar vs Neon` },
    { hook: 'Speed paint timelapse', concept: `Watch this ${breed} portrait come to life in 30 seconds` },
  ];
  const reelConcept = randomChoice(reelConcepts);
  const concept = reelConcept.concept;

  const captions = generateCaptions('reel_concept', breed, reelConcept.hook);
  const hashtags = generateHashtags('reel_concept', animalGroup.animal, breed);
  const bestPostingTime = getBestPostingTime('reel_concept', dayOfWeek);

  return {
    id,
    date,
    contentType: 'reel_concept',
    title: `Reel: ${reelConcept.hook}`,
    description: concept,
    animal: animalGroup.animal,
    breed,
    style: 'Video/Reel Concept',
    concept,
    specialInstructions: `Create a Reel-ready concept: ${concept}. Generate key frames or storyboard for 15-30 second video. Vertical 1080x1920 format. Hook in first 2 seconds. Viral potential.`,
    captions,
    hashtags,
    bestPostingTime,
    n8nPayload: {
      'field-0': animalGroup.animal,
      'field-1': breed,
      'field-2': 'Reel/Video Concept',
      'field-3': concept,
      'field-4': `Instagram Reel concept. Vertical 1080x1920. ${concept}. Generate key frames or storyboard. Hook in first 2 seconds.`,
      'field-5': `Video content for Reels. Optimize for watch time + shares.`,
    },
    reviewUrl: `https://pawcasso-atelier.vercel.app/ig-queue/${date}-${id}.html`,
    status: 'pending_generation',
    generatedAt: new Date().toISOString(),
  };
}

// ============================================================================
// CAPTION GENERATION
// ============================================================================

function generateCaptions(
  contentType: ContentType,
  breed: string,
  styleOrTheme: string,
  extra?: any
): Caption[] {
  const templates = {
    portrait: {
      witty: [
        `POV: Your ${breed} just walked into the Louvre and the security guards didn't even question it. 🎨\n\nWhile other pets were eating kibble, yours was sitting for a ${styleOrTheme} portrait like it's 1642.\n\nThe audacity. The drama. The "paint me like one of your French poodles" energy.\n\nWe don't make the rules — we just paint the legends.\n\n🖼️ ${styleOrTheme} portrait | ${breed}\n📩 Commission yours — link in bio`,
        `Someone gave this ${breed} a gallery opening and we're honestly not mad about it. 🖼️\n\nThis floof woke up and chose ${styleOrTheme}. The refined taste. The bone structure. The way light hits fur like it studied under Rembrandt.\n\nYour dog could never (but we can paint them like they did).\n\n🎨 ${styleOrTheme} | ${breed}\n📩 Link in bio for commissions`,
      ],
      heartfelt: [
        `Some faces carry a kind of quiet beauty that stops you mid-scroll.\n\nThis ${breed} portrait started as a photograph — a single moment frozen between a pet and the person who adores them. We turned that moment into something you can hang on a wall and feel in your chest.\n\nBecause the way light catches fur, the way eyes hold an entire universe of trust — that deserves more than a camera roll. That deserves a frame.\n\nFor the ones who make our world softer. 🤍\n\n🖼️ ${styleOrTheme} | ${breed}\n📩 Commission yours — link in bio`,
        `They don't stay forever.\n\nBut a portrait like this? It does.\n\nWe paint ${breed}s (and every other beloved creature) not because we can, but because love this big deserves to live on walls, in hearts, in the quiet moments when you miss them most.\n\n${styleOrTheme}. Timeless. Yours.\n\n🖼️ ${breed} portrait\n📩 Link in bio`,
      ],
      minimal: [
        `${styleOrTheme}. ${breed}. Masterpiece.\n\n🖼️ Commission yours — link in bio`,
        `One ${breed}.\n${styleOrTheme}.\nInfinite personality.\n\n📩 Link in bio`,
      ],
      bold: [
        `CENTURIES OF ART LED TO THIS MOMENT.\n\nThe old masters spent lifetimes perfecting light, shadow, and soul. They painted royalty. They painted saints. They never imagined their legacy would peak with a ${breed} — and yet, here we are.\n\nThis is not a pet portrait. This is a CORONATION. Every stroke of ${styleOrTheme} rendering is a declaration: greatness has no species.\n\nThe galleries weren't ready. Neither were we.\n\n🖼️ ${styleOrTheme} | ${breed}\n📩 Commission your masterpiece — link in bio`,
        `LOOK AT THIS ${breed.toUpperCase()} AND TELL ME ART IS DEAD.\n\nI'll wait.\n\n${styleOrTheme}. Unapologetic. Iconic.\n\n📩 Link in bio for commissions`,
      ],
    },
    emoji_set: {
      witty: [
        `Your ${breed} has more moods than you do and we have the stickers to prove it. 😤\n\nPresenting: ${breed} ${styleOrTheme} — because every text needs a tiny furball to express your exact vibe.\n\nSad ${breed}? Hyper ${breed}? Existential crisis ${breed}? We got you.\n\nTag a ${breed} parent who NEEDS these.\n\n🐾 ${breed} sticker pack\n📩 Commission your pet's emoji set — link in bio`,
      ],
      heartfelt: [
        `Every ${breed} parent knows: they're not just pets. They're personalities.\n\nWe turned those personalities into a ${styleOrTheme} you can share, save, and send to fellow ${breed} lovers who just get it.\n\nBecause sometimes words aren't enough. Sometimes you need a tiny ${breed} doing the talking.\n\n🐾 ${breed} ${styleOrTheme}\n📩 Want your pet as stickers? Link in bio`,
      ],
      minimal: [
        `${breed} moods.\n${styleOrTheme}.\nPure joy.\n\n🐾 Link in bio`,
      ],
      bold: [
        `WE TURNED ${breed.toUpperCase()}S INTO EMOJIS AND THE INTERNET WILL NEVER BE THE SAME.\n\n${styleOrTheme} — because your group chat deserves better than generic smiley faces.\n\nShare this if you need a ${breed} to express your every emotion.\n\n🐾 ${breed} sticker pack\n📩 Link in bio`,
      ],
    },
    zodiac: {
      witty: [
        `${extra?.emoji || '✨'} ${extra?.sign || 'Zodiac'} ${breed}s are ${extra?.traits?.toLowerCase() || 'amazing'} and we have PROOF.\n\n"${extra?.dates || 'All year'}" — aka the ${breed}s who [insert zodiac stereotype here].\n\nIf your ${breed} is a ${extra?.sign || 'zodiac sign'}, this portrait was scientifically designed for your camera roll.\n\n🔮 Zodiac ${breed} series\n📩 Commission your pet's sign — link in bio`,
      ],
      heartfelt: [
        `${extra?.emoji || '✨'} ${extra?.sign || 'Zodiac'}: ${extra?.traits || 'Special'}.\n\nIf you have a ${breed} born ${extra?.dates || 'this season'}, you already know — they're not just pets. They're cosmic companions.\n\nWe painted this portrait to honor every ${extra?.sign || 'zodiac'} ${breed} who's ever stolen a heart (or a shoe).\n\nFor the astrology lovers and the ${breed} parents. 🤍\n\n🔮 ${extra?.sign || 'Zodiac'} ${breed}\n📩 Link in bio`,
      ],
      minimal: [
        `${extra?.emoji || '✨'} ${extra?.sign || 'Zodiac'}.\n${breed}.\n${extra?.traits || 'Unique'}.\n\n🔮 Link in bio`,
      ],
      bold: [
        `${extra?.emoji?.toUpperCase() || '✨'} ${extra?.sign?.toUpperCase() || 'ZODIAC'} ${breed.toUpperCase()}S ARE BUILT DIFFERENT.\n\n${extra?.traits?.toUpperCase() || 'SPECIAL'}. UNSTOPPABLE. ICONIC.\n\nBorn ${extra?.dates || 'this season'}? This portrait speaks your language.\n\n🔮 Zodiac ${breed} collection\n📩 Link in bio`,
      ],
    },
    reel_concept: {
      witty: [
        `We took one ${breed} photo and did crimes with it. 🎨\n\n[${styleOrTheme}]\n\nWatch this ${breed} transform through art history faster than you can say "good dog."\n\nWhich style wins? Drop a 🔥 for your favorite.\n\n🎬 ${breed} art transformation\n📩 Want your pet immortalized? Link in bio`,
      ],
      heartfelt: [
        `${styleOrTheme} — one ${breed}, infinite possibilities.\n\nEvery pet has a story. We help you tell it in the style that fits.\n\nWhich version made you feel something? Let us know. 🤍\n\n🎬 ${breed} transformation\n📩 Link in bio for commissions`,
      ],
      minimal: [
        `${breed}.\nMultiple styles.\nOne masterpiece.\n\n🎬 Link in bio`,
      ],
      bold: [
        `${styleOrTheme.toUpperCase()} — ${breed.toUpperCase()} EDITION.\n\nTHIS IS WHAT HAPPENS WHEN YOU LET AI LOOSE ON YOUR PET PHOTOS.\n\nArt history just got a ${breed} upgrade.\n\n🎬 ${breed} transformation Reel\n📩 Link in bio`,
      ],
    },
  };

  const contentTemplates = templates[contentType] || templates.portrait;

  return [
    {
      tone: 'witty',
      toneName: 'Witty & Playful',
      toneEmoji: '😄',
      text: randomChoice(contentTemplates.witty),
      hook: contentTemplates.witty[0].split('\n\n')[0],
    },
    {
      tone: 'heartfelt',
      toneName: 'Heartfelt & Warm',
      toneEmoji: '💛',
      text: randomChoice(contentTemplates.heartfelt),
      hook: contentTemplates.heartfelt[0].split('\n\n')[0],
    },
    {
      tone: 'minimal',
      toneName: 'Minimalist & Cool',
      toneEmoji: '✨',
      text: randomChoice(contentTemplates.minimal),
      hook: contentTemplates.minimal[0].split('\n')[0],
    },
    {
      tone: 'bold',
      toneName: 'Bold & Dramatic',
      toneEmoji: '🔥',
      text: randomChoice(contentTemplates.bold),
      hook: contentTemplates.bold[0].split('\n\n')[0],
    },
  ];
}

// ============================================================================
// HASHTAG GENERATION
// ============================================================================

function generateHashtags(
  contentType: ContentType,
  animal: string,
  breed: string,
  zodiacSign?: string
): string[] {
  const branded = ['#pawcasso', '#pawcassoatelier', '#aipetportrait', '#petportraitart'];

  const animalTags = animal === 'Dog'
    ? ['#dogsofinstagram', '#dogportrait', '#doglovers', '#dogsoftiktok', '#dogmom', '#dogdad']
    : animal === 'Cat'
    ? ['#catsofinstagram', '#catportrait', '#catlovers', '#catsoftiktok', '#catmom', '#catdad']
    : [`#${animal.toLowerCase()}sofinstagram`, `#${animal.toLowerCase()}portrait`, `#${animal.toLowerCase()}lovers`];

  const breedTag = `#${breed.toLowerCase().replace(/\s/g, '')}`;
  const breedLoverTag = `#${breed.toLowerCase().replace(/\s/g, '')}love`;

  const contentTags = {
    portrait: ['#petportrait', '#customportrait', '#digitalart', '#petart', '#animalart', '#portraitart'],
    emoji_set: ['#petstickers', '#emojiart', '#stickers', '#cuteart', '#digitalstickers'],
    zodiac: ['#petastrology', '#zodiac', `#${zodiacSign?.toLowerCase()}`, '#astrology', '#horoscope', '#zodiacsigns'],
    reel_concept: ['#reels', '#instagramreels', '#reelsinstagram', '#viral', '#trending', '#foryou'],
    carousel: ['#carousel', '#swipeleft', '#artstyles', '#beforeandafter'],
  };

  const viralTags = ['#viral', '#explorepage', '#trending', '#fyp', '#instagood'];

  return [
    ...branded,
    ...animalTags.slice(0, 4),
    breedTag,
    breedLoverTag,
    ...(contentTags[contentType] || contentTags.portrait),
    ...viralTags.slice(0, 3),
  ].slice(0, 30); // Instagram max 30 hashtags
}

// ============================================================================
// CONTENT SELECTION STRATEGY
// ============================================================================

function selectDailyContent(): ContentSpec {
  const dayOfWeek = new Date().getDay();
  const dayOfMonth = new Date().getDate();

  // Monday: High-effort portrait (start week strong)
  if (dayOfWeek === 1) return generatePortrait();

  // Wednesday: Emoji set (mid-week fun)
  if (dayOfWeek === 3) return generateEmojiSet();

  // Friday: Zodiac (weekend astrology engagement)
  if (dayOfWeek === 5) return generateZodiacAnimal();

  // Saturday/Sunday: Reel concepts (weekend video consumption)
  if (dayOfWeek === 0 || dayOfWeek === 6) return generateReelConcept();

  // Tuesday/Thursday: Mix it up based on date
  const contentTypes: (() => ContentSpec)[] = [
    generatePortrait,
    generateEmojiSet,
    generateZodiacAnimal,
    generateReelConcept,
  ];
  return contentTypes[dayOfMonth % contentTypes.length]();
}

// ============================================================================
// REVIEW PAGE GENERATION
// ============================================================================

function generateReviewHTML(spec: ContentSpec): string {
  const captionsHTML = spec.captions.map((caption, i) => `
    <div class="card">
      <div class="card-header">
        <span class="tone-badge">${caption.toneEmoji} ${caption.toneName}</span>
        <button class="copy-btn" onclick="copyText('caption-${i}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
          </svg> Copy
        </button>
      </div>
      <p class="caption-text" id="caption-${i}">${caption.text}</p>
      <p class="hook-label">Hook: <em>${caption.hook}</em></p>
    </div>
  `).join('\n');

  const hashtagsText = spec.hashtags.join(' ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>IG Review — ${spec.title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #0a0a0a;
      color: #e5e5e5;
      min-height: 100vh;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .header {
      background: #111;
      border-bottom: 1px solid #222;
      padding: 16px;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .header-title { font-size: 18px; font-weight: 600; }
    .header-meta { font-size: 12px; color: #999; margin-top: 4px; }
    .content-type-badge {
      display: inline-block;
      background: #1a1a1a;
      border: 1px solid #333;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      color: #aaa;
      margin-top: 8px;
    }
    .container { max-width: 480px; margin: 0 auto; padding: 16px; }
    .section-title {
      font-size: 13px;
      font-weight: 600;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 24px 0 12px;
    }
    .concept-box {
      background: #141414;
      border: 1px solid #252525;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 16px;
    }
    .concept-title { font-size: 14px; font-weight: 600; color: #ddd; margin-bottom: 8px; }
    .concept-text { font-size: 14px; line-height: 1.6; color: #aaa; }
    .card {
      background: #141414;
      border: 1px solid #252525;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 10px;
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .tone-badge {
      font-size: 12px;
      font-weight: 600;
      color: #ccc;
      background: #1f1f1f;
      padding: 4px 10px;
      border-radius: 20px;
    }
    .copy-btn {
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 6px;
      color: #aaa;
      font-size: 12px;
      padding: 4px 10px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .copy-btn:hover { background: #333; color: #fff; }
    .copy-btn.copied { background: #166534; border-color: #22c55e; color: #22c55e; }
    .caption-text {
      font-size: 15px;
      line-height: 1.6;
      color: #ddd;
      white-space: pre-wrap;
    }
    .hook-label {
      font-size: 12px;
      color: #888;
      margin-top: 8px;
      border-top: 1px solid #252525;
      padding-top: 8px;
    }
    .hashtag-box {
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 12px;
      padding: 16px;
      position: relative;
    }
    .hashtag-text {
      font-size: 13px;
      color: #7c9aed;
      line-height: 1.8;
      word-break: break-word;
    }
    .hashtag-copy { position: absolute; top: 12px; right: 12px; }
    .posting-time-box {
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 16px;
    }
    .time-main { font-size: 20px; font-weight: 600; color: #22c55e; margin-bottom: 8px; }
    .time-reasoning { font-size: 13px; color: #aaa; line-height: 1.5; }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-top: 12px;
    }
    .meta-item { background: #1a1a1a; border-radius: 8px; padding: 10px 12px; }
    .meta-label {
      font-size: 11px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .meta-value { font-size: 14px; color: #ccc; margin-top: 2px; }
    .action-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #111;
      border-top: 1px solid #222;
      padding: 12px 16px;
      display: flex;
      gap: 8px;
      z-index: 10;
    }
    .action-btn {
      flex: 1;
      padding: 12px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
      text-align: center;
      transition: all 0.2s;
    }
    .action-btn.primary { background: #22c55e; color: #000; }
    .action-btn.secondary { background: #1a1a1a; color: #ccc; border: 1px solid #333; }
    .toast {
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: #22c55e;
      color: #000;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      opacity: 0;
      transition: opacity 0.3s;
      pointer-events: none;
      z-index: 100;
    }
    .toast.show { opacity: 1; }
    .footer-spacer { height: 80px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-title">${spec.title}</div>
    <div class="header-meta">${spec.date} · @pawcasso.atelier</div>
    <div class="content-type-badge">${spec.contentType.replace(/_/g, ' ').toUpperCase()}</div>
  </div>

  <div class="container">
    <div class="section-title">Content Concept</div>
    <div class="concept-box">
      <div class="concept-title">${spec.description}</div>
      <div class="concept-text">${spec.concept}</div>
    </div>

    <div class="section-title">Best Posting Time</div>
    <div class="posting-time-box">
      <div class="time-main">${spec.bestPostingTime.time} ${spec.bestPostingTime.timezone}</div>
      <div class="time-reasoning">${spec.bestPostingTime.reasoning}</div>
    </div>

    <div class="section-title">Caption Options (Choose One)</div>
    ${captionsHTML}

    <div class="section-title">Hashtags</div>
    <div class="hashtag-box">
      <div class="hashtag-copy">
        <button class="copy-btn" onclick="copyText('hashtags')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
          </svg> Copy
        </button>
      </div>
      <p class="hashtag-text" id="hashtags">${hashtagsText}</p>
    </div>

    <div class="section-title">Details</div>
    <div class="meta-grid">
      <div class="meta-item">
        <div class="meta-label">Animal</div>
        <div class="meta-value">${spec.breed || spec.animal}</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Style</div>
        <div class="meta-value">${spec.style}</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Content Type</div>
        <div class="meta-value">${spec.contentType.replace(/_/g, ' ')}</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Review ID</div>
        <div class="meta-value">${spec.id}</div>
      </div>
    </div>

    <div class="footer-spacer"></div>
  </div>

  <div class="action-bar">
    <a href="${N8N_FORM_URL}" class="action-btn primary" target="_blank">Generate via n8n</a>
    <button class="action-btn secondary" onclick="shareContent()">Share Spec</button>
  </div>

  <div class="toast" id="toast">Copied!</div>

  <script>
    function copyText(id) {
      var el = document.getElementById(id);
      var text = el.innerText || el.textContent;
      navigator.clipboard.writeText(text).then(function() {
        var toast = document.getElementById("toast");
        toast.classList.add("show");
        setTimeout(function() { toast.classList.remove("show"); }, 1500);

        var card = el.closest(".card, .hashtag-box");
        var btn = card ? card.querySelector(".copy-btn") : null;
        if (btn) {
          btn.classList.add("copied");
          var originalHTML = btn.innerHTML;
          btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
          setTimeout(function() {
            btn.classList.remove("copied");
            btn.innerHTML = originalHTML;
          }, 2000);
        }
      });
    }

    function shareContent() {
      const spec = ${JSON.stringify(spec, null, 2)};
      const text = \`📸 IG Content Ready\\n\\nType: \${spec.contentType}\\nAnimal: \${spec.breed || spec.animal}\\nStyle: \${spec.style}\\n\\n\${spec.reviewUrl}\`;

      if (navigator.share) {
        navigator.share({ title: spec.title, text, url: spec.reviewUrl });
      } else {
        navigator.clipboard.writeText(text);
        var toast = document.getElementById("toast");
        toast.textContent = "Spec copied!";
        toast.classList.add("show");
        setTimeout(function() {
          toast.classList.remove("show");
          toast.textContent = "Copied!";
        }, 1500);
      }
    }
  </script>
</body>
</html>`;
}

// ============================================================================
// DASHBOARD GENERATION
// ============================================================================

function generateDashboardHTML(specs: ContentSpec[]): string {
  const pending = specs.filter(s => s.status === 'pending_review' || s.status === 'pending_generation');
  const approved = specs.filter(s => s.status === 'approved');
  const posted = specs.filter(s => s.status === 'posted');

  const renderContentCard = (spec: ContentSpec) => `
    <a href="${spec.reviewUrl.replace('https://pawcasso-atelier.vercel.app', '')}" class="content-card">
      <div class="content-card-header">
        <div>
          <div class="content-title">${spec.title}</div>
          <div class="content-meta">${spec.date} · ${spec.contentType.replace(/_/g, ' ')}</div>
        </div>
        <div class="status-badge status-${spec.status.replace('_', '-')}">${spec.status.replace(/_/g, ' ')}</div>
      </div>
      <div class="content-concept">${spec.description}</div>
      <div class="content-footer">
        <span>${spec.breed || spec.animal}</span>
        <span class="posting-time">${spec.bestPostingTime.time}</span>
      </div>
    </a>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>IG Content Queue — @pawcasso.atelier</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #0a0a0a;
      color: #e5e5e5;
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
    }
    .header {
      background: #111;
      border-bottom: 1px solid #222;
      padding: 20px 16px;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .header-title { font-size: 24px; font-weight: 700; }
    .header-subtitle { font-size: 14px; color: #888; margin-top: 4px; }
    .stats-bar {
      display: flex;
      gap: 16px;
      margin-top: 16px;
    }
    .stat-item {
      flex: 1;
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
    }
    .stat-value { font-size: 20px; font-weight: 600; color: #22c55e; }
    .stat-label { font-size: 11px; color: #888; margin-top: 4px; text-transform: uppercase; }
    .container { max-width: 600px; margin: 0 auto; padding: 16px; }
    .section-title {
      font-size: 13px;
      font-weight: 600;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 24px 0 12px;
    }
    .content-card {
      display: block;
      background: #141414;
      border: 1px solid #252525;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 12px;
      text-decoration: none;
      color: inherit;
      transition: all 0.2s;
    }
    .content-card:hover { background: #1a1a1a; border-color: #333; }
    .content-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }
    .content-title { font-size: 16px; font-weight: 600; color: #fff; }
    .content-meta { font-size: 12px; color: #888; margin-top: 4px; }
    .status-badge {
      font-size: 10px;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 12px;
      text-transform: uppercase;
      white-space: nowrap;
    }
    .status-pending-generation { background: #1e3a8a; color: #60a5fa; }
    .status-pending-review { background: #854d0e; color: #fbbf24; }
    .status-approved { background: #166534; color: #22c55e; }
    .status-posted { background: #4c1d95; color: #a78bfa; }
    .content-concept {
      font-size: 14px;
      color: #aaa;
      line-height: 1.5;
      margin-bottom: 12px;
    }
    .content-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: #666;
      padding-top: 12px;
      border-top: 1px solid #222;
    }
    .posting-time { color: #22c55e; font-weight: 500; }
    .empty-state {
      text-align: center;
      padding: 48px 16px;
      color: #666;
    }
    .empty-state-icon { font-size: 48px; margin-bottom: 16px; }
    .empty-state-text { font-size: 14px; }
    .footer {
      text-align: center;
      padding: 32px 16px;
      color: #555;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-title">IG Content Queue</div>
    <div class="header-subtitle">@pawcasso.atelier · Daily Content Generation</div>
    <div class="stats-bar">
      <div class="stat-item">
        <div class="stat-value">${pending.length}</div>
        <div class="stat-label">Pending</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${approved.length}</div>
        <div class="stat-label">Approved</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${posted.length}</div>
        <div class="stat-label">Posted</div>
      </div>
    </div>
  </div>

  <div class="container">
    ${pending.length > 0 ? `
      <div class="section-title">Pending Review</div>
      ${pending.map(renderContentCard).join('\n')}
    ` : ''}

    ${approved.length > 0 ? `
      <div class="section-title">Approved & Ready</div>
      ${approved.map(renderContentCard).join('\n')}
    ` : ''}

    ${posted.length > 0 ? `
      <div class="section-title">Posted</div>
      ${posted.map(renderContentCard).join('\n')}
    ` : ''}

    ${specs.length === 0 ? `
      <div class="empty-state">
        <div class="empty-state-icon">🎨</div>
        <div class="empty-state-text">No content in queue. Run the daily generator!</div>
      </div>
    ` : ''}

    <div class="footer">
      Pawcasso Atelier · Daily IG Content System<br>
      Last updated: ${new Date().toISOString().split('T')[0]}
    </div>
  </div>
</body>
</html>`;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  console.log('🎨 Pawcasso Daily IG Content Generator\n');

  // Ensure output directories exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Generate today's content
  const content = selectDailyContent();
  console.log(`✨ Selected content type: ${content.contentType}`);
  console.log(`📝 Title: ${content.title}`);
  console.log(`🐾 Animal: ${content.breed || content.animal}`);
  console.log(`🎨 Style: ${content.style}`);
  console.log(`⏰ Best posting time: ${content.bestPostingTime.time} ${content.bestPostingTime.timezone}`);
  console.log(`   ${content.bestPostingTime.reasoning}\n`);

  // Save content spec as JSON
  const specPath = path.join(OUTPUT_DIR, `${content.date}-${content.id}.json`);
  fs.writeFileSync(specPath, JSON.stringify(content, null, 2));
  console.log(`💾 Spec saved: ${specPath}`);

  // Generate review page HTML
  const reviewHTML = generateReviewHTML(content);
  const reviewPath = path.join(OUTPUT_DIR, `${content.date}-${content.id}.html`);
  fs.writeFileSync(reviewPath, reviewHTML);
  console.log(`📄 Review page: ${reviewPath}`);

  // Load all existing specs
  const allSpecs: ContentSpec[] = [];
  const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.json'));
  for (const file of files) {
    const specData = JSON.parse(fs.readFileSync(path.join(OUTPUT_DIR, file), 'utf-8'));
    allSpecs.push(specData);
  }

  // Sort by date (newest first)
  allSpecs.sort((a, b) => b.date.localeCompare(a.date));

  // Generate dashboard
  const dashboardHTML = generateDashboardHTML(allSpecs);
  const dashboardPath = path.join(OUTPUT_DIR, 'index.html');
  fs.writeFileSync(dashboardPath, dashboardHTML);
  console.log(`📊 Dashboard: ${dashboardPath}`);

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('🎉 DAILY CONTENT GENERATED');
  console.log('='.repeat(60));
  console.log(`📱 Mobile review: https://pawcasso-atelier.vercel.app/ig-queue/`);
  console.log(`🔗 Direct link: ${content.reviewUrl}`);
  console.log('\n📋 Next Steps:');
  console.log('  1. Open the review page on your phone');
  console.log('  2. Review captions, hashtags, and posting time');
  console.log('  3. Tap "Generate via n8n" to trigger image generation');
  console.log('  4. Once image is ready, copy caption + hashtags and post!');
  console.log('\n🚀 Pro Tips:');
  console.log('  - Test different caption tones to see what gets engagement');
  console.log(`  - Post at ${content.bestPostingTime.time} for max reach`);
  console.log('  - Engage with comments in the first hour for algorithm boost');
  console.log('\n💡 Content Type Distribution:');
  const typeCounts: Record<string, number> = {};
  allSpecs.forEach(s => {
    typeCounts[s.contentType] = (typeCounts[s.contentType] || 0) + 1;
  });
  Object.entries(typeCounts).forEach(([type, count]) => {
    console.log(`  ${type.replace(/_/g, ' ')}: ${count}`);
  });
}

if (require.main === module) {
  main().catch(console.error);
}

export { selectDailyContent, generateReviewHTML, generateDashboardHTML };
