# HN Launch Tracking & Analytics

**Goal:** Measure HN campaign effectiveness and optimize for conversions.

---

## UTM Parameter Strategy

### Standard UTM Format

All HN links should include:
```
?utm_source=hackernews
&utm_medium=show-hn
&utm_campaign=hn-launch-2026-03
&utm_content=[specific-placement]
```

**Why:**
- Track HN traffic separately from other sources
- Measure conversion rate by placement (post body vs comments vs updates)
- Calculate ROI (cost of free portraits vs revenue generated)

---

### URL Variants by Placement

#### Main Post Body
```
https://pawcasso-atelier.vercel.app?utm_source=hackernews&utm_medium=show-hn&utm_campaign=hn-launch-2026-03&utm_content=post-body
```

#### First Comment
```
https://pawcasso-atelier.vercel.app/order?utm_source=hackernews&utm_medium=show-hn&utm_campaign=hn-launch-2026-03&utm_content=first-comment
```

#### Gallery Link (in comments)
```
https://pawcasso-atelier.vercel.app/gallery?utm_source=hackernews&utm_medium=show-hn&utm_campaign=hn-launch-2026-03&utm_content=gallery-comment
```

#### Update Comments (midday, evening)
```
https://pawcasso-atelier.vercel.app/order?utm_source=hackernews&utm_medium=show-hn&utm_campaign=hn-launch-2026-03&utm_content=update-12pm
https://pawcasso-atelier.vercel.app/order?utm_source=hackernews&utm_medium=show-hn&utm_campaign=hn-launch-2026-03&utm_content=update-6pm
```

---

## Google Analytics Setup

### Custom Events to Track

#### 1. Page Views (automatic)
- Homepage
- Gallery
- Order page
- Thank you page

**Filter by:**
- `utm_source = hackernews`
- `utm_campaign = hn-launch-2026-03`

---

#### 2. Discount Code Applied (custom event)

**Event name:** `coupon_applied`

**Parameters:**
- `coupon_code`: HACKERNEWS50 or HACKERNEWS25
- `discount_amount`: 100 or 25
- `source`: hackernews

**Implementation:**
```javascript
// website/src/app/order/page.tsx
// When discount code is validated successfully:

gtag('event', 'coupon_applied', {
  coupon_code: discountCode,
  discount_amount: discountAmount,
  source: 'hackernews',
  event_category: 'engagement',
  event_label: discountCode,
});
```

---

#### 3. Checkout Started (custom event)

**Event name:** `begin_checkout`

**Parameters:**
- `value`: Order amount (e.g., 9.00, 0.00 for free)
- `currency`: USD
- `items`: Array of selected tier + style
- `coupon`: Discount code (if applied)

**Implementation:**
```javascript
// When user clicks "Checkout with Stripe"

gtag('event', 'begin_checkout', {
  value: finalPrice,
  currency: 'USD',
  items: [{
    item_id: selectedTier,
    item_name: `Pet Portrait - ${selectedTier}`,
    item_category: selectedStyle,
    price: finalPrice,
  }],
  coupon: discountCode || 'none',
});
```

---

#### 4. Purchase Completed (custom event)

**Event name:** `purchase`

**Parameters:**
- `transaction_id`: Stripe session ID
- `value`: Order amount
- `currency`: USD
- `coupon`: Discount code
- `items`: Array of purchased items

**Implementation:**
```javascript
// website/src/app/thank-you/page.tsx
// On successful checkout

gtag('event', 'purchase', {
  transaction_id: sessionId,
  value: orderTotal,
  currency: 'USD',
  coupon: discountCode || 'none',
  items: [{
    item_id: tier,
    item_name: `Pet Portrait - ${tier}`,
    item_category: style,
    price: orderTotal,
  }],
});
```

---

### Conversion Funnel to Track

1. **HN Post View** → 2. **Site Visit** → 3. **Gallery View** → 4. **Order Page** → 5. **Discount Applied** → 6. **Checkout Started** → 7. **Purchase Completed**

**Expected Drop-off Rates:**
- HN Post → Site Visit: 20-30% (typical HN click-through rate)
- Site Visit → Order Page: 30-50% (interest level)
- Order Page → Checkout Started: 60-80% (intent)
- Checkout Started → Purchase: 90-95% (high intent, low friction)

**Optimistic Scenario:**
- 1,000 HN post views
- 300 site visits (30% CTR)
- 120 order page visits (40%)
- 84 checkout started (70%)
- 75 purchases (90%)
- **Conversion rate: 7.5%** (HN visitors → purchases)

**Realistic Scenario:**
- 500 HN post views
- 100 site visits (20% CTR)
- 30 order page visits (30%)
- 18 checkout started (60%)
- 15 purchases (85%)
- **Conversion rate: 3%** (HN visitors → purchases)

---

## Stripe Tracking

### Metadata to Capture

Every Stripe Checkout session should include:

