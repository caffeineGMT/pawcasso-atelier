# Abandoned Cart Webhook Setup

## Overview
This webhook handles Stripe `checkout.session.expired` events to send abandoned cart recovery emails with 10% discount codes.

## Stripe Dashboard Configuration

1. **Navigate to Webhooks**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
   - Click "Add endpoint"

2. **Configure Endpoint**
   - **Endpoint URL**: `https://pawcasso-atelier.vercel.app/api/webhooks/cart-abandoned`
   - **Events to send**: Select `checkout.session.expired`
   - Click "Add endpoint"

3. **Get Webhook Signing Secret**
   - After creating the endpoint, click on it
   - Click "Reveal" under "Signing secret"
   - Copy the value (starts with `whsec_`)
   - Add to `.env.local` as `STRIPE_WEBHOOK_SECRET_ABANDONED`

## Environment Variables Required

Add these to your `.env.local` file:

```bash
# Stripe Webhook Secret (from Stripe Dashboard)
STRIPE_WEBHOOK_SECRET_ABANDONED=whsec_...

# Resend API Key (from resend.com)
RESEND_API_KEY=re_...

# Email sender address (must be verified in Resend)
EMAIL_FROM=hello@pawcasso-atelier.com

# Base URL (production URL)
NEXT_PUBLIC_BASE_URL=https://pawcasso-atelier.vercel.app
```

## Email Domain Setup (Resend)

1. **Sign up at [Resend](https://resend.com)**
2. **Add your domain**
   - Go to Domains → Add Domain
   - Enter `pawcasso-atelier.com`
   - Add the DNS records provided by Resend
3. **Verify sender email**
   - Use `hello@pawcasso-atelier.com` as the sender
   - Ensure it matches `EMAIL_FROM` env var

## Testing the Webhook

### Local Testing with Stripe CLI

1. **Install Stripe CLI**
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. **Login to Stripe**
   ```bash
   stripe login
   ```

3. **Forward webhook events to localhost**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/cart-abandoned
   ```

4. **Trigger a test event**
   ```bash
   stripe trigger checkout.session.expired
   ```

### Testing with Reduced Expiration Time

For faster testing, modify the `expires_at` in `lib/stripe.ts` temporarily:

```typescript
// Change from 24 hours to 5 minutes for testing
expires_at: Math.floor(Date.now() / 1000) + (5 * 60),
```

Then:
1. Create a checkout session
2. Don't complete payment
3. Wait 5 minutes
4. Webhook should fire automatically

**Remember to change it back to 24 hours for production!**

## How It Works

1. **Customer starts checkout** → Stripe session created with 24-hour expiration
2. **Customer abandons cart** → Session expires after 24 hours
3. **Stripe fires webhook** → `checkout.session.expired` event sent to our endpoint
4. **We generate discount code** → 10% off coupon via Stripe Coupons API
5. **Email sent** → Recovery email with discount code via Resend
6. **Customer clicks link** → Returns to order page with code auto-applied
7. **Code expires** → 48 hours after generation

## Coupon Details

- **Format**: `CART10-{sessionId.slice(0,8)}`
- **Discount**: 10% off
- **Duration**: One-time use
- **Max redemptions**: 1
- **Expiration**: 48 hours from creation

## Troubleshooting

### Webhook not firing
- Check Stripe Dashboard → Webhooks → Event logs
- Ensure endpoint is enabled
- Verify webhook secret matches env var

### Email not sending
- Check Resend dashboard for delivery logs
- Verify sender email is verified in Resend
- Check `RESEND_API_KEY` is correct

### Discount code not applying
- Verify coupon was created in Stripe Dashboard
- Check URL format: `/order?tier=basic&code=CART10-XXXXXXXX`
- Ensure coupon hasn't expired or been used

### Webhook signature verification fails
- Ensure you're using the signing secret from the correct webhook endpoint
- Check that `STRIPE_WEBHOOK_SECRET_ABANDONED` is set correctly
- Verify you're not accidentally using the wrong secret key

## Production Deployment

1. **Deploy to Vercel**
2. **Update webhook URL in Stripe Dashboard** to production URL
3. **Set all env vars in Vercel project settings**
4. **Test with a real checkout session**

## Monitoring

Check these regularly:
- Stripe Dashboard → Webhooks → Event logs
- Resend Dashboard → Logs
- Vercel → Function logs for API route
