# Payment Failure Runbook

> **Purpose**: Step-by-step guide for diagnosing and resolving payment issues in production

---

## 🚨 When to Use This Runbook

- Customer reports payment failure
- Stripe webhook failure alerts
- Abandoned checkout spike
- Support ticket mentions "payment", "checkout", "card declined"
- Monitoring shows payment success rate drop

---

## 📊 Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| **P0** | Complete payment outage, no checkouts working | < 15 minutes |
| **P1** | High failure rate (>10%), multiple customers affected | < 1 hour |
| **P2** | Intermittent failures, small percentage of customers | < 4 hours |
| **P3** | Individual customer issue, workaround available | < 24 hours |

---

## 🔍 Step 1: Identify the Issue

### Quick Health Check

```bash
# 1. Check Stripe Dashboard
# https://dashboard.stripe.com/payments?status=failed

# 2. Check Vercel logs for errors
vercel logs --project pawcasso-atelier --since 1h

# 3. Check webhook delivery
# https://dashboard.stripe.com/webhooks

# 4. Check database for recent orders
# (via admin dashboard or direct query)
```

### Key Questions

1. **Scope**: Is this affecting all customers or just one?
2. **Timing**: When did it start? (Correlate with deployments)
3. **Pattern**: Are failures consistent or intermittent?
4. **Error**: What's the error message?

---

## 🛠️ Step 2: Common Failure Scenarios

### Scenario 1: Customer's Card Declined

**Symptoms**:
- Error message: "Your card was declined"
- Customer sees declined message in checkout
- No order created in database

**Diagnosis**:
```bash
# Check Stripe Dashboard for decline reason
# https://dashboard.stripe.com/payments?status=failed
# Look at "Failure code" and "Failure message"
```

**Common Decline Reasons**:
- `insufficient_funds` - Not enough money
- `card_declined` - Bank declined (generic)
- `expired_card` - Card expired
- `incorrect_cvc` - Wrong security code
- `lost_card` - Card reported lost
- `fraudulent` - Stripe/bank fraud detection

**Resolution**:
1. Contact customer via email (use template below)
2. Suggest trying a different payment method
3. Verify billing address matches card
4. Check if card supports online/international transactions

**Email Template**:
```
Subject: Issue with Your Pawcasso Order Payment

Hi [Customer Name],

We noticed your recent payment for your pet portrait order was declined by your card issuer.

The decline reason was: [REASON]

To complete your order, you can:
1. Verify your billing information is correct
2. Try a different payment method
3. Contact your bank to authorize the transaction

Once resolved, you can complete checkout here:
[Checkout Link]

If you have questions, just reply to this email!

Best,
Pawcasso Team
```

---

### Scenario 2: Webhook Not Received

**Symptoms**:
- Payment succeeded in Stripe
- No order created in database
- No confirmation email sent
- Customer sees success page but no order in portal

**Diagnosis**:
```bash
# 1. Check Stripe webhook logs
# https://dashboard.stripe.com/webhooks/[WEBHOOK_ID]

# 2. Check webhook endpoint health
curl -X POST https://pawcasso-atelier.vercel.app/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d '{"type":"ping"}'

# 3. Check Vercel function logs
vercel logs --filter /api/webhooks/stripe
```

**Common Causes**:
- Webhook endpoint timeout (> 10s response)
- Signature validation failure
- Database connection error
- Duplicate event handling bug

**Resolution**:

1. **Manual Order Creation** (Immediate):
```bash
# In admin panel or via API:
# 1. Get payment_intent from Stripe
# 2. Manually create order in database
# 3. Trigger confirmation email
```

2. **Replay Webhook** (Preferred):
```bash
# In Stripe Dashboard:
# 1. Go to webhook event
# 2. Click "Resend event"
# 3. Monitor logs for success
```

3. **Fix Root Cause**:
- Optimize webhook handler (target < 1s response)
- Add retry logic
- Improve error logging
- Set up monitoring alerts

