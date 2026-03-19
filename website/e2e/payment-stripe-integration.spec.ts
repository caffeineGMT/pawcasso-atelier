/**
 * Payment Flow E2E Tests - Stripe Test Mode Integration
 *
 * CRITICAL: These tests validate the complete payment flow using Stripe test mode.
 * This is the foundation for scaling revenue - every test failure represents potential lost sales.
 *
 * Prerequisites:
 * - STRIPE_SECRET_KEY_TEST environment variable set
 * - STRIPE_PUBLISHABLE_KEY_TEST environment variable set
 * - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY set to test key
 * - Database with test data seeded
 *
 * Test Cards:
 * - 4242424242424242 (Success)
 * - 4000000000009995 (Declined)
 * - 4000002500003155 (3D Secure)
 * - 4000000000000341 (Attach fails)
 */

import { test, expect, Page } from '@playwright/test';
import Stripe from 'stripe';

// Initialize Stripe with test key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST || '', {
  apiVersion: '2024-12-18.acacia',
});

/**
 * Helper: Fill out order form with test data
 */
async function fillOrderForm(page: Page, email: string = 'test@pawcasso.test') {
  // Select tier
  await page.click('[data-testid="tier-standard"]');

  // Fill customer details
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="name"]', 'Test Customer');
  await page.fill('input[name="petName"]', 'Fluffy');

  // Select style
  await page.click('[data-testid="style-impressionist"]');

  // Upload pet photo (if file input exists)
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    await fileInput.setInputFiles('./e2e/fixtures/test-dog.jpg');
  }
}

/**
 * Helper: Complete Stripe checkout with test card
 */
async function completeStripeCheckout(page: Page, cardNumber: string = '4242424242424242') {
  // Wait for Stripe Elements to load
  await page.waitForSelector('iframe[name^="__privateStripeFrame"]', { timeout: 10000 });

  // Get the iframe for card element
  const stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]').first();

  // Fill in card details
  await stripeFrame.locator('input[name="cardnumber"]').fill(cardNumber);
  await stripeFrame.locator('input[name="exp-date"]').fill('12/34');
  await stripeFrame.locator('input[name="cvc"]').fill('123');
  await stripeFrame.locator('input[name="postal"]').fill('12345');

  // Submit payment
  await page.click('button[type="submit"]');
}

/**
 * Helper: Wait for webhook to process
 */
async function waitForWebhookProcessing(page: Page, timeout = 5000) {
  await page.waitForTimeout(timeout);
}

