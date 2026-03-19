# Conversion Funnel Analytics System

## Overview

This system tracks customer conversion journeys from first touch to purchase, providing comprehensive analytics to identify drop-off points and optimize conversion rates.

## Conversion Funnel Stages

The funnel tracks 5 key stages:

1. **Homepage View** (`page_view`)
   - Event: User lands on the homepage (/)
   - Tracked in: `website/src/app/page.tsx`
   - Event name: `page_view`

2. **Product Page View** (`order_start`)
   - Event: User visits the order page
   - Tracked in: `website/src/app/order/page.tsx`
   - Event name: `order_start`

3. **Add to Cart** (`photo_upload`)
   - Event: User uploads a pet photo (signals purchase intent)
   - Tracked in: `website/src/app/order/page.tsx` (handleFileChange function)
   - Event name: `photo_upload`

4. **Checkout Started** (`checkout_start`)
   - Event: User submits the order form to proceed to payment
   - Tracked in: `website/src/app/order/page.tsx` (handleSubmit function)
   - Event name: `checkout_start`

5. **Payment Complete** (`purchase_complete`)
   - Event: User completes payment successfully
   - Tracked in: `website/src/components/SuccessPageTracker.tsx`
   - Event name: `purchase_complete`

## Architecture

### Database Schema

**AnalyticsEvent Table** (`prisma/schema.prisma`)
```prisma
model AnalyticsEvent {
  id        String  @id @default(cuid())
  eventName String  // 'page_view', 'order_start', 'photo_upload', 'checkout_start', 'purchase_complete'
  sessionId String
  userId    String?

  // UTM parameters for attribution
  utmSource   String?
  utmMedium   String?
  utmCampaign String?
  utmContent  String?
  utmTerm     String?

  // Context
  pathname String
  referrer String?
  metadata String? // JSON metadata
  revenue  Float   @default(0)

  createdAt DateTime @default(now())

  @@index([eventName])
  @@index([sessionId])
  @@index([createdAt])
}
```

### API Endpoints

#### GET /api/analytics/conversion-funnel
Fetches conversion funnel data with drop-off analysis.

