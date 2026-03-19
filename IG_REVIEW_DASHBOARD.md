# Instagram Content Review Dashboard - Deployment Guide

## 🎉 What's Been Built

A **mobile-optimized GitHub Pages dashboard** for reviewing Instagram content on your phone. No more desktop-only workflows - review, copy captions, and trigger image generation all from your mobile device.

## 🌐 Live URL

Once deployed, your dashboard will be live at:

```
https://[your-github-username].github.io/pawcasso-atelier/
```

## 📱 Mobile-First Features

### Dashboard (`index.html`)
- **Real-time content grid** - All pending, approved, and posted content
- **Live stats** - Count of content by status
- **Touch-optimized cards** - Large tap targets, smooth animations
- **Auto-refresh** - Updates every 5 minutes
- **Pull-to-refresh** - Manual refresh button

### Individual Review Pages (`{id}.html`)
- **4 caption variants** - Witty, Heartfelt, Minimal, Bold
- **One-tap copy** - Copies caption + hashtags to clipboard
- **Content specs** - Animal, breed, style, concept, instructions
- **Optimized hashtags** - Up to 30 hashtags, one-tap copy
- **Posting time recommendation** - Algorithm-optimized timing
- **Direct n8n link** - Opens image generation form

## 🚀 Setup Instructions

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under "Source", select:
   - **Source:** Deploy from a branch
   - **Branch:** `gh-pages` (will be created by workflow)
   - **Folder:** `/ (root)`
4. Click **Save**

### 2. Push This Code

The GitHub Actions workflow will automatically:
- Sync content from `website/public/ig-queue/` to `ig-review/`
- Deploy to GitHub Pages
- Run daily at 8 AM PT

### 3. First Deployment

After pushing, the workflow will run automatically. Check:

1. **Actions Tab** - See deployment progress
2. **Pages Settings** - Get your live URL
3. **Visit Dashboard** - Open the URL on your phone

## 📖 Daily Workflow

### Morning: Generate Content (8 AM PT)

The GitHub Actions workflow auto-generates content daily, or run manually:

```bash
cd website
npm run ig:daily
```

This creates JSON specs in `website/public/ig-queue/`.

### Review: Check Dashboard on Phone

1. Open the GitHub Pages URL on your phone
2. See new content in "Pending Review" section
3. Tap a content card to open review page

### Select: Choose Caption Variant

1. Read all 4 caption variants
2. Choose the tone that fits your vibe
3. Tap "Copy" to copy caption + hashtags

### Generate: Trigger Image Creation

1. Scroll down to "Generate Image via n8n"
2. Tap the button to open n8n form
3. Submit to trigger Manus image generation
4. Check GitHub Issues for generated image

### Post: Share to Instagram

1. Download generated image from GitHub Issue
2. Open Instagram app
3. Create new post
4. Paste caption from clipboard (already has hashtags!)
5. Upload image
6. Post at recommended time

## 🔧 Manual Operations

### Sync Content to GitHub Pages

```bash
cd website
npm run ig:sync
```

This:
- Reads all JSON files from `website/public/ig-queue/`
- Generates `content.json` manifest
- Creates individual review HTML pages
- Outputs to `ig-review/` directory

### Deploy to GitHub Pages

Just push to `main`:

```bash
git add .
git commit -m "chore: update IG content"
git push
```

The GitHub Actions workflow handles the rest.

### Manual Workflow Trigger

1. Go to **Actions** tab in GitHub
2. Select **Deploy Instagram Review Dashboard**
3. Click **Run workflow**
4. Choose `main` branch
5. Click **Run workflow**

## 📁 File Structure

```
pawcasso-atelier/
├── ig-review/                      # GitHub Pages site (auto-deployed)
│   ├── index.html                  # Main dashboard (hand-coded)
│   ├── content.json                # Content manifest (auto-generated)
│   ├── {id}.html                   # Review pages (auto-generated)
│   ├── .nojekyll                   # Disable Jekyll
│   └── README.md                   # Dashboard documentation
│
├── scripts/
│   ├── daily-ig-content.ts         # Daily content generator
│   └── sync-ig-content.ts          # Sync to GitHub Pages
│
├── .github/workflows/
│   └── deploy-ig-review.yml        # Auto-deployment workflow
│
└── website/
    ├── package.json                # Includes ig:sync script
    └── public/
        └── ig-queue/               # Source content (JSON files)
```

## 🎨 Design System

### Colors
- **Background:** Pure black (`#000000`)
- **Cards:** Dark gray (`#141414`)
- **Borders:** Subtle gray (`#252525`)
- **Text:** White/gray scale
- **Accents:**
  - Green (`#22c55e`) - Success, posting times
  - Blue (`#60a5fa`) - Links, pending status
  - Yellow (`#fbbf24`) - Review status
  - Purple (`#a78bfa`) - Posted status

### Typography
- **Font:** Inter (from Google Fonts)
- **Weights:** 400, 500, 600, 700, 800
- **Mobile-optimized sizes**

