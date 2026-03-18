# Influencer Program Analytics Dashboard

## Key Performance Indicators (KPIs)

### Funnel Metrics
- **Identified:** 100 influencers
- **Contacted:** Target 100 (100%)
- **Responded:** Target 20 (20% response rate)
- **Agreed:** Target 10 (50% of responses, 10% of total)
- **Posted:** Target 10 (100% of agreements)

### Weekly Targets
- **Week 1:** Identify 100, Contact 20, Get 4 responses, 2 agreements
- **Week 2:** Contact 30 more, Get 6 responses, 3 agreements, 1 post
- **Week 3:** Contact 30 more, Get 6 responses, 3 agreements, 2 posts
- **Week 4:** Contact 20 more, Get 4 responses, 2 agreements, 2 posts

### Engagement Metrics
- **Average Response Time:** <48 hours
- **Agreement Rate:** 50% of responses
- **Post Fulfillment Rate:** 100% of agreements
- **Average Time to Post:** 7 days from agreement

### Revenue Metrics
- **Average Order Value:** $9
- **Average Discount Applied:** $1.80 (20% off)
- **Average Net Revenue per Order:** $7.20
- **Average Commission per Order:** $1.08 (15% of net)

### Reach Metrics
- **Total Follower Count:** Sum of all 100 influencers
- **Estimated Total Reach:** 10% of total followers
- **Average Post Reach:** 50K impressions
- **Target Monthly Impressions:** 500K (10 posts × 50K)

### Conversion Metrics
- **Click-Through Rate (CTR):** Target 0.5% of impressions
- **Website Conversion Rate:** Target 3% of visits
- **Influencer-Driven Orders:** Target 75/month
- **Influencer-Driven Revenue:** Target $675/month

## Weekly Reporting Template

### Week of [DATE]

**Outreach Activity**
- DMs sent: [X] (Target: 20/day × 7 = 140/week)
- Responses received: [X]
- Agreements signed: [X]
- Posts published: [X]

**Status Pipeline**
- Identified: [X]
- Contacted: [X]
- Responded: [X]
- Agreed: [X]
- Posted: [X]
- Declined: [X]

**Performance Rates**
- Response rate: [X]% (Target: 20%)
- Agreement rate: [X]% (Target: 50% of responses)
- Post rate: [X]% (Target: 10% of total)

**Revenue Performance**
- Orders from influencer links: [X]
- Revenue generated: $[X]
- Commissions owed: $[X]
- ROI: [X]x

**Top Performers**
1. [@handle] - [X] orders, $[X] revenue
2. [@handle] - [X] orders, $[X] revenue
3. [@handle] - [X] orders, $[X] revenue

**Action Items**
- [ ] Follow up with [X] influencers who responded but haven't agreed
- [ ] Send portraits to [X] influencers who agreed
- [ ] Process commission payouts for [X] influencers
- [ ] Identify [X] new influencers to replace declines

## Monthly Review Template

### Month: [MONTH YEAR]

**Summary**
- Total influencers engaged: [X]
- Total posts published: [X]
- Total impressions: [X]
- Total revenue: $[X]
- Total commissions: $[X]
- Net profit: $[X]

**Goal Achievement**
- ✅ 100 influencers identified
- ✅ 100% contacted
- ✅ 20% response rate achieved
- ✅ 10 posts/week target met
- ✅ 500K impressions/month target met

**Platform Breakdown**
- Instagram: [X]% of posts, [X]% of revenue
- TikTok: [X]% of posts, [X]% of revenue

**Pet Type Performance**
- Dogs: [X]% of posts, [X]% of revenue
- Cats: [X]% of posts, [X]% of revenue
- Other: [X]% of posts, [X]% of revenue

**Style Preferences**
- Pixar 3D: [X]% of orders
- Needle Felt: [X]% of orders
- Renaissance: [X]% of orders
- Other: [X]% of orders

**Learnings & Optimizations**
- What worked well?
- What didn't work?
- What should we change next month?

## Tracking UTM Performance

### Google Analytics Setup
Add UTM tracking to all influencer links:
- Source: `instagram` or `tiktok`
- Medium: `influencer`
- Campaign: influencer handle

### Custom Events to Track
1. **Landing Page Visit** - User clicks influencer link
2. **Discount Applied** - User uses influencer code
3. **Order Placed** - User completes purchase
4. **Referral Attributed** - Order linked to influencer

### Dashboard Queries
```
Traffic Sources → Campaigns → Filter by utm_medium=influencer
Conversions → Goals → Filter by utm_campaign=[handle]
Revenue → Source/Medium → influencer / instagram or tiktok
```

## Commission Payout Process

### Monthly Payout Schedule
- **Day 1-5:** Review all conversions from previous month
- **Day 6-10:** Calculate commissions per influencer
- **Day 11-15:** Request payment info (PayPal/Venmo)
- **Day 16-20:** Process payouts
- **Day 21:** Send payout receipts

### Payout Calculation
```
Influencer Revenue = Sum of all orders using their code/link
Commission = Influencer Revenue × 0.15
Minimum Payout = $10 (if < $10, roll over to next month)
```

### Payout Template Email
```
Subject: Your Pawcasso Atelier Commission - $[X.XX]

Hi [Influencer Name]!

Great news! Your affiliate link generated $[X.XX] in revenue last month.

📊 Your Stats:
- Orders: [X]
- Revenue: $[X.XX]
- Commission (15%): $[X.XX]

💰 We're processing your payout of $[X.XX] via [PayPal/Venmo].

Thank you for being an amazing partner! 🐾

Best,
Pawcasso Atelier Team
```
