# TikTok/Reels Video Automation Pipeline

**Automated viral content generation for Pawcasso Atelier**

This n8n workflow automatically generates TikTok/Instagram Reels videos twice daily, featuring pet portrait transformations with trending audio and AI-generated captions.

---

## 🎯 Pipeline Overview

**Trigger:** Daily at 9:00 AM & 6:00 PM Pacific Time

**Process:**
1. **Random Gallery Selection** → Pick one of 14 pet portraits
2. **Trending Audio Fetch** → Get popular sounds from TikTok (#petportrait)
3. **Video Rendering** → Remotion API creates 15-second transformation video
4. **Upload to Vercel Blob** → Store video for distribution
5. **AI Caption Generation** → GPT-4 writes viral-optimized caption
6. **Notification** → Slack + Email with video URL and caption

**Output:** Ready-to-post video + caption → Manual posting via Buffer/Hootsuite

---

## 🎬 Video Template Specification

**Remotion Composition:** `PetPortraitTransform`

**Format:**
- Resolution: 1080x1920 (vertical TikTok/Reels)
- Duration: 15 seconds (450 frames @ 30fps)
- Codec: H.264
- Audio: Trending TikTok sound (from API)

**Visual Structure:**
1. **0-5s:** Original pet photo (left half of screen)
2. **5-10s:** Morphing transition effect (CapCut-style)
3. **10-13s:** AI portrait (right half) + text overlay
4. **13-15s:** End card with CTA: "Link in bio - $9"

**Text Overlay (seconds 10-13):**
```
POV: Your [breed] becomes a [style] painting
```

Example: "POV: Your Border Collie becomes a Pixar 3D painting"

---

## 🛠 Setup Instructions

### 1. n8n Import

```bash
# Import workflow to n8n
1. Open n8n dashboard
2. Click "Import from File"
3. Upload: automation/tiktok-video-generator.json
4. Configure credentials (see below)
```

### 2. Required Credentials

Add these to n8n Settings → Credentials:

#### **Remotion API** (`remotionApiKey`)
- Get API key: [remotion.dev/dashboard](https://remotion.dev/dashboard)
- Set in n8n as HTTP Header Auth: `X-Remotion-Token`

#### **Vercel Blob** (`BLOB_READ_WRITE_TOKEN`)
```bash
# Get from Vercel dashboard
vercel env pull
# Copy BLOB_READ_WRITE_TOKEN value
```

#### **Slack Webhook** (`SLACK_WEBHOOK_URL`)
```bash
# Create incoming webhook
1. Go to Slack App Dashboard
2. Enable "Incoming Webhooks"
3. Create webhook for #marketing or #content channel
4. Copy webhook URL
```

#### **Email (SMTP)** (optional)
- Use existing SMTP credentials in n8n
- Or set up Resend/SendGrid

### 3. Environment Variables

Add to n8n workflow settings or `.env`:

```bash
# Vercel Blob
VERCEL_BLOB_STORE_ID=your_store_id_here
BLOB_READ_WRITE_TOKEN=vercel_blob_XXX

# Notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/XXX
NOTIFICATION_EMAIL=michaelguo@example.com

# OpenAI (for caption generation)
OPENAI_API_KEY=sk-proj-XXX

# Remotion (set in credentials, not env)
# X-Remotion-Token: set in HTTP Header Auth credential
```

### 4. Remotion Video Template Setup

You need to create a Remotion composition. Two options:

#### **Option A: Use Remotion Cloud (Recommended)**
1. Sign up at [remotion.dev](https://remotion.dev)
2. Create new project: `pawcasso-tiktok-videos`
3. Add composition: `PetPortraitTransform`
4. Upload the template code (see `remotion-template/` folder - TO BE CREATED)
5. Deploy to Remotion Cloud
6. Copy API key to n8n credentials

#### **Option B: Self-Hosted Remotion**
```bash
# Clone and deploy custom Remotion renderer
git clone https://github.com/remotion-dev/template-tiktok-transformation
cd template-tiktok-transformation
npm install
npm run deploy
```

**Composition Input Props:**
```typescript
{
  originalImageUrl: string;  // Gallery image URL
  breed: string;             // e.g., "Border Collie"
  style: string;             // e.g., "Pixar 3D"
  audioUrl: string;          // Trending TikTok audio
  ctaText: string;           // "Link in bio - $9"
  overlayText: string;       // "POV: Your [breed]..."
}
```

---

## 📝 Caption Generator

The pipeline uses GPT-4 to generate viral-optimized TikTok captions.

### Usage

```bash
# From website/ directory
cd website

# Generate caption
npm run caption:generate "Border Collie" "Pixar 3D"

# Or with tsx directly
npx tsx scripts/generate-captions.ts "Shiba Inu" "Renaissance"
```

### Example Output

```
✨ POV: Your Border Collie becomes a Pixar 3D masterpiece! 🎨

Custom AI pet portraits just $9 💫
Link in bio 👆

#petportrait #bordercollie #aiart #petlovers #doglovers #customart #petparent #dogsoftiktok
```

### Caption Strategy

**Hook Types:**
- POV statements
- Questions ("What if your dog...")
- Emotional declarations ("I'm OBSESSED")
- Challenges ("Tell me this isn't...")

**Trending Hashtags (rotate):**
- Core: `#petportrait #aiart #customart`
- Platform: `#dogsoftiktok #petsofinstagram`
- Breed-specific: `#bordercollie #shibainu`
- Emotion: `#dogmom #catmom #furbaby`

**CTA Options:**
- "Link in bio 👆"
- "Check bio for yours 💫"
- "Get yours $9 - bio ✨"

---

## 🚀 Manual Posting Workflow

The pipeline delivers **ready-to-post assets**. Here's the manual step:

### Step 1: Get Notification
- Check Slack #marketing channel (or email)
- Click "Download Video" button
- Copy caption from notification

### Step 2: Post to TikTok
```
1. Open TikTok app or web
2. Upload video from Vercel Blob URL
3. Paste caption
4. Add hashtags if not included
5. Set link in bio to: pawcasso-atelier.vercel.app/order
6. Schedule or post immediately
```

### Step 3: Post to Instagram Reels
```
1. Open Instagram app
2. Reels → Upload
3. Paste same caption
4. Ensure link in bio is set
5. Post
```

### Step 4: Schedule with Buffer/Hootsuite (Optional)
```
1. Add video to Buffer queue
2. Paste caption
3. Schedule for optimal posting time
4. Connect TikTok + Instagram accounts
```

**Optimal Posting Times (PT):**
- TikTok: 7-9 AM, 12-2 PM, 7-11 PM
- Instagram Reels: 9 AM, 12 PM, 5-7 PM

---

## 📊 Success Metrics

Track these for each video:

**Engagement:**
- Views (target: 10K+ per video)
- Likes (target: 500+)
- Comments (target: 50+)
- Shares (target: 100+)
- Saves (target: 200+)

**Conversion:**
- Link clicks (track via Vercel Analytics)
- Order page visits
- Completed orders
- Revenue attributed to TikTok traffic

**Content Analysis:**
- Which breeds perform best
- Which styles get most engagement
- Hook types that convert
- Optimal posting times

---

## 🔧 Troubleshooting

### Workflow Fails at Remotion Step
**Issue:** Render timeout or error
**Fix:**
```bash
# Check Remotion dashboard for failed renders
# Increase wait time in "Wait for Remotion Render" node
# Or check composition input props format
```

### No Trending Audio Found
**Issue:** TikTok API authentication failure
**Fix:**
```bash
# Fallback to manual audio selection
# OR use joyodream/tiktok-api npm package with auth
# OR hardcode popular sounds for MVP
```

### Caption Generation Fails
**Issue:** OpenAI API error or rate limit
**Fix:** Workflow uses fallback template captions automatically

### Vercel Blob Upload Fails
**Issue:** Token expired or incorrect
**Fix:**
```bash
# Regenerate Vercel Blob token
vercel env pull
# Update BLOB_READ_WRITE_TOKEN in n8n
```

---

## 🎯 Next Steps (Future Enhancements)

- [ ] **Auto-posting:** Add Instagram Graph API + TikTok Business API
- [ ] **A/B Testing:** Generate 2-3 caption variants, test performance
- [ ] **Audio Library:** Curated list of pet-friendly trending sounds
- [ ] **Analytics Integration:** Auto-pull engagement metrics
- [ ] **Smart Scheduling:** ML-based optimal posting time predictor
- [ ] **Video Variations:** Generate multiple video styles per image
- [ ] **Hashtag Analytics:** Track which hashtags drive conversions
- [ ] **Comment Auto-Reply:** AI-powered comment responses

---

## 📁 File Structure

```
automation/
├── tiktok-video-generator.json    # Main n8n workflow
├── README.md                        # This file
└── remotion-template/               # (TO DO) Remotion video template

website/scripts/
└── generate-captions.ts             # AI caption generator
```

---

## 📞 Support

- n8n docs: [docs.n8n.io](https://docs.n8n.io)
- Remotion docs: [remotion.dev/docs](https://remotion.dev/docs)
- Vercel Blob docs: [vercel.com/docs/storage/vercel-blob](https://vercel.com/docs/storage/vercel-blob)

---

**Built by:** Pawcasso Atelier Engineering Team
**Last Updated:** 2026-03-18
