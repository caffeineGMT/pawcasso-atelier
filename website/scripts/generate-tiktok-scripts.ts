/**
 * TikTok Video Script Generator
 * Generates daily before/after transformation video scripts
 * with hooks, captions, hashtags, and trending audio suggestions
 *
 * Usage: npx tsx scripts/generate-tiktok-scripts.ts [--days 30] [--output tiktok-scripts.json]
 */

interface VideoScript {
  id: string;
  day: number;
  date: string;
  hook: string;
  concept: string;
  format: 'before_after' | 'pov' | 'duet_bait' | 'stitch_bait' | 'storytime' | 'challenge';
  scenes: Scene[];
  caption: string;
  hashtags: string[];
  audioSuggestion: string;
  ctaText: string;
  targetAudience: string;
  viralPotential: 'high' | 'medium' | 'standard';
  notes: string;
}

interface Scene {
  duration: string;
  visual: string;
  text?: string;
  transition?: string;
}

const HOOKS = [
  'POV: You spent $500 on a custom dog portrait vs. you spent $9 on Pawcasso',
  'Wait for it... my dog has NEVER looked this good',
  'My friend thought I paid an artist $300 for this',
  'Tell me you love your pet without telling me you love your pet',
  'This is what $9 gets you in 2026',
  'I was today years old when I found out AI can do THIS to your pet photos',
  'The way my dog looks at his own portrait',
  'Stop scrolling if you have a pet. You NEED to see this.',
  'When the AI portrait hits different than the $400 commissioned one',
  'POV: You just discovered the best pet gift under $10',
  'My cat doesn\'t know she\'s famous yet',
  'The $9 portrait that made my mom cry',
  'How I got custom art of my dog for less than a coffee',
  'This shouldn\'t be legal for $9',
  'When Pawcasso turns your derpy pet photo into a MASTERPIECE',
  'POV: You ordered a pet portrait expecting nothing and got THIS',
  'I literally cannot stop making these for every pet I know',
  'Okay but why does my dog look like royalty??',
  'The portrait that broke my Instagram',
  'My vet has one in the lobby now... you\'re welcome',
  'That feeling when AI understands your pet\'s soul',
  'How to make every pet owner cry happy tears for $9',
  'Before vs After: My rescue dog\'s glow up',
  'POV: You find the perfect memorial for your pet',
  'Testing if AI can actually make good pet art (I\'m shook)',
  'When you realize you can get every art style for your pet',
  'The gift that made my friend ugly cry',
  'Renaissance? Ghibli? Pixel art? Yes, all of the above.',
  'My husband said it looks like it belongs in a museum',
  'If your dog was a painting, which era? Let me show you ALL of them',
];

const FORMATS: Array<{
  type: VideoScript['format'];
  weight: number;
  description: string;
}> = [
  { type: 'before_after', weight: 40, description: 'Classic phone photo → portrait reveal' },
  { type: 'pov', weight: 25, description: 'POV narrative with reaction' },
  { type: 'duet_bait', weight: 15, description: 'Designed to encourage duets' },
  { type: 'stitch_bait', weight: 10, description: 'Starts with a question/challenge' },
  { type: 'storytime', weight: 5, description: 'Emotional narrative (memorial, gift)' },
  { type: 'challenge', weight: 5, description: 'Encourages user participation' },
];

const BREEDS = [
  'Golden Retriever', 'Labrador', 'French Bulldog', 'Corgi', 'Pomeranian',
  'Husky', 'German Shepherd', 'Poodle', 'Dachshund', 'Shiba Inu',
  'Border Collie', 'Beagle', 'Chihuahua', 'Cavalier King Charles',
  'Goldendoodle', 'Cat', 'Persian Cat', 'Maine Coon', 'Tabby Cat',
  'Rescue Mix', 'Pitbull', 'Rottweiler', 'Bulldog', 'Boxer',
];

const STYLES = [
  'Renaissance', 'Baroque', 'Impressionist', 'Ghibli', 'Pixar 3D',
  'Needle Felt', 'Ink Wash', 'Pixel Art', 'Vinyl Toy', 'Pop Art',
  'Art Nouveau', 'Watercolor', 'Chinese Classical', 'Ukiyo-e',
  'Stained Glass', 'Oil Painting',
];

const AUDIO_SUGGESTIONS = [
  'Aesthetic piano trending sound',
  'Oh No by Kreepa (reveal moment)',
  'Metamorphosis - Interworld (bass drop reveal)',
  'Flowers - Miley Cyrus (glow up)',
  'As It Was - Harry Styles',
  'About Damn Time - Lizzo',
  'Running Up That Hill - Kate Bush',
  'Anti-Hero - Taylor Swift',
  'Calm piano with dramatic reveal sting',
  'Emotional piano (for memorial content)',
  'Funny/surprised reaction audio',
  'The "what $9 gets you" trending audio',
  'Chill lo-fi beat for process videos',
  'Classical music remix trending sound',
  'Original audio with pet sounds',
];

