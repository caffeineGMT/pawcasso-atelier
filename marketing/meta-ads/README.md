# Pawcasso Atelier - Meta Ads Campaign Kit

Complete Meta Ads campaign setup for launching Pawcasso Atelier's AI pet portrait business.

**Campaign Goal:** Acquire 50+ customers at $40 CPA with $2,000 budget over 30 days.

---

## 📁 Directory Structure

```
meta-ads/
├── CAMPAIGN_OVERVIEW.md          # Complete campaign strategy & structure
├── LAUNCH_GUIDE.md                # Step-by-step Ads Manager setup
├── README.md                      # This file
├── copy/
│   └── ad-copy-variants.json      # All ad copy & headlines (5 variants)
├── creatives/
│   ├── CREATIVE_SPECIFICATIONS.md # Image/video specs & design guidelines
│   └── generate-carousel-images.sh # Script to create carousel images
└── tracking/
    ├── meta-pixel-implementation.tsx # React/TypeScript tracking code
    └── TRACKING_SETUP_GUIDE.md      # Pixel & Conversions API setup
```

---

## 🚀 Quick Start (3-Step Launch)

### Step 1: Set Up Tracking (30 min)
```bash
cd tracking/
# Follow TRACKING_SETUP_GUIDE.md to:
# 1. Create Meta Pixel
# 2. Install pixel on website
# 3. Set up conversion events
# 4. Test with Meta Pixel Helper
```

### Step 2: Generate Creative Assets (1 hour)
```bash
cd creatives/
./generate-carousel-images.sh
# Manual: Create 15-second video slideshow in Canva/CapCut
```

### Step 3: Launch Campaign in Ads Manager (2 hours)
Follow `LAUNCH_GUIDE.md` for complete walkthrough:
- Create 3 ad sets (Lookalike audiences + Cold traffic)
- Upload 5 ad variants (2 static, 2 carousel, 1 video)
- Set $2,000 budget with $40 CPA goal
- Launch & monitor

---

## 📊 Campaign Structure

### Budget Allocation
- **Total:** $2,000 over 30 days (~$66.67/day)
- **Ad Set 1:** Lookalike Website Visitors (40% = $800)
- **Ad Set 2:** Lookalike Instagram Engagers (35% = $700)
- **Ad Set 3:** Cold Broad Targeting (25% = $500)

### Ad Creatives (5 Variants)
1. **Static Hero** - Cat Vermeer portrait (Emotional copy)
2. **Static Grid** - 2x2 style showcase (Value copy)
3. **Carousel Styles** - 6 cards showcasing different art styles
4. **Carousel Process** - 5 cards showing how it works
5. **Video Slideshow** - 15-second slideshow of 10 portraits

### Targeting
- **Locations:** United States, Canada, UK, Australia
- **Age:** 25-55
- **Interests:** Pet Owners, Dog Lovers, Cat Lovers, Pet Gifts, Custom Portraits
- **Placements:** Facebook & Instagram (Feed, Stories, Reels)

---

## 📈 Performance Goals

| Metric | Target | Acceptable | Excellent |
|--------|--------|------------|-----------|
| CPA | $40 | ≤ $50 | ≤ $30 |
| CTR | 1.5% | ≥ 1.0% | ≥ 2.5% |
| ROAS | 0.225 | ≥ 0.18 | ≥ 0.30 |
| Conversions | 50 | 40+ | 65+ |
| Landing Page CVR | 3% | ≥ 2% | ≥ 5% |

**Revenue Projection:** 50 orders × $9 = $450
**Ad Spend:** $2,000
**Initial ROAS:** 0.225 (not profitable - audience validation phase)

---

## 🛠️ Tools Required

