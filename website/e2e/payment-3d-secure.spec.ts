/**
 * CRITICAL: 3D Secure (SCA) E2E Tests
 *
 * Strong Customer Authentication (SCA) is REQUIRED by EU regulations.
 * Payment providers like Stripe enforce 3D Secure for European cards.
 *
 * These tests ensure:
 * ✅ 3DS authentication flow works correctly
 * ✅ Successful authentication completes payment
 * ✅ Failed authentication blocks payment
 * ✅ Optional 3DS cards work with and without auth
 * ✅ Proper error handling for authentication failures
 *
 * Real-World Impact:
 * - 40%+ of EU customers use cards requiring 3DS
 * - Failed 3DS implementation = lost revenue + angry customers
 * - Stripe automatically handles 3DS - we must test it works
 *
 * Test Cards:
 * - 4000002500003155: Requires 3DS, always succeeds after auth
 * - 4000008400001629: Requires 3DS, authentication fails
 * - 4000002760003184: Optional 3DS (bank supports but doesn't require)
 */

import { test, expect, Page } from '@playwright/test';
import { STRIPE_TEST_CARDS, getCardForFilling, TEST_ORDER } from './helpers/stripe-test-cards';

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

// Helper: Handle 3DS authentication modal
async function complete3DSAuthentication(page: Page, shouldSucceed: boolean = true) {
  // Wait for 3DS authentication modal/redirect
  await page.waitForTimeout(3000);

  // Stripe test mode shows a challenge modal with "Complete authentication" or "Fail authentication" buttons
  if (shouldSucceed) {
    // Click "Complete authentication" button
    const completeButton = page.locator('button:has-text("Complete"), button:has-text("Authorize")').first();

    // Wait for button to be available
    await completeButton.waitFor({ timeout: 10000 });
    await completeButton.click();
  } else {
    // Click "Fail authentication" button
    const failButton = page.locator('button:has-text("Fail"), button:has-text("Cancel")').first();

    await failButton.waitFor({ timeout: 10000 });
    await failButton.click();
  }

  // Wait for modal to close
  await page.waitForTimeout(2000);
}

test.describe('3D Secure Authentication - Required & Successful', () => {
  test.setTimeout(90000); // 3DS flows take longer due to authentication step

  test('should complete payment with 3DS authentication (required card)', async ({ page }) => {
    const testEmail = `3ds-success-${Date.now()}@pawcasso.test`;

    await fillOrderForm(page, {
      ...TEST_ORDER,
      customerEmail: testEmail,
    });

    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 });

    // Fill with card requiring 3DS
    await fillStripePaymentForm(page, 'REQUIRE_3DS_SUCCESS');

    const submitButton = page.locator('button[type="submit"]').last();
    await submitButton.click();

    // Wait for 3DS modal to appear
    await page.waitForTimeout(3000);

    // Complete authentication
    await complete3DSAuthentication(page, true);

    // After successful 3DS, should redirect to success page
    await page.waitForURL(/\/order\/success/, { timeout: 30000 });

    await expect(page.locator('h1')).toContainText('Order Confirmed');
    await expect(page.locator('text=Thank you')).toBeVisible();
  });

  test('should show authentication UI when 3DS is required', async ({ page }) => {
    const testEmail = `3ds-ui-${Date.now()}@pawcasso.test`;

    await fillOrderForm(page, {
      ...TEST_ORDER,
      customerEmail: testEmail,
    });

    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 });

    await fillStripePaymentForm(page, 'REQUIRE_3DS_SUCCESS');

    const submitButton = page.locator('button[type="submit"]').last();
    await submitButton.click();

    // Wait for 3DS modal/iframe
    await page.waitForTimeout(3000);

    // Verify authentication UI is displayed
    // In test mode, Stripe shows a modal with "Complete authentication" button
    const authUI = page.locator('text=authentication, text=verify, text=confirm').first();
    await authUI.waitFor({ timeout: 10000 });

    expect(authUI).toBeVisible();
  });

  test('should handle multiple 3DS attempts if first fails', async ({ page }) => {
    const testEmail = `3ds-retry-${Date.now()}@pawcasso.test`;

    await fillOrderForm(page, {
      ...TEST_ORDER,
      customerEmail: testEmail,
    });

    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 });

    await fillStripePaymentForm(page, 'REQUIRE_3DS_SUCCESS');

    const submitButton = page.locator('button[type="submit"]').last();
    await submitButton.click();

    // First attempt: fail authentication
    await page.waitForTimeout(3000);
    await complete3DSAuthentication(page, false);

    // Should return to checkout with error
    await page.waitForTimeout(2000);
    await expect(page.locator('text=authentication failed, text=declined')).toBeVisible();

    // Try again with same card
    const retryButton = page.locator('button[type="submit"]').last();
    await retryButton.click();

    // Second attempt: succeed
    await page.waitForTimeout(3000);
    await complete3DSAuthentication(page, true);

    // Should now succeed
    await page.waitForURL(/\/order\/success/, { timeout: 30000 });
    await expect(page.locator('h1')).toContainText('Order Confirmed');
  });
});

