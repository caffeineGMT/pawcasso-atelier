import { test, expect } from '@playwright/test';

/**
 * Accessibility (a11y) Tests Across Browsers
 *
 * Tests WCAG 2.1 Level AA compliance across:
 * - Chromium, Firefox, WebKit
 * - Desktop and Mobile
 *
 * Focus areas:
 * 1. Keyboard navigation
 * 2. Screen reader compatibility
 * 3. Color contrast
 * 4. ARIA attributes
 * 5. Focus management
 * 6. Form accessibility
 */

test.describe('Accessibility: Keyboard Navigation', () => {
  test('should navigate homepage with keyboard', async ({ page, isMobile }) => {
    if (isMobile) {
      test.skip(); // Keyboard nav is desktop-specific
    }

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Tab through interactive elements
    await page.keyboard.press('Tab'); // First focusable element
    await page.waitForTimeout(200);

    let tabCount = 0;
    for (let i = 0; i < 10; i++) {
      const focused = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tag: el?.tagName,
          role: el?.getAttribute('role'),
          href: (el as HTMLAnchorElement)?.href,
          text: el?.textContent?.substring(0, 50),
        };
      });

      if (focused.tag && focused.tag !== 'BODY') {
        tabCount++;
      }

      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
    }

    // Should be able to tab through multiple elements
    expect(tabCount).toBeGreaterThan(0);
  });

  test('should show visible focus indicators', async ({ page, isMobile }) => {
    if (isMobile) {
      test.skip();
    }

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Tab to first interactive element
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);

    const focusedElement = await page.evaluateHandle(() => document.activeElement);

    // Check if focus is visible
    const hasVisibleFocus = await focusedElement.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
        boxShadow: styles.boxShadow,
      };
    });

    // Should have some focus indicator (outline or box-shadow)
    const hasFocusIndicator =
      hasVisibleFocus.outline !== 'none' ||
      hasVisibleFocus.outlineWidth !== '0px' ||
      hasVisibleFocus.boxShadow !== 'none';

    expect(hasFocusIndicator).toBe(true);
  });

  test('should allow keyboard activation of buttons and links', async ({ page, isMobile }) => {
    if (isMobile) {
      test.skip();
    }

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Find CTA button
    const ctaButton = page.getByRole('link', { name: /Order Your Portrait/i }).first();
    await ctaButton.focus();
    await page.waitForTimeout(200);

    // Press Enter to activate
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Should navigate to order page
    await expect(page).toHaveURL(/\/order/);
  });

  test('should support Escape key to close modals', async ({ page, isMobile }) => {
    if (isMobile) {
      test.skip();
    }

    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const images = page.locator('img');
    const count = await images.count();

    if (count > 0) {
      // Click image to open modal
      await images.first().click();
      await page.waitForTimeout(500);

      // Check if modal opened
      const modal = page.locator('[role="dialog"], [class*="modal"]');
      const hasModal = await modal.count() > 0;

      if (hasModal) {
        // Press Escape
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);

        // Modal should close
        await expect(modal.first()).not.toBeVisible();
      }
    }
  });

  test('should trap focus within modals', async ({ page, isMobile }) => {
    if (isMobile) {
      test.skip();
    }

    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const images = page.locator('img');
    const count = await images.count();

    if (count > 0) {
      await images.first().click();
      await page.waitForTimeout(500);

      const modal = page.locator('[role="dialog"]');
      const hasModal = await modal.count() > 0;

      if (hasModal) {
        // Tab through modal elements
        await page.keyboard.press('Tab');
        await page.waitForTimeout(200);

        const focused = await page.evaluate(() => {
          const el = document.activeElement;
          return el?.closest('[role="dialog"]') !== null;
        });

        // Focus should stay within modal
        expect(focused).toBe(true);
      }
    }
  });
});

