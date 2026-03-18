# HN-Exclusive Offer Setup

**Strategy:** Offer generous free value to HN community (not just discounts) to build goodwill and get testimonials.

---

## Offer Structure

### HACKERNEWS50 (Primary Offer - FREE PORTRAITS)

**Purpose:** Give first 50 HN users a completely free portrait to build goodwill and get testimonials

**Details:**
- Discount: 100% off (free)
- Limit: 50 redemptions
- Duration: 7 days from HN post
- Applies to: Basic tier ($9 value)
- Restrictions: One per customer

**Why free instead of 50% off:**
- HN users value generosity over discounts
- Free = higher conversion + better testimonials
- 50 free portraits = ~$87.50 cost (50 × $1.75 Manus API)
- Worth it for front page exposure + word-of-mouth

**Messaging:**
```
First 50 HN users get a FREE portrait (normally $9) with code HACKERNEWS50.

Just want feedback and testimonials from this community. No strings attached.
```

---

### HACKERNEWS25 (Secondary Offer)

**Purpose:** Extended discount for late HN readers who missed the 50-redemption cap

**Details:**
- Discount: 25% off ($9 → $6.75)
- Limit: Unlimited
- Duration: 30 days from HN post
- Applies to: All tiers
- Restrictions: None

**Messaging:**
```
If HACKERNEWS50 runs out, use HACKERNEWS25 for 25% off (30 days).

Thanks for checking it out!
```

---

## Stripe Configuration

### Creating HACKERNEWS50 in Stripe Dashboard

1. **Go to:** https://dashboard.stripe.com/coupons

2. **Click:** "Create coupon"

3. **Settings:**
   - **Coupon type:** Percentage discount
   - **Discount:** 100%
   - **Name:** HACKERNEWS50
   - **ID:** `HACKERNEWS50` (exact match, case-sensitive)
   - **Duration:** Once (applies to one-time payments only)
   - **Redemption limit:** 50
   - **Expires:** 7 days from HN post date (set specific date)
   - **Applies to:** Products (select "All products" or specific Basic tier product)

4. **Advanced settings:**
   - **Max redemptions per customer:** 1
   - **Minimum amount:** None
   - **Currency:** USD

5. **Save**

---

### Creating HACKERNEWS25 in Stripe Dashboard

1. **Go to:** https://dashboard.stripe.com/coupons

2. **Click:** "Create coupon"

3. **Settings:**
   - **Coupon type:** Percentage discount
   - **Discount:** 25%
   - **Name:** HACKERNEWS25
   - **ID:** `HACKERNEWS25` (exact match, case-sensitive)
   - **Duration:** Once (applies to one-time payments only)
   - **Redemption limit:** None (unlimited)
   - **Expires:** 30 days from HN post date
   - **Applies to:** All products

4. **Advanced settings:**
   - **Max redemptions per customer:** Unlimited (allow repeat customers)
   - **Minimum amount:** None
   - **Currency:** USD

5. **Save**

---

## Website Integration

### Adding Coupon Field to Order Form

**File:** `website/src/app/order/page.tsx`

**Implementation:**
```typescript
// Add state for discount code
const [discountCode, setDiscountCode] = useState('');
const [discountStatus, setDiscountStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
const [discountAmount, setDiscountAmount] = useState(0);

// Validate discount code with Stripe
const validateDiscount = async (code: string) => {
  if (!code) {
    setDiscountStatus('idle');
    setDiscountAmount(0);
    return;
  }

  setDiscountStatus('validating');

  try {
    const response = await fetch('/api/validate-coupon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coupon: code }),
    });

    const data = await response.json();

    if (data.valid) {
      setDiscountStatus('valid');
      setDiscountAmount(data.percentOff);
    } else {
      setDiscountStatus('invalid');
      setDiscountAmount(0);
    }
  } catch (error) {
    setDiscountStatus('invalid');
    setDiscountAmount(0);
  }
};

// Add to form
<div className="space-y-2">
  <label className="block text-sm font-medium">
    Discount Code (Optional)
  </label>
  <input
    type="text"
    placeholder="HACKERNEWS50"
    value={discountCode}
    onChange={(e) => {
      const code = e.target.value.toUpperCase();
      setDiscountCode(code);
      validateDiscount(code);
    }}
    className="w-full px-4 py-2 border rounded-lg"
  />
  {discountStatus === 'valid' && (
    <p className="text-sm text-green-600">
      ✓ {discountAmount}% off applied!
    </p>
  )}
  {discountStatus === 'invalid' && (
    <p className="text-sm text-red-600">
      Invalid code
    </p>
  )}
</div>

// Pass to Stripe Checkout
const handleCheckout = async () => {
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tier: selectedTier,
      petName,
      style: selectedStyle,
      discountCode: discountCode || undefined,
    }),
  });
  // ... rest of checkout logic
};
```

