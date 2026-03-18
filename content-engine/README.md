# Pawcasso Atelier - TikTok/Instagram Reels Viral Content Engine

**Campaign Goal:** Drive traffic and sales to pawcasso-atelier.vercel.app through viral short-form video content.

**Target:** $1M annual revenue through aggressive content marketing and paid amplification.

## 🎯 Campaign Overview

- **Duration:** 30 days (March 19 - April 17, 2026)
- **Posting Frequency:** 2x daily (9am PT, 6pm PT)
- **Total Videos:** 50+ (batch-created from existing gallery + user submissions)
- **Platforms:** TikTok (primary), Instagram Reels (secondary)
- **Budget:** $1,500 ad spend ($50/day on top performers)
- **Target Audience:** Millennial/Gen Z Pet Parents, Gift Buyers, Pet Memorial Market

## 📁 Files Structure

```
content-engine/
├── calendar-30day.json         # Complete 30-day content calendar
├── video-scripts.json           # CapCut templates & batch production workflow
├── engagement-tracker.json      # Track views, engagement, conversions
├── ad-spend-tracker.json        # Budget allocation & ROI tracking
├── cli.sh                       # CLI tool for managing content
└── README.md                    # This file
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Install jq for JSON parsing (CLI tool dependency)
brew install jq

# Make CLI executable
chmod +x content-engine/cli.sh
```

### 2. View Today's Content
```bash
cd /Users/michaelguo/pawcasso-atelier/content-engine
./cli.sh today
```

### 3. Check Available Images
```bash
./cli.sh images
```

### 4. Generate Video Batch
```bash
./cli.sh batch
```

## 📅 30-Day Content Calendar

### Week 1 (Days 1-7): Organic Testing
- **Goal:** Test hooks, video templates, and timing
- **Ad Spend:** $0 (organic only)
- **Key Themes:** Launch day viral hooks, style showcases, comparison content
- **Expected:** Identify top 3 performing hooks/templates

**Sample Hooks:**
- "POV: Your dog becomes a Renaissance painting for $9"
- "I turned my chihuahua into a $10K oil painting"
- "Etsy: $500 + 6 weeks. Me: $9 + 24 hours"

### Week 2 (Days 8-14): Boost Winners
- **Goal:** Amplify top performers from Week 1
- **Ad Spend:** $350 ($50/day on 2-3 posts)
- **Key Themes:** Gift giving, nostalgia, behind-the-scenes

### Week 3 (Days 15-21): Scale & Optimize
- **Goal:** Double down on proven winners
- **Ad Spend:** $500 ($70/day - 60% winners, 40% tests)
- **Key Themes:** User-generated content, testimonials, viral challenges

### Week 4 (Days 22-30): Maximum Reach
- **Goal:** All-in on viral content before campaign end
- **Ad Spend:** $650 ($100/day on highest converters)
- **Key Themes:** Seasonal tie-ins, limited-time offers, FOMO

## 🎬 Video Production

### CapCut Templates

**6 Core Templates:**
1. **Before/After Split Screen** (15 videos) - Pet photo vs AI portrait
2. **Dramatic Zoom Reveal** (10 videos) - Slow zoom on portrait with emotional music
3. **Fast-Paced Montage** (8 videos) - Showcase multiple styles quickly
4. **Museum Wall Mockup** (7 videos) - Portrait hanging in gallery
5. **Game Boy Retro Effect** (5 videos) - Pixel art with nostalgic filter
6. **Reaction Style** (5 videos) - Selfie reaction to seeing portrait

### Batch Production Workflow

**Total Time:** 4-6 hours for 50 videos

1. **Gather Assets** (30 min)
   - 14 existing gallery images
   - 36 user-submitted pet photos (collect via Instagram DM, website form)

2. **Create CapCut Templates** (1 hour)
   - Build 6 templates with placeholders for images/text
   - Save as reusable presets

3. **Batch Process** (2-3 hours)
   - Import template, swap images, customize text
   - Export in batches of 10 to avoid crashes

4. **Add Trending Audio** (1 hour)
   - Check TikTok Creative Center for current trending sounds
   - Replace placeholder audio tracks
   - Ensure audio matches video mood (emotional, upbeat, nostalgic)

5. **Quality Check** (30 min)
   - Watch each video at 2x speed
   - Fix any glitches or text errors
   - Ensure CTA is clear