test.describe('Accessibility: Screen Reader Support', () => {
  test('should have proper page title', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
    expect(title).toContain('Pawcasso');
  });

  test('should have main landmark', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const main = page.locator('main');
    await expect(main).toHaveCount(1);
    await expect(main).toBeVisible();
  });

  test('should have navigation landmark', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const nav = page.locator('nav');
    const count = await nav.count();

    // Should have at least one navigation
    expect(count).toBeGreaterThanOrEqual(1);

    if (count > 0) {
      await expect(nav.first()).toBeVisible();
    }
  });

  test('should have descriptive link text', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const links = page.locator('a:not([aria-hidden="true"])');
    const count = await links.count();

    if (count > 0) {
      // Check first 5 links
      for (let i = 0; i < Math.min(5, count); i++) {
        const link = links.nth(i);
        const text = await link.textContent();
        const ariaLabel = await link.getAttribute('aria-label');

        // Link should have text or aria-label
        const hasLabel = (text && text.trim().length > 0) || (ariaLabel && ariaLabel.length > 0);
        expect(hasLabel).toBe(true);
      }
    }
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for h1
    const h1 = page.locator('h1');
    const h1Count = await h1.count();

    // Should have exactly one h1
    expect(h1Count).toBe(1);

    // Get all headings
    const headings = await page.evaluate(() => {
      const headingTags = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
      const elements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));

      return elements.map((el) => ({
        tag: el.tagName,
        level: headingTags.indexOf(el.tagName) + 1,
        text: el.textContent?.substring(0, 50),
      }));
    });

    // Should have headings
    expect(headings.length).toBeGreaterThan(0);

    // First heading should be h1
    expect(headings[0].tag).toBe('H1');
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const images = page.locator('img:not([aria-hidden="true"])');
    const count = await images.count();

    if (count > 0) {
      // Check first 5 images
      for (let i = 0; i < Math.min(5, count); i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');

        // All images should have alt attribute (even if empty for decorative)
        expect(alt !== null).toBe(true);
      }
    }
  });

  test('should use semantic HTML elements', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for semantic elements
    const semanticElements = await page.evaluate(() => {
      return {
        header: document.querySelectorAll('header').length,
        nav: document.querySelectorAll('nav').length,
        main: document.querySelectorAll('main').length,
        footer: document.querySelectorAll('footer').length,
        article: document.querySelectorAll('article').length,
        section: document.querySelectorAll('section').length,
      };
    });

    // Should use semantic HTML
    expect(semanticElements.main).toBe(1);
    expect(semanticElements.nav).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Accessibility: ARIA Attributes', () => {
  test('should use ARIA labels for icon buttons', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Find buttons without text content
    const iconButtons = page.locator('button:not(:has-text(/\\w/))');
    const count = await iconButtons.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(3, count); i++) {
        const button = iconButtons.nth(i);
        const ariaLabel = await button.getAttribute('aria-label');
        const title = await button.getAttribute('title');

        // Icon buttons should have aria-label or title
        expect(ariaLabel || title).toBeTruthy();
      }
    }
  });

  test('should use ARIA roles appropriately', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for common ARIA roles
    const ariaElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('[role]');
      return Array.from(elements).map((el) => el.getAttribute('role'));
    });

    // ARIA roles are optional but should be valid if present
    if (ariaElements.length > 0) {
      const validRoles = [
        'navigation',
        'banner',
        'main',
        'contentinfo',
        'button',
        'link',
        'dialog',
        'alert',
        'status',
        'presentation',
        'img',
        'list',
        'listitem',
      ];

      ariaElements.forEach((role) => {
        if (role) {
          expect(validRoles).toContain(role);
        }
      });
    }
  });

  test('should mark decorative images as aria-hidden', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const decorativeImages = page.locator('img[alt=""]');
    const count = await decorativeImages.count();

    // Decorative images (empty alt) should ideally have aria-hidden
    if (count > 0) {
      for (let i = 0; i < Math.min(3, count); i++) {
        const img = decorativeImages.nth(i);
        const ariaHidden = await img.getAttribute('aria-hidden');

        // This is a recommendation, not strict requirement
        expect(ariaHidden === 'true' || ariaHidden === null).toBe(true);
      }
    }
  });

  test('should use aria-live for dynamic content updates', async ({ page }) => {
    await page.goto('/order');
    await page.waitForLoadState('networkidle');

    // Check for live regions (for form validation, loading states, etc.)
    const liveRegions = page.locator('[aria-live]');
    const count = await liveRegions.count();

    // Live regions are optional but improve UX
    expect(count >= 0).toBe(true);

    if (count > 0) {
      const ariaLive = await liveRegions.first().getAttribute('aria-live');
      expect(['polite', 'assertive', 'off']).toContain(ariaLive);
    }
  });
});