---

### Scenario 3: Stripe.js Not Loading

**Symptoms**:
- Checkout page blank or broken
- Console error: "Stripe is not defined"
- Payment form doesn't render

**Diagnosis**:
```javascript
// Check browser console for errors
// Look for:
// - Stripe.js script failed to load
// - CSP (Content Security Policy) violations
// - Ad blocker interference
```

**Resolution**:

1. **Verify Stripe.js script tag**:
```html
<!-- Should be in layout or order page -->
<script src="https://js.stripe.com/v3/"></script>
```

2. **Check CSP headers** (in `next.config.js`):
```javascript
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com;"
  }
];
```

3. **Test in incognito** (rule out ad blockers)

4. **Provide fallback**:
- Show "Loading payment form..." message
- Error boundary with retry button
- Link to alternative payment methods

---

### Scenario 4: Database Lock / Timeout

**Symptoms**:
- Webhook returns 500 error
- "Database is locked" errors
- Slow webhook processing (> 5s)

**Diagnosis**:
```bash
# Check database connections
# For SQLite: can't handle concurrent writes

# For Postgres: check connection pool
SELECT * FROM pg_stat_activity WHERE state = 'active';
```

**Immediate Fix**:
```bash
# If using SQLite (current setup)
# Migration to Postgres is required for production scale

# Temporary: Implement write queue
# All writes go through single queue to avoid locks
```

**Long-term Fix**:
```bash
# Migrate to Postgres (production requirement)
# See: STRIPE_PRODUCTION_ACTIVATION.md

# Update DATABASE_URL in Vercel:
vercel env add DATABASE_URL production
# postgres://user:pass@host:5432/pawcasso
```

---

### Scenario 5: Double Charging

**Symptoms**:
- Customer charged twice
- Two orders created for same checkout
- Duplicate webhook processing

**Diagnosis**:
```bash
# Check Stripe Dashboard:
# Look for duplicate payment_intents with same metadata

# Check database:
# SELECT * FROM orders WHERE email = '[customer_email]'
# Look for duplicate timestamps
```

**Resolution**:

1. **Immediate - Refund Duplicate**:
```bash
# In Stripe Dashboard:
# 1. Find duplicate charge
# 2. Issue full refund
# 3. Note: "Duplicate charge - customer error"
```

2. **Fix Root Cause**:
- Implement idempotency keys
- Add unique constraint on `session_id` in database
- Prevent double form submission

```typescript
// Example fix in webhook handler:
const existingOrder = await prisma.order.findUnique({
  where: { sessionId: session.id }
});

if (existingOrder) {
  return res.status(200).json({ received: true, duplicate: true });
}
```

3. **Contact Customer**:
```
Subject: Refund Processed for Duplicate Charge

Hi [Name],

We noticed you were accidentally charged twice for your order. We've issued a full refund for the duplicate charge. It should appear in your account within 5-10 business days.

Your order is still being processed normally. You'll receive your pet portrait as scheduled.

Sorry for the confusion!

Best,
Pawcasso Team
```

---

### Scenario 6: 3D Secure Authentication Failure

**Symptoms**:
- Payment requires authentication
- Customer completes 3DS but payment still fails
- "Authentication failed" error

**Diagnosis**:
```bash
# Check Stripe payment intent:
# Look for "requires_payment_method" status
# Check last_payment_error for details
```

**Common Causes**:
- Customer closed authentication modal
- Bank declined after authentication
- Timeout during authentication
- Browser compatibility issues

**Resolution**:

1. **Customer Instructions**:
```
To complete your payment:
1. Ensure pop-ups are enabled in your browser
2. Complete the verification with your bank
3. Don't close the verification window
4. Try a different browser if issues persist
5. Use a different payment method if needed
```

