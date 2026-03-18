# Influencer Seeding Campaign Guide

Complete system for managing influencer outreach, tracking conversions, and processing commission payouts for Pawcasso Atelier.

## Overview

This influencer marketing system enables you to:

1. **Research & Import** — Import 100 micro-influencer targets (25K-120K followers)
2. **Generate Outreach** — Auto-generate personalized DM templates for each influencer
3. **Track Engagement** — Monitor outreach status, responses, and agreements
4. **Issue Promo Codes** — Create unique 20% discount codes via Stripe
5. **Track Sales** — Real-time sales tracking per influencer code
6. **Calculate Commissions** — Automatic 15% commission calculation
7. **Export Payouts** — CSV export for commission payments

## System Components

### 1. Influencer Database (`/admin/influencers`)
**Location:** `website/src/app/admin/influencers/page.tsx`

Admin dashboard showing:
- Total influencers by status (identified, contacted, responded, agreed, posted)
- Response rate, conversion rate, fulfillment rate
- Revenue and commission totals
- Filterable table with all influencer details
- Export CSV for commission payouts

**Features:**
- Add individual influencers
- Bulk import from CSV
- Update status (pending → contacted → responded → agreed → posted)
- View detailed influencer profiles
- Copy DM templates to clipboard
- Generate Stripe promo codes
- Track sales per influencer

### 2. Target List (`/data/influencer-targets.csv`)
**Location:** `website/data/influencer-targets.csv`

Pre-researched list of 100 pet influencer accounts:
- 50 Instagram accounts (25K-70K followers, pet niche)
- 50 TikTok accounts (65K-120K followers, pet niche)

**Columns:**
- name, handle, platform, followerCount, email, profileUrl, niche

### 3. Outreach Script (`npm run outreach`)
**Location:** `website/scripts/influencer-outreach.ts`

Generates personalized outreach materials:

**Outputs:**
- 100 individual message files (`1_handle.txt`, `2_handle.txt`, etc.)
- DM templates (Instagram/TikTok ready)
- Email templates (long-form pitch)
- Follow-up message templates
- Response templates ("yes", "tell me more", etc.)
- `TRACKING.csv` for campaign management
- `SUMMARY.md` with ROI projections

**Personalization:**
- Pet name extraction from account name
- Niche-specific compliments
- Template selection based on follower count
- Unique discount codes per influencer
- Custom affiliate links with UTM parameters

### 4. API Endpoints

#### `POST /api/influencers`
Create new influencer record
- Generates unique discount code
- Creates affiliate link with UTM params
- Calculates estimated reach (10% of followers)
- Creates Stripe coupon (20% off, unlimited use)

#### `GET /api/influencers`
Fetch all influencers with stats
- Filter by status, platform
- Includes conversion data
- Aggregated stats (total revenue, commission)

#### `PATCH /api/influencers/[id]`
Update influencer status

#### `POST /api/influencers/[id]/message`
Log outreach message

#### `POST /api/influencers/bulk-import`
Bulk import from CSV

#### `POST /api/referral/influencer`
Create Stripe promotion code for influencer
- Creates reusable 20% coupon in Stripe
- Generates promotion code with metadata (influencer_id, platform, commission_rate)
- Returns promo code ID for tracking

#### `GET /api/referral/influencer?influencerId=xxx`
Fetch sales data for specific influencer
- Returns conversion history
- Calculates total revenue and commission
- Fetches Stripe promotion code redemption count

#### `GET /api/referral/influencer?all=true`
Fetch sales data for all influencers
- Bulk sales report
- Stripe redemption counts
- Commission calculations

#### `POST /api/track-conversion`
Track influencer conversion (called by Stripe webhook)
- Matches order to influencer via discount code or UTM
- Creates InfluencerConversion record
- Calculates 15% commission

### 5. Database Schema

```prisma
model Influencer {
  id                String              @id @default(cuid())
  name              String
  handle            String              @unique
  platform          String              // "instagram" or "tiktok"
  followerCount     Int
  email             String?
  status            String              @default("identified")
  discountCode      String?             @unique
  affiliateLink     String?
  utmSource         String?
  utmMedium         String?
  utmCampaign       String?
  contactedAt       DateTime?
  respondedAt       DateTime?
  agreedAt          DateTime?
  postedAt          DateTime?
  portraitSent      Boolean             @default(false)
  notes             String?
  profileUrl        String?
  estimatedReach    Int?
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt
  outreachMessages  OutreachMessage[]
  conversions       InfluencerConversion[]
}

model InfluencerConversion {
  id              String      @id @default(cuid())
  influencerId    String
  influencer      Influencer  @relation(fields: [influencerId], references: [id])
  orderId         String
  revenue         Float       // in dollars
  commission      Float       // in dollars (15%)
  conversionDate  DateTime    @default(now())
  utmSource       String?
  utmMedium       String?
  utmCampaign     String?
}
```

## Campaign Workflow

### Phase 1: Setup (Day 1)

1. **Generate Outreach Materials**
   ```bash
   cd website
   npm run outreach
   ```

   This creates:
   - `website/outreach-output/1_luna_thegolden.txt` (100 files)
   - `website/outreach-output/TRACKING.csv`
   - `website/outreach-output/SUMMARY.md`

2. **Import Influencers to Database**
   - Go to `/admin/influencers`
   - Click "Bulk Import"
   - Paste CSV from `data/influencer-targets.csv`
   - Click "Import"
   - 100 influencers created with auto-generated codes

### Phase 2: Outreach (Week 1)

1. **Send Initial DMs** (Days 1-3)
   - Open `outreach-output/1_luna_thegolden.txt`
   - Copy DM template
   - Send via Instagram or TikTok DM
   - Update status to "contacted" in admin dashboard
   - Repeat for all 100 influencers

