import { defineConfig, devices } from '@playwright/test';

/**
 * Cross-Browser E2E Test Configuration
 * Tests run on: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
 *
 * Visual Regression Testing: Screenshot comparison across browsers
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only - increased for flaky visual regression tests */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI for stability */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter configuration - HTML report + JSON for CI */
  reporter: process.env.CI
    ? [
        ['html', { outputFolder: 'test-results/html-report' }],
        ['json', { outputFile: 'test-results/test-results.json' }],
        ['junit', { outputFile: 'test-results/junit.xml' }],
        ['list']
      ]
    : [
        ['list'],
        ['html', { open: 'never' }]
      ],

  /* Shared settings for all projects */
  use: {
    /* Base URL */
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',

    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',

    /* Screenshot settings - capture on failure for debugging */
    screenshot: 'only-on-failure',

    /* Video for CI debugging */
    video: process.env.CI ? 'retain-on-failure' : 'off',

    /* Extended timeout for slow CI environments */
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  /* Expect settings for visual regression tests */
  expect: {
    /* Timeout for assertions */
    timeout: 10000,

    /* Visual comparison settings */
    toHaveScreenshot: {
      /* Allow slight differences across browsers (anti-aliasing, font rendering) */
      maxDiffPixels: 100,
      threshold: 0.2,

      /* Animations can cause flakiness - ensure stable state */
      animations: 'disabled',
    },
  },

  /* Configure projects for major browsers - Desktop First */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 1,
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 1,
      },
    },

    {
      name: 'firefox-esr',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 1,
        // Firefox ESR (Extended Support Release) for enterprise compatibility
        // To test ESR specifically, set PLAYWRIGHT_FIREFOX_ESR=true
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 1,
      },
    },

    /* Mobile browsers - Critical for e-commerce */
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        /* Pixel 5: 393x851 viewport */
      },
    },

    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 12'],
        /* iPhone 12: 390x844 viewport */
      },
    },

    /* Additional mobile devices for comprehensive coverage */
    {
      name: 'iPhone SE',
      use: {
        ...devices['iPhone SE'],
        /* Small screen testing: 375x667 */
      },
    },

    {
      name: 'iPad',
      use: {
        ...devices['iPad Pro'],
        /* Tablet testing: 1024x1366 */
      },
    },

    /* Edge browser for Windows compatibility */
    {
      name: 'edge',
      use: {
        ...devices['Desktop Edge'],
        viewport: { width: 1280, height: 720 },
      },
    },

    {
      name: 'Android',
      use: {
        ...devices['Galaxy S9+'],
        /* Android testing: 412x846 */
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
