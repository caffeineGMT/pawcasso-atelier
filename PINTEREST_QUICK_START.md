# Pinterest Quick Start Guide

This is your TL;DR implementation checklist. Complete these steps to launch Pawcasso Atelier on Pinterest in Week 1.

---

## Phase 1: Account Setup (Day 1 - 30 minutes)

### Step 1: Create Pinterest Business Account
- [ ] Go to business.pinterest.com
- [ ] Sign up with business email
- [ ] Profile name: "Pawcasso Atelier | Custom AI Pet Portraits"
- [ ] Username: @pawcassoatelier
- [ ] Profile description:
  > "Transform your pet into stunning AI art in 24 hours 🎨 Custom portraits from $9. 16+ styles: Renaissance, Pixar 3D, Needle Felt & more. Shop now ↓"
- [ ] Upload profile photo (logo or Cat Vermeer portrait)
- [ ] Add website: pawcasso-atelier.vercel.app

### Step 2: Verify Website Domain
- [ ] In Pinterest settings → Claim → Claim Website
- [ ] Choose "Add HTML tag" method
- [ ] Copy verification code: `<meta name="p:domain_verify" content="XXXXXX" />`
- [ ] **Already added to website code** (see website/src/app/layout.tsx:148)
- [ ] Just replace "PINTEREST_VERIFICATION_CODE_HERE" with your actual code
- [ ] Click "Verify" in Pinterest dashboard

### Step 3: Install Pinterest Tag
- [ ] In Pinterest settings → Conversions → Install Tag
- [ ] Copy your Pinterest Tag ID (format: 123456789012)
- [ ] Add to `.env.local`:
  ```
  NEXT_PUBLIC_PINTEREST_TAG_ID=123456789012
  ```
- [ ] **Already installed in code** (see website/src/app/layout.tsx:117-135)
- [ ] Deploy to production
- [ ] Verify installation at: https://help.pinterest.com/en/business/article/track-conversions-with-pinterest-tag

### Step 4: Enable Rich Pins
- [ ] In Pinterest settings → Rich Pins → Apply Now
- [ ] Select "Product Pins"
- [ ] Enter website URL: pawcasso-atelier.vercel.app/order
- [ ] **Product schema already added** (see website/src/app/order/page.tsx:194-225)
- [ ] Validate at: https://developers.pinterest.com/tools/url-debugger/
- [ ] Submit for approval (usually approved within 24-48 hours)

---

## Phase 2: Generate Pinterest Pins (Day 1 - 10 minutes)

### Step 5: Run Pin Generator Script
```bash
cd website
npm run generate-pins
```

This generates:
- ✅ 150+ Pinterest-optimized pin images (1000x1500px, 1000x1000px, 1000x2000px)
- ✅ 5 variations per gallery image (product-cta, minimal, style-focus, animal-focus, gift-angle)
- ✅ Text overlays with brand colors
- ✅ CSV file for bulk upload to Pinterest
- ✅ All pins saved to: `website/public/pinterest-pins/`

### Step 6: Upload Pins to Public Directory
- [ ] Commit generated pins to git (if deploying to Vercel)
- [ ] OR upload to Vercel manually
- [ ] Verify pins are accessible at: pawcasso-atelier.vercel.app/pinterest-pins/1_product-cta_standard.png

---

## Phase 3: Create Pinterest Boards (Day 2 - 1 hour)

### Step 7: Create 10 Boards
Use **exact board names and descriptions** from `PINTEREST_BOARD_SETUP.md`:

**Quick board list:**
1. AI Pet Portraits ($9 — Official Products)
2. Dog Portrait Ideas
3. Cat Portrait Art
4. Pet Memorial Gifts
5. Unique Pet Gifts Under $20
6. Border Collie Art
7. Shiba Inu Artwork
8. Pixar-Style Pet Art
9. Needle Felt Pet Portraits
10. Pet Art Gallery Inspiration

**For each board:**
- [ ] Create board with exact name
- [ ] Copy-paste SEO description from PINTEREST_BOARD_SETUP.md
- [ ] Set category (Art, Pets, or Gifts)
- [ ] Upload cover image
- [ ] Set to Public

---

## Phase 4: Bulk Upload Pins (Day 2-3 - 2 hours)

### Option A: Manual Upload (Recommended for First Time)
- [ ] Go to Pinterest → Create Pin
- [ ] Upload image from `website/public/pinterest-pins/`
- [ ] Title: "[Animal] Portrait — [Style] — $9"
- [ ] Description: Copy from `pinterest_bulk_upload.csv`
- [ ] Link: pawcasso-atelier.vercel.app/order?utm_source=pinterest&utm_medium=pin
- [ ] Board: Select appropriate board
- [ ] Publish

**Repeat for first 20 pins** to test and refine.

### Option B: Bulk Upload via CSV (Advanced)
- [ ] Download Pinterest CSV template
- [ ] Use generated `pinterest_bulk_upload.csv` (already formatted)
- [ ] Go to Pinterest → Bulk Create Pins
- [ ] Upload CSV
- [ ] Review and publish

### Option C: Use Tailwind App (Recommended for Scale)
- [ ] Sign up at tailwindapp.com ($15/mo)
- [ ] Connect Pinterest account
- [ ] Upload all 150 pins
- [ ] Schedule 10 pins/day for 30 days
- [ ] Set posting time: 8-11pm EST
- [ ] Auto-publish