2. **Track Responses** (Ongoing)
   - When influencer responds, update status to "responded"
   - When they agree, update status to "agreed"
   - Use response templates from outreach files

3. **Send Portraits** (As agreements come in)
   - Generate free portrait for agreed influencers
   - Mark "portraitSent" as true
   - Provide discount code and affiliate link

### Phase 3: Follow-ups (Week 2-3)

1. **First Follow-up** (Day 4)
   - Send to all "contacted" with no response
   - Use Follow-up #1 template from outreach files

2. **Second Follow-up** (Day 8)
   - Send to high-value targets (>50K followers) still no response
   - Use Follow-up #2 template

3. **Post Reminders** (7 days after portrait sent)
   - Gentle reminder to influencers who haven't posted yet

### Phase 4: Tracking & Payouts (Ongoing)

1. **Monitor Sales**
   - Dashboard shows real-time sales per influencer
   - Filter by "posted" to see active campaigns

2. **Export Commission Reports**
   - Click "Export CSV" button
   - CSV includes: Name, Handle, Platform, Sales, Revenue, Commission Owed
   - Pay commissions monthly via PayPal or bank transfer

## ROI Projections

### Conservative Scenario (5% response rate)
- **Targets:** 100 influencers
- **Responses:** 5 influencers (5%)
- **Agreements:** 4 influencers (80% of responses)
- **Posts:** 3 influencers (75% fulfillment)
- **Total Reach:** ~150K impressions (10% of their followers)
- **Estimated Sales:** 8 orders (0.5% conversion rate)
- **Revenue:** $232 (at $29 avg order value)
- **Commission Cost:** $35 (15%)
- **Net Profit:** $197
- **ROI:** Infinite (zero COGS for digital portraits)

### Optimistic Scenario (15% response rate)
- **Targets:** 100 influencers
- **Responses:** 15 influencers (15%)
- **Agreements:** 13 influencers (87% of responses)
- **Posts:** 12 influencers (92% fulfillment)
- **Total Reach:** ~550K impressions
- **Estimated Sales:** 55 orders (1% conversion rate)
- **Revenue:** $1,595
- **Commission Cost:** $239
- **Net Profit:** $1,356
- **ROI:** Infinite (zero COGS)

### Target Metrics
- **Response Rate:** 10%+
- **Agreement Rate:** 80%+
- **Fulfillment Rate:** 70%+
- **Conversion Rate:** 0.5-1.5%
- **Average Order Value:** $29
- **Cost Per Acquisition:** $0 (free portraits, commission only on sales)

## Tips for Success

### DO:
✅ Personalize every message (pet name, niche, specific compliment)
✅ Send DMs during optimal times (10am-2pm, 7pm-9pm local time)
✅ Respond to interested influencers within 2 hours
✅ Over-deliver on portrait quality and delivery speed
✅ Feature influencers prominently in gallery with credit
✅ Follow up 2-3 times (80% of conversions come from follow-ups)
✅ Track everything in the admin dashboard
✅ Pay commissions promptly (build long-term relationships)

### DON'T:
❌ Mass DM without personalization (looks spammy)
❌ Be pushy or sales-y (offer value first)
❌ Delay responses (reply fast or lose them)
❌ Skip the follow-ups (persistence pays off)
❌ Forget to track codes and commissions (data = power)
❌ Ignore non-responders (they might respond later)

## Troubleshooting

### Influencer says code doesn't work
1. Check if code was created in Stripe: Dashboard → Coupons
2. Verify code spelling matches exactly
3. Re-create code via `/api/referral/influencer` endpoint
4. Send new code to influencer

### Sales not tracking
1. Check Stripe webhook is configured: Dashboard → Developers → Webhooks
2. Verify `STRIPE_WEBHOOK_SECRET` env var is set
3. Check webhook logs for errors
4. Manually create conversion in admin panel if needed

### Commission export missing influencer
1. Verify influencer has conversions: `/api/influencers/{id}`
2. Check `InfluencerConversion` table in database
3. Re-run conversion tracking if order was recent

### Outreach script fails
1. Verify CSV file exists: `website/data/influencer-targets.csv`
2. Check CSV format (no extra commas or quotes)
3. Run with tsx: `npx tsx scripts/influencer-outreach.ts`

## Advanced Features

### Custom Commission Rates
Edit line 35 in `website/src/app/api/track-conversion/route.ts`:
```typescript
const commission = revenue * 0.20; // Change 0.15 to 0.20 for 20%
```

### VIP Influencer Tracking
Add `vip` boolean field to `Influencer` model for priority influencers:
```prisma
vip Boolean @default(false)
```

### Automated Email Outreach
Integrate with email service (Resend, SendGrid) to send email templates:
```typescript
await resend.emails.send({
  from: 'partnerships@pawcasso-atelier.com',
  to: influencer.email,
  subject: `Collaboration Opportunity for ${petName}`,
  html: generateEmailTemplate(influencer),
});
```

### Milestone Rewards
Bonus commissions for top performers:
- 5 sales: +5% commission (20% total)
- 10 sales: +10% commission (25% total)
- Exclusive access to new styles/products

## Next Steps

1. ✅ Review generated outreach messages in `outreach-output/`
2. ✅ Import all 100 influencers via bulk import
3. ✅ Start sending DMs (aim for 20-30 per day)
4. ✅ Track responses in admin dashboard
5. ✅ Send portraits to first 5 agreeing influencers
6. ✅ Monitor sales dashboard daily
7. ✅ Export commission report at end of month 1
8. ✅ Scale to 200-500 influencers in month 2

**Goal:** 10-15 influencer posts in first 30 days driving 100+ sales ($2,900 revenue, ~$435 commission cost, ~$2,465 net profit)

Good luck! 🚀🐾