```javascript
metadata: {
  source: 'hackernews',
  utm_campaign: 'hn-launch-2026-03',
  utm_content: 'first-comment', // or 'post-body', 'update-12pm', etc.
  discount_code: discountCode || 'none',
  pet_name: petName,
  style: selectedStyle,
  tier: selectedTier,
}
```

**Why:**
- Track HN-specific orders even if UTM params are lost
- Analyze which HN placements convert best
- Segment HN customers for follow-up emails

---

### Stripe Dashboard Filters

**To analyze HN performance:**

1. Go to: https://dashboard.stripe.com/payments
2. Add filters:
   - **Metadata:** `source = hackernews`
   - **Date range:** Launch day + 7 days
   - **Status:** All (successful + failed)

3. Metrics to track:
   - Total HN orders
   - Revenue from HN (including $0 free orders)
   - Discount code breakdown (HACKERNEWS50 vs HACKERNEWS25)
   - Average order value (AOV) for HN customers

---

### Coupon Redemption Tracking

**HACKERNEWS50:**
- Max redemptions: 50
- Track in real-time: https://dashboard.stripe.com/coupons/HACKERNEWS50
- Alert thresholds:
  - 25 redemptions (50%) → Post update on HN
  - 50 redemptions (100%) → Switch to HACKERNEWS25 messaging

**HACKERNEWS25:**
- Unlimited redemptions
- Track weekly: Total uses, revenue impact, conversion rate

---

## Vercel Analytics

### Edge Function Performance

**Monitor:**
- `/api/checkout` response time (target: <500ms)
- `/api/validate-coupon` response time (target: <200ms)
- Error rate (target: <1%)

**Alerts:**
- Set up Vercel Slack notifications for:
  - 500 errors on `/api/checkout`
  - Timeout errors (>10s)
  - Deployment failures

