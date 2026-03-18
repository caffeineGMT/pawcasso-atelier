# Pawcasso Atelier - Meta Ads Campaign
## Campaign Overview

**Campaign Name:** Pawcasso Atelier - Pet Portrait Launch Q1 2026
**Budget:** $2,000
**Target CPA:** $40
**Duration:** 30 days (rolling optimization)
**Platform:** Facebook & Instagram

---

## Campaign Structure

### Campaign Level
- **Objective:** Conversions (Purchase)
- **Budget Type:** Campaign Budget Optimization (CBO)
- **Total Budget:** $2,000 over 30 days (~$66.67/day)
- **Bid Strategy:** Lowest Cost with CPA Goal ($40)

### Ad Sets (3 Ad Sets)

#### Ad Set 1: Pet Owner Lookalike - Warm Audience
- **Audience:** 1% Lookalike based on website visitors (last 180 days)
- **Locations:** United States, Canada, UK, Australia
- **Age:** 25-55
- **Interests:** Pets, Dog Lovers, Cat Lovers, Pet Adoption, Pet Photography
- **Budget:** 40% ($800)
- **Placements:** Automatic (Facebook Feed, Instagram Feed, Stories, Reels)

#### Ad Set 2: Pet Owner Lookalike - Engaged Audience
- **Audience:** 1% Lookalike based on Instagram page engagers
- **Locations:** United States, Canada, UK, Australia
- **Age:** 25-55
- **Interests:** Pet Gifts, Personalized Gifts, Custom Portraits, Etsy Shoppers
- **Budget:** 35% ($700)
- **Placements:** Instagram-focused (Feed, Stories, Reels)

#### Ad Set 3: Cold Audience - Broad Interest
- **Audience:** Cold targeting with broad pet owner interests
- **Locations:** United States, Canada
- **Age:** 25-55
- **Detailed Targeting:** Pet Owners + (Gift Shopping OR Home Decor OR Wall Art)
- **Budget:** 25% ($500)
- **Placements:** Facebook & Instagram Feed only

---

## Creative Strategy (5 Variants)

### Static Ads (2 variants)
1. **Hero Static - "Transform Your Pet into Art"**
   - Primary Image: Cat Vermeer (cat_vermeer.webp)
   - Format: 1:1 square
   - Use case: Facebook Feed, Instagram Feed

2. **Lifestyle Static - "Multiple Styles Available"**
   - Primary Image: 2x2 grid showcasing 4 different styles
   - Format: 1:1 square
   - Use case: All placements

### Carousel Ads (2 variants)
3. **Style Showcase Carousel**
   - 6 cards showing different art styles
   - Each card: Pet image + Style name + "$9 only"
   - Images: Pixar 3D, Needle Felt, Renaissance, Pixel Art, Vinyl Toy, Ink Wash
   - Format: 1:1 square per card

4. **Before/After Carousel**
   - 5 cards alternating concept vs. final art
   - Storytelling: "Your Pet → Our AI → Beautiful Art"
   - Format: 1:1 square per card

### Video Ad (1 variant)
5. **Slideshow Video - "30 Styles, One Click Away"**
   - 15-second slideshow of 10 different pet portraits
   - Smooth crossfade transitions
   - Text overlay: "$9 • Fast Delivery • AI-Generated Masterpiece"
   - Format: 9:16 (Stories/Reels), 1:1 (Feed)
   - Background music: Upbeat, modern, pet-friendly

---

## Ad Copy Variants

### Headlines (rotating A/B test)
1. "Turn Your Pet into a Masterpiece – Just $9"
2. "Custom AI Pet Portraits in 30+ Artistic Styles"
3. "Your Dog Deserves to Be Art (Cat Too!)"
4. "AI-Generated Pet Portraits for Only $9"
5. "Renaissance, Pixar, Pixel Art – Pick Your Style"

### Primary Text (3 variants)
**Variant A - Emotional:**
> Your pet isn't just a pet – they're family. Now you can immortalize them as a work of art.
>
> Pawcasso Atelier uses AI to transform your pet's photo into stunning custom portraits in 30+ artistic styles. From Renaissance classics to Pixar-style 3D, choose the perfect style that captures their personality.
>
> ✨ 30+ art styles to choose from
> 🎨 High-resolution digital download
> ⚡ Fast turnaround (24-48 hours)
> 💰 Only $9 per portrait
>
> Perfect for gifts, home decor, or simply celebrating the furry friend who brightens your day.

**Variant B - Value-Focused:**
> Custom pet portraits used to cost $100+. Not anymore.
>
> Get museum-quality AI-generated art of your dog, cat, or any pet for just $9. Choose from 30+ styles including Pixar 3D, Needle Felt, Renaissance, Cyberpunk, and more.
>
> Why Pawcasso?
> ✓ Professional AI trained on thousands of art styles
> ✓ High-res digital file (perfect for printing)
> ✓ 24-48 hour delivery
> ✓ Satisfaction guaranteed
>
> Transform your pet into art today. Because they deserve it.

**Variant C - FOMO/Urgency:**
> Over 500 pet parents have already turned their fur babies into art. Your turn! 🐾
>
> Pawcasso Atelier makes it ridiculously easy (and affordable) to get custom pet portraits. Just upload a photo, pick from 30+ artistic styles, and boom – you've got a one-of-a-kind masterpiece.
>
> $9. That's it. No hidden fees. No waiting weeks.
>
> 🖼️ Choose from Renaissance, Pixar 3D, Watercolor, Pixel Art & more
> 📥 Instant digital download ready to print or share
> 🎁 Perfect gift for pet lovers
>
> Limited-time pricing. Order yours now!

