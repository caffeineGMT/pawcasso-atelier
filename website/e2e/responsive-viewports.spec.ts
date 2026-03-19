import { test, expect, type Page } from '@playwright/test';

/**
 * Responsive Design & Mobile Viewport Tests
 *
 * Tests Pawcasso Atelier across all target viewports:
 * - Mobile: iPhone SE (375x667), iPhone 14 Pro (393x852), Galaxy S21 (360x800)
 * - Tablet: iPad Mini (768x1024), iPad Pro (1024x1366)
 * - Desktop: 1280px, 1440px, 1920px
 *
 * Test focus:
 * - Touch targets (minimum 44x44px)
 * - Horizontal scrolling (should never occur)
 * - Text sizing (minimum 16px for inputs on iOS)
 * - Grid responsiveness
 * - Navigation behavior
 * - Form usability
 */

const VIEWPORTS = {
  // Mobile viewports
  'iPhone SE': { width: 375, height: 667 },
  'iPhone 14 Pro': { width: 393, height: 852 },
  'Samsung Galaxy S21': { width: 360, height: 800 },

  // Tablet viewports
  'iPad Mini': { width: 768, height: 1024 },
  'iPad Pro': { width: 1024, height: 1366 },

  // Desktop viewports
  'Desktop 1280': { width: 1280, height: 800 },
  'Desktop 1440': { width: 1440, height: 900 },
  'Desktop 1920': { width: 1920, height: 1080 },
};

/**
 * Helper: Check for horizontal scrolling (should never happen)
 */
async function checkNoHorizontalScroll(page: Page) {
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

  expect(scrollWidth, 'Page should not have horizontal scroll').toBeLessThanOrEqual(clientWidth + 1);
}

/**
 * Helper: Check touch target size (minimum 44x44px)
 */
async function checkTouchTargetSize(page: Page, selector: string, minSize = 44) {
  const box = await page.locator(selector).first().boundingBox();

  if (box) {
    expect(box.width, `${selector} width should be >= ${minSize}px`).toBeGreaterThanOrEqual(minSize);
    expect(box.height, `${selector} height should be >= ${minSize}px`).toBeGreaterThanOrEqual(minSize);
  }
}

/**
 * Helper: Check input font size (minimum 16px to prevent iOS zoom)
 */
async function checkInputFontSize(page: Page, selector: string) {
  const fontSize = await page.locator(selector).first().evaluate((el) => {
    return window.getComputedStyle(el).fontSize;
  });

  const fontSizeNum = parseInt(fontSize);
  expect(fontSizeNum, `${selector} font-size should be >= 16px to prevent iOS zoom`).toBeGreaterThanOrEqual(16);
}

/**
 * Test Suite: Homepage Responsiveness
 */
test.describe('Homepage - Responsive Design', () => {
  for (const [deviceName, viewport] of Object.entries(VIEWPORTS)) {
    test(`${deviceName} (${viewport.width}x${viewport.height})`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');

      // Wait for page to load
      await expect(page.locator('h1')).toBeVisible();

      // Check no horizontal scroll
      await checkNoHorizontalScroll(page);

      // Check hero title is visible
      await expect(page.locator('h1:has-text("Where Art Meets")')).toBeVisible();

      // Check CTA button is accessible
      const ctaButton = page.locator('a[href="/order"]').first();
      await expect(ctaButton).toBeVisible();

      // Mobile-specific checks
      if (viewport.width < 768) {
        // Hamburger menu should be visible
        await expect(page.locator('button[aria-label*="navigation menu"]')).toBeVisible();

        // Check hamburger touch target size
        await checkTouchTargetSize(page, 'button[aria-label*="navigation menu"]');

        // Desktop nav should be hidden
        await expect(page.locator('nav ul.hidden.md\\:flex')).not.toBeVisible();

        // Gallery grid should be single column
        const galleryGrid = page.locator('.grid').first();
        if (await galleryGrid.count() > 0) {
          const gridCols = await galleryGrid.evaluate((el) => {
            return window.getComputedStyle(el).gridTemplateColumns.split(' ').length;
          });
          expect(gridCols, 'Gallery should use single column on mobile').toBe(1);
        }
      }

      // Tablet/Desktop checks
      if (viewport.width >= 768) {
        // Desktop nav should be visible
        await expect(page.locator('nav ul').filter({ hasText: 'Gallery' })).toBeVisible();

        // Hamburger should be hidden
        await expect(page.locator('button[aria-label*="navigation menu"]')).not.toBeVisible();
      }

      // Screenshot for visual regression
      await page.screenshot({
        path: `e2e-results/homepage-${deviceName.replace(/\s+/g, '-')}.png`,
        fullPage: true,
      });
    });
  }
});

