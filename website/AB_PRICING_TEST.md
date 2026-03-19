# Dynamic Pricing A/B Test Framework

## Overview

This framework enables automated A/B testing of different pricing strategies to measure price elasticity and revenue impact. The system randomly assigns users to pricing variants and tracks conversions to determine optimal pricing.

## Test Variants

### Control (Current Pricing)
- Basic: $9
- Premium: $29
- Deluxe: $49
- Bundle: $79

### Variant A ($39 Single / $129 Bundle)
- Single portrait: $39 (all tiers)
- Bundle (3 portraits): $129

### Variant B ($49 Single / $129 Bundle)
- Single portrait: $49 (all tiers)
- Bundle (3 portraits): $129

### Variant C ($59 Single / $129 Bundle)
- Single portrait: $59 (all tiers)
- Bundle (3 portraits): $129

### Variant D (Tiered + Bundle)
- Basic: $39
- Premium: $49
- Deluxe: $59
- Bundle: $129

## Architecture

### 1. Core Library (`/lib/ab-pricing.ts`)
- Variant assignment logic with weighted random selection
- Pricing configuration per variant
- Conversion tracking
- Statistical analysis (chi-square confidence calculation)

### 2. Client-Side Hook (`/hooks/useABPricing.ts`)
- React hook for fetching variant assignment
- Cookie-based persistence
- Client-side pricing application

### 3. API Endpoints

#### `/api/ab-test/assign` (GET)
- Assigns user to a variant if not already assigned
- Sets persistent cookies (`pricing_variant`, `ab_session_id`)
- Returns variant and session ID

#### `/api/ab-test/track` (POST)
- Tracks conversion events
- Called from webhook after successful payment
- Body: `{ sessionId, variant, revenue, tier, orderId }`

#### `/api/ab-test/stats` (GET)
- Retrieves test statistics
- Query params: `startDate`, `endDate`
- Returns: impressions, conversions, revenue, confidence per variant

### 4. Integration Points

#### Order Page (`/app/order/page.tsx`)
- Fetches variant assignment on load
- Applies variant pricing to tier configurations
- Passes variant info to checkout API

#### Checkout API (`/api/checkout/route.ts`)
- Accepts `abTestVariant` and `abSessionId`
- Stores in Stripe session metadata

#### Stripe Webhook (`/api/webhooks/stripe/route.ts`)
- Extracts A/B test metadata from session
- Tracks conversion after successful payment

### 5. Admin Dashboard (`/app/admin/ab-testing/page.tsx`)
- Real-time test results
- Variant comparison table
- Statistical confidence indicators
- Date range filtering

## Metrics Tracked

### Per Variant
- **Impressions**: Number of users assigned to variant
- **Conversions**: Number of completed purchases
- **Conversion Rate**: Conversions / Impressions
- **Revenue**: Total revenue generated
- **Average Order Value (AOV)**: Revenue / Conversions
- **Revenue Per Impression (RPI)**: Revenue / Impressions (key metric)

### Statistical Significance
- Chi-square test comparing top 2 variants
- Confidence levels: 80%, 90%, 95%, 99%
- Minimum 100 impressions per variant required

## Usage

### For Users
Users are automatically assigned to a variant when they visit the order page. The assignment is stored in cookies and persists across sessions.

### For Admins
Visit `/admin/ab-testing` to view real-time test results:
- Overall stats (impressions, conversions, revenue)
- Winner announcement with confidence level
- Detailed variant comparison
- Key insights and recommendations

### Changing Test Configuration

Edit `/lib/ab-pricing.ts` to modify:
- Variant weights (allocation percentage)
- Enable/disable specific variants
- Pricing per variant

```typescript
export const DEFAULT_TEST_CONFIG: PricingTestConfig = {
  id: 'pricing_test_2026_03',
  name: 'Dynamic Pricing Elasticity Test',
  active: true, // Set to false to disable test
  variants: {
    control: { weight: 20, enabled: true },
    variant_a: { weight: 20, enabled: true },
    variant_b: { weight: 20, enabled: true },
    variant_c: { weight: 20, enabled: true },
    variant_d: { weight: 20, enabled: true },
  },
};
```

## Data Flow

1. **User visits order page** → `/api/ab-test/assign` assigns variant
2. **User selects tier** → Variant pricing applied client-side
3. **User clicks checkout** → Variant info passed to `/api/checkout`
4. **Stripe session created** → Variant stored in metadata
5. **Payment succeeds** → Webhook tracks conversion via `/lib/ab-pricing`
6. **Admin views dashboard** → `/api/ab-test/stats` aggregates results

## Database Schema

### ABTestEvent
```prisma
model ABTestEvent {
  id        String   @id @default(cuid())
  testId    String   // Test identifier
  variant   String   // control, variant_a, variant_b, variant_c, variant_d
  sessionId String   // User session ID
  eventType String   // assignment, conversion
  revenue   Float    @default(0)
  metadata  String?  // JSON metadata
  timestamp DateTime @default(now())
}
```

## Key Decisions Made

1. **Cookie-based assignment**: Ensures consistent pricing across session
2. **Equal weighting**: All variants get 20% traffic for fair comparison
3. **Revenue Per Impression**: Primary metric (accounts for both conversion and AOV)
4. **Non-intrusive tracking**: Test failures don't break checkout flow
5. **30-day cookie expiry**: Balances persistence with test freshness

## Next Steps

1. **Monitor for 2-4 weeks** to reach statistical significance
2. **Analyze results** focusing on Revenue Per Impression
3. **Consider secondary metrics**: Customer feedback, repeat purchase rates
4. **Implement winner** once 95%+ confidence achieved
5. **Test new hypotheses**: Seasonal pricing, dynamic discounts, etc.

## Troubleshooting

### Low conversion rates
- Check if pricing is too high across all variants
- Verify payment flow is working correctly
- Review checkout friction points

### No statistical significance
- Wait for more data (minimum 100 conversions per variant)
- Consider increasing test duration
- Check if variants are too similar

### Skewed traffic distribution
- Verify variant weights in `DEFAULT_TEST_CONFIG`
- Check cookie assignment logic
- Review for browser/cache issues

## Production Checklist

- ✅ A/B test library implemented
- ✅ API endpoints created
- ✅ Order page integration complete
- ✅ Checkout API tracking enabled
- ✅ Webhook conversion tracking active
- ✅ Admin dashboard deployed
- ✅ Database schema includes ABTestEvent table
- ⏳ Monitor for statistical significance
- ⏳ Analyze results and implement winner

---

**Test ID**: `pricing_test_2026_03`
**Start Date**: 2026-03-18
**Duration**: 30-90 days
**Goal**: Identify optimal pricing that maximizes revenue per customer
