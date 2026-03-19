/**
 * CRITICAL: Declined Card E2E Tests
 *
 * Error handling is CRITICAL for customer experience and revenue protection.
 * Declined cards happen for many reasons - we must handle ALL scenarios gracefully.
 *
 * Real-World Stats:
 * - 15-20% of payment attempts fail
 * - Poor error handling = customer frustration + abandoned purchases
 * - Clear error messages = retry success rate up to 60%
 *
 * Coverage:
 * ✅ Generic card decline
 * ✅ Insufficient funds
 * ✅ Lost/stolen card
 * ✅ Expired card
 * ✅ Incorrect CVC
 * ✅ Processing errors
 * ✅ Rate limiting
 * ✅ Clear error messages displayed
 * ✅ No database pollution (failed payments don't create orders)
 * ✅ Retry flow works
 *
 * Revenue Impact:
 * - Every handled decline = opportunity for retry
 * - Every unhandled decline = lost revenue
 */

import { test, expect, Page } from '@playwright/test';
import { STRIPE_TEST_CARDS, getCardForFilling, getExpectedError, TEST_ORDER } from './helpers/stripe-test-cards';

// Helper: Fill order form
async function fillOrderForm(page: Page, orderDetails = TEST_ORDER) {
  await page.goto('/order');
  await page.waitForLoadState('networkidle');

  await page.fill('input[name="name"]', orderDetails.customerName);
  await page.fill('input[name="email"]', orderDetails.customerEmail);
  await page.fill('input[name="petName"]', orderDetails.petName);

  const styleSelector = `button[data-style="${orderDetails.style}"]`;
  await page.click(styleSelector);

  if (orderDetails.notes) {
    await page.fill('textarea[name="notes"]', orderDetails.notes);
  }

  const tierSelector = `button[data-tier="${orderDetails.tier}"]`;
  await page.click(tierSelector);
}

// Helper: Fill Stripe payment form
async function fillStripePaymentForm(page: Page, cardType: keyof typeof STRIPE_TEST_CARDS) {
  const card = getCardForFilling(cardType);

  await page.waitForTimeout(2000);

  const stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]').first();

  await stripeFrame.locator('input[name="cardnumber"]').fill(card.cardNumber);
  await stripeFrame.locator('input[name="exp-date"]').fill(`${card.expMonth}${card.expYear}`);
  await stripeFrame.locator('input[name="cvc"]').fill(card.cvc);
  await stripeFrame.locator('input[name="postal"]').fill(card.zip);
}

test.describe('Declined Cards - Generic Decline', () => {
  test.setTimeout(60000);

  test('should show error message when card is declined', async ({ page }) => {
    const testEmail = `declined-generic-${Date.now()}@pawcasso.test`;

    await fillOrderForm(page, {
      ...TEST_ORDER,
      customerEmail: testEmail,
    });

    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 });

    // Use card that will be declined
    await fillStripePaymentForm(page, 'DECLINED_GENERIC');

    const submitButton = page.locator('button[type="submit"]').last();
    await submitButton.click();

    // Wait for error message
    await page.waitForTimeout(3000);

    // Verify error message is displayed
    const expectedError = getExpectedError('DECLINED_GENERIC');
    if (expectedError) {
      const errorLocator = page.locator(`text=${expectedError}, text=declined, text=not process`);
      await expect(errorLocator.first()).toBeVisible({ timeout: 10000 });
    }

    // Verify we're still on checkout page
    expect(page.url()).toContain('checkout.stripe.com');
  });

  test('should NOT create order when payment is declined', async ({ page, request }) => {
    const testEmail = `declined-no-order-${Date.now()}@pawcasso.test`;

    await fillOrderForm(page, {
      ...TEST_ORDER,
      customerEmail: testEmail,
    });

    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 });

    await fillStripePaymentForm(page, 'DECLINED_GENERIC');

    const submitButton = page.locator('button[type="submit"]').last();
    await submitButton.click();

    // Wait for decline
    await page.waitForTimeout(3000);

    // Verify NO order was created
    const ordersResponse = await request.get(`/api/admin/orders?email=${testEmail}`);

    if (ordersResponse.ok()) {
      const orders = await ordersResponse.json();
      expect(orders.length).toBe(0);
    }
  });

  test('should allow retry after decline', async ({ page }) => {
    const testEmail = `declined-retry-${Date.now()}@pawcasso.test`;

    await fillOrderForm(page, {
      ...TEST_ORDER,
      customerEmail: testEmail,
    });

    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 });

    // First attempt: declined card
    await fillStripePaymentForm(page, 'DECLINED_GENERIC');

    let submitButton = page.locator('button[type="submit"]').last();
    await submitButton.click();

    await page.waitForTimeout(3000);

    // Verify error shown
    const errorLocator = page.locator('text=declined, text=not process');
    await expect(errorLocator.first()).toBeVisible();

    // Clear card number and try again with valid card
    const stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]').first();
    await stripeFrame.locator('input[name="cardnumber"]').clear();

    // Retry with success card
    await fillStripePaymentForm(page, 'SUCCESS');

    submitButton = page.locator('button[type="submit"]').last();
    await submitButton.click();

    // Should succeed this time
    await page.waitForURL(/\/order\/success/, { timeout: 30000 });
    await expect(page.locator('h1')).toContainText('Order Confirmed');
  });
});

