# Quick Start Guide - Pawcasso Viral Content Engine

**Goal:** Get your first viral post live in 2 hours.

## ⚡ Fast Track (2 Hours)

### Hour 1: Setup & Production

**Step 1: Install Dependencies (5 min)**
```bash
# Install jq for CLI tool
brew install jq

# Make CLI executable
cd /Users/michaelguo/pawcasso-atelier/content-engine
chmod +x cli.sh

# Test CLI
./cli.sh today
```

**Step 2: Choose Your First Video (10 min)**
```bash
# See available images
./cli.sh images

# Review today's scheduled content
./cli.sh today
```

Pick the **morning post** from Day 1 (or current day):
- Hook: "POV: Your dog becomes a Renaissance painting for $9"
- Image: `border_collie_portrait_2048x2048.webp`
- Template: Before/After Split Screen

**Step 3: Create Video in CapCut (30 min)**

1. **Download CapCut Desktop:** https://www.capcut.com/
2. **Create New Project:**
   - Resolution: 1080x1920 (vertical)
   - FPS: 30

3. **Build Before/After Split Screen:**
   ```
   Timeline:
   0-1s:   Hook text appears ("POV: Your dog becomes a Renaissance painting for $9")
   1-3s:   Original pet photo (left half of screen)
   3-14s:  AI portrait (right half) - wipe transition
   14-15s: CTA text ("Link in bio 👆")
   ```

4. **Add Trending Audio:**
   - Go to TikTok → For You Page
   - Find trending emotional piano sound
   - Download using TikTok downloader or record with screen recording
   - Import to CapCut

5. **Add Text Overlays:**
   - Font: Montserrat Bold (or similar)
   - Color: White with black stroke
   - Animation: Pop in

6. **Export:**
   - Resolution: 1080x1920
   - FPS: 30
   - Format: MP4
   - Filename: `20260319_morning_povRenaissance.mp4`

**Step 4: Find Before Photo (15 min)**

Option A: Use stock pet photo
- Search Unsplash.com for "border collie"
- Download high-res image
- Use in left half of split screen

Option B: Use your own dog (if you have one)
- Take quick photo with iPhone
- AirDrop to Mac
- Import to CapCut

Option C: Skip before photo
- Just show AI portrait with zoom effect
- Simpler, faster, still effective

### Hour 2: Post & Track

**Step 5: Upload to TikTok (10 min)**

1. Open TikTok app on phone
2. Tap "+" to create
3. Upload video from camera roll
4. Add caption from calendar:
   ```
   POV: Your dog becomes a Renaissance painting for $9 🎨✨

   No waiting weeks for an artist. No $500 commission. Just upload your pet's photo and get museum-quality art in 24 hours.

   Link in bio to turn YOUR pet into a masterpiece 👆
   ```
5. Add hashtags:
   ```
   #petportrait #dogportrait #aiart #pettok #dogsoftiktok #petparent #bordercollie #renaissanceart #custompetportrait #affordableart
   ```
6. **CRITICAL:** Update bio link to: `https://pawcasso-atelier.vercel.app/order`
7. Post at **9:00 AM PT**

**Step 6: Upload to Instagram Reels (10 min)**

1. Open Instagram app
2. Tap "+" → Reels
3. Upload same video
4. Use same caption and hashtags
5. Post at **9:00 AM PT**

**Step 7: Set Up Tracking (20 min)**

1. **Check TikTok at 10:00 AM (1 hour later):**
   - Go to Profile → Analytics
   - Note: Views, Likes, Comments, Shares

2. **Log metrics using CLI:**
   ```bash
   ./cli.sh track 20260319_morning 1500 120 8 34 52
   #                 post_id         views likes comments shares saves
   ```

3. **Check Google Analytics:**
   - Go to https://analytics.google.com
   - Check "Realtime" → "Traffic sources"
   - See if traffic is coming from TikTok/Instagram

4. **Check Stripe Dashboard:**
   - Go to https://dashboard.stripe.com
   - Note any purchases in last hour
   - Attribute to social media if spike aligns with post

