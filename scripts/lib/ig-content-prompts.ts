/**
 * Instagram Content Prompt Templates for Manus Generation
 *
 * Optimized prompts for viral-worthy IG content
 */

export type AnimalType =
  | 'dog' | 'cat' | 'duck' | 'rabbit' | 'fox' | 'owl' | 'bear'
  | 'panda' | 'koala' | 'lion' | 'tiger' | 'elephant' | 'giraffe';

export type ArtStyle =
  | 'watercolor' | 'oil painting' | 'digital art' | 'pixel art'
  | 'anime' | 'cartoon' | 'renaissance' | 'impressionist' | 'pop art'
  | 'cyberpunk' | 'steampunk' | 'fantasy' | 'minimalist' | 'surreal';

export type ZodiacSign =
  | 'aries' | 'taurus' | 'gemini' | 'cancer' | 'leo' | 'virgo'
  | 'libra' | 'scorpio' | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

export type EmojiMoodSet =
  | 'happy' | 'sad' | 'excited' | 'sleepy' | 'love' | 'angry'
  | 'silly' | 'cool' | 'fancy' | 'sporty' | 'festive' | 'zen';

/**
 * Generate portrait prompt
 */
export function portraitPrompt(animal: AnimalType, breed: string, style: ArtStyle, concept?: string): string {
  const basePrompt = `Professional artistic portrait of a ${breed} ${animal} in ${style} style`;
  const conceptPart = concept ? `, ${concept}` : '';
  const quality = ', high detail, studio lighting, 8K resolution, masterpiece quality, trending on artstation';

  return basePrompt + conceptPart + quality;
}

/**
 * Generate emoji/sticker prompt (single emotion)
 */
export function emojiPrompt(animal: AnimalType, mood: string, variant: number = 1): string {
  const moodDescriptions: Record<string, string[]> = {
    happy: ['big smile, eyes sparkling', 'laughing joyfully', 'beaming with happiness', 'cheerful grin'],
    sad: ['tears in eyes, pouty face', 'looking down sadly', 'melancholic expression', 'teary-eyed'],
    excited: ['mouth wide open, bouncing', 'jumping with joy', 'eyes wide with excitement', 'energetic pose'],
    sleepy: ['eyes half-closed, yawning', 'napping peacefully', 'dozing off', 'sleepy expression'],
    love: ['heart-shaped eyes', 'sending a kiss', 'surrounded by hearts', 'loving gaze'],
    angry: ['furrowed brow, grumpy', 'steam coming from ears', 'crossed arms, frowning', 'annoyed expression'],
    silly: ['tongue out, playful', 'making a funny face', 'derpy expression', 'goofy grin'],
    cool: ['wearing sunglasses, confident', 'thumbs up, swagger', 'relaxed and chill', 'cool pose'],
    fancy: ['wearing a top hat and monocle', 'dressed elegantly', 'sophisticated pose', 'classy outfit'],
    sporty: ['wearing a headband, athletic', 'exercising energetically', 'holding sports equipment', 'gym outfit'],
    festive: ['wearing party hat, celebrating', 'birthday cake and balloons', 'confetti around', 'party mode'],
    zen: ['meditating peacefully, lotus pose', 'calm and centered', 'mindful expression', 'serene atmosphere'],
  };

  const description = moodDescriptions[mood]?.[variant % 4] || mood;

  return `Cute ${animal} sticker, ${description}, simple clean design, white background, kawaii style, expressive face, bold outlines, vibrant colors, professional illustration, PNG transparent style`;
}

/**
 * Generate zodiac animal prompt
 */
export function zodiacPrompt(sign: ZodiacSign, animal: AnimalType): string {
  const zodiacThemes: Record<ZodiacSign, string> = {
    aries: 'fiery ram horns, bold red and orange colors, energetic and courageous',
    taurus: 'earth tones, surrounded by flowers and nature, serene and grounded',
    gemini: 'dual personality, split composition, yellow and airy, communicative energy',
    cancer: 'moonlit scene, water elements, silver and white tones, nurturing aura',
    leo: 'golden crown, royal and majestic, warm sunlight, confident pose',
    virgo: 'wheat stalks, green earth tones, detailed and organized, analytical look',
    libra: 'balanced scales, pink and pastel tones, harmonious and graceful',
    scorpio: 'mysterious dark tones, phoenix or scorpion elements, intense gaze',
    sagittarius: 'archer bow and arrow, purple and adventurous, optimistic energy',
    capricorn: 'mountain peak, brown and navy tones, determined and ambitious',
    aquarius: 'electric blue, futuristic elements, innovative and unique',
    pisces: 'ocean waves, dreamy purple and teal, mystical and intuitive',
  };

  const theme = zodiacThemes[sign];
  return `Artistic ${animal} embodying ${sign.toUpperCase()} zodiac sign, ${theme}, astrological symbols, mystical atmosphere, high quality digital art, 8K`;
}

/**
 * Generate Reel/video still prompt
 */
export function reelPrompt(animal: AnimalType, concept: string): string {
  return `Dynamic ${animal} in motion, ${concept}, cinematic composition, dramatic lighting, action shot, high detail, video still quality, 4K resolution`;
}

/**
 * Generate carousel/multi-image series prompts
 */
export function carouselSeriesPrompts(
  animal: AnimalType,
  theme: string,
  count: number = 4
): string[] {
  const variations = [
    'close-up portrait',
    'full body pose',
    'action shot',
    'artistic angle',
    'dramatic lighting',
    'playful composition',
  ];

  return Array.from({ length: count }, (_, i) => {
    const variation = variations[i % variations.length];
    return `${animal} ${theme}, ${variation}, professional photography, high detail, 8K quality`;
  });
}

/**
 * Random animal selector
 */
export function randomAnimal(): AnimalType {
  const animals: AnimalType[] = [
    'dog', 'cat', 'duck', 'rabbit', 'fox', 'owl', 'bear',
    'panda', 'koala', 'lion', 'tiger', 'elephant', 'giraffe',
  ];
  return animals[Math.floor(Math.random() * animals.length)];
}

/**
 * Random art style selector
 */
export function randomArtStyle(): ArtStyle {
  const styles: ArtStyle[] = [
    'watercolor', 'oil painting', 'digital art', 'anime',
    'cartoon', 'impressionist', 'pop art', 'cyberpunk',
    'fantasy', 'minimalist',
  ];
  return styles[Math.floor(Math.random() * styles.length)];
}

/**
 * Random zodiac sign selector
 */
export function randomZodiacSign(): ZodiacSign {
  const signs: ZodiacSign[] = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
  ];
  return signs[Math.floor(Math.random() * signs.length)];
}