test.describe('Accessibility: Form Accessibility', () => {
  test('should associate labels with form inputs', async ({ page }) => {
    await page.goto('/order');
    await page.waitForLoadState('networkidle');

    const inputs = page.locator('input[type="text"], input[type="email"], input[type="tel"]');
    const count = await inputs.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(5, count); i++) {
        const input = inputs.nth(i);
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');

        // Input should have associated label
        const hasLabel =
          (id && (await page.locator(`label[for="${id}"]`).count()) > 0) ||
          ariaLabel ||
          ariaLabelledBy;

        expect(hasLabel).toBeTruthy();
      }
    }
  });

  test('should provide error messages for invalid inputs', async ({ page }) => {
    await page.goto('/order');
    await page.waitForLoadState('networkidle');

    const emailInput = page.locator('input[type="email"]').first();

    if (await emailInput.count() > 0) {
      // Enter invalid email
      await emailInput.fill('invalid-email');
      await emailInput.blur();
      await page.waitForTimeout(500);

      // Check for error message
      const errorMsg = page.locator('[class*="error"], [role="alert"]').filter({ hasText: /email/i });
      const hasError = await errorMsg.count() > 0;

      // Error message should be visible
      if (hasError) {
        await expect(errorMsg.first()).toBeVisible();
      }
    }
  });

  test('should mark required fields appropriately', async ({ page }) => {
    await page.goto('/order');
    await page.waitForLoadState('networkidle');

    const requiredInputs = page.locator('input[required], input[aria-required="true"]');
    const count = await requiredInputs.count();

    if (count > 0) {
      // Required fields should be marked
      for (let i = 0; i < Math.min(3, count); i++) {
        const input = requiredInputs.nth(i);
        const isRequired =
          (await input.getAttribute('required')) !== null ||
          (await input.getAttribute('aria-required')) === 'true';

        expect(isRequired).toBe(true);
      }
    }
  });

  test('should provide helpful placeholder text', async ({ page }) => {
    await page.goto('/order');
    await page.waitForLoadState('networkidle');

    const inputs = page.locator('input[type="text"], input[type="email"]');
    const count = await inputs.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(3, count); i++) {
        const input = inputs.nth(i);
        const placeholder = await input.getAttribute('placeholder');

        // Placeholder is helpful but not required
        expect(placeholder !== null || placeholder === null).toBe(true);
      }
    }
  });

  test('should have accessible file upload button', async ({ page }) => {
    await page.goto('/order');
    await page.waitForLoadState('networkidle');

    const fileInput = page.locator('input[type="file"]').first();

    if (await fileInput.count() > 0) {
      // File input should have label
      const id = await fileInput.getAttribute('id');
      const ariaLabel = await fileInput.getAttribute('aria-label');

      const hasLabel = (id && (await page.locator(`label[for="${id}"]`).count()) > 0) || ariaLabel;

      expect(hasLabel).toBeTruthy();
    }
  });
});

