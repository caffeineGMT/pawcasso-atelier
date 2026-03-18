#!/usr/bin/env tsx
/**
 * AI-Powered TikTok/Reels Caption Generator
 *
 * Generates viral-optimized captions for pet portrait transformation videos
 * using OpenAI GPT-4 with trending hashtags, hooks, and CTAs.
 *
 * Usage:
 *   npx tsx scripts/generate-captions.ts "Border Collie" "Pixar 3D"
 *   npx tsx scripts/generate-captions.ts "Shiba Inu" "Renaissance"
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

interface CaptionParams {
  breed: string;
  style: string;
}

const SYSTEM_PROMPT = `You are an expert TikTok/Instagram Reels caption writer specializing in pet content and AI art.

Your captions must:
- Start with a STRONG HOOK (question, POV, or bold statement) that stops the scroll
- Be authentic and conversational, not salesy
- Include 3-5 relevant trending hashtags (#petportrait #doglovers #aiart)
- End with a clear but casual CTA (Link in bio, Check bio, etc.)
- Use emojis strategically (2-4 total, not excessive)
- Stay under 150 characters for optimal readability
- Feel native to TikTok/Reels (casual, fun, relatable)
- Avoid corporate language or buzzwords

WINNING HOOKS:
- "POV: Your [breed] becomes a [style] masterpiece"
- "What if your dog was a Renaissance painting?"
- "This AI turned my [breed] into art and I'm OBSESSED"
- "Tell me this isn't the cutest thing you've seen today"
- "My [breed] got the royal treatment"

TRENDING HASHTAGS (rotate these):
#petportrait #customart #doglovers #aiart #petparent #dogsoftiktok #catsoftiktok
#petsofinstagram #dogportrait #catportrait #furbaby #petart #digitalpetportrait
#petmemories #dogmom #catmom #puppylove #instadog #instacat #petstagram

Write ONLY the caption. No explanations, no quotes, no markdown - just the raw caption text.`;

async function generateCaption(params: CaptionParams): Promise<string> {
  const { breed, style } = params;

  const userPrompt = `Write a viral TikTok caption for a pet portrait transformation video.

Pet breed: ${breed}
Art style: ${style}

The video shows:
1. Original pet photo (left side)
2. Morphing transition effect
3. AI-generated ${style} portrait (right side)
4. End card with "Link in bio - $9"

Create a caption that will make people:
- STOP scrolling (strong hook)
- Feel emotional connection (their pet could be art too)
- Take action (click link in bio)

Remember: 150 chars max, include hook + trending hashtags + CTA, use 2-4 emojis, feel authentic.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.9, // Higher creativity for viral content
      max_tokens: 200,
      presence_penalty: 0.6, // Encourage diverse phrasing
      frequency_penalty: 0.3,
    });

    const caption = completion.choices[0]?.message?.content?.trim();

    if (!caption) {
      throw new Error('No caption generated');
    }

    return caption;
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback to template-based caption
    return generateFallbackCaption(params);
  }
}

function generateFallbackCaption(params: CaptionParams): string {
  const { breed, style } = params;

  const hooks = [
    `✨ POV: Your ${breed} becomes a ${style} masterpiece!`,
    `🎨 What if your ${breed} was a ${style} painting?`,
    `This AI turned my ${breed} into ${style} art and I'm OBSESSED 😍`,
    `Tell me this ${breed} ${style} portrait isn't the cutest thing 💫`,
    `My ${breed} got the royal ${style} treatment 👑`,
  ];

  const ctas = [
    'Link in bio 👆',
    'Check bio for custom portraits 💫',
    'Get yours - link in bio ✨',
    'Custom portraits $9 - bio 👆',
  ];

  const hashtags = `#petportrait #${breed.toLowerCase().replace(/\s+/g, '')} #aiart #petlovers #doglovers #customart #petparent #dogsoftiktok`;

  const hook = hooks[Math.floor(Math.random() * hooks.length)];
  const cta = ctas[Math.floor(Math.random() * ctas.length)];

  return `${hook} 🎨

Custom AI pet portraits just $9 💫
${cta}

${hashtags}`;
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: npx tsx scripts/generate-captions.ts <breed> <style>');
    console.error('Example: npx tsx scripts/generate-captions.ts "Border Collie" "Pixar 3D"');
    process.exit(1);
  }

  const [breed, style] = args;

  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  OPENAI_API_KEY not found. Using fallback caption generator.');
    const fallbackCaption = generateFallbackCaption({ breed, style });
    console.log(fallbackCaption);
    return;
  }

  try {
    const caption = await generateCaption({ breed, style });
    console.log(caption);
  } catch (error) {
    console.error('Error generating caption:', error);
    const fallbackCaption = generateFallbackCaption({ breed, style });
    console.log(fallbackCaption);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { generateCaption, generateFallbackCaption };