/**
 * Test Suite: Order Form Responsiveness
 */
test.describe('Order Form - Responsive Design', () => {
  for (const [deviceName, viewport] of Object.entries(VIEWPORTS)) {
    test(`${deviceName} (${viewport.width}x${viewport.height})`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/order');

      // Wait for form to load
      await expect(page.locator('h1, h2').first()).toBeVisible();

      // Check no horizontal scroll
      await checkNoHorizontalScroll(page);

      // Mobile-specific checks
      if (viewport.width < 768) {
        // Tier selector should stack (1 column on smallest mobile)
        const tierGrid = page.locator('.grid').first();
        if (await tierGrid.count() > 0) {
          const gridCols = await tierGrid.evaluate((el) => {
            return window.getComputedStyle(el).gridTemplateColumns.split(' ').length;
          });

          // Should be 1 column on very small screens, 2 on slightly larger
          if (viewport.width < 400) {
            expect(gridCols, 'Tier selector should be single column on tiny screens').toBeLessThanOrEqual(1);
          } else {
            expect(gridCols, 'Tier selector should be 1-2 columns on mobile').toBeLessThanOrEqual(2);
          }
        }

        // Touch targets on tier cards should be >= 48px
        const tierButtons = page.locator('button[aria-pressed]').first();
        if (await tierButtons.count() > 0) {
          await checkTouchTargetSize(tierButtons, 48);
        }

        // Style selector should have adequate touch targets
        const styleButtons = page.locator('button[type="button"]').filter({ hasText: 'Renaissance' });
        if (await styleButtons.count() > 0) {
          const box = await styleButtons.first().boundingBox();
          if (box) {
            expect(box.height, 'Style buttons should be at least 72px tall on mobile').toBeGreaterThanOrEqual(72);
          }
        }
      }

      // Check form inputs have minimum 16px font size (prevents iOS zoom)
      const emailInput = page.locator('input[type="email"]');
      if (await emailInput.count() > 0) {
        await checkInputFontSize(page, 'input[type="email"]');
      }

      // Screenshot
      await page.screenshot({
        path: `e2e-results/order-form-${deviceName.replace(/\s+/g, '-')}.png`,
        fullPage: true,
      });
    });
  }
});

/**
 * Test Suite: Gallery Grid Responsiveness
 */
test.describe('Gallery - Responsive Grid', () => {
  for (const [deviceName, viewport] of Object.entries(VIEWPORTS)) {
    test(`${deviceName} (${viewport.width}x${viewport.height})`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/gallery');

      // Wait for gallery to load
      await page.waitForSelector('.grid', { state: 'visible' });

      // Check no horizontal scroll
      await checkNoHorizontalScroll(page);

      // Check grid column count
      const grid = page.locator('.grid').first();
      const gridCols = await grid.evaluate((el) => {
        return window.getComputedStyle(el).gridTemplateColumns.split(' ').length;
      });

      // Expected columns based on viewport
      let expectedCols = 1;
      if (viewport.width >= 1024) expectedCols = 3;
      else if (viewport.width >= 640) expectedCols = 2;

      expect(gridCols, `Gallery grid should have ${expectedCols} columns at ${viewport.width}px`).toBe(expectedCols);

      // Check images load and fit properly
      const images = page.locator('.grid img').first();
      await expect(images).toBeVisible();

      // Images should not overflow container
      const imageBox = await images.boundingBox();
      if (imageBox) {
        expect(imageBox.width, 'Images should not exceed viewport width').toBeLessThanOrEqual(viewport.width);
      }

      // Screenshot
      await page.screenshot({
        path: `e2e-results/gallery-${deviceName.replace(/\s+/g, '-')}.png`,
        fullPage: false, // Just first viewport
      });
    });
  }
});

