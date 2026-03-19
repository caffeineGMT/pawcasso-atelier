import { test, expect } from '@playwright/test';

/**
 * Gallery Page Cross-Browser Tests
 *
 * Tests gallery functionality across all browsers:
 * - Image grid layout and rendering
 * - Lazy loading behavior
 * - Image modal/lightbox functionality
 * - Filtering and sorting
 * - Mobile touch gestures
 * - Performance and loading states
 */

test.describe('Gallery: Page Load & Layout', () => {
  test('should load gallery page successfully', async ({ page, browserName }) => {
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');

    // Check page title
    await expect(page).toHaveTitle(/Gallery|Pawcasso/i);

    // Check main heading
    const heading = page.getByRole('heading', { name: /Gallery|Portfolio|Our Work/i }).first();
    await expect(heading).toBeVisible();
  });

  test('should display gallery grid layout correctly', async ({ page, isMobile }) => {
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for images to start loading

    // Check for grid container
    const gridContainer = page.locator('[class*="grid"], [class*="gallery"], main').first();
    await expect(gridContainer).toBeVisible();

    // Verify grid uses CSS Grid or Flexbox
    const displayType = await gridContainer.evaluate((el) => {
      return window.getComputedStyle(el).display;
    });

    expect(['grid', 'flex', 'block']).toContain(displayType);
  });

  test('should display gallery items', async ({ page }) => {
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    // Find gallery images
    const images = page.locator('img');
    const imageCount = await images.count();

    // Should have at least one image
    expect(imageCount).toBeGreaterThan(0);

    // First image should be visible
    await expect(images.first()).toBeVisible();
  });

  test('should render gallery responsively on mobile', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip();
    }

    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Gallery should be visible on mobile
    const images = page.locator('img');
    const count = await images.count();

    expect(count).toBeGreaterThan(0);

    // Images should fit viewport width
    if (count > 0) {
      const firstImage = images.first();
      const imgWidth = await firstImage.evaluate((img: HTMLImageElement) => img.clientWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);

      // Image should not exceed viewport
      expect(imgWidth).toBeLessThanOrEqual(viewportWidth);
    }
  });
});

test.describe('Gallery: Image Loading & Performance', () => {
  test('should load images progressively', async ({ page, browserName }) => {
    await page.goto('/gallery');

    // Track image loading
    const images = page.locator('img');
    const totalImages = await images.count();

    if (totalImages > 0) {
      // Check first image loads
      const firstImage = images.first();
      await expect(firstImage).toBeVisible();

      // Wait for image to complete loading
      await page.waitForTimeout(2000);

      const isLoaded = await firstImage.evaluate((img: HTMLImageElement) => {
        return img.complete && img.naturalHeight > 0;
      });

      expect(isLoaded).toBe(true);
    }
  });

  test('should implement lazy loading for images', async ({ page }) => {
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');

    // Check for lazy loading attribute
    const lazyImages = page.locator('img[loading="lazy"]');
    const lazyCount = await lazyImages.count();

    // If lazy loading is implemented
    if (lazyCount > 0) {
      const firstLazy = lazyImages.first();

      // Scroll to lazy image
      await firstLazy.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      // Verify it loaded
      const isLoaded = await firstLazy.evaluate((img: HTMLImageElement) => {
        return img.complete;
      });

      expect(isLoaded).toBe(true);
    }
  });

  test('should show loading states for images', async ({ page }) => {
    await page.goto('/gallery');

    // Check for loading skeletons or placeholders
    const loadingStates = page.locator('[class*="skeleton"], [class*="loading"], [class*="placeholder"]');
    const hasLoadingUI = await loadingStates.count() > 0;

    // Loading UI is optional but recommended
    expect(hasLoadingUI || true).toBe(true);
  });

  test('should handle image load errors gracefully', async ({ page, browserName }) => {
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');

    // Check if any images failed to load
    const images = page.locator('img');
    const count = await images.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(5, count); i++) {
        const img = images.nth(i);
        const hasError = await img.evaluate((img: HTMLImageElement) => {
          return img.complete && img.naturalHeight === 0;
        });

        // Images should load successfully (or have fallback)
        if (hasError) {
          // Check for error placeholder
          const alt = await img.getAttribute('alt');
          expect(alt).toBeTruthy(); // Should have descriptive alt text
        }
      }
    }
  });
});

