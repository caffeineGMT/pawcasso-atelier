# Facebook/Instagram Retargeting - Quick Start Guide

**Quick reference for launching Facebook/Instagram retargeting campaigns for Pawcasso Atelier.**

---

## TL;DR - What to Do

1. **Week 1:** Set up Meta Pixel, verify domain, create audiences
2. **Week 2:** Build audiences (need 100+ people minimum)
3. **Week 3:** Launch retargeting campaigns ($500/month budget)
4. **Week 6+:** Create lookalike audiences (after 100 purchases)

**Expected ROI:** 2.5x-3.5x ROAS ($1,250-$1,750 revenue from $500 spend)

---

## Status Checklist

### Technical Setup ✅
- [x] Meta Pixel installed (website/src/app/layout.tsx)
- [x] Client-side event tracking implemented
- [x] Server-side Conversions API ready
- [x] Analytics functions created (AddToCart, Lead, Purchase, etc.)

### Next Steps (You Need To Do)
- [ ] Create Facebook Business Manager account
- [ ] Get Meta Pixel ID from Business Manager
- [ ] Add `NEXT_PUBLIC_META_PIXEL_ID` to Vercel env vars
- [ ] Get Conversions API access token
- [ ] Add `META_CONVERSIONS_API_ACCESS_TOKEN` to Vercel env vars
- [ ] Verify domain (add meta tag to layout.tsx)
- [ ] Create 6 custom audiences in Ads Manager
- [ ] Wait 14 days to build audiences (100+ people each)
- [ ] Launch 4 retargeting campaigns

---

## The 6 Critical Audiences

| Audience | Criteria | Size Target | Priority |
|----------|----------|-------------|----------|
| **Cart Abandoners** | Uploaded photo BUT didn't purchase | 50-100 | 🔥 HIGHEST |
| **Checkout Abandoners** | Started checkout BUT didn't purchase | 30-70 | High |
| **Gallery Browsers** | Visited /gallery page | 300-500 | Medium |
| **Email Leads** | Captured email but didn't purchase | 100-200 | Medium |
| **Website Visitors** | Visited any page | 1,000+ | Low |
| **Past Customers** | Completed purchase | Growing | Lookalikes only |

---

## The 4 Retargeting Campaigns

| Campaign | Budget | Audience | Goal |
|----------|--------|----------|------|
| **Cart Abandoner Recovery** | $250/mo (50%) | Cart Abandoners | 10% off → Complete order |
| **Gallery Browser Conversion** | $150/mo (30%) | Gallery Browsers | Show best styles, $9 offer |
| **Email Lead Nurture** | $50/mo (10%) | Email Leads | Use 15% discount code |
| **Website Visitor Retargeting** | $50/mo (10%) | Website Visitors | Brand awareness |

---

## Event Tracking Reference

| Event | Where it fires | Purpose |
|-------|---------------|---------|
| **PageView** | All pages | General audience building |
| **ViewContent** | Gallery, pricing | Product interest |
| **AddToCart** | Photo upload on /order | 🔥 **Cart abandoners** (key signal!) |
| **InitiateCheckout** | Order form submit | Checkout abandoners |
| **AddPaymentInfo** | Before Stripe redirect | Payment intent |
| **Purchase** | Order success | Purchasers (lookalike source) |
| **Lead** | Email capture modal | Email leads |
| **Search** | Gallery filters | Interest targeting |

---

## Ad Creative Templates (Copy & Paste)

### Cart Abandoner Ad

**Headline:** "Complete Your Portrait - 10% Off Inside"

**Body:**
```
You're so close to getting your custom pet portrait! 🐾

We saved your order:
✓ Pet photo uploaded
✓ Style selected
✓ Delivery in 24 hours

Complete checkout now and save 10% with code: COMPLETE10

Limited slots available → [Finish Order]
```

**Image:** Before/after carousel of pet → AI portrait

---

### Gallery Browser Ad

**Headline:** "Transform Your Pet Into Art - $9"

**Body:**
```
Turn your pet into stunning artwork 🎨

✨ 17 art styles (Renaissance, Pixar, Ghibli, & more)
⚡ Delivered in 24 hours
🖼️ Print-ready quality
💰 Just $9

Upload photo. Pick style. Get masterpiece.

[Order Now]
```

**Image:** 3x3 grid of best gallery examples

---

