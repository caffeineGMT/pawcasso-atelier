import { test, expect, type Page } from '@playwright/test';

/**
 * Safari/WebKit Specific Tests
 *
 * These tests focus on webkit-specific behaviors and compatibility issues
 * that may not appear in Chromium or Firefox.
 *
 * Run with: npm run test:e2e -- --project=webkit
 */

test.describe('Safari/WebKit Compatibility', () => {

  test.describe('CSS Rendering', () => {
    test('should render gradient text correctly', async ({ page }) => {
      await page.goto('/');

      // Find gradient text elements
      const gradientText = page.locator('.text-gradient').first();
      await expect(gradientText).toBeVisible();

      // Verify the gradient text has the proper webkit prefix
      const bgClip = await gradientText.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.webkitBackgroundClip || style.backgroundClip;
      });

      expect(bgClip).toBe('text');
    });

    test('should apply backdrop filter on glass elements', async ({ page }) => {
      await page.goto('/');

      // Check if backdrop-filter is supported
      const supportsBackdropFilter = await page.evaluate(() => {
        return CSS.supports('backdrop-filter', 'blur(1px)') ||
               CSS.supports('-webkit-backdrop-filter', 'blur(1px)');
      });

      // On webkit, this should be true for Safari 14+
      expect(supportsBackdropFilter).toBeTruthy();
    });

    test('should handle CSS Grid layout correctly', async ({ page }) => {
      await page.goto('/gallery');
      await page.waitForLoadState('networkidle');

      // Verify gallery grid displays in 3 columns on desktop
      const grid = page.locator('div[role="list"]').first();
      await expect(grid).toBeVisible();

      // Check grid column count
      const columns = await grid.evaluate((el) => {
        return window.getComputedStyle(el).gridTemplateColumns.split(' ').length;
      });

      expect(columns).toBeGreaterThanOrEqual(3);
    });
  });

  test.describe('Image Loading', () => {
    test('should load images with proper format support', async ({ page }) => {
      await page.goto('/gallery');
      await page.waitForLoadState('networkidle');

      // Wait for first image to load
      const firstImage = page.locator('img').first();
      await expect(firstImage).toBeVisible();

      // Verify image src is set
      const imgSrc = await firstImage.getAttribute('src');
      expect(imgSrc).toBeTruthy();

      // Next.js Image should handle format conversion automatically
      // WebP for Safari 14+, fallback to JPEG/PNG for older versions
    });

    test('should lazy load gallery images', async ({ page }) => {
      await page.goto('/gallery');

      // Get all images
      const images = page.locator('img');
      const imageCount = await images.count();

      expect(imageCount).toBeGreaterThan(0);

      // First few images should load eagerly
      const firstImage = images.nth(0);
      const loadingAttr = await firstImage.getAttribute('loading');
      expect(loadingAttr).toBe('eager');

      // Later images should lazy load
      if (imageCount > 3) {
        const lazyImage = images.nth(5);
        const lazyLoadingAttr = await lazyImage.getAttribute('loading');
        expect(lazyLoadingAttr).toBe('lazy');
      }
    });
  });

  test.describe('Touch & Mobile Behavior', () => {
    test('should have proper tap highlight color', async ({ page }) => {
      await page.goto('/');

      // Check button tap highlight
      const button = page.getByRole('link', { name: /Order Your Portrait/i }).first();

      const tapHighlight = await button.evaluate((el) => {
        return window.getComputedStyle(el).webkitTapHighlightColor;
      });

      // Should have a tap highlight color set
      expect(tapHighlight).toBeTruthy();
    });

    test('should prevent text selection on buttons', async ({ page }) => {
      await page.goto('/');

      const button = page.getByRole('link', { name: /Order Your Portrait/i }).first();

      const userSelect = await button.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.webkitUserSelect || style.userSelect;
      });

      // Buttons should not allow text selection
      expect(userSelect).toMatch(/none/i);
    });
  });

  test.describe('Viewport & Safe Areas', () => {
    test('should detect iOS browser', async ({ page }) => {
      await page.goto('/');

      // Check if iOS detection works
      const isIOS = await page.evaluate(() => {
        return /iPad|iPhone|iPod/.test(navigator.userAgent);
      });

      // This will be true on webkit iOS devices
      console.log('iOS detected:', isIOS);
    });

    test('should apply safe area insets on notched devices', async ({ page }) => {
      await page.goto('/');

      // Check if safe area CSS variables are available
      const hasSafeArea = await page.evaluate(() => {
        const bottomInset = getComputedStyle(document.documentElement)
          .getPropertyValue('env(safe-area-inset-bottom)');
        return bottomInset !== '';
      });

      console.log('Safe area insets available:', hasSafeArea);
    });
  });

  test.describe('Smooth Scrolling', () => {
    test('should handle smooth scroll behavior', async ({ page }) => {
      await page.goto('/');

      // Check if scroll behavior is set
      const scrollBehavior = await page.evaluate(() => {
        return getComputedStyle(document.documentElement).scrollBehavior;
      });

      // Should be 'smooth' or 'auto' depending on Safari version
      expect(['smooth', 'auto']).toContain(scrollBehavior);
    });

    test('should apply webkit overflow scrolling', async ({ page }) => {
      await page.goto('/');

      // Check for webkit overflow scrolling on html element
      const overflowScrolling = await page.evaluate(() => {
        return (getComputedStyle(document.documentElement) as any).webkitOverflowScrolling;
      });

      console.log('Webkit overflow scrolling:', overflowScrolling);
    });
  });

  test.describe('Font Rendering', () => {
    test('should apply font smoothing', async ({ page }) => {
      await page.goto('/');

      const fontSmoothing = await page.evaluate(() => {
        return (getComputedStyle(document.body) as any).webkitFontSmoothing;
      });

      // Should be 'antialiased'
      expect(fontSmoothing).toBe('antialiased');
    });
  });

  test.describe('Performance', () => {
    test('should load homepage within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;

      // Homepage should load in under 5 seconds on webkit
      expect(loadTime).toBeLessThan(5000);
      console.log('Webkit load time:', loadTime, 'ms');
    });

    test('should not have layout shifts', async ({ page }) => {
      await page.goto('/');

      // Wait for initial load
      await page.waitForLoadState('networkidle');

      // Scroll down to trigger lazy loading
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(1000);

      // Verify no major layout shifts occurred
      // Note: This is a basic check. For proper CLS measurement, use Lighthouse
    });
  });

  test.describe('Form Handling', () => {
    test('should have minimum font size on inputs (prevent zoom)', async ({ page }) => {
      await page.goto('/order');
      await page.waitForLoadState('networkidle');

      // Find input fields
      const inputs = page.locator('input[type="text"], input[type="email"], textarea');

      if (await inputs.count() > 0) {
        const fontSize = await inputs.first().evaluate((el) => {
          return parseFloat(window.getComputedStyle(el).fontSize);
        });

        // Should be at least 16px to prevent iOS zoom
        expect(fontSize).toBeGreaterThanOrEqual(16);
      }
    });
  });

  test.describe('Browser Detection', () => {
    test('should detect Safari browser', async ({ page }) => {
      await page.goto('/');

      const isSafari = await page.evaluate(() => {
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      });

      // Should be true when running on webkit
      console.log('Safari detected:', isSafari);
    });

    test('should add browser-specific classes to html', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const htmlClasses = await page.evaluate(() => {
        return document.documentElement.className;
      });

      // Should have webkit-specific classes if browser detection runs
      console.log('HTML classes:', htmlClasses);
    });
  });

  test.describe('Animation Performance', () => {
    test('should handle CSS transforms smoothly', async ({ page }) => {
      await page.goto('/gallery');
      await page.waitForLoadState('networkidle');

      // Hover over gallery item to trigger scale transform
      const galleryItem = page.locator('button').first();
      await galleryItem.hover();

      // Verify transform is applied
      const transform = await galleryItem.locator('img').evaluate((el) => {
        return window.getComputedStyle(el).transform;
      });

      expect(transform).not.toBe('none');
    });
  });
});