6. **Export & Organize** (30 min)
   - Export at 1080x1920, 30fps, MP4
   - Name files: `YYYYMMDD_slot_hookKeyword_template.mp4`
   - Upload to Google Drive for scheduling

## 📊 Engagement Tracking

### Metrics to Track Daily

**Engagement:**
- Views
- Likes
- Comments
- Shares
- Saves
- Engagement Rate = (Likes + Comments + Shares + Saves) / Views * 100

**Conversions:**
- Website visits (from bio link)
- Order page visits
- Add to cart
- Purchases
- Revenue attributed

### Performance Categories

| Category | Views (48h) | Action |
|----------|-------------|--------|
| **Viral** | 100k+ | Boost with $100/day, create variants |
| **High** | 50k-100k | Boost with $50/day |
| **Medium** | 10k-50k | Monitor, consider $20/day boost |
| **Baseline** | 5k-10k | Keep organic |
| **Underperforming** | <5k | Analyze failure, adjust next post |

### Using the CLI to Track

```bash
# Log engagement for a post
./cli.sh track 20260319_morning 15000 1200 85 340 520

# Output shows:
# - Engagement rate calculation
# - Performance category
# - Recommended action (boost, monitor, adjust)
```

### Daily Tracking Routine

**10:00 AM PT (1 hour after morning post):**
1. Check TikTok Analytics
2. Check Instagram Insights
3. Log 24h metrics for previous day's posts
4. Update `engagement-tracker.json`
5. Check Google Analytics for website traffic spikes

**Weekly Review (Sundays):**
1. Calculate average engagement rate
2. Identify top 3 performing hooks
3. Identify top 3 performing templates
4. Identify top 3 performing styles (Pixar, Renaissance, etc.)
5. Decide which posts to boost next week

## 💰 Ad Spend Strategy

### Budget Allocation

**Total:** $1,500 over 30 days

- **Week 1:** $0 (organic testing)
- **Week 2:** $350 (boost top 3 winners)
- **Week 3:** $500 (scale winners, test new)
- **Week 4:** $650 (all-in on converters)

### When to Boost a Post

**Immediate Boost Triggers:**
- 50k+ views in first 24 hours
- Engagement rate >12% in first 6 hours
- 50+ website visits organically in first day
- High purchase intent comments ("where can I buy?", "link?", "take my money")

### Ad Platform Setup

**TikTok Spark Ads:**
1. Go to TikTok Ads Manager
2. Create Campaign → Objective: "Traffic"
3. Select "Spark Ads" → Choose organic post to promote
4. Set budget: $50/day
5. Targeting: Women 25-45, interests: Pet owners, Home decor, Etsy shoppers
6. Destination: `https://pawcasso-atelier.vercel.app/order?utm_source=tiktok&utm_medium=paid`

**Instagram Reels Ads:**
1. Go to Meta Ads Manager
2. Create Campaign → Objective: "Traffic"
3. Placements: Instagram Reels only
4. Audience: Lookalike 1% of website visitors
5. Budget: $30/day
6. Destination: Same URL with `utm_source=instagram`

### KPIs

- **Target ROAS:** 3.0+ (spend $1, make $3)
- **Target CPA:** $15 or less
- **Target CTR:** 2%+
- **Target Conversion Rate:** 5%+
- **Break-even CPA:** $6 (first purchase only)
- **Acceptable CPA with LTV:** $20 (accounting for repeat orders)

### Track Ad Spend

```bash
./cli.sh adspend
# Shows: Total spent, revenue, ROAS, customers acquired, avg CPA
```

## 🎣 Viral Hook Library

### Top Performing Hook Patterns

1. **POV Format**
   - "POV: Your [pet] becomes a [style]"
   - "POV: You finally found affordable custom pet art"

2. **Transformation**
   - "I turned my [pet] into a $10K [art type]"
   - "From [before] to [after] in 24 hours"

3. **Comparison**
   - "Etsy: $500 + 6 weeks. Me: $9 + 24 hours"
   - "What $500 gets you vs what $9 gets you"

4. **Cultural Reference**
   - "If [famous artist/studio] made pet portraits"
   - "Your [pet] as a [character/thing]"

