import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests
 *
 * Uses Playwright's screenshot comparison to detect visual differences across:
 * - Different browsers (Chromium, Firefox, WebKit)
 * - Different viewports (Desktop, Mobile)
 * - Different pages and components
 *
 * Screenshots are stored in e2e/__screenshots__/ and compared on each run.
 * Update screenshots: npx playwright test --update-snapshots
 */

test.describe('Visual Regression: Homepage', () => {
  test('should match homepage hero section screenshot', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for images to load
    await page.waitForTimeout(1000);

    // Scroll to top to ensure consistent positioning
    await page.evaluate(() => window.scrollTo(0, 0));

    // Take screenshot of hero section only
    const heroSection = page.locator('main').first();
    await expect(heroSection).toHaveScreenshot(`hero-${browserName}.png`, {
      maxDiffPixels: 100,
    });
  });

  test('should match full homepage screenshot', async ({ page, browserName, isMobile }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for animations

    // Take full page screenshot
    await expect(page).toHaveScreenshot(`homepage-full-${browserName}${isMobile ? '-mobile' : ''}.png`, {
      fullPage: true,
      maxDiffPixels: 500, // Allow more variance for full page
    });
  });

  test('should match pricing section screenshot', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Scroll to pricing section
    const pricingSection = page.locator('text=Just $9').first().locator('..').locator('..');
    if (await pricingSection.count() > 0) {
      await pricingSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      await expect(pricingSection).toHaveScreenshot(`pricing-section-${browserName}.png`);
    }
  });

  test('should match CTA buttons screenshot', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const ctaButton = page.getByRole('link', { name: /Order Your Portrait/i }).first();
    await expect(ctaButton).toBeVisible();

    // Screenshot of CTA button
    await expect(ctaButton).toHaveScreenshot(`cta-button-${browserName}.png`);
  });
});

test.describe('Visual Regression: Order Page', () => {
  test('should match order page layout', async ({ page, browserName, isMobile }) => {
    await page.goto('/order');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    await expect(page).toHaveScreenshot(`order-page-${browserName}${isMobile ? '-mobile' : ''}.png`, {
      fullPage: true,
      maxDiffPixels: 500,
    });
  });

  test('should match tier selection cards', async ({ page, browserName }) => {
    await page.goto('/order');
    await page.waitForLoadState('networkidle');

    // Find tier cards
    const tierSection = page.locator('text=/Choose Your Tier|Pricing/i').first().locator('..');
    if (await tierSection.count() > 0) {
      await tierSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      await expect(tierSection).toHaveScreenshot(`tier-cards-${browserName}.png`, {
        maxDiffPixels: 200,
      });
    }
  });

  test('should match payment button rendering', async ({ page, browserName }) => {
    await page.goto('/order');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for Stripe to load

    const paymentButton = page.getByRole('button', { name: /checkout|pay|continue/i }).first();
    if (await paymentButton.count() > 0) {
      await paymentButton.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);

      await expect(paymentButton).toHaveScreenshot(`payment-button-${browserName}.png`);
    }
  });
});

test.describe('Visual Regression: Gallery Page', () => {
  test('should match gallery grid layout', async ({ page, browserName, isMobile }) => {
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500); // Wait for images to load

    // Take screenshot of gallery grid
    await expect(page).toHaveScreenshot(`gallery-page-${browserName}${isMobile ? '-mobile' : ''}.png`, {
      fullPage: true,
      maxDiffPixels: 600, // Gallery images might load differently
    });
  });

  test('should match gallery image cards', async ({ page, browserName }) => {
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    // Find gallery items
    const galleryItems = page.locator('img').first().locator('..');
    if (await galleryItems.count() > 0) {
      await galleryItems.first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      await expect(galleryItems.first()).toHaveScreenshot(`gallery-card-${browserName}.png`, {
        maxDiffPixels: 150,
      });
    }
  });
});

test.describe('Visual Regression: Thank You Page', () => {
  test('should match thank you page layout', async ({ page, browserName }) => {
    await page.goto('/thank-you?session_id=test_visual_regression');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot(`thank-you-page-${browserName}.png`, {
      fullPage: true,
      maxDiffPixels: 300,
    });
  });

  test('should match confirmation message', async ({ page, browserName }) => {
    await page.goto('/thank-you');
    await page.waitForLoadState('networkidle');

    const confirmationMsg = page.locator('text=/thank you|success|order complete/i').first();
    if (await confirmationMsg.count() > 0) {
      await expect(confirmationMsg).toHaveScreenshot(`confirmation-msg-${browserName}.png`);
    }
  });
});

