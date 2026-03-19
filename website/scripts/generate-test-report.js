#!/usr/bin/env node

/**
 * Cross-Browser Test Report Generator
 *
 * Analyzes Playwright test results and generates a comprehensive
 * report showing pass/fail rates by browser.
 *
 * Usage:
 *   node scripts/generate-test-report.js
 *
 * Requirements:
 *   - Test results in website/test-results/test-results.json
 */

const fs = require('fs');
const path = require('path');

// Configuration
const TEST_RESULTS_DIR = path.join(__dirname, '..', 'website', 'test-results');
const REPORT_OUTPUT = path.join(__dirname, '..', 'CROSS_BROWSER_TEST_REPORT.md');

// Browser list
const BROWSERS = [
  { id: 'chromium', name: 'Chromium (Chrome)', icon: '🌐' },
  { id: 'firefox', name: 'Firefox', icon: '🦊' },
  { id: 'webkit', name: 'WebKit (Safari)', icon: '🧭' },
  { id: 'edge', name: 'Edge', icon: '🌊' },
  { id: 'Mobile Chrome', name: 'Mobile Chrome', icon: '📱' },
  { id: 'Mobile Safari', name: 'Mobile Safari', icon: '📱' },
  { id: 'iPhone SE', name: 'iPhone SE', icon: '📱' },
  { id: 'iPad', name: 'iPad Pro', icon: '📱' },
  { id: 'Android', name: 'Android', icon: '🤖' },
];

// Test suites
const TEST_SUITES = [
  'homepage.spec.ts',
  'order-flow.spec.ts',
  'payment.spec.ts',
  'gallery.spec.ts',
  'cross-browser.spec.ts',
  'visual-regression.spec.ts',
  'accessibility.spec.ts',
  'smoke.spec.ts',
];

/**
 * Load test results from JSON file
 */
function loadTestResults() {
  const resultsPath = path.join(TEST_RESULTS_DIR, 'test-results.json');

  if (!fs.existsSync(resultsPath)) {
    console.error('❌ Test results not found:', resultsPath);
    console.log('Run tests first: npm run test:e2e');
    process.exit(1);
  }

  try {
    const data = fs.readFileSync(resultsPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Failed to parse test results:', error.message);
    process.exit(1);
  }
}

/**
 * Analyze test results by browser
 */
function analyzeResults(results) {
  const summary = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    flaky: 0,
    duration: 0,
    byBrowser: {},
    bySuite: {},
  };

  // Initialize browser stats
  BROWSERS.forEach((browser) => {
    summary.byBrowser[browser.id] = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      flaky: 0,
      duration: 0,
      tests: [],
    };
  });

  // Initialize suite stats
  TEST_SUITES.forEach((suite) => {
    summary.bySuite[suite] = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      byBrowser: {},
    };
  });

  // Process test results
  if (results.suites) {
    results.suites.forEach((suite) => {
      processSuite(suite, summary);
    });
  }

  return summary;
}

/**
 * Process a test suite recursively
 */
function processSuite(suite, summary) {
  // Process specs (test files)
  if (suite.specs) {
    suite.specs.forEach((spec) => {
      const suiteName = suite.title || 'unknown';
      const specFile = spec.file ? path.basename(spec.file) : 'unknown';

      spec.tests.forEach((test) => {
        test.results.forEach((result) => {
          // Determine browser from project name
          const browser = result.workerIndex !== undefined ? BROWSERS[0].id : 'chromium';
          const projectName = test.projectName || 'chromium';

          // Update overall stats
          summary.total++;
          summary.duration += result.duration || 0;

          // Update status counts
          const status = result.status;
          if (status === 'passed') summary.passed++;
          else if (status === 'failed') summary.failed++;
          else if (status === 'skipped') summary.skipped++;
          else if (status === 'flaky') summary.flaky++;

          // Update browser stats
          if (summary.byBrowser[projectName]) {
            summary.byBrowser[projectName].total++;
            summary.byBrowser[projectName].duration += result.duration || 0;

            if (status === 'passed') summary.byBrowser[projectName].passed++;
            else if (status === 'failed') summary.byBrowser[projectName].failed++;
            else if (status === 'skipped') summary.byBrowser[projectName].skipped++;
            else if (status === 'flaky') summary.byBrowser[projectName].flaky++;

            summary.byBrowser[projectName].tests.push({
              title: test.title,
              status: status,
              duration: result.duration || 0,
              file: specFile,
            });
          }

          // Update suite stats
          if (summary.bySuite[specFile]) {
            summary.bySuite[specFile].total++;

            if (status === 'passed') summary.bySuite[specFile].passed++;
            else if (status === 'failed') summary.bySuite[specFile].failed++;
            else if (status === 'skipped') summary.bySuite[specFile].skipped++;
          }
        });
      });
    });
  }

  // Process child suites recursively
  if (suite.suites) {
    suite.suites.forEach((childSuite) => {
      processSuite(childSuite, summary);
    });
  }
}

/**
 * Generate markdown report
 */
