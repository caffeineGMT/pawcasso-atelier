/**
 * Pawcasso Instagram Reels - Strategic Hashtag Engine
 * Generates 30 optimized hashtags per post based on content theme,
 * animal type, art style, and trending topics.
 */

interface HashtagSet {
  primary: string[];    // High-volume, broad reach (10 tags)
  niche: string[];      // Medium-volume, targeted (10 tags)
  branded: string[];    // Brand-specific, community (5 tags)
  trending: string[];   // Current trends (5 tags)
}

interface HashtagConfig {
  theme: ContentTheme;
  animal?: string;
  breed?: string;
  artStyle?: string;
  season?: string;
  customTags?: string[];
}

type ContentTheme =
  | 'before_after'
  | 'style_comparison'
  | 'testimonial'
  | 'behind_the_scenes'
  | 'trending_remix';

const BRANDED_HASHTAGS = [
  '#pawcasso',
  '#pawcassoatelier',
  '#petportraitart',
  '#aipetportrait',
  '#pawcassoart',
];

const THEME_HASHTAGS: Record<ContentTheme, { primary: string[]; niche: string[] }> = {
  before_after: {
    primary: [
      '#petportrait', '#dogportrait', '#beforeandafter', '#transformation',
      '#aiart', '#dogsoftiktok', '#catsoftiktok', '#petparent', '#artlovers', '#digitalart',
      '#catportrait', '#petart', '#animalart', '#customportrait', '#portraitart'
    ],
    niche: [
      '#custompetportrait', '#petglow', '#arttransformation', '#portraitreveal',
      '#petmakeover', '#digitalpetportrait', '#petartist', '#dogmomlife',
      '#customdogportrait', '#catportraitart', '#handmadepetgifts', '#petloversgift',
      '#petcommission', '#artcommission', '#personalizedpetart'
    ]
  },
  style_comparison: {
    primary: [
      '#artstyles', '#artcomparison', '#petportrait', '#aiart', '#digitalart',
      '#dogsoftiktok', '#pettok', '#artoftheday', '#styleguide', '#creative',
      '#artgallery', '#fineartphotography', '#artcollector', '#modernart', '#classicalart'
    ],
    niche: [
      '#whichstyle', '#artbattle', '#styleShowdown', '#petartstyles',
      '#renaissancepet', '#pixarpet', '#feltartpet', '#pixelartpet',
      '#polltime', '#youdecide', '#community', '#engagement',
      '#artvote', '#interactiveart', '#chooseyourstyle'
    ]
  },
  testimonial: {
    primary: [
      '#petportrait', '#giftideas', '#bestgiftever', '#dogmom', '#catmom',
      '#dogsoftiktok', '#pettok', '#emotional', '#wholesome', '#heartwarming',
      '#petlove', '#petfamily', '#furbaby', '#petparent', '#happytears'
    ],
    niche: [
      '#petmemorial', '#rainbowbridge', '#petloss', '#memorylane',
      '#customgift', '#thoughtfulgift', '#affordablegift', '#personalized',
      '#surprisegift', '#giftreaction', '#mothersday', '#fathersday',
      '#birthdaygift', '#anniversarygift', '#justbecause'
    ]
  },
  behind_the_scenes: {
    primary: [
      '#behindthescenes', '#bts', '#howitworks', '#aiart', '#technology',
      '#petportrait', '#process', '#educational', '#learnontiktok', '#artprocess',
      '#artistlife', '#creatorlife', '#smallbusiness', '#entrepreneur', '#startup'
    ],
    niche: [
      '#aitechnology', '#machinelearning', '#arttech', '#futureart',
      '#techcreative', '#computervision', '#pettech', '#aiartist',
      '#digitalartprocess', '#artmaking', '#howto', '#tutorial',
      '#innovation', '#techforgood', '#artandsciemce'
    ]
  },
  trending_remix: {
    primary: [
      '#petportrait', '#viral', '#trending', '#foryou', '#fyp',
      '#dogsoftiktok', '#catsoftiktok', '#pettok', '#reels', '#reelsinstagram',
      '#explorepage', '#instareels', '#viralreels', '#trendingaudio', '#reelsviral'
    ],
    niche: [
      '#reelstrending', '#audiotrend', '#newtrend', '#viralcontent',
      '#musictrend', '#soundtrend', '#fypage', '#foryoupage',
      '#contentcreator', '#socialmedia', '#instagramreels', '#reelsofinstagram',
      '#trendingnow', '#trending2026', '#viralvideos'
    ]
  }
};

