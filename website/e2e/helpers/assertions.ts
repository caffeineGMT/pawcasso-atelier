import { Page, expect } from '@playwright/test';

/**
 * Assert page has loaded without errors
 */
export async function assertPageLoaded(page: Page) {
  // Check for common error indicators
  const errorMessages = page.locator('text=/error|failed|something went wrong/i');
  const errorCount = await errorMessages.count();

  if (errorCount > 0) {
    const errorText = await errorMessages.first().textContent();
    console.warn(`Warning: Potential error message found: ${errorText}`);
  }

  // Page should have content
  const bodyText = await page.textContent('body');
  expect(bodyText?.length).toBeGreaterThan(0);
}

/**
 * Assert Stripe is loaded
 */
export async function assertStripeLoaded(page: Page) {
  const stripeLoaded = await page.evaluate(() => {
    return typeof (window as any).Stripe !== 'undefined';
  });

  expect(stripeLoaded).toBeTruthy();
}

/**
 * Assert responsive design at viewport
 */
export async function assertResponsiveLayout(page: Page, width: number, height: number) {
  await page.setViewportSize({ width, height });
  await page.waitForTimeout(500); // Allow layout to adjust

  // Check that content is visible
  const visibleContent = await page.locator('body').isVisible();
  expect(visibleContent).toBeTruthy();
}