---

### API Route for Coupon Validation

**File:** `website/src/app/api/validate-coupon/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export async function POST(req: NextRequest) {
  try {
    const { coupon } = await req.json();

    if (!coupon) {
      return NextResponse.json({ valid: false });
    }

    // Retrieve coupon from Stripe
    const stripeCoupon = await stripe.coupons.retrieve(coupon);

    // Check if coupon is valid and not expired
    const isValid =
      stripeCoupon.valid &&
      (!stripeCoupon.redeem_by || stripeCoupon.redeem_by * 1000 > Date.now()) &&
      (!stripeCoupon.max_redemptions ||
        stripeCoupon.times_redeemed < stripeCoupon.max_redemptions);

    if (isValid) {
      return NextResponse.json({
        valid: true,
        percentOff: stripeCoupon.percent_off,
        amountOff: stripeCoupon.amount_off,
      });
    }

    return NextResponse.json({ valid: false });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json({ valid: false });
  }
}
```

---

### Applying Coupon in Stripe Checkout

**File:** `website/src/app/api/checkout/route.ts`

```typescript
// In your checkout session creation
const session = await stripe.checkout.sessions.create({
  line_items: [
    {
      price: tierPriceId,
      quantity: 1,
    },
  ],
  mode: 'payment',
  success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order`,

  // Apply discount code if provided
  discounts: discountCode
    ? [{ coupon: discountCode }]
    : undefined,

  // Store metadata
  metadata: {
    petName,
    style: selectedStyle,
    discountCode: discountCode || 'none',
  },
});
```

---

## Testing Checklist

### Before HN Launch

- [ ] HACKERNEWS50 coupon created in Stripe dashboard
- [ ] HACKERNEWS25 coupon created in Stripe dashboard
- [ ] Coupon expiration dates set (HACKERNEWS50: 7 days, HACKERNEWS25: 30 days)
- [ ] Test order with HACKERNEWS50 (should be 100% off, $0.00 total)
- [ ] Test order with HACKERNEWS25 (should be 25% off, $6.75 total)
- [ ] Test invalid coupon code (should show "Invalid code")
- [ ] Test order with no coupon (should work normally)
- [ ] Verify Stripe webhook captures discount code in metadata
- [ ] Test HACKERNEWS50 max redemptions (simulate 50 uses, 51st should fail)

### During HN Launch

- [ ] Monitor coupon redemptions in Stripe dashboard
- [ ] Post update when HACKERNEWS50 hits 25/50 redemptions ("Halfway gone!")
- [ ] Post update when HACKERNEWS50 hits 50/50 redemptions ("All gone! Use HACKERNEWS25 for 25% off")
- [ ] Respond to questions about coupon codes within 5 minutes

### Post-Launch

- [ ] Analyze coupon usage (how many free vs paid?)
- [ ] Calculate actual cost (50 × $1.75 Manus API + Stripe fees)
- [ ] Reach out to HACKERNEWS50 users for testimonials
- [ ] Extend HACKERNEWS25 if needed (great engagement opportunity)

---

## Messaging Templates

### In HN Post

```
**HN-exclusive offer:**

First 50 people can get a FREE portrait (normally $9) with code HACKERNEWS50.
Just want feedback and testimonials from this community.

If that runs out, use HACKERNEWS25 for 25% off (30 days).

Order: https://pawcasso-atelier.vercel.app/order?utm_source=hackernews
```

---

### When HACKERNEWS50 Hits 50% (25 Redemptions)

```
Update: HACKERNEWS50 is halfway gone (25/50 used).

If you want a free portrait, grab it now! After 50, it switches to HACKERNEWS25 (25% off).

Thanks for the amazing response!
```

---

### When HACKERNEWS50 Runs Out

```
Update: HACKERNEWS50 is sold out (50/50 used in 4 hours!).

If you missed it, use HACKERNEWS25 for 25% off ($9 → $6.75) for the next 30 days.

Thanks to everyone who tried it! Already seeing amazing results and getting great feedback.
```

---

### When Asking for Testimonials (1 Week Post-Launch)

```
Subject: How was your free portrait? (from HN)

Hey [Name],

You used HACKERNEWS50 for a free portrait last week. Hope you loved it!

Quick favor: would you mind sharing a quick sentence about your experience?
I'm collecting testimonials for the website.

