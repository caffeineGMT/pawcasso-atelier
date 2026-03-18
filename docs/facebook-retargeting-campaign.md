# Facebook/Instagram Retargeting Campaign Configuration

**Campaign Goal:** Build and convert custom audiences through Facebook/Instagram retargeting ads
**Budget:** $500/month ($16.67/day)
**Target ROAS:** 2.5x minimum
**Timeline:** 90 days (3 phases)

---

## Phase 1: Pixel Installation & Audience Building (Days 1-14)

### Meta Pixel Installation ✅
- **Pixel ID:** Set via `NEXT_PUBLIC_META_PIXEL_ID` environment variable
- **Status:** Installed in `/website/src/app/layout.tsx`
- **Events Tracked:**
  - ✅ PageView (automatic on all pages)
  - ✅ ViewContent (gallery, pricing, product pages)
  - ✅ AddToCart (when user uploads pet photo - **critical signal**)
  - ✅ InitiateCheckout (when user submits order form)
  - ✅ AddPaymentInfo (before Stripe redirect)
  - ✅ Purchase (order success page)
  - ✅ Lead (email capture modal)
  - ✅ Search (gallery filters)
  - ✅ Custom Engagement Events (tier selection, style preview, Instagram clicks)

### Custom Audiences to Build

#### 1. **Website Visitors (14-day window)**
- **Name:** Pawcasso - All Website Visitors (14d)
- **Criteria:** Anyone who visited pawcasso-atelier.vercel.app in the last 14 days
- **Size Target:** 1,000+ within 2 weeks
- **Purpose:** Broadest retargeting pool

#### 2. **Gallery Browsers (14-day window)**
- **Name:** Pawcasso - Gallery Browsers (14d)
- **Criteria:** Visited /gallery OR triggered ViewContent event
- **Size Target:** 300-500 within 2 weeks
- **Purpose:** High-intent users who explored artwork

#### 3. **Add-to-Cart Abandoners (14-day window)** ⚡ **HIGH VALUE**
- **Name:** Pawcasso - Cart Abandoners (14d)
- **Criteria:** Triggered AddToCart event (uploaded pet photo) BUT did NOT purchase
- **Size Target:** 50-100 within 2 weeks
- **Purpose:** **CRITICAL** - These users showed highest purchase intent
- **Expected Conversion:** 15-25% with proper retargeting

#### 4. **Checkout Initiators (14-day window)**
- **Name:** Pawcasso - Checkout Abandoners (14d)
- **Criteria:** Triggered InitiateCheckout OR AddPaymentInfo BUT did NOT purchase
- **Size Target:** 30-70 within 2 weeks
- **Purpose:** Users who started checkout but didn't complete

#### 5. **Past Purchasers (180-day window)**
- **Name:** Pawcasso - Past Customers (180d)
- **Criteria:** Triggered Purchase event
- **Size Target:** Start small, grow over time
- **Purpose:** Upsell/cross-sell + lookalike source

#### 6. **Email Leads (30-day window)**
- **Name:** Pawcasso - Email Leads (30d)
- **Criteria:** Triggered Lead event (email capture)
- **Size Target:** 100-200 within 2 weeks
- **Purpose:** Nurture leads with 15% discount offer

---

## Phase 2: Retargeting Campaigns (Days 15-30)

### Campaign Structure

#### Campaign #1: Cart Abandoner Recovery ⚡ **PRIORITY**
- **Objective:** Conversions (Purchase)
- **Budget:** $250/month ($8.33/day)
- **Audience:** Add-to-Cart Abandoners (exclude purchasers)
- **Placement:** Facebook Feed, Instagram Feed, Instagram Stories
- **Creative Strategy:**
  - Show the exact style they selected (if tracked)
  - "You're so close! Complete your portrait - 10% off"
  - Before/after carousel: Pet photo → AI masterpiece
  - Urgency: "Limited slots available"

**Ad Set 1A: Cart Abandoners - Immediate Retargeting (1-3 days)**
- Budget: $5/day
- Creative: Direct "Complete your order" message
- Discount: 10% off with code COMPLETE10

**Ad Set 1B: Cart Abandoners - Extended Retargeting (4-14 days)**
- Budget: $3.33/day
- Creative: Social proof + testimonials
- Discount: 15% off with code RETURN15

#### Campaign #2: Gallery Browser Conversion
- **Objective:** Conversions (Purchase)
- **Budget:** $150/month ($5/day)
- **Audience:** Gallery Browsers (exclude cart abandoners, purchasers)
- **Placement:** Facebook Feed, Instagram Feed, Instagram Reels
- **Creative Strategy:**
  - Carousel ads with 5-8 best gallery images
  - "Transform your pet into art - $9"
  - Video: time-lapse of AI generation process
  - CTA: "Order Now"