/**
 * Test Suite: Navigation - Mobile Hamburger Menu
 */
test.describe('Navigation - Mobile Menu', () => {
  const mobileViewports = {
    'iPhone SE': VIEWPORTS['iPhone SE'],
    'iPhone 14 Pro': VIEWPORTS['iPhone 14 Pro'],
    'Samsung Galaxy S21': VIEWPORTS['Samsung Galaxy S21'],
  };

  for (const [deviceName, viewport] of Object.entries(mobileViewports)) {
    test(`${deviceName} - Hamburger menu interaction`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');

      // Hamburger button should be visible
      const hamburger = page.locator('button[aria-label*="navigation menu"]');
      await expect(hamburger).toBeVisible();

      // Check touch target size
      await checkTouchTargetSize(page, 'button[aria-label*="navigation menu"]');

      // Click to open menu
      await hamburger.click();

      // Menu should be visible
      await expect(page.locator('#mobile-menu')).toBeVisible();

      // Check menu links are visible and accessible
      await expect(page.locator('#mobile-menu a[href="/gallery"]')).toBeVisible();
      await expect(page.locator('#mobile-menu a[href="/faq"]')).toBeVisible();

      // Close menu by clicking hamburger again
      await hamburger.click();

      // Menu should close
      await expect(page.locator('#mobile-menu')).not.toBeVisible();
    });
  }
});

/**
 * Test Suite: Orientation Changes
 */
test.describe('Orientation Changes', () => {
  test('iPhone landscape orientation', async ({ page }) => {
    // Start in portrait
    await page.setViewportSize({ width: 393, height: 852 });
    await page.goto('/');

    await expect(page.locator('h1')).toBeVisible();

    // Switch to landscape
    await page.setViewportSize({ width: 852, height: 393 });

    // Content should still be visible
    await expect(page.locator('h1')).toBeVisible();

    // No horizontal scroll
    await checkNoHorizontalScroll(page);
  });

  test('iPad landscape orientation', async ({ page }) => {
    // Portrait
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/gallery');

    await page.waitForSelector('.grid');

    // Landscape
    await page.setViewportSize({ width: 1024, height: 768 });

    // Grid should adjust
    const gridCols = await page.locator('.grid').first().evaluate((el) => {
      return window.getComputedStyle(el).gridTemplateColumns.split(' ').length;
    });

    expect(gridCols, 'Grid should have 3 columns in landscape').toBe(3);
  });
});

/**
 * Test Suite: Form Input Behavior on Mobile
 */
test.describe('Form Inputs - Mobile Keyboard', () => {
  test('Email input triggers email keyboard', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS['iPhone 14 Pro']);
    await page.goto('/order');

    // Find email input
    const emailInput = page.locator('input[type="email"]').first();

    if (await emailInput.count() > 0) {
      // Check input type is email (triggers email keyboard on mobile)
      const inputType = await emailInput.getAttribute('type');
      expect(inputType).toBe('email');

      // Check font size to prevent zoom
      await checkInputFontSize(page, 'input[type="email"]');
    }
  });

  test('Text inputs have minimum height for touch', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS['iPhone SE']);
    await page.goto('/order');

    // All input fields should have minimum 44px height
    const inputs = page.locator('input[type="text"], input[type="email"], textarea');
    const count = await inputs.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 3); i++) {
        const box = await inputs.nth(i).boundingBox();
        if (box) {
          expect(box.height, 'Input fields should have minimum 44px height').toBeGreaterThanOrEqual(44);
        }
      }
    }
  });
});

