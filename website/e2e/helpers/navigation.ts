import { Page } from '@playwright/test';

/**
 * Navigate and wait for page to be fully loaded
 */
export async function navigateAndWait(page: Page, url: string) {
  await page.goto(url);
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Wait for analytics to be initialized
 */
export async function waitForAnalytics(page: Page) {
  await page.waitForFunction(() => {
    return typeof (window as any).gtag !== 'undefined' ||
           typeof (window as any).analytics !== 'undefined';
  }, { timeout: 5000 }).catch(() => {
    // Analytics may not be loaded in test environment
    console.log('Analytics not loaded, continuing...');
  });
}

/**
 * Scroll to element and click
 */
export async function scrollAndClick(page: Page, selector: string) {
  const element = page.locator(selector);
  await element.scrollIntoViewIfNeeded();
  await element.click();
}