**Step 8: Monitor & Respond (20 min)**

1. **Reply to top 5 comments:**
   - Thank people for engaging
   - Answer questions about pricing/styles
   - Pin best comment asking "where to buy?" and reply with link

2. **Check performance every 2 hours:**
   - 12:00 PM: Log 3-hour metrics
   - 2:00 PM: Log 5-hour metrics
   - 6:00 PM: Post evening video
   - 10:00 PM: Log 24-hour metrics

## 🎯 First Day Goals

- **Views:** 5,000+ (baseline)
- **Engagement Rate:** 5%+
- **Website Visits:** 50+
- **Purchases:** 1-2

If you hit these, you're on track for a successful campaign!

## 🚨 Troubleshooting

**Video won't upload to TikTok:**
- Check file size (max 287 MB)
- Check duration (max 10 min, you should be at 15s)
- Try compressing video in CapCut export settings

**No views after 1 hour:**
- Wait 3 hours (TikTok algorithm takes time)
- Check if video is stuck in review (TikTok notification)
- Ensure hashtags aren't banned (#petportrait is safe)

**Bio link doesn't work:**
- TikTok requires 1,000 followers for clickable links
- Alternative: Put link in first comment
- Alternative: Use "Website" field in profile

**No website traffic:**
- Check Google Analytics UTM tracking
- Ensure link is correct in bio/comment
- Give it 24 hours - people save videos and click later

## 🎉 Next Steps After First Post

1. **Wait 24 hours** - Don't panic if views are slow at first
2. **Review metrics at 10 AM next day** - Log final 24h numbers
3. **Post second video at 9 AM** - Follow calendar for Day 1 evening or Day 2 morning
4. **Analyze what worked** - High engagement? Good comments? Website traffic?
5. **Adjust next video** - If hook worked, create variant. If failed, try different hook.

## 📊 Week 1 Checklist

- [ ] Day 1: Post morning + evening videos
- [ ] Day 2: Post morning + evening videos
- [ ] Day 3: Post morning + evening videos
- [ ] Day 4: Post morning + evening videos
- [ ] Day 5: Post morning + evening videos
- [ ] Day 6: Post morning + evening videos
- [ ] Day 7: Post morning + evening videos
- [ ] Day 8: Review Week 1 analytics, decide which posts to boost

**Total Week 1:** 14 videos, 0 ad spend, pure organic testing.

## 💡 Pro Tips

1. **Batch film videos on Sunday** - Spend 3 hours creating 7-10 videos for the week
2. **Schedule posts using Later.com** - Auto-post at 9am/6pm PT
3. **Use TikTok's "Schedule" feature** - Built into app (requires Creator account)
4. **Save trending audio daily** - Spend 10 min on For You Page, save 3-5 sounds
5. **Reply to comments within 1 hour** - Boosts engagement, signals algorithm
6. **Cross-post to YouTube Shorts** - Same videos, different platform, extra reach
7. **DM pet influencers** - Offer free portrait for mention (worth more than $50 ad spend)

## 🔥 If Your First Post Goes Viral (50k+ views)

1. **Don't touch it** - Let it ride organically for 48 hours
2. **Create 3 variant videos** - Same hook, different images/styles
3. **Post variants over next 3 days** - Ride the momentum
4. **Boost original post** - $50/day TikTok Spark Ad
5. **Update website** - Add "As seen on TikTok" banner
6. **Email list** - If you have one, announce the viral post
7. **Prepare for traffic spike** - Check Vercel deploy limits, Stripe capacity

## 📞 Need Help?

- **Video editing:** Search "CapCut before after tutorial" on YouTube
- **Trending audio:** Check TikTok Creative Center daily
- **Engagement tactics:** Search "TikTok algorithm 2026" for latest tips
- **Ad setup:** TikTok Ads Manager has built-in tutorials

---

**You're ready! Post your first video at 9am PT tomorrow. Track at 10am. Adjust and repeat.**

🚀 Let's hit $1M.