**Ad Set 2A: Gallery Browsers - First 7 Days**
- Budget: $3/day
- Creative: Showcase variety of styles
- Offer: Free shipping (already included)

**Ad Set 2B: Gallery Browsers - Days 8-14**
- Budget: $2/day
- Creative: Testimonial-focused
- Offer: "Join 500+ happy pet parents"

#### Campaign #3: Email Lead Nurture
- **Objective:** Conversions (Purchase)
- **Budget:** $50/month ($1.67/day)
- **Audience:** Email Leads (exclude purchasers)
- **Placement:** Facebook Feed, Instagram Feed
- **Creative Strategy:**
  - "Use your 15% discount code: [CODE]"
  - Showcase 3-4 best-selling styles
  - Limited time urgency

#### Campaign #4: Website Visitor Retargeting
- **Objective:** Traffic → Conversions
- **Budget:** $50/month ($1.67/day)
- **Audience:** All Website Visitors (exclude all above audiences)
- **Placement:** Facebook Feed, Instagram Stories
- **Creative Strategy:**
  - Introduce brand + value prop
  - "Just $9 for a custom AI pet portrait"
  - Social proof stats

---

## Phase 3: Lookalike Audiences (Days 30+)

**Prerequisite:** Need at least 100 conversions (purchases) to create effective lookalikes

### Lookalike Audience Strategy

#### 1% Lookalike - High Precision
- **Source:** Past Purchasers (180d)
- **Location:** United States + Canada
- **Size:** ~2.3M people
- **Budget:** $200/month initially
- **Purpose:** Find people very similar to customers

#### 2% Lookalike - Balanced
- **Source:** Past Purchasers (180d)
- **Location:** United States + Canada
- **Size:** ~4.6M people
- **Budget:** $150/month
- **Purpose:** Broader reach, still high similarity

#### 5% Lookalike - Scale
- **Source:** Past Purchasers (180d)
- **Location:** United States + Canada
- **Size:** ~11.5M people
- **Budget:** $150/month
- **Purpose:** Maximum scale for prospecting

### Lookalike Campaign Structure
- **Objective:** Conversions (Purchase)
- **Creative:** Same proven winners from retargeting campaigns
- **Testing:** A/B test creatives every 2 weeks
- **Scaling:** Increase budget by 20% when ROAS > 3.0x

---

## Ad Creative Templates

### 1. Carousel Ad - Before/After Transformation

**Headline:** "From Photo to Masterpiece in 24 Hours"

**Cards:**
1. Regular pet photo → Renaissance portrait
2. Regular pet photo → Pixar 3D portrait
3. Regular pet photo → Ukiyo-e portrait
4. Regular pet photo → Art Deco poster
5. CTA card: "Order Yours - $9"

**Body Text:**
```
Transform your pet into stunning artwork 🎨

✨ 17 art styles (Renaissance, Pixar, Ghibli, & more)
⚡ Delivered in 24 hours
🖼️ Print-ready 4000x5000px resolution
💰 Just $9 (limited time)

Upload your photo. Pick a style. Get a masterpiece.

[Order Now →]
```

**CTA Button:** Order Now

---

### 2. Video Ad - Time-Lapse Generation

**Video Length:** 15 seconds
**Content:**
- 0-3s: Show customer pet photo
- 3-6s: AI generation animation (stylized)
- 6-12s: Reveal final portrait in selected style
- 12-15s: CTA with price

**Caption:**
```
Watch the magic happen ✨

Your pet → AI artwork in 24 hours

17 styles | $9 | Print-ready quality

[Shop Now →]
```

---

### 3. Static Image - Testimonial + Social Proof

**Image:** Grid of 4 customer pet portraits with ★★★★★ overlay

**Headline:** "500+ Happy Pet Parents"

**Body Text:**
```
"I ordered 3 different styles of my dog and they're ALL stunning.
Framed them and they look professional!"
⭐⭐⭐⭐⭐ - Sarah M.

Choose from 17 artistic styles:
Renaissance | Impressionist | Ghibli | Pixar 3D | Art Nouveau | Ukiyo-e | Pop Art | Cyberpunk | and more

📸 Upload photo
🎨 Pick style
⚡ Delivered in 24 hours

Only $9 → [Order Now]
```

---

### 4. Instagram Story Ad - Swipe Up

**Format:** Vertical 9:16
**Frames:**
1. Hook: "Turn Your Pet Into Art" (bold text)
2. Show 3 example transformations (1s each)
3. "Just $9 - 24hr delivery"
4. CTA: "Swipe Up →"

