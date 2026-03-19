# Instagram Content Review Dashboard

> Mobile-optimized review dashboard for @pawcasso.atelier Instagram content

## 🌐 Live Dashboard

**GitHub Pages:** https://[your-username].github.io/pawcasso-atelier/

## 📱 Features

### ✨ Mobile-First Design
- **Optimized for phone review** - Review content on the go
- **Touch-friendly UI** - Large tap targets, smooth scrolling
- **Dark mode design** - Easy on the eyes
- **Fast loading** - Static HTML, minimal dependencies

### 📊 Content Management
- **Real-time dashboard** - See all pending, approved, and posted content
- **4 caption variants** - Witty, Heartfelt, Minimal, Bold
- **One-tap copy** - Copy captions + hashtags instantly
- **Posting time recommendations** - Algorithm-optimized timing
- **Status tracking** - Track content from generation to posting

### 🎨 Content Display
- Individual review pages for each content piece
- Visual content specs (animal, breed, style, concept)
- Optimized hashtag sets (up to 30 hashtags)
- Direct link to n8n image generation workflow

## 🚀 How It Works

### 1. Content Generation
Content is generated daily by the content generator:

```bash
cd website
npm run ig:daily
```

This creates:
- JSON specs in `website/public/ig-queue/`
- Metadata for each content piece

### 2. Sync to GitHub Pages
Sync content to the review dashboard:

```bash
cd website
npm run ig:sync
```

This generates:
- `ig-review/content.json` - Manifest of all content
- `ig-review/{id}.html` - Individual review pages
- Updates the dashboard with latest content

### 3. Auto-Deploy
GitHub Actions automatically deploys to GitHub Pages:

- **Trigger:** Push to `main` branch or daily at 8 AM PT
- **Build:** Syncs content and deploys to Pages
- **Deploy:** Live in ~1 minute

## 📖 Usage Guide

### Review Workflow (Mobile)

1. **Open Dashboard**
   - Navigate to the GitHub Pages URL on your phone
   - Bookmark it for quick access

2. **Browse Content**
   - See all pending content in the dashboard
   - Tap a card to view full details

3. **Review Content**
   - Read all 4 caption variants
   - Choose your favorite tone
   - Tap "Copy" to copy caption + hashtags

4. **Generate Image**
   - Tap "Generate Image via n8n"
   - Opens n8n form with pre-filled details
   - Submit to trigger Manus image generation

5. **Post to Instagram**
   - Wait for image to be generated (check GitHub Issues)
   - Download image from GitHub Issue
   - Paste caption from clipboard
   - Post at recommended time

### Desktop Workflow

Same as mobile, but with larger screen for easier reviewing of multiple content pieces.

## 🔧 Maintenance

### Update Content
```bash
cd website
npm run ig:daily    # Generate new content
npm run ig:sync     # Sync to GitHub Pages
git add .
git commit -m "chore: daily IG content"
git push            # Auto-deploys to Pages
```

### Manual Deployment
Trigger the GitHub Actions workflow manually:

1. Go to Actions tab in GitHub
2. Select "Deploy Instagram Review Dashboard"
3. Click "Run workflow"

## 📁 File Structure

```
ig-review/
├── index.html              # Main dashboard
├── content.json            # Content manifest (auto-generated)
├── {id}.html              # Individual review pages (auto-generated)
├── .nojekyll              # Disable Jekyll processing
└── README.md              # This file

scripts/
└── sync-ig-content.ts     # Sync script

.github/workflows/
└── deploy-ig-review.yml   # Auto-deployment workflow
```

## 🎯 Best Practices

### Content Review
- **Review daily** - Check new content every morning
- **Test variants** - Try different caption tones to see what works
- **Track performance** - Note which styles get best engagement
- **Stay consistent** - Post at recommended times

### Image Generation
- **Review n8n payload** - Check that all fields are correct
- **Monitor GitHub Issues** - Generated images appear there
- **Download high-res** - Use full resolution for Instagram

### Posting Strategy
- **Post at recommended time** - Algorithm-optimized
- **Use all hashtags** - Up to 30 for maximum reach
- **Engage early** - Reply to comments in first hour
- **Track metrics** - Note what content performs best

## 🔗 Integration

### Connected Systems
- **Content Generator** - `scripts/daily-ig-content.ts`
- **n8n Workflow** - Image generation via Manus
- **GitHub Pages** - Static hosting
- **GitHub Actions** - Auto-deployment

### Manual Triggers
- Content generation: `npm run ig:daily`
- Sync to Pages: `npm run ig:sync`
- Deploy: Push to `main` branch

## 📈 Analytics

Track performance metrics:
- Content type performance (portraits vs emoji sets vs zodiac)
- Caption tone effectiveness (witty vs heartfelt vs minimal vs bold)
- Posting time impact on engagement
- Hashtag effectiveness

## 🐛 Troubleshooting

### Dashboard not updating
- Check GitHub Actions status
- Verify `content.json` exists in `ig-review/`
- Re-run `npm run ig:sync`

### Content not appearing
- Ensure `npm run ig:daily` was run
- Check `website/public/ig-queue/` for JSON files
- Run sync script manually

### Deployment failing
- Check GitHub Actions logs
- Verify GitHub Pages is enabled in repo settings
- Ensure workflow has proper permissions

## 🚀 Future Enhancements

- [ ] A/B testing for caption variants
- [ ] Engagement prediction scores
- [ ] Auto-post to Instagram (pending API approval)
- [ ] Analytics dashboard with performance metrics
- [ ] Seasonal content calendar
- [ ] Instagram Insights integration

---

**Built for:** @pawcasso.atelier
**Maintained by:** Pawcasso Engineering Team
**Last Updated:** March 2026
