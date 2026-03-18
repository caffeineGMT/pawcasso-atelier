# Stripe Production Mode Activation Guide

**Status:** 🚨 CRITICAL REVENUE BLOCKER - Due: March 20, 2026
**Estimated Time:** 30-45 minutes
**Impact:** Enables real payment processing for $1M revenue target

---

## Overview

This guide will walk you through activating Stripe in production mode and creating live price IDs for all Pawcasso Atelier products.

## Prerequisites Checklist

- [ ] Stripe account fully activated (not in test mode)
- [ ] Business details completed in Stripe Dashboard
- [ ] Bank account connected for payouts
- [ ] Vercel project deployed and accessible

---

## Part 1: Get Live API Keys (5 minutes)

### Step 1.1: Navigate to API Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Click **Developers** in left sidebar
3. Click **API keys** tab
4. Toggle from "Test mode" to **"Live mode"** using the switch in top-right corner

### Step 1.2: Copy Live Keys
Copy these two keys (they will start with the prefixes shown):

**Secret Key** (starts with `sk_live_...`)
```
Example format: sk_live_[51 characters from Stripe Dashboard]
```

**Publishable Key** (starts with `pk_live_...`)
```
Example format: pk_live_[51 characters from Stripe Dashboard]
```

⚠️ **SECURITY:** Never commit live keys to git. They should only exist in:
- `.env.local` (local development, gitignored)
- Vercel environment variables (production)

---

## Part 2: Create Live Products & Price IDs (15 minutes)

### Step 2.1: Navigate to Products
1. In Stripe Dashboard, ensure you're in **Live mode** (top-right toggle)
2. Click **Products** in left sidebar
3. Click **+ Add product** button

### Step 2.2: Create Digital Portrait Products

Create **4 products** with these exact specifications:

#### Product 1: Digital Basic
- **Name:** `Pawcasso Digital - Basic`
- **Description:** `1 AI-generated portrait, 24-hour delivery, high-resolution digital file`
- **Pricing:**
  - Model: **One-time**
  - Price: **$9.00 USD**
  - Currency: **USD**
- **Save product** and copy the **Price ID** (starts with `price_...`)
- 📝 Save as: `STRIPE_PRICE_BASIC`

#### Product 2: Digital Premium
- **Name:** `Pawcasso Digital - Premium`
- **Description:** `1 portrait + 2 variations, 12-hour delivery, multiple aspect ratios`
- **Pricing:**
  - Model: **One-time**
  - Price: **$29.00 USD**
  - Currency: **USD**
- **Save product** and copy the **Price ID**
- 📝 Save as: `STRIPE_PRICE_PREMIUM`

#### Product 3: Digital Deluxe
- **Name:** `Pawcasso Digital - Deluxe`
- **Description:** `3 unique portraits, 6-hour delivery, print-ready files (300 DPI), custom revisions`
- **Pricing:**
  - Model: **One-time**
  - Price: **$49.00 USD**
  - Currency: **USD**
- **Save product** and copy the **Price ID**
- 📝 Save as: `STRIPE_PRICE_DELUXE`

#### Product 4: Digital Bundle
- **Name:** `Pawcasso Digital - Bundle`
- **Description:** `5 unique portraits, instant delivery, commercial license, priority support`
- **Pricing:**
  - Model: **One-time**
  - Price: **$79.00 USD**
  - Currency: **USD**
- **Save product** and copy the **Price ID**
- 📝 Save as: `STRIPE_PRICE_BUNDLE`

### Step 2.3: Create Print Upsell Products (Optional - Phase 2)

These can be created later when Printful integration is ready:

#### Product 5: Framed Print
- **Name:** `Pawcasso Print - Framed (12x16")`
- **Price:** **$49.00 USD** (20% off original $59)
- 📝 Save as: `STRIPE_PRICE_PRINT_FRAMED`

#### Product 6: Canvas Wrap
- **Name:** `Pawcasso Print - Canvas (16x20")`
- **Price:** **$69.00 USD** (20% off original $89)
- 📝 Save as: `STRIPE_PRICE_PRINT_CANVAS`

#### Product 7: Metal Print
- **Name:** `Pawcasso Print - Metal (16x20")`
- **Price:** **$119.00 USD** (20% off original $149)
- 📝 Save as: `STRIPE_PRICE_PRINT_METAL`

---

## Part 3: Set Up Webhook Endpoint (10 minutes)

### Step 3.1: Create Webhook
1. In Stripe Dashboard (Live mode), click **Developers** → **Webhooks**
2. Click **+ Add endpoint** button
3. Enter endpoint URL:
   ```
   https://pawcasso-atelier.vercel.app/api/webhooks/stripe
   ```
4. Click **Select events** button

### Step 3.2: Select Events
Select these **2 events**:
- ✅ `checkout.session.completed`
- ✅ `charge.refunded`