**Interactive Element:** Poll sticker "Which style?" (Renaissance vs Ghibli)

---

### 5. Cart Abandoner Retargeting Ad

**Image:** The specific style they previewed (if tracked) OR best-selling style

**Headline:** "Complete Your Portrait - 10% Off Inside"

**Body Text:**
```
You're so close to getting your custom pet portrait! 🐾

We saved your order:
✓ Pet photo uploaded
✓ [Style name] selected
✓ Delivery in 24 hours

Complete checkout now and save 10% with code: COMPLETE10

❤️ Join 500+ happy customers
⭐ 4.9/5 stars
🚀 Limited slots available

[Finish Order →]
```

---

## Targeting Strategy

### Core Target Audiences

#### Primary: Millennial/Gen Z Pet Parents
- **Age:** 25-45
- **Interests:**
  - Pet ownership (dog owners, cat owners, pet lovers)
  - Art (impressionist art, renaissance art, modern art, custom art)
  - Gifts (personalized gifts, custom gifts, pet gifts)
  - E-commerce (Etsy buyers, custom product shoppers)
- **Behaviors:**
  - Online shoppers
  - Mobile device users (iOS/Android)
  - Engaged shoppers
- **Income:** $40K+ household

#### Secondary: Pet Memorial/Tribute Market
- **Age:** 30-65
- **Interests:**
  - Pet loss support, pet memorials
  - Custom framing
  - Personalized gifts
- **Life Events:**
  - Recently got a pet
  - Pet birthdays (tracked via pixel if possible)

#### Tertiary: Gift Buyers (Seasonal Spikes)
- **Age:** 25-55
- **Interests:**
  - Gift shopping
  - Birthday gifts, holiday gifts
  - Pet lover community
- **Peak Seasons:**
  - Q4 holidays (Nov-Dec)
  - Valentine's Day (Feb)
  - Mother's/Father's Day (May/June)

#### Quaternary: Pet Influencers & Content Creators
- **Age:** 20-40
- **Interests:**
  - Instagram creators
  - Pet influencers
  - TikTok creators
  - Content creation
- **Purpose:** Viral amplification + UGC content

---

## Budget Allocation (Monthly)

| Campaign | Budget | % of Total |
|----------|--------|-----------|
| Cart Abandoner Recovery | $250 | 50% |
| Gallery Browser Conversion | $150 | 30% |
| Email Lead Nurture | $50 | 10% |
| Website Visitor Retargeting | $50 | 10% |
| **TOTAL** | **$500** | **100%** |

**After 90 days (with 100+ conversions):**
- Shift $300/month to Lookalike campaigns
- Keep $200/month for retargeting

---

## Success Metrics & KPIs

### Phase 1 (Days 1-14) - Audience Building
- ✅ Install Meta Pixel
- ✅ Track 1,000+ PageView events
- ✅ Track 50+ AddToCart events (photo uploads)
- ✅ Track 20+ InitiateCheckout events
- ✅ Track 100+ Lead events (email captures)
- ✅ Build audiences with 100+ people each

### Phase 2 (Days 15-30) - Retargeting Launch
- **ROAS Target:** 2.5x minimum ($1,250 revenue from $500 spend)
- **Conversion Rate:** 2-4% on cart abandoners
- **Cost Per Purchase (CPP):** $15-25
- **Click-Through Rate (CTR):** 1.5-3%
- **Purchases:** 20-30 sales

### Phase 3 (Days 30+) - Lookalike Scaling
- **ROAS Target:** 3.0x+ ($1,500+ revenue from $500 spend)
- **Conversion Rate:** 1-2% on lookalikes
- **Cost Per Purchase (CPP):** $20-30
- **Purchases:** 25-40 sales
- **Scale:** Increase budget by 20% when ROAS > 3.5x

---

## Technical Implementation Checklist

### Meta Pixel Setup ✅
- [x] Install Meta Pixel base code in website layout
- [x] Set up standard events (PageView, ViewContent, AddToCart, etc.)
- [x] Set up custom events (engagement tracking)
- [x] Test events with Meta Pixel Helper Chrome extension
- [ ] Verify events in Events Manager (wait 24-48hrs for data)

### Facebook Business Manager Setup
- [ ] Create Facebook Business Manager account
- [ ] Add Meta Pixel to Business Manager
- [ ] Verify domain ownership (pawcasso-atelier.vercel.app)
- [ ] Set up Facebook Page for Pawcasso Atelier
- [ ] Connect Instagram account (@pawcasso.atelier)
- [ ] Create Ad Account
- [ ] Add payment method

### Audience Creation
- [ ] Create all 6 custom audiences (listed above)
- [ ] Set up audience exclusions (purchasers from retargeting campaigns)
- [ ] Create lookalike audiences (after 100 conversions)

