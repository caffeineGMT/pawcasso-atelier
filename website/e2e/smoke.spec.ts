import { test, expect } from '@playwright/test';

/**
 * Smoke tests - Quick verification that basic functionality works
 * These tests run fast and catch major issues quickly
 */

test.describe('Smoke Tests', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Pawcasso/i);
  });

  test('order page loads', async ({ page }) => {
    await page.goto('/order');
    await expect(page.getByText(/Commission|Order/i).first()).toBeVisible();
  });

  test('gallery page loads', async ({ page }) => {
    await page.goto('/gallery');
    await expect(page).toHaveURL('/gallery');
  });

  test('navigation works', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Order/i }).first().click();
    await expect(page).toHaveURL('/order');
  });

  test('site is responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Art Meets Animal/i })).toBeVisible();
  });
});
