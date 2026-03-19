# Cart Abandonment Recovery System

**Revenue Impact Target:** 15-20% cart recovery rate

## Overview

Automated 3-email sequence to recover abandoned carts with progressive discount escalation:
- **1hr email:** 10% discount
- **24hr email:** 15% discount
- **72hr email:** 20% discount (final offer)

## System Architecture

### 1. Tracking (`lib/cart-recovery.ts`)
When a customer creates a Stripe checkout session but doesn't complete payment:
- **Trigger:** Checkout API (`/api/checkout/route.ts`) tracks the session
- **Data captured:** Customer info, cart details, UTM params, tier, amount
- **Discount codes:** Pre-generated for all 3 emails (Stripe coupons created upfront)
- **Expiration:** 7 days from abandonment

### 2. Email Templates
Located in `src/lib/email-templates/`:
- `abandoned-cart.tsx` - 1hr email (10% off, gentle reminder)
- `abandoned-cart-24hr.tsx` - 24hr email (15% off, social proof, urgency)
- `abandoned-cart-72hr.tsx` - 72hr email (20% off, final offer, high urgency)

All templates built with React Email for consistent branding.

### 3. Automated Sending
**Cron Job:** `/api/cron/cart-recovery/route.ts`
- **Schedule:** Runs every hour (configured in `vercel.json`)
- **Auth:** Requires `CRON_SECRET` environment variable
- **Logic:**
  - Finds carts eligible for each email tier
  - Sends emails in parallel
  - Updates cart status and timestamps
  - Logs results

**Email timing buffers:**
- 1hr email: 5 min buffer (sent between 55min-60min)
- 24hr email: 1 hour buffer (sent between 23hr-24hr)
- 72hr email: 1 hour buffer (sent between 71hr-72hr)

### 4. Recovery Tracking
When a customer completes checkout:
- **Trigger:** Stripe webhook (`/api/webhooks/stripe/route.ts`)
- **Action:** Marks cart as `recovered` in database
- **Link:** Associates recovered cart with completed order ID
- **Outcome:** Prevents further recovery emails

## Database Schema

```prisma
model AbandonedCart {
  id                    String    @id @default(cuid())
  stripeSessionId       String    @unique
  customerEmail         String
  customerName          String
  tier                  String
  amount                Float
  petName               String
  style                 String
  notes                 String?
  petPhotoUrl           String?

  // Recovery tracking
  status                String    @default("abandoned")
  recoveryAttempts      Int       @default(0)

  // Email timestamps
  email1SentAt          DateTime?
  email2SentAt          DateTime?
  email3SentAt          DateTime?

  // Discount codes (progressive escalation)
  discountCode1         String?   // 10%
  discountCode2         String?   // 15%
  discountCode3         String?   // 20%

  // Recovery outcome
  recovered             Boolean   @default(false)
  recoveredAt           DateTime?
  recoveredOrderId      String?

  createdAt             DateTime  @default(now())
  expiresAt             DateTime
}
```

## Discount Code Format

- **1hr:** `CART10-XXXXXXXX` (10% off, single-use)
- **24hr:** `CART15-XXXXXXXX` (15% off, single-use)
- **72hr:** `CART20-XXXXXXXX` (20% off, single-use)

Codes are created as Stripe coupons during cart tracking.

## Email Content Strategy

### Email 1 (1hr) - Gentle Reminder
- **Subject:** "Your pet portrait is waiting — 10% off inside!"
- **Tone:** Friendly, helpful
- **Content:** Saved cart, 10% discount, features
- **CTA:** "Complete Your Order"

### Email 2 (24hr) - Urgency + Social Proof
- **Subject:** "We increased your discount to 15% — [Pet Name]'s portrait awaits!"
- **Tone:** More urgent, showcases value
- **Content:** Upgraded discount, social proof (10K+ customers, 4.9★), urgency
- **CTA:** "Claim 15% Off Now"

### Email 3 (72hr) - Maximum Urgency
- **Subject:** "FINAL OFFER: 20% off [Pet Name]'s portrait — Last chance!"
- **Tone:** Final warning, scarcity
- **Content:** Best discount ever, cart expiring, testimonial
- **CTA:** "Claim 20% Off — Final Offer"

## Environment Variables Required

