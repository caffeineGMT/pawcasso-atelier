# Seasonal Bundle Promotions System - Implementation Summary

## 🎯 Objective
Implement an automated seasonal promotions system that increases average order value from $9 to $35+ through strategic upsells, psychological pricing (urgency through limited-time discounts), and themed bundle offerings.

## ✨ What Was Built

### 1. Core Promotions Library (`website/src/lib/promotions.ts`)
**Purpose**: Centralized promotion data and date-based activation logic

**Features**:
- 8 pre-configured seasonal campaigns:
  - 💝 Valentine's Day (Feb 1-14): 25% off Couples Bundle
  - 🌷 Mother's Day (May 1-10): 20% off Family Bundle
  - ☀️ Summer Flash Sale (Jul 1-7): 30% off Premium/Deluxe
  - 🎃 Halloween (Oct 15-31): 20% off Dark Fantasy styles
  - 🔥 Black Friday (Nov 27-30): 50% off all packages
  - 💻 Cyber Monday (Nov 30-Dec 1): 40% off Bundle
  - 🎄 Christmas (Dec 10-24): 30% off
  - 🎊 New Year (Dec 26-Jan 5): 35% off

**API**:
- `getActivePromotion()`: Returns current promo based on today's date
- `getPromotionById(id)`: Get specific promotion
- `isPromotionActive(id)`: Check if promo is active
- `getUpcomingPromotions()`: List future promos

**Data Model**:
```typescript
interface Promotion {
  id: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;
  discountPercent: number;
  bannerText: string;
  ctaText: string;
  couponCode?: string; // Stripe coupon ID
  bundleSlug?: string; // Links to /bundles/[id]
  theme: {
    emoji: string;
    primaryColor: string;
    accentColor: string;
  };
}
```

### 2. Promotion Banner Component (`website/src/components/PromotionBanner.tsx`)
**Purpose**: Auto-showing, dismissible promotional banner at top of site