### Campaign Setup
- [ ] Create Campaign #1: Cart Abandoner Recovery
- [ ] Create Campaign #2: Gallery Browser Conversion
- [ ] Create Campaign #3: Email Lead Nurture
- [ ] Create Campaign #4: Website Visitor Retargeting
- [ ] Upload ad creatives (images, videos, copy)
- [ ] Set up conversion tracking
- [ ] Enable automatic placements OR manual (Feed, Stories, Reels)

### Server-Side API (Optional but Recommended)
- [ ] Set up Meta Conversions API for server-side event tracking
- [ ] Implement Purchase event server-side (webhook from Stripe)
- [ ] Match events with Pixel events for deduplication
- [ ] Test with Event Match Quality score

---

## Creative Asset Checklist

### Images Needed
- [ ] 20+ customer transformation examples (before/after)
- [ ] Carousel ad images (8 transformations)
- [ ] Grid layout for testimonial ad (4 portraits + stars)
- [ ] Lifestyle images (framed portraits in homes)
- [ ] Logo variations (square, horizontal, transparent)

### Videos Needed
- [ ] 15-second time-lapse generation video
- [ ] 30-second customer testimonial compilation
- [ ] 6-second Instagram Story teaser
- [ ] Carousel video (swipe through styles)

### Copy Variations
- [ ] 10 headline variations
- [ ] 10 body copy variations
- [ ] 5 CTA button variations
- [ ] Discount code messaging (10%, 15% off)

---

## Optimization & Testing Plan

### Week 1-2: Launch & Learn
- Launch all 4 campaigns
- Monitor CPP (Cost Per Purchase) daily
- Pause underperforming ad sets (ROAS < 1.5x after 5 days)
- Scale winning ads by 20%

### Week 3-4: Creative Testing
- A/B test 3 different headlines
- A/B test 3 different hero images
- A/B test video vs static image
- Identify winning creative patterns

### Week 5-6: Audience Expansion
- Test 1-2 new interest audiences
- Test age range variations (25-34 vs 35-44)
- Test geographic expansion (UK, Australia if budget allows)

### Week 7-12: Lookalike Launch
- Create 1% lookalike audience
- Test against best-performing retargeting campaign
- Scale if ROAS > 2.5x

---

## Notes & Best Practices

1. **Frequency Cap:** Set frequency cap at 3-5 impressions per 7 days to avoid ad fatigue
2. **Budget Pacing:** Use "standard" delivery, not "accelerated"
3. **Placement Optimization:** Start with automatic, shift to manual after 30 days
4. **Mobile-First:** 80%+ traffic will be mobile - optimize all creatives for mobile
5. **Instagram Priority:** Pet content performs exceptionally well on Instagram
6. **UGC Content:** Repost customer photos with permission (boost authenticity)
7. **Seasonal Peaks:** Scale budget +50% during Q4 holidays
8. **Event Deduplication:** Match server-side events with pixel events using eventID
9. **iOS 14+ Impact:** Use Conversions API to mitigate iOS tracking limitations
10. **GDPR Compliance:** Ensure cookie consent banner is implemented

---

## Emergency Troubleshooting

### Problem: Pixel events not showing in Events Manager
- **Solution:** Check browser console for errors, verify pixel ID, test with Pixel Helper

### Problem: Audience size too small (< 100 people)
- **Solution:** Extend lookback window to 30 days, broaden criteria, drive more traffic

### Problem: ROAS < 1.5x after 7 days
- **Solution:** Pause campaign, review creative, test new messaging, check landing page conversion rate

### Problem: High CPP (> $30)
- **Solution:** Narrow audience, improve ad relevance score, test new creatives

---

## Monthly Reporting Template

**Month:** [Month Year]
**Total Spend:** $500
**Total Revenue:** $______
**ROAS:** _____x
**Total Purchases:** ___

| Campaign | Spend | Revenue | ROAS | Purchases | CPP | CTR |
|----------|-------|---------|------|-----------|-----|-----|
| Cart Abandoners | $250 | $____ | ___x | ___ | $___ | __% |
| Gallery Browsers | $150 | $____ | ___x | ___ | $___ | __% |
| Email Leads | $50 | $____ | ___x | ___ | $___ | __% |
| Website Visitors | $50 | $____ | ___x | ___ | $___ | __% |

**Top Performing Ad:**
- Creative: _______
- Audience: _______
- ROAS: _____x

**Action Items for Next Month:**
1. _______
2. _______
3. _______

---

**Last Updated:** March 2026
**Owner:** Michael Guo
**Campaign Manager:** [TBD]