### Step 3.3: Save and Copy Signing Secret
1. Click **Add endpoint** to save
2. Click on the newly created endpoint
3. Click **Reveal** under "Signing secret"
4. Copy the signing secret (starts with `whsec_...`)
5. 📝 Save as: `STRIPE_WEBHOOK_SECRET`

---

## Part 4: Update Environment Variables (5 minutes)

### Step 4.1: Update Local Environment (.env.local)

Update `/Users/michaelguo/pawcasso-atelier/website/.env.local`:

```bash
# Stripe LIVE Keys (Production)
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY_HERE

# Stripe LIVE Price IDs
STRIPE_PRICE_BASIC=price_YOUR_BASIC_PRICE_ID
STRIPE_PRICE_PREMIUM=price_YOUR_PREMIUM_PRICE_ID
STRIPE_PRICE_DELUXE=price_YOUR_DELUXE_PRICE_ID
STRIPE_PRICE_BUNDLE=price_YOUR_BUNDLE_PRICE_ID

# Stripe LIVE Print Price IDs (Optional for Phase 2)
STRIPE_PRICE_PRINT_FRAMED=price_YOUR_FRAMED_PRICE_ID
STRIPE_PRICE_PRINT_CANVAS=price_YOUR_CANVAS_PRICE_ID
STRIPE_PRICE_PRINT_METAL=price_YOUR_METAL_PRICE_ID

# Stripe LIVE Webhook Secret
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SIGNING_SECRET
```

### Step 4.2: Update Vercel Environment Variables

**Option A: Via Vercel Dashboard**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select `pawcasso-atelier` project
3. Click **Settings** tab
4. Click **Environment Variables** in left sidebar
5. For each variable below, click **Edit** or **Add New**:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `STRIPE_SECRET_KEY` | `sk_live_...` | Production |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | Production, Preview, Development |
| `STRIPE_PRICE_BASIC` | `price_...` | Production, Preview, Development |
| `STRIPE_PRICE_PREMIUM` | `price_...` | Production, Preview, Development |
| `STRIPE_PRICE_DELUXE` | `price_...` | Production, Preview, Development |
| `STRIPE_PRICE_BUNDLE` | `price_...` | Production, Preview, Development |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Production |

**Option B: Via Vercel CLI**
```bash
cd /Users/michaelguo/pawcasso-atelier/website

# Add Stripe keys
vercel env add STRIPE_SECRET_KEY production
# Paste: sk_live_...

vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
# Paste: pk_live_...

# Add price IDs
vercel env add STRIPE_PRICE_BASIC production
# Paste: price_...

vercel env add STRIPE_PRICE_PREMIUM production
# Paste: price_...

vercel env add STRIPE_PRICE_DELUXE production
# Paste: price_...

vercel env add STRIPE_PRICE_BUNDLE production
# Paste: price_...

# Add webhook secret
vercel env add STRIPE_WEBHOOK_SECRET production
# Paste: whsec_...
```

---

## Part 5: Deploy to Production (5 minutes)

### Step 5.1: Redeploy with New Environment Variables

```bash
cd /Users/michaelguo/pawcasso-atelier

# Commit environment variable documentation (not the actual values)
git add STRIPE_PRODUCTION_ACTIVATION.md
git commit -m "Add Stripe production activation guide"
git push origin main

# Trigger production deployment
cd website
vercel --prod
```

### Step 5.2: Verify Deployment
1. Wait for Vercel deployment to complete
2. Check deployment logs for any errors
3. Verify site is accessible at `https://pawcasso-atelier.vercel.app`

---

## Part 6: End-to-End Testing (10 minutes)

### Step 6.1: Test Real Payment Flow

⚠️ **WARNING:** This will process a REAL payment. Use a card you own.

1. **Visit production site:**
   ```
   https://pawcasso-atelier.vercel.app/order
   ```

2. **Upload a test pet photo** (use your own or a sample)

3. **Select Basic tier** ($9.00 - lowest price for testing)

4. **Fill out order form:**
   - Your real email address (to receive portrait)
   - Pet name: "Test Pet"
   - Style: Any style
   - Click "Proceed to Checkout"

5. **Complete Stripe Checkout:**
   - Use a **real card** (Stripe charges 2.9% + $0.30 fee)
   - Or use Stripe test card in test mode first: `4242 4242 4242 4242`
   - Expected total: $9.00 + fees ≈ $9.56

6. **Monitor webhook execution:**
   - Go to Stripe Dashboard → Developers → Webhooks
   - Click on your webhook endpoint
   - Verify `checkout.session.completed` event was received
   - Status should be "Succeeded" (green checkmark)

### Step 6.2: Verify Portrait Generation

Within 5-10 minutes, check:

