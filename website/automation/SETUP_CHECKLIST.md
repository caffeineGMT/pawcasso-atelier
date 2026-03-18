# Automation Setup Checklist

Complete these steps to activate the automated portrait generation pipeline.

## 1. Environment Variables Setup

### Required Variables
Copy these to Vercel project settings (Settings → Environment Variables):

```env
# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs
STRIPE_PRICE_BASIC=price_...
STRIPE_PRICE_PREMIUM=price_...
STRIPE_PRICE_DELUXE=price_...
STRIPE_PRICE_BUNDLE=price_...

# Vercel Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_...

# Manus API
MANUS_API_KEY=manus_...

# Resend Email
RESEND_API_KEY=re_...
```

### How to Get Each Key

#### STRIPE_SECRET_KEY
- [ ] Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
- [ ] Copy "Secret key" (starts with `sk_live_` for production)

#### STRIPE_WEBHOOK_SECRET
- [ ] Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
- [ ] Click "Add endpoint"
- [ ] Enter URL: `https://pawcasso-atelier.vercel.app/api/webhooks/stripe`
- [ ] Select event: `checkout.session.completed`
- [ ] Click "Add endpoint"
- [ ] Click "Reveal" under "Signing secret" (starts with `whsec_`)

#### STRIPE_PRICE_IDs
- [ ] Go to [Stripe Products](https://dashboard.stripe.com/products)
- [ ] Create 4 products if not exists:
  - Basic ($9): Copy price ID → `STRIPE_PRICE_BASIC`
  - Premium ($29): Copy price ID → `STRIPE_PRICE_PREMIUM`
  - Deluxe ($49): Copy price ID → `STRIPE_PRICE_DELUXE`
  - Bundle ($79): Copy price ID → `STRIPE_PRICE_BUNDLE`

#### BLOB_READ_WRITE_TOKEN
- [ ] Run in project directory:
  ```bash
  vercel blob list
  ```
- [ ] If prompted, token will be shown
- [ ] Or get from Vercel dashboard → Storage → Blob

#### MANUS_API_KEY
- [ ] Email `manus-support@meta.com` with:
  ```
  Subject: Manus API Access Request - Pawcasso Atelier

  Hi Manus Team,

  I'm building an AI pet portrait e-commerce site and would like
  API access for automated portrait generation.

  Use case: Generate 1-5 portraits per order using flux-pro model
  Expected volume: ~100-500 requests/month initially

  Thanks!
  Michael Guo
  ```
- [ ] Wait for API key (format: `manus_...`)

#### RESEND_API_KEY
- [ ] Sign up at [Resend](https://resend.com)
- [ ] Go to [API Keys](https://resend.com/api-keys)
- [ ] Create new key → Copy (starts with `re_`)
- [ ] Verify sender domain:
  - Add domain: `pawcasso-atelier.com`
  - Add DNS records as shown
  - Wait for verification

## 2. Stripe Products Setup

### Create Products in Stripe Dashboard

- [ ] **Basic Package** - $9
  - Name: "Pawcasso Basic"
  - Description: "1 portrait, 24-hour delivery"
  - Price: $9.00 one-time payment
  - Currency: USD

- [ ] **Premium Package** - $29
  - Name: "Pawcasso Premium"
  - Description: "3 portraits, 12-hour delivery"
  - Price: $29.00 one-time payment
  - Currency: USD

- [ ] **Deluxe Package** - $49
  - Name: "Pawcasso Deluxe"
  - Description: "5 portraits, 6-hour delivery"
  - Price: $49.00 one-time payment
  - Currency: USD

- [ ] **Bundle Package** - $79
  - Name: "Pawcasso Bundle"
  - Description: "5 portraits, instant delivery, commercial license"
  - Price: $79.00 one-time payment
  - Currency: USD

## 3. Vercel Deployment

- [ ] Push code to GitHub:
  ```bash
  git add .
  git commit -m "Add automated portrait generation pipeline"
  git push origin main
  ```

- [ ] Verify deployment at [Vercel Dashboard](https://vercel.com)
- [ ] Check deployment logs for errors
- [ ] Visit `/api/webhooks/stripe` → should return 405 (Method Not Allowed)

## 4. Webhook Testing

### Test with Stripe CLI

- [ ] Install Stripe CLI:
  ```bash
  brew install stripe/stripe-cli/stripe
  # or download from https://stripe.com/docs/stripe-cli
  ```

- [ ] Login:
  ```bash
  stripe login
  ```

- [ ] Forward events to local dev server:
  ```bash
  # Terminal 1: Run Next.js dev server
  npm run dev

  # Terminal 2: Forward Stripe events
  stripe listen --forward-to localhost:3000/api/webhooks/stripe
  ```

- [ ] Trigger test event:
  ```bash
  stripe trigger checkout.session.completed
  ```

- [ ] Check logs for successful processing

### Test with Real Order

- [ ] Go to `/order` page
- [ ] Fill out form with real data
- [ ] Upload a pet photo
- [ ] Select "Basic" tier
- [ ] Use test card: `4242 4242 4242 4242`
- [ ] Complete checkout
- [ ] Monitor:
  - Vercel logs: `vercel logs --follow`
  - Email inbox: Check for delivery email
  - Stripe dashboard: Check webhook delivery status

## 5. Monitoring Setup

- [ ] Set up Vercel log monitoring
- [ ] Create Stripe webhook monitoring dashboard
- [ ] Set up Resend email delivery alerts
- [ ] Add error tracking (Sentry/Datadog)

## 6. Email Domain Verification

### Resend Sender Setup

- [ ] Add domain in Resend dashboard
- [ ] Add these DNS records to domain:

  | Type | Name | Value |
  |------|------|-------|
  | TXT | @ | resend-verification=... |
  | MX | @ | feedback-smtp.resend.com (priority 10) |
  | DKIM | resend._domainkey | ... |

- [ ] Wait for verification (up to 48 hours)
- [ ] Test send from `portraits@pawcasso-atelier.com`

## 7. Production Validation

### Pre-Launch Checklist

- [ ] All environment variables set in Vercel
- [ ] Stripe webhook endpoint shows "Active" status
- [ ] Test order completes successfully
- [ ] Email delivery works end-to-end
- [ ] Manus API returns valid portraits
- [ ] Generated images upload to Blob storage
- [ ] Stripe metadata updates correctly
- [ ] Error notification email works
- [ ] Webhook signature verification passes

### Post-Launch Monitoring (First Week)

- [ ] Monitor first 10 orders closely
- [ ] Track success rate (target: >95%)
- [ ] Measure average processing time (target: <3 min)
- [ ] Check customer satisfaction (any complaints?)
- [ ] Verify all tiers work correctly (1/3/5 portraits)
- [ ] Test failure scenarios manually

## 8. Backup Plan

### Manual Fulfillment Process

If automation fails, have manual process ready:

1. **Receive failure notification** email
2. **Download pet photo** from Stripe metadata URL
3. **Generate portraits manually** via Manus API or alternative tool
4. **Upload to Blob storage** or email directly
5. **Send customer email** with download links
6. **Update Stripe metadata** to mark as fulfilled

### Alternative AI Providers (if Manus unavailable)

- [ ] Replicate API (Flux, Stable Diffusion)
- [ ] Midjourney (manual generation)
- [ ] DALL-E 3 via OpenAI API
- [ ] Local Stable Diffusion setup

## Common Issues & Fixes

### Issue: "Missing stripe-signature header"
**Fix:** Verify Stripe webhook is sending to correct URL

### Issue: "Invalid signature"
**Fix:** Re-copy webhook secret from Stripe, update Vercel env vars

### Issue: "Missing pet_photo_url"
**Fix:** Ensure upload completes before checkout redirect

### Issue: "Manus API timeout"
**Fix:** Check Manus API status, increase timeout, or use fallback

### Issue: "Email not delivered"
**Fix:** Verify Resend domain, check spam folder, review Resend logs

## Support Contacts

- **Stripe Issues:** support@stripe.com
- **Vercel Issues:** support@vercel.com
- **Resend Issues:** support@resend.com
- **Manus API:** manus-support@meta.com

---

**Completion Date:** ________________

**Tested By:** ________________

**Production Launch:** ________________
