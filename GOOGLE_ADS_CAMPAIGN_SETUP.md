# Google Ads Campaign Setup Guide - Pawcasso Atelier

**Budget:** $2,000
**Target ROAS:** 3x (minimum)
**Campaign Type:** Shopping Ads + Search Ads
**Primary Goal:** Drive $6,000+ in revenue from $2,000 ad spend

---

## Prerequisites Checklist

### 1. Google Merchant Center Setup
- [ ] Create Google Merchant Center account at https://merchants.google.com
- [ ] Verify and claim website domain: `pawcasso-atelier.vercel.app`
- [ ] Set up shipping and return policies
- [ ] Link Merchant Center to Google Ads account

### 2. Product Feed Submission
- [ ] Upload product feed XML to Merchant Center
  - **Feed URL:** `https://pawcasso-atelier.vercel.app/product-feed.xml`
  - **Feed Type:** XML (Google RSS)
  - **Update Schedule:** Daily (auto-refresh)
- [ ] Validate feed (no errors, all 4 products approved)
- [ ] Wait for product approval (usually 1-3 business days)

### 3. Google Ads Account Setup
- [ ] Create Google Ads account at https://ads.google.com
- [ ] Link Google Ads to Merchant Center
- [ ] Set billing information (credit card, billing address)
- [ ] Configure conversion tracking

### 4. Conversion Tracking Setup
- [ ] Get your Google Ads Conversion ID and Labels from Google Ads > Tools > Conversions
- [ ] Add environment variables to Vercel:
  ```bash
  NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID=AW-XXXXXXXXXX
  NEXT_PUBLIC_GOOGLE_ADS_LABEL_PURCHASE=XXXXXXXXXXXX
  NEXT_PUBLIC_GOOGLE_ADS_LABEL_ADD_TO_CART=XXXXXXXXXXXX
  NEXT_PUBLIC_GOOGLE_ADS_LABEL_BEGIN_CHECKOUT=XXXXXXXXXXXX
  ```
- [ ] Test conversion tracking (make a test purchase)
- [ ] Verify conversions appear in Google Ads (Tools > Conversions)
- [ ] Enable Enhanced Conversions (improves attribution accuracy)

---

## Campaign Structure

### Campaign 1: Shopping Ads (Performance Max)
**Budget:** $1,200/month ($40/day)
**Goal:** Maximum conversions with target ROAS 300%

#### Setup Steps:
1. **Create Performance Max Campaign**
   - Go to Google Ads > Campaigns > New Campaign
   - Goal: Sales
   - Campaign type: Performance Max
   - Select your Merchant Center feed

2. **Campaign Settings**
   - Daily budget: $40
   - Bidding: Maximize conversion value
   - Target ROAS: 300% (start conservative, then optimize)
   - Location: United States, Canada, UK, Australia
   - Language: English

3. **Asset Groups**
   - **Headlines (15 max):**
     - Custom AI Pet Portraits from $9
     - Transform Your Pet into Art
     - 17+ Artistic Styles Available
     - AI-Generated Pet Portraits
     - Renaissance to Pixar 3D Styles
     - 24-Hour Delivery Guarantee
     - Affordable Custom Pet Art
     - Digital Pet Portrait Artist
     - Unique Pet Gifts from $9
     - AI Pet Art in Any Style
     - Custom Dog & Cat Portraits
     - Instant Download Pet Art
     - Money-Back Guarantee
     - Pet Portrait Commission
     - Personalized Pet Artwork

   - **Long Headlines (5 max):**
     - Custom AI Pet Portraits - Choose from 17+ Art Styles
     - Transform Your Pet into Renaissance, Pixar, or Felt Art
     - AI-Generated Pet Portraits Delivered in 24 Hours
     - Affordable Custom Pet Art Starting at Just $9
     - Unique Pet Gifts - AI Art in Any Style You Want

   - **Descriptions (5 max):**
     - Upload a photo of your pet and choose from 17+ curated art styles. High-resolution digital files delivered within 24 hours. 100% money-back guarantee.
     - Transform your pet into stunning Renaissance, Pixar 3D, Needle Felt, or 14+ other artistic styles. Affordable prices from $9. Fast delivery.
     - Custom AI-generated pet portraits in the style of your choice. Perfect gift for pet lovers. Instant download available. Commercial use rights included.
     - Professional AI pet portrait artist. Choose Renaissance, Baroque, Impressionist, Ghibli, and more. Delivered fast. Satisfaction guaranteed.
     - Get a custom pet portrait in any artistic style. High-quality digital files. 24-hour delivery. Perfect for gifts, prints, or social media.

   - **Images:**
     - Use gallery images from `/website/public/gallery/`
     - Upload 10-15 best examples (Cat Vermeer, Shiba portraits, Golden Retriever, etc.)
     - Square format (1:1), minimum 600x600px

   - **Videos (if available):**
     - Create 15-second showcase video of gallery transformations
     - Before/after pet photo transformations
     - Style showcase reel