```bash
# Stripe
STRIPE_SECRET_KEY=sk_live_...

# Email (Resend)
RESEND_API_KEY=re_...

# Cron authentication
CRON_SECRET=your-random-secret-token

# App URL
NEXT_PUBLIC_BASE_URL=https://pawcasso-atelier.vercel.app
```

## Testing the System

### 1. Test Email Sending (Manual Trigger)
```bash
curl -X GET http://localhost:3000/api/cron/cart-recovery \
  -H "Authorization: Bearer dev-secret"
```

### 2. Test Cart Tracking
Create a checkout session but don't complete payment. Check database:
```sql
SELECT * FROM AbandonedCart WHERE customerEmail = 'test@example.com';
```

### 3. Test Recovery Flow
1. Create abandoned cart (checkout but don't pay)
2. Wait 1 hour (or manually update `createdAt` in DB)
3. Trigger cron job manually
4. Check email delivery
5. Complete payment using recovery link
6. Verify cart marked as recovered

## Monitoring & Analytics

### Key Metrics to Track
1. **Cart abandonment rate:** `abandoned_carts / total_checkouts`
2. **Email open rates:** Track via Resend analytics
3. **Recovery rate:** `recovered_carts / abandoned_carts`
4. **Revenue recovered:** Sum of `recoveredOrderId` amounts
5. **Email performance:** Compare 10% vs 15% vs 20% conversion rates

### Database Queries

**Overall recovery rate:**
```sql
SELECT
  COUNT(*) as total_abandoned,
  SUM(CASE WHEN recovered = 1 THEN 1 ELSE 0 END) as recovered,
  ROUND(SUM(CASE WHEN recovered = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as recovery_rate_pct
FROM AbandonedCart;
```

**Revenue recovered:**
```sql
SELECT
  SUM(o.amount) as total_revenue_recovered
FROM AbandonedCart ac
JOIN Order o ON o.id = ac.recoveredOrderId
WHERE ac.recovered = 1;
```

**Email performance by tier:**
```sql
SELECT
  CASE
    WHEN email3SentAt IS NOT NULL THEN '72hr'
    WHEN email2SentAt IS NOT NULL THEN '24hr'
    WHEN email1SentAt IS NOT NULL THEN '1hr'
    ELSE 'none'
  END as last_email_sent,
  COUNT(*) as count,
  SUM(CASE WHEN recovered = 1 THEN 1 ELSE 0 END) as recovered,
  ROUND(SUM(CASE WHEN recovered = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as recovery_rate_pct
FROM AbandonedCart
GROUP BY last_email_sent;
```

## Optimization Opportunities

1. **A/B test subject lines** - Track open rates by email variant
2. **Personalization** - Add pet photos to emails
3. **Timing optimization** - Test different intervals (e.g., 2hr, 12hr, 48hr)
4. **Segmentation** - Different discounts for high-value carts
5. **SMS recovery** - Add SMS for 72hr final offer
6. **Push notifications** - Browser push for logged-in users

## Known Limitations

1. **Spam filters:** Recovery emails may be flagged if sent too frequently
2. **Unsubscribe:** Need to respect email preferences
3. **Duplicate prevention:** Same customer creating multiple abandoned carts
4. **International timing:** Cron runs on UTC, may not align with customer timezone

## Troubleshooting

**Issue: Cron not running**
- Check Vercel cron logs in dashboard
- Verify `CRON_SECRET` environment variable
- Ensure route is accessible: `GET /api/cron/cart-recovery`

**Issue: Emails not sending**
- Check Resend API key and quota
- Verify email templates render without errors
- Check cart status in database

**Issue: Carts not being tracked**
- Verify checkout API is calling `trackAbandonedCart()`
- Check for errors in checkout API logs
- Ensure Prisma schema is migrated

**Issue: Carts not marked as recovered**
- Check Stripe webhook is calling `markCartAsRecovered()`
- Verify webhook signature validation
- Ensure webhook event type is `checkout.session.completed`

## Future Enhancements

- [ ] Dashboard to view abandoned carts and recovery metrics
- [ ] Manual recovery email sending from admin panel
- [ ] Dynamic discount amounts based on cart value
- [ ] Retargeting ads for high-value abandoned carts
- [ ] Exit-intent popup with instant discount
- [ ] SMS recovery for 72hr final offer
- [ ] Winback emails for expired carts (7+ days)