---

## Phase 5: Schedule Content (Day 3 - 30 minutes)

### Step 8: Set Up Posting Schedule
Use **Tailwind App** or **Later** to schedule:
- [ ] 10 pins per day
- [ ] Best times: 8-11pm EST, Saturday mornings
- [ ] Follow content calendar: PINTEREST_CONTENT_CALENDAR.md
- [ ] Mix: 60% product pins, 20% educational, 20% curated

### Step 9: Engage Daily (5 min/day)
- [ ] Respond to comments
- [ ] Repin popular pet content to build community
- [ ] Follow relevant accounts (pet blogs, pet product brands, dog/cat lovers)

---

## Phase 6: Track & Optimize (Ongoing)

### Step 10: Monitor Pinterest Analytics
- [ ] Go to Pinterest → Analytics
- [ ] Track weekly:
  - Impressions (goal: 1K/week)
  - Saves (goal: 50/week)
  - Clicks (goal: 20/week)
  - Followers (goal: 50 by Month 1)

### Step 11: Google Analytics Tracking
- [ ] Go to Google Analytics → Acquisition → Traffic Sources
- [ ] Filter by `utm_source=pinterest`
- [ ] Track conversions from Pinterest traffic
- [ ] Compare conversion rate vs other channels

### Step 12: Weekly Optimization
- [ ] Identify top 10 performing pins (highest saves + clicks)
- [ ] Create 5 new variations of winners
- [ ] Re-pin top performers to additional boards
- [ ] Archive pins with <5 impressions/week

---

## Success Metrics (30-Day Goals)

**Week 1:**
- ✅ Account verified
- ✅ 10 boards created
- ✅ 70 pins published
- ✅ 500 impressions

**Week 2:**
- ✅ 140 total pins
- ✅ 1,500 impressions
- ✅ 20 saves
- ✅ 5 website clicks

**Week 3:**
- ✅ 210 total pins
- ✅ 3,000 impressions
- ✅ 50 saves
- ✅ 15 website clicks

**Week 4:**
- ✅ 300 total pins
- ✅ 5,000 impressions
- ✅ 100 saves
- ✅ 30 website clicks
- ✅ 5 orders from Pinterest

**Month 3 (Scale):**
- ✅ 10,000 monthly impressions
- ✅ 500 saves
- ✅ 200 website clicks
- ✅ 20-50 orders from Pinterest

---

## Common Issues & Fixes

### Issue: Rich Pins Not Working
**Fix:**
- Validate at https://developers.pinterest.com/tools/url-debugger/
- Check that Product schema is on the page (already added to /order page)
- Re-submit for approval if rejected
- Wait 24-48 hours for approval

### Issue: Low Impressions
**Fix:**
- Post more frequently (15-20 pins/day)
- Use better keywords (see PINTEREST_STRATEGY.md for top 20 keywords)
- Create taller pins (1000x2000px performs better)
- Re-pin popular content to increase board authority

### Issue: High Impressions, Low Clicks
**Fix:**
- Add stronger CTAs to pin text overlays ("Order Now", "Shop $9")
- Test different link placements
- A/B test pin designs (text vs no text)
- Improve pin descriptions with compelling copy

### Issue: High Clicks, No Conversions
**Fix:**
- Check landing page /order for UX issues
- Ensure mobile responsiveness
- Add Pinterest-specific discount code (10% off for Pinterest users)
- Retarget Pinterest visitors with Meta/Google Ads

---

## Budget Breakdown

**Free Plan (DIY):**
- Pinterest Business account: Free
- Manual pin creation: Free
- Total: $0/month

**Recommended Plan:**
- Tailwind scheduler: $15/month
- Canva Pro (optional): $13/month
- Total: $15-28/month

**Growth Plan (with ads):**
- Tailwind: $15/month
- Pinterest Ads: $150/month ($5/day)
- Total: $165/month

---

## Next Steps After Week 1

1. **Week 2-4:** Continue posting 10 pins/day, track analytics
2. **Month 2:** Expand to 15 pins/day, test Pinterest Ads on top performers
3. **Month 3:** Collaborate with pet influencers, launch seasonal campaigns
4. **Month 6:** Scale to 20 pins/day, build Pinterest community

---

## Resources

**Pinterest for Business:**
- Pinterest Business Hub: business.pinterest.com
- Pinterest Academy (Free courses): business.pinterest.com/academy
- Pinterest Trends: trends.pinterest.com
- URL Debugger: developers.pinterest.com/tools/url-debugger/

**Scheduling Tools:**
- Tailwind: tailwindapp.com
- Later: later.com

**Design:**
- Canva Pinterest Templates: canva.com/create/pinterest-pins/
- Already generated: 150+ pins via `npm run generate-pins`

**Analytics:**
- Pinterest Analytics: pinterest.com/analytics
- Google Analytics: analytics.google.com

---

## Support

**Questions?**
- DM @pawcassoatelier on Instagram
- Email: support@pawcasso-atelier.vercel.app
- Pinterest Help: help.pinterest.com/en/business

---

**Last Updated:** March 2026
**Estimated Time to Launch:** 3-4 hours (spread over 3 days)
**Expected ROI:** 20-50 orders/month by Month 3 = $180-450 revenue (vs $15-28/month cost)