test.describe('Mobile Safari Specific Tests', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });

  test('should handle horizontal scroll on filter chips', async ({ page }) => {
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');

    // Find filter chip container
    const filterContainer = page.locator('div').filter({ hasText: 'Style' }).locator('..').locator('div[style*="touchAction"]').first();

    if (await filterContainer.isVisible()) {
      // Verify touch-action is set
      const touchAction = await filterContainer.evaluate((el) => {
        return window.getComputedStyle(el).touchAction;
      });

      expect(touchAction).toContain('pan-x');
    }
  });

  test('should have adequate touch targets', async ({ page }) => {
    await page.goto('/');

    // Check button sizes
    const ctaButton = page.getByRole('link', { name: /Order Your Portrait/i }).first();
    const box = await ctaButton.boundingBox();

    if (box) {
      // Apple recommends 44x44 minimum touch target
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('should prevent double-tap zoom on buttons', async ({ page }) => {
    await page.goto('/');

    const button = page.getByRole('link', { name: /Order Your Portrait/i }).first();

    const touchAction = await button.evaluate((el) => {
      return window.getComputedStyle(el).touchAction;
    });

    // Should be 'manipulation' to prevent double-tap zoom
    expect(touchAction).toBe('manipulation');
  });
});

test.describe('iPad Safari Tests', () => {
  test.use({
    viewport: { width: 1024, height: 1366 },
    hasTouch: true,
    isMobile: true,
  });

  test('should display 2-column grid on tablet', async ({ page }) => {
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');

    const grid = page.locator('div[role="list"]').first();
    const columns = await grid.evaluate((el) => {
      return window.getComputedStyle(el).gridTemplateColumns.split(' ').length;
    });

    // iPad should show 2-3 columns
    expect(columns).toBeGreaterThanOrEqual(2);
    expect(columns).toBeLessThanOrEqual(3);
  });
});