const ANIMAL_HASHTAGS: Record<string, string[]> = {
  'dog': ['#doglovers', '#doglife', '#dogstagram', '#instadog', '#dogsofinstagram'],
  'cat': ['#catlovers', '#catlife', '#catstagram', '#instacat', '#catsofinstagram'],
  'border collie': ['#bordercollie', '#bordercolliesofinstagram', '#bordercollielife', '#bordercollielove', '#collie'],
  'shiba inu': ['#shibainu', '#shibatok', '#shibalove', '#shiba', '#shibalife'],
  'chihuahua': ['#chihuahua', '#chihuahualove', '#chihuahuasofinstagram', '#chihuahuaworld', '#chilife'],
  'golden retriever': ['#goldenretriever', '#goldenretrieversofinstagram', '#goldenretrieverlife', '#goldenlove', '#retriever'],
  'pomeranian': ['#pomeranian', '#pomlife', '#pomeraniansofinstagram', '#pomeranianworld', '#pompom'],
};

const ART_STYLE_HASHTAGS: Record<string, string[]> = {
  'renaissance': ['#renaissanceart', '#classicalart', '#oilpainting', '#museumquality', '#masterpiece'],
  'pixar 3d': ['#pixar', '#3dart', '#disneystyle', '#cartoon', '#cute3d'],
  'needle felt': ['#needlefelt', '#feltart', '#woolart', '#texturedart', '#cozyart'],
  'pixel art': ['#pixelart', '#8bit', '#retro', '#retrogaming', '#gameboy'],
  'ink wash': ['#inkwash', '#sumi', '#japaneseink', '#brushwork', '#minimalistart'],
  'chinese classical': ['#chineseart', '#orientalart', '#asianart', '#dynasty', '#imperialart'],
  'vinyl toy': ['#vinyltoy', '#designertoy', '#collectible', '#figurine', '#toyart'],
};

const SEASONAL_HASHTAGS: Record<string, string[]> = {
  'spring': ['#spring2026', '#springvibes', '#springart', '#newseason', '#bloom'],
  'summer': ['#summer2026', '#summervibes', '#summerart', '#sunshine', '#warmdays'],
  'fall': ['#fall2026', '#fallvibes', '#autumnart', '#cozyseason', '#fallcolors'],
  'winter': ['#winter2026', '#wintervibes', '#winterart', '#cozywinter', '#holiday'],
  'mothers_day': ['#mothersday', '#mothersdaygift', '#giftformom', '#momlife', '#bestmom'],
  'fathers_day': ['#fathersday', '#fathersdaygift', '#giftfordad', '#dadlife', '#bestdad'],
  'christmas': ['#christmas', '#christmasgift', '#holiday', '#xmas', '#giftideas'],
  'valentines': ['#valentines', '#valentinesday', '#love', '#giftforlover', '#petlove'],
};

