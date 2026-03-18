# Influencer Seeding Program

## Goal
Engage 100 pet Instagram/TikTok micro-influencers (10K-100K followers) to post AI pet portraits and drive viral awareness.

**Target Metrics:**
- 20% response rate (20 responses from 100 contacts)
- 10% post rate (10 posts from 100 contacts)
- 10 posts/week from influencers
- ~500K impressions/month from influencer content

## Influencer Package

Each influencer receives:
1. **Free portrait in 3 styles** - showcasing variety
2. **Unique 20% discount code** - for their audience
3. **15% commission** - on all sales via their affiliate link
4. **Gallery feature** - on pawcasso-atelier.vercel.app

## DM Outreach Strategy

### Template
```
Hi [handle]! Love [pet name]'s content 🐾 We make AI pet portraits and would love to send you a free one + feature you in our gallery. Interested?

You'll get:
✨ Free portrait in 3 styles
💰 20% discount code for your audience ([DISCOUNT_CODE])
🎁 15% commission on all sales

Your affiliate link: [AFFILIATE_LINK]
```

### Daily Workflow
- **Send 20 DMs/day** (10 Instagram, 10 TikTok)
- Best times: 10am-12pm, 6pm-8pm (their timezone)
- Track responses within 48 hours
- Follow up once after 3 days if no response

## Influencer Criteria

### Target Accounts
- **Follower range:** 10K-100K (micro-influencers have higher engagement)
- **Engagement rate:** >3% (likes + comments / followers)
- **Content frequency:** Posts 3+ times/week
- **Audience:** US-based, millennial/Gen Z pet parents
- **Content style:** High-quality pet photos, cute/funny content

### Platforms
- **Instagram:** 60 influencers
- **TikTok:** 40 influencers

### Pet Types (Distribution)
- Dogs: 70 influencers
  - Border Collies, Golden Retrievers, Shiba Inus, Corgis, Chihuahuas, Pomeranians
- Cats: 20 influencers
- Other pets: 10 influencers (rabbits, hamsters, birds)

## Tracking System

### Status Workflow
1. **Identified** - Added to database
2. **Contacted** - DM sent
3. **Responded** - Reply received
4. **Agreed** - Accepted offer
5. **Posted** - Content published
6. **Declined** - Rejected offer

### UTM Parameters
Each influencer gets unique tracking:
- `utm_source`: platform (instagram/tiktok)
- `utm_medium`: influencer
- `utm_campaign`: influencer handle
- `discount`: discount code

Example: `https://pawcasso-atelier.vercel.app/?utm_source=instagram&utm_medium=influencer&utm_campaign=fluffy_corgi&discount=FLUFFYCOR20`

## Commission Tracking

### Stripe Integration
- Create unique coupon code per influencer (20% off)
- Track orders using UTM parameters
- Calculate 15% commission on revenue
- Monthly payouts via PayPal or Venmo

### Example Commission Calculation
- Customer orders with influencer link: $9
- Discount applied: -$1.80 (20%)
- Revenue: $7.20
- Influencer commission: $1.08 (15% of $7.20)

## Content Strategy

### Portrait Styles for Influencers
Send 3 different styles to showcase variety:
1. **Pixar 3D Chunky** - most popular, cute and round
2. **Needle Felt** - unique, cozy aesthetic
3. **Renaissance** or **Ghibli** - artistic, shareable

### Posting Guidelines for Influencers
Suggested caption template:
```
Meet [pet name] as a [style] AI portrait! 🎨✨

@pawcasso.atelier creates custom AI pet portraits in 24 hours for just $9 (use code [DISCOUNT_CODE] for 20% off!)

Which style is your favorite? 👇

#petportrait #aiart #custompetportrait #petartwork #[petbreed]
```

### Story/Reel Ideas
- Before/after reveal (original photo → AI portrait)
- Show all 3 styles side-by-side
- "Choose your style" poll/sticker
- Behind-the-scenes of ordering process

## Finding Influencers

### Instagram Search Methods
1. **Hashtag search:**
   - #[breed]ofinstagram (e.g., #corgisofinstagram)
   - #[breed]daily
   - #petinfluencer
   - #dogsofinstagram
   - #catsofinstagram

2. **Location-based:**
   - Search "Los Angeles dog" or "NYC cat"
   - Filter by accounts (not posts)

3. **Competitor analysis:**
   - Look at who follows similar pet product brands
   - Check who's tagged in pet product posts

### TikTok Search Methods
1. **Hashtag search:**
   - #[breed]tok (e.g., #corgitok)
   - #petsoftiktok
   - #[breed]check

2. **Sound trending:**
   - Search popular pet sounds
   - Find creators using pet-related audio

### Tools
- **Social Blade:** Check follower growth and engagement
- **HypeAuditor:** Analyze audience authenticity
- **Manual verification:** Review recent posts for engagement rate

## Sample Influencer Dataset

See `influencers-seed-data.csv` for 100 curated accounts ready to import.

## Admin Dashboard

Access the influencer management dashboard at:
`https://pawcasso-atelier.vercel.app/admin/influencers`

### Features
- Add influencers manually or bulk import via CSV
- Track status pipeline (identified → posted)
- View DM templates with auto-filled data
- Monitor conversion metrics and revenue
- Generate affiliate links and discount codes automatically

## Success Metrics

### Week 1 Goals
- Identify 100 influencers
- Contact 20 influencers
- 4+ responses
- 2+ agreements

### Month 1 Goals
- Contact all 100 influencers
- 20+ responses (20% response rate)
- 10+ agreements (10% post rate)
- 5+ posts published
- $50+ revenue from influencer traffic

### Month 3 Goals
- 10 posts/week from influencers
- 500K+ impressions/month
- $500+ revenue from influencer traffic
- Build waiting list of new influencers

## Budget

### Costs
- Free portraits: 100 influencers × 3 styles × $0 (AI-generated) = $0
- Commission payouts: ~$100-500/month (depends on conversions)
- Time investment: 1 hour/day for outreach and tracking

### ROI Projection
- 100 influencers × 10% post rate = 10 posts
- 10 posts × 50K avg reach = 500K impressions
- 500K impressions × 0.5% CTR = 2,500 visits
- 2,500 visits × 3% conversion = 75 orders
- 75 orders × $9 = $675 revenue
- Less commissions (~$100) = $575 net

**5.75x ROI** (minimal cost, high return)
