# Meta Ads Campaign Launch Guide
## Step-by-Step Setup in Ads Manager

**Estimated Setup Time:** 2-3 hours
**Prerequisites:**
- Meta Business Manager account
- Meta Pixel installed and verified
- Creative assets prepared
- Budget approved ($2,000)

---

## Phase 1: Pre-Launch Setup (30 minutes)

### Step 1: Verify Business Manager Setup
- [ ] Go to [Meta Business Manager](https://business.facebook.com/)
- [ ] Confirm you have Admin access
- [ ] Verify payment method is added (Settings → Payments)
- [ ] Check ad account is active and not restricted

### Step 2: Install Meta Pixel (if not done)
- [ ] Follow `tracking/TRACKING_SETUP_GUIDE.md`
- [ ] Verify Pixel is firing with Meta Pixel Helper extension
- [ ] Test all conversion events (PageView, ViewContent, InitiateCheckout, Purchase)

### Step 3: Upload Creative Assets
1. Go to [Ads Manager](https://business.facebook.com/adsmanager) → **Creative Hub**
2. Upload all images and videos:
   - Static Ad 1: Hero Cat Vermeer
   - Static Ad 2: Style Grid 2x2
   - Carousel Ad 1: 6 style images
   - Carousel Ad 2: 5 process cards
   - Video Ad: Slideshow (both 1:1 and 9:16 formats)
3. Name files clearly (e.g., `pawcasso_static_hero_cat`)

---

## Phase 2: Build Custom Audiences (20 minutes)

### Step 4: Create Website Custom Audiences
1. Go to **Audiences** → **Create Audience** → **Custom Audience**
2. Select **Website** as source
3. Select your Meta Pixel

**Audience 1: All Website Visitors (180 days)**
- Name: `Pawcasso - Website Visitors (180d)`
- Rule: `All website visitors` in the last **180 days**
- Click **Create Audience**

**Audience 2: Gallery Viewers (90 days)**
- Name: `Pawcasso - Gallery Viewers (90d)`
- Rule: `ViewContent` in the last **90 days**
- Refine by URL: Contains `/gallery`
- Click **Create Audience**

**Audience 3: Cart Abandoners (30 days)**
- Name: `Pawcasso - Cart Abandoners (30d)`
- Rule: `InitiateCheckout` in the last **30 days**
- Exclude: `Purchase` in the last **30 days**
- Click **Create Audience**

### Step 5: Create Instagram Engagement Audience
1. **Create Audience** → **Custom Audience**
2. Select **Instagram Account** as source
3. Select `@pawcasso.atelier` account
4. Choose: `People who engaged with your business`
5. Time period: **365 days**
6. Name: `Pawcasso - Instagram Engagers (365d)`
7. Click **Create Audience**

### Step 6: Create Lookalike Audiences
Wait 24-48 hours for custom audiences to populate (minimum 100 people).

Once populated:
1. Go to **Audiences** → Select `Pawcasso - Website Visitors (180d)`
2. Click **Create Lookalike**
3. Location: **United States**
4. Audience size: **1%** (most similar)
5. Name: `Pawcasso - LAL 1% Website Visitors (US)`
6. Click **Create Audience**

Repeat for:
- `Pawcasso - LAL 1% Instagram Engagers (US)`
- `Pawcasso - LAL 1% Website Visitors (CA)` (Canada)
- `Pawcasso - LAL 1% Instagram Engagers (CA)` (Canada)

---

## Phase 3: Campaign Setup (45 minutes)

### Step 7: Create Campaign
1. Go to **Ads Manager** → Click **+ Create**
2. Choose **Sales** as campaign objective (drives purchases)
3. Click **Continue**

**Campaign Settings:**
- Campaign Name: `Pawcasso Atelier - Pet Portrait Launch Q1 2026`
- Buying Type: **Auction**
- Campaign Objective: **Sales**
- Special Ad Categories: **None** (not applicable)
- Campaign Budget Optimization: **ON** ✅
- Campaign Budget: **$2,000**
- Campaign Duration: **30 days** (set start/end dates)
- Bid Strategy: **Lowest Cost with bid cap** → Set cap to **$40**
- Click **Next**

---

## Phase 4: Ad Set Setup (60 minutes)

### Step 8: Ad Set 1 - Lookalike Website Visitors

**Ad Set Name:** `Pawcasso - LAL Website Visitors - Warm`

**Conversion:**
- Pixel: Select your Pawcasso pixel
- Conversion Event: **Purchase**
- Attribution Setting: 7-day click, 1-day view

**Budget:** Leave blank (CBO handles this)

**Audience:**
- Location: United States, Canada, United Kingdom, Australia
- Age: **25-55**
- Gender: **All**
- Detailed Targeting:
  - **Include:** `Pawcasso - LAL 1% Website Visitors (US)` OR `Pawcasso - LAL 1% Website Visitors (CA)`
  - **Narrow Further:** Interests → Pets, Dog Lovers, Cat Lovers, Pet Adoption, Pet Photography
- Exclude: `Pawcasso - Purchasers (if you have conversions)`

**Placements:**
- Select **Advantage+ Placements** (recommended)
- OR **Manual Placements:** Facebook Feed, Instagram Feed, Instagram Stories, Instagram Reels, Facebook Reels

**Optimization:**
- Optimization for Ad Delivery: **Conversions**
- Conversion Event: **Purchase**
- Cost Control: Controlled by campaign CBO
- When Charged: **Impression**

Click **Next**

---

### Step 9: Ad Set 2 - Lookalike Instagram Engagers

**Ad Set Name:** `Pawcasso - LAL Instagram Engagers - Engaged`

**Conversion:** Same as Ad Set 1

**Budget:** Leave blank (CBO)

**Audience:**
- Location: United States, Canada, United Kingdom, Australia
- Age: **25-55**
- Gender: **All**
- Detailed Targeting:
  - **Include:** `Pawcasso - LAL 1% Instagram Engagers (US)` OR `Pawcasso - LAL 1% Instagram Engagers (CA)`
  - **Narrow Further:** Interests → Pet Gifts, Personalized Gifts, Custom Portraits, Etsy
- Exclude: `Pawcasso - Purchasers`

**Placements:**
- **Manual Placements:** Instagram Feed, Instagram Stories, Instagram Reels ONLY

**Optimization:** Same as Ad Set 1

Click **Next**

---

### Step 10: Ad Set 3 - Cold Broad Targeting

**Ad Set Name:** `Pawcasso - Cold Broad Pet Owners`

**Conversion:** Same as Ad Set 1

**Budget:** Leave blank (CBO)

**Audience:**
- Location: United States, Canada
- Age: **25-55**
- Gender: **All**
- Detailed Targeting:
  - **Include:** Pet Owners
  - **AND:** (Gift Shopping OR Home Decor OR Wall Art)
- Exclude: `Pawcasso - Website Visitors (180d)`, `Pawcasso - Purchasers`

**Placements:**
- **Manual Placements:** Facebook Feed, Instagram Feed ONLY (no Stories/Reels)

**Optimization:** Same as Ad Set 1

Click **Next**

---

## Phase 5: Create Ads (45 minutes)

### Step 11: Ad 1 - Static Hero (Cat Vermeer)

**Ad Name:** `Pawcasso - Static Hero Cat - Emotional Copy`

**Identity:**
- Facebook Page: Select your business page
- Instagram Account: `@pawcasso.atelier`

**Ad Setup:**
- Format: **Single Image**
- Upload: `pawcasso_static_hero_cat_1080x1080.jpg`

**Primary Text:**
```
Your pet isn't just a pet – they're family. Now you can immortalize them as a work of art.

Pawcasso Atelier uses AI to transform your pet's photo into stunning custom portraits in 30+ artistic styles. From Renaissance classics to Pixar-style 3D, choose the perfect style that captures their personality.

✨ 30+ art styles to choose from
🎨 High-resolution digital download
⚡ Fast turnaround (24-48 hours)
💰 Only $9 per portrait

Perfect for gifts, home decor, or simply celebrating the furry friend who brightens your day.
```

**Headline:** `Turn Your Pet into a Masterpiece – Just $9`

**Description:** `AI-generated custom pet portraits in 30+ artistic styles`

**Call to Action:** **Shop Now**

**Website URL:** `https://pawcasso-atelier.vercel.app/order`

**Display Link:** `pawcasso-atelier.vercel.app` (optional, cleaner URL)

**Tracking:**
- URL Parameters: `?utm_source=facebook&utm_medium=paid&utm_campaign=q1_2026_launch&utm_content=static_hero_cat`

Click **Publish** (or **Save as Draft** if not ready)

---

### Step 12: Ad 2 - Static Grid (Multiple Styles)

**Ad Name:** `Pawcasso - Static Grid Styles - Value Copy`

Follow same format as Ad 1, but use:
- **Image:** `pawcasso_static_grid_2x2_styles.jpg`
- **Primary Text:** (Value-Focused Variant from ad-copy-variants.json)
- **Headline:** `Custom AI Pet Portraits in 30+ Artistic Styles`
- **URL Parameters:** `utm_content=static_grid_styles`

---

### Step 13: Ad 3 - Carousel (Style Showcase)

**Ad Name:** `Pawcasso - Carousel 6 Styles - Style Variety`

**Ad Setup:**
- Format: **Carousel**
- Upload 6 images (1080x1080 each):
  1. Pixar 3D (alfie_portrait_final.webp)
  2. Needle Felt (border_collie_portrait_2048x2048.webp)
  3. Renaissance (cat_vermeer.webp)
  4. Pixel Art (chihuahua_portrait_16x9.webp - cropped)
  5. Vinyl Toy (shiba_inu_vinyl_toy_portrait_final.webp)
  6. Ink Wash (alfie_border_collie_portrait_2048x2048.webp)

**For Each Card:**
- **Headline:** [Style Name] + " - $9"
  - Card 1: "Pixar 3D - $9"
  - Card 2: "Needle Felt - $9"
  - etc.
- **Website URL:** `https://pawcasso-atelier.vercel.app/order?style=[style-name]`
- **Description:** One-line style description

**Primary Text:**
```
Can't decide on a style? We've got 30+ options.

From Pixar 3D to Renaissance classics, from Pixel Art to Needle Felt – there's a perfect style for every pet's personality.

Swipe through our most popular styles ➡️

🎨 30+ artistic styles
💵 Just $9 per portrait
⚡ 24-48 hour delivery
📥 High-res digital download

Your pet deserves to be immortalized in art. Which style speaks to you?
```

**Call to Action:** **Shop Now**

**URL Parameters:** `utm_content=carousel_6_styles`

---

### Step 14: Ad 4 - Carousel (Process/Story)

**Ad Name:** `Pawcasso - Carousel Process Story - How It Works`

Same format as Ad 3, but:
- Upload 5 process cards
- Use "Before/After Process" copy from ad-copy-variants.json
- **URL Parameters:** `utm_content=carousel_process`

---

### Step 15: Ad 5 - Video Slideshow

**Ad Name:** `Pawcasso - Video Slideshow 10 Styles - FOMO Copy`

**Ad Setup:**
- Format: **Single Video**
- Upload: `pawcasso_video_slideshow_feed_1080x1080.mp4` (for Feed placements)
- Upload: `pawcasso_video_slideshow_stories_1080x1920.mp4` (for Stories/Reels)
- **Video Thumbnail:** Choose frame with cat_vermeer.webp (most eye-catching)

**Primary Text:** (FOMO/Urgency Variant from ad-copy-variants.json)

**Headline:** `Your Dog Deserves to Be Art (Cat Too!)`

**Call to Action:** **Shop Now**

**URL Parameters:** `utm_content=video_slideshow`

**Video Settings:**
- Add Captions: **Auto-generate** (for sound-off viewing)
- Sound: **Default On**

---

## Phase 6: Review & Launch (15 minutes)

### Step 16: Pre-Launch Checklist
Review all settings:

**Campaign Level:**
- [ ] Objective: Sales ✅
- [ ] Budget: $2,000 for 30 days ✅
- [ ] CBO enabled ✅
- [ ] Bid cap: $40 CPA ✅

**Ad Set Level (all 3 ad sets):**
- [ ] Pixel selected and Purchase event chosen ✅
- [ ] Targeting parameters correct ✅
- [ ] No audience overlap > 30% ✅
- [ ] Placements appropriate ✅

**Ad Level (all 5 ads):**
- [ ] All creatives uploaded and previewed ✅
- [ ] Copy has no typos ✅
- [ ] UTM parameters added ✅
- [ ] Landing page URL correct ✅
- [ ] Facebook Page and Instagram account linked ✅

### Step 17: Check for Policy Violations
1. Click **Publish** → Ads will go into **Review**
2. Wait 15-30 minutes for approval
3. If rejected, check **Ad Policy** tab for reason
4. Fix and resubmit

### Step 18: Launch! 🚀
Once approved:
1. Ads will start running automatically
2. Monitor for first 2-3 hours to ensure delivery is working
3. Check that Pixel events are firing (Events Manager)

---

## Phase 7: Post-Launch Monitoring (Ongoing)

### Days 1-3: Learning Phase (DO NOT TOUCH)
Meta is gathering data. Avoid making changes.

**What to Monitor:**
- [ ] Impressions and Reach (should see steady growth)
- [ ] Link Clicks (CTR should be > 1%)
- [ ] Landing Page Views (check for drop-off)
- [ ] Purchases (conversions start coming in)
- [ ] CPA (may be high initially, should decrease)

**Daily Check (5 minutes):**
- Open Ads Manager
- Review **Campaigns** tab
- Check Spend, Results (Purchases), CPA
- If CPA > $70, pause worst-performing ad (but wait until Day 4)

### Days 4-7: Optimize
**Actions to take:**
- Pause underperforming ads (CPA > $60 and < 3 purchases)
- Increase budget on winning ad sets by 20%
- Test new headline variants on top performers

### Days 8-14: Scale
**Actions to take:**
- Duplicate winning ad sets (with fresh creative)
- Introduce new carousel concepts
- Consider expanding to UK/Australia if US/CA performing well

### Days 15-30: Iterate & Scale
**Actions to take:**
- Allocate 80% budget to top 2 ad sets
- Maintain 20% for testing new concepts
- Create Purchaser Lookalike Audience (if 50+ conversions)

---

## Performance Benchmarks

### Week 1 Expected Results
- Impressions: 150,000 - 250,000
- Link Clicks: 2,000 - 4,000
- CTR: 1.5% - 2.5%
- Purchases: 10-15
- CPA: $35 - $50 (learning phase)
- Spend: ~$500

### Week 2-4 Optimized Results
- CTR: 2.0% - 3.0%
- Purchases: 12-15 per week
- CPA: $35 - $42
- ROAS: 0.21 - 0.26

---

## Troubleshooting

### Ads Not Delivering
- Check account status (not restricted)
- Verify payment method is active
- Check audience size (should be > 1,000)
- Increase bid cap to $50 temporarily

### High CPA (> $60)
- Pause worst 1-2 ads
- Tighten targeting (age 30-50, US only)
- Refresh creative with UGC-style content
- Check landing page conversion rate (should be > 3%)

### Low CTR (< 1%)
- Test new headlines (more urgent/benefit-driven)
- Use brighter, more colorful creatives
- Add social proof ("500+ happy customers")
- Try video ads (typically higher CTR)

### Pixel Not Tracking Purchases
- Verify Pixel is on success page
- Check Test Events tool in Events Manager
- Ensure Stripe webhook is triggering Pixel
- Set up Conversions API as backup

---

## Budget Reallocation Strategy

If one ad set performs significantly better than others:

**Week 1-2:** Let CBO do its job, observe
**Week 3:** Manually allocate budget
- Top performer: 50%
- Second best: 30%
- Testing: 20%

**Week 4:** Scale winner
- Top performer: 70%
- Second best: 20%
- Testing: 10%

---

## Next Campaign Ideas

If this campaign succeeds (CPA < $40, 50+ conversions):

1. **Retargeting Campaign ($500):**
   - Target: Website visitors who didn't purchase
   - Creative: Testimonials, before/after, limited-time discount

2. **Pinterest Ads ($300):**
   - Pet owners love Pinterest
   - High-quality images perform well
   - Lower CPM than Facebook

3. **TikTok Ads ($500):**
   - Slideshow video content repurposed
   - Target 25-45 pet owners
   - Can achieve lower CPA ($25-35)

4. **Google Search Ads ($500):**
   - Target: "custom pet portrait", "AI pet art"
   - High intent, high conversion rate

---

## Success! 🎉

Once you hit 50+ purchases at $40 CPA:
- **Revenue:** $450 (50 × $9)
- **Ad Spend:** $2,000
- **ROAS:** 0.225 (not profitable yet, but validates demand)
- **Next Step:** Optimize landing page, test higher price points ($15-19), upsell framed prints

**Long-term goal:** Scale to $10K/month ad spend at $30 CPA = 333 orders/month = $3,000 revenue → Then add upsells to reach profitability.

Good luck! 🚀