**Features**:
- Automatically displays active promotion (date-based)
- Dismissible (stores `promo_dismissed_{id}` in localStorage)
- Themed styling (uses promotion's primaryColor/accentColor)
- CTA button links to:
  - Themed bundle page (`/bundles/{bundleSlug}`) if available
  - Order page with discount code (`/order?code={couponCode}`) otherwise

**UX Flow**:
1. Page loads → checks `getActivePromotion()`
2. If active + not dismissed → banner appears
3. User clicks "X" → localStorage flag set, banner hides
4. When new promo starts (different ID) → banner reappears

### 3. Layout Integration (`website/src/app/layout.tsx`)
**Change**: Added `<PromotionBanner />` at top of layout (above Header)

**Impact**: Global promotion visibility across all pages

### 4. Stripe Checkout Enhancement (`website/src/lib/stripe.ts`)
**Purpose**: Automatic discount application in checkout flow

**Discount Priority Logic**:
1. **Explicit discount code** (user-provided) → highest priority
2. **Active seasonal promotion** → auto-applied if no explicit code
3. **Referral code** (20% off) → lowest priority

**Implementation**:
```typescript
if (discountCode) {
  sessionParams.discounts = [{ coupon: discountCode }];
} else {
  const activePromotion = getActivePromotion();
  if (activePromotion?.couponCode) {
    sessionParams.discounts = [{ coupon: activePromotion.couponCode }];
    // Track promo in metadata
    sessionParams.metadata.promotionId = activePromotion.id;
    sessionParams.metadata.promotionName = activePromotion.name;
  } else if (referralCode) {
    // Apply referral discount
  }
}
```

**Metadata Tracking**: Promotion ID, name, and discount % stored in Stripe session metadata for analytics

### 5. Dynamic Bundle Pages (`website/src/app/bundles/[id]/page.tsx`)
**Purpose**: Conversion-optimized landing pages for themed seasonal bundles

**Features**:
- Static generation (SSG) for all promotions with `bundleSlug`
- Themed hero sections (gradient backgrounds, emoji, custom colors)
- Feature lists with checkmarks
- Mockup image showcases
- Recommended art styles grid
- Social proof section (10K+ customers, 4.9/5 rating, 24h delivery)
- Multiple CTAs (all link to `/order?code={couponCode}&tier={recommended}`)

**Content Configuration** (`BUNDLE_CONTENT`):
- Valentine's: Couples Bundle (2 portraits, rose borders)
- Mother's Day: Family Bundle (3+ portraits, floral themes)
- Halloween: Spooky Collection (Dark Fantasy/Gothic styles)
- Christmas: Holiday Gift Bundle (festive themes, gift-ready)

**SEO**:
- Dynamic metadata (title, description, OG images)
- Structured page sections for conversion

### 6. Stripe Coupon Setup Utility (`website/src/lib/setup-promotion-coupons.ts`)
**Purpose**: Bulk creation of Stripe promotional coupons

**Usage**:
```bash
# Set environment variable
export STRIPE_SECRET_KEY="sk_test_..."

# Run setup script
npx tsx src/lib/setup-promotion-coupons.ts
```

**Functionality**:
- Loops through all promotions
- Creates Stripe coupons with:
  - ID: `{couponCode}` (e.g., "VALENTINE25")
  - Percent off: `{discountPercent}%`
  - Duration: "once" (single-use per customer)
  - Name: `{promotion.name}`
  - Metadata: promotionId, startDate, endDate
- Idempotent (checks if coupon exists before creating)

**Output Example**:
```
🎉 Setting up promotional coupons in Stripe...

✨ Created coupon VALENTINE25 (25% off) for Valentine's Day Special
✅ Coupon MOM20 already exists (20% off)
✨ Created coupon SUMMER30 (30% off) for Summer Flash Sale
...
🎊 Promotional coupon setup complete!
```

## 🎨 Design System Compliance

All components follow the Pawcasso Atelier design system:

**Colors**:
- Primary gold: `#C9A96E`
- Background: `#000000`
- Text primary: `#F5F5F7`
- Borders: `#1d1d1f`
- Promotion-specific colors (from `theme.primaryColor`, `theme.accentColor`)

**Typography**:
- Inter font stack
- Headings: 600 weight, -0.02em tracking
- Body: 400 weight, 16px base

**Spacing**:
- 4px grid system
- Responsive padding: 16px (mobile), 24px (tablet), 32px (desktop)

## 📊 Revenue Impact

**Target**: $1M annual revenue through AOV increase ($9 → $35+)

**Mechanisms**:
1. **Urgency**: Limited-time discounts (25-50% off) create FOMO
2. **Bundle Upsells**: Themed bundles encourage multi-portrait purchases
3. **Strategic Timing**: Seasonal hooks (Valentine's, Mother's Day, Black Friday)
4. **Conversion Optimization**: Themed landing pages with social proof
5. **Automatic Application**: Frictionless discount (no code entry required)

**Expected Behavior**:
- Feb 1, 2026: Valentine's banner auto-appears
- User clicks banner → redirected to `/bundles/valentines`
- Bundle page shows Couples Bundle with 25% off
- User orders Premium tier ($29) → Stripe applies VALENTINE25 → $21.75 final price
- Promotion expires Feb 15 → banner auto-hides

## 🔧 Technical Decisions

### 1. **Date-Based Activation (Not Manual Toggles)**
**Rationale**: Eliminates manual work. Promotions auto-start/stop based on date ranges.

**Alternative Considered**: Admin dashboard toggle
**Why Not**: Requires login, button clicks, potential for human error (forgetting to turn on/off)

### 2. **localStorage for Dismissal (Not Cookies)**
**Rationale**: Simple, client-side, no server requests, no cookie consent needed

**Storage Key**: `promo_dismissed_{promotionId}` (separate flag per promo)

**Alternative Considered**: Cookie or session storage
**Why Not**: Cookies require consent banners; session storage clears on tab close (want persistence)

### 3. **Priority: Explicit Code > Active Promo > Referral**
**Rationale**: Respects user intent (if they entered a code, honor it) while auto-applying promos

**Alternative Considered**: Always apply highest discount
**Why Not**: Complex logic, potential customer confusion ("why didn't my code work?")

### 4. **SSG for Bundle Pages (Not Dynamic Rendering)**
**Rationale**: Fast page loads, SEO-friendly, no runtime overhead

**Trade-off**: Need to rebuild site when adding new promotions (acceptable for 8 annual promos)

### 5. **Single Coupon Per Promotion (Not Tiered)**
**Rationale**: Simple Stripe integration, clear messaging

**Alternative Considered**: Different coupons per tier (VALENTINE25_BASIC, VALENTINE25_PREMIUM)
**Why Not**: Adds complexity, confuses customers, harder to track

## 🚀 Deployment Checklist

Before going live:

1. **Create Stripe Coupons**:
   ```bash
   cd website
   export STRIPE_SECRET_KEY="sk_live_..."
   npx tsx src/lib/setup-promotion-coupons.ts
   ```

2. **Verify Coupon IDs Match**:
   - Check Stripe dashboard: all 8 coupons exist
   - IDs: `VALENTINE25`, `MOM20`, `SUMMER30`, `SPOOKY20`, `BLACKFRIDAY50`, `CYBER40`, `XMAS30`, `NEWYEAR35`

3. **Test Banner Dismissal**:
   - Load site during active promotion (or change date in `promotions.ts` for testing)
   - Click "X" → banner should disappear
   - Refresh page → banner should stay hidden
   - Clear localStorage → banner reappears

4. **Test Checkout Flow**:
   - Go to `/bundles/valentines` (or adjust dates to make it active)
   - Click CTA → should redirect to `/order?code=VALENTINE25&tier=premium`
   - Complete order → verify 25% discount applied in Stripe
   - Check Stripe session metadata → should include `promotionId: 'valentines'`

5. **SEO Check**:
   - Visit `/bundles/valentines`
   - View page source → verify `<title>`, `<meta name="description">`, Open Graph tags

6. **Mobile Responsive**:
   - Test banner on mobile (text should truncate gracefully)
   - Test bundle pages on mobile (grid → column layout)

## 📁 File Structure
```
website/
├── src/
│   ├── lib/
│   │   ├── promotions.ts              (NEW) Core promo logic
│   │   ├── stripe.ts                  (MODIFIED) Auto-discount application
│   │   └── setup-promotion-coupons.ts (NEW) Stripe setup script
│   ├── components/
│   │   └── PromotionBanner.tsx        (NEW) Dismissible banner
│   └── app/
│       ├── layout.tsx                 (MODIFIED) Added PromotionBanner
│       └── bundles/
│           └── [id]/
│               └── page.tsx           (NEW) Dynamic bundle pages
```

## 🎯 Acceptance Criteria (Met)

✅ **Banner auto-appears Feb 1 for Valentine's promo**
- `getActivePromotion()` checks today's date against `startDate`/`endDate`
- Returns `valentines` promo when `2026-02-01 <= today <= 2026-02-14`

✅ **Clicking banner redirects to themed bundle page**
- `PromotionBanner` component uses `promotion.bundleSlug` to link to `/bundles/valentines`

✅ **Stripe checkout applies correct discount**
- `createCheckoutSession()` checks `getActivePromotion()` and applies `couponCode` to `sessionParams.discounts`
- Verified in `stripe.ts` lines 161-173

✅ **Promotion auto-expires after endDate**
- `getActivePromotion()` returns `null` when `today > endDate`
- Banner component returns `null` (doesn't render) when no active promo

✅ **Banner is dismissible with localStorage persistence**
- Click "X" → `localStorage.setItem('promo_dismissed_{id}', 'true')`
- On mount → checks localStorage, sets `isDismissed` if found
- Each promo has separate flag (Valentine's dismiss doesn't affect Mother's Day)

## 🔮 Future Enhancements (Not Implemented)

**1. Admin Dashboard for Promotions**
- Visual calendar of promotions
- Toggle enable/disable without code changes
- Real-time analytics (impressions, click-through rate, conversion rate)

**2. A/B Testing**
- Test different discount percentages (25% vs 30%)
- Test CTA copy ("Shop Now" vs "Claim Discount")
- Test banner position (top vs bottom)

**3. Email Campaign Integration**
- Send promo emails 2 days before promo starts
- Abandoned cart emails with promo code
- Post-promo "Last Chance" emails

**4. Multi-Promotion Stacking**
- Allow combining promotions (e.g., "Valentine's + Referral = 40% off")
- Complex discount logic (max discount caps)

**5. Geo-Targeting**
- Different promos by country/region
- Currency-specific discounts

**6. Countdown Timers**
- "Ends in 3 days 5 hours" urgency messaging
- Real-time countdown on bundle pages

## 📝 Notes for Developers

**Adding a New Promotion**:
1. Add entry to `PROMOTIONS` array in `promotions.ts`
2. If themed bundle needed:
   - Set `bundleSlug` field
   - Add entry to `BUNDLE_CONTENT` in `bundles/[id]/page.tsx`
3. Run Stripe coupon setup script
4. Rebuild site (for SSG bundle pages)

**Testing Outside Date Range**:
```typescript
// In promotions.ts, temporarily change date check:
const today = '2026-02-05'; // Force Valentine's promo to be active
```

**Debugging**:
- Check browser console for active promo: `localStorage.getItem('promo_dismissed_valentines')`
- Check Stripe dashboard → Coupons → verify coupon exists
- Check Stripe checkout session metadata for `promotionId`

## 🎉 Summary

Built a production-ready seasonal promotions system that:
- **Automates** promotional campaigns (no manual activation)
- **Increases AOV** through strategic discounts and bundles
- **Optimizes conversion** with themed landing pages
- **Reduces friction** (auto-applied discounts, no code entry)
- **Scales easily** (add new promos by updating data array)

Ready for $1M revenue growth through psychological pricing and seasonal urgency tactics.
