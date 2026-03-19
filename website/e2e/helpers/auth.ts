import { Page, BrowserContext } from '@playwright/test';

/**
 * Mock authentication session for testing protected routes
 */
export async function mockAuthSession(context: BrowserContext, email = 'test@example.com') {
  await context.addCookies([
    {
      name: 'next-auth.session-token',
      value: `test-session-${Date.now()}-${Math.random()}`,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    },
    {
      name: 'next-auth.csrf-token',
      value: `test-csrf-${Date.now()}`,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    },
  ]);

  // Set session storage
  await context.addInitScript((userEmail) => {
    localStorage.setItem('test-user-email', userEmail);
  }, email);
}

/**
 * Clear authentication session
 */
export async function clearAuthSession(context: BrowserContext) {
  await context.clearCookies();
}

/**
 * Wait for authentication redirect
 */
export async function waitForAuthRedirect(page: Page, timeout = 5000) {
  await page.waitForURL(/auth|signin|login/, { timeout });
}