5. **Emotional/Memorial**
   - "Made my friend cry with this $9 gift"
   - "Best $9 gift for dog moms"
   - Use sparingly, only when authentic

### View All Hooks

```bash
./cli.sh hooks
# Lists all 16+ hook templates from calendar
```

## 🎵 Trending Audio Strategy

### Sources

1. **TikTok Creative Center**
   - https://ads.tiktok.com/business/creativecenter/inspiration/popular/music/pc/en
   - Check daily for trending sounds

2. **Instagram Reels Trending**
   - Open Instagram → Reels tab → Browse trending audio

3. **Epidemic Sound (Licensed)**
   - https://www.epidemicsound.com
   - Safe for commercial use, no copyright issues

4. **Manual Monitoring**
   - Spend 15 min/day scrolling For You Page
   - Save sounds you hear 3+ times
   - Note the vibe (emotional, upbeat, nostalgic)

### Audio Categories

- **Emotional Piano** → Tributes, reveals, gift giving
- **Upbeat Dance** → Transformations, celebrations
- **Lo-fi Chill** → Cozy aesthetics, felt art
- **Classical Orchestral** → Renaissance, museum vibes
- **Chiptune Retro** → Pixel art, gaming nostalgia
- **Wholesome/Cute** → Pixar, adorable pets
- **Meme Sounds** → Comparisons, humor

### Rotation Strategy

- Week 1: Emotional/wholesome (memorial, gift)
- Week 2: Upbeat dance beats (transformations)
- Week 3: Nostalgia sounds (90s kids, retro)
- Week 4: Meme sounds (comparison, humor)
- **Ongoing:** Rotate top 5 trending sounds every 3 days

```bash
./cli.sh audio
# Shows trending audio sources and links
```

## 🎯 Target Audiences

### Primary: Millennial/Gen Z Pet Parents (25-40)
- Own dogs or cats
- Active on TikTok/Instagram
- Value affordable, instant gratification
- Share pet content regularly

### Secondary: Pet Memorial/Tribute Market
- Lost a pet recently (high emotional value)
- Willing to pay more for sentimental items
- Share memorial content
- **Hook carefully:** "Made my friend cry with this" (authentic only)

### Tertiary: Gift Buyers
- Looking for unique, affordable gifts
- Birthdays, Mother's Day, Christmas
- Dog mom/cat dad gifts
- Last-minute shoppers (24-hour delivery is key)

### Amplifiers: Pet Influencers & Content Creators
- Already creating pet content
- Could feature our portraits in their videos
- Reach: 10k-100k followers
- **Strategy:** DM top 20 pet accounts, offer free portrait in exchange for mention

## 📈 Optimization Guidelines

### If Pixar 3D Outperforms
→ Increase Pixar posts to 40% of content (currently 20%)

### If Morning Slot Underperforms
→ Shift one post to lunch (12pm PT) or late night (9pm PT)

### If Memorial Hooks Spike Engagement
→ Create dedicated series, but space out (max 1 per week to avoid fatigue)

### If TikTok Beats Instagram Reels by 2x
→ Prioritize TikTok for new content, cross-post to Reels after 24h

### If Template 1 Gets 2x Views vs Others
→ Use Template 1 for 60% of batch production

### Real-Time Adjustments

- Check performance every 6 hours for first 24h
- If a post is trending upward (views increasing hour-over-hour), boost immediately
- If engagement rate drops below 2%, pause ad spend
- If negative comments appear, respond authentically and pause boosting

## 🛠️ CLI Tool Reference

```bash
# Show today's scheduled posts
./cli.sh today

# List all gallery images with metadata
./cli.sh images

# Show video batch generation plan
./cli.sh batch

# Track engagement for a post
./cli.sh track <post_id> <views> <likes> <comments> <shares> <saves>
# Example: ./cli.sh track 20260319_morning 15000 1200 85 340 520

# Show ad spend summary
./cli.sh adspend

# List viral hook templates
./cli.sh hooks

# Show trending audio sources
./cli.sh audio

# Show help
./cli.sh help
```

## 📝 Daily Workflow

### Morning (9:00 AM PT)

1. **Post Morning Content**
   - Upload video to TikTok
   - Upload same video to Instagram Reels
   - Use caption from calendar
   - Add trending audio
   - Post with CTA: "Link in bio 👆"