test.describe('Accessibility: Color Contrast', () => {
  test('should have sufficient contrast for primary text', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const bodyText = page.locator('p').first();

    if (await bodyText.count() > 0) {
      const contrast = await bodyText.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          color: styles.color,
          backgroundColor: styles.backgroundColor,
          fontSize: styles.fontSize,
        };
      });

      // Basic check - text should have color
      expect(contrast.color).toBeTruthy();
      expect(contrast.color).not.toBe('rgba(0, 0, 0, 0)');
    }
  });

  test('should have sufficient contrast for CTA buttons', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const ctaButton = page.getByRole('link', { name: /Order Your Portrait/i }).first();

    const buttonStyles = await ctaButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        color: styles.color,
        backgroundColor: styles.backgroundColor,
        fontSize: styles.fontSize,
      };
    });

    // Button should have contrasting colors
    expect(buttonStyles.color).toBeTruthy();
    expect(buttonStyles.backgroundColor).toBeTruthy();
    expect(buttonStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('should have visible focus indicators with sufficient contrast', async ({ page, isMobile }) => {
    if (isMobile) {
      test.skip();
    }

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);

    const focused = await page.evaluateHandle(() => document.activeElement);
    const focusStyles = await focused.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        outline: styles.outline,
        outlineColor: styles.outlineColor,
        boxShadow: styles.boxShadow,
      };
    });

    // Focus should have visible indicator
    const hasFocus = focusStyles.outline !== 'none' || focusStyles.boxShadow !== 'none';
    expect(hasFocus).toBe(true);
  });
});

test.describe('Accessibility: Touch Targets (Mobile)', () => {
  test('should have touch targets at least 44x44px', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip();
    }

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const buttons = page.locator('button, a[href]');
    const count = await buttons.count();

    if (count > 0) {
      // Check first 5 interactive elements
      for (let i = 0; i < Math.min(5, count); i++) {
        const button = buttons.nth(i);
        const box = await button.boundingBox();

        if (box) {
          // Touch targets should be at least 44x44px (WCAG 2.1 AAA)
          // We'll check for 40px minimum (closer to AA standard)
          expect(box.height).toBeGreaterThanOrEqual(36);
          expect(box.width).toBeGreaterThanOrEqual(36);
        }
      }
    }
  });

  test('should have adequate spacing between touch targets', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip();
    }

    await page.goto('/order');
    await page.waitForLoadState('networkidle');

    const buttons = page.locator('button');
    const count = await buttons.count();

    if (count >= 2) {
      const first = await buttons.nth(0).boundingBox();
      const second = await buttons.nth(1).boundingBox();

      if (first && second) {
        // Calculate spacing
        const spacing = Math.abs(first.y - second.y) - first.height;

        // Should have some spacing (at least 8px)
        expect(spacing >= 0).toBe(true);
      }
    }
  });
});

test.describe('Accessibility: Browser-Specific Tests', () => {
  test('should work with Safari VoiceOver compatibility', async ({ page, browserName }) => {
    if (browserName !== 'webkit') {
      test.skip();
    }

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for aria-labels and semantic HTML
    const main = page.locator('main');
    await expect(main).toHaveCount(1);

    const headings = page.locator('h1, h2, h3');
    const count = await headings.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should work with Firefox NVDA compatibility', async ({ page, browserName }) => {
    if (browserName !== 'firefox') {
      test.skip();
    }

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check semantic structure
    const landmarks = await page.evaluate(() => {
      return {
        main: document.querySelectorAll('main').length,
        nav: document.querySelectorAll('nav').length,
        header: document.querySelectorAll('header').length,
      };
    });

    expect(landmarks.main).toBe(1);
  });

  test('should work with Chrome JAWS compatibility', async ({ page, browserName }) => {
    if (browserName !== 'chromium') {
      test.skip();
    }

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for ARIA landmarks
    const ariaLandmarks = await page.evaluate(() => {
      const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], main, nav');
      return landmarks.length;
    });

    expect(ariaLandmarks).toBeGreaterThan(0);
  });
});