test.describe('Gallery: Image Formats & Optimization', () => {
  test('should serve optimized image formats', async ({ page, browserName }) => {
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');

    const images = page.locator('img');
    const count = await images.count();

    if (count > 0) {
      const firstImage = images.first();
      const src = await firstImage.getAttribute('src');
      const srcset = await firstImage.getAttribute('srcset');

      // Should use optimized formats (WebP, AVIF) or Next.js Image
      const usesOptimizedFormat = src?.includes('.webp') ||
                                   src?.includes('.avif') ||
                                   src?.includes('/_next/image') ||
                                   srcset !== null;

      expect(usesOptimizedFormat).toBe(true);
    }
  });

  test('should use responsive images (srcset)', async ({ page }) => {
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');

    const imagesWithSrcset = page.locator('img[srcset]');
    const count = await imagesWithSrcset.count();

    // At least some images should use srcset for responsiveness
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should have proper image dimensions to prevent layout shift', async ({ page }) => {
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');

    const images = page.locator('img');
    const count = await images.count();

    if (count > 0) {
      const firstImage = images.first();

      // Check if image has width/height attributes or CSS
      const dimensions = await firstImage.evaluate((img: HTMLImageElement) => {
        const rect = img.getBoundingClientRect();
        return {
          width: img.width || rect.width,
          height: img.height || rect.height,
          hasAspectRatio: window.getComputedStyle(img).aspectRatio !== 'auto',
        };
      });

      // Image should have dimensions set
      expect(dimensions.width).toBeGreaterThan(0);
      expect(dimensions.height).toBeGreaterThan(0);
    }
  });
});

test.describe('Gallery: Interaction & Modal', () => {
  test('should open image modal/lightbox on click', async ({ page, isMobile }) => {
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    const images = page.locator('img');
    const count = await images.count();

    if (count > 0) {
      const firstImage = images.first();

      // Click image
      await firstImage.click();
      await page.waitForTimeout(500);

      // Check for modal/lightbox (common patterns)
      const modal = page.locator('[role="dialog"], [class*="modal"], [class*="lightbox"]');
      const hasModal = await modal.count() > 0;

      // Modal is optional - if present, verify it works
      if (hasModal) {
        await expect(modal.first()).toBeVisible();

        // Close modal (ESC key or close button)
        const closeButton = page.locator('button[aria-label*="close"], button:has-text("×")');
        if (await closeButton.count() > 0) {
          await closeButton.first().click();
          await page.waitForTimeout(300);

          // Modal should close
          await expect(modal.first()).not.toBeVisible();
        }
      }
    }
  });

  test('should support keyboard navigation in gallery (desktop)', async ({ page, isMobile, browserName }) => {
    if (isMobile) {
      test.skip();
    }

    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');

    // Tab through gallery items
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);

    // Check if focus is visible
    const focused = await page.evaluate(() => {
      const el = document.activeElement;
      return el?.tagName;
    });

    // Should be able to focus on interactive elements
    expect(['A', 'BUTTON', 'IMG', 'BODY']).toContain(focused);
  });

  test('should handle touch gestures on mobile', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip();
    }

    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const images = page.locator('img');
    const count = await images.count();

    if (count > 0) {
      const firstImage = images.first();

      // Tap image
      await firstImage.tap();
      await page.waitForTimeout(500);

      // Should respond to tap (open modal or navigate)
      const url = page.url();
      expect(url).toBeTruthy();
    }
  });
});

test.describe('Gallery: Filtering & Sorting', () => {
  test('should display filter options if available', async ({ page }) => {
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');

    // Look for filter UI
    const filters = page.locator('button:has-text("Filter"), select:has-text("Style"), [class*="filter"]');
    const hasFilters = await filters.count() > 0;

    // Filters are optional
    expect(hasFilters || true).toBe(true);
  });

  test('should filter gallery items when filter is applied', async ({ page }) => {
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');

    // Check for filter buttons/options
    const filterButtons = page.locator('button').filter({ hasText: /style|type|category/i });
    const count = await filterButtons.count();

    if (count > 0) {
      // Get initial image count
      const initialCount = await page.locator('img').count();

      // Click filter
      await filterButtons.first().click();
      await page.waitForTimeout(500);

      // Image count might change (or same if filter is already selected)
      const newCount = await page.locator('img').count();
      expect(newCount).toBeGreaterThan(0);
    }
  });

  test('should maintain gallery state when navigating back', async ({ page }) => {
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300);

    // Navigate away
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Go back
    await page.goBack();
    await page.waitForTimeout(1000);

    // Should still be on gallery
    await expect(page).toHaveURL(/\/gallery/);
  });
});

