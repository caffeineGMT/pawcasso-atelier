# Google Ads Campaign - Quick Start Guide

**Campaign Budget:** $2,000/month ($67/day)
**Target ROAS:** 3x minimum
**Expected Revenue:** $6,000+/month

---

## 🚀 Launch in 4 Steps

### Step 1: Set Up Google Merchant Center (30 minutes)

1. **Create account:** https://merchants.google.com
2. **Verify domain:** pawcasso-atelier.vercel.app
   - Go to Settings > Business Information > Website
   - Follow domain verification steps (HTML tag or DNS)
3. **Add shipping & returns policy:**
   - Shipping: "Digital delivery - instant download via email"
   - Return policy: "100% money-back guarantee - 30 days"
4. **Submit product feed:**
   - Feed type: Google Sheets or XML
   - Feed URL: `https://pawcasso-atelier.vercel.app/product-feed.xml`
   - Schedule: Daily auto-fetch
5. **Wait for approval:** Usually 1-3 business days

### Step 2: Set Up Conversion Tracking (20 minutes)

1. **Create conversions in Google Ads:**
   - Go to Google Ads > Tools > Conversions
   - Create 3 conversion actions:

   **Purchase Conversion:**
   - Click "+ New conversion action"
   - Choose "Website"
   - Goal: Purchase
   - Value: Transaction-specific (use the value from each purchase)
   - Count: Every conversion
   - Click-through window: 30 days
   - View-through window: 1 day
   - Copy the Conversion ID (AW-XXXXXXXXXX) and Label

   **Add to Cart Conversion:**
   - Goal: Add to cart
   - Value: Use the same value for each conversion
   - Count: Every conversion

   **Begin Checkout Conversion:**
   - Goal: Begin checkout
   - Value: Use the same value for each conversion
   - Count: Every conversion

2. **Add to Vercel environment variables:**
   ```bash
   # Go to Vercel Dashboard > Your Project > Settings > Environment Variables
   NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID=AW-XXXXXXXXXX
   NEXT_PUBLIC_GOOGLE_ADS_LABEL_PURCHASE=XXXXXXXXXXXX
   NEXT_PUBLIC_GOOGLE_ADS_LABEL_ADD_TO_CART=XXXXXXXXXXXX
   NEXT_PUBLIC_GOOGLE_ADS_LABEL_BEGIN_CHECKOUT=XXXXXXXXXXXX
   ```

3. **Test tracking:**
   - Make a test $9 purchase
   - Check Google Ads > Tools > Conversions
   - Verify the purchase shows up (may take 5-10 minutes)

### Step 3: Create Shopping Campaign (20 minutes)

1. **New Campaign:**
   - Campaign type: Performance Max
   - Goal: Sales
   - Budget: $40/day
   - Bidding: Maximize conversion value with target ROAS 300%

2. **Campaign Settings:**
   - Name: "Pawcasso - Shopping - Performance Max"
   - Location: United States, Canada, UK, Australia
   - Language: English
   - Final URL expansion: ON
   - Start date: Today
   - End date: None

3. **Asset Group:**
   - Business name: Pawcasso Atelier
   - Add 15 headlines (see GOOGLE_ADS_CAMPAIGN_SETUP.md)
   - Add 5 long headlines
   - Add 5 descriptions
   - Upload 10+ product images from /gallery/
   - Add logo if available

4. **Audience Signals:**
   - Custom segments: "pet portrait", "custom pet art", "pet gifts"
   - Demographics: 25-65 years, all genders, HHI $50k+
   - Interests: Pet owners, dog/cat lovers, gift shoppers

5. **Launch!**

### Step 4: Create Search Campaign (30 minutes)

1. **New Campaign:**
   - Campaign type: Search
   - Goal: Sales
   - Budget: $27/day
   - Bidding: Maximize conversions with target CPA $20

2. **Campaign Settings:**
   - Name: "Pawcasso - Search - Custom Pet Portraits"
   - Networks: Google Search only (uncheck Display)
   - Location: United States, Canada, UK, Australia
   - Language: English
   - Dynamic search ads: OFF

