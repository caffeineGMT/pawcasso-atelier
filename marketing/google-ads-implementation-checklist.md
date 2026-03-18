# Google Ads Campaign Implementation Checklist

## ✅ Pre-Launch Setup (Complete These First)

### 1. Technical Setup
- [x] Three landing pages created:
  - `/ai-pet-portraits` - AI/Tech angle
  - `/affordable-portraits` - Affordable/Fast angle
  - `/memorial-portraits` - Memorial/Gift angle
- [ ] Deploy all landing pages to production (Vercel)
- [ ] Test all landing pages on mobile and desktop
- [ ] Verify page load speed <2 seconds (use PageSpeed Insights)
- [ ] Check all UTM parameters are working correctly
- [ ] SSL certificate active (HTTPS)

### 2. Google Ads Account Setup
- [ ] Create Google Ads account (if not exists)
- [ ] Link Google Analytics 4 property
- [ ] Set up billing ($1,000 budget)
- [ ] Create conversion tracking goals
- [ ] Import conversion tracking code (already in codebase)
- [ ] Test conversion tracking with test purchase

### 3. Campaign Creation
- [ ] Create Search campaign: "Pawcasso Atelier - Custom Pet Portraits"
- [ ] Set daily budget: $33/day
- [ ] Enable location targeting (US, CA, UK, AU)
- [ ] Set language: English
- [ ] Disable Search Partners initially
- [ ] Choose bidding: Maximize Clicks (switch to Target CPA after 15 conversions)

### 4. Ad Group 1: AI/Tech Angle
- [ ] Create ad group
- [ ] Add keywords from campaign guide (20+ keywords)
- [ ] Set landing page: `/ai-pet-portraits?utm_source=google&utm_medium=cpc&utm_campaign=ai-tech`
- [ ] Create 3 Responsive Search Ads
- [ ] Add ad extensions (sitelinks, callouts, structured snippets)
- [ ] Set ad group budget: $20/day

### 5. Ad Group 2: Affordable/Fast Angle
- [ ] Create ad group
- [ ] Add keywords from campaign guide (25+ keywords)
- [ ] Set landing page: `/affordable-portraits?utm_source=google&utm_medium=cpc&utm_campaign=affordable-fast`
- [ ] Create 3 Responsive Search Ads
- [ ] Add ad extensions (sitelinks, callouts, price extensions)
- [ ] Set ad group budget: $13/day

### 6. Ad Group 3: Memorial/Gift Angle
- [ ] Create ad group
- [ ] Add keywords from campaign guide (25+ keywords)
- [ ] Set landing page: `/memorial-portraits?utm_source=google&utm_medium=cpc&utm_campaign=memorial-gift`
- [ ] Create 3 Responsive Search Ads
- [ ] Add ad extensions (sitelinks, callouts, structured snippets)
- [ ] Set ad group budget: $10/day

### 7. Negative Keywords
- [ ] Create shared negative keyword list
- [ ] Add 30+ negative keywords from campaign guide
- [ ] Apply to all ad groups

### 8. Ad Extensions (Account-Level)
- [ ] Add business name and logo
- [ ] Add Instagram link (sitelink)
- [ ] Add phone number (if available)
- [ ] Add location (if physical business)

---

## 📊 Week 1: Launch & Monitor

### Day 1 (Launch Day)
- [ ] Go live with all 3 ad groups
- [ ] Check ad approval status (may take 1-2 hours)
- [ ] Monitor for policy violations
- [ ] Check first impressions and clicks
- [ ] Verify conversion tracking fires correctly
- [ ] Screenshot initial metrics (baseline)

### Day 2
- [ ] Review search terms report
- [ ] Check Quality Score (expect 5-6 initially)
- [ ] Add negative keywords if needed
- [ ] Monitor click-through rate (target: 3%+)
- [ ] Check mobile vs desktop performance

### Day 3
- [ ] Review first conversions (if any)
- [ ] Calculate initial CPA
- [ ] Check landing page bounce rate (<60%)
- [ ] Review device performance data
- [ ] Make first bid adjustments (+/- 10%)

### Day 5
- [ ] Pause keywords with 0 clicks and high impressions
- [ ] Increase bids on keywords with CTR >5%
- [ ] Add search terms as new keywords (if CTR >5%)
- [ ] Check ad relevance and messaging alignment
- [ ] Review competitor ads (manual searches)

### Day 7 (End of Week 1)
- [ ] Weekly performance report
- [ ] Check total spend vs budget
- [ ] Calculate Week 1 CPA
- [ ] Review Quality Scores (target: 6+)
- [ ] Pause keywords with CPA >$60 (min 10 clicks)
- [ ] Identify best-performing ad group
- [ ] Make budget reallocation decisions

**Week 1 Goals:**
- 300+ clicks
- 3%+ CTR
- 10+ conversions
- <$100 CPA (learning phase)

---

## 📈 Week 2-4: Optimize

### Weekly Tasks (Every Monday)
- [ ] Performance review meeting
- [ ] Check CPA for each ad group (target: <$30)
- [ ] Check ROAS (target: >330%)
- [ ] Review Quality Score improvements
- [ ] Update bid adjustments
- [ ] Shift budget to best-performing ad group