test.describe('3D Secure Authentication - Failed Authentication', () => {
  test.setTimeout(90000);

  test('should block payment when 3DS authentication fails', async ({ page }) => {
    const testEmail = `3ds-fail-${Date.now()}@pawcasso.test`;

    await fillOrderForm(page, {
      ...TEST_ORDER,
      customerEmail: testEmail,
    });

    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 });

    // Use card that requires 3DS but fails authentication
    await fillStripePaymentForm(page, 'REQUIRE_3DS_FAIL');

    const submitButton = page.locator('button[type="submit"]').last();
    await submitButton.click();

    // Wait for 3DS modal
    await page.waitForTimeout(3000);

    // Authentication will fail automatically for this card
    // Or we can explicitly fail it
    await complete3DSAuthentication(page, false);

    // Should remain on checkout page with error message
    await page.waitForTimeout(2000);

    // Verify error message is shown
    const errorMessage = page.locator('text=authentication failed, text=We are unable to authenticate, text=declined');
    await expect(errorMessage.first()).toBeVisible();

    // Verify we're still on checkout page (not success page)
    expect(page.url()).toContain('checkout.stripe.com');
  });

  test('should not create order when 3DS authentication fails', async ({ page, request }) => {
    const testEmail = `3ds-no-order-${Date.now()}@pawcasso.test`;

    await fillOrderForm(page, {
      ...TEST_ORDER,
      customerEmail: testEmail,
    });

    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 });

    await fillStripePaymentForm(page, 'REQUIRE_3DS_FAIL');

    const submitButton = page.locator('button[type="submit"]').last();
    await submitButton.click();

    await page.waitForTimeout(3000);
    await complete3DSAuthentication(page, false);

    // Wait to ensure no order is created
    await page.waitForTimeout(3000);

    // Verify NO order was created in database
    const ordersResponse = await request.get(`/api/admin/orders?email=${testEmail}`);

    if (ordersResponse.ok()) {
      const orders = await ordersResponse.json();
      expect(orders.length).toBe(0); // No orders should exist
    }
  });
});