**Dashboard:**
- https://vercel.com/[your-project]/analytics
- Filter by: Last 24 hours, /api/* paths

---

### Traffic Spike Handling

**Expected HN traffic:**
- Spike window: 8-10am PT (launch)
- Peak concurrent users: 50-100 (if front page)
- Peak requests/min: 200-500

**Vercel limits:**
- Free tier: 100 GB bandwidth/month
- Hobby tier: 1 TB bandwidth/month
- Edge Functions: 100k invocations/day (free), 1M/day (hobby)

**HN launch should NOT hit limits** (estimate: 500 visitors × 5 pages × 2 MB avg = 5 GB bandwidth)

---

## Real-Time Monitoring Dashboard

### Setup (Before Launch)

**Tab 1: HN Post**
- https://news.ycombinator.com/item?id=[your-post-id]
- Auto-refresh every 5 minutes (use browser extension)
- Track: Upvotes, comments, rank

**Tab 2: Google Analytics (Real-Time)**
- https://analytics.google.com/analytics/web/#/realtime
- Filter: `utm_source = hackernews`
- Track: Active users, page views, conversions

**Tab 3: Stripe Dashboard**
- https://dashboard.stripe.com/payments
- Filter: Metadata `source = hackernews`
- Track: Orders, revenue, discount codes

**Tab 4: Vercel Logs**
- https://vercel.com/[your-project]/logs
- Filter: Last 1 hour, Errors only
- Track: API errors, deployment status

---

## Key Metrics to Track

### During Launch (Real-Time)

| Metric | Target | Measurement |
|--------|--------|-------------|
| HN Upvotes | 50+ | HN post page |
| HN Comments | 30+ | HN post page |
| HN Rank | Top 30 (front page) | HN homepage |
| Site Visitors (HN) | 200+ | Google Analytics |
| Order Page Visits | 60+ | Google Analytics |
| Discount Code Applied | 40+ | Google Analytics event |
| Orders (Total) | 30+ | Stripe dashboard |
| Orders (Free) | 40+ | Stripe (HACKERNEWS50) |
| Orders (Paid) | 10+ | Stripe (paid or HACKERNEWS25) |
| Conversion Rate | 5%+ | Orders / Site Visitors |

---

### Post-Launch (48 Hours)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Total HN Traffic | 500+ | Google Analytics |
| Total Orders | 50+ | Stripe |
| HACKERNEWS50 Redemptions | 50/50 | Stripe coupons |
| HACKERNEWS25 Redemptions | 20+ | Stripe coupons |
| Revenue (Gross) | $300+ | Stripe (paid orders only) |
| Revenue (Net) | $150+ | Stripe - API costs - fees |
| Email Subscribers | 70+ | (Orders = subscribers) |
| Testimonials Collected | 10+ | Manual tracking |

---

### Long-Term (30 Days)

| Metric | Target | Source |
|--------|--------|--------|
| HN Customer Retention | 10%+ | Stripe (repeat orders from HN customers) |
| HN Referrals | 5+ | Stripe metadata (referred_by) |
| HN LTV | $15+ | Average revenue per HN customer (including repeat orders) |
| HACKERNEWS25 Total Uses | 30+ | Stripe coupons (30-day window) |

---

## Post-Launch Analysis Template

### HN Launch Report (Fill in after 48 hours)

**Traffic:**
- Total HN post views: _____ (estimate from HN rank/upvotes)
- Site visitors from HN: _____ (Google Analytics)
- Click-through rate: _____% (Site visitors / HN views)

**Engagement:**
- HN upvotes: _____
- HN comments: _____
- Peak HN rank: _____ (1-30 = front page)
- Hours on front page: _____

**Conversions:**
- Total orders: _____
- Free orders (HACKERNEWS50): _____
- Paid orders: _____
- Conversion rate: _____% (Orders / Site visitors)

**Revenue:**
- Gross revenue: $_____ (Stripe total)
- Discount applied: $_____ (HACKERNEWS50 + HACKERNEWS25)
- Net revenue: $_____ (Gross - discounts - API costs - Stripe fees)

**Costs:**
- Manus API (free portraits): $_____ (50 × $1.75 = $87.50)
- Stripe fees (paid orders): $_____
- Time investment: _____ hours
- **Total cost:** $_____

**ROI:**
- Cost per order: $_____ (Total cost / Total orders)
- Cost per paying customer: $_____ (Total cost / Paid orders)
- Break-even orders needed: _____ (Total cost / $4.50 avg margin)

**Testimonials & Feedback:**
- Testimonials collected: _____
- Feature requests: [list top 3]
- Common criticisms: [list top 3]
- Unexpected learnings: [list 2-3]

---

## A/B Testing Opportunities (Future Launches)

### Test Variable 1: HN Post Title
- **Variant A:** "Show HN: I automated custom pet portraits with Manus/Flux for $9"
- **Variant B:** "Show HN: Building an AI pet portrait business - what I learned about prompt engineering"
- **Metric:** Upvotes, comments, site traffic

### Test Variable 2: HN Offer
- **Variant A:** HACKERNEWS50 (100% off, 50 redemptions)
- **Variant B:** HACKERNEWS33 (33% off, unlimited)
- **Metric:** Total orders, paid orders, conversion rate

### Test Variable 3: Landing Page
- **Variant A:** Homepage (general overview)
- **Variant B:** Order page (direct conversion)
- **Variant C:** Gallery page (showcase quality)
- **Metric:** Bounce rate, time on site, conversion rate

---

## Reporting Schedule

**Live Updates (During Launch):**
- Every 2 hours: Tweet metrics
  - "2 hours in: [X] upvotes, [Y] orders, [Z] comments. Thanks HN!"
  - "4 hours in: HACKERNEWS50 is 75% gone (38/50). Grab yours now!"
  - "8 hours in: We're sold out of free portraits! Use HACKERNEWS25 for 25% off."

**Daily Summary:**
- End of Day 1: Full metrics recap
  - Post on HN as comment update
  - Share on Twitter/LinkedIn
  - Send internal recap email (for yourself)

**Weekly Deep-Dive:**
- Day 7: Full post-mortem blog post
  - Publish on website
  - Share on HN ("Ask HN: I launched last week - here's what I learned")
  - Share on Indie Hackers, Twitter, LinkedIn

---

## Tools & Resources

### Analytics Platforms
- **Google Analytics:** https://analytics.google.com (free)
- **Vercel Analytics:** https://vercel.com/analytics (free for hobby plan)
- **Stripe Dashboard:** https://dashboard.stripe.com (free)

### URL Builder
- **Google Campaign URL Builder:** https://ga-dev-tools.google/campaign-url-builder/
  - Use to generate UTM-tagged URLs
  - Save templates for quick reuse

### Monitoring Tools
- **HN Rank Tracker:** https://hnrankings.info (shows HN rank over time)
- **HN Algolia Search:** https://hn.algolia.com (search for your post)
- **Uptime Robot:** https://uptimerobot.com (monitor website uptime during launch)

### Data Export
- **Google Analytics:** Export to CSV/Excel
- **Stripe:** Export payments to CSV
- **HN:** Use HN API (https://hacker-news.firebaseio.com/v0/item/[post-id].json)

---

## Privacy & Compliance

### GDPR Considerations
- Google Analytics: Cookie consent banner (if targeting EU)
- Stripe: PCI compliance (handled by Stripe)
- Customer data: Only store what's necessary (pet name, email, style)

### Data Retention
- Stripe metadata: Retain for 7 years (financial records)
- Google Analytics: Auto-delete after 14 months (default setting)
- Customer emails: Retain until unsubscribe (Resend)

---

**Bottom Line:** Track everything, but focus on three metrics that matter:
1. **Conversion rate** (HN visitors → orders)
2. **Customer satisfaction** (testimonials, repeat orders)
3. **ROI** (cost per customer vs lifetime value)

Everything else is vanity metrics.