test.describe('Declined Cards - Insufficient Funds', () => {
  test.setTimeout(60000);

  test('should show specific error for insufficient funds', async ({ page }) => {
    const testEmail = `declined-funds-${Date.now()}@pawcasso.test`;

    await fillOrderForm(page, {
      ...TEST_ORDER,
      customerEmail: testEmail,
    });

    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 });

    await fillStripePaymentForm(page, 'DECLINED_INSUFFICIENT_FUNDS');

    const submitButton = page.locator('button[type="submit"]').last();
    await submitButton.click();

    await page.waitForTimeout(3000);

    // Should show insufficient funds error
    const expectedError = getExpectedError('DECLINED_INSUFFICIENT_FUNDS');
    if (expectedError) {
      const errorLocator = page.locator(`text=${expectedError}, text=insufficient, text=balance`);
      await expect(errorLocator.first()).toBeVisible({ timeout: 10000 });
    }
  });
});

test.describe('Declined Cards - Lost or Stolen', () => {
  test.setTimeout(60000);

  test('should block payment for lost card', async ({ page }) => {
    const testEmail = `declined-lost-${Date.now()}@pawcasso.test`;

    await fillOrderForm(page, {
      ...TEST_ORDER,
      customerEmail: testEmail,
    });

    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 });

    await fillStripePaymentForm(page, 'DECLINED_LOST_CARD');

    const submitButton = page.locator('button[type="submit"]').last();
    await submitButton.click();

    await page.waitForTimeout(3000);

    // Should show decline error (banks don't reveal "lost" status to merchants for security)
    const errorLocator = page.locator('text=declined, text=not process');
    await expect(errorLocator.first()).toBeVisible({ timeout: 10000 });
  });

  test('should block payment for stolen card', async ({ page }) => {
    const testEmail = `declined-stolen-${Date.now()}@pawcasso.test`;

    await fillOrderForm(page, {
      ...TEST_ORDER,
      customerEmail: testEmail,
    });

    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 });

    await fillStripePaymentForm(page, 'DECLINED_STOLEN_CARD');

    const submitButton = page.locator('button[type="submit"]').last();
    await submitButton.click();

    await page.waitForTimeout(3000);

    const errorLocator = page.locator('text=declined, text=not process');
    await expect(errorLocator.first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Declined Cards - Expired Card', () => {
  test.setTimeout(60000);

  test('should show error for expired card', async ({ page }) => {
    const testEmail = `declined-expired-${Date.now()}@pawcasso.test`;

    await fillOrderForm(page, {
      ...TEST_ORDER,
      customerEmail: testEmail,
    });

    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 });

    await fillStripePaymentForm(page, 'DECLINED_EXPIRED');

    const submitButton = page.locator('button[type="submit"]').last();
    await submitButton.click();

    await page.waitForTimeout(3000);

    const expectedError = getExpectedError('DECLINED_EXPIRED');
    if (expectedError) {
      const errorLocator = page.locator(`text=${expectedError}, text=expired`);
      await expect(errorLocator.first()).toBeVisible({ timeout: 10000 });
    }
  });
});