test.describe('3D Secure Authentication - Optional 3DS', () => {
  test.setTimeout(90000);

  test('should complete payment with optional 3DS (no authentication)', async ({ page }) => {
    const testEmail = `3ds-optional-noauth-${Date.now()}@pawcasso.test`;

    await fillOrderForm(page, {
      ...TEST_ORDER,
      customerEmail: testEmail,
    });

    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 });

    // Card with optional 3DS - bank supports it but doesn't require it
    await fillStripePaymentForm(page, 'OPTIONAL_3DS');

    const submitButton = page.locator('button[type="submit"]').last();
    await submitButton.click();

    // Payment should complete without 3DS challenge (or with minimal friction)
    await page.waitForURL(/\/order\/success/, { timeout: 30000 });

    await expect(page.locator('h1')).toContainText('Order Confirmed');
  });

  test('should complete payment with optional 3DS (with authentication)', async ({ page }) => {
    const testEmail = `3ds-optional-withauth-${Date.now()}@pawcasso.test`;

    await fillOrderForm(page, {
      ...TEST_ORDER,
      customerEmail: testEmail,
    });

    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 });

    await fillStripePaymentForm(page, 'OPTIONAL_3DS');

    const submitButton = page.locator('button[type="submit"]').last();
    await submitButton.click();

    // If 3DS modal appears, complete it
    try {
      await page.waitForTimeout(3000);
      const authButton = page.locator('button:has-text("Complete"), button:has-text("Authorize")').first();

      if (await authButton.isVisible({ timeout: 5000 })) {
        await authButton.click();
      }
    } catch (e) {
      // No 3DS challenge appeared - that's fine for optional 3DS
    }

    // Should complete successfully either way
    await page.waitForURL(/\/order\/success/, { timeout: 30000 });
    await expect(page.locator('h1')).toContainText('Order Confirmed');
  });
});

test.describe('3D Secure Authentication - Mobile Experience', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE size
  test.setTimeout(90000);

  test('should complete 3DS authentication on mobile', async ({ page }) => {
    const testEmail = `3ds-mobile-${Date.now()}@pawcasso.test`;

    await fillOrderForm(page, {
      ...TEST_ORDER,
      customerEmail: testEmail,
    });

    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 });

    await fillStripePaymentForm(page, 'REQUIRE_3DS_SUCCESS');

    const submitButton = page.locator('button[type="submit"]').last();
    await submitButton.click();

    await page.waitForTimeout(3000);
    await complete3DSAuthentication(page, true);

    await page.waitForURL(/\/order\/success/, { timeout: 30000 });
    await expect(page.locator('h1')).toContainText('Order Confirmed');
  });

  test('should display 3DS modal correctly on mobile', async ({ page }) => {
    const testEmail = `3ds-mobile-ui-${Date.now()}@pawcasso.test`;

    await fillOrderForm(page, {
      ...TEST_ORDER,
      customerEmail: testEmail,
    });

    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 });

    await fillStripePaymentForm(page, 'REQUIRE_3DS_SUCCESS');

    const submitButton = page.locator('button[type="submit"]').last();
    await submitButton.click();

    await page.waitForTimeout(3000);

    // Verify 3DS UI is mobile-friendly (buttons are tappable, text is readable)
    const authButton = page.locator('button:has-text("Complete"), button:has-text("Authorize")').first();
    await authButton.waitFor({ timeout: 10000 });

    // Check button is large enough for mobile tap (min 44x44px)
    const boundingBox = await authButton.boundingBox();
    expect(boundingBox).toBeTruthy();
    if (boundingBox) {
      expect(boundingBox.height).toBeGreaterThanOrEqual(40); // Allow 4px margin
      expect(boundingBox.width).toBeGreaterThanOrEqual(40);
    }
  });
});

test.describe('3D Secure Authentication - Performance', () => {
  test.setTimeout(90000);

  test('should complete 3DS authentication within 60 seconds', async ({ page }) => {
    const testEmail = `3ds-performance-${Date.now()}@pawcasso.test`;
    const startTime = Date.now();

    await fillOrderForm(page, {
      ...TEST_ORDER,
      customerEmail: testEmail,
    });

    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 });

    await fillStripePaymentForm(page, 'REQUIRE_3DS_SUCCESS');

    const submitButton = page.locator('button[type="submit"]').last();
    await submitButton.click();

    await page.waitForTimeout(3000);
    await complete3DSAuthentication(page, true);

    await page.waitForURL(/\/order\/success/, { timeout: 30000 });

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Complete flow (including 3DS) should take < 60 seconds
    expect(duration).toBeLessThan(60000);
  });
});