4. **Audience Signals (Help Google find right customers):**
   - Interests: Pet owners, dog lovers, cat lovers, pet photography, custom gifts, art collectors
   - Demographics: 25-65 years old, all genders, household income $50k+
   - In-market audiences: Pet supplies, gifts & occasions, home decor
   - Custom segments: People who searched for "pet portrait", "custom dog art", "pet gifts"

---

### Campaign 2: Search Ads (Standard Search)
**Budget:** $800/month ($27/day)
**Goal:** Capture high-intent search traffic

#### Keyword Strategy

**Ad Group 1: Pet Portrait - Exact Match (High Intent)**
Budget allocation: 40% ($11/day)

Keywords (Exact Match):
- [custom pet portrait]
- [ai pet portrait]
- [pet portrait artist]
- [custom dog portrait]
- [custom cat portrait]
- [pet portrait commission]
- [digital pet portrait]
- [affordable pet portrait]
- [pet portrait online]
- [personalized pet portrait]

Bid strategy: Target CPA $15-20

**Ad Group 2: Pet Portrait - Phrase Match (Medium Intent)**
Budget allocation: 30% ($8/day)

Keywords (Phrase Match):
- "pet portrait"
- "dog portrait"
- "cat portrait"
- "animal portrait"
- "pet art"
- "custom pet art"
- "pet painting"
- "pet artist"

Bid strategy: Target CPA $20-25

**Ad Group 3: Pet Gifts (Gift Buyers)**
Budget allocation: 30% ($8/day)

Keywords (Phrase Match):
- "pet gifts"
- "dog owner gifts"
- "cat owner gifts"
- "pet memorial"
- "pet lover gifts"
- "unique pet gifts"
- "personalized dog gifts"
- "custom cat gifts"

Bid strategy: Target CPA $20-30

#### Search Ad Copy

**Ad 1: Value-Focused**
```
Headline 1: Custom AI Pet Portraits - $9
Headline 2: 17+ Artistic Styles | 24hr Delivery
Headline 3: Renaissance, Pixar 3D & More
Description 1: Transform your pet into stunning AI-generated art. Choose from Renaissance, Pixar 3D, Needle Felt, and 14+ other styles. Fast delivery.
Description 2: Upload a photo, pick a style, get your masterpiece. High-res digital files. Money-back guarantee. Perfect gift for pet lovers.
```

**Ad 2: Quality-Focused**
```
Headline 1: AI Pet Portrait Artist
Headline 2: Custom Pet Art in Any Style
Headline 3: 100% Satisfaction Guaranteed
Description 1: Professional AI-generated pet portraits in 17+ curated art styles. High-quality digital files delivered within 24 hours.
Description 2: From classic Renaissance to modern Pixar 3D. Perfect for prints, gifts, or social media. Commercial use rights included.
```

**Ad 3: Gift-Focused**
```
Headline 1: Unique Pet Gifts from $9
Headline 2: Custom AI Portrait of Their Pet
Headline 3: Delivered in 24 Hours
Description 1: Give the gift of art. Transform their pet into a Renaissance masterpiece, Pixar character, or needle felt creation. Fast delivery.
Description 2: Perfect for birthdays, holidays, or memorials. Choose from 17+ artistic styles. Digital download or print-ready file.
```

#### Ad Extensions
- **Sitelink Extensions:**
  - View Gallery → /gallery
  - Order Now → /order
  - How It Works → /faq
  - Customer Reviews → /gallery/customer-reviews

- **Callout Extensions:**
  - 24-Hour Delivery
  - 100% Money-Back Guarantee
  - 17+ Art Styles
  - Commercial Use Rights
  - Instant Download Available
  - No Subscription Required

