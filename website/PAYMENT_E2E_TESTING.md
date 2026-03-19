# Payment Flow E2E Testing Guide

## 🎯 Overview

Comprehensive E2E test suite for the Stripe payment flow, covering:
- ✅ Full checkout with real Stripe test cards
- ✅ 3D Secure authentication flows
- ✅ Declined card scenarios
- ✅ Network failures & timeouts
- ✅ Webhook handling & verification

**Revenue Impact**: These tests protect $1M annual revenue by ensuring ZERO payment failures for real customers.

---

## 📋 Test Coverage

### Test Suites

| Suite | File | Tests | Coverage |
|-------|------|-------|----------|
| **Full Checkout** | `payment-full-checkout.spec.ts` | 12 | Visa, Mastercard, Amex, discounts, referrals, database verification |
| **3D Secure** | `payment-3d-secure.spec.ts` | 10 | Required 3DS, failed auth, optional 3DS, mobile experience |
| **Declined Cards** | `payment-declined-cards.spec.ts` | 15 | Insufficient funds, lost/stolen, expired, incorrect CVC, retries |
| **Network Errors** | `payment-network-errors.spec.ts` | 12 | Timeouts, offline mode, slow networks, rate limiting, idempotency |
| **Webhooks** | `payment-webhooks.spec.ts` | 18 | Signature validation, idempotency, edge cases, security |

**Total**: 67 tests covering all payment scenarios

---

## 🚀 Quick Start

### Prerequisites

1. **Stripe Test Account**
   ```bash
   # Get test API keys from: https://dashboard.stripe.com/test/apikeys
   STRIPE_SECRET_KEY=sk_test_your_key_here
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_signing_secret_here
   ```

2. **Database Running**
   ```bash
   cd website
   npx prisma migrate dev
   npx prisma db seed  # Optional: seed test data
   ```

3. **Install Dependencies**
   ```bash
   npm install
   npx playwright install  # Install browsers
   ```

### Run All Tests

```bash
cd website

# Run all payment tests
npm run test:payment

# Or run with Playwright UI
npx playwright test --ui

# Run specific suite
npx playwright test payment-full-checkout

# Run in headed mode (see browser)
npx playwright test --headed

# Run on specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run Individual Suites

```bash
# Full checkout flow
npx playwright test payment-full-checkout.spec.ts

# 3D Secure authentication
npx playwright test payment-3d-secure.spec.ts

# Declined cards
npx playwright test payment-declined-cards.spec.ts

# Network failures
npx playwright test payment-network-errors.spec.ts

# Webhook handling
npx playwright test payment-webhooks.spec.ts
```

---

## 🧪 Stripe Test Cards

### Success Cards

| Card Number | Type | 3DS | Use Case |
|-------------|------|-----|----------|
| `4242424242424242` | Visa | No | Basic successful payment |
| `5555555555554444` | Mastercard | No | Mastercard success |
| `378282246310005` | Amex | No | Amex success (4-digit CVC) |

### 3D Secure Cards

| Card Number | Behavior |
|-------------|----------|
| `4000002500003155` | Requires 3DS, succeeds after auth |
| `4000008400001629` | Requires 3DS, authentication fails |
| `4000002760003184` | Optional 3DS (bank supports but doesn't require) |

### Declined Cards

| Card Number | Error |
|-------------|-------|
| `4000000000000002` | Generic decline |
| `4000000000009995` | Insufficient funds |
| `4000000000009987` | Lost card |
| `4000000000009979` | Stolen card |
| `4000000000000069` | Expired card |
| `4000000000000127` | Incorrect CVC |
| `4000000000000119` | Processing error |
| `4000000000006975` | Rate limit exceeded |

**Full list**: See `e2e/helpers/stripe-test-cards.ts`

---

## 📊 Test Results

### View Results

```bash
# HTML report (auto-opens after test run)
npx playwright show-report

# CI-friendly reports
npx playwright test --reporter=json  # JSON report
npx playwright test --reporter=junit # JUnit XML
npx playwright test --reporter=html  # HTML report
```

### Debugging Failed Tests

```bash
# Run with debug mode
DEBUG=pw:api npx playwright test

# Run with trace
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip

# Run specific test in debug mode
npx playwright test payment-full-checkout.spec.ts --debug
```

---

## 🔧 Configuration

### Environment Variables

Create `.env.test.local` for test-specific config:

```bash
# Stripe Test Mode Keys
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...

# Test Database
DATABASE_URL="file:./prisma/test.db"

# Base URL (local dev server)
PLAYWRIGHT_TEST_BASE_URL=http://localhost:3000

# Email Service (use test mode or mock)
RESEND_API_KEY=re_test_...

# Optional: Disable emails in tests
DISABLE_EMAILS=true

# Optional: Enable debug logging
DEBUG=true
```

### Playwright Config

Located at `website/playwright.config.ts`:

```typescript
{
  testDir: './e2e',
  timeout: 60000,  // 60 seconds per test
  retries: 2,      // Retry failed tests 2 times in CI
  workers: 4,      // Run 4 tests in parallel
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  }
}
```

---

## 🎭 CI/CD Integration

### GitHub Actions

Create `.github/workflows/e2e-payment-tests.yml`:

```yaml
name: Payment E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd website
          npm ci
          npx playwright install --with-deps

      - name: Run database migrations
        run: |
          cd website
          npx prisma migrate dev

      - name: Run payment E2E tests
        env:
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY_TEST }}
          STRIPE_WEBHOOK_SECRET: ${{ secrets.STRIPE_WEBHOOK_SECRET_TEST }}
        run: |
          cd website
          npx playwright test payment-*.spec.ts

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: website/test-results/
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Tests timeout