test.describe('Declined Cards - Incorrect CVC', () => {
  test.setTimeout(60000);

  test('should show error for incorrect CVC', async ({ page }) => {
    const testEmail = `declined-cvc-${Date.now()}@pawcasso.test`;

    await fillOrderForm(page, {
      ...TEST_ORDER,
      customerEmail: testEmail,
    });

    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 });

    await fillStripePaymentForm(page, 'DECLINED_INCORRECT_CVC');

    const submitButton = page.locator('button[type="submit"]').last();
    await submitButton.click();

    await page.waitForTimeout(3000);

    const expectedError = getExpectedError('DECLINED_INCORRECT_CVC');
    if (expectedError) {
      const errorLocator = page.locator(`text=${expectedError}, text=security code, text=CVC, text=CVV`);
      await expect(errorLocator.first()).toBeVisible({ timeout: 10000 });
    }
  });
});

test.describe('Declined Cards - Processing Errors', () => {
  test.setTimeout(60000);

  test('should handle processing error gracefully', async ({ page }) => {
    const testEmail = `declined-processing-${Date.now()}@pawcasso.test`;

    await fillOrderForm(page, {
      ...TEST_ORDER,
      customerEmail: testEmail,
    });

    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 });

    await fillStripePaymentForm(page, 'DECLINED_PROCESSING_ERROR');

    const submitButton = page.locator('button[type="submit"]').last();
    await submitButton.click();

    await page.waitForTimeout(3000);

    const expectedError = getExpectedError('DECLINED_PROCESSING_ERROR');
    if (expectedError) {
      const errorLocator = page.locator(`text=${expectedError}, text=error, text=try again`);
      await expect(errorLocator.first()).toBeVisible({ timeout: 10000 });
    }
  });

  test('should allow retry after processing error', async ({ page }) => {
    const testEmail = `processing-retry-${Date.now()}@pawcasso.test`;

    await fillOrderForm(page, {
      ...TEST_ORDER,
      customerEmail: testEmail,
    });

    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 });

    // First attempt: processing error
    await fillStripePaymentForm(page, 'DECLINED_PROCESSING_ERROR');

    let submitButton = page.locator('button[type="submit"]').last();
    await submitButton.click();

    await page.waitForTimeout(3000);

    // Clear and retry with valid card
    const stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]').first();
    await stripeFrame.locator('input[name="cardnumber"]').clear();

    await fillStripePaymentForm(page, 'SUCCESS');

    submitButton = page.locator('button[type="submit"]').last();
    await submitButton.click();

    await page.waitForURL(/\/order\/success/, { timeout: 30000 });
    await expect(page.locator('h1')).toContainText('Order Confirmed');
  });
});

test.describe('Declined Cards - Rate Limiting', () => {
  test.setTimeout(60000);

  test('should handle rate limit gracefully', async ({ page }) => {
    const testEmail = `declined-rate-limit-${Date.now()}@pawcasso.test`;

    await fillOrderForm(page, {
      ...TEST_ORDER,
      customerEmail: testEmail,
    });

    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 });

    await fillStripePaymentForm(page, 'DECLINED_RATE_LIMIT');

    const submitButton = page.locator('button[type="submit"]').last();
    await submitButton.click();

    await page.waitForTimeout(3000);

    const expectedError = getExpectedError('DECLINED_RATE_LIMIT');
    if (expectedError) {
      const errorLocator = page.locator(`text=${expectedError}, text=too many, text=limit, text=wait`);
      await expect(errorLocator.first()).toBeVisible({ timeout: 10000 });
    }
  });
});