### Call-to-Action (CTA)
- Primary: **Shop Now**
- Secondary: **Learn More**
- Alternative: **Order Now**

---

## Conversion Tracking Setup

### Meta Pixel Events
```javascript
// PageView - Auto-tracked
fbq('track', 'PageView');

// ViewContent - Gallery page
fbq('track', 'ViewContent', {
  content_name: 'Pet Portrait Gallery',
  content_category: 'Pet Art',
  content_type: 'product',
});

// InitiateCheckout - Order form submission
fbq('track', 'InitiateCheckout', {
  content_name: 'Pet Portrait Order',
  value: 9.00,
  currency: 'USD',
});

// Purchase - Stripe checkout completion
fbq('track', 'Purchase', {
  value: 9.00,
  currency: 'USD',
  content_name: 'AI Pet Portrait',
  content_type: 'product',
});
```

### Conversion Events Priority
1. **Primary:** Purchase (Standard Event)
2. **Secondary:** InitiateCheckout
3. **Tertiary:** ViewContent (Gallery)

---

## Audience Building Strategy

### Custom Audiences (Retargeting)
1. **Website Visitors (180 days)** - All site visitors
2. **Gallery Viewers (90 days)** - Visited /gallery page
3. **Cart Abandoners (30 days)** - Visited /order but didn't purchase
4. **Instagram Engagers (365 days)** - Engaged with @pawcasso.atelier posts

### Lookalike Audiences
1. **1% LAL - Website Visitors** (Primary)
2. **1% LAL - Instagram Engagers** (Secondary)
3. **1% LAL - Purchasers** (Future - once 50+ conversions)

---

## Budget Allocation & Pacing

| Week | Budget | Expected Spend/Day | Target Conversions | Target CPA |
|------|--------|-------------------|-------------------|-----------|
| Week 1 | $500 | $71.43 | 12-13 | $38-42 |
| Week 2 | $500 | $71.43 | 12-13 | $38-42 |
| Week 3 | $500 | $71.43 | 12-13 | $38-42 |
| Week 4 | $500 | $71.43 | 12-13 | $38-42 |
| **Total** | **$2,000** | **$66.67 avg** | **50** | **$40** |

### Optimization Milestones
- **Days 1-3:** Learning phase, gather data, no changes
- **Days 4-7:** Pause underperforming creatives (CPA > $60)
- **Days 8-14:** Scale winning ad sets by 20%
- **Days 15-21:** Introduce new creative variations for winners
- **Days 22-30:** Final push with best performers

---

## Performance Benchmarks

### Success Metrics
- **CPA:** ≤ $40 (target), ≤ $50 (acceptable)
- **CTR:** ≥ 1.5% (good), ≥ 2.0% (excellent)
- **Conversion Rate:** ≥ 3% (landing page)
- **ROAS:** ≥ 0.225 ($9 order / $40 CPA = 22.5%)

### KPIs to Monitor Daily
- Impressions
- Clicks
- CTR (Link Click-Through Rate)
- CPC (Cost Per Click)
- Landing Page Views
- Purchases
- CPA
- ROAS

---

## Creative Testing Schedule

### Week 1-2: Initial Launch
- All 5 creatives live
- Equal budget distribution
- Monitor performance

### Week 3: Iteration
- Pause bottom 2 performers
- Duplicate top 3 with new copy variants
- Test new headlines

### Week 4: Scale
- Allocate 80% budget to top 2 winners
- Maintain 20% for testing new concepts

---

## Risk Mitigation

### Ad Disapproval Prevention
- Avoid "before/after" claims (can be flagged)
- No misleading pricing ("Free", "Limited time" needs actual deadline)
- Clear disclosures: "AI-generated", "Digital product"
- Family-friendly content only

### Low Performance Contingency
If CPA > $60 after 7 days:
1. Pause all ads
2. Analyze audience overlap (reduce if > 30%)
3. Refresh creative with UGC-style content
4. Tighten targeting (US only, age 30-50)
5. Lower daily budget to $40/day for controlled testing

---

## Next Steps (Implementation Checklist)

- [ ] Install Meta Pixel on website
- [ ] Set up Conversions API (server-side tracking)
- [ ] Create Facebook Business Manager ad account
- [ ] Upload all 5 ad creatives to Ads Manager
- [ ] Build Custom Audiences (website visitors, Instagram engagers)
- [ ] Create 1% Lookalike Audiences
- [ ] Set up 3 Ad Sets with targeting parameters
- [ ] Write and upload all ad copy variants
- [ ] Set campaign budget to $2,000 over 30 days
- [ ] Enable CBO (Campaign Budget Optimization)
- [ ] Set CPA goal to $40
- [ ] Launch campaign
- [ ] Monitor daily for first 72 hours (learning phase)
- [ ] Set up automated rules (pause if CPA > $70)
- [ ] Weekly performance review and optimization

---

## Notes
- Start with conservative targeting to build conversion data
- Once 50+ conversions, create purchaser LAL (most valuable)
- Consider expanding to Pinterest Ads if ROAS > 1.0
- Test TikTok Ads in Month 2 if Meta performs well
- Build email retargeting list from cart abandoners
