import { test, expect } from '@playwright/test';

test.describe('Gallery Performance with 100+ Images', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to gallery page
    await page.goto('/gallery');
  });

  test('should load gallery page within 3 seconds', async ({ page }) => {
    const startTime = Date.now();

    // Wait for gallery grid to be visible
    await page.waitForSelector('[role="list"]', { timeout: 5000 });

    const loadTime = Date.now() - startTime;

    console.log(`Gallery loaded in ${loadTime}ms`);
    expect(loadTime).toBeLessThan(3000); // Should load within 3s
  });

  test('should display skeleton loaders immediately', async ({ page }) => {
    // Check that skeleton is visible quickly (within 500ms)
    const skeleton = page.locator('.skeleton-item').first();
    await expect(skeleton).toBeVisible({ timeout: 500 });

    // Should show multiple skeleton items (at least 12)
    const skeletonCount = await page.locator('.skeleton-item').count();
    expect(skeletonCount).toBeGreaterThanOrEqual(12);
  });

  test('should implement infinite scroll', async ({ page }) => {
    // Wait for initial items to load
    await page.waitForSelector('[role="listitem"]', { timeout: 5000 });

    // Count initial items
    const initialCount = await page.locator('[role="listitem"]').count();
    console.log(`Initial items loaded: ${initialCount}`);

    // Should load initial batch (24 items)
    expect(initialCount).toBe(24);

    // Scroll to bottom to trigger infinite scroll
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Wait a bit for new items to load
    await page.waitForTimeout(1000);

    // Count items again - should have more
    const afterScrollCount = await page.locator('[role="listitem"]').count();
    console.log(`Items after scroll: ${afterScrollCount}`);

    expect(afterScrollCount).toBeGreaterThan(initialCount);
  });

  test('should lazy load images beyond initial viewport', async ({ page }) => {
    // Wait for initial items
    await page.waitForSelector('[role="listitem"]', { timeout: 5000 });

    // Get all images
    const images = page.locator('[role="listitem"] img');
    const totalImages = await images.count();

    // Check that first 3 images have priority loading
    for (let i = 0; i < Math.min(3, totalImages); i++) {
      const img = images.nth(i);
      const loading = await img.getAttribute('loading');
      expect(loading).toBe('eager');
    }

    // Check that images beyond the first 3 are lazy loaded
    if (totalImages > 3) {
      const lazyImg = images.nth(10);
      const loading = await lazyImg.getAttribute('loading');
      expect(loading).toBe('lazy');
    }
  });

  test('should show loading indicator when scrolling', async ({ page }) => {
    // Wait for initial load
    await page.waitForSelector('[role="listitem"]', { timeout: 5000 });

    // Scroll to trigger more loading
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Should show "Loading more portraits..." text
    const loadingText = page.getByText(/loading more portraits/i);

    // The loading indicator should appear (even briefly)
    await expect(loadingText).toBeVisible({ timeout: 2000 });
  });

  test('should display accurate item count', async ({ page }) => {
    // Wait for page to load
    await page.waitForSelector('[role="list"]', { timeout: 5000 });

    // Check that total count is displayed
    const countText = await page.textContent('body');
    expect(countText).toMatch(/\d+ pieces/);

    // The total should be 120 (generated artworks)
    expect(countText).toContain('120 pieces');
  });

  test('should handle filters without breaking infinite scroll', async ({ page }) => {
    // Wait for initial load
    await page.waitForSelector('[role="listitem"]', { timeout: 5000 });

    // Click on a filter (e.g., "Pixar 3D")
    const filter = page.getByRole('button', { name: 'Pixar 3D' });
    await filter.click();

    // Wait for filter to apply
    await page.waitForTimeout(500);

    // Check that items are shown
    const filteredCount = await page.locator('[role="listitem"]').count();
    expect(filteredCount).toBeGreaterThan(0);

    // Scroll to test infinite scroll still works
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    // Should load more items if available
    const afterScrollCount = await page.locator('[role="listitem"]').count();
    // May or may not load more depending on filter results
    expect(afterScrollCount).toBeGreaterThanOrEqual(filteredCount);
  });

  test('should maintain keyboard navigation', async ({ page }) => {
    // Wait for items to load
    await page.waitForSelector('[role="listitem"]', { timeout: 5000 });

    // Focus on first item
    const firstItem = page.locator('[role="listitem"]').first();
    await firstItem.focus();

    // Press arrow right to navigate
    await page.keyboard.press('ArrowRight');

    // Check that focus moved (via keyboard navigation)
    const focusedElement = await page.evaluate(() => document.activeElement?.getAttribute('role'));
    expect(focusedElement).toBe('listitem');
  });

  test('should measure Core Web Vitals', async ({ page }) => {
    // Navigate and wait for load
    await page.waitForLoadState('load');
    await page.waitForSelector('[role="list"]', { timeout: 5000 });

    // Get performance metrics
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        // Wait a bit for metrics to be collected
        setTimeout(() => {
          const perfEntries = performance.getEntriesByType('navigation');
          const paintEntries = performance.getEntriesByType('paint');

          const fcp = paintEntries.find(e => e.name === 'first-contentful-paint');

          resolve({
            fcp: fcp?.startTime,
            domContentLoaded: (perfEntries[0] as any)?.domContentLoadedEventEnd,
            loadComplete: (perfEntries[0] as any)?.loadEventEnd,
          });
        }, 2000);
      });
    });

    console.log('Performance Metrics:', metrics);

    // FCP should be under 2 seconds
    if ((metrics as any).fcp) {
      expect((metrics as any).fcp).toBeLessThan(2000);
    }
  });

  test('should show completion message when all items loaded', async ({ page }) => {
    // Wait for initial load
    await page.waitForSelector('[role="listitem"]', { timeout: 5000 });

    // Scroll multiple times to load all items
    for (let i = 0; i < 12; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
    }

    // Should show "You've viewed all X pieces" message
    const completionMessage = page.getByText(/you've viewed all \d+ pieces/i);
    await expect(completionMessage).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Gallery Performance Benchmarks', () => {
  test('should load first 24 images within performance budget', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/gallery');

    // Wait for first batch of images to be visible
    await page.waitForSelector('[role="listitem"]:nth-child(24)', { timeout: 10000 });

    // Wait for images to actually load
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    const totalTime = Date.now() - startTime;

    console.log(`First 24 images loaded in ${totalTime}ms`);

    // Performance budget: First 24 images should load within 5 seconds
    expect(totalTime).toBeLessThan(5000);
  });

  test('should not cause layout shifts during infinite scroll', async ({ page }) => {
    await page.goto('/gallery');

    // Wait for initial load
    await page.waitForSelector('[role="listitem"]', { timeout: 5000 });

    // Get initial scroll position
    const initialHeight = await page.evaluate(() => document.body.scrollHeight);

    // Scroll to trigger infinite scroll
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    // Get new height
    const newHeight = await page.evaluate(() => document.body.scrollHeight);

    // Height should increase (new items added)
    expect(newHeight).toBeGreaterThan(initialHeight);

    // User should still be near the bottom (no jump)
    const scrollPosition = await page.evaluate(() => window.scrollY);
    expect(scrollPosition).toBeGreaterThan(0);
  });
});
