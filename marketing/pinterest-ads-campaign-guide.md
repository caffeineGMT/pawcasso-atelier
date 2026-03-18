# Pinterest Ads Campaign Guide - Pawcasso Atelier

**Campaign Name:** Pet Portrait Discovery Campaign
**Budget:** $1,000
**Target CPA:** $35
**Campaign Duration:** 30 days (test phase)
**Platform:** Pinterest Ads Manager

## Table of Contents
1. [Campaign Overview](#campaign-overview)
2. [Rich Pins Setup](#rich-pins-setup)
3. [Campaign Structure](#campaign-structure)
4. [Targeting Strategy](#targeting-strategy)
5. [Creative Assets](#creative-assets)
6. [Conversion Tracking](#conversion-tracking)
7. [Budget Allocation](#budget-allocation)
8. [Performance Monitoring](#performance-monitoring)

---

## Campaign Overview

### Why Pinterest for Pawcasso?

Pinterest is ideal for Pawcasso Atelier because:
- **70% of users** discover new brands/products on Pinterest
- **High purchase intent**: Users are actively planning projects (home decor, gifts)
- **Longer content lifespan**: Pins can drive traffic for months/years
- **Visual discovery**: Perfect for showcasing beautiful pet portraits
- **Affluent audience**: 45% of US households with income >$100K use Pinterest
- **Pet owner concentration**: Strong presence of pet enthusiasts and home decorators

### Campaign Goals

1. **Primary:** Generate 28+ orders ($35 CPA × $1,000 budget = 28.5 conversions)
2. **Secondary:** Build "engaged audience" for retargeting (500+ engagements)
3. **Tertiary:** Drive 5,000+ qualified visitors to gallery page

---

## Rich Pins Setup

### Status: ✅ ALREADY IMPLEMENTED

Your website already has Rich Pins metadata configured. Verify and validate:

### 1. Verify Rich Pins Metadata

**Already in layout.tsx (lines 48-54):**
```tsx
other: {
  "pinterest-rich-pin": "true",
  "og:type": "product",
  "og:price:amount": "9.00",
  "og:price:currency": "USD",
  "og:availability": "instock",
}
```

### 2. Validate Rich Pins

Go to [Pinterest Rich Pins Validator](https://developers.pinterest.com/tools/url-debugger/):

1. Enter: `https://pawcasso-atelier.vercel.app/order`
2. Click "Validate"
3. Should show: **Product Pin** with price ($9.00), availability (In Stock)
4. Apply for Rich Pins approval (instant for Product Pins)

### 3. Domain Verification

**Action Required:** Replace placeholder in layout.tsx line 159:

```tsx
<meta name="p:domain_verify" content="PINTEREST_VERIFICATION_CODE_HERE" />
```

**Steps:**
1. Go to [Pinterest Business Hub](https://www.pinterest.com/business/hub/)
2. Settings → Claimed accounts → Claim website
3. Choose "Add HTML tag" method
4. Copy the verification code (format: `p:domain_verify="1234567890abcdef..."`)
5. Replace `PINTEREST_VERIFICATION_CODE_HERE` with your code
6. Deploy to Vercel
7. Return to Pinterest and click "Verify"

---

## Campaign Structure

### Campaign Hierarchy

```
Pinterest Ads Account
└── Campaign: "Pet Portrait Discovery - Q1 2026"
    ├── Ad Group 1: "Pet Lovers - Broad"
    │   ├── Pin 1: Cat Vermeer Showcase
    │   ├── Pin 2: Multi-Style Grid
    │   └── Pin 3: Customer Testimonial
    │
    ├── Ad Group 2: "Home Decor Enthusiasts"
    │   ├── Pin 4: Interior Design Context
    │   ├── Pin 5: Before/After Wall Display
    │   └── Pin 6: Gift Idea Pin
    │
    └── Ad Group 3: "Retargeting - Site Visitors"
        ├── Pin 7: Limited Time Offer
        └── Pin 8: Social Proof Carousel
```

---

## Targeting Strategy

### Ad Group 1: Pet Lovers - Broad
**Budget:** $400 (40%)
**Target CPA:** $35

**Interests:**
- Pets
- Pet supplies
- Dog breeds
- Cat breeds
- Pet photography
- Pet portraits
- Custom pet gifts
- Pet memorial

**Keywords (Broad Match):**
- pet portrait
- custom dog portrait
- custom cat portrait
- pet painting
- personalized pet gift
- dog art
- cat art
- pet memorial gift
- pet lover gift
- unique pet gift

**Demographics:**
- Age: 25-54
- Gender: All (slight female skew 65/35)
- Devices: All
- Location: United States, Canada, UK, Australia

**Placement:**
- Browse (home feed)
- Search results
- Related Pins

---

### Ad Group 2: Home Decor Enthusiasts
**Budget:** $400 (40%)
**Target CPA:** $35

**Interests:**
- Home decor
- Interior design
- Wall art
- Gallery wall
- Personalized home decor
- Custom wall art
- Unique gifts
- Handmade gifts
- Etsy-style gifts
- Personalized gifts

**Keywords:**
- wall art ideas
- gallery wall
- personalized wall art
- custom art prints
- unique wall decor
- pet themed decor
- animal art prints
- home office decor
- living room wall art
- bedroom wall art

**Demographics:**
- Age: 30-65
- Gender: All (female-leaning 70/30)
- Household Income: $75K+
- Homeownership: Homeowners
- Life Events: New home, moving

---

### Ad Group 3: Retargeting - Site Visitors
**Budget:** $200 (20%)
**Target CPA:** $30 (lower due to warm audience)

**Audience Lists:**
1. **All Website Visitors** (past 30 days)
2. **Gallery Viewers** (past 60 days) - visited /gallery
3. **Order Page Visitors** (past 90 days) - visited /order but didn't convert
4. **Cart Abandoners** (past 90 days) - initiated checkout but didn't complete

**Exclusions:**
- Past purchasers (create separate "upsell" campaign later)

**Creative Strategy:**
- Urgency messaging ("Don't miss out")
- Social proof ("2,847 happy pet parents")
- Limited-time discount (if running promotion)

---

## Creative Assets

### Pinterest Creative Best Practices

**Aspect Ratios:**
- **Standard Pin:** 2:3 (1000×1500px) - RECOMMENDED
- **Square Pin:** 1:1 (1000×1000px)
- **Wide Pin:** 16:9 (1920×1080px) - for landscapes

**Design Principles:**
- Vertical orientation performs 2.5x better
- Bright, high-contrast images
- Minimal text overlay (Pinterest discourages >20% text)
- Focus on lifestyle/context over product shots
- Include branding but keep it subtle

### Pin Templates to Create

#### Pin 1: Hero Product Showcase
**File:** `pinterest-pin-1-cat-vermeer.png`
**Dimensions:** 1000×1500px
**Layout:**
- Top 60%: cat_vermeer.webp image
- Bottom 40%:
  - "Transform Your Pet Into Art"
  - "Custom AI Pet Portraits from $9"
  - "Choose from 16+ Artistic Styles"
  - Small logo + "pawcasso-atelier.vercel.app"

#### Pin 2: Multi-Style Grid
**File:** `pinterest-pin-2-style-grid.png`
**Dimensions:** 1000×1500px
**Layout:**
- 2×3 grid of 6 different styles
- Each cell labeled with style name
- Bottom overlay: "Which Style Suits Your Pet?"
- CTA: "See All 16 Styles →"

#### Pin 3: Customer Testimonial
**File:** `pinterest-pin-3-testimonial.png`
**Dimensions:** 1000×1500px
**Layout:**
- Large before/after split
- Customer quote overlay
- 5-star rating graphic
- "Join 2,847 Happy Pet Parents"

#### Pin 4: Interior Design Context
**File:** `pinterest-pin-4-wall-display.png`
**Dimensions:** 1000×1500px
**Layout:**
- Mockup: Portrait on living room wall
- Styled with furniture/plants
- "Elevate Your Space With Pet Art"
- "$9 - 24 Hour Delivery"

#### Pin 5: Gift Guide Pin
**File:** `pinterest-pin-5-gift-guide.png`
**Dimensions:** 1000×1500px
**Layout:**
- "Perfect Gift for Pet Lovers"
- Gift-wrapped portrait visual
- Occasions: Birthday, Mother's Day, Christmas, Memorial
- "Personalized & Affordable"

#### Pin 6: Video Pin (Carousel)
**File:** `pinterest-video-1-process.mp4`
**Duration:** 6-15 seconds
**Content:**
- Quick animation showing transformation
- Pet photo → AI generation → Final portrait
- Text overlays explaining each step
- End frame: "Order Yours Today"

#### Pin 7: Urgency/Retargeting
**File:** `pinterest-pin-7-limited-offer.png`
**Dimensions:** 1000×1500px
**Layout:**
- Bold headline: "Still Deciding?"
- Highlight: "Order in the next 24h for instant delivery"
- Social proof counters
- Strong CTA button graphic

#### Pin 8: Social Proof Carousel
**File:** `pinterest-carousel-customer-reviews.png`
**Dimensions:** 1000×1500px (×5 frames)
**Content:**
- 5 customer portraits with their reviews
- Real names + pet names
- Rating stars
- "Read More Reviews →"

---

## Creative Production Plan

### Using Existing Gallery Images

Your existing WebP images are perfect for Pinterest:
- cat_vermeer.webp
- border_collie_portrait_2048x2048.webp
- golden_retriever_portrait_square.webp
- shiba_inu_felt_portrait_2048x2048.webp
- alfie_imperial_portrait_2048x2048.webp

### Design Tool Recommendations

**Option 1: Canva (Easiest)**
1. Use Canva Pinterest Pin templates (1000×1500px)
2. Upload your WebP images
3. Add text overlays with brand fonts
4. Export as PNG (high quality)

**Option 2: Figma (Professional)**
1. Create artboard 1000×1500px
2. Import WebP images
3. Design with your brand colors (gold #F4E4C1)
4. Export 2x resolution (2000×3000px)

**Option 3: Adobe Express (Quick)**
1. Use Adobe's Pinterest templates
2. Auto-resize for different placements
3. Schedule directly to Pinterest

### Pinterest Creative Requirements

✅ **Technical Specs:**
- File type: PNG or JPEG
- Max file size: 20MB (Pins), 2GB (Video)
- Minimum resolution: 1000px wide
- Aspect ratio: 2:3 (best), 1:1, 16:9, 1:2.1, 9:16

✅ **Content Policy:**
- No misleading claims
- No "before/after" if implying unrealistic results
- No direct competitor mentions
- Include accurate pricing

---

## Conversion Tracking

### Status: ✅ ALREADY IMPLEMENTED

Pinterest Tag is already installed in layout.tsx (lines 136-156).

### 1. Set Environment Variable

Add to `.env.local`:
```env
NEXT_PUBLIC_PINTEREST_TAG_ID=your_pinterest_tag_id_here
```

**Get Your Pinterest Tag ID:**
1. Go to [Pinterest Ads Manager](https://ads.pinterest.com/)
2. Navigate to Ads → Conversions
3. Click "Install Pinterest Tag"
4. Copy your Tag ID (format: `2612345678901`)
5. Add to `.env.local`
6. Redeploy to Vercel (add to Vercel environment variables)

### 2. Verify Tag Installation

**Using Pinterest Tag Helper Chrome Extension:**
1. Install [Pinterest Tag Helper](https://chrome.google.com/webstore/detail/pinterest-tag-helper/jpbhncllcfkbmllnkoplijgfbhkjfplc)
2. Visit your website
3. Click extension icon → should show green checkmark
4. Events should fire: PageVisit, AddToCart, Checkout

**Manual Verification:**
1. Go to Pinterest Ads Manager
2. Conversions → View Tag Activity
3. Should see recent events from your website

### 3. Conversion Events Already Tracked

✅ **Page Visit** - Automatic on all pages
✅ **Add to Cart** - When user uploads pet photo (order/page.tsx line 218)
✅ **Checkout** - When user clicks "Proceed to Checkout" (order/page.tsx line 272)
✅ **Signup** - Email capture modal (if implemented)

### 4. Create Custom Conversion Events in Pinterest

In Pinterest Ads Manager → Conversions:

1. **Purchase Conversion:**
   - Name: "Portrait Purchase"
   - Event: checkout
   - Attribution window: 30 days click, 1 day view
   - Counting: Every time

2. **Add to Cart Conversion:**
   - Name: "Photo Uploaded"
   - Event: addtocart
   - Attribution window: 30 days click
   - Counting: Every time

---

## Budget Allocation

### Total Budget: $1,000 (30 days)
**Daily Budget:** $33.33

### Campaign Budget Split

| Ad Group | Budget | Daily | Goal | Expected Results |
|----------|--------|-------|------|------------------|
| Pet Lovers - Broad | $400 | $13.33 | 11 conversions | 4,000 clicks, 120K impressions |
| Home Decor Enthusiasts | $400 | $13.33 | 11 conversions | 3,500 clicks, 100K impressions |
| Retargeting - Site Visitors | $200 | $6.67 | 6 conversions | 2,000 clicks, 30K impressions |
| **TOTAL** | **$1,000** | **$33.33** | **28 conversions** | **9,500 clicks, 250K impressions** |

### Bidding Strategy

**Week 1-2 (Learning Phase):**
- Bid Strategy: Maximum Delivery
- Let Pinterest optimize for conversions
- Monitor CPA closely

**Week 3-4 (Optimization):**
- Switch to Target CPA bidding
- Set target: $35
- Pause underperforming pins
- Increase budget on winners

### Pacing

- **Even pacing** - Spread budget evenly throughout the day
- Avoid "Accelerated" - burns budget too fast

---

## Campaign Setup Steps

### Step 1: Create Pinterest Business Account

1. Go to [pinterest.com/business/create](https://www.pinterest.com/business/create)
2. Convert personal account or create new
3. Verify business email
4. Complete business profile:
   - Business name: Pawcasso Atelier
   - Website: pawcasso-atelier.vercel.app
   - Country: United States
   - Category: E-commerce

### Step 2: Claim Your Website

1. Settings → Claimed accounts → Claim website
2. Use HTML tag method (meta tag already in layout.tsx)
3. **UPDATE REQUIRED:** Replace placeholder verification code
4. Deploy and verify

### Step 3: Set Up Billing

1. Go to Ads Manager → Billing
2. Add payment method (credit card)
3. Set billing country
4. Accept Pinterest Ads terms

### Step 4: Create Campaign

1. **Campaign Level:**
   - Campaign name: "Pet Portrait Discovery - Q1 2026"
   - Campaign objective: **Conversions**
   - Campaign status: Active
   - Campaign budget: $1,000 (lifetime) OR $33.33/day (daily)

2. **Ad Group 1: Pet Lovers - Broad**
   - Ad group name: "Pet Lovers - Broad"
   - Conversion event: "Portrait Purchase" (checkout event)
   - Budget: $13.33/day
   - Bid strategy: Maximum delivery → Target CPA ($35) after learning
   - Start date: Immediate
   - End date: 30 days from now

3. **Targeting:**
   - Location: United States, Canada, UK, Australia
   - Language: English
   - Gender: All genders
   - Age: 25-54
   - Device: All devices
   - Interests: [Pet Lovers interests from above]
   - Keywords: [Pet portrait keywords from above]
   - Placement: Browse + Search + Related Pins

4. **Ad Group 2: Home Decor Enthusiasts**
   - Repeat steps with Home Decor targeting

5. **Ad Group 3: Retargeting**
   - Targeting: Custom audiences (website visitors)
   - Budget: $6.67/day
   - Target CPA: $30

### Step 5: Create Pins (Ads)

1. Click "Create Ad" in each ad group
2. Upload pin creative (1000×1500px PNG)
3. **Pin Title:** "Custom AI Pet Portrait - 16 Artistic Styles - $9"
4. **Pin Description:**
```
Transform your pet into stunning artwork with Pawcasso Atelier. Choose from Renaissance, Pixar 3D, Needle Felt, and 13+ other styles. Personalized pet portraits delivered in 24 hours. Perfect gift for pet lovers!

✨ 16+ curated art styles
📸 Upload any pet photo
🎨 AI-generated masterpiece
⚡ 24-hour delivery
💝 Perfect for gifts, memorials, home decor
💯 100% money-back guarantee

Starting at just $9. Order your custom pet portrait today!
```

5. **Destination URL:** `https://pawcasso-atelier.vercel.app/order?utm_source=pinterest&utm_medium=cpc&utm_campaign=pet_portrait_q1`

6. Create 2-3 pin variations per ad group (different images/copy)

### Step 6: Launch Campaign

1. Review all settings
2. Click "Publish"
3. Campaign enters 3-7 day learning phase
4. Monitor daily for first week

---

## Performance Monitoring

### Key Metrics to Track

**Daily (First Week):**
- Impressions
- Clicks
- CTR (aim for >0.5%)
- Conversions
- CPA (target: $35)
- Spend

**Weekly:**
- ROAS (Return on Ad Spend) - aim for >300%
- Pin engagement rate
- Top performing pins
- Audience insights
- Organic pin performance (non-ad pins getting repinned)

### Pinterest Analytics Dashboard

**Conversion Metrics:**
- Total conversions: Target 28+
- Conversion rate: Aim for 3%+
- Cost per conversion: Target $35

**Engagement Metrics:**
- Total engagements (saves + clicks)
- Engagement rate
- Outbound clicks
- Save rate (repins)

**Audience Insights:**
- Demographics breakdown
- Top interests
- Device usage
- Time of day performance

### Optimization Triggers

**Pause Pin if:**
- CPA >$50 after 30 clicks
- CTR <0.3% after 2,000 impressions
- No conversions after $100 spend

**Increase Budget if:**
- CPA <$30 consistently
- Conversion rate >4%
- ROAS >400%

**Create More Pins Like:**
- CPA <$30
- CTR >1%
- High save rate (>5%)

### Weekly Optimization Checklist

**Week 1:**
- [ ] Verify Pinterest Tag firing correctly
- [ ] Check conversion attribution
- [ ] Monitor learning phase
- [ ] Pause any pins with CTR <0.2%

**Week 2:**
- [ ] Switch to Target CPA bidding ($35)
- [ ] Add negative keywords (if seeing irrelevant clicks)
- [ ] Create 3-5 new pin variations based on top performers
- [ ] Test different CTAs

**Week 3:**
- [ ] Analyze audience demographics
- [ ] Adjust age/gender targeting if needed
- [ ] Test interest expansion
- [ ] Launch lookalike audience (if >50 conversions)

**Week 4:**
- [ ] Calculate final ROAS
- [ ] Identify winning creative patterns
- [ ] Plan month 2 budget allocation
- [ ] Export top pins for organic posting

---

## Creative Testing Framework

### A/B Test Variables

**Test 1: Headline Copy**
- A: "Transform Your Pet Into Art"
- B: "Custom Pet Portraits From $9"
- C: "The Perfect Gift for Pet Lovers"

**Test 2: Image Style**
- A: Single product shot (Cat Vermeer)
- B: Lifestyle/context (wall display)
- C: Before/after grid

**Test 3: CTA Placement**
- A: CTA at top
- B: CTA at bottom
- C: CTA in middle

**Test 4: Social Proof**
- A: No social proof
- B: "2,847 happy customers"
- C: Customer testimonial

### Test Methodology

1. Run 2-3 variations simultaneously
2. Equal budget split
3. Minimum 1,000 impressions per variation
4. Statistical significance: 95% confidence
5. Winner takes all budget

---

## Organic Pinterest Strategy

Beyond paid ads, maximize organic reach:

### 1. Create Pinterest Business Profile

- Username: @pawcassoatelier
- Profile description: "Custom AI-generated pet portraits in 16+ artistic styles. Transform your furry friend into a masterpiece. 24-hour delivery. Starting at $9."
- Profile photo: Logo or signature portrait
- Cover board: "Featured Portraits"

### 2. Create Boards

**Board Ideas:**
1. "Pet Portrait Gallery" - All your portraits
2. "Renaissance Pets" - Renaissance style pins
3. "Modern Pet Art" - Contemporary styles
4. "Pet Memorial Tributes" - Memorial-focused
5. "Home Decor Inspiration" - Context shots
6. "Customer Favorites" - Top sellers
7. "Behind the Scenes" - Process/making-of
8. "Pet Photography Tips" - Value-add content

### 3. Pin Consistently

- Upload 5-10 pins per week
- Mix original content + curated inspiration
- Use Pinterest SEO keywords in descriptions
- Pin at optimal times (evenings, weekends)

### 4. Engage with Community

- Repin relevant content from pet/decor accounts
- Comment on popular pins in your niche
- Follow pet influencers and home decor accounts
- Join group boards

---

## Advanced Strategies (Month 2+)

### 1. Idea Pins (Organic)

Create multi-page story pins:
- Page 1: Problem ("Looking for the perfect pet gift?")
- Page 2: Solution (Show portrait examples)
- Page 3: Process (How it works)
- Page 4: CTA (Order link)

### 2. Shopping Ads

Once approved for Pinterest Shopping:
- Upload product catalog
- Enable automatic product pins
- Show dynamic pricing
- "Buy" button on pins

### 3. Lookalike Audiences

After 50+ conversions:
- Create lookalike of converters
- 1% similarity (most similar)
- Test in new ad group
- Usually lower CPA than cold traffic

### 4. Dynamic Retargeting

Show specific portraits to users based on:
- Styles they viewed on site
- Gallery filters they used
- Time spent on order page

### 5. Seasonal Campaigns

**Q2:** Mother's Day, Father's Day, Graduation
**Q3:** Back to School, Pet Adoption Month
**Q4:** Thanksgiving, Christmas, New Year
**Q1:** Valentine's Day, Pet Wellness Month

---

## Budget Scaling Plan

### If Campaign is Profitable (CPA <$35, ROAS >300%)

**Month 2:** Increase to $2,000
**Month 3:** Increase to $3,500
**Month 4:** Increase to $5,000+

### Scaling Strategy

1. **Horizontal Scaling:**
   - Create new ad groups with different angles
   - Test new interests
   - Expand to new countries (EU, Asia-Pacific)

2. **Vertical Scaling:**
   - Increase daily budget by 20% every 3 days
   - Don't increase more than 50% at once (exits learning phase)

3. **Creative Scaling:**
   - Launch 10+ new pin variations per month
   - Test video pins
   - Experiment with carousels

---

## Troubleshooting Common Issues

### Low Impressions

**Causes:**
- Budget too low
- Audience too narrow
- Bid too low

**Fixes:**
- Increase daily budget to $15+
- Broaden interests
- Switch to Maximum Delivery bidding

### High CPA

**Causes:**
- Wrong audience
- Weak creative
- Poor landing page experience

**Fixes:**
- Refine targeting (exclude irrelevant interests)
- Test new pin designs
- Optimize order page load speed
- Add social proof to landing page

### Low CTR

**Causes:**
- Boring creative
- Weak headline
- Not mobile-optimized

**Fixes:**
- Use brighter colors
- Add text overlays
- Test vertical (2:3) aspect ratio
- Include lifestyle imagery

### Tag Not Firing

**Causes:**
- Environment variable not set
- Tag ID incorrect
- Ad blocker active

**Fixes:**
- Verify NEXT_PUBLIC_PINTEREST_TAG_ID in Vercel
- Check browser console for errors
- Test in incognito mode
- Use Pinterest Tag Helper extension

---

## Success Criteria

### Week 1 Goals:
- ✅ Rich Pins validated
- ✅ Domain verified
- ✅ 8+ pins live
- ✅ 50,000+ impressions
- ✅ 300+ clicks
- ✅ 3+ conversions

### Week 2 Goals:
- ✅ 100,000+ impressions
- ✅ 700+ clicks
- ✅ 7+ conversions
- ✅ CPA trending toward $35

### Week 3 Goals:
- ✅ Target CPA bidding active
- ✅ 150,000+ impressions
- ✅ 10+ conversions
- ✅ Retargeting audience >500

### Week 4 Goals:
- ✅ 28+ total conversions
- ✅ CPA ≤$35
- ✅ ROAS ≥300%
- ✅ 1,000+ saved pins (organic reach)

---

## Next Steps - IMMEDIATE ACTIONS

### 🔴 Critical (Do First):

1. **Get Pinterest Tag ID:**
   - Sign up for Pinterest Ads Manager
   - Get your Tag ID
   - Add to `.env.local` and Vercel environment variables
   - Redeploy site

2. **Domain Verification:**
   - Get verification code from Pinterest
   - Replace placeholder in layout.tsx line 159
   - Deploy and verify

3. **Validate Rich Pins:**
   - Use Pinterest URL Debugger
   - Confirm Product Pin showing correctly

### 🟠 High Priority (This Week):

4. **Create Pin Creatives:**
   - Design 8 pins using templates above
   - Use Canva or Figma
   - Export as 1000×1500px PNG

5. **Set Up Campaign:**
   - Create campaign structure
   - Configure 3 ad groups
   - Set budgets and targeting
   - Upload pins

6. **Launch:**
   - Review all settings
   - Start with $33/day
   - Monitor daily for first 3 days

### 🟡 Medium Priority (This Month):

7. **Organic Pinterest:**
   - Create business profile
   - Set up 5-7 boards
   - Pin 10 organic pins
   - Follow 50 relevant accounts

8. **Performance Tracking:**
   - Set up weekly reporting template
   - Monitor CPA daily
   - Test new pin variations
   - Optimize based on data

---

## Resources & Links

- **Pinterest Ads Manager:** https://ads.pinterest.com/
- **Pinterest Business Hub:** https://www.pinterest.com/business/hub/
- **Rich Pins Validator:** https://developers.pinterest.com/tools/url-debugger/
- **Pinterest Tag Helper:** https://chrome.google.com/webstore/detail/pinterest-tag-helper/jpbhncllcfkbmllnkoplijgfbhkjfplc
- **Pinterest Creative Best Practices:** https://business.pinterest.com/en/creative-best-practices
- **Pinterest Ads Specs:** https://help.pinterest.com/en/business/article/promoted-pins-ad-specs

---

## Campaign Timeline

```
Week 1: Setup & Launch
├── Day 1: Domain verification, Tag ID setup
├── Day 2: Create pin creatives
├── Day 3: Campaign setup in Ads Manager
├── Day 4: Launch campaign, monitor Tag
├── Day 5-7: Daily monitoring, quick optimizations

Week 2: Learning & Testing
├── Monitor learning phase
├── Test 3-5 new pin variations
├── Adjust bids if needed
├── Refine targeting based on data

Week 3: Optimization
├── Switch to Target CPA
├── Pause underperformers
├── Scale winners
├── Launch retargeting

Week 4: Scale & Report
├── Calculate final ROAS
├── Export winning creatives
├── Plan month 2 budget
├── Document learnings
```

---

**Campaign Owner:** [Your Name]
**Last Updated:** March 18, 2026
**Campaign Status:** READY TO LAUNCH ⚡

**Projected Results:**
- 28+ conversions at $35 CPA
- $252+ revenue (28 × $9 base price)
- ROAS: 25% (break-even campaign - focus on audience building)
- 9,500+ qualified clicks
- 250,000+ impressions
- 500+ engaged users for retargeting

🎯 **Primary Goal:** Acquire customers profitably while building retargeting audiences for future campaigns at <$20 CPA.