1. **Email inbox:** Should receive email with portrait download links
2. **Stripe Dashboard:** Order appears in Payments
3. **Vercel Logs:** Check webhook execution logs for any errors
   ```bash
   vercel logs pawcasso-atelier --prod
   ```

### Step 6.3: Test Refund (Optional)

To verify refund webhook:
1. Go to Stripe Dashboard → Payments
2. Find your test payment
3. Click **Refund** button
4. Confirm full refund
5. Check webhook logs for `charge.refunded` event

---

## Part 7: Monitoring & Validation

### Success Criteria Checklist

- [ ] Live Stripe keys configured in production environment
- [ ] 4 live price IDs created (Basic, Premium, Deluxe, Bundle)
- [ ] Webhook endpoint registered and verified
- [ ] Successfully processed 1 real payment ($9 test order)
- [ ] Portrait generation completed via Manus API
- [ ] Email delivery confirmed with download links
- [ ] Webhook events showing "Succeeded" status in Stripe Dashboard
- [ ] No errors in Vercel production logs

### Common Issues & Troubleshooting

**Issue 1: "Stripe Price ID not configured" error**
- **Cause:** Environment variable not set in Vercel
- **Fix:** Verify all `STRIPE_PRICE_*` variables are set in Vercel Settings → Environment Variables
- **Action:** Redeploy after adding missing variables

**Issue 2: Webhook signature verification failed**
- **Cause:** Wrong webhook secret or endpoint URL mismatch
- **Fix:** Ensure `STRIPE_WEBHOOK_SECRET` matches the signing secret in Stripe Dashboard
- **Action:** Check webhook endpoint URL is exactly `https://pawcasso-atelier.vercel.app/api/webhooks/stripe`

**Issue 3: Portrait generation timeout**
- **Cause:** Manus API slow or down
- **Fix:** Check Manus API status, retry logic in webhook should handle this
- **Action:** Monitor Vercel logs for retry attempts, manual fulfillment if needed

**Issue 4: Payment succeeded but no email sent**
- **Cause:** Resend API key missing or invalid
- **Fix:** Verify `RESEND_API_KEY` is set in Vercel environment variables
- **Action:** Check Vercel logs for email sending errors

---

## Part 8: Post-Activation Tasks

### Immediate (Day 1)
- [ ] Test all 4 pricing tiers with real small payments
- [ ] Monitor first 5 customer orders closely
- [ ] Set up Stripe Dashboard notifications for failed payments
- [ ] Share success metrics in company Slack/updates

### Week 1
- [ ] Review webhook execution logs daily
- [ ] Monitor email delivery rates (via Resend dashboard)
- [ ] Track conversion rate from order page to payment
- [ ] Collect customer feedback on checkout experience

### Month 1
- [ ] Analyze revenue by tier (which is most popular?)
- [ ] Review refund rate and reasons
- [ ] Optimize pricing based on conversion data
- [ ] Consider creating promotional coupons in Stripe

---

## Security Best Practices

✅ **DO:**
- Keep live API keys in Vercel environment variables only
- Use `.env.local` for local development (gitignored)
- Rotate keys immediately if compromised
- Enable Stripe Radar for fraud detection
- Monitor Stripe Dashboard daily for suspicious activity

❌ **DON'T:**
- Commit `.env.local` to git
- Share live API keys in Slack/email
- Use test mode keys in production
- Disable webhook signature verification
- Store keys in client-side code

---

## Support & Resources

- **Stripe Docs:** https://stripe.com/docs/payments/checkout
- **Vercel Env Vars:** https://vercel.com/docs/environment-variables
- **Webhook Testing:** https://stripe.com/docs/webhooks/test
- **Manus API:** https://manus.aws.metafb.cloud/docs

**Questions?** Check Stripe Dashboard → Help or contact stripe-support@stripe.com

---

## Completion Checklist

When you can check ALL boxes, production mode is fully activated:

- [ ] Stripe live mode activated in dashboard
- [ ] Live API keys obtained and documented (securely)
- [ ] 4 digital product price IDs created (Basic, Premium, Deluxe, Bundle)
- [ ] Webhook endpoint created and verified
- [ ] Local `.env.local` updated with live keys
- [ ] Vercel environment variables updated
- [ ] Production deployment completed successfully
- [ ] End-to-end test payment processed ($9 real charge)
- [ ] Portrait generated and delivered via email
- [ ] Webhook events verified in Stripe Dashboard
- [ ] No errors in Vercel production logs
- [ ] Refund flow tested (optional but recommended)

**REVENUE READY:** ✅ Pawcasso Atelier can now accept real payments!

---

**Document Version:** 1.0
**Last Updated:** March 18, 2026
**Author:** Alfie (MetaClaw AI Assistant)
**Next Review:** After first 100 production orders