- **Structured Snippet Extensions:**
  - Styles: Renaissance, Pixar 3D, Needle Felt, Baroque, Impressionist
  - Delivery: Digital Download, Print-Ready Files, High-Resolution
  - Animals: Dogs, Cats, Birds, Exotic Pets

- **Price Extensions:**
  - Basic Package: $9 - 1 Portrait
  - Premium Package: $29 - 3 Portraits
  - Deluxe Package: $49 - 5 Portraits + Instant Delivery
  - Bundle Package: $79 - 10 Portraits + 3 Styles

---

## Negative Keywords (Critical for ROI)

Add these to prevent wasted spend on irrelevant searches:

**Broad Negative Keywords:**
- free
- template
- diy
- tutorial
- how to draw
- app
- software
- course
- class
- lesson
- stock
- clipart
- vector
- photoshop
- download free
- jobs
- career
- salary
- commission rates (artist commission info, not art commission)

**Specific Negative Keywords:**
- oil painting (we don't do physical paintings)
- canvas painting
- hand painted
- paint by numbers
- painting kit
- watercolor kit
- acrylic painting
- artist for hire (people looking for human artists)
- freelance artist
- local artist
- pet photographer (different service)
- pet photography

---

## Performance Monitoring & Optimization

### Week 1-2: Learning Phase
- Let campaigns learn with minimal changes
- Monitor conversion tracking (verify purchases are tracked)
- Check Search Terms Report daily
- Add negative keywords aggressively
- Goal: Achieve at least 10-15 conversions for algorithm learning

### Week 3-4: Initial Optimization
- Analyze which keywords/products drive sales
- Adjust bids on high-performing keywords (+20%)
- Pause or lower bids on low-performing keywords (-30% or pause)
- Test ad copy variations (A/B test 2-3 versions)
- Refine audience signals in Performance Max
- Goal: Improve ROAS from baseline to 2x

### Month 2+: Scaling & Refinement
- Increase budget on campaigns with ROAS > 3x
- Create separate campaigns for top-performing products
- Test new keyword variations
- Add more negative keywords based on Search Terms
- Optimize landing pages (order page) for conversion rate
- Goal: Achieve consistent 3x+ ROAS

### Key Metrics to Monitor Daily
1. **ROAS (Return on Ad Spend):** Target 3x minimum ($6 revenue per $2 ad spend)
2. **Cost per Conversion:** Target $15-25 per order
3. **Conversion Rate:** Target 3-5% from ad clicks
4. **Click-Through Rate (CTR):** Target 3-5% for search ads, 0.5-1% for shopping
5. **Average Order Value (AOV):** Track if upsells are working

### Weekly Reports
- Total spend vs. revenue
- ROAS by campaign
- Top converting keywords
- Wasted spend (clicks with no conversions)
- Search Terms Report review
- Product performance (which tier sells best)

---

## Advanced Strategies

### 1. Remarketing Lists for Search Ads (RLSA)
Create custom audiences:
- **All Website Visitors (30 days):** Bid +30% higher
- **Cart Abandoners:** Bid +50% higher, show urgency-focused ads
- **Gallery Viewers:** Bid +20% higher
- **Past Purchasers:** Create separate campaign for upsells/repeat purchases

### 2. Customer Match (Upload Email List)
- Upload customer emails from Stripe/database
- Create lookalike audiences (Similar Audiences)
- Exclude past purchasers from acquisition campaigns
- Target past purchasers with "Order Again" campaigns

### 3. Dynamic Remarketing (Shopping)
- Show specific products users viewed
- Automatically adjusts creative based on browsing behavior
- Higher conversion rate than standard remarketing

### 4. Seasonal Campaigns
Create special campaigns for:
- **Valentine's Day (Feb):** "Gift a Pet Portrait"
- **Mother's Day (May):** "Portrait of Mom's Pet"
- **Father's Day (June):** "Dad's Best Friend in Art"
- **Christmas (Nov-Dec):** "Perfect Pet Gift"
- **Pet Memorial Season (ongoing):** "Honor Your Pet's Memory"

### 5. A/B Testing Landing Pages
Test variations on `/order` page:
- Different headline copy
- Tier positioning (Basic vs Premium first)
- Urgency timer messaging
- Social proof placement
- Trust badge variations

---

## Budget Breakdown Summary

| Campaign Type | Daily Budget | Monthly Budget | Expected ROAS | Expected Revenue |
|---------------|--------------|----------------|---------------|------------------|
| Shopping (Performance Max) | $40 | $1,200 | 3.5x | $4,200 |
| Search (Standard) | $27 | $800 | 2.8x | $2,240 |
| **TOTAL** | **$67** | **$2,000** | **3.2x** | **$6,440** |

### Profitability Analysis
- **Total Ad Spend:** $2,000
- **Expected Revenue:** $6,440 (at 3.2x ROAS)
- **Gross Profit:** $6,440 (100% margin on digital products)
- **Net Profit after Ads:** $4,440
- **ROI:** 222%

---

## Launch Checklist

### Pre-Launch (Week 0)
- [ ] Set up Google Merchant Center
- [ ] Upload and validate product feed
- [ ] Create Google Ads account
- [ ] Link Merchant Center to Google Ads
- [ ] Install conversion tracking (env variables on Vercel)
- [ ] Test purchase conversion (make a $9 test order)
- [ ] Verify conversion appears in Google Ads

### Launch Week (Week 1)
- [ ] Create Performance Max campaign (Shopping)
- [ ] Create Search campaign with 3 ad groups
- [ ] Set up negative keywords
- [ ] Configure ad extensions (sitelinks, callouts, prices)
- [ ] Enable automated rules (pause keywords with CPA > $40)
- [ ] Set up conversion tracking in Google Analytics
- [ ] Create RLSA audiences

### Post-Launch (Week 2+)
- [ ] Review Search Terms Report daily
- [ ] Add negative keywords daily
- [ ] Monitor ROAS by campaign
- [ ] Adjust bids based on performance
- [ ] Test ad copy variations
- [ ] Analyze which products/tiers convert best
- [ ] Set up weekly performance reports

---

## Troubleshooting

### "Products Disapproved in Merchant Center"
- Check product feed for missing required fields (GTIN can be empty for custom products)
- Ensure all image URLs are accessible (https://pawcasso-atelier.vercel.app/...)
- Verify landing page loads properly (/order?tier=basic)
- Check shipping and return policy pages exist

### "Low Conversion Rate (< 1%)"
- Check if conversion tracking is firing (use Google Tag Assistant)
- Review landing page (/order) for UX issues
- Test checkout flow end-to-end
- Compare mobile vs. desktop conversion rates
- Add more trust signals (reviews, guarantees)

### "High CPC / Low Impressions"
- Lower bids temporarily to gather data
- Expand keyword match types (add phrase/broad match)
- Check Quality Score (improve ad relevance)
- Add more ad copy variations
- Expand geographic targeting

### "ROAS Below 3x Target"
- Pause low-performing keywords (ROAS < 1x)
- Increase bids on high-ROAS keywords
- Add more negative keywords
- Improve landing page conversion rate
- Test higher AOV tiers (upsell Premium/Deluxe)
- Review audience targeting (exclude poor-performing demographics)

---

## Contact & Support

For campaign setup help:
- **Google Ads Support:** 1-866-246-6453
- **Merchant Center Help:** https://support.google.com/merchants
- **Conversion Tracking Guide:** https://support.google.com/google-ads/answer/1722022

**File Locations in Repo:**
- Product Feed: `/website/public/product-feed.xml`
- Google Ads Tracking: `/website/src/lib/google-ads.ts`
- Conversion Tracker Component: `/website/src/components/GoogleAdsConversionTracker.tsx`
- Environment Variables: Add to Vercel project settings

---

## Next Steps After Launch

1. **Let it run for 7 days** with minimal changes (learning phase)
2. **Review Search Terms** daily and add negative keywords
3. **Check conversion tracking** - verify purchases are showing up
4. **Week 2:** Start optimizing based on data (adjust bids, pause poor performers)
5. **Week 3-4:** Scale winning campaigns, test new ad copy
6. **Month 2:** Aim for consistent 3x+ ROAS, consider increasing budget

**Success Metrics (30-day goal):**
- ✅ 3x+ ROAS
- ✅ $6,000+ revenue from $2,000 spend
- ✅ 80-120 orders (at avg. $50-75 AOV)
- ✅ Cost per conversion < $25
- ✅ Conversion rate > 3%

Good luck! 🚀