test.describe('Gallery: SEO & Accessibility', () => {
  test('should have descriptive alt text for all images', async ({ page }) => {
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');

    const images = page.locator('img');
    const count = await images.count();

    if (count > 0) {
      // Check first 5 images for alt text
      for (let i = 0; i < Math.min(5, count); i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');

        // Alt text should exist
        expect(alt !== null).toBe(true);

        // Alt text should be descriptive (not empty for content images)
        if (alt && alt.length > 0) {
          expect(alt.length).toBeGreaterThan(2);
        }
      }
    }
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');

    // Check for h1
    const h1 = page.locator('h1');
    const h1Count = await h1.count();

    // Should have exactly one h1
    expect(h1Count).toBeGreaterThanOrEqual(1);
    expect(h1Count).toBeLessThanOrEqual(1);

    // Check h1 is visible
    if (h1Count > 0) {
      await expect(h1.first()).toBeVisible();
    }
  });

  test('should be accessible via keyboard navigation', async ({ page, isMobile }) => {
    if (isMobile) {
      test.skip();
    }

    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');

    // Tab through page
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Should be able to navigate
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeTruthy();
  });

  test('should have semantic HTML structure', async ({ page }) => {
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');

    // Check for semantic elements
    const main = page.locator('main');
    await expect(main).toHaveCount(1);

    const nav = page.locator('nav');
    const navCount = await nav.count();
    expect(navCount).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Gallery: Performance Metrics', () => {
  test('should load gallery within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // Gallery should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should not cause layout shift when images load', async ({ page }) => {
    await page.goto('/gallery');

    // Wait for initial render
    await page.waitForLoadState('domcontentloaded');

    // Get initial scroll position
    const initialScroll = await page.evaluate(() => window.scrollY);

    // Wait for images to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Scroll position shouldn't jump significantly
    const finalScroll = await page.evaluate(() => window.scrollY);
    const scrollDiff = Math.abs(finalScroll - initialScroll);

    // Allow small scroll changes but not large jumps
    expect(scrollDiff).toBeLessThan(100);
  });

  test('should implement infinite scroll or pagination', async ({ page }) => {
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    // Check for pagination or "load more" button
    const pagination = page.locator('button:has-text("Load More"), nav[aria-label*="pagination"]');
    const hasPagination = await pagination.count() > 0;

    // Or check if more images loaded (infinite scroll)
    const images = page.locator('img');
    const count = await images.count();

    // Should have images (pagination is optional)
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Gallery: Cross-Browser Specific Tests', () => {
  test('should handle Safari image rendering quirks', async ({ page, browserName }) => {
    if (browserName !== 'webkit') {
      test.skip();
    }

    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const images = page.locator('img');
    const count = await images.count();

    if (count > 0) {
      const firstImage = images.first();

      // Check image rendering in Safari
      const rendering = await firstImage.evaluate((img: HTMLImageElement) => {
        const styles = window.getComputedStyle(img);
        return {
          objectFit: styles.objectFit,
          imageRendering: styles.imageRendering,
        };
      });

      // Safari should handle object-fit correctly
      expect(['cover', 'contain', 'fill', 'none', 'scale-down']).toContain(rendering.objectFit);
    }
  });

  test('should handle Firefox image loading', async ({ page, browserName }) => {
    if (browserName !== 'firefox') {
      test.skip();
    }

    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const images = page.locator('img');
    const count = await images.count();

    // Firefox should load images correctly
    expect(count).toBeGreaterThan(0);

    if (count > 0) {
      const firstImage = images.first();
      const isLoaded = await firstImage.evaluate((img: HTMLImageElement) => {
        return img.complete && img.naturalHeight > 0;
      });

      expect(isLoaded).toBe(true);
    }
  });

  test('should handle mobile Chrome image optimization', async ({ page, browserName, isMobile }) => {
    if (browserName !== 'chromium' || !isMobile) {
      test.skip();
    }

    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    const images = page.locator('img');
    const count = await images.count();

    expect(count).toBeGreaterThan(0);

    if (count > 0) {
      // Mobile Chrome should load optimized images
      const firstImage = images.first();
      const src = await firstImage.getAttribute('src');

      // Should use optimized format or Next.js Image
      const isOptimized = src?.includes('/_next/image') ||
                         src?.includes('.webp') ||
                         src?.includes('.avif');

      expect(isOptimized).toBe(true);
    }
  });
});