### Weekly Tasks (Every Wednesday)
- [ ] Search terms report review
- [ ] Add 10+ negative keywords
- [ ] Test new ad copy variations
- [ ] Check landing page heatmaps (Hotjar/Clarity)
- [ ] A/B test landing page elements

### Weekly Tasks (Every Friday)
- [ ] Competitor analysis (manual searches)
- [ ] Update ad extensions
- [ ] Review Google Analytics data
- [ ] Plan next week's optimizations
- [ ] Document learnings and insights

### End of Month 1
- [ ] Switch to Target CPA bidding (if 30+ conversions)
- [ ] Create monthly performance report
- [ ] Calculate final CPA and ROAS
- [ ] Identify scaling opportunities
- [ ] Plan Month 2 budget and strategy

**Month 1 Goals:**
- 1,000+ clicks
- 3.5%+ CTR
- 30+ conversions
- $30-40 CPA
- 330%+ ROAS

---

## 🚀 Month 2+: Scale

### Scaling Checklist
- [ ] Increase budget by 20% if ROAS >400%
- [ ] Launch remarketing campaigns ($200/month)
- [ ] Test Dynamic Search Ads ($100/month)
- [ ] Create Google Shopping feed
- [ ] Launch Performance Max campaign ($200/month)
- [ ] Expand to new keywords (long-tail)
- [ ] Test new ad angles and messaging

### Advanced Optimization
- [ ] Set up automated rules (pause low performers)
- [ ] Create custom audiences (pet owners, art buyers)
- [ ] Add audience targeting overlays
- [ ] Test customer match lists (email list)
- [ ] Implement ad scheduling bid adjustments
- [ ] Test demographic bid adjustments

---

## 🔧 Tools & Resources

### Required Tools
- **Google Ads:** Campaign management
- **Google Analytics 4:** Traffic and conversion analysis
- **Google Tag Manager:** Tracking implementation (optional)
- **PageSpeed Insights:** Page speed testing
- **SEMrush/Ahrefs:** Competitor keyword research (optional)

### Recommended Tools
- **Microsoft Clarity:** Free heatmaps and session recordings
- **Hotjar:** Advanced heatmaps and feedback (paid)
- **Google Optimize:** A/B testing (free)
- **Supermetrics:** Automated reporting (paid)

### Key Reports to Track
1. **Search Terms Report** (weekly)
2. **Quality Score Report** (weekly)
3. **Auction Insights** (bi-weekly)
4. **Conversion Paths** (monthly)
5. **Geographic Report** (monthly)
6. **Hour of Day Report** (monthly)

---

## 📞 Support & Escalation

### If CTR <2% After Week 1:
1. Rewrite ad headlines (more compelling)
2. Add stronger CTAs
3. Include pricing in headlines
4. Test urgency language ("24h delivery")

### If CPA >$50 After Week 2:
1. Add more negative keywords
2. Narrow keyword match types
3. Improve landing page (reduce friction)
4. Check conversion tracking setup
5. Lower bids by 15%

### If No Conversions After Week 1:
1. Verify conversion tracking works (test purchase)
2. Check landing page mobile experience
3. Simplify checkout flow
4. Add trust signals (testimonials, guarantees)
5. Consider lower price point ($9 tier)

---

## 📝 Reporting Template

### Weekly Report Format
```
Week: [Date Range]
Spend: $XXX
Clicks: XXX
Impressions: XXX
CTR: X.X%
Conversions: XX
CPA: $XX
ROAS: XXX%

Top Performing Ad Group: [Name]
Best Keyword: [Keyword] (CPA: $XX)
Worst Keyword: [Keyword] (CPA: $XX)

Actions Taken:
- [ ] Action 1
- [ ] Action 2
- [ ] Action 3

Next Week Plan:
- [ ] Plan 1
- [ ] Plan 2
- [ ] Plan 3
```

---

## ✅ Final Pre-Launch Checklist

**Before you launch, verify:**
- [x] Landing pages are live and accessible
- [ ] All UTM parameters are correct
- [ ] Conversion tracking is tested and working
- [ ] Negative keywords list is uploaded
- [ ] Ad copy is approved (no policy violations)
- [ ] Budget limits are set correctly ($33/day)
- [ ] Credit card is on file and active
- [ ] Alert emails are configured
- [ ] Weekly review meetings are scheduled
- [ ] Access shared with team members

**Launch Timing:**
- Best day: Tuesday or Wednesday (avoid Monday/Friday)
- Best time: 9am-11am PT (business hours)
- Avoid: Holidays, weekends for initial launch

**Emergency Contact:**
- Campaign Manager: [Your Name]
- Google Ads Support: 1-866-246-6453
- Stripe Support: (for payment issues)

---

**Total Setup Time:** 4-6 hours
**Expected First Conversion:** 24-48 hours
**Expected Profitability:** 2-3 weeks

**Ready to launch!** 🚀

---

## 📚 Additional Resources

- [Google Ads Campaign Guide](./google-ads-campaign-guide.md) - Full campaign setup details
- [Landing Pages](../website/src/app/) - Source code for all landing pages
- [UTM Tracking Guide](https://ga-dev-tools.google/campaign-url-builder/) - Build custom UTM links
- [Google Ads Help Center](https://support.google.com/google-ads) - Official documentation
- [Google Analytics 4 Setup](https://analytics.google.com) - Conversion tracking
