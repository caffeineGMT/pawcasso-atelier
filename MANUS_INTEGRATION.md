# Manus/Nano Banana Integration for Instagram Content

## 🚀 Overview

Automated daily Instagram content generation system that uses **Manus API (Nano Banana)** to generate:
- 🎨 **AI Animal Portraits** - Stunning 1:1 posts in various art styles
- 😊 **Emoji/Sticker Sets** - Shareable 4-pack mood sets (carousel posts)
- ♈ **Zodiac Animals** - Astrology-themed pet portraits
- 🎬 **Reel Concepts** - Vertical video-ready images (9:16)

**Target:** 7+ pieces/week queued for review, ready to post!

---

## 📦 What's Included

### Core Integration Files

```
scripts/
├── lib/
│   ├── manus-client.ts           # Manus API client (create tasks, poll, download)
│   └── ig-content-prompts.ts     # Viral-optimized prompt templates
├── generate-ig-content-manus.ts  # Main automated generator (NEW!)
└── daily-ig-content.ts           # Legacy spec-only generator
```

### Manus Client Features

- **Task Management**: Create, poll, and retrieve generated images
- **Batch Generation**: Generate multiple images in parallel (emoji sets, carousels)
- **Exponential Backoff**: Smart polling with configurable timeouts
- **Progress Tracking**: Real-time status updates during generation
- **Error Handling**: Automatic retries with exponential backoff

### Content Generator Features

- **Day-Based Strategy**: Rotates content types by day of week for optimal engagement
- **4 Caption Variants**: Witty, Heartfelt, Minimal, Bold (choose your vibe!)
- **Optimized Hashtags**: 30 hashtags per post (branded + animal-specific + content-type)
- **Best Posting Times**: Algorithm-optimized times based on content type
- **Automatic Metadata**: Saves provenance, prompts, Manus task IDs
- **Mobile Review Pages**: Clean HTML preview pages for quick mobile review

---

## 🔧 Setup

### 1. Get Manus API Key

You need a Manus API key to generate images. Add it to your `.env.local`:

```env
# Manus API for AI Portrait Generation
MANUS_API_KEY=your_manus_api_key_here
```

Get your key from: https://manus.aws.metafb.cloud

### 2. Install Dependencies

All dependencies are already in `package.json`:
- `tsx` - TypeScript execution
- `@vercel/blob` - Image storage (already configured)

### 3. Verify Directory Structure

The generator will auto-create these if they don't exist:
```
website/public/
├── gallery/              # Generated images saved here
│   └── metadata/         # JSON metadata for each image
└── ig-queue/             # Review pages and content specs
    ├── index.html        # Dashboard
    ├── 2026-03-19-abc123.html  # Review page
    └── 2026-03-19-abc123.json  # Content spec
```

---

## 🎯 Usage

### Generate Daily Content (Automatic Images!)

```bash
cd website
npm run ig:generate
```

This will:
1. ✅ Select content type based on day of week
2. ✅ Generate AI images via Manus API
3. ✅ Download and save to `/public/gallery/`
4. ✅ Create metadata JSON files
5. ✅ Generate mobile-friendly review page
6. ✅ Output direct link to review

**Example output:**
```
🎨 PAWCASSO DAILY INSTAGRAM CONTENT GENERATOR
════════════════════════════════════════════════════════════

📅 Today's content type: PORTRAIT

🎨 Generating portrait: Border Collie dog in watercolor style
   Concept: wearing a crown like royalty
✓ Manus task created: task_abc123
   Poll 1: processing
   Poll 2: processing
   Poll 3: completed
   ✓ Saved: portrait-8a4a00d3.jpg

💾 Saving metadata...
   ✓ Metadata saved: portrait-8a4a00d3.json

📄 Generating review page...
   ✓ Review page: 2026-03-19-8a4a00d3.html

════════════════════════════════════════════════════════════

✅ CONTENT GENERATED SUCCESSFULLY!

📁 Gallery images: 1
📄 Review page: https://pawcasso-atelier.vercel.app/ig-queue/2026-03-19-8a4a00d3.html

Next step: Review the content and post to Instagram!
```

### Review Content on Mobile

1. Open: `https://pawcasso-atelier.vercel.app/ig-queue/`
2. Tap on the pending content card
3. Swipe through the 4 caption variants
4. Copy your favorite caption + hashtags
5. Post to Instagram at the recommended time!

