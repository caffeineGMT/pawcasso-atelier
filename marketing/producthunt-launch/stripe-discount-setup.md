# Stripe Discount Code Setup - ProductHunt Launch

## Overview

Create two discount codes in Stripe for the ProductHunt launch:

1. **PRODUCTHUNT50** — 50% off, first 100 uses, 48 hours
2. **HUNTER48** — 10% off, unlimited uses, 48 hours (post-launch)

---

## Code #1: PRODUCTHUNT50 (Launch Exclusive)

### Stripe Dashboard Setup

**Step 1: Create Coupon**
1. Go to: [Stripe Dashboard](https://dashboard.stripe.com/) → Products → Coupons
2. Click "Create coupon"

**Step 2: Configure Coupon**
- **Name:** ProductHunt Launch - 50% Off
- **ID:** `PRODUCTHUNT50` (customer-facing code)
- **Type:** Percentage discount
- **Percentage off:** 50%
- **Duration:** Once (applies to single payment)
- **Applies to:** All products (or select specific Price IDs)

**Step 3: Set Redemption Limits**
- **Max redemptions:** 100 (first 100 customers only)
- **Expiration date:** [Launch Date + 48 hours]
  - Example: Launch Tuesday 12:01 AM → Expires Thursday 11:59 PM

**Step 4: (Optional) Currency Restrictions**
- **Currency:** USD only (if you want to restrict)
- Leave blank for all currencies

**Step 5: Save**
- Click "Create coupon"
- Copy the Coupon ID: `PRODUCTHUNT50`

---

### Implementation in Code

**File:** `website/src/lib/stripe.ts`

The `createCheckoutSession` function already supports discount codes via the `discountCode` parameter:

```typescript
// Line 149-151 in stripe.ts
if (discountCode) {
  sessionParams.discounts = [{ coupon: discountCode }];
}
```

**No code changes needed!** The integration is already built. Just ensure:
1. Coupon `PRODUCTHUNT50` exists in Stripe
2. Frontend passes `discountCode` to checkout API

---

### Frontend Integration

**File:** `website/src/app/order/page.tsx` (Lines 38-60)

The order page already:
1. Reads `?code=PRODUCTHUNT50` from URL parameters ✅
2. Stores discount code in state ✅
3. Displays banner showing active code ✅
4. Passes code to checkout session ✅

**Test URL:**
```
https://pawcasso-atelier.vercel.app/order?code=PRODUCTHUNT50
```

**Expected behavior:**
- Discount banner appears at top of page
- Text: "Discount code PRODUCTHUNT50 will be applied at checkout (10% off)"
- *(Update banner text to show 50% for PRODUCTHUNT50)*

---

### Update Discount Banner Text

**Current code (Line 219):**
```typescript
<p className="text-gold font-medium">
  Discount code <span className="font-mono font-bold">{discountCode}</span> will be applied at checkout (10% off)
</p>
```

**Updated code (dynamic percentage):**
```typescript
<p className="text-gold font-medium">
  Discount code <span className="font-mono font-bold">{discountCode}</span> will be applied at checkout
  {discountCode === 'PRODUCTHUNT50' ? ' (50% off)' : ' (10% off)'}
</p>
```

---

## Code #2: HUNTER48 (Post-Launch Conversion)

### Stripe Dashboard Setup

**Step 1: Create Coupon**
1. Go to: Products → Coupons → Create coupon

**Step 2: Configure Coupon**
- **Name:** ProductHunt Thank You - 10% Off
- **ID:** `HUNTER48`
- **Type:** Percentage discount
- **Percentage off:** 10%
- **Duration:** Once

**Step 3: Set Redemption Limits**
- **Max redemptions:** Unlimited (leave blank)
- **Expiration date:** [Launch Date + 48 hours]
  - Example: Launch Wednesday 12:01 AM → Expires Friday 11:59 PM

**Step 4: Save**
- Click "Create coupon"
- Copy the Coupon ID: `HUNTER48`

---

### Usage

**When to activate:**
- Post-launch email blast #3 (Wednesday morning)
- Social media posts (Twitter, LinkedIn, Instagram)
- ProductHunt Update #5 (victory lap)

**Test URL:**
```
https://pawcasso-atelier.vercel.app/order?code=HUNTER48
```

---

## Alternative: Using Promotion Codes (Recommended)

**What's the difference?**
- **Coupons:** Backend IDs (e.g., `PRODUCTHUNT50`)
- **Promotion Codes:** Customer-facing codes with additional restrictions (better UX)

**Why Promotion Codes are better:**
- Can restrict by customer email domain
- Can set min/max purchase amounts
- Better analytics (redemption tracking)
- Can deactivate without deleting coupon

### Setup Promotion Codes

**Step 1: Create Coupon** (same as above)

**Step 2: Create Promotion Code from Coupon**
1. Go to: Products → Coupons → Select `PRODUCTHUNT50`
2. Click "Create promotion code"
3. **Code:** `PRODUCTHUNT50`
4. **Active:** Yes
5. **Max redemptions:** 100
6. **Expires:** [Launch Date + 48 hours]
7. **Minimum amount:** (optional, e.g., $5 to prevent abuse)

**Step 3: Save**
- Promotion code `PRODUCTHUNT50` is now active
- Redemptions tracked separately from coupon

---

## Tracking Redemptions

### Stripe Dashboard

**View real-time redemptions:**
1. Go to: Products → Coupons → `PRODUCTHUNT50`
2. See "Times redeemed" counter
3. Click "View redemptions" for detailed list

**Metrics to track:**
- Total redemptions (goal: 100 for PRODUCTHUNT50)
- Redemption rate (redemptions / site visitors)
- Revenue impact (discount amount vs. full price)
- Average order value with discount

---

### Custom Analytics (Optional)

**Track in Google Analytics:**

**File:** `website/src/app/order/page.tsx` (add to `handleSubmit`)

```typescript
// After successful checkout session creation
if (discountCode) {
  trackEvent('coupon_applied', {
    coupon_code: discountCode,
    discount_type: discountCode === 'PRODUCTHUNT50' ? '50%' : '10%',
    tier: selectedTier,
    currency: 'USD',
  });
}
```

**Track in Mailchimp/Email tool:**
- Tag customers who use PRODUCTHUNT50 (ProductHunt Customers segment)
- Tag customers who use HUNTER48 (Post-Launch Customers segment)
- Send targeted follow-up emails

---

## Email Integration

### Include discount code in emails

**Email blast #1 (Launch announcement):**
```html
<div style="background: #1a1a1a; border: 2px solid #C9A96E; padding: 20px; text-align: center;">
  <h2 style="color: #C9A96E;">EXCLUSIVE: 50% OFF FOR FIRST 100</h2>
  <p style="color: #F5F5F7; font-size: 18px;">Use code at checkout:</p>
  <div style="background: #000; padding: 15px; border-radius: 8px; margin: 10px 0;">
    <code style="color: #C9A96E; font-size: 24px; font-weight: bold;">PRODUCTHUNT50</code>
  </div>
  <a href="https://pawcasso-atelier.vercel.app/order?code=PRODUCTHUNT50"
     style="background: #C9A96E; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 50px; display: inline-block; margin-top: 10px;">
    Claim Your Discount →
  </a>
</div>
```

**Email blast #3 (Thank you + HUNTER48):**
```html
<div style="background: #1a1a1a; border: 2px solid #C9A96E; padding: 20px; text-align: center;">
  <h2 style="color: #C9A96E;">THANK YOU GIFT: 10% OFF</h2>
  <p style="color: #F5F5F7;">Valid for 48 hours</p>
  <div style="background: #000; padding: 15px; border-radius: 8px; margin: 10px 0;">
    <code style="color: #C9A96E; font-size: 24px; font-weight: bold;">HUNTER48</code>
  </div>
  <a href="https://pawcasso-atelier.vercel.app/order?code=HUNTER48"
     style="background: #C9A96E; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 50px; display: inline-block; margin-top: 10px;">
    Order Now →
  </a>
</div>
```

---

## ProductHunt Landing Page (Optional)

Create a dedicated landing page for ProductHunt traffic:

**File:** `website/src/app/producthunt/page.tsx`

```typescript
import { redirect } from 'next/navigation';

export default function ProductHuntPage() {
  // Redirect to order page with PRODUCTHUNT50 code pre-applied
  redirect('/order?code=PRODUCTHUNT50&utm_source=producthunt&utm_medium=launch&utm_campaign=ph_launch');
}
```

**Usage:**
- Share link: `https://pawcasso-atelier.vercel.app/producthunt`
- Auto-applies discount code
- Tracks ProductHunt traffic via UTM parameters

---

## Testing Checklist

Before launch, test both discount codes:

### Test #1: PRODUCTHUNT50

- [ ] Go to: `/order?code=PRODUCTHUNT50`
- [ ] Verify banner shows "50% off" (update if needed)
- [ ] Fill out order form (use Stripe test mode)
- [ ] Proceed to checkout
- [ ] Verify Stripe checkout shows 50% discount applied
- [ ] Complete test purchase
- [ ] Check Stripe dashboard for redemption count

### Test #2: HUNTER48

- [ ] Go to: `/order?code=HUNTER48`
- [ ] Verify banner shows "10% off"
- [ ] Fill out order form
- [ ] Proceed to checkout
- [ ] Verify Stripe checkout shows 10% discount applied
- [ ] Complete test purchase

### Test #3: Invalid Code

- [ ] Go to: `/order?code=INVALID`
- [ ] Verify banner shows (or doesn't show if code doesn't exist)
- [ ] Proceed to checkout
- [ ] Verify NO discount applied
- [ ] (Optional) Show error message: "Invalid discount code"

### Test #4: Expired Code

- [ ] Set PRODUCTHUNT50 expiration to past date
- [ ] Attempt to use code
- [ ] Verify Stripe rejects expired coupon
- [ ] Update expiration date back to launch + 48 hours

### Test #5: Max Redemptions

- [ ] Use PRODUCTHUNT50 in test mode 100 times (or manually set redemptions in Stripe)
- [ ] Attempt 101st use
- [ ] Verify Stripe rejects: "Coupon has reached maximum redemptions"

---

## Stripe Test Mode vs. Live Mode

**Important:** Create coupons in BOTH test and live modes

### Test Mode (for pre-launch testing)
1. Toggle Stripe dashboard to "Test mode"
2. Create `PRODUCTHUNT50` coupon (50% off, 100 uses, 48 hours)
3. Create `HUNTER48` coupon (10% off, unlimited, 48 hours)
4. Use test credit cards: `4242 4242 4242 4242`

### Live Mode (for actual launch)
1. Toggle Stripe dashboard to "Live mode"
2. **Repeat exact same setup** (coupons don't copy between modes)
3. Set correct expiration dates (launch date + 48 hours)
4. Double-check redemption limits

**Common mistake:** Creating coupons only in test mode, forgetting to create in live mode!

---

## Contingency Plans

### If PRODUCTHUNT50 maxes out early

**Option 1: Extend redemption limit**
- Increase from 100 to 150
- Announce: "Due to demand, we're extending the offer!"

**Option 2: Create new code**
- `PRODUCTHUNT25` (25% off, next 50 uses)
- Softer discount, still valuable

**Option 3: Keep HUNTER48 active**
- Activate early (don't wait for post-launch)
- Unlimited uses, lower discount

### If codes aren't working

**Check:**
1. Coupon exists in LIVE mode (not just test mode)
2. Expiration date is in the future
3. Redemption limit not exceeded
4. Currency matches (USD only vs. all currencies)
5. Code spelling is exact (case-sensitive)

**Debug:**
- Check Stripe logs: Dashboard → Developers → Logs
- Search for "coupon.redemption_failed" errors
- Check server logs for `/api/checkout` errors

---

## Revenue Impact Calculator

**Assumptions:**
- 200 ProductHunt upvotes
- 10% conversion rate = 20 sales
- 50% use PRODUCTHUNT50 = 10 sales @ 50% off
- 50% pay full price = 10 sales @ 100%

**Revenue scenarios:**

### Scenario 1: All Basic ($9)
- 10 sales @ 50% off = 10 × $4.50 = $45
- 10 sales @ full price = 10 × $9 = $90
- **Total: $135**

### Scenario 2: Mix of tiers (realistic)
- 5 Basic @ 50% = 5 × $4.50 = $22.50
- 3 Premium @ 50% = 3 × $14.50 = $43.50
- 2 Deluxe @ 50% = 2 × $24.50 = $49
- 5 Basic @ full = 5 × $9 = $45
- 3 Premium @ full = 3 × $29 = $87
- 2 Deluxe @ full = 2 × $49 = $98
- **Total: $345.50**

### Scenario 3: Optimistic (with Bundle)
- 3 Basic @ 50% = $13.50
- 4 Premium @ 50% = $58
- 2 Deluxe @ 50% = $49
- 1 Bundle @ 50% = $39.50
- 3 Basic @ full = $27
- 4 Premium @ full = $116
- 2 Deluxe @ full = $98
- 1 Bundle @ full = $79
- **Total: $480**

**Discount cost:**
- Full price revenue (no discounts): $580
- Discounted revenue: $480
- **Discount cost: $100** (17% revenue sacrifice)

**ROI:**
- If ProductHunt drives 20 sales, discount "cost" is $100
- But ProductHunt traffic also brings email subscribers (312 in example)
- Future sales from subscribers (at full price) more than offset discount

**Conclusion:** 50% discount is worth it for customer acquisition.

---

## Post-Launch Analysis

**Questions to answer after 48 hours:**

1. How many people used PRODUCTHUNT50? (target: 80-100)
2. How many people used HUNTER48? (target: 20-30)
3. What's the conversion rate? (code users vs. non-users)
4. What tier did discount users choose? (Basic vs. Premium vs. Deluxe vs. Bundle)
5. What's the average order value? (with vs. without discount)
6. Did discount drive urgency? (redemption timeline: early vs. late)
7. Should we offer 50% off again? (or 30% next time)

**Track in spreadsheet:**

| Metric | PRODUCTHUNT50 | HUNTER48 | No Discount |
|--------|---------------|----------|-------------|
| Uses | 87 | 24 | N/A |
| Conversion % | 12% | 8% | 5% |
| Avg Order Value | $18.50 | $22 | $31 |
| Revenue | $1,609.50 | $528 | $620 |
| **Total Revenue** | **$2,757.50** | | |

---

**Created by:** Michael Guo
**Last Updated:** Pre-launch
**Status:** Ready to implement
**Test by:** [Launch Date - 3 days]
**Go live:** [Launch Date 12:01 AM PT]