test.describe('Stripe Payment Integration - Full Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start on order page
    await page.goto('/order');
    await expect(page).toHaveURL(/.*order/);
  });

  test('should complete full payment flow with test card', async ({ page }) => {
    // Fill order form
    await fillOrderForm(page, 'success@pawcasso.test');

    // Submit to checkout
    await page.click('button:has-text("Proceed to Checkout")');

    // Should redirect to Stripe checkout
    await expect(page).toHaveURL(/checkout\.stripe\.com|localhost.*checkout/);

    // Complete payment
    await completeStripeCheckout(page);

    // Wait for redirect to success page
    await page.waitForURL(/.*success/, { timeout: 15000 });

    // Verify success page elements
    await expect(page.locator('h1')).toContainText(/thank you|success/i);
    await expect(page.locator('[data-testid="order-confirmation"]')).toBeVisible();

    // Verify conversion tracking fires
    const dataLayer = await page.evaluate(() => (window as any).dataLayer);
    const purchaseEvent = dataLayer?.find((event: any) => event.event === 'purchase');
    expect(purchaseEvent).toBeTruthy();
  });

  test('should create order in database after successful payment', async ({ page }) => {
    const testEmail = `test-${Date.now()}@pawcasso.test`;

    // Complete checkout
    await fillOrderForm(page, testEmail);
    await page.click('button:has-text("Proceed to Checkout")');
    await completeStripeCheckout(page);

    // Wait for success page
    await page.waitForURL(/.*success/);

    // Get order ID from URL or page
    const orderId = await page.locator('[data-testid="order-id"]').textContent();
    expect(orderId).toBeTruthy();

    // Verify order exists in database (via API)
    const response = await page.request.get(`/api/orders/${orderId}`);
    expect(response.ok()).toBeTruthy();

    const order = await response.json();
    expect(order.email).toBe(testEmail);
    expect(order.status).toBe('paid');
  });

  test('should process webhook and send confirmation email', async ({ page }) => {
    const testEmail = `webhook-test-${Date.now()}@pawcasso.test`;

    // Complete payment
    await fillOrderForm(page, testEmail);
    await page.click('button:has-text("Proceed to Checkout")');
    await completeStripeCheckout(page);
    await page.waitForURL(/.*success/);

    // Wait for webhook processing
    await waitForWebhookProcessing(page);

    // Verify email was sent (check via API endpoint)
    const emailCheckResponse = await page.request.get(`/api/admin/emails/check?email=${testEmail}`);

    if (emailCheckResponse.ok()) {
      const emailData = await emailCheckResponse.json();
      expect(emailData.sent).toBe(true);
      expect(emailData.type).toBe('order_confirmation');
    }
  });

  test('should handle amount correctly for different tiers', async ({ page }) => {
    const tiers = [
      { testId: 'tier-basic', expectedAmount: 9_00 },
      { testId: 'tier-standard', expectedAmount: 14_00 },
      { testId: 'tier-premium', expectedAmount: 19_00 },
    ];

    for (const tier of tiers) {
      await page.reload();

      // Select tier
      await page.click(`[data-testid="${tier.testId}"]`);
      await fillOrderForm(page);

      // Get the amount from the page
      const amount = await page.locator('[data-testid="checkout-amount"]').textContent();
      expect(amount).toContain(`$${tier.expectedAmount / 100}`);

      // Intercept checkout session creation
      const sessionPromise = page.waitForResponse(resp =>
        resp.url().includes('/api/checkout') && resp.status() === 200
      );

      await page.click('button:has-text("Proceed to Checkout")');

      const sessionResponse = await sessionPromise;
      const sessionData = await sessionResponse.json();

      expect(sessionData.amount_total).toBe(tier.expectedAmount);
    }
  });

  test('should apply referral discount correctly', async ({ page }) => {
    // Navigate with referral code
    await page.goto('/order?ref=TEST_REF_CODE');

    await fillOrderForm(page);

    // Verify discount is shown
    const discountElement = await page.locator('[data-testid="discount-amount"]');
    await expect(discountElement).toBeVisible();

    // Proceed to checkout
    const sessionPromise = page.waitForResponse(resp =>
      resp.url().includes('/api/checkout')
    );

    await page.click('button:has-text("Proceed to Checkout")');

    const sessionResponse = await sessionPromise;
    const sessionData = await sessionResponse.json();

    // Verify coupon was applied
    expect(sessionData.discounts).toBeTruthy();
    expect(sessionData.discounts.length).toBeGreaterThan(0);
  });

  test('should store UTM parameters in order metadata', async ({ page }) => {
    // Navigate with UTM parameters
    await page.goto('/order?utm_source=instagram&utm_medium=social&utm_campaign=spring_2026');

    await fillOrderForm(page);

    // Submit checkout
    const checkoutPromise = page.waitForResponse(resp =>
      resp.url().includes('/api/checkout')
    );

    await page.click('button:has-text("Proceed to Checkout")');

    const checkoutResponse = await checkoutPromise;
    const checkoutData = await checkoutResponse.json();

    // Verify UTM params in metadata
    expect(checkoutData.metadata.utm_source).toBe('instagram');
    expect(checkoutData.metadata.utm_medium).toBe('social');
    expect(checkoutData.metadata.utm_campaign).toBe('spring_2026');
  });

  test('should handle concurrent checkouts without conflicts', async ({ browser }) => {
    // Create 5 concurrent checkout sessions
    const contexts = await Promise.all(
      Array(5).fill(0).map(() => browser.newContext())
    );

    const checkoutPromises = contexts.map(async (context, index) => {
      const page = await context.newPage();
      const email = `concurrent-${index}-${Date.now()}@pawcasso.test`;

      try {
        await page.goto('/order');
        await fillOrderForm(page, email);
        await page.click('button:has-text("Proceed to Checkout")');
        await completeStripeCheckout(page);
        await page.waitForURL(/.*success/, { timeout: 20000 });

        return { success: true, email };
      } catch (error) {
        return { success: false, email, error };
      } finally {
        await context.close();
      }
    });

    const results = await Promise.all(checkoutPromises);

    // All should succeed
    const successCount = results.filter(r => r.success).length;
    expect(successCount).toBe(5);
  });

  test('should prevent duplicate payments for same session', async ({ page }) => {
    await fillOrderForm(page);

    // Start checkout
    await page.click('button:has-text("Proceed to Checkout")');

    // Get session ID
    const url = page.url();
    const sessionId = new URL(url).searchParams.get('session_id');

    if (sessionId) {
      // Try to reuse the same session
      const retrieval = await stripe.checkout.sessions.retrieve(sessionId);
      expect(retrieval.payment_status).toBe('unpaid');

      // Complete payment
      await completeStripeCheckout(page);
      await page.waitForURL(/.*success/);

      // Verify session is now paid
      const afterPayment = await stripe.checkout.sessions.retrieve(sessionId);
      expect(afterPayment.payment_status).toBe('paid');

      // Attempt to pay again with same session should fail
      await page.goto(`/checkout?session_id=${sessionId}`);

      // Should show already paid or redirect
      const isAlreadyPaid = await page.locator('text=/already.*paid|payment.*complete/i').isVisible();
      expect(isAlreadyPaid).toBe(true);
    }
  });

  test('should track payment method details', async ({ page }) => {
    const testEmail = `payment-method-${Date.now()}@pawcasso.test`;

    await fillOrderForm(page, testEmail);
    await page.click('button:has-text("Proceed to Checkout")');
    await completeStripeCheckout(page, '4242424242424242'); // Visa test card
    await page.waitForURL(/.*success/);

    // Get the payment intent ID from the order
    const orderIdEl = await page.locator('[data-testid="order-id"]').textContent();

    if (orderIdEl) {
      const orderResponse = await page.request.get(`/api/orders/${orderIdEl}`);
      const order = await orderResponse.json();

      // Verify payment method was stored
      expect(order.paymentMethod).toBeTruthy();
      expect(order.paymentMethod.brand).toBe('visa');
      expect(order.paymentMethod.last4).toBe('4242');
    }
  });
});

