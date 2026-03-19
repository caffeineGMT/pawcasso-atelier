# Daily Instagram Content Generator

Automated daily content generation system for @pawcasso.atelier Instagram account.

## 🎨 What It Generates

Every day, the system creates **1 piece of viral-worthy Instagram content** with:

- **Content Types**:
  - 🖼️ **Single Portraits** - Stunning AI animal portraits in various art styles
  - 😊 **Emoji/Sticker Sets** - Shareable animal sticker packs (mood sets, activity sets, seasonal sets)
  - ♈ **Zodiac Animals** - Astrology-themed pet portraits based on zodiac signs
  - 🎬 **Reel Concepts** - Video ideas (art style transformations, before/after, polls)

- **4 Caption Variants** per piece:
  - 😄 **Witty & Playful** - Funny, viral-worthy hooks
  - 💛 **Heartfelt & Warm** - Emotional, storytelling approach
  - ✨ **Minimalist & Cool** - Clean, short, aesthetic
  - 🔥 **Bold & Dramatic** - All-caps energy, impossible to scroll past

- **Optimized Hashtag Sets** (up to 30 hashtags)
  - Branded tags (#pawcasso, #pawcassoatelier)
  - Animal-specific tags (#dogsofinstagram, #catportrait)
  - Content-specific tags (#viral, #reels, #zodiac)

- **Best Posting Time Recommendations**
  - Algorithm-optimized times based on content type and day of week
  - Reasoning provided for each recommendation

## 🚀 How to Use

### Manual Generation

Run the content generator manually:

```bash
cd website
npm run ig:daily
```

This generates:
- Content spec JSON at `website/public/ig-queue/{date}-{id}.json`
- Mobile-friendly review page at `website/public/ig-queue/{date}-{id}.html`
- Dashboard at `website/public/ig-queue/index.html`

### Access Review Pages

**On Desktop:**
```
https://pawcasso-atelier.vercel.app/ig-queue/
```

**On Mobile (for Michael):**
1. Open the dashboard URL on your phone
2. Tap on a pending content card to review
3. Read through the 4 caption options
4. Copy your favorite caption + hashtags
5. Tap "Generate via n8n" to trigger image generation via Manus
6. Once image is ready, post to Instagram!

## ⏰ Automation Setup

### Option 1: Daily Cron Job (macOS/Linux)

Add to your crontab:

```bash
# Run daily at 8:00 AM PT (generates content for the day)
0 8 * * * cd /Users/michaelguo/pawcasso-atelier/website && npm run ig:daily >> /tmp/ig-daily.log 2>&1
```

To edit crontab:
```bash
crontab -e
```

### Option 2: MetaClaw Scheduler

If you're using MetaClaw with the scheduler plugin:

```typescript
// Schedule daily content generation at 8 AM PT
import { schedule_add } from 'metaclaw-scheduler';

schedule_add({
  name: "Daily IG Content Generator",
  message: "Run cd /Users/michaelguo/pawcasso-atelier/website && npm run ig:daily",
  schedule: {
    kind: "cron",
    expr: "0 8 * * *", // 8 AM daily
    tz: "America/Los_Angeles"
  },
  deliver: false // Don't need to notify on completion
});
```

### Option 3: GitHub Actions (Auto-deploy to Vercel)

The content is automatically pushed to GitHub Pages when you commit. Add this workflow if you want auto-generation:

`.github/workflows/daily-ig-content.yml`:

```yaml
name: Daily IG Content Generation

on:
  schedule:
    - cron: '0 15 * * *' # 8 AM PT = 3 PM UTC (adjust for DST)
  workflow_dispatch: # Manual trigger

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd website && npm install
      - run: cd website && npm run ig:daily
      - name: Commit and push
        run: |
          git config --global user.name "IG Content Bot"
          git config --global user.email "bot@pawcasso.atelier"
          git add website/public/ig-queue/
          git commit -m "Daily IG content: $(date +%Y-%m-%d)" || echo "No changes"
          git push
```

## 📊 Content Strategy

The system intelligently selects content types based on the day of week:

- **Monday**: High-effort single portrait (start the week strong)
- **Tuesday**: Mixed (portraits, emoji sets, zodiac, reels - rotates)
- **Wednesday**: Emoji/sticker sets (mid-week fun, shareable content)
- **Thursday**: Mixed (rotates based on date)
- **Friday**: Zodiac animal (weekend astrology engagement)
- **Saturday/Sunday**: Reel concepts (weekend video consumption peaks)

This ensures variety and algorithm-optimized timing.

## 📱 Mobile Review Workflow

1. **Morning**: Script auto-generates content at 8 AM PT
2. **Review**: Michael opens dashboard on phone, reviews pending content
3. **Select**: Picks favorite caption variant (witty, heartfelt, minimal, bold)
4. **Generate**: Taps "Generate via n8n" button to trigger Manus image generation
5. **Monitor**: n8n workflow creates GitHub Issue with generated image
6. **Post**: Copy caption + hashtags, upload image to Instagram at recommended time
7. **Engage**: Reply to comments in first hour for algorithm boost

## 🎯 Posting Time Recommendations

The system analyzes Instagram engagement patterns and recommends optimal times:

| Content Type | Weekday | Weekend | Reasoning |
|--------------|---------|---------|-----------|
| Portrait | 9:00 AM | 11:00 AM | Morning coffee scroll |
| Emoji Set | 12:30 PM | 2:00 PM | Lunch break engagement |
| Zodiac | 7:00 PM | 5:00 PM | Evening astrology interest |
| Reel | 8:00 PM | 7:30 PM | Video consumption peak |

These times are in **PT (Pacific Time)**.

## 🔗 Integration with n8n Workflow

The content specs include pre-built n8n payloads for the Manus image generation workflow:

- **n8n Form URL**: `https://n8n.aws.metafb.cloud/form/8ae3cd62-13ea-4c8a-9ffc-2c1148783ee2`
- **Workflow ID**: `QsL9x2REsdvGgdtN`

Each content spec has the 6 form fields pre-filled:
- `field-0`: Animal type
- `field-1`: Breed
- `field-2`: Art style
- `field-3`: Concept/hook
- `field-4`: Special instructions
- `field-5`: Reference notes

Tap "Generate via n8n" on the review page to submit the payload.

## 📁 File Structure

```
pawcasso-atelier/
├── scripts/
│   └── daily-ig-content.ts       # Main generator script
├── website/
│   ├── package.json              # Includes "ig:daily" script
│   └── public/
│       └── ig-queue/             # Generated content
│           ├── index.html        # Mobile dashboard
│           ├── 2026-03-19-abc123.json  # Content spec
│           ├── 2026-03-19-abc123.html  # Review page
│           └── ...
```

## 🎨 Viral Content Tips

The generator is designed to create viral-worthy content, but here are tips for maximizing engagement:

1. **Test Caption Variants**: Try different tones (witty vs heartfelt) to see what resonates
2. **Post at Recommended Times**: The algorithm favors consistency at peak times
3. **Engage Early**: Reply to comments in the first hour for algorithm boost
4. **Use All 30 Hashtags**: The generator provides optimized hashtag sets
5. **Carousel Swipes**: Emoji sets and multi-image content get more engagement
6. **Zodiac = Shares**: Astrology content is highly shareable (tag friends)
7. **Reels = Reach**: Video content gets 2-3x more reach than static posts

## 🚨 Troubleshooting

### Script fails with module error

Make sure you're in the `website/` directory:
```bash
cd website
npm install
npm run ig:daily
```

### No content appears in ig-queue/

Check that the directory exists:
```bash
mkdir -p website/public/ig-queue
```

### Cron job not running

Check cron logs:
```bash
tail -f /tmp/ig-daily.log
```

Verify crontab entry:
```bash
crontab -l
```

## 📈 Analytics & Iteration

Track which content types and caption tones perform best:

1. Record engagement metrics (likes, comments, shares, saves)
2. Note which caption variant you used
3. Compare performance across content types
4. Adjust strategy based on data

The generator will evolve based on your feedback!

## 🔮 Future Enhancements

Planned features:
- [ ] Auto-post to Instagram via Graph API (pending approval)
- [ ] A/B testing for caption variants
- [ ] Engagement prediction scores
- [ ] Seasonal content calendar (holidays, trends)
- [ ] Integration with Instagram Insights API
- [ ] Automated hashtag optimization based on reach data

---

**Generated by**: Daily Instagram Content Generator v1.0
**Account**: @pawcasso.atelier
**Last Updated**: 2026-03-18