Examples:
- "Turned out better than expected!"
- "My wife loved it, way better than commissioning an artist"
- "The Renaissance style was perfect for our golden retriever"

No pressure at all - just want to know if I'm building something people actually like!

Thanks,
Michael

P.S. If the portrait didn't meet your expectations, I'd love to know that too. Honest feedback helps me improve.
```

---

## Cost Analysis

### HACKERNEWS50 (50 Free Portraits)

**API Costs:**
- Manus API: 50 × $1.75 avg = $87.50
- Email delivery: 50 × $0.02 = $1.00
- **Total:** $88.50

**Stripe Fees:**
- None ($0.00 orders don't incur Stripe fees)

**Time Investment:**
- QA: 50 × 5 min = 250 minutes = 4.2 hours
- **Cost @ $60/hr:** $250

**Total Cost:** $88.50 (out of pocket) + $250 (time)

**Break-Even Analysis:**
If 10% of free users become paying customers later:
- 5 paid orders × $4 margin = $20
- Net cost: $88.50 - $20 = $68.50

**Value Received:**
- 50 testimonials (worth $500+ if authentic)
- HN front page exposure (50k+ impressions)
- Email list growth (50+ subscribers)
- Product feedback from technical audience

**ROI:** ~10x (conservative), ~50x (optimistic)

---

### HACKERNEWS25 (Unlimited, 25% Off)

**Per Order:**
- Revenue: $6.75
- Costs: $1.75 (API) + $0.49 (Stripe) + $0.02 (email) = $2.26
- **Margin:** $4.49

**Estimated Usage:**
- Conservative: 20 redemptions = $89.80 revenue
- Realistic: 50 redemptions = $224.50 revenue
- Optimistic: 100 redemptions = $449 revenue

**Why 25% instead of 50%:**
- 50% off = $4.50 revenue, $2.26 costs, $2.24 margin (thin)
- 25% off = $6.75 revenue, $2.26 costs, $4.49 margin (healthy)
- 25% feels generous but maintains profitability

---

## Redemption Tracking

### Stripe Dashboard

**Monitor in real-time:**
1. Go to: https://dashboard.stripe.com/coupons
2. Click on HACKERNEWS50 or HACKERNEWS25
3. See: Times redeemed, Amount saved, Customer list

**Export for analysis:**
1. Go to: https://dashboard.stripe.com/payments
2. Filter by: "Discount code" = HACKERNEWS50 or HACKERNEWS25
3. Export CSV for later analysis

---

### Analytics Tagging

**UTM Parameters:**
All HN links should include:
```
?utm_source=hackernews&utm_medium=show-hn&utm_campaign=hn-launch-2026-03&utm_content=HACKERNEWS50
```

**Google Analytics:**
Track as custom event:
```javascript
gtag('event', 'coupon_applied', {
  coupon_code: 'HACKERNEWS50',
  discount_amount: 100,
  source: 'hackernews',
});
```

---

## Contingency Plans

### If HACKERNEWS50 Runs Out in <1 Hour

**Option 1:** Extend to 100 redemptions
```
Update: HACKERNEWS50 sold out in 45 minutes (!).

Extending to 100 redemptions due to demand. Code is live again.
```

**Option 2:** Create HACKERNEWS75 (75% off)
```
Update: HACKERNEWS50 sold out.

New code: HACKERNEWS75 for 75% off ($9 → $2.25) - next 50 people.
```

---

### If HACKERNEWS50 Doesn't Get Used

**After 24 Hours, <10 Redemptions:**
```
Update: Looks like the free offer didn't land.

If you tried it and it didn't meet expectations, I'd love feedback!
What would make this worth trying?
```

**After 3 Days, <20 Redemptions:**
- Don't mention it in updates
- Focus on technical discussion instead
- Treat HN as product validation, not sales channel

---

## Post-Launch Analysis Questions

### Conversion Metrics
- [ ] How many people clicked order link from HN?
- [ ] How many applied HACKERNEWS50?
- [ ] How many completed checkout (free orders)?
- [ ] What was the conversion rate (clicks → redemptions)?

### Quality Metrics
- [ ] How many HACKERNEWS50 users requested revisions?
- [ ] What was the quality score (1-5 rating if we add that)?
- [ ] How many left testimonials or feedback?

### Retention Metrics
- [ ] How many HACKERNEWS50 users ordered again (paid)?
- [ ] How many referred friends?
- [ ] What was the LTV of HN users vs other channels?

---

**Bottom Line:** $88.50 cash + 4 hours of QA time is a cheap price for HN front page exposure. Even if only 10% leave testimonials, that's 5 authentic reviews worth their weight in gold.
