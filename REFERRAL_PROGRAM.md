# Referral Program Implementation

## Overview

Complete 2-sided referral program with viral mechanics for Pawcasso Atelier.

## Features

### Core Functionality
- **20% discount** for referred friends (via Stripe coupon: REFERRAL20)
- **$5 credit** for referrers on each conversion
- **Unique referral codes** for every customer (e.g., FLUFFY2024)
- **Click tracking** and conversion attribution
- **Real-time stats** in customer portal

### Viral Mechanics
- **Social sharing buttons**: WhatsApp, Facebook, Twitter with pre-filled messages
- **Gamification**: Milestone rewards
  - 5 referrals → Free Premium portrait (worth $29)
  - 10 referrals → Free Deluxe portrait (worth $49)
  - 25 referrals → Free Bundle package (worth $79)
- **Progress tracking**: Visual progress bars to next milestone
- **Post-purchase email**: Automatic referral link with social share buttons

### Technical Implementation

#### Database Schema (Prisma)
```prisma
model Customer {
  id                  String              @id @default(cuid())
  email               String              @unique
  referralCode        String              @unique
  creditBalance       Float               @default(0)
  totalReferrals      Int                 @default(0)
  referralsGiven      Referral[]
  creditTransactions  CreditTransaction[]
  milestones          MilestoneAchievement[]
}

model Referral {
  id                String    @id @default(cuid())
  referrerEmail     String
  referredEmail     String
  referralCode      String
  clickedAt         DateTime?
  convertedAt       DateTime?
  orderId           String?
  orderValue        Float?
  referrerCredit    Float     @default(5.0)
  referredDiscount  Float     @default(0.2)
  status            String    @default("pending")
}
```

#### API Routes

1. **`/api/referral/stats`** (GET)
   - Requires authentication
   - Returns: clicks, conversions, earnings, referralCode, creditBalance, totalReferrals, milestones

2. **`/api/referral/track-click`** (POST)
   - Body: `{ referralCode, email }`
   - Tracks when a referral link is clicked
   - Creates pending referral record

3. **`/api/referral/validate`** (POST)
   - Body: `{ referralCode }`
   - Returns: `{ valid: boolean, discount: number, referrerEmail?: string }`

#### Order Flow

1. **Landing**: User arrives via referral link (`/order?ref=CODE`)
2. **Validation**: Frontend validates code via `/api/referral/validate`
3. **Display**: Shows 20% discount banner
4. **Tracking**: Tracks click when email is entered
5. **Checkout**: Passes `referralCode` to Stripe session metadata
6. **Conversion**: Webhook processes referral and credits $5 to referrer

#### Webhook Logic (Stripe)

```typescript
// After successful payment:
1. Generate portraits
2. Send email with download links + referral program
3. Process referral conversion (if applicable):
   - Credit $5 to referrer
   - Update referral status to "converted"
   - Check milestone achievements
   - Send notification email to referrer
```

#### Email Templates

**Post-Purchase Email** (`order-complete-with-referral.ts`)
- Portrait download links
- Referral section with:
  - Personal referral link
  - Social share buttons (WhatsApp, Facebook, Twitter)
  - Milestone progress
  - CTA to portal

**Referrer Credit Notification**
- "$5 credit earned" banner
- Current balance
- Link to referral dashboard

### Customer Portal

**Referrals Tab** (`/portal`)
- Hero card with referral link (copy button)
- Social share buttons
- Referral code display
- Milestone progress tracker
- Achievement badges
- Stats: clicks, conversions, earnings
- "How It Works" guide

### Components

- **`ReferralDashboard.tsx`**: Complete dashboard with stats, social sharing, gamification
- **`SocialShareButtons.tsx`**: Reusable social media sharing component
- **`order-page-referral-handler.tsx`**: Hook and banner for order page

### Utilities (`/lib/referral.ts`)

Core functions:
- `generateReferralCode(email)`: Create unique code
- `getOrCreateCustomer(email, name)`: Customer record management
- `trackReferralClick(code, email)`: Track clicks
- `getReferralStats(email)`: Fetch stats
- `processReferralConversion(code, email, orderId, value)`: Handle conversions
- `checkAndAwardMilestones(email)`: Check and award achievements
- `validateReferralCode(code)`: Validate codes

### Stripe Integration

**Coupon Creation** (automatic):
- ID: `REFERRAL20`
- Discount: 20% off
- Duration: once
- Name: "Friend Referral 20% Off"

**Metadata Tracking**:
- `referralCode`: Passed through checkout session
- Credit transactions: Stored as Stripe metadata

## Success Metrics

**Target**: 15% of customers make 1+ referrals within 30 days
**Viral Coefficient Goal**: 0.3 (each customer brings 0.3 new customers)

## Future Enhancements

1. **Email campaign**: Automated reminders to inactive referrers
2. **Leaderboard**: Top referrers page
3. **Tiered rewards**: VIP status for top 10 referrers
4. **A/B testing**: Test different discount percentages
5. **Credit redemption**: Allow credit use at checkout
6. **Affiliate program**: Convert top referrers to paid affiliates

## Files Modified/Created

### New Files
- `prisma/migrations/*/add_referral_system/migration.sql`
- `src/lib/referral.ts`
- `src/app/api/referral/track-click/route.ts`
- `src/app/api/referral/validate/route.ts`
- `src/components/SocialShareButtons.tsx`
- `src/app/order/order-page-referral-handler.tsx`
- `src/lib/email-templates/order-complete-with-referral.ts`

### Modified Files
- `prisma/schema.prisma`
- `src/components/ReferralDashboard.tsx`
- `src/app/api/referral/stats/route.ts`
- `src/app/api/checkout/route.ts`
- `src/lib/stripe.ts`
- `src/app/api/webhooks/stripe/route.ts`
- `src/app/order/page.tsx` (partially)

## Testing Checklist

- [ ] Generate referral link in portal
- [ ] Click referral link → Verify 20% banner shows
- [ ] Complete purchase with referral code
- [ ] Verify referrer receives $5 credit
- [ ] Verify referrer receives email notification
- [ ] Verify customer receives email with referral section
- [ ] Social share buttons work correctly
- [ ] Milestone progress updates correctly
- [ ] Stats dashboard updates in real-time

## Environment Variables

No new variables required. Uses existing:
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_BASE_URL`
- `RESEND_API_KEY`
