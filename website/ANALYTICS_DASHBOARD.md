# Stripe Revenue Analytics Dashboard

## Overview

Comprehensive revenue analytics system that tracks all key e-commerce metrics for Pawcasso Atelier.

## Features

### Key Metrics Tracked

1. **Revenue Metrics**
   - Total Revenue (all-time)
   - Monthly Revenue (current month)
   - Daily Revenue (today)
   - Average Order Value (AOV)

2. **Order Metrics**
   - Total Orders
   - Monthly Orders
   - Daily Orders

3. **Refund Metrics**
   - Total Refunds
   - Refund Rate (%)
   - Total Refund Amount

4. **Customer Metrics**
   - Total Customers
   - Repeat Customers
   - Average Customer LTV (Lifetime Value)

5. **Acquisition Channel Analytics**
   - Orders by channel (utm_source, utm_medium, or direct)
   - Revenue by channel
   - Average Order Value by channel
   - Customer LTV by channel

6. **Time Series Data**
   - Last 30 days daily performance
   - Orders per day
   - Revenue per day
   - Refunds per day

## Architecture

### Database Schema

**Order Model** (`prisma/schema.prisma`):
- Tracks all completed orders from Stripe
- Includes customer info, order details, acquisition data
- Supports refund tracking
- Indexes on key fields for fast queries

### API Routes

**GET /api/admin/analytics**:
- Syncs latest orders from Stripe
- Calculates all analytics metrics
- Returns comprehensive JSON response

**POST /api/admin/analytics**:
- `{ action: 'sync' }` - Manually trigger Stripe sync

### Webhook Integration

**POST /api/webhooks/stripe**:
- Automatically creates Order records on `checkout.session.completed`
- Updates Order with portrait URLs on delivery
- Tracks refunds via `charge.refunded` event

### Dashboard UI

**Page**: `/admin/analytics`

Features:
- Real-time metrics cards
- Channel breakdown table
- 14-day revenue chart (bar chart)
- One-click Stripe sync button
- Responsive design
- Dark theme matching Pawcasso brand

## Usage

### Accessing the Dashboard

1. Navigate to `/admin/analytics`
2. Dashboard automatically loads latest data on mount
3. Click "Sync Stripe Data" to manually refresh from Stripe

### Understanding Metrics

**MRR (Monthly Recurring Revenue)**:
- For this e-commerce site, this is "Monthly Revenue" (one-time purchases)
- Shows total revenue in current calendar month

**AOV (Average Order Value)**:
- Total revenue ÷ Total orders
- Helps identify pricing effectiveness

**Refund Rate**:
- (Total refunds ÷ Total orders) × 100
- Should stay below 5% for healthy business

**LTV by Channel**:
- Revenue from channel ÷ Unique customers from channel
- Shows which acquisition channels bring highest-value customers

## Data Flow

1. **Customer completes checkout** → Stripe webhook fires
2. **Webhook handler** → Creates Order record in database
3. **Portrait generation completes** → Order updated with delivery status
4. **Refund issued** → Order updated with refund data
5. **Analytics dashboard** → Queries Order table and calculates metrics

## Performance

- Database queries use indexes for fast performance
- Analytics calculation happens server-side
- Results cached in browser until manual refresh
- Stripe sync limited to last 100 sessions (can be increased)

## Future Enhancements

- [ ] Export analytics to CSV
- [ ] Email weekly/monthly reports
- [ ] Cohort analysis (customer retention)
- [ ] Revenue forecasting
- [ ] Funnel analytics (visitors → orders)
- [ ] Real-time dashboard updates (websockets)
- [ ] Custom date range filters
- [ ] Advanced charts (line charts, pie charts)

## Environment Variables

No additional env vars needed beyond existing Stripe config:
- `STRIPE_SECRET_KEY` - Used to fetch order data
- `STRIPE_WEBHOOK_SECRET` - Used to verify webhooks

## Deployment

1. Database schema already migrated
2. No additional build steps needed
3. Dashboard accessible immediately at `/admin/analytics`
4. Webhooks automatically create Order records on production

## Monitoring

Check the following for system health:
- Refund rate should stay < 5%
- Daily orders should trend upward
- AOV should remain stable or increase
- Top acquisition channels should be tracked

## Support

For issues or questions:
- Check Vercel logs for webhook errors
- Check Stripe webhook dashboard for delivery status
- Verify database connection in Vercel project settings
