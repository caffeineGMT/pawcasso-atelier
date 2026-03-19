# Conversion Rate Optimization (CRO) System

Complete CRO infrastructure for Pawcasso Atelier with heatmaps, session recordings, funnel analytics, and A/B testing.

**Target:** Increase conversion rate from 2% → 4% (100% improvement)

---

## 📊 System Components

### 1. Microsoft Clarity - Heatmaps & Session Recordings
**Status:** ✅ Installed (free, unlimited)

**Setup:**
1. Go to [Microsoft Clarity](https://clarity.microsoft.com/)
2. Create account (sign in with Microsoft/GitHub)
3. Click "Add New Project"
4. Enter:
   - **Project name:** Pawcasso Atelier
   - **Website URL:** https://pawcasso-atelier.vercel.app
5. Copy the **Project ID** (format: `abcd1234`)
6. Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_CLARITY_PROJECT_ID=your_project_id_here
   ```

**Features:**
- **Heatmaps:** See where users click, scroll, and spend time
- **Session Recordings:** Watch actual user sessions (privacy-safe)
- **Funnel Tagging:** Filter sessions by funnel step using custom tags
- **Rage Click Detection:** Find broken buttons and frustration points
- **Dead Click Detection:** Identify non-clickable elements users try to click

**How to Use:**
- View dashboard: https://clarity.microsoft.com/projects/view/{project_id}
- Filter recordings by:
  - `funnel_step = order_page` (see order page sessions)
  - `funnel_step = checkout_initiate` (see checkout attempts)
  - Look for rage clicks on CTA buttons
  - Watch drop-off sessions (didn't complete purchase)

---

### 2. Funnel Analytics - Drop-Off Analysis
**Status:** ✅ Installed

**Conversion Funnel:**
1. **Landing Page** (100% baseline)
2. **Gallery View** → Track: % who explore styles
3. **Order Page View** → Track: % who click "Order Now"
4. **Photo Upload** → Track: % who upload pet photo
5. **Tier Selection** → Track: % who select pricing tier
6. **Checkout Initiate** → Track: % who click "Proceed to Checkout"
7. **Purchase Complete** → Track: % who complete payment

**API Endpoints:**
- `POST /api/analytics/funnel` - Track funnel step
- `GET /api/analytics/funnel?startDate=...&endDate=...` - Get funnel analytics

**Usage in Code:**
```typescript
import { trackFunnelStep, FunnelStep } from '@/lib/funnel-analytics';

// Automatic page tracking (already installed in layout.tsx)
// Manually track order flow events:
import { trackOrderFunnel } from '@/components/FunnelTracker';

// Photo uploaded
trackOrderFunnel.photoUploaded({ style: 'renaissance' });

// Tier selected
trackOrderFunnel.tierSelected('premium', 19);

// Checkout initiated
trackOrderFunnel.checkoutInitiated('premium', 19);

// Purchase completed
trackOrderFunnel.purchaseCompleted('order_123', 19);
```

**View Results:**
- Admin dashboard: https://pawcasso-atelier.vercel.app/admin/cro
- Shows conversion rates, drop-off rates, biggest bottlenecks

---

### 3. A/B Testing Framework
**Status:** ✅ Installed

**Active Tests:**

#### Test 1: Pricing Tiers (`pricing_test`)
**Hypothesis:** Higher prices will increase perceived value without reducing conversions significantly.

| Variant | Basic | Standard | Premium |
|---------|-------|----------|---------|
| Control | $9    | $19      | $29     |
| Variant A | $12 | $22      | $32     |
| Variant B | $15 | $25      | $35     |

**Expected Outcome:** Find optimal price point that maximizes revenue per user.

#### Test 2: CTA Button Copy (`cta_button_test`)
**Hypothesis:** Action-oriented copy with pricing visibility drives higher conversions.

| Variant | Button Text | Color | Expected Impact |
|---------|-------------|-------|-----------------|
| Control | "Create My Portrait" | Blue | Baseline |
| Variant A | "Transform My Pet Now" | Green | More urgent/action-oriented |
| Variant B | "Get Started - $9" | Purple | Price transparency |
| Variant C | "Order Custom Portrait" | Orange | Professional/premium feel |

**Expected Outcome:** Identify highest-converting button copy and color combination.

**Usage in Code:**
```typescript
import { useABTest, usePricingTest, useCTATest, getCTAButtonClasses } from '@/hooks/useABTest';

// Pricing test
function PricingSection() {
  const { variant, pricing, trackConversion } = usePricingTest();

  return (
    <div>
      <h3>Basic: ${pricing.basicPrice}</h3>
      <button onClick={() => {
        // Track conversion when user purchases
        trackConversion(pricing.basicPrice, { tier: 'basic' });
      }}>
        Buy Now
      </button>
    </div>
  );
}

// CTA button test
function CTAButton() {
  const { cta, trackConversion } = useCTATest();

  return (
    <button
      className={getCTAButtonClasses(cta.color, cta.size)}
      onClick={() => {
        // Track click/conversion
        trackConversion();
      }}
    >
      {cta.text}
    </button>
  );
}
```

**View Results:**
- Admin dashboard: https://pawcasso-atelier.vercel.app/admin/cro
- Shows conversion rates per variant, statistical significance, winner

**Statistical Significance:**
- Minimum sample size: 30 conversions per variant
- p-value threshold: 0.05 (95% confidence)
- Test runs for 7-14 days for reliable results

---

## 📈 Database Schema

New tables added to `schema.prisma`:

### `FunnelEvent`
Tracks user progression through conversion funnel.

```prisma
model FunnelEvent {
  id            String   @id @default(cuid())
  sessionId     String   // Unique session ID
  step          String   // landing, gallery, order_page, photo_upload, tier_selection, checkout_initiate, purchase
  timestamp     DateTime @default(now())
  metadata      String?  // JSON: {style, tier, amount, etc.}
}
```

### `ABTestEvent`
Tracks A/B test variant assignments and conversions.

```prisma
model ABTestEvent {
  id            String   @id @default(cuid())
  testId        String   // pricing_test, cta_button_test
  variant       String   // control, variant_a, variant_b, variant_c
  sessionId     String   // User session ID
  eventType     String   // assignment, conversion
  revenue       Float    @default(0)
  metadata      String?  // JSON: {tier, etc.}
  timestamp     DateTime @default(now())
}
```

**Run migrations:**
```bash
cd website
npx prisma db push
npx prisma generate
```

---

## 🎯 Quick Start

### 1. Set up Microsoft Clarity (5 minutes)
1. Create Clarity account: https://clarity.microsoft.com/
2. Create project for `pawcasso-atelier.vercel.app`
3. Copy Project ID
4. Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_CLARITY_PROJECT_ID=abcd1234
   ```
5. Deploy to Vercel (env vars auto-applied)
6. Wait 24 hours for first data to appear

### 2. Run Database Migrations
```bash
cd website
npx prisma db push
npx prisma generate
npm run build  # Verify no errors
```

### 3. View CRO Dashboard
```bash
# Local dev
npm run dev
# Visit http://localhost:3000/admin/cro

# Production
# Visit https://pawcasso-atelier.vercel.app/admin/cro
```

### 4. Monitor Results Daily
- **Week 1:** Baseline data collection (no changes)
- **Week 2:** Analyze funnel drop-offs, identify biggest bottleneck
- **Week 3:** Launch A/B test for biggest bottleneck (e.g., pricing)
- **Week 4:** Analyze A/B test results, implement winner

---

## 🔍 How to Analyze Results

### Daily Routine (5 minutes)
1. Check **CRO Dashboard** (`/admin/cro`)
2. Look at **overall conversion rate** (targeting 4%)
3. Identify **biggest drop-off step** (e.g., "Order → Photo Upload" = 65% drop)
4. Watch **3-5 Clarity sessions** at that step to see WHY users drop off

### Weekly Deep Dive (30 minutes)
1. **Funnel Analysis:**
   - Which step has worst conversion?
   - Has it improved/declined vs. last week?
   - Filter Clarity sessions by that step, watch 10-20 recordings

2. **A/B Test Review:**
   - Are sample sizes sufficient? (30+ conversions per variant)
   - Is there a clear winner? (statistically significant?)
   - Should we ship the winner or run longer?

3. **Heatmap Analysis:**
   - Where do users click most on order page?
   - Are CTAs above the fold?
   - Are there dead clicks (non-clickable elements users try to click)?

4. **Action Items:**
   - List 3 quick wins (e.g., "Move CTA button higher", "Add trust badges")
   - Prioritize by impact (biggest drop-off first)
   - Implement top priority fix this week

---

## 🛠️ Troubleshooting

### Clarity not showing data
- Check Project ID is correct in `.env.local`
- Verify env var deployed to Vercel
- Wait 24 hours for first session data
- Check browser console for Clarity script errors

### Funnel data not tracking
- Check browser console for API errors
- Verify Prisma schema migrations ran (`npx prisma db push`)
- Check database has `FunnelEvent` table
- Test manually: `POST /api/analytics/funnel` with test data

### A/B test not assigning variants
- Check `localStorage` in browser DevTools (key: `ab_test_user_id`)
- Verify `useABTest` hook is called client-side (not SSR)
- Check browser console for errors

---

## 📊 Success Metrics

**Target: 2% → 4% conversion rate**

### Key Metrics to Track:
1. **Overall Conversion Rate:** Sessions → Purchases (target: 4%)
2. **Biggest Drop-Off:** Identify worst-performing funnel step
3. **Average Revenue Per User (ARPU):** Total revenue / total sessions
4. **A/B Test Winners:** Which variants drive higher conversions?

### Weekly Goals:
- **Week 1-2:** Establish baseline (current: ~2%)
- **Week 3-4:** Reduce biggest drop-off by 10%
- **Week 5-6:** A/B test winner ships, measure impact
- **Week 7-8:** Iterate on next-biggest drop-off
- **Target: Month 2:** Reach 3% conversion (+50%)
- **Target: Month 3:** Reach 4% conversion (+100%)

---

## 🚀 Next Steps

1. **Set up Clarity** (if not done): Add Project ID to env vars
2. **Deploy to production:** Merge this branch, push to Vercel
3. **Wait 7 days:** Collect baseline data
4. **Analyze funnel:** Find biggest drop-off step
5. **Watch Clarity sessions:** Understand WHY users drop off
6. **Run A/B test:** Test hypothesis for improvement
7. **Iterate:** Repeat process for next bottleneck

**Expected Timeline to 4% Conversion:** 8-12 weeks with consistent weekly iteration.

---

## 📚 Additional Resources

- [Microsoft Clarity Docs](https://docs.microsoft.com/en-us/clarity/)
- [A/B Testing Best Practices](https://vwo.com/ab-testing/)
- [Funnel Optimization Guide](https://www.optimizely.com/optimization-glossary/conversion-funnel/)
- [Statistical Significance Calculator](https://abtestguide.com/calc/)