test.describe('Visual Regression: Mobile-Specific', () => {
  test('should match mobile menu (if present)', async ({ page, browserName, isMobile }) => {
    if (!isMobile) {
      test.skip();
    }

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Look for mobile menu button
    const menuButton = page.getByRole('button', { name: /menu|navigation/i }).first();
    if (await menuButton.count() > 0) {
      // Take screenshot of menu button
      await expect(menuButton).toHaveScreenshot(`mobile-menu-button-${browserName}.png`);

      // Open menu
      await menuButton.click();
      await page.waitForTimeout(500); // Wait for animation

      // Take screenshot of open menu
      await expect(page).toHaveScreenshot(`mobile-menu-open-${browserName}.png`, {
        maxDiffPixels: 200,
      });
    }
  });

  test('should match mobile order form layout', async ({ page, browserName, isMobile }) => {
    if (!isMobile) {
      test.skip();
    }

    await page.goto('/order');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    const form = page.locator('form').first();
    if (await form.count() > 0) {
      await expect(form).toHaveScreenshot(`mobile-order-form-${browserName}.png`, {
        maxDiffPixels: 300,
      });
    }
  });

  test('should match mobile footer', async ({ page, browserName, isMobile }) => {
    if (!isMobile) {
      test.skip();
    }

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Scroll to footer
    const footer = page.locator('footer').first();
    if (await footer.count() > 0) {
      await footer.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);

      await expect(footer).toHaveScreenshot(`mobile-footer-${browserName}.png`);
    }
  });
});

test.describe('Visual Regression: Component States', () => {
  test('should match button hover state (desktop only)', async ({ page, browserName, isMobile }) => {
    if (isMobile) {
      test.skip();
    }

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const ctaButton = page.getByRole('link', { name: /Order Your Portrait/i }).first();
    await expect(ctaButton).toBeVisible();

    // Hover over button
    await ctaButton.hover();
    await page.waitForTimeout(300); // Wait for hover animation

    await expect(ctaButton).toHaveScreenshot(`button-hover-${browserName}.png`);
  });

  test('should match form input focus state', async ({ page, browserName }) => {
    await page.goto('/order');
    await page.waitForLoadState('networkidle');

    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.count() > 0) {
      await emailInput.focus();
      await page.waitForTimeout(200);

      await expect(emailInput).toHaveScreenshot(`input-focus-${browserName}.png`);
    }
  });

  test('should match form validation error state', async ({ page, browserName }) => {
    await page.goto('/order');
    await page.waitForLoadState('networkidle');

    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.count() > 0) {
      // Trigger validation error
      await emailInput.fill('invalid-email');
      await emailInput.blur();
      await page.waitForTimeout(300);

      // Take screenshot including error message
      const formGroup = emailInput.locator('..').locator('..');
      await expect(formGroup).toHaveScreenshot(`input-error-${browserName}.png`, {
        maxDiffPixels: 100,
      });
    }
  });
});

test.describe('Visual Regression: Cross-Browser Font Rendering', () => {
  test('should render headings consistently', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const mainHeading = page.getByRole('heading', { name: /Where Art Meets Animal/i });
    await expect(mainHeading).toBeVisible();

    // Screenshot heading to check font rendering
    await expect(mainHeading).toHaveScreenshot(`heading-font-${browserName}.png`, {
      maxDiffPixels: 50, // Font rendering can vary slightly
    });
  });

  test('should render body text consistently', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const bodyText = page.locator('p').first();
    if (await bodyText.count() > 0) {
      await expect(bodyText).toHaveScreenshot(`body-text-${browserName}.png`, {
        maxDiffPixels: 50,
      });
    }
  });
});

test.describe('Visual Regression: Browser-Specific Quirks', () => {
  test('should handle Safari backdrop-filter rendering', async ({ page, browserName }) => {
    if (browserName !== 'webkit') {
      test.skip();
    }

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check if any elements use backdrop-filter (glassmorphism)
    const blurredElements = page.locator('[style*="backdrop-filter"], [class*="backdrop"]');
    if (await blurredElements.count() > 0) {
      await expect(blurredElements.first()).toHaveScreenshot(`safari-backdrop-filter.png`, {
        maxDiffPixels: 150,
      });
    }
  });

  test('should handle Firefox flexbox rendering', async ({ page, browserName }) => {
    if (browserName !== 'firefox') {
      test.skip();
    }

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check flexbox layouts
    const flexContainer = page.locator('[class*="flex"]').first();
    if (await flexContainer.count() > 0) {
      await expect(flexContainer).toHaveScreenshot(`firefox-flexbox.png`, {
        maxDiffPixels: 100,
      });
    }
  });

  test('should handle Chrome/Chromium smooth scrolling', async ({ page, browserName }) => {
    if (browserName !== 'chromium') {
      test.skip();
    }

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Scroll down smoothly
    await page.evaluate(() => {
      window.scrollTo({ top: 500, behavior: 'smooth' });
    });

    await page.waitForTimeout(1000); // Wait for smooth scroll animation

    await expect(page).toHaveScreenshot(`chromium-scrolled-view.png`, {
      maxDiffPixels: 300,
    });
  });
});

test.describe('Visual Regression: Responsive Breakpoints', () => {
  test('should match tablet viewport (768px)', async ({ page, browserName }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot(`homepage-tablet-768-${browserName}.png`, {
      fullPage: true,
      maxDiffPixels: 400,
    });
  });

  test('should match small desktop (1024px)', async ({ page, browserName }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot(`homepage-desktop-1024-${browserName}.png`, {
      fullPage: true,
      maxDiffPixels: 400,
    });
  });

  test('should match large desktop (1920px)', async ({ page, browserName }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot(`homepage-desktop-1920-${browserName}.png`, {
      fullPage: true,
      maxDiffPixels: 600,
    });
  });
});
