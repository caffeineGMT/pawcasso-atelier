# Firefox Testing Guide - Pawcasso Atelier

## Quick Start

### Run Firefox Tests
```bash
cd website

# Run all Firefox tests
npm run test:e2e -- --project=firefox

# Run Firefox-specific test suite
npm run test:e2e -- --project=firefox firefox-specific.spec.ts

# Run Firefox ESR tests
PLAYWRIGHT_FIREFOX_ESR=true npm run test:e2e -- --project=firefox-esr

# Run with headed mode (visible browser)
npm run test:e2e -- --project=firefox --headed

# Run in debug mode
npm run test:e2e -- --project=firefox --debug
```

### Run Specific Test Categories
```bash
# Payment flow tests only
npm run test:e2e -- --project=firefox --grep="Payment"

# Form validation tests
npm run test:e2e -- --project=firefox --grep="Form"

# CSS rendering tests
npm run test:e2e -- --project=firefox --grep="CSS"

# Mobile Firefox tests
npm run test:e2e -- --project=firefox --grep="Mobile"
```

## Manual Testing Checklist

### Prerequisites
- Firefox latest stable (124+)
- Firefox ESR 115 (download from [Mozilla ESR](https://www.mozilla.org/en-US/firefox/enterprise/))
- Firefox Developer Edition (optional, for testing latest features)

### Critical Tests

#### 1. Payment Flow (CRITICAL)
**Test on both macOS and Windows Firefox**

- [ ] Navigate to https://localhost:3000/order
- [ ] Verify Stripe Elements loads (check console for errors)
- [ ] Enter test card: `4242 4242 4242 4242`
- [ ] Expiry: `12/34`, CVC: `123`
- [ ] Submit payment
- [ ] Verify redirect to `/thank-you`
- [ ] Check for console errors during entire flow

**Expected Result:** Payment completes successfully without errors.

**Firefox-Specific Issues to Watch:**
- iFrame focus issues (can you tab into Stripe card field?)
- Payment Request button should NOT appear (no Apple Pay/Google Pay on Firefox)
- Card input fields should be styled correctly (dark theme maintained)

#### 2. Form Autofill Styling (HIGH)
**Test Dark Theme Compatibility**

- [ ] Navigate to `/order`
- [ ] Let Firefox autofill email/name fields
- [ ] Verify background is DARK, not light yellow/blue

**Expected Result:** Autofilled fields maintain dark theme.

**Before Fix:** Light yellow/blue background breaks dark theme.
**After Fix:** Dark background with gold border accent.

#### 3. Backdrop Filter Fallback (MEDIUM)
**Test Modal Appearance**

- [ ] Trigger checkout upsell modal
- [ ] Check modal background blur effect
- [ ] Test on Firefox ESR 115 (may not have blur)

**Expected Result:**
- Firefox 103+: Blur effect visible
- Firefox ESR < 103: Solid dark background (no blur, but still usable)

#### 4. File Upload (MEDIUM)
**Test Image Upload**

- [ ] Navigate to `/order`
- [ ] Drag & drop a pet photo
- [ ] Try uploading HEIC file (macOS only)
- [ ] Try uploading HEIC file on Windows/Linux

**Expected Result:**
- macOS: HEIC works
- Windows/Linux: HEIC shows error (expected limitation)

#### 5. Text Gradients (LOW)
**Verify Gold Gradient Rendering**

- [ ] Navigate to homepage
- [ ] Check headline text gradients
- [ ] Inspect element and verify `background-clip: text`

**Expected Result:** Gold gradients render correctly.

#### 6. Smooth Scrolling (LOW)
**Test Anchor Link Scrolling**

- [ ] Click anchor links on FAQ page
- [ ] Verify smooth scroll animation

**Expected Result:** Smooth scrolling works (supported since Firefox 36).

### Visual Regression Testing

#### Take Screenshots for Comparison

```bash
# Generate baseline screenshots (Chrome)
npm run test:e2e -- --project=chromium --update-snapshots

# Generate Firefox screenshots
npm run test:e2e -- --project=firefox --update-snapshots

# Compare screenshots
npm run test:e2e -- firefox-specific.spec.ts
```

#### Pages to Screenshot
- `/` - Homepage
- `/order` - Order form
- `/gallery` - Gallery grid
- `/faq` - Long scrolling page
- Modals (upsell, email capture)

### Mobile Firefox Testing

#### Firefox Android
**Install Firefox on Android device or emulator**

- [ ] Navigate to order page
- [ ] Verify touch targets >= 44px
- [ ] Test file upload from camera
- [ ] Check input zoom behavior (should not zoom on focus)
- [ ] Verify safe area insets on notched devices

**Expected Result:** Fully functional on mobile.

## Browser Detection

### Verify Firefox Is Detected

Open DevTools Console and run:

```javascript
// Should return true on Firefox
/firefox/i.test(navigator.userAgent)

// Should add 'is-firefox' class to <html>
document.documentElement.classList.contains('is-firefox')

// Check backdrop-filter support
CSS.supports('backdrop-filter', 'blur(10px)')

// Check WebP support
const canvas = document.createElement('canvas');
canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
```

## Known Issues & Workarounds

### Issue 1: Payment Request API Not Supported
**Problem:** Firefox doesn't support Payment Request API.
**Impact:** No Apple Pay/Google Pay button.
**Workaround:** Standard Stripe card form appears instead.
**Status:** Expected limitation, not a bug.

### Issue 2: HEIC Upload on Windows/Linux
**Problem:** Firefox on Windows/Linux cannot read HEIC files.
**Impact:** iPhone users on Windows cannot upload photos directly.
**Workaround:** Convert HEIC to JPEG on device or use server-side conversion.
**Status:** OS limitation, requires server-side fix.

### Issue 3: Backdrop Filter on ESR
**Problem:** Firefox ESR 115 may not have `backdrop-filter` enabled.
**Impact:** Modals lack blur effect.
**Workaround:** CSS fallback provides solid background.
**Status:** Graceful degradation working.

### Issue 4: Autofill Light Backgrounds
**Problem:** Default Firefox autofill uses light colors.
**Impact:** Breaks dark theme aesthetic.
**Solution:** `firefox-fixes.css` added to override autofill styling.
**Status:** FIXED in this PR.

## Performance Testing

### Lighthouse on Firefox

Firefox doesn't support Lighthouse directly, but you can use:

1. **WebPageTest** - https://www.webpagetest.org/
   - Select Firefox browser
   - Test performance on real devices

2. **Firefox Profiler** - https://profiler.firefox.com/
   - Record performance profile
   - Analyze rendering bottlenecks

### Animation Performance

Check for janky animations:

```javascript
// Open Firefox DevTools > Performance
// Start recording
// Trigger animations (modal open/close, page scroll)
// Stop recording
// Look for long frames (>16ms = jank)
```

**Target:** 60fps (16ms per frame)

## Debugging Tools

### Firefox DevTools

**Useful Panels:**
1. **Inspector** - Check applied CSS styles
2. **Console** - JavaScript errors
3. **Network** - Stripe API calls
4. **Performance** - Animation jank
5. **Accessibility** - ARIA attributes

### about:config Tweaks for Testing

Open `about:config` and modify:

```
# Enable backdrop-filter (if disabled)
layout.css.backdrop-filter.enabled = true

# Disable localStorage (test fallback)
dom.storage.enabled = false

# Enable privacy mode (test fingerprinting resistance)
privacy.resistFingerprinting = true

# Force prefers-reduced-motion
ui.prefersReducedMotion = 1
```

### Responsive Design Mode

- **Shortcut:** `Ctrl+Shift+M` (Windows/Linux) or `Cmd+Opt+M` (macOS)
- Test mobile viewports
- Simulate touch events
- Throttle network speed

## CI/CD Integration

### GitHub Actions

Add to `.github/workflows/test.yml`:

```yaml
- name: Install Playwright Browsers
  run: |
    cd website
    npx playwright install firefox

- name: Run Firefox Tests
  run: |
    cd website
    npm run test:e2e -- --project=firefox
  env:
    STRIPE_SECRET_KEY_TEST: ${{ secrets.STRIPE_SECRET_KEY_TEST }}

- name: Run Firefox ESR Tests
  run: |
    cd website
    PLAYWRIGHT_FIREFOX_ESR=true npm run test:e2e -- --project=firefox-esr

- name: Upload Firefox Test Results
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: firefox-test-results
    path: website/test-results/
```

## Reporting Bugs

### Bug Report Template

```markdown
**Browser:** Firefox [VERSION] (e.g., Firefox 124.0)
**OS:** [macOS/Windows/Linux] [VERSION]
**URL:** [Full URL where issue occurs]

**Steps to Reproduce:**
1. Navigate to...
2. Click on...
3. Observe...

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Screenshots:**
[Attach comparison: Chrome vs Firefox]

**Console Errors:**
[Copy/paste any console errors]

**Firefox DevTools Network:**
[Any failed requests?]
```

### Submit to
- GitHub Issues: Tag with `browser:firefox`
- Slack: #firefox-testing channel

## Resources

### Documentation
- [Firefox Release Notes](https://www.mozilla.org/en-US/firefox/releases/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Firefox ESR Download](https://www.mozilla.org/en-US/firefox/enterprise/)
- [Playwright Firefox Docs](https://playwright.dev/docs/browsers#firefox)

### Tools
- Firefox Developer Edition: https://www.mozilla.org/firefox/developer/
- Firefox Profiler: https://profiler.firefox.com/
- WebPageTest: https://www.webpagetest.org/

## FAQ

### Q: Why test Firefox if it has low market share?
**A:** Firefox ESR is used by enterprises, governments, and privacy-conscious users. It's important for accessibility and reaching diverse audiences.

### Q: How do I install Firefox ESR?
**A:** Download from https://www.mozilla.org/en-US/firefox/enterprise/

### Q: Do I need to test every Firefox version?
**A:** No. Test:
- Latest stable (124+)
- Latest ESR (115)
- Skip old versions (<100)

### Q: What if Stripe doesn't work on Firefox?
**A:** This is a CRITICAL issue. Check:
1. Is Stripe.js loaded? (Check console)
2. Are there CORS errors?
3. Is the iframe rendering?
4. Can you focus the card input field?

### Q: Can I skip mobile Firefox testing?
**A:** No. Firefox on Android has ~5% mobile market share and behaves differently than desktop.

## Next Steps

After completing Firefox testing:

1. ✅ Review test results
2. ✅ Fix any critical bugs found
3. ✅ Update `FIREFOX_BUGS.md` with findings
4. ✅ Run visual regression tests
5. ✅ Get sign-off from QA team
6. ✅ Merge Firefox fixes to main
7. ✅ Deploy to staging
8. ✅ Re-test on staging environment
9. ✅ Monitor production for Firefox-specific errors

## Contact

**Firefox Testing Team:**
- Engineer 2 (Cross-Browser Testing Lead)
- Slack: #cross-browser-testing
- Email: engineering@pawcasso.com

**Escalation:**
- Critical Firefox bugs: Immediately notify CTO
- Non-critical issues: Create GitHub issue with `browser:firefox` label