### Meta Business Tools
- [Meta Business Manager](https://business.facebook.com/)
- [Meta Ads Manager](https://business.facebook.com/adsmanager)
- [Meta Events Manager](https://business.facebook.com/events_manager2)
- [Meta Pixel Helper Chrome Extension](https://chrome.google.com/webstore/detail/meta-pixel-helper)

### Creative Production (Free Options)
- **Images:** Canva, Figma, or Photopea
- **Video:** Canva Video, CapCut, or Kapwing
- **Stock Assets:** Unsplash, Pexels, Pixabay

### Analytics & Tracking
- Meta Pixel (browser-side tracking)
- Conversions API (server-side tracking)
- Google Analytics (optional, for cross-validation)

---

## 📅 Timeline

### Pre-Launch (Week 0)
- Day 1-2: Install Meta Pixel, test tracking
- Day 3-5: Generate creative assets (images + video)
- Day 6: Set up audiences in Ads Manager
- Day 7: Build campaign, review, launch

### Launch (Week 1)
- Days 1-3: Learning phase (no changes, monitor only)
- Days 4-7: Optimize (pause underperformers)

### Optimization (Weeks 2-3)
- Scale winning ad sets by 20%
- Introduce new creative variants
- Test headline/copy variations

### Scale (Week 4)
- Allocate 80% budget to top 2 ad sets
- Create Purchaser Lookalike Audience
- Plan next campaign phase

---

## 🎯 Success Criteria

### Campaign Success
✅ CPA ≤ $50 throughout 30 days
✅ 40+ purchases (minimum)
✅ CTR ≥ 1.5%
✅ No ad disapprovals
✅ Pixel tracking 95%+ accuracy

### Next Steps After Success
1. Scale to $5K/month budget
2. Test higher price points ($15-25)
3. Add upsells (framed prints, multi-pack bundles)
4. Expand to Pinterest, TikTok, Google Ads
5. Build retargeting funnel for cart abandoners

---

## ⚠️ Common Issues & Fixes

### Ads Not Delivering
- **Check:** Account not restricted, payment method active
- **Fix:** Verify in Business Manager settings

### High CPA (> $60)
- **Check:** Landing page conversion rate
- **Fix:** Pause worst ads, tighten targeting, refresh creative

### Pixel Not Tracking Purchases
- **Check:** Pixel on success page, Test Events tool
- **Fix:** Follow tracking/TRACKING_SETUP_GUIDE.md

### Low CTR (< 1%)
- **Check:** Ad creative quality, copy relevance
- **Fix:** Test brighter images, more urgent headlines, video ads

---

## 📚 Documentation Index

| File | Purpose | Read Time |
|------|---------|-----------|
| `CAMPAIGN_OVERVIEW.md` | Full campaign strategy, budget breakdown, targeting | 15 min |
| `LAUNCH_GUIDE.md` | Step-by-step Ads Manager setup walkthrough | 30 min |
| `copy/ad-copy-variants.json` | All 5 ad copy variants with headlines | 10 min |
| `creatives/CREATIVE_SPECIFICATIONS.md` | Image/video specs, design guidelines | 15 min |
| `tracking/TRACKING_SETUP_GUIDE.md` | Meta Pixel & Conversions API setup | 20 min |
| `tracking/meta-pixel-implementation.tsx` | Code snippets for tracking events | 10 min |

**Total Reading Time:** ~90 minutes

---

## 🔗 Useful Links

- [Meta Ads Manager](https://business.facebook.com/adsmanager)
- [Meta Events Manager](https://business.facebook.com/events_manager2)
- [Meta Pixel Helper Extension](https://chrome.google.com/webstore/detail/meta-pixel-helper)
- [Meta Ads Help Center](https://www.facebook.com/business/help)
- [Creative Best Practices](https://www.facebook.com/business/ads-guide)
- [Pawcasso Website](https://pawcasso-atelier.vercel.app)
- [Pawcasso Instagram](https://instagram.com/pawcasso.atelier)

---

## 💡 Pro Tips

1. **Learning Phase:** Don't touch anything for first 72 hours
2. **Creative Testing:** Always have 2-3 ads per ad set
3. **Budget Pacing:** Let CBO do its job, trust the algorithm
4. **Audience Overlap:** Keep overlap below 30%
5. **UTM Tracking:** Always add UTM parameters to track source
6. **Mobile-First:** 80% of traffic is mobile, design for small screens
7. **Video Captions:** 85% watch without sound, add captions
8. **A/B Testing:** Test one variable at a time (headline OR image, not both)

---

## 📞 Support

**Issues?**
- Check `LAUNCH_GUIDE.md` Troubleshooting section
- Consult Meta Ads Help Center
- Review `tracking/TRACKING_SETUP_GUIDE.md` for pixel issues

**Questions?**
- All documentation is in this folder
- Review `CAMPAIGN_OVERVIEW.md` for strategic decisions
- Check `creatives/CREATIVE_SPECIFICATIONS.md` for design questions

---

## 📊 Reporting Template

**Weekly Performance Review (Copy to Google Sheets):**

| Metric | Week 1 | Week 2 | Week 3 | Week 4 | Total |
|--------|--------|--------|--------|--------|-------|
| Spend | | | | | $2,000 |
| Impressions | | | | | |
| Clicks | | | | | |
| CTR | | | | | |
| CPC | | | | | |
| Purchases | | | | | 50 |
| CPA | | | | | $40 |
| Revenue | | | | | $450 |
| ROAS | | | | | 0.225 |

---

## ✅ Launch Checklist

Pre-Launch:
- [ ] Meta Pixel installed and verified
- [ ] All conversion events tested
- [ ] Creative assets generated (2 static, 2 carousel, 1 video)
- [ ] Custom audiences created (Website, Instagram)
- [ ] Lookalike audiences created (1% LAL)
- [ ] Payment method added to Business Manager
- [ ] Facebook Page and Instagram account linked

Campaign Setup:
- [ ] Campaign created with Sales objective
- [ ] CBO enabled with $2,000 budget
- [ ] 3 ad sets created with correct targeting
- [ ] 5 ads uploaded with UTM parameters
- [ ] All ads approved (no policy violations)

Post-Launch:
- [ ] Monitoring setup (daily checks scheduled)
- [ ] Automated rules configured (pause if CPA > $70)
- [ ] Reporting template ready
- [ ] Optimization plan documented

---

**Ready to launch? Start with `LAUNCH_GUIDE.md` → Step 1!** 🚀