2. **Check Yesterday's Performance (10:00 AM PT)**
   - Log into TikTok Analytics
   - Log into Instagram Insights
   - Record metrics using `./cli.sh track`
   - Update engagement tracker JSON

3. **Decide on Ad Spend**
   - If yesterday's post hit 50k+ views → boost with $50/day
   - If engagement rate >12% → boost immediately
   - Set up TikTok Spark Ad or Instagram Reels Ad

### Evening (6:00 PM PT)

1. **Post Evening Content**
   - Same process as morning
   - Different hook/template to test variety

2. **Monitor Morning Post (7:00 PM PT)**
   - Check 10-hour metrics
   - If trending upward, consider increasing ad budget
   - Respond to top comments

### End of Day (10:00 PM PT)

1. **Review Day's Performance**
   - Total views across both posts
   - Website traffic spike?
   - Any purchases attributed to social?
   - Note learnings for tomorrow

2. **Prep Tomorrow's Content**
   - Review calendar for next day
   - Check trending audio (replace if needed)
   - Ensure videos are uploaded to scheduler

## 🎯 Success Metrics

### Week 1 Goals (Organic)
- 10k+ avg views per post
- 5%+ avg engagement rate
- 500+ website visits from social
- 10+ purchases attributed to TikTok/Reels

### Week 2 Goals (Boosted)
- 30k+ avg views per post
- 7%+ avg engagement rate
- 1,500+ website visits
- 40+ purchases
- ROAS >2.0

### Week 3 Goals (Scaled)
- 50k+ avg views per post
- 1+ viral post (100k+ views)
- 3,000+ website visits
- 100+ purchases
- ROAS >3.0

### Week 4 Goals (Maximum Reach)
- 75k+ avg views per post
- 2-3 viral posts
- 5,000+ website visits
- 200+ purchases
- ROAS >4.0

### End of Campaign (30 Days)
- **Total Views:** 2M+
- **Total Followers:** 10k+ (TikTok + Instagram combined)
- **Total Revenue:** $5,000+
- **Total Ad Spend:** $1,500
- **Campaign ROAS:** 3.3+ ($5k revenue / $1.5k spend)
- **Customers Acquired:** 500+
- **Avg CPA:** $3
- **Key Learnings:** Document top 3 hooks, top 3 templates, top 3 styles for future campaigns

## 🚨 Contingency Plans

### If All Ads Fail (ROAS <1.0)
- Pause all paid ads
- Double down on organic content
- Reach out to pet influencers for collaborations/shoutouts
- Offer affiliate commission (20% per sale)

### If One Post Goes Mega Viral (500k+ views)
- Pause other ads
- Put all budget ($200/day) into amplifying the viral post
- Create 3-5 variant videos with same hook/style
- Post variants over next 3 days to ride momentum

### If Budget Runs Out Early
- Switch to pure organic
- Focus on engagement-bait content (polls, questions, "show me yours")
- Leverage UGC (repost customer photos with permission)

### If TikTok Account Gets Banned
- Immediately create backup account
- Cross-post all content to Instagram Reels as primary
- Appeal ban (usually shadowban, not full ban)
- Diversify to YouTube Shorts

## 📚 Resources

- **TikTok Creative Center:** https://ads.tiktok.com/business/creativecenter
- **Instagram Insights:** App → Profile → Insights
- **Epidemic Sound:** https://www.epidemicsound.com
- **CapCut Desktop:** https://www.capcut.com/
- **Google Analytics:** https://analytics.google.com
- **Stripe Dashboard:** https://dashboard.stripe.com

## 🎉 Next Steps

1. **Install jq:** `brew install jq`
2. **Review today's content:** `./cli.sh today`
3. **Start batch video production:** Follow workflow in `video-scripts.json`
4. **Collect user-submitted photos:** Via Instagram DM or website form
5. **Set up TikTok/Instagram Creator accounts** (already done at @pawcasso.atelier)
6. **Post first video tomorrow morning at 9am PT**
7. **Track engagement at 10am PT using CLI**
8. **Review Week 1 performance on Day 8**
9. **Boost top performers starting Week 2**
10. **Scale to $1M annual revenue** 🚀

---

**Built with:** Pure grit, AI magic, and a $9 price point that can't be beat.

**Maintained by:** Michael Guo (michaelguo@meta.com)

**Last updated:** 2026-03-18