### Content Type Rotation (Weekly Strategy)

The generator automatically selects content based on the day:

| Day | Content Type | Why |
|-----|--------------|-----|
| **Monday** | Portrait | Strong start to the week |
| **Tuesday** | Mixed (Portrait/Emoji) | Variety |
| **Wednesday** | Emoji Set | Mid-week shareable content |
| **Thursday** | Mixed (Portrait/Zodiac) | Variety |
| **Friday** | Zodiac | Weekend astrology engagement |
| **Saturday** | Reel Concept | Weekend video consumption peak |
| **Sunday** | Reel Concept | Weekend video consumption peak |

---

## 🤖 Automation Setup

### Option 1: Cron Job (Recommended)

Run daily at 8:00 AM PT:

```bash
crontab -e
```

Add this line:
```
0 8 * * * cd /Users/michaelguo/pawcasso-atelier/website && npm run ig:generate >> /tmp/ig-generate.log 2>&1
```

### Option 2: MetaClaw Scheduler

If you're using MetaClaw:

```typescript
schedule_add({
  name: "Daily IG Content Generator (Manus)",
  message: "Run cd /Users/michaelguo/pawcasso-atelier/website && npm run ig:generate",
  schedule: {
    kind: "cron",
    expr: "0 8 * * *", // 8 AM daily
    tz: "America/Los_Angeles"
  },
  deliver: true // Get notified when content is ready
});
```

### Option 3: GitHub Actions

Add `.github/workflows/daily-ig-manus.yml`:

```yaml
name: Daily IG Content (Manus)

on:
  schedule:
    - cron: '0 15 * * *' # 8 AM PT = 3 PM UTC
  workflow_dispatch:

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd website && npm install
      - run: cd website && npm run ig:generate
        env:
          MANUS_API_KEY: ${{ secrets.MANUS_API_KEY }}
      - name: Commit and push
        run: |
          git config user.name "IG Content Bot"
          git config user.email "bot@pawcasso.atelier"
          git add website/public/gallery/ website/public/ig-queue/
          git commit -m "Daily IG content: $(date +%Y-%m-%d)" || echo "No changes"
          git push
```

**Don't forget to add `MANUS_API_KEY` to GitHub Secrets!**

---

## 📊 Content Examples

### Portrait Example
```
Animal: Border Collie dog
Style: Watercolor
Concept: Wearing a crown like royalty
Prompt: "Professional artistic portrait of a Border Collie dog in watercolor style,
         wearing a crown like royalty, high detail, studio lighting, 8K resolution,
         masterpiece quality, trending on artstation"

Best Time: 9:00 AM PT (morning coffee scroll)
```

### Emoji Set Example
```
Animal: Cat
Moods: Happy, Sad, Excited, Sleepy
Format: 4 stickers (carousel post)
Prompt (Happy): "Cute cat sticker, big smile, eyes sparkling, simple clean design,
                 white background, kawaii style, expressive face, bold outlines,
                 vibrant colors, professional illustration"

Best Time: 12:30 PM PT (lunch break engagement)
```

### Zodiac Example
```
Animal: Fox
Sign: Leo
Prompt: "Artistic fox embodying LEO zodiac sign, golden crown, royal and majestic,
         warm sunlight, confident pose, astrological symbols, mystical atmosphere,
         high quality digital art, 8K"

Best Time: 7:00 PM PT (evening astrology interest)
```

### Reel Concept Example
```
Animal: Duck
Concept: Transforming through different art styles
Aspect Ratio: 9:16 (vertical for Reels)
Prompt: "Dynamic duck in motion, transforming through different art styles,
         cinematic composition, dramatic lighting, action shot, high detail,
         video still quality, 4K resolution"

Best Time: 8:00 PM PT (prime time video consumption)
```

---

## 🎨 Prompt Engineering

### Portrait Prompts
- **Base**: `Professional artistic portrait of {breed} {animal} in {style} style`
- **Concept**: `, {concept}` (e.g., wearing a crown, in a magical forest)
- **Quality**: `, high detail, studio lighting, 8K resolution, masterpiece quality, trending on artstation`