2. **Technical Fix**:
- Improve 3DS UX with clear instructions
- Add loading state during authentication
- Handle authentication cancellation gracefully
- Provide retry button

---

### Scenario 7: High Checkout Abandonment

**Symptoms**:
- Users start checkout but don't complete
- Stripe session created but no payment
- Cart recovery emails not converting

**Diagnosis**:
```bash
# Check analytics:
# Funnel: Order Page → Checkout → Payment → Success

# Common drop-off points:
# - Price surprise (shipping, tax)
# - Required account creation
# - Payment form errors
# - Slow loading
```

**Resolution**:

1. **Analyze abandonment reasons**:
```bash
# Check cart recovery data
# Look for patterns in:
# - Time of abandonment (form field)
# - Device type (mobile vs desktop)
# - Tier selected
# - UTM source
```

2. **Quick Fixes**:
- Add trust badges (secure checkout)
- Show progress indicator (Step 2 of 3)
- Reduce form fields
- Add "Why we need this" tooltips
- Improve mobile UX
- Add exit-intent discount offer

3. **Track improvements**:
```javascript
// Analytics events to add:
gtag('event', 'checkout_abandon', {
  step: 'payment_details',
  tier: 'standard',
  device: 'mobile'
});
```

---

## 📈 Monitoring & Alerts

### Key Metrics to Track

```bash
# 1. Payment Success Rate (Target: > 95%)
# (Successful payments / Total attempts) * 100

# 2. Webhook Delivery Rate (Target: > 99.9%)
# (Successful webhooks / Total webhooks sent) * 100

# 3. Average Checkout Time (Target: < 10 seconds)
# Time from "Proceed to Checkout" to payment success

# 4. Cart Abandonment Rate (Target: < 70%)
# (Abandoned carts / Total checkout starts) * 100

# 5. Support Ticket Rate (Target: < 2%)
# (Payment-related tickets / Total orders) * 100
```

### Set Up Alerts

**Stripe Dashboard**:
- Go to Settings → Notifications
- Enable:
  - Failed payments (>10 in 1 hour)
  - Webhook failures (>5%)
  - Dispute notifications (immediate)

**Vercel**:
```bash
# Add monitoring in Vercel dashboard:
# - Function error rate > 1%
# - Function duration > 10s
# - 5xx errors
```

**Custom Monitoring**:
```typescript
// In webhook handler:
if (failureRate > 0.05) {
  await sendAlert({
    channel: 'slack',
    message: 'Payment webhook failure rate above 5%',
    severity: 'P1'
  });
}
```

---

## 🧪 Testing After Fix

```bash
# 1. Run payment E2E tests
cd website
npm run test:e2e payment

# 2. Test in Stripe test mode
# Use test cards: https://stripe.com/docs/testing#cards

# 3. Test webhook delivery
# Use Stripe CLI: stripe listen --forward-to localhost:3000/api/webhooks/stripe

# 4. Load test (optional)
# Use k6 or Artillery to simulate high volume

# 5. Monitor in production
# Watch Stripe Dashboard for 24 hours after fix
```

---

## 📞 Escalation Path

| Issue | Contact | When |
|-------|---------|------|
| Stripe API outage | Stripe Support | Immediately |
| Vercel outage | Vercel Support | Immediately |
| Database issues | DevOps | Within 1 hour |
| Customer refund | Customer Support | Within 24 hours |

---

## 📚 Additional Resources

- [Stripe Dashboard](https://dashboard.stripe.com)
- [Stripe API Status](https://status.stripe.com)
- [Vercel Status](https://vercel-status.com)
- [Payment Testing Guide](./PAYMENT_TESTING_GUIDE.md)
- [Stripe Error Codes](https://stripe.com/docs/error-codes)
- [Stripe Decline Codes](https://stripe.com/docs/declines/codes)

---

**Last Updated**: March 18, 2026
**Owner**: Payment Team (3 Engineers)
**On-Call**: Check PagerDuty rotation
