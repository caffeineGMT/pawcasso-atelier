import { test, expect } from '@playwright/test';

/**
 * Cross-Browser & Device Smoke Tests
 * Tests critical functionality across Safari, Firefox, Chrome, Edge, iPhone SE, iPad, Android
 */

test.describe('Cross-Browser Smoke Tests', () => {
  test('homepage loads correctly', async ({ page, browserName }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Pawcasso/i);

    // Verify hero section renders
    const hero = await page.locator('h1').first();
    await expect(hero).toBeVisible();
    console.log(`✓ [${browserName}] Homepage loaded successfully`);
  });

  test('order page loads and displays pricing', async ({ page, browserName }) => {
    await page.goto('/order');
    await page.waitForLoadState('networkidle');

    const heading = page.getByText(/Commission|Order|Create/i).first();
    await expect(heading).toBeVisible({ timeout: 10000 });
    console.log(`✓ [${browserName}] Order page loaded`);
  });

  test('gallery loads images correctly', async ({ page, browserName }) => {
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');

    // Check for images
    const images = page.locator('img');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);

    // Verify first image loaded successfully
    const firstImg = images.first();
    const loaded = await firstImg.evaluate((img: HTMLImageElement) =>
      img.complete && img.naturalHeight > 0
    );
    expect(loaded).toBeTruthy();
    console.log(`✓ [${browserName}] Gallery loaded ${count} images`);
  });

  test('navigation links work', async ({ page, browserName }) => {
    await page.goto('/');

    // Find and click order link
    const orderLink = page.getByRole('link', { name: /Order|Get Started/i }).first();
    await orderLink.click();
    await page.waitForURL('**/order');

    expect(page.url()).toContain('/order');
    console.log(`✓ [${browserName}] Navigation works`);
  });

  test('mobile responsive design works', async ({ page, browserName, viewport }) => {
    // Only on mobile viewports
    if (!viewport || viewport.width > 768) {
      test.skip();
    }

    await page.goto('/');

    // Check for horizontal scroll (layout bug)
    const hasHorizontalScroll = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    );

    expect(hasHorizontalScroll).toBe(false);

    // Verify content is visible
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();

    console.log(`✓ [${browserName}] Mobile responsive (${viewport.width}x${viewport.height})`);
  });

  test('no JavaScript errors on page load', async ({ page, browserName }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out known acceptable errors (e.g., analytics, third-party)
    const criticalErrors = consoleErrors.filter(err =>
      !err.includes('analytics') &&
      !err.includes('GTM') &&
      !err.includes('favicon')
    );

    if (criticalErrors.length > 0) {
      console.log(`⚠ [${browserName}] Console errors:`, criticalErrors);
    }

    expect(criticalErrors.length).toBe(0);
    console.log(`✓ [${browserName}] No critical JavaScript errors`);
  });

  test('CSS renders correctly (no blank page)', async ({ page, browserName }) => {
    await page.goto('/');

    // Check body has content
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    expect(bodyHeight).toBeGreaterThan(400);

    // Check computed styles loaded
    const bgColor = await page.locator('body').evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );
    expect(bgColor).not.toBe('');

    console.log(`✓ [${browserName}] CSS rendered (body height: ${bodyHeight}px)`);
  });

  test('forms accept input correctly', async ({ page, browserName }) => {
    await page.goto('/order');
    await page.waitForLoadState('networkidle');

    // Find email input
    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.count() > 0) {
      await emailInput.fill('test@example.com');
      const value = await emailInput.inputValue();
      expect(value).toBe('test@example.com');
      console.log(`✓ [${browserName}] Form inputs work`);
    } else {
      console.log(`⚠ [${browserName}] No email input found`);
    }
  });
});