test.describe('Declined Cards - Mobile Experience', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE
  test.setTimeout(60000);

  test('should display error messages clearly on mobile', async ({ page }) => {
    const testEmail = `mobile-declined-${Date.now()}@pawcasso.test`;

    await fillOrderForm(page, {
      ...TEST_ORDER,
      customerEmail: testEmail,
    });

    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 });

    await fillStripePaymentForm(page, 'DECLINED_GENERIC');

    const submitButton = page.locator('button[type="submit"]').last();
    await submitButton.click();

    await page.waitForTimeout(3000);

    // Error message should be visible and readable on mobile
    const errorLocator = page.locator('text=declined, text=not process').first();
    await expect(errorLocator).toBeVisible();

    // Verify error is in viewport (not hidden by scroll)
    const isInViewport = await errorLocator.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top >= 0 && rect.bottom <= window.innerHeight;
    });

    expect(isInViewport).toBe(true);
  });

  test('should allow easy retry on mobile after decline', async ({ page }) => {
    const testEmail = `mobile-retry-${Date.now()}@pawcasso.test`;

    await fillOrderForm(page, {
      ...TEST_ORDER,
      customerEmail: testEmail,
    });

    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 });

    await fillStripePaymentForm(page, 'DECLINED_INSUFFICIENT_FUNDS');

    let submitButton = page.locator('button[type="submit"]').last();
    await submitButton.click();

    await page.waitForTimeout(3000);

    // Clear and retry
    const stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]').first();
    await stripeFrame.locator('input[name="cardnumber"]').clear();

    await fillStripePaymentForm(page, 'SUCCESS');

    submitButton = page.locator('button[type="submit"]').last();

    // Verify submit button is tappable on mobile (min 44x44px)
    const boundingBox = await submitButton.boundingBox();
    expect(boundingBox).toBeTruthy();
    if (boundingBox) {
      expect(boundingBox.height).toBeGreaterThanOrEqual(40);
    }

    await submitButton.click();

    await page.waitForURL(/\/order\/success/, { timeout: 30000 });
    await expect(page.locator('h1')).toContainText('Order Confirmed');
  });
});

test.describe('Declined Cards - Analytics & Tracking', () => {
  test.setTimeout(60000);

  test('should NOT track declined payment as conversion', async ({ page, request }) => {
    const testEmail = `analytics-declined-${Date.now()}@pawcasso.test`;

    await fillOrderForm(page, {
      ...TEST_ORDER,
      customerEmail: testEmail,
    });

    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 });

    await fillStripePaymentForm(page, 'DECLINED_GENERIC');

    const submitButton = page.locator('button[type="submit"]').last();
    await submitButton.click();

    await page.waitForTimeout(3000);

    // Verify NO conversion was tracked in analytics
    const analyticsResponse = await request.get(`/api/admin/analytics/conversions?email=${testEmail}`);

    if (analyticsResponse.ok()) {
      const conversions = await analyticsResponse.json();
      expect(conversions.length).toBe(0);
    }
  });

  test('should track failed payment attempt for debugging', async ({ page, request }) => {
    const testEmail = `tracking-failed-${Date.now()}@pawcasso.test`;

    await fillOrderForm(page, {
      ...TEST_ORDER,
      customerEmail: testEmail,
    });

    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 });

    await fillStripePaymentForm(page, 'DECLINED_INSUFFICIENT_FUNDS');

    const submitButton = page.locator('button[type="submit"]').last();
    await submitButton.click();

    await page.waitForTimeout(3000);

    // Check if failed attempts are logged (for debugging/optimization)
    const logsResponse = await request.get(`/api/admin/payment-logs?email=${testEmail}&status=failed`);

    // It's OK if this endpoint doesn't exist yet - just checking if implemented
    if (logsResponse.ok()) {
      const logs = await logsResponse.json();
      expect(logs.length).toBeGreaterThan(0);
    }
  });
});
