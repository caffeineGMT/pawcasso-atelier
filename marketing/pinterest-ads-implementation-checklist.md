# Pinterest Ads Implementation Checklist

**Campaign:** Pet Portrait Discovery Campaign
**Budget:** $1,000 | **Target CPA:** $35 | **Timeline:** 30 days

---

## Phase 1: Technical Setup (Day 1) ⚙️

### Pinterest Account Setup
- [ ] Create Pinterest Business account at [pinterest.com/business/create](https://www.pinterest.com/business/create)
- [ ] Complete business profile:
  - [ ] Business name: "Pawcasso Atelier"
  - [ ] Website: https://pawcasso-atelier.vercel.app
  - [ ] Description: "Custom AI-generated pet portraits in 16+ artistic styles"
  - [ ] Upload logo as profile picture
- [ ] Apply for Pinterest Ads Manager access
- [ ] Set up billing (add credit card)

### Domain Verification
- [ ] Go to Settings → Claimed accounts → Claim website
- [ ] Copy HTML verification tag
- [ ] **ACTION:** Update `website/src/app/layout.tsx` line 159:
  ```tsx
  <meta name="p:domain_verify" content="YOUR_CODE_HERE" />
  ```
- [ ] Deploy to Vercel
- [ ] Click "Verify" in Pinterest dashboard
- [ ] ✅ Confirm verification successful

### Pinterest Tag Installation
- [ ] Get Pinterest Tag ID from Ads Manager → Conversions
- [ ] Add to `.env.local`:
  ```env
  NEXT_PUBLIC_PINTEREST_TAG_ID=2612345678901
  ```
- [ ] Add to Vercel environment variables:
  - [ ] Go to Vercel project settings
  - [ ] Environment Variables
  - [ ] Add `NEXT_PUBLIC_PINTEREST_TAG_ID`
  - [ ] Deploy to production
- [ ] Install [Pinterest Tag Helper Chrome Extension](https://chrome.google.com/webstore/detail/pinterest-tag-helper/jpbhncllcfkbmllnkoplijgfbhkjfplc)
- [ ] Visit your website and verify Tag firing (green checkmark)
- [ ] Test events:
  - [ ] PageVisit event on homepage
  - [ ] AddToCart event when uploading pet photo
  - [ ] Checkout event when clicking "Proceed to Checkout"

### Rich Pins Validation
- [ ] Go to [Pinterest Rich Pins Validator](https://developers.pinterest.com/tools/url-debugger/)
- [ ] Enter URL: `https://pawcasso-atelier.vercel.app/order`
- [ ] Click "Validate"
- [ ] ✅ Confirm shows "Product Pin" with:
  - [ ] Price: $9.00
  - [ ] Currency: USD
  - [ ] Availability: In Stock
- [ ] Apply for Rich Pins approval (automatic for Product Pins)
- [ ] ✅ Confirm Rich Pins approved

---

## Phase 2: Creative Production (Day 2-3) 🎨

### Pin Creative Assets
Create 8 Pinterest pins at 1000×1500px (2:3 aspect ratio):

#### Pin 1: Cat Vermeer Hero ⭐ (Primary)
- [ ] Use `gallery/cat_vermeer.webp` as main image
- [ ] Add text overlay: "Transform Your Pet Into Art"
- [ ] Subtext: "Custom AI Pet Portraits from $9"
- [ ] Include logo (small, bottom corner)
- [ ] Export as `pinterest-pin-1-cat-vermeer.png`

#### Pin 2: Multi-Style Grid
- [ ] Create 2×3 grid with 6 different styles:
  - [ ] Renaissance (cat_vermeer)
  - [ ] Felt (shiba_inu_felt_portrait)
  - [ ] Imperial (alfie_imperial_portrait)
  - [ ] Border Collie (border_collie_portrait)
  - [ ] Pomeranian (pomeranian_portrait_final)
  - [ ] Golden Retriever (golden_retriever_portrait_square)
- [ ] Label each with style name
- [ ] Headline: "Which Style Suits Your Pet?"
- [ ] Export as `pinterest-pin-2-style-grid.png`

#### Pin 3: Customer Testimonial
- [ ] Use before/after layout
- [ ] Add 5-star rating graphic
- [ ] Customer quote: "Absolutely stunning! My cat looks like royalty."
- [ ] Social proof: "Join 2,847 Happy Pet Parents"
- [ ] Export as `pinterest-pin-3-testimonial.png`

#### Pin 4: Interior Design Context
- [ ] Mockup of portrait on living room wall (use Smartmockups or Placeit)
- [ ] Use cat_vermeer or border_collie portrait
- [ ] Headline: "Elevate Your Space With Pet Art"
- [ ] Subtext: "$9 - 24 Hour Delivery"
- [ ] Export as `pinterest-pin-4-wall-display.png`

#### Pin 5: Gift Guide Pin
- [ ] Gift-wrapped portrait visual
- [ ] Headline: "Perfect Gift for Pet Lovers"
- [ ] List occasions: Birthday, Mother's Day, Memorial
- [ ] CTA: "Order Yours Today"
- [ ] Export as `pinterest-pin-5-gift-guide.png`

#### Pin 6: Process Explainer
- [ ] 3-step visual: Upload → Choose Style → Receive Art
- [ ] Use icons + short text for each step
- [ ] Headline: "Get Your Portrait in 3 Easy Steps"
- [ ] Export as `pinterest-pin-6-process.png`

#### Pin 7: Urgency/Retargeting
- [ ] Bold headline: "Still Deciding?"
- [ ] Highlight limited-time aspect or guarantee
- [ ] Strong CTA: "Order Now - 24h Delivery Guaranteed"
- [ ] Social proof counters
- [ ] Export as `pinterest-pin-7-urgency.png`

#### Pin 8: Value Proposition
- [ ] Headline: "Why Choose Pawcasso?"
- [ ] 4-6 bullet points with icons:
  - ✨ 16+ artistic styles
  - ⚡ 24-hour delivery
  - 💰 Starting at just $9
  - 💯 Money-back guarantee
  - 🎨 Unlimited revisions
  - 💝 Perfect for gifts
- [ ] Export as `pinterest-pin-8-value-prop.png`

### Design Tools Setup
Choose one:
- [ ] **Canva:** Sign up for Canva Pro, use Pinterest Pin templates
- [ ] **Figma:** Create 1000×1500px artboards, design custom pins
- [ ] **Adobe Express:** Use Pinterest templates, auto-resize

### Design Assets Needed
- [ ] Logo file (SVG or PNG with transparency)
- [ ] Brand colors: Gold (#F4E4C1), Black (#000000), White (#FFFFFF)
- [ ] Gallery images (already have WebP files)
- [ ] Icons for features (download free icon pack from Flaticon or Noun Project)

---

## Phase 3: Campaign Creation (Day 3-4) 📊

### Campaign Setup in Pinterest Ads Manager

#### Campaign Level
- [ ] Go to [Pinterest Ads Manager](https://ads.pinterest.com/)
- [ ] Click "Create Campaign"
- [ ] Campaign objective: **Conversions**
- [ ] Campaign name: "Pet Portrait Discovery - Q1 2026"
- [ ] Campaign status: **Active**
- [ ] Budget type: Choose one:
  - [ ] Lifetime budget: $1,000
  - [ ] Daily budget: $33.33/day for 30 days
- [ ] Click "Continue"

#### Ad Group 1: Pet Lovers - Broad

**Basic Settings:**
- [ ] Ad group name: "Pet Lovers - Broad"
- [ ] Conversion event: Select "Checkout" (or create "Portrait Purchase" conversion)
- [ ] Budget: $13.33/day
- [ ] Bid strategy: **Maximum delivery** (switch to Target CPA after learning phase)
- [ ] Schedule: Start immediately, end in 30 days

**Targeting:**
- [ ] Location: United States, Canada, United Kingdom, Australia
- [ ] Language: English
- [ ] Gender: All genders
- [ ] Age: 25-54
- [ ] Device: All devices

**Interests:** (Add these)
- [ ] Pets
- [ ] Pet supplies
- [ ] Dog breeds
- [ ] Cat breeds
- [ ] Pet photography
- [ ] Pet portraits
- [ ] Custom pet gifts
- [ ] Pet memorial

**Keywords:** (Broad match)
- [ ] pet portrait
- [ ] custom dog portrait
- [ ] custom cat portrait
- [ ] pet painting
- [ ] personalized pet gift
- [ ] dog art
- [ ] cat art
- [ ] pet memorial gift
- [ ] pet lover gift
- [ ] unique pet gift

**Placement:**
- [ ] ✅ Browse (home feed)
- [ ] ✅ Search results
- [ ] ✅ Related Pins
- [ ] ❌ Video feeds (unless using video pins)

- [ ] Click "Continue to Ads"

**Create Ads (3 variations):**
- [ ] Upload Pin 1 (Cat Vermeer)
  - [ ] Pin title: "Custom AI Pet Portrait - 16 Artistic Styles - From $9"
  - [ ] Pin description: [Use description from campaign guide]
  - [ ] Destination URL: `https://pawcasso-atelier.vercel.app/order?utm_source=pinterest&utm_medium=cpc&utm_campaign=pet_lovers_broad&utm_content=cat_vermeer`
- [ ] Upload Pin 2 (Style Grid)
  - [ ] Pin title: "Which Art Style Suits Your Pet? 16+ Styles Available"
  - [ ] Pin description: [Custom description]
  - [ ] Destination URL: `...utm_content=style_grid`
- [ ] Upload Pin 3 (Testimonial)
  - [ ] Pin title: "2,847 Happy Pet Parents Love Pawcasso Portraits"
  - [ ] Pin description: [Custom description]
  - [ ] Destination URL: `...utm_content=testimonial`

#### Ad Group 2: Home Decor Enthusiasts

**Basic Settings:**
- [ ] Ad group name: "Home Decor Enthusiasts"
- [ ] Conversion event: Checkout
- [ ] Budget: $13.33/day
- [ ] Bid strategy: Maximum delivery
- [ ] Schedule: Start immediately, 30 days

**Targeting:**
- [ ] Location: US, CA, UK, AU
- [ ] Language: English
- [ ] Gender: All genders
- [ ] Age: 30-65
- [ ] Household Income: $75,000+ (if available)

**Interests:**
- [ ] Home decor
- [ ] Interior design
- [ ] Wall art
- [ ] Gallery wall
- [ ] Personalized home decor
- [ ] Custom wall art
- [ ] Unique gifts
- [ ] Handmade gifts

**Keywords:**
- [ ] wall art ideas
- [ ] gallery wall
- [ ] personalized wall art
- [ ] custom art prints
- [ ] unique wall decor
- [ ] pet themed decor
- [ ] animal art prints
- [ ] home office decor
- [ ] living room wall art

**Create Ads (3 variations):**
- [ ] Upload Pin 4 (Wall Display)
- [ ] Upload Pin 5 (Gift Guide)
- [ ] Upload Pin 6 (Process Explainer)
  - [ ] Set titles, descriptions, UTM parameters

#### Ad Group 3: Retargeting - Site Visitors

**Basic Settings:**
- [ ] Ad group name: "Retargeting - Site Visitors"
- [ ] Budget: $6.67/day
- [ ] Bid strategy: Maximum delivery
- [ ] Target CPA: $30 (after learning)

**Targeting:**
- [ ] Audience type: **Custom audiences**
- [ ] Create new audience: "All Website Visitors - 30 days"
  - [ ] Source: Pinterest Tag
  - [ ] Event: Page visit
  - [ ] Lookback window: 30 days
- [ ] Create audience: "Order Page Visitors - 60 days"
  - [ ] URL contains: `/order`
  - [ ] Lookback: 60 days
- [ ] Exclude: "Past Purchasers" (create after first conversions)

**Create Ads (2 variations):**
- [ ] Upload Pin 7 (Urgency)
- [ ] Upload Pin 8 (Value Prop)

#### Campaign Review
- [ ] Review all ad groups and targeting
- [ ] Verify budgets total $33.33/day
- [ ] Confirm conversion tracking setup
- [ ] Check all UTM parameters correct
- [ ] ✅ **Click "Publish Campaign"**

---

## Phase 4: Launch & Monitor (Day 4-7) 📈

### Pre-Launch Checklist
- [ ] Pinterest Tag verified firing on all pages
- [ ] Rich Pins showing correctly
- [ ] All 8 pins uploaded and approved
- [ ] UTM tracking parameters set correctly
- [ ] Conversion events created in Pinterest
- [ ] Billing method verified
- [ ] Campaign budget confirmed: $1,000 total

### Launch Day (Day 4)
- [ ] 🚀 Launch campaign at 9am PT (peak Pinterest time)
- [ ] Within first hour:
  - [ ] Verify ads showing impressions
  - [ ] Check Pinterest Tag Helper for events
  - [ ] Test clicking your own ad (check UTM params in Analytics)
- [ ] Within first 3 hours:
  - [ ] Check impressions >100
  - [ ] Verify clicks >5
  - [ ] Confirm no disapproved pins
- [ ] End of Day 1:
  - [ ] Log impressions, clicks, spend
  - [ ] Check for any conversion events
  - [ ] Verify CPC reasonable (<$3)

### Daily Monitoring (Days 4-7)
Monitor DAILY for first week:

**Metrics to Check:**
- [ ] Total spend (should be ~$33/day)
- [ ] Impressions (target: 7,000-10,000/day)
- [ ] Clicks (target: 250-350/day)
- [ ] CTR (target: >0.5%)
- [ ] Conversions
- [ ] CPA (track toward $35)

**Red Flags - Pause if:**
- [ ] Any pin CTR <0.2% after 2,000 impressions
- [ ] Any pin CPC >$5 consistently
- [ ] Any pin CPA >$60 after 20 clicks
- [ ] Campaign spending >$50/day (budget pacing issue)

**Green Flags - Scale if:**
- [ ] Pin CTR >1%
- [ ] Pin CPA <$30
- [ ] High save rate (>5%)
- [ ] Good engagement rate

---

## Phase 5: Week 2 Optimization 🔧

### Learning Phase Review (After 7 days)
- [ ] Check if ad groups exited learning phase
- [ ] Analyze performance by:
  - [ ] Ad group (which targeting works best?)
  - [ ] Individual pins (which creative wins?)
  - [ ] Demographics (age/gender breakdown)
  - [ ] Placement (browse vs search)

### Optimizations to Make:
- [ ] **Pause underperformers:**
  - [ ] Pins with CPA >$50
  - [ ] Pins with CTR <0.3%
  - [ ] Pins with no conversions after $100 spend
- [ ] **Create new variations:**
  - [ ] 3-5 new pins based on winning themes
  - [ ] Test different headlines
  - [ ] Test different images
- [ ] **Adjust targeting:**
  - [ ] Add negative keywords if getting irrelevant clicks
  - [ ] Narrow age range if one segment converts better
  - [ ] Exclude low-performing placements
- [ ] **Switch bidding strategy:**
  - [ ] Change to "Target CPA" bidding
  - [ ] Set target: $35
  - [ ] Let Pinterest optimize for conversions

---

## Phase 6: Week 3 Scale & Test 📊

### If Campaign is Profitable (CPA ≤$35):
- [ ] Increase daily budget by 20%
- [ ] Launch 5 new pin variations
- [ ] Test video pin (create short animation)
- [ ] Expand targeting:
  - [ ] Add new interest categories
  - [ ] Test broader keywords
  - [ ] Try automatic targeting

### If Campaign Needs Work (CPA >$35):
- [ ] Audit landing page (order page):
  - [ ] Check mobile load speed
  - [ ] Improve trust signals
  - [ ] Simplify form if needed
- [ ] Refine targeting:
  - [ ] Exclude poorly performing demographics
  - [ ] Focus on best-performing interests
  - [ ] Remove low-converting keywords
- [ ] Refresh creative:
  - [ ] Test new angles (testimonials, urgency)
  - [ ] Improve visual hierarchy
  - [ ] Test different aspect ratios

### Advanced Tactics:
- [ ] Create lookalike audience (if 50+ conversions)
- [ ] Set up dynamic retargeting
- [ ] Test Idea Pins (organic multi-page pins)
- [ ] Apply for Pinterest Shopping catalog

---

## Phase 7: Week 4 Analysis & Report 📋

### Final Campaign Report (Day 30)
- [ ] Export campaign data (CSV)
- [ ] Calculate final metrics:
  - [ ] Total spend: $_____
  - [ ] Total conversions: _____
  - [ ] Final CPA: $_____
  - [ ] CTR: _____%
  - [ ] Total clicks: _____
  - [ ] Total impressions: _____
  - [ ] ROAS: _____%
  - [ ] Revenue: $_____

### Performance Analysis:
- [ ] **By Ad Group:**
  - [ ] Which targeting strategy won?
  - [ ] Best performing interests?
  - [ ] Demographics breakdown
- [ ] **By Creative:**
  - [ ] Top 3 performing pins
  - [ ] Worst 3 performing pins
  - [ ] Common elements in winners
- [ ] **By Time:**
  - [ ] Best days of week
  - [ ] Best times of day
  - [ ] Weekly trends

### Learnings Document:
- [ ] What worked well?
- [ ] What didn't work?
- [ ] Unexpected findings?
- [ ] Recommendations for month 2

### Month 2 Planning:
- [ ] If profitable: Plan budget increase
- [ ] If break-even: Continue optimizing
- [ ] If unprofitable: Diagnose issues or pause

---

## Organic Pinterest Bonus Checklist 🌿

While paid ads run, build organic presence:

### Profile Optimization
- [ ] Create Pinterest business profile (@pawcassoatelier)
- [ ] Upload profile photo (logo)
- [ ] Write compelling bio (155 characters)
- [ ] Add website link
- [ ] Verify website

### Board Creation (Create 5-7 boards)
- [ ] "Pet Portrait Gallery" - All your work
- [ ] "Renaissance Pets" - Renaissance style
- [ ] "Modern Pet Art" - Contemporary styles
- [ ] "Pet Memorial Tributes" - Memorial focus
- [ ] "Customer Favorites" - Best sellers
- [ ] "Home Decor Inspiration" - Context shots
- [ ] "Pet Photography Tips" - Value-add content

### Content Strategy
- [ ] Pin 5-10 times per week
- [ ] Use Pinterest SEO keywords
- [ ] Create 2-3 Idea Pins per month
- [ ] Repin relevant pet/decor content
- [ ] Engage with 10-20 pins daily (comment/save)

### Community Building
- [ ] Follow 100 pet-related accounts
- [ ] Follow 50 home decor accounts
- [ ] Join 5-10 group boards
- [ ] Engage with followers' pins

---

## Success Metrics Tracker 📊

### Week 1 Goals:
- [ ] ✅ Campaign launched successfully
- [ ] ✅ 50,000+ impressions
- [ ] ✅ 300+ clicks (0.6% CTR)
- [ ] ✅ 3-5 conversions
- [ ] ✅ CPA trending <$40

### Week 2 Goals:
- [ ] ✅ 100,000+ total impressions
- [ ] ✅ 700+ total clicks
- [ ] ✅ 7-10 conversions
- [ ] ✅ Target CPA bidding active
- [ ] ✅ 3+ new pin variations tested

### Week 3 Goals:
- [ ] ✅ 150,000+ total impressions
- [ ] ✅ 15+ conversions
- [ ] ✅ CPA ≤$35
- [ ] ✅ Retargeting audience >500

### Week 4 Goals:
- [ ] ✅ 28+ total conversions
- [ ] ✅ Final CPA ≤$35
- [ ] ✅ ROAS calculated
- [ ] ✅ Month 2 plan documented
- [ ] ✅ 1,000+ organic saves

---

## Quick Reference Links 🔗

| Resource | URL |
|----------|-----|
| Pinterest Ads Manager | https://ads.pinterest.com/ |
| Pinterest Business Hub | https://www.pinterest.com/business/hub/ |
| Rich Pins Validator | https://developers.pinterest.com/tools/url-debugger/ |
| Pinterest Tag Helper | [Chrome Extension](https://chrome.google.com/webstore/detail/pinterest-tag-helper/jpbhncllcfkbmllnkoplijgfbhkjfplc) |
| Creative Best Practices | https://business.pinterest.com/en/creative-best-practices |
| Pinterest Ads Specs | https://help.pinterest.com/en/business/article/promoted-pins-ad-specs |
| Pawcasso Gallery (Images) | `/website/public/gallery/` |
| Campaign Guide | `/marketing/pinterest-ads-campaign-guide.md` |

---

## Emergency Contact 🚨

**If Something Goes Wrong:**

| Issue | Solution |
|-------|----------|
| Tag not firing | Check `.env.local`, redeploy Vercel |
| High CPA | Pause campaign, review targeting |
| Disapproved pins | Review Pinterest ad policies, remove text overlays >20% |
| Low impressions | Increase bid, broaden targeting |
| Budget overspend | Set daily spend limit, enable alerts |
| No conversions | Check order page, verify Tag events |

**Support:**
- Pinterest Ads Support: https://help.pinterest.com/en/business/contact
- Pawcasso Help: [Your support email]

---

**Campaign Manager:** [Your Name]
**Start Date:** [Launch Date]
**End Date:** [+30 days]
**Last Updated:** March 18, 2026

🎯 **Goal:** 28+ conversions at ≤$35 CPA | $1,000 budget | 30 days

✅ **Status:** Ready to launch - Complete Phase 1 setup first!