3. **Create 3 Ad Groups:**

   **Ad Group 1: Exact Match - High Intent**
   - Budget: $11/day
   - Keywords (Exact Match):
     ```
     [custom pet portrait]
     [ai pet portrait]
     [pet portrait artist]
     [custom dog portrait]
     [custom cat portrait]
     ```

   **Ad Group 2: Phrase Match - Medium Intent**
   - Budget: $8/day
   - Keywords (Phrase Match):
     ```
     "pet portrait"
     "dog portrait"
     "cat portrait"
     "pet art"
     "custom pet art"
     ```

   **Ad Group 3: Gift Buyers**
   - Budget: $8/day
   - Keywords (Phrase Match):
     ```
     "pet gifts"
     "dog owner gifts"
     "cat owner gifts"
     "pet memorial"
     "unique pet gifts"
     ```

4. **Write Ads:**
   - Create 3 responsive search ads per ad group
   - Use headlines from GOOGLE_ADS_CAMPAIGN_SETUP.md
   - Add sitelinks, callouts, structured snippets

5. **Add Negative Keywords:**
   ```
   free, template, diy, tutorial, app, software, jobs
   ```

6. **Launch!**

---

## 📊 Week 1 Checklist

- [ ] **Day 1:** Verify conversion tracking works (test purchase)
- [ ] **Day 1-7:** Let campaigns learn (minimal changes)
- [ ] **Daily:** Check Search Terms Report, add negative keywords
- [ ] **Daily:** Monitor spend and conversions
- [ ] **Day 7:** Review performance, identify top performers

**Target Week 1 Results:**
- 10-15 conversions minimum (for algorithm learning)
- ROAS: 1.5x+ (will improve over time)
- Cost per conversion: $25-35 (will decrease over time)

---

## 🎯 Optimization Roadmap

**Week 2:**
- Adjust bids based on performance
- Pause keywords with CPA > $40
- Test new ad copy variations
- Add more negative keywords

**Week 3-4:**
- Optimize for 2-3x ROAS
- Scale winning campaigns (+20% budget)
- Create RLSA remarketing lists
- Test landing page variations

**Month 2:**
- Aim for consistent 3x+ ROAS
- Launch seasonal campaigns (holidays, pet memorial)
- Add customer match audiences
- Expand to new geographies if profitable

---

## 🔍 Key Metrics to Watch

| Metric | Target | Current |
|--------|--------|---------|
| ROAS | 3x+ | - |
| Cost per Conversion | $15-25 | - |
| Conversion Rate | 3-5% | - |
| Click-Through Rate (Search) | 3-5% | - |
| Click-Through Rate (Shopping) | 0.5-1% | - |
| Average Order Value | $40+ | - |

Track these daily in Google Ads dashboard.

---

## 🆘 Troubleshooting

**Products not approved in Merchant Center?**
- Check feed errors: Merchant Center > Products > Diagnostics
- Common issues: Missing image URLs, invalid landing pages
- Fix feed and resubmit: feed updates daily automatically

**No conversions showing up?**
- Use Google Tag Assistant Chrome extension to verify tracking
- Check browser console for errors (F12 > Console)
- Verify env variables are set in Vercel
- Make a test purchase and wait 5-10 minutes

**High cost per conversion (> $40)?**
- Add more negative keywords (pause wasted clicks)
- Lower target ROAS temporarily (200% instead of 300%)
- Focus budget on exact match keywords
- Check if landing page loads slowly (optimize images)

**Low impressions / clicks?**
- Increase daily budget temporarily (+50%)
- Expand keyword match types (add broad match)
- Lower target CPA/ROAS
- Check if ads are disapproved (Policy violations)

---

## 📁 Files Created

- `/website/public/product-feed.xml` - Google Shopping product feed
- `/website/src/lib/google-ads.ts` - Tracking functions
- `/website/src/components/GoogleAdsConversionTracker.tsx` - Purchase conversion tracker
- `/GOOGLE_ADS_CAMPAIGN_SETUP.md` - Full campaign setup guide (detailed)
- `/GOOGLE_ADS_QUICKSTART.md` - This quick start guide
- `/.env.google-ads.example` - Environment variable template

---

## 📞 Support

- **Google Ads Support:** 1-866-246-6453
- **Merchant Center Help:** https://support.google.com/merchants
- **Conversion Tracking Help:** https://support.google.com/google-ads/answer/1722022

---

## 🎉 Ready to Launch?

1. ✅ Merchant Center set up + feed approved
2. ✅ Conversion tracking installed + tested
3. ✅ Shopping campaign created
4. ✅ Search campaign created
5. ✅ Daily monitoring plan in place

**Launch campaigns and let Google's algorithm learn for 7 days!**

Expected first month results:
- **Spend:** $2,000
- **Revenue:** $6,000-7,000
- **Profit:** $4,000-5,000
- **ROAS:** 3-3.5x

Good luck! 🚀
