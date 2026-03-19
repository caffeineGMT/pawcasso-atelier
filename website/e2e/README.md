# E2E Testing Suite

Comprehensive end-to-end testing for Pawcasso Atelier using Playwright.

## Test Coverage

### 1. Homepage Tests (`homepage.spec.ts`)
- ✅ Page load and basic content verification
- ✅ Hero section with CTA buttons
- ✅ Social proof statistics
- ✅ How it works section
- ✅ Featured gallery
- ✅ Pricing section
- ✅ Testimonials
- ✅ FAQ section
- ✅ Navigation flows
- ✅ Mobile responsiveness

### 2. Order Flow Tests (`order-flow.spec.ts`)
- ✅ Order page load with all elements
- ✅ Tier selection and pricing display
- ✅ Style selection
- ✅ Form validation
- ✅ File upload handling
- ✅ Trust badges and social proof
- ✅ UTM parameter tracking
- ✅ Referral discount handling
- ✅ Mobile responsiveness

### 3. Payment Tests (`payment.spec.ts`)
- ✅ Stripe checkout redirect
- ✅ Stripe.js loading verification
- ✅ Pricing display accuracy
- ✅ Successful payment redirect
- ✅ Order confirmation on success page
- ✅ Conversion tracking
- ✅ Upsell flow (post-checkout)

### 4. Customer Dashboard Tests (`customer-dashboard.spec.ts`)
- ✅ Authentication redirect for unauthenticated users
- ✅ Dashboard sections display
- ✅ Order history section
- ✅ Referral dashboard
- ✅ Settings section
- ✅ Stripe billing portal integration
- ✅ Mobile navigation tabs
- ✅ API route verification

### 5. Authentication Tests (`auth.spec.ts`)
- ✅ Sign-in page display
- ✅ Email input validation
- ✅ Magic link request submission
- ✅ Verification page display
- ✅ Verification instructions
- ✅ Magic link callback handling
- ✅ Session persistence
- ✅ Sign-out functionality
- ✅ Session management across navigation
- ✅ Expired session handling

## Running Tests

### Install Dependencies
```bash
npm install
npx playwright install
```

### Run All Tests
```bash
npm run test:e2e
```

### Run Tests in UI Mode (Interactive)
```bash
npm run test:e2e:ui
```

### Run Tests in Headed Mode (See Browser)
```bash
npm run test:e2e:headed
```

### Debug Tests
```bash
npm run test:e2e:debug
```

### View Test Report
```bash
npm run test:e2e:report
```

### Generate Tests with Codegen
```bash
npm run test:e2e:codegen
```

## Test Configuration

Configuration is in `playwright.config.ts`:
- **Base URL**: `http://localhost:3000` (or set `PLAYWRIGHT_TEST_BASE_URL`)
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Retries**: 2 on CI, 0 locally
- **Reporters**: HTML on CI, list locally
- **Traces**: Captured on first retry
- **Screenshots**: Taken on failure

## CI/CD Integration

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

GitHub Actions workflow: `.github/workflows/e2e-tests.yml`

Reports are uploaded as artifacts and retained for 30 days.

## Test Helpers

Located in `e2e/helpers/`:
- **auth.ts**: Authentication helpers (mock session, clear session, wait for redirect)
- **navigation.ts**: Navigation utilities (navigate and wait, scroll and click, analytics wait)
- **assertions.ts**: Common assertions (page loaded, Stripe loaded, responsive layout)

## Test Fixtures

Test fixtures (images, data files) are stored in `e2e/fixtures/`

## Writing New Tests

1. Create a new `.spec.ts` file in the `e2e/` directory
2. Import test helpers as needed
3. Use descriptive test names
4. Group related tests with `test.describe()`
5. Add assertions for both positive and negative cases
6. Consider mobile responsiveness
7. Handle async operations properly

Example:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something specific', async ({ page }) => {
    await page.goto('/feature');
    await expect(page.getByRole('heading')).toBeVisible();
  });
});
```

## Continuous Improvement

- Add tests for new features before deployment
- Update tests when UI changes
- Monitor test flakiness and fix unstable tests
- Keep test data isolated and repeatable
- Use page objects for complex flows

## Troubleshooting

### Tests failing locally
1. Ensure dev server is running: `npm run dev`
2. Check environment variables in `.env.local`
3. Clear browser cache: `npx playwright clean`
4. Update browsers: `npx playwright install`

### Tests failing in CI
1. Check GitHub Actions logs for specific errors
2. Download test artifacts (reports, screenshots)
3. Verify environment variables are set correctly
4. Check for timing issues (add waits if needed)

### Debugging tips
- Use `await page.pause()` to pause test execution
- Use `--headed` flag to see browser
- Use `--debug` flag for step-by-step debugging
- Check network tab in UI mode
- Use `page.screenshot()` to capture state

## Best Practices

1. **Isolation**: Each test should be independent
2. **Speed**: Use parallel execution when possible
3. **Reliability**: Avoid hard-coded waits, use smart waiting
4. **Maintainability**: Use helpers and page objects
5. **Coverage**: Test critical user journeys thoroughly
6. **Documentation**: Keep this README updated

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