### Interactions
- **Tap targets:** Minimum 44x44px
- **Hover effects:** Smooth transitions
- **Touch feedback:** Active states
- **Animations:** 0.3s cubic-bezier easing

## 🔄 Auto-Deployment Workflow

### Triggers
- **Daily schedule:** 8:00 AM PT (3:00 PM UTC)
- **Push to main:** When IG content changes
- **Manual trigger:** Via Actions tab

### Steps
1. Checkout code
2. Setup Node.js 18
3. Install dependencies (`npm ci`)
4. Run sync script (`npm run ig:sync`)
5. Configure Pages
6. Upload artifact (`ig-review/` directory)
7. Deploy to GitHub Pages
8. Output deployment URL

### Permissions
- `contents: read` - Read repository
- `pages: write` - Deploy to Pages
- `id-token: write` - OIDC token for Pages

## 📊 Content Structure

Each content item includes:

```typescript
{
  id: string;                    // Unique identifier
  date: string;                  // YYYY-MM-DD
  contentType: string;           // "portrait", "emoji_set", "zodiac", "reel"
  title: string;                 // Display title
  description: string;           // Short description
  animal: string;                // "Dog", "Cat", "Rabbit"
  breed: string;                 // Specific breed
  style: string;                 // Art style
  concept: string;               // Content concept
  specialInstructions: string;   // Generation instructions
  captions: [                    // 4 caption variants
    {
      tone: string;              // "witty", "heartfelt", "minimal", "bold"
      toneName: string;          // Display name
      toneEmoji: string;         // Visual identifier
      text: string;              // Full caption text
      hook: string;              // Opening hook
    }
  ];
  hashtags: string[];            // Up to 30 hashtags
  bestPostingTime: {
    time: string;                // "9:00 AM", "12:30 PM"
    timezone: string;            // "PT (Pacific Time)"
    reasoning: string;           // Why this time
  };
  n8nPayload: {                  // Pre-filled form data
    "field-0": string;           // Animal
    "field-1": string;           // Breed
    "field-2": string;           // Style
    "field-3": string;           // Concept
    "field-4": string;           // Instructions
    "field-5": string;           // Reference
  };
  status: string;                // "pending_generation", "pending_review", "approved", "posted"
  generatedAt: string;           // ISO timestamp
}
```

## 🐛 Troubleshooting

### Dashboard Shows No Content

**Cause:** No JSON files in `website/public/ig-queue/`

**Fix:**
```bash
cd website
npm run ig:daily    # Generate content
npm run ig:sync     # Sync to ig-review/
git add . && git commit -m "chore: daily IG content" && git push
```

### GitHub Actions Failing

**Cause:** Missing dependencies or permissions

**Fix:**
1. Check Actions logs for errors
2. Verify GitHub Pages is enabled
3. Check workflow permissions in Settings → Actions
4. Re-run the workflow

### Dashboard Not Updating

**Cause:** GitHub Pages cache or deployment delay

**Fix:**
1. Wait 1-2 minutes after deployment
2. Hard refresh browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
3. Check Actions tab for deployment status
4. Clear browser cache if needed

### Copy Button Not Working

**Cause:** Browser clipboard permissions

**Fix:**
1. Grant clipboard permissions when prompted
2. Use HTTPS (GitHub Pages auto-provides this)
3. Try a different browser

### Mobile Layout Broken

**Cause:** Viewport meta tag missing or CSS not loading

**Fix:**
1. Check that `index.html` has `<meta name="viewport">` tag
2. Verify Google Fonts is loading
3. Check browser console for CSS errors

## 🎯 Best Practices

### Content Management
- **Review daily** - Check new content every morning
- **Test caption tones** - See which styles perform best
- **Track what works** - Note engagement patterns
- **Stay consistent** - Post regularly at optimal times

### Image Generation
- **Review n8n payload** - Verify all fields before submitting
- **Monitor GitHub Issues** - Generated images appear there
- **Use high resolution** - Download full-size for Instagram

### Performance Tracking
- **Note caption variant used** - Track which tone works best
- **Record posting time** - Compare recommended vs actual
- **Track engagement** - Likes, comments, shares, saves
- **Iterate strategy** - Adjust based on data

## 🚀 Next Steps

### Immediate
1. ✅ Enable GitHub Pages in repo settings
2. ✅ Push code to trigger first deployment
3. ✅ Bookmark dashboard URL on your phone
4. ✅ Test the review workflow

### Optional Enhancements
- Add analytics tracking (Google Analytics, Plausible)
- Implement A/B testing for caption variants
- Add engagement prediction scores
- Build performance dashboard
- Auto-post to Instagram (pending API approval)

---

## 📞 Support

**Issues:** Report bugs or request features in GitHub Issues
**Documentation:** See `ig-review/README.md` for detailed usage
**Questions:** Check existing issues or create a new one

---

**Built:** March 2026
**For:** @pawcasso.atelier
**Status:** Production Ready ✅