### Emoji/Sticker Prompts
- **Format**: `Cute {animal} sticker, {mood description}`
- **Style**: `, simple clean design, white background, kawaii style`
- **Quality**: `, expressive face, bold outlines, vibrant colors, professional illustration, PNG transparent style`

### Zodiac Prompts
- **Structure**: `Artistic {animal} embodying {SIGN} zodiac sign, {theme}`
- **Theme**: Sign-specific (Leo = golden crown, Pisces = ocean waves, etc.)
- **Quality**: `, astrological symbols, mystical atmosphere, high quality digital art, 8K`

### Reel Prompts
- **Format**: `Dynamic {animal} in motion, {concept}`
- **Quality**: `, cinematic composition, dramatic lighting, action shot, high detail, video still quality, 4K resolution`

---

## 📈 Target Metrics

- **Frequency**: 7+ pieces/week (1 per day minimum)
- **Engagement**: 2-5% organic (likes + comments + shares / reach)
- **Growth**: 100+ new followers/week from viral content
- **Shareability**: Emoji sets + Zodiac = high share rate
- **Video Reach**: Reels get 2-3x more reach than static posts

---

## 🔍 Monitoring & Debugging

### Check Generation Logs
```bash
tail -f /tmp/ig-generate.log
```

### Verify Images Were Saved
```bash
ls -lh website/public/gallery/ | grep portrait
ls -lh website/public/gallery/metadata/ | grep json
```

### Test Manus Client Directly

Create `scripts/test-manus.ts`:
```typescript
import { ManusClient } from './lib/manus-client';

const manus = new ManusClient();

manus.generate({
  prompt: 'Cute corgi dog, watercolor style, high detail',
  aspect_ratio: '1:1',
}).then(url => {
  console.log('✅ Image URL:', url);
}).catch(err => {
  console.error('❌ Error:', err);
});
```

Run: `tsx scripts/test-manus.ts`

### Common Issues

**"MANUS_API_KEY is required"**
- Add `MANUS_API_KEY` to `.env.local`

**"Task timed out"**
- Increase timeout: `{ timeout: 10 * 60 * 1000 }` (10 minutes)
- Or check Manus API status

**"Failed to download image"**
- Check network connection
- Verify image URL is accessible
- Try manual download: `curl {output_url}`

---

## 🚀 Next Steps

1. **Generate your first content**: `npm run ig:generate`
2. **Review on mobile**: Visit the review page URL
3. **Post to Instagram**: Use your favorite caption variant
4. **Track performance**: Monitor likes, comments, shares
5. **Iterate**: See which content types + captions perform best

---

## 📚 API Reference

### ManusClient

```typescript
class ManusClient {
  constructor(apiKey?: string)

  // Create a generation task
  async createTask(params: ManusTaskParams): Promise<string>

  // Check task status
  async getTaskStatus(taskId: string): Promise<ManusStatusResponse>

  // Poll until complete
  async pollUntilComplete(taskId: string, options?: {
    timeout?: number;
    pollInterval?: number;
    onProgress?: (status, attempt) => void;
  }): Promise<string>

  // Generate and wait (convenience method)
  async generate(params: ManusTaskParams, options?): Promise<string>

  // Batch generate multiple images
  async generateBatch(prompts: ManusTaskParams[], options?): Promise<string[]>

  // Download image as buffer
  async downloadImage(url: string): Promise<Buffer>
}
```

### ManusTaskParams

```typescript
interface ManusTaskParams {
  prompt: string;
  model?: 'flux-pro' | 'flux-dev' | 'flux-schnell';
  aspect_ratio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  num_inference_steps?: number;  // Default: 50
  guidance_scale?: number;         // Default: 7.5
  seed?: number;                   // Optional for reproducibility
  image?: string;                  // Base64 image for img2img
}
```

---

## 📝 Notes

- **Human-in-the-loop**: All generated content is saved for review before posting
- **Metadata Tracking**: Every image has provenance (prompt, Manus task ID, timestamps)
- **Caption Flexibility**: 4 tones per piece = 4 different audience vibes
- **Hashtag Strategy**: Branded (#pawcasso) + Animal + Content-specific
- **Posting Time**: Algorithm-optimized based on content type and day
- **Cost**: ~$0.02-0.05 per image (Manus API pricing)
- **Speed**: 30-60 seconds per image, 2-3 minutes for emoji sets

---

**Generated content is queued for review. You decide what gets posted!**
