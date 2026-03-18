# Stripe Production Activation - Quick Reference Card

**Print this page and keep it open during activation.**

---

## 🔑 Step 1: Get API Keys (5 min)

1. Go to: https://dashboard.stripe.com/apikeys
2. **Switch to LIVE MODE** (toggle top-right)
3. Copy both keys:

```
SECRET KEY (starts with sk_live_)
→ Save as: STRIPE_SECRET_KEY

PUBLISHABLE KEY (starts with pk_live_)
→ Save as: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

---

## 🛍️ Step 2: Create Products (15 min)

Go to: https://dashboard.stripe.com/products

**Create 4 products (one-time payments):**

| Product Name | Price | Save Price ID As |
|--------------|-------|------------------|
| Pawcasso Digital - Basic | $9.00 | `STRIPE_PRICE_BASIC` |
| Pawcasso Digital - Premium | $29.00 | `STRIPE_PRICE_PREMIUM` |
| Pawcasso Digital - Deluxe | $49.00 | `STRIPE_PRICE_DELUXE` |
| Pawcasso Digital - Bundle | $79.00 | `STRIPE_PRICE_BUNDLE` |

_Price IDs start with `price_`_

---

## 🪝 Step 3: Create Webhook (10 min)

1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. **Endpoint URL:**
   ```
   https://pawcasso-atelier.vercel.app/api/webhooks/stripe
   ```
4. **Select events:**
   - ✅ `checkout.session.completed`
   - ✅ `charge.refunded`
5. Save and copy **Signing Secret** (starts with `whsec_`)
   ```
   → Save as: STRIPE_WEBHOOK_SECRET
   ```

---

## 💻 Step 4: Update Vercel (5 min)

Go to: https://vercel.com/dashboard → pawcasso-atelier → Settings → Environment Variables

**Add these 7 variables (Production environment):**

| Variable | Value Starts With | Required |
|----------|-------------------|----------|
| `STRIPE_SECRET_KEY` | `sk_live_` | ✅ |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_` | ✅ |
| `STRIPE_PRICE_BASIC` | `price_` | ✅ |
| `STRIPE_PRICE_PREMIUM` | `price_` | ✅ |
| `STRIPE_PRICE_DELUXE` | `price_` | ✅ |
| `STRIPE_PRICE_BUNDLE` | `price_` | ✅ |
| `STRIPE_WEBHOOK_SECRET` | `whsec_` | ✅ |

---

## 🚀 Step 5: Deploy (5 min)

```bash
cd /Users/michaelguo/pawcasso-atelier/website
vercel --prod
```

Wait for deployment to complete ✅

---

## ✅ Step 6: Test Real Payment (10 min)

1. **Visit:** https://pawcasso-atelier.vercel.app/order
2. **Upload pet photo** (any image)
3. **Select Basic tier** ($9.00)
4. **Complete checkout** with real card
5. **Check:**
   - [ ] Payment succeeded in Stripe Dashboard
   - [ ] Webhook event received (green ✓)
   - [ ] Email delivered with portrait
   - [ ] No errors in Vercel logs

---

## 🎯 Success Checklist

- [ ] Live API keys in Vercel
- [ ] 4 price IDs created
- [ ] Webhook verified
- [ ] **1 successful $9 test order**
- [ ] Portrait delivered via email

**When all checked → PRODUCTION READY! 🚀**

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Price ID not configured" | Check Vercel env vars, redeploy |
| Webhook signature failed | Verify `STRIPE_WEBHOOK_SECRET` matches |
| No email received | Check Vercel logs, verify `RESEND_API_KEY` |
| Payment succeeded but no portrait | Check Manus API key, webhook logs |

---

## 📞 Support

- **Stripe Dashboard:** https://dashboard.stripe.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Full Guide:** See `STRIPE_PRODUCTION_ACTIVATION.md`

---

**Expected Total Time:** 50 minutes
**Cost to Test:** $9.00 + Stripe fees (~$0.56) = ~$9.56

_Last Updated: March 18, 2026_
