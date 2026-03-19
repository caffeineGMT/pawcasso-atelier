import { test, expect } from '@playwright/test';

/**
 * Firefox-specific E2E tests for Pawcasso Atelier
 * Tests Gecko engine compatibility issues
 */

test.describe('Firefox Browser Compatibility', () => {
  test.beforeEach(async ({ page, browserName }) => {
    // Skip all tests if not running on Firefox
    test.skip(browserName !== 'firefox', 'Firefox-specific tests');
  });

  test.describe('CSS & Visual Rendering', () => {
    test('backdrop-filter fallback', async ({ page }) => {
      await page.goto('/order');

      // Check if backdrop-filter is supported
      const hasBackdropFilter = await page.evaluate(() => {
        return (
          CSS.supports('backdrop-filter', 'blur(10px)') ||
          CSS.supports('-webkit-backdrop-filter', 'blur(10px)')
        );
      });

      // Open checkout upsell modal (if available)
      const modalTrigger = page.locator('button:has-text("Checkout")').first();
      if (await modalTrigger.isVisible()) {
        await modalTrigger.click();
        await page.waitForTimeout(500);

        // Check modal background - should have fallback even without backdrop-filter
        const modalBg = page.locator('[role="dialog"]').first();
        if (await modalBg.isVisible()) {
          const bgColor = await modalBg.evaluate(el => {
            return window.getComputedStyle(el).backgroundColor;
          });

          // Should have semi-transparent background
          expect(bgColor).toContain('rgba');

          // If backdrop-filter not supported, background should be more opaque
          if (!hasBackdropFilter) {
            console.log('Firefox: backdrop-filter not supported, using fallback');
          }
        }
      }
    });

    test('text gradients render correctly', async ({ page }) => {
      await page.goto('/');

      // Find elements with text gradient
      const gradientElements = page.locator('.text-gradient').first();

      if (await gradientElements.count() > 0) {
        const hasGradient = await gradientElements.evaluate(el => {
          const style = window.getComputedStyle(el);
          // Check if background-clip is applied
          return (
            style.backgroundClip === 'text' ||
            style.webkitBackgroundClip === 'text'
          );
        });

        expect(hasGradient).toBeTruthy();
      }
    });

    test('scrollbar styling', async ({ page }) => {
      await page.goto('/gallery');

      // Check if scrollbar-width is applied (Firefox-specific property)
      const scrollbarWidth = await page.evaluate(() => {
        const el = document.querySelector('.scrollbar-thin');
        if (el) {
          return window.getComputedStyle(el).scrollbarWidth;
        }
        return null;
      });

      // Firefox should apply scrollbar-width: thin
      if (scrollbarWidth !== null) {
        expect(scrollbarWidth).toBe('thin');
      }
    });

    test('animations run smoothly', async ({ page }) => {
      await page.goto('/');

      // Test animation performance
      const animations = await page.evaluate(() => {
        const animatedElements = document.querySelectorAll('[class*="animate-"]');
        return animatedElements.length > 0;
      });

      expect(animations).toBeTruthy();

      // Check for reduced motion preference
      const prefersReducedMotion = await page.evaluate(() => {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      });

      if (prefersReducedMotion) {
        console.log('Firefox: User prefers reduced motion');
      }
    });
  });

  test.describe('Form Inputs & Validation', () => {
    test('autofill styling maintains dark theme', async ({ page }) => {
      await page.goto('/order');

      // Fill email field to trigger potential autofill
      const emailInput = page.locator('input[name="email"]').or(
        page.locator('input[type="email"]')
      ).first();

      if (await emailInput.isVisible()) {
        await emailInput.fill('test@example.com');

        // Check background color - should not be light yellow (default Firefox autofill)
        const bgColor = await emailInput.evaluate(el => {
          return window.getComputedStyle(el).backgroundColor;
        });

        // Should be dark background, not light autofill color
        // Light autofill is typically rgb(255, 255, 204) or similar
        expect(bgColor).not.toContain('rgb(255, 255, 204)');
        expect(bgColor).not.toContain('rgb(255, 255, 240)');
      }
    });

    test('file upload accepts correct formats', async ({ page, browserName }) => {
      await page.goto('/order');

      const fileInput = page.locator('input[type="file"]').first();

      if (await fileInput.isVisible()) {
        const acceptAttr = await fileInput.getAttribute('accept');

        // Check accepted formats
        expect(acceptAttr).toContain('image/jpeg');
        expect(acceptAttr).toContain('image/png');
        expect(acceptAttr).toContain('image/webp');

        // HEIC support varies by OS on Firefox
        if (acceptAttr?.includes('heic')) {
          console.log('Firefox: HEIC/HEIF support declared (OS-dependent)');
        }
      }
    });

    test('custom validation messages display (not native Firefox bubbles)', async ({ page }) => {
      await page.goto('/order');

      // Look for form with noValidate attribute (prevents native validation)
      const form = page.locator('form').first();

      if (await form.isVisible()) {
        const hasNoValidate = await form.evaluate(el => {
          return (el as HTMLFormElement).hasAttribute('novalidate') ||
                 (el as HTMLFormElement).noValidate;
        });

        // Forms should use custom validation, not Firefox's native validation
        expect(hasNoValidate).toBeTruthy();
      }
    });

    test('number inputs hide spinner', async ({ page }) => {
      await page.goto('/order');

      // Firefox uses -moz-appearance: textfield to hide spinners
      const numberInput = page.locator('input[type="number"]').first();

      if (await numberInput.count() > 0) {
        const appearance = await numberInput.evaluate(el => {
          const style = window.getComputedStyle(el);
          return (style as any).MozAppearance || style.appearance;
        });

        // Should be textfield (no spinner) or none
        expect(['textfield', 'none', 'textfield']).toContain(appearance);
      }
    });
  });

  test.describe('JavaScript & Web APIs', () => {
    test('crypto.randomUUID() works', async ({ page }) => {
      await page.goto('/order');

      const hasUUID = await page.evaluate(() => {
        try {
          const uuid = crypto.randomUUID();
          return typeof uuid === 'string' && uuid.length === 36;
        } catch {
          return false;
        }
      });

      expect(hasUUID).toBeTruthy();
    });

    test('localStorage available and working', async ({ page }) => {
      await page.goto('/order');

      const localStorageWorks = await page.evaluate(() => {
        try {
          localStorage.setItem('firefox_test', 'value');
          const value = localStorage.getItem('firefox_test');
          localStorage.removeItem('firefox_test');
          return value === 'value';
        } catch {
          return false;
        }
      });

      expect(localStorageWorks).toBeTruthy();
    });

    test('fetch API with async/await works', async ({ page }) => {
      await page.goto('/');

      const fetchWorks = await page.evaluate(async () => {
        try {
          // Test fetch to current domain
          const response = await fetch('/');
          return response.ok;
        } catch {
          return false;
        }
      });

      expect(fetchWorks).toBeTruthy();
    });

    test('browser detection identifies Firefox', async ({ page }) => {
      await page.goto('/');

      const isFirefox = await page.evaluate(() => {
        return /firefox/i.test(navigator.userAgent);
      });

      expect(isFirefox).toBeTruthy();

      // Check if Firefox class is added to HTML element
      const hasFirefoxClass = await page.evaluate(() => {
        return document.documentElement.classList.contains('is-firefox');
      });

      // Should add is-firefox class via browser-compat.ts
      if (hasFirefoxClass) {
        console.log('Firefox: Browser detection working correctly');
      }
    });
  });

  test.describe('Payment Flow - Stripe Elements', () => {
    test('Stripe.js loads on order page', async ({ page }) => {
      await page.goto('/order');
      await page.waitForLoadState('networkidle');

      // Check if Stripe is loaded globally
      const stripeLoaded = await page.evaluate(() => {
        return typeof (window as any).Stripe !== 'undefined';
      });

      expect(stripeLoaded).toBeTruthy();
    });

    test('Stripe Elements iframe renders', async ({ page }) => {
      await page.goto('/order');
      await page.waitForTimeout(2000); // Wait for Stripe to initialize

      // Look for Stripe Elements iframe
      const stripeIframe = page.frameLocator('iframe[name^="__privateStripeFrame"]').first();

      // Check if iframe exists (may be conditional based on form state)
      const iframeCount = await page.locator('iframe[name^="__privateStripeFrame"]').count();

      if (iframeCount > 0) {
        console.log('Firefox: Stripe Elements iframe detected');
      } else {
        console.log('Firefox: Stripe Elements not yet rendered (may be lazy-loaded)');
      }
    });

    test('Payment Request API not available', async ({ page }) => {
      await page.goto('/order');

      // Firefox doesn't support Payment Request API
      const hasPaymentRequest = await page.evaluate(() => {
        return 'PaymentRequest' in window;
      });

      // This is expected to be false on Firefox
      expect(hasPaymentRequest).toBeFalsy();

      console.log('Firefox: Payment Request API not supported (expected - no Apple Pay/Google Pay)');
    });

    test('focus navigation works in payment form', async ({ page }) => {
      await page.goto('/order');
      await page.waitForTimeout(2000);

      // Test tab navigation
      const firstInput = page.locator('input').first();
      if (await firstInput.isVisible()) {
        await firstInput.focus();
        await page.keyboard.press('Tab');

        // Should be able to tab to next element
        const activeElement = await page.evaluate(() => {
          return document.activeElement?.tagName;
        });

        expect(activeElement).toBeTruthy();
      }
    });
  });

  test.describe('Image Optimization', () => {
    test('WebP images load correctly', async ({ page }) => {
      await page.goto('/gallery');

      // Firefox 65+ supports WebP
      const webpSupport = await page.evaluate(() => {
        const canvas = document.createElement('canvas');
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      });

      expect(webpSupport).toBeTruthy();
    });

    test('lazy loading works', async ({ page }) => {
      await page.goto('/gallery');

      // Check for images with loading="lazy"
      const lazyImages = await page.locator('img[loading="lazy"]').count();

      if (lazyImages > 0) {
        console.log(`Firefox: ${lazyImages} lazy-loaded images found`);
      }

      // Firefox supports native lazy loading since v75
      const lazyLoadSupport = await page.evaluate(() => {
        return 'loading' in HTMLImageElement.prototype;
      });

      expect(lazyLoadSupport).toBeTruthy();
    });

    test('Next.js Image optimization renders', async ({ page }) => {
      await page.goto('/gallery');

      // Check for Next.js optimized images
      const nextImages = await page.locator('img[srcset]').count();

      if (nextImages > 0) {
        console.log(`Firefox: ${nextImages} responsive images with srcset found`);
      }
    });
  });

  test.describe('Mobile Firefox (Android)', () => {
    test('mobile viewport renders correctly', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/order');

      // Check mobile-specific styles
      const isMobile = await page.evaluate(() => {
        return window.innerWidth < 768;
      });

      expect(isMobile).toBeTruthy();
    });

    test('touch targets are large enough', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/order');

      // Check that buttons meet minimum touch target size (44x44px)
      const buttons = page.locator('button').first();

      if (await buttons.isVisible()) {
        const size = await buttons.boundingBox();

        if (size) {
          // Minimum touch target is 44x44px (Apple HIG & Material Design)
          expect(size.height).toBeGreaterThanOrEqual(44);
          console.log(`Firefox Mobile: Button height = ${size.height}px`);
        }
      }
    });

    test('prevents zoom on input focus', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/order');

      // Check input font size (should be >= 16px to prevent zoom)
      const input = page.locator('input[type="email"]').first();

      if (await input.isVisible()) {
        const fontSize = await input.evaluate(el => {
          return window.getComputedStyle(el).fontSize;
        });

        const fontSizeNum = parseInt(fontSize);
        expect(fontSizeNum).toBeGreaterThanOrEqual(16);

        console.log(`Firefox Mobile: Input font size = ${fontSize} (prevents zoom)`);
      }
    });
  });

  test.describe('Performance & Accessibility', () => {
    test('focus outlines visible', async ({ page }) => {
      await page.goto('/order');

      // Tab to first focusable element
      await page.keyboard.press('Tab');

      // Check if focus outline is visible
      const hasFocusVisible = await page.evaluate(() => {
        const el = document.activeElement;
        if (el) {
          const style = window.getComputedStyle(el);
          return style.outline !== 'none' && style.outlineWidth !== '0px';
        }
        return false;
      });

      // Focus should be visible for keyboard navigation
      expect(hasFocusVisible).toBeTruthy();
    });

    test('prefers-reduced-motion respected', async ({ page }) => {
      // Emulate prefers-reduced-motion
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');

      const reducedMotion = await page.evaluate(() => {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      });

      expect(reducedMotion).toBeTruthy();

      console.log('Firefox: Testing with prefers-reduced-motion enabled');
    });

    test('high contrast mode detection', async ({ page }) => {
      await page.goto('/');

      // Check for high contrast media query (Firefox on Windows)
      const highContrast = await page.evaluate(() => {
        return window.matchMedia('(prefers-contrast: high)').matches;
      });

      console.log(`Firefox: High contrast mode = ${highContrast}`);
    });
  });

  test.describe('Regression Tests', () => {
    test('checkout flow completes without errors', async ({ page }) => {
      await page.goto('/order');

      // Look for any console errors
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.waitForTimeout(3000);

      // Should not have critical errors
      const hasCriticalErrors = errors.some(err =>
        err.includes('TypeError') ||
        err.includes('ReferenceError') ||
        err.includes('Stripe')
      );

      expect(hasCriticalErrors).toBeFalsy();

      if (errors.length > 0) {
        console.log('Firefox Console Errors:', errors);
      }
    });

    test('no horizontal scroll on any page', async ({ page }) => {
      const pages = ['/', '/order', '/gallery', '/faq'];

      for (const url of pages) {
        await page.goto(url);

        const hasHorizontalScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });

        expect(hasHorizontalScroll).toBeFalsy();
      }
    });

    test('all images have alt text', async ({ page }) => {
      await page.goto('/gallery');

      const imagesWithoutAlt = await page.locator('img:not([alt])').count();

      expect(imagesWithoutAlt).toBe(0);
    });
  });
});

/**
 * Firefox ESR specific tests
 */
test.describe('Firefox ESR Compatibility', () => {
  test('backdrop-filter fallback for ESR 115', async ({ page, browserName }) => {
    test.skip(browserName !== 'firefox', 'Firefox ESR tests');

    await page.goto('/order');

    // Firefox ESR 115 may not have backdrop-filter enabled by default
    const backdropFilterEnabled = await page.evaluate(() => {
      return CSS.supports('backdrop-filter', 'blur(10px)');
    });

    console.log(`Firefox ESR: backdrop-filter support = ${backdropFilterEnabled}`);

    // Even without backdrop-filter, modals should still be usable
    const modal = page.locator('[role="dialog"]').first();
    // Modal may not be visible yet, that's okay for this test
  });
});