const HASHTAGS_CORE = [
  '#dogtok', '#petportrait', '#AIart', '#pawcasso', '#petpainting',
  '#customportrait', '#petgift', '#dogmom', '#catmom', '#petlover',
];

const HASHTAGS_TRENDING = [
  '#fyp', '#foryoupage', '#viral', '#trending', '#musthave',
  '#tiktokmademebuyit', '#bestfind', '#giftidea', '#budgetfriendly',
  '#petmom', '#doglover', '#catlover', '#furbaby', '#rescuedog',
  '#petmemorial', '#dogoftheday', '#petstagram', '#cutedog',
];

const TARGET_AUDIENCES = [
  'Affluent Millennial/Gen-Z Dog Parents',
  'Pet Loss/Memorial Seekers',
  'Gift Buyers for Pet Owners',
  'Pet Influencers (10K-500K followers)',
  'New Pet Parents',
  'Multi-pet Households',
  'Cat Parents',
  'Rescue Dog Advocates',
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickRandomN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function pickWeightedFormat(): VideoScript['format'] {
  const total = FORMATS.reduce((sum, f) => sum + f.weight, 0);
  let rand = Math.random() * total;
  for (const format of FORMATS) {
    rand -= format.weight;
    if (rand <= 0) return format.type;
  }
  return 'before_after';
}

function generateScenes(format: VideoScript['format'], breed: string, style: string): Scene[] {
  switch (format) {
    case 'before_after':
      return [
        { duration: '0-2s', visual: 'Phone photo of pet on screen', text: 'My phone photo...', transition: 'hold' },
        { duration: '2-4s', visual: 'Zooming into the phone photo', text: '', transition: 'zoom' },
        { duration: '4-5s', visual: 'Quick flash/glitch transition', text: 'But then Pawcasso did THIS', transition: 'glitch' },
        { duration: '5-8s', visual: `${style} portrait reveal with slow zoom`, text: '', transition: 'reveal' },
        { duration: '8-10s', visual: 'Side by side comparison', text: `${breed} → ${style} masterpiece. $9.`, transition: 'split' },
        { duration: '10-12s', visual: 'CTA screen with link', text: 'Link in bio', transition: 'fade' },
      ];
    case 'pov':
      return [
        { duration: '0-3s', visual: 'Text overlay on black screen', text: `POV: You just got your ${breed}'s portrait`, transition: 'fade_in' },
        { duration: '3-5s', visual: 'Person looking at phone, reacting', text: '', transition: 'cut' },
        { duration: '5-8s', visual: `Phone screen showing ${style} portrait`, text: '', transition: 'zoom_in' },
        { duration: '8-10s', visual: 'Reaction + comparison with phone photo', text: '$9 vs $500', transition: 'split' },
        { duration: '10-12s', visual: 'Person showing printed version', text: 'Link in bio for yours', transition: 'fade' },
      ];
    case 'duet_bait':
      return [
        { duration: '0-3s', visual: 'Show your pet and ask', text: 'Show me your pet, I\'ll show you the portrait', transition: 'fade_in' },
        { duration: '3-6s', visual: `Phone photo of ${breed}`, text: 'Here\'s my baby...', transition: 'cut' },
        { duration: '6-9s', visual: `${style} portrait transformation`, text: '', transition: 'reveal' },
        { duration: '9-12s', visual: 'Duet this with YOUR pet', text: 'DUET THIS with your pet!', transition: 'text_overlay' },
      ];
    case 'stitch_bait':
      return [
        { duration: '0-2s', visual: 'Question on screen', text: 'What\'s the best gift for a pet parent?', transition: 'text' },
        { duration: '2-5s', visual: 'Showing Pawcasso website', text: 'This. For $9.', transition: 'cut' },
        { duration: '5-8s', visual: `Multiple style transformations of ${breed}`, text: '', transition: 'carousel' },
        { duration: '8-11s', visual: 'Reaction video of gift recipient', text: 'Their reaction...', transition: 'cut' },
        { duration: '11-13s', visual: 'CTA', text: 'Stitch this if your pet needs one too', transition: 'fade' },
      ];
    case 'storytime':
      return [
        { duration: '0-3s', visual: 'Emotional setup', text: 'I lost my dog last year...', transition: 'fade_in' },
        { duration: '3-6s', visual: 'Old photos/videos of pet', text: 'He was my best friend for 14 years', transition: 'slow_pan' },
        { duration: '6-9s', visual: 'Discovering Pawcasso', text: 'Then someone told me about Pawcasso', transition: 'cut' },
        { duration: '9-12s', visual: `Memorial portrait reveal in ${style}`, text: '', transition: 'reveal' },
        { duration: '12-15s', visual: 'Framed portrait in home', text: 'Now he\'s always with me', transition: 'fade' },
      ];
    case 'challenge':
      return [
        { duration: '0-2s', visual: 'Challenge announcement', text: `#PawcassoChallenge: Transform your pet`, transition: 'text' },
        { duration: '2-5s', visual: `Demo with ${breed}`, text: 'Step 1: Upload any photo', transition: 'screen_record' },
        { duration: '5-7s', visual: 'Choosing style', text: `Step 2: Pick a style (I chose ${style})`, transition: 'screen_record' },
        { duration: '7-10s', visual: 'Result reveal', text: 'Step 3: GASP', transition: 'reveal' },
        { duration: '10-12s', visual: 'Challenge CTA', text: 'Your turn! Tag @pawcasso.atelier', transition: 'text_overlay' },
      ];
    default:
      return [];
  }
}

function generateCaption(hook: string, breed: string, style: string): string {
  const ctaVariants = [
    'Link in bio to try it yourself',
    'Get yours at the link in bio',
    'Tap the link in bio before this deal ends',
    'Link in bio — your pet will thank you',
    'Try it yourself (link in bio)',
  ];
  return `${hook}\n\n${pickRandom(ctaVariants)}`;
}

function generateScript(day: number, startDate: Date): VideoScript {
  const date = new Date(startDate);
  date.setDate(date.getDate() + day - 1);

  const format = pickWeightedFormat();
  const breed = pickRandom(BREEDS);
  const style = pickRandom(STYLES);
  const hook = HOOKS[(day - 1) % HOOKS.length];

  const coreHashtags = pickRandomN(HASHTAGS_CORE, 5);
  const trendingHashtags = pickRandomN(HASHTAGS_TRENDING, 5);
  const breedHashtag = `#${breed.toLowerCase().replace(/\s+/g, '')}`;

  const viralPotential: VideoScript['viralPotential'] =
    format === 'before_after' || format === 'pov' ? 'high' :
    format === 'duet_bait' || format === 'stitch_bait' ? 'medium' : 'standard';

  return {
    id: `tiktok-day-${day}`,
    day,
    date: date.toISOString().split('T')[0],
    hook,
    concept: `${breed} ${style} transformation — ${FORMATS.find(f => f.type === format)?.description}`,
    format,
    scenes: generateScenes(format, breed, style),
    caption: generateCaption(hook, breed, style),
    hashtags: [breedHashtag, ...coreHashtags, ...trendingHashtags],
    audioSuggestion: pickRandom(AUDIO_SUGGESTIONS),
    ctaText: 'Link in bio',
    targetAudience: pickRandom(TARGET_AUDIENCES),
    viralPotential,
    notes: format === 'storytime'
      ? 'Sensitive content — ensure authentic and respectful tone'
      : format === 'duet_bait'
      ? 'End with clear duet invitation. Leave space on left side for duet partner.'
      : `Feature ${breed} prominently. ${style} style should be the "wow" moment.`,
  };
}

function generateContentCalendar(days: number): VideoScript[] {
  const startDate = new Date();
  const scripts: VideoScript[] = [];

  for (let day = 1; day <= days; day++) {
    scripts.push(generateScript(day, startDate));
  }

  return scripts;
}

// CLI execution
const args = process.argv.slice(2);
const daysIndex = args.indexOf('--days');
const days = daysIndex !== -1 ? parseInt(args[daysIndex + 1]) : 30;
const outputIndex = args.indexOf('--output');
const outputFile = outputIndex !== -1 ? args[outputIndex + 1] : 'tiktok-content-calendar.json';

console.log(`Generating ${days}-day TikTok content calendar...`);

const calendar = generateContentCalendar(days);

const fs = require('fs');
const path = require('path');
const outputPath = path.join(process.cwd(), outputFile);
fs.writeFileSync(outputPath, JSON.stringify(calendar, null, 2));

console.log(`\nContent calendar saved to ${outputFile}`);
console.log(`\nSummary:`);
console.log(`  Total videos: ${calendar.length}`);
console.log(`  Format breakdown:`);

const formatCounts: Record<string, number> = {};
calendar.forEach(s => { formatCounts[s.format] = (formatCounts[s.format] || 0) + 1; });
Object.entries(formatCounts).forEach(([format, count]) => {
  console.log(`    ${format}: ${count}`);
});

const highViral = calendar.filter(s => s.viralPotential === 'high').length;
console.log(`  High viral potential: ${highViral}/${calendar.length}`);
console.log(`\nFirst 3 scripts:`);
calendar.slice(0, 3).forEach(s => {
  console.log(`\n  Day ${s.day} (${s.date}) — ${s.format}`);
  console.log(`  Hook: "${s.hook}"`);
  console.log(`  Concept: ${s.concept}`);
  console.log(`  Audio: ${s.audioSuggestion}`);
});
