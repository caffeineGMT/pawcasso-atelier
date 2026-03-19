# Payment Flow Testing - Quick Reference Card

> **Print this or keep it open during payment testing**

---

## 🚀 Quick Start

```bash
cd website

# Run all payment tests
npm run test:e2e payment

# Run specific suite
npm run test:e2e payment-stripe-integration.spec.ts

# Debug mode
npm run test:e2e:debug payment-webhooks.spec.ts

# UI mode (recommended)
npm run test:e2e:ui
```

---

## 🧪 Stripe Test Cards

| Card | Behavior |
|------|----------|
| `4242 4242 4242 4242` | ✅ Success |
| `4000 0000 0000 9995` | ❌ Declined |
| `4000 0000 0000 9987` | ❌ Insufficient funds |
| `4000 0000 0000 9979` | ❌ Expired |
| `4000 0025 0000 3155` | 🔐 3D Secure |

**Exp**: Any future date (e.g., `12/34`)
**CVC**: Any 3 digits (e.g., `123`)
**ZIP**: Any 5 digits (e.g., `12345`)

---

## 📊 Test Suites

| Suite | Tests | Focus |
|-------|-------|-------|
| `payment-stripe-integration.spec.ts` | 15+ | Full payment flow |
| `payment-webhooks.spec.ts` | 20+ | Webhook reliability |
| `payment-edge-cases.spec.ts` | 25+ | Error scenarios |

---

## ✅ Success Criteria

- [ ] All tests pass in CI
- [ ] Webhook success rate > 99%
- [ ] Checkout time < 10 seconds
- [ ] Zero false positives
- [ ] Load test: 100 concurrent checkouts

---

## 🔧 Environment Setup

```bash
# Copy template
cp .env.test.template .env.test

# Required vars:
STRIPE_SECRET_KEY_TEST=sk_test_...
STRIPE_PUBLISHABLE_KEY_TEST=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 🐛 Common Issues

| Issue | Fix |
|-------|-----|
| Stripe not loading | Check `.env.test` keys |
| Webhook fails | Verify `STRIPE_WEBHOOK_SECRET` |
| DB locked | Stop other processes, remove `test.db` |
| Timeout | Increase timeout in `playwright.config.ts` |

---

## 📈 Key Metrics

| Metric | Target |
|--------|--------|
| Payment Success Rate | > 95% |
| Webhook Delivery | > 99.9% |
| Checkout Time | < 10s |
| Support Tickets | < 2% |

---

## 🚨 Failure Response

**P0** (Complete outage) → < 15 min
**P1** (High failure rate) → < 1 hour
**P2** (Intermittent) → < 4 hours
**P3** (Individual) → < 24 hours

---

## 📞 Resources

- [Stripe Dashboard](https://dashboard.stripe.com)
- [Testing Guide](./PAYMENT_TESTING_GUIDE.md)
- [Runbook](./PAYMENT_FAILURE_RUNBOOK.md)
- [Stripe Test Cards](https://stripe.com/docs/testing#cards)

---

**Team**: 3 Engineers (Payment Team)
**Status**: IN_PROGRESS
**Target**: March 22, 2026