function generateReport(summary) {
  const timestamp = new Date().toISOString();
  const passRate = summary.total > 0 ? ((summary.passed / summary.total) * 100).toFixed(1) : 0;

  let report = '';

  // Header
  report += `# Cross-Browser Test Report\n\n`;
  report += `**Generated:** ${timestamp}\n`;
  report += `**Total Tests:** ${summary.total}\n`;
  report += `**Overall Pass Rate:** ${passRate}%\n\n`;
  report += `---\n\n`;

  // Executive Summary
  report += `## 📊 Executive Summary\n\n`;
  report += `| Metric | Count | Percentage |\n`;
  report += `|--------|-------|------------|\n`;
  report += `| ✅ Passed | ${summary.passed} | ${((summary.passed / summary.total) * 100).toFixed(1)}% |\n`;
  report += `| ❌ Failed | ${summary.failed} | ${((summary.failed / summary.total) * 100).toFixed(1)}% |\n`;
  report += `| ⏭️ Skipped | ${summary.skipped} | ${((summary.skipped / summary.total) * 100).toFixed(1)}% |\n`;
  report += `| 🔄 Flaky | ${summary.flaky} | ${((summary.flaky / summary.total) * 100).toFixed(1)}% |\n`;
  report += `| ⏱️ Duration | ${(summary.duration / 1000).toFixed(1)}s | - |\n`;
  report += `\n`;

  // Browser Breakdown
  report += `## 🌐 Results by Browser\n\n`;
  report += `| Browser | Total | Passed | Failed | Skipped | Pass Rate | Duration |\n`;
  report += `|---------|-------|--------|--------|---------|-----------|----------|\n`;

  BROWSERS.forEach((browser) => {
    const stats = summary.byBrowser[browser.id];
    if (stats && stats.total > 0) {
      const browserPassRate = ((stats.passed / stats.total) * 100).toFixed(1);
      report += `| ${browser.icon} ${browser.name} | ${stats.total} | ${stats.passed} | ${stats.failed} | ${stats.skipped} | ${browserPassRate}% | ${(stats.duration / 1000).toFixed(1)}s |\n`;
    }
  });
  report += `\n`;

  // Test Suite Breakdown
  report += `## 📝 Results by Test Suite\n\n`;
  report += `| Test Suite | Total | Passed | Failed | Skipped | Pass Rate |\n`;
  report += `|------------|-------|--------|--------|---------|----------|\n`;

  TEST_SUITES.forEach((suite) => {
    const stats = summary.bySuite[suite];
    if (stats && stats.total > 0) {
      const suitePassRate = ((stats.passed / stats.total) * 100).toFixed(1);
      const status = stats.failed === 0 ? '✅' : '❌';
      report += `| ${status} ${suite} | ${stats.total} | ${stats.passed} | ${stats.failed} | ${stats.skipped} | ${suitePassRate}% |\n`;
    }
  });
  report += `\n`;

  // Failed Tests
  if (summary.failed > 0) {
    report += `## ❌ Failed Tests\n\n`;

    BROWSERS.forEach((browser) => {
      const stats = summary.byBrowser[browser.id];
      if (stats && stats.tests) {
        const failedTests = stats.tests.filter((t) => t.status === 'failed');

        if (failedTests.length > 0) {
          report += `### ${browser.icon} ${browser.name}\n\n`;
          failedTests.forEach((test) => {
            report += `- ❌ **${test.title}** (${test.file})\n`;
          });
          report += `\n`;
        }
      }
    });
  }

  // Recommendations
  report += `## 💡 Recommendations\n\n`;

  if (summary.failed > 0) {
    report += `- ⚠️ **${summary.failed} tests failed** - Review failures and fix issues\n`;
  }

  if (summary.flaky > 0) {
    report += `- 🔄 **${summary.flaky} flaky tests** - Investigate and stabilize\n`;
  }

  if (passRate < 100) {
    report += `- 📈 **Target: 100% pass rate** - Current: ${passRate}%\n`;
  } else {
    report += `- ✅ **All tests passing!** - Great job!\n`;
  }

  report += `\n`;

  // Footer
  report += `---\n\n`;
  report += `**Report generated by:** \`scripts/generate-test-report.js\`\n`;
  report += `**Documentation:** [BROWSER_TEST_COVERAGE.md](./BROWSER_TEST_COVERAGE.md)\n`;

  return report;
}

/**
 * Main execution
 */
function main() {
  console.log('📊 Generating Cross-Browser Test Report...\n');

  // Load results
  console.log('📁 Loading test results...');
  const results = loadTestResults();

  // Analyze results
  console.log('🔍 Analyzing results...');
  const summary = analyzeResults(results);

  // Generate report
  console.log('📝 Generating report...');
  const report = generateReport(summary);

  // Write report
  fs.writeFileSync(REPORT_OUTPUT, report, 'utf8');
  console.log(`\n✅ Report generated: ${REPORT_OUTPUT}`);

  // Output summary to console
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${summary.total}`);
  console.log(`Passed: ${summary.passed} (${((summary.passed / summary.total) * 100).toFixed(1)}%)`);
  console.log(`Failed: ${summary.failed}`);
  console.log(`Skipped: ${summary.skipped}`);
  console.log(`Duration: ${(summary.duration / 1000).toFixed(1)}s`);
  console.log('='.repeat(60) + '\n');

  // Exit with error if tests failed
  if (summary.failed > 0) {
    console.error(`❌ ${summary.failed} tests failed`);
    process.exit(1);
  }

  console.log('✅ All tests passed!');
  process.exit(0);
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { loadTestResults, analyzeResults, generateReport };