export function generateHashtags(config: HashtagConfig): string[] {
  const themeHashtags = THEME_HASHTAGS[config.theme];
  const hashtags = new Set<string>();

  // Add branded hashtags (always included)
  BRANDED_HASHTAGS.forEach(tag => hashtags.add(tag));

  // Add theme-specific primary hashtags (pick 8)
  shuffleArray(themeHashtags.primary).slice(0, 8).forEach(tag => hashtags.add(tag));

  // Add theme-specific niche hashtags (pick 7)
  shuffleArray(themeHashtags.niche).slice(0, 7).forEach(tag => hashtags.add(tag));

  // Add animal-specific hashtags (pick 3-5)
  if (config.animal) {
    const animalKey = config.animal.toLowerCase();
    const animalTags = ANIMAL_HASHTAGS[animalKey] || ANIMAL_HASHTAGS['dog'];
    shuffleArray(animalTags).slice(0, 3).forEach(tag => hashtags.add(tag));
  }

  // Add art style hashtags (pick 3-4)
  if (config.artStyle) {
    const styleKey = config.artStyle.toLowerCase();
    const styleTags = ART_STYLE_HASHTAGS[styleKey] || [];
    shuffleArray(styleTags).slice(0, 3).forEach(tag => hashtags.add(tag));
  }

  // Add seasonal hashtags if applicable
  if (config.season) {
    const seasonTags = SEASONAL_HASHTAGS[config.season] || [];
    shuffleArray(seasonTags).slice(0, 2).forEach(tag => hashtags.add(tag));
  }

  // Add custom tags
  if (config.customTags) {
    config.customTags.forEach(tag => {
      const formatted = tag.startsWith('#') ? tag : `#${tag}`;
      hashtags.add(formatted);
    });
  }

  // Ensure exactly 30 hashtags by filling from a general pool
  const fillPool = [
    '#petoftheday', '#instapets', '#animalsofinstagram', '#petstagram',
    '#petlovers', '#animallovers', '#cutepets', '#adorable', '#instadaily',
    '#love', '#art', '#artsy', '#creative', '#design', '#handmade',
    '#smallbusiness', '#shopsmall', '#supportsmallbusiness', '#uniquegifts',
    '#giftsforher', '#giftsforhim', '#giftguide', '#affordableart',
    '#homedecor', '#wallart', '#printableart', '#downloadable',
    '#custommade', '#personalized', '#petowner'
  ];

  let fillIdx = 0;
  while (hashtags.size < 30 && fillIdx < fillPool.length) {
    hashtags.add(fillPool[fillIdx]);
    fillIdx++;
  }

  return Array.from(hashtags).slice(0, 30);
}

export function formatHashtagString(hashtags: string[]): string {
  return hashtags.join(' ');
}

export function generateHashtagsForDay(day: number, calendarEntry: any): string[] {
  const theme = calendarEntry.post?.theme_category || calendarEntry.theme;

  // Detect animal from image filename
  let animal = 'dog';
  const imageFile = calendarEntry.post?.image_file || '';
  if (imageFile.includes('cat')) animal = 'cat';
  else if (imageFile.includes('border_collie') || imageFile.includes('alfie')) animal = 'border collie';
  else if (imageFile.includes('shiba')) animal = 'shiba inu';
  else if (imageFile.includes('chihuahua')) animal = 'chihuahua';
  else if (imageFile.includes('golden')) animal = 'golden retriever';
  else if (imageFile.includes('pomeranian') || imageFile.includes('pom')) animal = 'pomeranian';

  // Detect art style from various sources
  let artStyle = 'pixar 3d';
  const caption = calendarEntry.post?.caption?.toLowerCase() || '';
  if (caption.includes('renaissance') || caption.includes('classical')) artStyle = 'renaissance';
  else if (caption.includes('felt') || caption.includes('needle')) artStyle = 'needle felt';
  else if (caption.includes('pixel') || caption.includes('retro')) artStyle = 'pixel art';
  else if (caption.includes('ink wash') || caption.includes('brush')) artStyle = 'ink wash';
  else if (caption.includes('vinyl') || caption.includes('toy')) artStyle = 'vinyl toy';
  else if (caption.includes('chinese') || caption.includes('imperial')) artStyle = 'chinese classical';

  // Detect season from date
  const month = new Date(calendarEntry.date).getMonth();
  let season = 'spring';
  if (month >= 5 && month <= 7) season = 'summer';
  else if (month >= 8 && month <= 10) season = 'fall';
  else if (month >= 11 || month <= 1) season = 'winter';

  return generateHashtags({
    theme: theme as ContentTheme,
    animal,
    artStyle,
    season,
  });
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// CLI execution
if (require.main === module) {
  const fs = require('fs');
  const path = require('path');

  const calendarPath = path.join(__dirname, 'reels-calendar-30day.json');
  const calendar = JSON.parse(fs.readFileSync(calendarPath, 'utf-8'));

  console.log('Pawcasso Instagram Reels - Hashtag Generation Report');
  console.log('='.repeat(60));

  for (const day of calendar.days) {
    const hashtags = generateHashtagsForDay(day.day, day);
    console.log(`\nDay ${day.day} (${day.date}) - ${day.title}`);
    console.log(`Theme: ${day.theme}`);
    console.log(`Hashtags (${hashtags.length}):`);
    console.log(formatHashtagString(hashtags));
    console.log('-'.repeat(60));
  }
}