**Solution**: Increase timeout in test file or config
```typescript
test.setTimeout(90000); // 90 seconds
```

#### 2. Stripe API rate limits

**Solution**: Add delays between tests
```typescript
test.afterEach(async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
});
```

#### 3. Webhook signature validation fails

**Solution**: Check `STRIPE_WEBHOOK_SECRET` environment variable
```bash
# Get webhook secret from Stripe Dashboard > Webhooks
echo $STRIPE_WEBHOOK_SECRET
```

#### 4. Database locked errors (SQLite)

**Solution**: Use separate test database
```bash
# In .env.test.local
DATABASE_URL="file:./prisma/test.db"

# Reset test database
rm -f website/prisma/test.db
npx prisma migrate dev
```

#### 5. Flaky tests (intermittent failures)

**Solution**: Add proper waits and retries
```typescript
await page.waitForLoadState('networkidle');
await page.waitForTimeout(2000);
```

---

## 📈 Performance Benchmarks

Expected test execution times:

| Suite | Tests | Duration |
|-------|-------|----------|
| Full Checkout | 12 | ~3-5 min |
| 3D Secure | 10 | ~5-7 min |
| Declined Cards | 15 | ~4-6 min |
| Network Errors | 12 | ~6-8 min |
| Webhooks | 18 | ~3-5 min |
| **Total** | **67** | **~25-35 min** |

**CI Optimizations**:
- Parallel workers: 4x faster
- Retry on failure: Handles flaky tests
- Screenshot on failure: Easy debugging

---

## 🔒 Security Best Practices

### Test Data Cleanup

```typescript
// Always use test email domain
const email = `test-${Date.now()}@pawcasso.test`;

// Clean up after tests
test.afterEach(async ({ request }) => {
  await cleanupTestData(request, email);
});
```

### Never Use Production Keys

```bash
# ❌ NEVER do this
STRIPE_SECRET_KEY=sk_live_...  # DANGER!

# ✅ Always use test mode
STRIPE_SECRET_KEY=sk_test_...  # Safe
```

### Webhook Security

All webhook tests verify:
- ✅ Signature validation
- ✅ Timestamp verification
- ✅ Replay attack prevention
- ✅ Idempotency

---

## 📝 Writing New Tests

### Test Template

```typescript
import { test, expect } from '@playwright/test';
import { STRIPE_TEST_CARDS, getCardForFilling } from './helpers/stripe-test-cards';

test.describe('My Payment Test Suite', () => {
  test.setTimeout(60000);

  test('should handle my scenario', async ({ page, request }) => {
    const testEmail = `my-test-${Date.now()}@pawcasso.test`;

    // 1. Fill order form
    await page.goto('/order');
    await page.fill('input[name="email"]', testEmail);
    // ... fill other fields

    // 2. Submit checkout
    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForURL(/checkout\.stripe\.com/);

    // 3. Fill payment details
    const card = getCardForFilling('SUCCESS');
    // ... fill Stripe form

    // 4. Submit payment
    await page.click('button[type="submit"]');

    // 5. Verify success
    await page.waitForURL(/\/order\/success/);
    await expect(page.locator('h1')).toContainText('Order Confirmed');

    // 6. Verify database
    await waitForWebhookProcessing();
    const orderCreated = await verifyOrderCreated(request, testEmail);
    expect(orderCreated).toBe(true);
  });
});
```

---

## 🎯 Next Steps

1. **Run Tests Locally**
   ```bash
   cd website
   npx playwright test payment-full-checkout.spec.ts --headed
   ```

2. **Fix Any Failures**
   - Check error screenshots in `test-results/`
   - Review trace files
   - Update selectors if UI changed

3. **Add to CI/CD**
   - Push tests to GitHub
   - Enable GitHub Actions
   - Monitor test results

4. **Monitor in Production**
   - Set up Stripe webhooks
   - Enable error monitoring (Sentry)
   - Track payment success rate

---

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe Test Cards](https://stripe.com/docs/testing#cards)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [3D Secure Testing](https://stripe.com/docs/testing#regulatory-cards)

---

## 🆘 Support

**Issues?** Open a ticket with:
- Test name that failed
- Error message
- Screenshot from `test-results/`
- Environment (OS, Node version, etc.)

**Questions?** Check:
- Test comments (inline documentation)
- Helper functions in `e2e/helpers/`
- Playwright docs

---

## ✅ Checklist: Before Production

- [ ] All payment tests passing locally
- [ ] Tests passing in CI/CD
- [ ] Stripe test keys configured
- [ ] Webhook endpoint configured
- [ ] Database migrations applied
- [ ] Error monitoring enabled (Sentry)
- [ ] Test coverage > 80%
- [ ] Performance benchmarks met
- [ ] Security best practices followed
- [ ] Documentation reviewed

**Revenue Protection**: These tests ensure every customer can complete their purchase. ZERO tolerance for payment failures.