**Query Parameters:**
- `timeRange`: `1d` | `7d` | `30d` | `90d` (default: `7d`)
- `startDate`: ISO 8601 date (optional)
- `endDate`: ISO 8601 date (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "funnel": [
      {
        "step": "page_view",
        "label": "Homepage View",
        "count": 1500,
        "uniqueSessions": 1500,
        "conversionRate": 100.0,
        "dropOffRate": 0.0,
        "dropOffCount": 0
      },
      {
        "step": "order_start",
        "label": "Product Page View",
        "count": 450,
        "uniqueSessions": 450,
        "conversionRate": 30.0,
        "dropOffRate": 70.0,
        "dropOffCount": 1050
      }
      // ... more steps
    ],
    "metrics": {
      "totalSessions": 1500,
      "totalConversions": 45,
      "overallConversionRate": 3.0,
      "totalRevenue": 441.00,
      "avgOrderValue": 9.80
    },
    "dropOffPoints": [
      {
        "step": "order_start",
        "label": "Product Page View",
        "dropOffRate": 70.0,
        "dropOffCount": 1050
      }
      // Top 3 drop-off points
    ],
    "timeSeries": [
      {
        "date": "2026-03-13",
        "page_view": 200,
        "order_start": 60,
        "photo_upload": 45,
        "checkout_start": 40,
        "purchase_complete": 8
      }
      // Daily breakdown
    ],
    "sourceBreakdown": [
      {
        "source": "instagram",
        "sessions": 500,
        "conversions": 15,
        "revenue": 147.00,
        "conversionRate": 3.0
      }
      // Traffic source performance
    ]
  }
}
```

## Dashboard

### Location
`/admin/conversion-funnel` - Main conversion funnel dashboard

### Features

1. **Visual Funnel Chart**
   - Step-by-step progression with user counts
   - Conversion rates at each stage
   - Drop-off percentages between stages
   - Color-coded visual indicators

2. **Key Metrics Cards**
   - Total sessions
   - Total conversions
   - Overall conversion rate
   - Total revenue
   - Average order value
   - Overall drop-off rate

3. **Critical Drop-off Points**
   - Top 3 biggest conversion blockers
   - Actionable recommendations based on drop-off location
   - Severity indicators (CRITICAL tag for >50% drop-off)

4. **Traffic Source Performance**
   - Conversion rates by UTM source
   - Revenue attribution by source
   - Sessions and conversions per channel

5. **Daily Trend Analysis**
   - 7-day conversion trend chart
   - Daily conversion rates
   - Daily sales volume

6. **Time Range Filters**
   - Today (1d)
   - 7 Days (7d)
   - 30 Days (30d)
   - 90 Days (90d)

## Tracking Implementation

### Homepage Tracking
```typescript
// website/src/app/page.tsx
useEffect(() => {
  captureUTMParams(); // Capture UTM parameters
  trackAnalyticsEvent('page_view'); // Track homepage view
}, []);
```

### Product Page Tracking
```typescript
// website/src/app/order/page.tsx
useEffect(() => {
  captureUTMParams();
  trackAnalyticsEvent('order_start'); // Track order page view
}, [searchParams]);
```

### Add to Cart Tracking
```typescript
// website/src/app/order/page.tsx - handleFileChange()
trackAnalyticsEvent('photo_upload', {
  tier: selectedTier,
  price: selectedTierConfig?.price,
  file_size: file.size,
  file_type: file.type,
});
```

### Checkout Started Tracking
```typescript
// website/src/app/order/page.tsx - handleSubmit()
trackAnalyticsEvent('checkout_start', {
  tier: selectedTier,
  price: selectedTierConfig?.price,
  style,
  pet_name: petName,
});
```

### Purchase Complete Tracking
```typescript
// website/src/components/SuccessPageTracker.tsx
trackAnalyticsEvent('purchase_complete', {
  order_id: sessionId,
  tier: tier || 'basic',
}, parseFloat(amount)); // Revenue tracking
```

## Usage

### Accessing the Dashboard

1. Navigate to `/admin/conversion-funnel`
2. Select desired time range (1d, 7d, 30d, 90d)
3. Review metrics and identify drop-off points

### Interpreting Results

**High Drop-off Points Indicate:**
- UX friction at that specific step
- Missing trust signals
- Unclear value proposition
- Technical issues (slow loading, broken features)
- Pricing concerns

**Recommended Actions by Drop-off Location:**

1. **Homepage → Product Page** (70%+ drop-off)
   - Improve CTA clarity and visibility
   - Add social proof and trust badges
   - Optimize page load speed
   - Clearer value proposition

2. **Product Page → Add to Cart** (60%+ drop-off)
   - Simplify photo upload process
   - Add progress indicators
   - Mobile-optimize upload experience
   - Reduce friction (fewer clicks)

3. **Add to Cart → Checkout** (50%+ drop-off)
   - Reduce form fields
   - Add trust signals (secure payment badges)
   - Guest checkout option
   - Clear pricing breakdown

4. **Checkout → Payment** (40%+ drop-off)
   - Multiple payment options
   - Clear security messaging
   - Address form errors
   - Optimize for mobile

## Performance Targets

**Industry Benchmarks:**
- Overall conversion rate: 2-3% (good), 3-5% (excellent)
- Homepage → Product: 30-40%
- Product → Add to Cart: 15-25%
- Add to Cart → Checkout: 60-70%
- Checkout → Purchase: 70-85%

**Current System Capabilities:**
- Real-time event tracking
- Session-based attribution
- UTM parameter tracking
- Revenue attribution
- Multi-device support
- Time-series analysis

## Related Systems

### Mobile Checkout Funnel (`/admin/funnel`)
- Device-specific analysis (mobile vs desktop vs tablet)
- UX friction signals (rage taps, orientation changes)
- Mobile-specific drop-off hotspots

### Analytics Dashboard (`/admin/analytics`)
- Revenue metrics
- Customer acquisition cost (CAC)
- LTV:CAC ratio
- Channel performance

## Testing

To test the funnel tracking:

1. Open browser with network inspector
2. Visit homepage → Check for `page_view` event
3. Navigate to `/order` → Check for `order_start` event
4. Upload a photo → Check for `photo_upload` event
5. Submit order form → Check for `checkout_start` event
6. Complete payment → Check for `purchase_complete` event on success page

All events should POST to `/api/analytics/track` with:
- `eventName`: The funnel stage
- `sessionId`: Consistent across the journey
- `utm`: UTM parameters (if present)
- `metadata`: Additional context

## Maintenance

**Regular Tasks:**
1. Monitor overall conversion rate weekly
2. Identify and address critical drop-off points (>50%)
3. A/B test improvements on highest drop-off steps
4. Review traffic source performance monthly
5. Archive old analytics data quarterly (90+ days)

**Database Cleanup:**
```sql
-- Archive analytics events older than 90 days
DELETE FROM AnalyticsEvent WHERE createdAt < NOW() - INTERVAL '90 days';
```

## Future Enhancements

- [ ] Cohort analysis (conversion by signup week)
- [ ] Customer journey visualization (Sankey diagram)
- [ ] Predictive drop-off alerts
- [ ] Real-time funnel monitoring dashboard
- [ ] Automated insights and recommendations
- [ ] Email alerts for critical drop-off rate changes
- [ ] Integration with heatmap tools (Hotjar, Microsoft Clarity)
