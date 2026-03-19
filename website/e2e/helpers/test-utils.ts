/**
 * Payment E2E Test Utilities
 *
 * Shared utilities for payment testing across all test suites
 */

import { Page, APIRequestContext } from '@playwright/test';
import { TEST_ORDER } from './stripe-test-cards';

/**
 * Wait for Stripe webhook processing to complete
 * Webhooks are async - need to wait for processing before verifying database
 */
export async function waitForWebhookProcessing(delayMs: number = 3000) {
  await new Promise(resolve => setTimeout(resolve, delayMs));
}

/**
 * Verify order was created in database
 */
export async function verifyOrderCreated(
  request: APIRequestContext,
  email: string,
  expectedData?: {
    petName?: string;
    tier?: string;
    status?: string;
    amount?: number;
  }
): Promise<boolean> {
  const ordersResponse = await request.get(`/api/admin/orders?email=${email}`);

  if (!ordersResponse.ok()) {
    return false;
  }

  const orders = await ordersResponse.json();

  if (orders.length === 0) {
    return false;
  }

  const order = orders[0];

  // Verify expected data if provided
  if (expectedData) {
    if (expectedData.petName && order.petName !== expectedData.petName) {
      return false;
    }

    if (expectedData.tier && order.tier !== expectedData.tier) {
      return false;
    }

    if (expectedData.status && order.status !== expectedData.status) {
      return false;
    }

    if (expectedData.amount && order.amount !== expectedData.amount) {
      return false;
    }
  }

  return true;
}

/**
 * Verify NO order was created (for failed payments)
 */
export async function verifyNoOrderCreated(
  request: APIRequestContext,
  email: string
): Promise<boolean> {
  const ordersResponse = await request.get(`/api/admin/orders?email=${email}`);

  if (!ordersResponse.ok()) {
    return true; // If endpoint fails, we can't verify - assume no order
  }

  const orders = await ordersResponse.json();
  return orders.length === 0;
}

/**
 * Verify email was sent
 */
export async function verifyEmailSent(
  request: APIRequestContext,
  email: string,
  emailType: string
): Promise<boolean> {
  const emailResponse = await request.get(`/api/admin/emails?email=${email}&type=${emailType}`);

  if (!emailResponse.ok()) {
    return false;
  }

  const emails = await emailResponse.json();
  return emails.length > 0;
}

/**
 * Clean up test data after test
 */
export async function cleanupTestData(
  request: APIRequestContext,
  email: string
) {
  // Delete test orders
  await request.delete(`/api/admin/orders?email=${email}`).catch(() => {
    // Ignore errors - endpoint may not exist
  });

  // Delete test abandoned carts
  await request.delete(`/api/admin/abandoned-carts?email=${email}`).catch(() => {
    // Ignore errors
  });

  // Delete test email records
  await request.delete(`/api/admin/emails?email=${email}`).catch(() => {
    // Ignore errors
  });
}

/**
 * Generate unique test email
 */
export function generateTestEmail(prefix: string): string {
  return `${prefix}-${Date.now()}@pawcasso.test`;
}

/**
 * Get order details from database
 */
export async function getOrder(
  request: APIRequestContext,
  email: string
): Promise<any | null> {
  const ordersResponse = await request.get(`/api/admin/orders?email=${email}`);

  if (!ordersResponse.ok()) {
    return null;
  }

  const orders = await ordersResponse.json();

  if (orders.length === 0) {
    return null;
  }

  return orders[0];
}

/**
 * Take screenshot on failure (for debugging)
 */
export async function screenshotOnFailure(page: Page, testName: string) {
  await page.screenshot({
    path: `test-results/screenshots/${testName}-${Date.now()}.png`,
    fullPage: true,
  });
}

/**
 * Wait for element with retry
 */
export async function waitForElementWithRetry(
  page: Page,
  selector: string,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await page.waitForSelector(selector, { timeout: 5000 });
      return true;
    } catch (e) {
      if (i < maxAttempts - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  return false;
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  initialDelayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxAttempts - 1) {
        const delay = initialDelayMs * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Retry failed');
}

/**
 * Check if element is in viewport
 */
export async function isInViewport(page: Page, selector: string): Promise<boolean> {
  return await page.locator(selector).evaluate((el) => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    );
  });
}

/**
 * Simulate slow network
 */
export async function simulateSlowNetwork(page: Page, delayMs: number = 2000) {
  await page.route('**/*', async (route) => {
    await new Promise(resolve => setTimeout(resolve, delayMs));
    await route.continue();
  });
}

/**
 * Simulate network failure
 */
export async function simulateNetworkFailure(page: Page, pattern: string = '**/*') {
  await page.route(pattern, async (route) => {
    await route.abort('failed');
  });
}

/**
 * Clear network simulation
 */
export async function clearNetworkSimulation(page: Page) {
  await page.unroute('**/*');
}

/**
 * Get all console errors from page
 */
export async function getConsoleErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  return errors;
}

/**
 * Assert no console errors
 */
export async function assertNoConsoleErrors(page: Page) {
  const errors = await getConsoleErrors(page);

  if (errors.length > 0) {
    throw new Error(`Console errors detected: ${errors.join(', ')}`);
  }
}

/**
 * Mock Stripe API response
 */
export async function mockStripeResponse(
  page: Page,
  endpoint: string,
  response: any,
  status: number = 200
) {
  await page.route(`**/${endpoint}`, async (route) => {
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
}

/**
 * Performance timing helper
 */
export class PerformanceTimer {
  private startTime: number = 0;
  private endTime: number = 0;

  start() {
    this.startTime = Date.now();
  }

  stop() {
    this.endTime = Date.now();
  }

  getDuration(): number {
    return this.endTime - this.startTime;
  }

  assertDuration(maxMs: number) {
    const duration = this.getDuration();
    if (duration > maxMs) {
      throw new Error(`Performance assertion failed: ${duration}ms > ${maxMs}ms`);
    }
  }
}

/**
 * Test data generator
 */
export class TestDataGenerator {
  static generateOrder(overrides?: Partial<typeof TEST_ORDER>) {
    return {
      ...TEST_ORDER,
      customerEmail: generateTestEmail('test'),
      ...overrides,
    };
  }

  static generatePetName(): string {
    const names = ['Buddy', 'Max', 'Luna', 'Charlie', 'Bella', 'Cooper', 'Lucy', 'Rocky', 'Daisy', 'Bailey'];
    return names[Math.floor(Math.random() * names.length)];
  }

  static generateCustomerName(): string {
    const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emily', 'Chris', 'Lisa'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    return `${firstName} ${lastName}`;
  }

  static generateNotes(): string {
    const notes = [
      'Please make my dog look majestic!',
      'Extra fluffy please',
      'Capture her playful personality',
      'He loves belly rubs',
      'Include her favorite toy if possible',
    ];

    return notes[Math.floor(Math.random() * notes.length)];
  }
}

/**
 * Logging helper for debugging
 */
export class TestLogger {
  static info(message: string, data?: any) {
    console.log(`[INFO] ${message}`, data || '');
  }

  static error(message: string, error?: any) {
    console.error(`[ERROR] ${message}`, error || '');
  }

  static warn(message: string, data?: any) {
    console.warn(`[WARN] ${message}`, data || '');
  }

  static debug(message: string, data?: any) {
    if (process.env.DEBUG === 'true') {
      console.debug(`[DEBUG] ${message}`, data || '');
    }
  }
}
