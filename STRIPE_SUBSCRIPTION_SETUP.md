# Stripe Subscription Setup Guide

## Overview

This guide walks through setting up the **Monthly Pet Portrait Subscription** ($29/month) in Stripe and configuring it for Pawcasso Atelier.

## Prerequisites

- Stripe account (Test mode for testing, Live mode for production)
- Access to Stripe Dashboard
- Vercel deployment with webhook URL configured

---

## Step 1: Create Subscription Product in Stripe

### 1.1 Navigate to Products

1. Log in to [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to **Products** → **Add Product**

### 1.2 Configure Product

**Product Information:**
- **Name:** `Monthly Pet Portrait Subscription`
- **Description:** `Get 1 stunning AI-generated pet portrait every month. Cancel anytime.`
- **Statement Descriptor:** `PAWCASSO MONTHLY` (appears on customer's credit card statement)
- **Image:** Upload a sample pet portrait image (optional but recommended)

**Pricing:**
- **Pricing Model:** `Standard pricing`
- **Price:** `$29.00 USD`
- **Billing Period:** `Monthly`
- **Price Nickname:** `monthly-portrait-29` (internal reference)

**Advanced Settings:**
- **Usage Type:** `Licensed` (not metered)
- **Tax Code:** Select appropriate tax code for digital goods in your jurisdiction

**Click "Save Product"**

### 1.3 Copy Price ID

After creating the product, you'll see a **Price ID** that looks like:
```
price_1NxxxxxxxxxxxxxxxxxxxxXX
```

**Copy this Price ID** – you'll need it for the next step.

---

## Step 2: Configure Environment Variables

### 2.1 Update `.env.local`

Add the subscription price ID to your `.env.local` file:

```bash
# Stripe Subscription Price IDs
STRIPE_SUBSCRIPTION_MONTHLY_PORTRAIT=price_1NxxxxxxxxxxxxxxxxxxxxXX
```

Replace `price_1NxxxxxxxxxxxxxxxxxxxxXX` with the actual Price ID you copied from Step 1.3.

### 2.2 Update Vercel Environment Variables

If deploying to Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add `STRIPE_SUBSCRIPTION_MONTHLY_PORTRAIT` with the Price ID value
4. **Important:** Set the variable for all environments (Production, Preview, Development)
5. Redeploy the application to pick up the new environment variable

---

## Step 3: Configure Stripe Webhooks

### 3.1 Required Webhook Events

The application listens for the following Stripe webhook events:

**Subscription Events:**
- `customer.subscription.created` - When subscription is created
- `customer.subscription.updated` - When subscription status changes
- `customer.subscription.deleted` - When subscription is canceled/expires
- `invoice.paid` - When monthly billing succeeds (resets portrait quota)
- `invoice.payment_failed` - When monthly billing fails

**Existing Events (already configured):**
- `checkout.session.completed` - When one-time purchase completes
- `charge.refunded` - When refund is issued

### 3.2 Add Webhook Endpoint

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add Endpoint**
3. Enter your webhook URL:
   - **Test Mode:** `https://your-vercel-url.vercel.app/api/webhooks/stripe`
   - **Live Mode:** `https://pawcasso.com/api/webhooks/stripe`
4. Select the following events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `checkout.session.completed`
   - `charge.refunded`
5. Click **Add Endpoint**

### 3.3 Get Webhook Signing Secret

After creating the webhook:

1. Click on the webhook endpoint you just created
2. Scroll to **Signing Secret** section
3. Click **Reveal** and copy the secret (starts with `whsec_`)
4. Update your `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
   ```
5. Update Vercel environment variables with the same value

---

## Step 4: Test Subscription Flow

### 4.1 Test Mode Subscription

1. Navigate to `/subscribe` on your local development server
2. Enter test email and name
3. Click "Start Subscription"
4. Use Stripe test card:
   - **Card Number:** `4242 4242 4242 4242`
   - **Expiry:** Any future date (e.g., `12/34`)
   - **CVC:** Any 3 digits (e.g., `123`)
   - **ZIP:** Any ZIP code (e.g., `12345`)
5. Complete checkout
6. Verify redirect to `/subscribe/success`

### 4.2 Verify Database Records

After successful test checkout, verify the following database records were created:

```bash
# Check subscription table
SELECT * FROM Subscription WHERE customerEmail = 'test@example.com';

# Check subscription usage
SELECT * FROM SubscriptionUsage WHERE subscriptionId = '<subscription-id>';
```

Expected data:
- **Subscription:** status = 'active', portraitsPerMonth = 1, portraitsRemainingThisPeriod = 1
- **SubscriptionUsage:** portraitsAllowed = 1, portraitsUsed = 0

### 4.3 Test Webhook Events

Trigger webhook events manually in Stripe Dashboard:

1. Go to **Developers** → **Events**
2. Click **Send test webhook**
3. Select each event type and send to your webhook endpoint
4. Verify logs show successful processing

---

## Step 5: Production Deployment

### 5.1 Create Live Mode Product

Repeat **Step 1** but in **Live Mode**:

1. Switch Stripe Dashboard to **Live Mode** (toggle in top-right)
2. Create the same product and pricing
3. Copy the **Live Mode Price ID**

### 5.2 Update Production Environment Variables

In Vercel:

1. Update `STRIPE_SUBSCRIPTION_MONTHLY_PORTRAIT` for Production environment
2. Use the **Live Mode Price ID**
3. Redeploy

### 5.3 Configure Live Webhooks

Repeat **Step 3** in **Live Mode**:

1. Add webhook endpoint for production URL
2. Copy Live Mode webhook secret
3. Update Vercel environment variables

---

## Step 6: Testing Checklist

Before launching to customers, test the complete subscription lifecycle:

- [ ] **Signup Flow**
  - [ ] Customer can subscribe successfully
  - [ ] Redirects to success page
  - [ ] Subscription created in Stripe
  - [ ] Subscription record created in database

- [ ] **Dashboard**
  - [ ] Customer can view subscription status
  - [ ] Portrait quota displays correctly
  - [ ] Billing period shows correctly

- [ ] **Order Flow**
  - [ ] Subscriber can order portrait with quota
  - [ ] Portrait quota decrements after order
  - [ ] Non-subscriber cannot access subscriber order flow

- [ ] **Cancellation**
  - [ ] Customer can cancel subscription
  - [ ] Subscription marked as `cancel_at_period_end`
  - [ ] Customer retains access until period end
  - [ ] Subscription expires at end of period

- [ ] **Reactivation**
  - [ ] Customer can reactivate canceled subscription
  - [ ] Subscription continues normally

- [ ] **Monthly Billing**
  - [ ] `invoice.paid` webhook fires on renewal
  - [ ] Portrait quota resets to 1
  - [ ] New billing period starts
  - [ ] Invoice record created in database

- [ ] **Failed Payment**
  - [ ] `invoice.payment_failed` webhook fires
  - [ ] Subscription status updates to `past_due`
  - [ ] Customer notified (TODO: implement email)

---

## Database Schema Reference

The subscription system uses the following models:

### `Subscription`
Tracks active subscriptions, quota, billing periods.

### `SubscriptionOrder`
Links portrait orders to subscriptions (tracks which portraits were ordered via subscription).

### `SubscriptionInvoice`
Logs Stripe invoices for billing history and reconciliation.

### `SubscriptionUsage`
Historical record of portrait usage per billing period.

---

## API Endpoints

### Subscription Checkout
```
POST /api/checkout/subscription
Body: { email, name, utmSource?, utmMedium?, utmCampaign? }
Returns: { sessionId, url }
```

### Subscription Status
```
GET /api/subscription/status?email=customer@example.com
Returns: { subscription, hasSubscription }
```

### Cancel/Reactivate Subscription
```
POST /api/subscription/cancel
Body: { email, action: "cancel" | "reactivate" }
Returns: { success, message }
```

### Webhooks
```
POST /api/webhooks/stripe
Stripe signature verification required
Handles: subscription.created, subscription.updated, subscription.deleted, invoice.paid, invoice.payment_failed
```

---

## Troubleshooting

### Webhook Signature Verification Fails

**Symptom:** Webhook returns 400 error with signature verification failure.

**Solution:**
- Verify `STRIPE_WEBHOOK_SECRET` matches the signing secret from Stripe Dashboard
- Check that the webhook URL is correct and accessible
- Ensure raw request body is used for signature verification (not parsed JSON)

### Subscription Not Created in Database

**Symptom:** Stripe shows active subscription but database has no record.

**Solution:**
- Check webhook logs in Stripe Dashboard for errors
- Verify `customer.subscription.created` webhook is configured
- Check application logs for database errors
- Manually trigger webhook event from Stripe Dashboard

### Portrait Quota Not Resetting

**Symptom:** New billing period starts but quota remains 0.

**Solution:**
- Verify `invoice.paid` webhook is firing
- Check that `resetPortraitQuota()` function executes without errors
- Verify `SubscriptionUsage` record is created for new period

---

## Revenue Metrics

Track subscription performance with these key metrics:

### Monthly Recurring Revenue (MRR)
```sql
SELECT SUM(amount) as mrr FROM Subscription WHERE status = 'active';
```

### Active Subscribers
```sql
SELECT COUNT(*) as active_subscribers FROM Subscription WHERE status = 'active';
```

### Churn Rate
```sql
SELECT
  COUNT(CASE WHEN status = 'canceled' AND endedAt >= DATE('now', '-30 days') THEN 1 END) * 100.0 /
  COUNT(*) as churn_rate_percent
FROM Subscription;
```

### Average Customer Lifetime
```sql
SELECT AVG(JULIANDAY(endedAt) - JULIANDAY(startedAt)) as avg_lifetime_days
FROM Subscription
WHERE status = 'canceled';
```

---

## Next Steps (Enhancements)

1. **Email Notifications**
   - Welcome email on subscription start
   - Monthly renewal confirmation
   - Payment failed alert
   - Cancellation confirmation

2. **Annual Subscription**
   - Create $299/year plan (save $49 vs monthly)
   - 12 portraits per year

3. **Free Trial**
   - 7-day free trial for new subscribers
   - Add `trial_period_days: 7` to checkout session

4. **Promo Codes**
   - Create Stripe coupons for discounts
   - "FIRST3MONTHS50" - 50% off first 3 months

5. **Referral Program**
   - Give 1 month free for referring a subscriber
   - Track referral conversions

---

## Questions?

For technical questions about the subscription implementation, contact the engineering team or refer to:

- [Stripe Subscription Documentation](https://stripe.com/docs/billing/subscriptions)
- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Pawcasso Codebase README](../README.md)