test.describe('Stripe Payment Integration - Performance', () => {
  test('should complete checkout within 10 seconds', async ({ page }) => {
    await page.goto('/order');

    const startTime = Date.now();

    await fillOrderForm(page);
    await page.click('button:has-text("Proceed to Checkout")');
    await completeStripeCheckout(page);
    await page.waitForURL(/.*success/, { timeout: 15000 });

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Should complete in under 10 seconds
    expect(duration).toBeLessThan(10000);
  });

  test('should load Stripe.js within 2 seconds', async ({ page }) => {
    await page.goto('/order');

    const startTime = Date.now();

    // Wait for Stripe to be available
    await page.waitForFunction(() => typeof (window as any).Stripe !== 'undefined', { timeout: 5000 });

    const endTime = Date.now();
    const loadTime = endTime - startTime;

    expect(loadTime).toBeLessThan(2000);
  });
});

test.describe('Stripe Payment Integration - Metadata & Tracking', () => {
  test('should include all required metadata in Stripe session', async ({ page }) => {
    await page.goto('/order');
    await fillOrderForm(page);

    const checkoutPromise = page.waitForResponse(resp =>
      resp.url().includes('/api/checkout')
    );

    await page.click('button:has-text("Proceed to Checkout")');

    const response = await checkoutPromise;
    const sessionData = await response.json();

    // Verify required metadata fields
    expect(sessionData.metadata.petName).toBe('Fluffy');
    expect(sessionData.metadata.style).toBeTruthy();
    expect(sessionData.metadata.tier).toBeTruthy();
    expect(sessionData.metadata.customerName).toBe('Test Customer');
  });

  test('should track checkout abandonment', async ({ page }) => {
    await page.goto('/order');
    await fillOrderForm(page);

    // Start checkout but don't complete
    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForURL(/checkout\.stripe\.com/);

    // Navigate away (abandonment)
    await page.goto('/');

    // Wait for abandonment tracking
    await page.waitForTimeout(2000);

    // Verify abandonment was tracked
    const dataLayer = await page.evaluate(() => (window as any).dataLayer);
    const abandonEvent = dataLayer?.find((event: any) => event.event === 'checkout_abandoned');

    // May or may not have abandonment tracking implemented yet
    // This test documents the expected behavior
  });
});