### Email Lead Ad

**Headline:** "Use Your 15% Discount - Limited Time"

**Body:**
```
Don't forget - you have a special discount waiting! ✨

Your exclusive code: FIRST15

Get 15% off your first custom pet portrait:
🎨 Choose from 17 artistic styles
📦 Delivered in 24 hours
💝 Perfect gift for any pet lover

Code expires soon → [Shop Now]
```

**Image:** Testimonial + 5-star rating

---

## Budget Allocation

**Total:** $500/month ($16.67/day)

- **50%** ($250) → Cart Abandoner Recovery (highest ROI)
- **30%** ($150) → Gallery Browser Conversion
- **10%** ($50) → Email Lead Nurture
- **10%** ($50) → Website Visitor Retargeting

**After 90 days** (once you have 100+ purchases):
- Shift $300/mo to lookalike campaigns
- Keep $200/mo for retargeting

---

## Success Metrics

### Phase 1: Weeks 1-2 (Audience Building)
- ✅ 1,000+ website visitors tracked
- ✅ 50+ photo uploads (AddToCart events)
- ✅ 100+ email captures (Lead events)
- ✅ All audiences created and populating

### Phase 2: Weeks 3-4 (Retargeting Launch)
- 🎯 ROAS: 2.5x minimum ($1,250 revenue)
- 🎯 Cart abandoner conversion: 15-25%
- 🎯 Cost per purchase: $15-25
- 🎯 Total sales: 20-30 purchases

### Phase 3: Month 3+ (Lookalike Scaling)
- 🎯 ROAS: 3.0x+ ($1,500+ revenue)
- 🎯 100+ total purchases (enables lookalikes)
- 🎯 Total sales: 40-60 purchases/month
- 🎯 Scale budget +20% when ROAS > 3.5x

---

## Quick Wins

1. **Cart abandoners convert at 15-25%** - prioritize this audience!
2. **Carousel ads outperform static** - show transformations
3. **Instagram > Facebook** for pet content
4. **Mobile-first** - 80%+ of traffic is mobile
5. **Test discount codes** - 10% vs 15% vs urgency messaging
6. **Repost customer photos** - UGC builds trust
7. **Run ads in Feed + Stories + Reels** - automatic placements work best

---

## Common Mistakes to Avoid

❌ **Launching ads before audiences reach 100+ people** → Poor delivery
❌ **Not excluding purchasers from retargeting** → Wasted budget
❌ **Using only static images** → Lower engagement
❌ **Ignoring mobile optimization** → Lost conversions
❌ **Setting budget too high too fast** → Inefficient learning phase
❌ **Not monitoring ROAS daily** → Budget waste
❌ **Running ads without domain verification** → iOS attribution loss

---

## Timeline

### Week 1: Setup
- Create Business Manager
- Install Pixel (already done ✅)
- Verify domain
- Set up Conversions API

### Week 2: Audience Building
- Create 6 custom audiences
- Drive traffic to site
- Let audiences populate (need 100+ people)

### Week 3: Launch Campaigns
- Create ad creatives
- Launch 4 retargeting campaigns
- Monitor daily, optimize weekly

### Week 4-12: Optimize & Scale
- A/B test creatives
- Pause underperformers (ROAS < 1.5x)
- Scale winners (+20% budget)
- Test new audiences

### Month 3+: Lookalike Expansion
- Create 1%, 2%, 5% lookalikes
- Launch prospecting campaigns
- Scale to $1,000-2,000/month budget

---

## File Reference

| File | Purpose |
|------|---------|
| `facebook-retargeting-campaign.md` | Full campaign strategy (27 pages) |
| `meta-pixel-setup-guide.md` | Complete technical setup guide |
| `RETARGETING-QUICKSTART.md` | This file - quick reference |
| `website/src/lib/analytics.ts` | Client-side event tracking code |
| `website/src/lib/meta-conversions-api.ts` | Server-side tracking code |

---

## Get Help

**Meta Support:**
- Events Manager: https://business.facebook.com/events_manager2
- Pixel Helper: https://chrome.google.com/webstore/detail/meta-pixel-helper/

**Questions?**
- Check full docs in `facebook-retargeting-campaign.md`
- Meta Business Help Center: https://www.facebook.com/business/help

---

**Last Updated:** March 2026
**Ready to launch:** Once Meta Pixel ID and domain verification are complete
