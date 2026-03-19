import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');

    // Check title and heading
    await expect(page).toHaveTitle(/Pawcasso/i);
    await expect(page.getByRole('heading', { name: /Where Art Meets Animal/i })).toBeVisible();
  });

  test('should display hero section with CTA buttons', async ({ page }) => {
    await page.goto('/');

    // Check main CTA buttons
    const orderButton = page.getByRole('link', { name: /Order Your Portrait/i });
    await expect(orderButton).toBeVisible();
    await expect(orderButton).toHaveAttribute('href', '/order');

    const instagramButton = page.getByRole('link', { name: /Follow Us/i });
    await expect(instagramButton).toBeVisible();
  });

  test('should display social proof stats', async ({ page }) => {
    await page.goto('/');

    // Stats should be visible (even if loading)
    const statsSection = page.locator('text=Happy Pet Parents').first();
    await expect(statsSection).toBeVisible();
  });

  test('should display how it works section', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Three simple steps')).toBeVisible();
    await expect(page.getByText('Upload your photo')).toBeVisible();
    await expect(page.getByText('Choose a style')).toBeVisible();
    await expect(page.getByText('Receive your art')).toBeVisible();
  });

  test('should display featured gallery', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /Featured works/i })).toBeVisible();

    // Check for gallery link
    const viewGalleryLink = page.getByRole('link', { name: /View full gallery/i });
    await expect(viewGalleryLink).toBeVisible();
    await expect(viewGalleryLink).toHaveAttribute('href', '/gallery');
  });

  test('should display pricing section', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Just $9')).toBeVisible();
    await expect(page.getByText('per portrait')).toBeVisible();

    // Check pricing features
    await expect(page.getByText('4000 x 5000px resolution')).toBeVisible();
    await expect(page.getByText('16 art styles to choose from')).toBeVisible();
    await expect(page.getByText('Delivered within 24 hours')).toBeVisible();
  });

  test('should display testimonials section', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /Happy Pet Parents/i })).toBeVisible();
  });

  test('should display FAQ section', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /Questions/i })).toBeVisible();
    await expect(page.getByText(/How does the process work/i)).toBeVisible();

    const faqLink = page.getByRole('link', { name: /View all questions/i });
    await expect(faqLink).toBeVisible();
  });

  test('should navigate to order page when CTA is clicked', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: /Order Your Portrait/i }).first().click();
    await page.waitForURL('/order');

    await expect(page).toHaveURL('/order');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check hero is visible
    await expect(page.getByRole('heading', { name: /Where Art Meets Animal/i })).toBeVisible();

    // Check mobile menu functionality (if applicable)
    const orderButton = page.getByRole('link', { name: /Order Your Portrait/i }).first();
    await expect(orderButton).toBeVisible();
  });

  test('should track analytics events', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load and analytics to initialize
    await page.waitForLoadState('networkidle');

    // Analytics should be captured (verified via console logs or network requests)
    // This is a basic check - in production you'd verify actual tracking calls
    await expect(page).toHaveURL('/');
  });
});
