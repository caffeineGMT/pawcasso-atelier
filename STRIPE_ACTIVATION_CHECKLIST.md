# Stripe Production Activation - Quick Checklist

**⏰ Deadline:** March 20, 2026
**📊 Status:** Not Started
**🎯 Goal:** Enable real payment processing for $1M revenue target

---

## Pre-Flight Checks

- [ ] Stripe account fully activated (not restricted to test mode)
- [ ] Business information completed in Stripe
- [ ] Bank account connected for payouts
- [ ] Tax information submitted (if required)

---

## Step 1: Get Live API Keys ⏱️ 5 min

- [ ] Navigate to Stripe Dashboard → Developers → API keys
- [ ] Switch to **Live mode** (toggle in top-right)
- [ ] Copy **Secret Key** (starts with `sk_live_...`)
- [ ] Copy **Publishable Key** (starts with `pk_live_...`)
- [ ] Store keys securely (DO NOT commit to git)

---

## Step 2: Create Products & Prices ⏱️ 15 min

### Digital Portrait Products (Required)

- [ ] **Basic** - $9.00 → Copy price ID
- [ ] **Premium** - $29.00 → Copy price ID
- [ ] **Deluxe** - $49.00 → Copy price ID
- [ ] **Bundle** - $79.00 → Copy price ID

### Print Products (Optional - Phase 2)

- [ ] Framed Print - $49.00 → Copy price ID
- [ ] Canvas Wrap - $69.00 → Copy price ID
- [ ] Metal Print - $119.00 → Copy price ID

---

## Step 3: Configure Webhook ⏱️ 10 min

- [ ] Go to Stripe Dashboard → Developers → Webhooks
- [ ] Click **Add endpoint**
- [ ] Enter URL: `https://pawcasso-atelier.vercel.app/api/webhooks/stripe`
- [ ] Select events: `checkout.session.completed`, `charge.refunded`
- [ ] Save endpoint
- [ ] Copy **Signing Secret** (starts with `whsec_...`)

---

## Step 4: Update Environment Variables ⏱️ 5 min

### Local (.env.local)

- [ ] `STRIPE_SECRET_KEY=sk_live_...`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...`
- [ ] `STRIPE_PRICE_BASIC=price_...`
- [ ] `STRIPE_PRICE_PREMIUM=price_...`
- [ ] `STRIPE_PRICE_DELUXE=price_...`
- [ ] `STRIPE_PRICE_BUNDLE=price_...`
- [ ] `STRIPE_WEBHOOK_SECRET=whsec_...`

### Vercel Production Environment

- [ ] Add all 7 variables above via Vercel Dashboard or CLI
- [ ] Verify variables are set to "Production" environment

---

## Step 5: Deploy to Production ⏱️ 5 min

- [ ] Commit activation guide to git
- [ ] Run `vercel --prod` to deploy
- [ ] Verify deployment succeeded (check Vercel dashboard)
- [ ] Confirm site is accessible

---

## Step 6: End-to-End Test ⏱️ 10 min

### Real Payment Test ($9 charge)

- [ ] Visit: `https://pawcasso-atelier.vercel.app/order`
- [ ] Upload test pet photo
- [ ] Select **Basic tier** ($9)
- [ ] Complete checkout with real card
- [ ] Payment processed successfully

### Verify Fulfillment

- [ ] Webhook received in Stripe Dashboard (green checkmark)
- [ ] Portrait generated via Manus API
- [ ] Email delivered with download links
- [ ] No errors in Vercel logs

### Optional: Test Refund

- [ ] Issue refund from Stripe Dashboard
- [ ] Verify `charge.refunded` webhook received
- [ ] Check database updated with refund status

---

## Step 7: Post-Activation Monitoring

### First 24 Hours

- [ ] Monitor Stripe Dashboard for incoming orders
- [ ] Check Vercel logs for webhook execution
- [ ] Verify email delivery rates
- [ ] Test all 4 pricing tiers

### First Week

- [ ] Track conversion rate (visitors → purchases)
- [ ] Monitor customer support tickets
- [ ] Review portrait generation success rate
- [ ] Analyze which tier is most popular

---

## Success Criteria ✅

**ALL must be checked before marking complete:**

- [ ] Live Stripe keys in production environment
- [ ] 4 price IDs created and configured
- [ ] Webhook endpoint verified
- [ ] **At least 1 successful real order** ($9+ actual payment)
- [ ] Portrait generated and delivered
- [ ] Email sent with download links
- [ ] Zero errors in production logs

---

## 🚨 Blockers / Issues

**Track any problems here:**

1. _None yet - delete this line when issues arise_

---

## 📝 Notes

**Important Details:**

- Test mode is currently active - prices use test keys
- Production URL: `https://pawcasso-atelier.vercel.app`
- Webhook endpoint must match exact URL
- All prices are one-time payments (not subscriptions)
- Stripe fee: 2.9% + $0.30 per transaction

**Key Contacts:**

- Stripe Support: https://support.stripe.com
- Vercel Support: https://vercel.com/support

---

**Last Updated:** March 18, 2026
**Next Review:** After first successful production order
**Assigned To:** Michael Guo
**Estimated Total Time:** 50 minutes