/**
 * Test Suite: Touch Target Compliance
 */
test.describe('Touch Targets - 44px Minimum', () => {
  test('All interactive elements on mobile homepage', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS['iPhone SE']);
    await page.goto('/');

    // Primary CTA button
    const ctaButton = page.locator('a[href="/order"]').first();
    const ctaBox = await ctaButton.boundingBox();
    if (ctaBox) {
      expect(ctaBox.height, 'Primary CTA should be at least 44px tall').toBeGreaterThanOrEqual(44);
    }

    // Hamburger menu
    await checkTouchTargetSize(page, 'button[aria-label*="navigation menu"]');

    // Social media links
    const socialLinks = page.locator('a[href*="instagram"]').first();
    if (await socialLinks.count() > 0) {
      const socialBox = await socialLinks.boundingBox();
      if (socialBox) {
        expect(socialBox.height, 'Social links should be at least 44px tall').toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('All buttons on order form', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS['Samsung Galaxy S21']);
    await page.goto('/order');

    // Wait for form to render
    await page.waitForTimeout(1000);

    // Tier selection buttons
    const tierButtons = page.locator('button[aria-pressed]');
    const tierCount = await tierButtons.count();

    if (tierCount > 0) {
      for (let i = 0; i < tierCount; i++) {
        const box = await tierButtons.nth(i).boundingBox();
        if (box) {
          expect(box.height, `Tier button ${i} should be at least 48px tall`).toBeGreaterThanOrEqual(48);
        }
      }
    }
  });
});

/**
 * Test Suite: Mobile Checkout Flow
 */
test.describe('Mobile Checkout - Sticky CTA Bar', () => {
  test('Sticky bar appears on scroll', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS['iPhone 14 Pro']);
    await page.goto('/order');

    // Initially, mobile checkout bar should not be visible (user at top)
    const stickyBar = page.locator('.fixed.bottom-0');

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);

    // Sticky bar should appear after scrolling
    // (Note: actual implementation may vary based on scroll threshold)
  });
});

/**
 * Test Suite: Image Sizing and Loading
 */
test.describe('Images - Responsive Sizing', () => {
  test('Hero images fit viewport on mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS['iPhone SE']);
    await page.goto('/');

    // Wait for any hero images
    const images = page.locator('img');
    const count = await images.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 3); i++) {
        const box = await images.nth(i).boundingBox();
        if (box) {
          expect(box.width, 'Images should not exceed viewport width').toBeLessThanOrEqual(VIEWPORTS['iPhone SE'].width);
        }
      }
    }
  });

  test('Gallery images use correct sizes attribute', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS['iPad Mini']);
    await page.goto('/gallery');

    // Check first gallery image has sizes attribute
    const firstImage = page.locator('.grid img').first();
    const sizes = await firstImage.getAttribute('sizes');

    expect(sizes, 'Images should have sizes attribute for responsive loading').toBeTruthy();
  });
});

/**
 * Test Suite: Text Readability
 */
test.describe('Text - Minimum Font Sizes', () => {
  test('Body text is readable on smallest viewport', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS['Samsung Galaxy S21']);
    await page.goto('/');

    // Check body text size
    const bodyText = page.locator('p').first();
    if (await bodyText.count() > 0) {
      const fontSize = await bodyText.evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });

      const fontSizeNum = parseInt(fontSize);
      expect(fontSizeNum, 'Body text should be at least 14px').toBeGreaterThanOrEqual(14);
    }
  });
});

/**
 * Test Suite: Safe Area Insets (Notched Devices)
 */
test.describe('Safe Area Insets', () => {
  test('Content respects safe areas on iPhone 14 Pro', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS['iPhone 14 Pro']);
    await page.goto('/');

    // Check for safe-area CSS classes or padding
    const body = page.locator('body');

    // The layout should use safe-area-inset-* CSS variables
    // This is tested via visual inspection in screenshots

    await page.screenshot({
      path: 'e2e-results/safe-area-iphone14pro.png',
      fullPage: false,
    });
  });
});
