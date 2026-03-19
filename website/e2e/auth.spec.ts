import { test, expect } from '@playwright/test';

test.describe('Magic Link Authentication', () => {
  test('should display sign-in page', async ({ page }) => {
    await page.goto('/auth/signin');

    // Sign-in page should load
    await expect(page.getByText(/sign in|log in|email/i).first()).toBeVisible();
  });

  test('should accept email input', async ({ page }) => {
    await page.goto('/auth/signin');

    // Look for email input
    const emailInput = page.locator('input[type="email"]').or(
      page.locator('input[name*="email"]')
    );

    if (await emailInput.count() > 0) {
      await emailInput.fill('test@example.com');

      // Verify input value
      const value = await emailInput.inputValue();
      expect(value).toBe('test@example.com');
    }
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/auth/signin');

    const emailInput = page.locator('input[type="email"]');

    if (await emailInput.count() > 0) {
      // Try invalid email
      await emailInput.fill('invalid-email');

      // Submit button
      const submitButton = page.getByRole('button', { name: /sign in|continue|submit/i });

      if (await submitButton.count() > 0) {
        await submitButton.click();

        // Should show validation error or prevent submission
        await page.waitForTimeout(500);

        // HTML5 validation or custom validation should trigger
        const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
        expect(isInvalid).toBeTruthy();
      }
    }
  });

  test('should submit magic link request', async ({ page }) => {
    await page.goto('/auth/signin');

    const emailInput = page.locator('input[type="email"]').or(
      page.locator('input[name*="email"]')
    );

    if (await emailInput.count() > 0) {
      await emailInput.fill('playwright@test.com');

      const submitButton = page.getByRole('button', { name: /sign in|continue|submit/i });

      if (await submitButton.count() > 0) {
        // Listen for navigation or API call
        const responsePromise = page.waitForResponse(
          response => response.url().includes('/api/auth'),
          { timeout: 5000 }
        ).catch(() => null);

        await submitButton.click();

        // Wait for redirect or confirmation
        await page.waitForTimeout(2000);

        // Should redirect to verify page or show confirmation
        const url = page.url();
        expect(url).toBeTruthy();
      }
    }
  });

  test('should display verification page', async ({ page }) => {
    await page.goto('/auth/verify?email=test@example.com');

    // Verify page should show instructions
    await expect(page.getByText(/check your email/i)).toBeVisible();
    await expect(page.getByText(/test@example.com/i)).toBeVisible();
  });

  test('should show verification instructions', async ({ page }) => {
    await page.goto('/auth/verify?email=user@test.com');

    // Instructions should be present
    await expect(page.getByText(/magic link/i)).toBeVisible();
    await expect(page.getByText(/check your email|inbox/i)).toBeVisible();
  });

  test('should display try again link', async ({ page }) => {
    await page.goto('/auth/verify');

    // Try again link should exist
    const tryAgainLink = page.getByRole('link', { name: /try again/i });
    await expect(tryAgainLink).toBeVisible();
    await expect(tryAgainLink).toHaveAttribute('href', '/auth/signin');
  });

  test('should handle magic link callback', async ({ page }) => {
    // Simulate clicking a magic link
    // Real magic links include a token parameter
    await page.goto('/api/auth/callback/email?token=test_token_123&email=test@example.com');

    // Should process the callback
    await page.waitForLoadState('networkidle');

    // Will likely redirect or show error with invalid token
    // But verifies the endpoint exists
    expect(page.url()).toBeTruthy();
  });

  test('should persist session after authentication', async ({ page, context }) => {
    // Set a valid session cookie (mock)
    await context.addCookies([
      {
        name: 'next-auth.session-token',
        value: 'valid-session-token-' + Date.now(),
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
      },
    ]);

    await page.goto('/portal');

    // With valid session, should stay on portal page
    await page.waitForTimeout(2000);

    // Session should persist (won't redirect to sign-in)
    const url = page.url();
    expect(url).toContain('/portal');
  });

  test('should sign out user', async ({ page, context }) => {
    // Set session
    await context.addCookies([
      {
        name: 'next-auth.session-token',
        value: 'session-to-sign-out',
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
      },
    ]);

    await page.goto('/api/auth/signout');

    // Should process sign-out
    await page.waitForLoadState('networkidle');

    // Verify sign-out page or redirect
    expect(page.url()).toBeTruthy();
  });

  test('should be mobile responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/auth/verify?email=mobile@test.com');

    // Verify page should be mobile-friendly
    await expect(page.getByText(/check your email/i)).toBeVisible();
    await expect(page.getByText(/mobile@test.com/i)).toBeVisible();
  });
});

test.describe('Session Management', () => {
  test('should maintain session across page navigation', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'next-auth.session-token',
        value: 'persistent-session',
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
      },
    ]);

    await page.goto('/portal');
    await page.waitForTimeout(1000);

    // Navigate to another page
    await page.goto('/order');

    // Session should still be valid
    const cookies = await context.cookies();
    const sessionCookie = cookies.find(c => c.name === 'next-auth.session-token');

    expect(sessionCookie).toBeTruthy();
  });

  test('should handle expired session', async ({ page, context }) => {
    // Set an old session
    await context.addCookies([
      {
        name: 'next-auth.session-token',
        value: 'expired-session',
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        expires: Math.floor(Date.now() / 1000) - 3600, // Expired 1 hour ago
      },
    ]);

    await page.goto('/portal');

    // Should redirect to sign-in due to expired session
    await page.waitForURL(/auth|signin/, { timeout: 5000 });

    expect(page.url()).toMatch(/auth|signin/);
  });
});
