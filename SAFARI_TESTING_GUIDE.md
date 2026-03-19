# Safari & iOS Testing Guide

**Engineer 1 - Cross-Browser Testing Team**

This guide provides step-by-step instructions for testing Pawcasso Atelier on Safari and iOS devices to identify webkit-specific bugs.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Running Automated Tests](#running-automated-tests)
3. [Manual Testing Procedures](#manual-testing-procedures)
4. [Bug Reporting](#bug-reporting)
5. [Common Webkit Issues](#common-webkit-issues)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools
- [ ] macOS with Safari 15.4 or later
- [ ] Physical iPhone (SE or 14 preferred)
- [ ] Physical iPad (optional but recommended)
- [ ] Xcode (for iOS Simulator if physical devices unavailable)
- [ ] Node.js and npm installed
- [ ] Playwright installed: `npm install`

### Optional Tools
- [ ] BrowserStack account (for remote device testing)
- [ ] Charles Proxy or similar (for network debugging)
- [ ] Safari Technology Preview (for testing upcoming features)

---

## Running Automated Tests

### 1. Start Development Server

```bash
cd /Users/michaelguo/pawcasso-atelier/website
npm run dev
```

Wait for server to start on `http://localhost:3000`

### 2. Run Webkit-Specific Tests

```bash
# Run all webkit tests (Desktop Safari)
npm run test:e2e -- --project=webkit

# Run Mobile Safari tests (iPhone 12 emulation)
npm run test:e2e -- --project="Mobile Safari"

# Run iPhone SE tests (small screen)
npm run test:e2e -- --project="iPhone SE"

# Run iPad tests
npm run test:e2e -- --project=iPad

# Run webkit compatibility test suite only
npm run test:e2e -- webkit-compatibility.spec.ts --project=webkit

# Run all iOS/Safari tests
npm run test:e2e -- --project=webkit --project="Mobile Safari" --project="iPhone SE" --project=iPad
```

### 3. View Test Results

```bash
# Open HTML report
npm run test:e2e:report

# Run tests in UI mode for debugging
npm run test:e2e:ui -- --project=webkit
```

### 4. Debug Failed Tests

```bash
# Run tests in headed mode (see browser)
npm run test:e2e -- --project=webkit --headed

# Run tests in debug mode
npm run test:e2e -- --project=webkit --debug
```

---

## Manual Testing Procedures

### Desktop Safari Testing

#### Homepage Test
1. Open Safari on macOS
2. Navigate to: https://pawcasso-atelier.vercel.app/
3. **Visual Check:**
   - [ ] Hero section displays correctly
   - [ ] Gradient text renders (gold gradient on "Animal")
   - [ ] CTA buttons have proper styling
   - [ ] Animations play smoothly (fade-in, slide-up)
   - [ ] Trust badges visible
   - [ ] Social proof stats load
4. **Interaction Check:**
   - [ ] Click "Order Your Portrait" button - navigates to /order
   - [ ] Click "Follow Us" Instagram button - opens in new tab
   - [ ] Scroll down - smooth scrolling works
   - [ ] Hover over gallery images - scale effect works
5. **Console Check:**
   - Open Safari Developer Tools (Cmd+Option+I)
   - Check Console tab for errors
   - No webkit-specific warnings

#### Gallery Test
1. Navigate to: https://pawcasso-atelier.vercel.app/gallery
2. **Visual Check:**
   - [ ] Gallery grid displays 3 columns (desktop)
   - [ ] All images load (check for broken images)
   - [ ] Filter chips display correctly
   - [ ] Image aspect ratios correct (3:4)
3. **Interaction Check:**
   - [ ] Click filter chips (Style/Animal) - grid updates
   - [ ] Click gallery image - lightbox opens
   - [ ] In lightbox: image displays full size
   - [ ] In lightbox: close button works
   - [ ] In lightbox: ESC key closes
4. **Performance Check:**
   - Safari > Develop > Show Web Inspector > Timelines
   - Record page load
   - Verify LCP < 2.5s

#### Order Page Test
1. Navigate to: https://pawcasso-atelier.vercel.app/order
2. **Visual Check:**
   - [ ] Tier selection cards display
   - [ ] Pricing comparison visible
   - [ ] Form inputs styled correctly
   - [ ] Style preview images load
3. **Interaction Check:**
   - [ ] File upload button works (if present)
   - [ ] Select tier - visual feedback
   - [ ] Choose style - preview updates
   - [ ] Form validation works
   - [ ] Checkout button enabled after required fields
4. **Payment Check:**
   - [ ] Stripe.js loads (check Network tab)
   - [ ] Payment button renders
   - [ ] No console errors related to Stripe

### Mobile Safari Testing (Physical iPhone)

#### Setup
1. Connect iPhone to Mac via USB
2. On iPhone: Settings > Safari > Advanced > Enable Web Inspector
3. On Mac: Safari > Develop > [Your iPhone] > [pawcasso-atelier.vercel.app]

#### Homepage Test (iPhone)
1. Open Safari on iPhone
2. Navigate to: https://pawcasso-atelier.vercel.app/
3. **Visual Check:**
   - [ ] Hero text readable (not too small)
   - [ ] CTA buttons have adequate size (44px min)
   - [ ] No content behind notch (iPhone 14)
   - [ ] Bottom spacing from home indicator
   - [ ] Images load at correct size
4. **Touch Interaction:**
   - [ ] Tap "Order Your Portrait" - responds immediately
   - [ ] No double-tap zoom on buttons
   - [ ] Tap highlight color shows (gold tint)
   - [ ] Scroll is smooth and fluid
   - [ ] No horizontal overflow scrolling
5. **Viewport Check:**
   - Rotate to landscape
   - [ ] Content adapts correctly
   - [ ] No layout breaks
   - [ ] Safe areas still respected

#### Gallery Test (iPhone)
1. Navigate to gallery on iPhone
2. **Visual Check:**
   - [ ] Gallery shows 1 column (portrait)
   - [ ] Filter chips scroll horizontally
   - [ ] Touch targets adequate size
3. **Touch Interaction:**
   - [ ] Swipe filter chips left/right - smooth scrolling
   - [ ] Tap filter chip - selection works
   - [ ] Tap gallery image - lightbox opens
   - [ ] In lightbox: pinch to zoom works
   - [ ] In lightbox: swipe to close works
4. **Image Loading:**
   - [ ] Lazy loading works (scroll to see)
   - [ ] No broken images
   - [ ] WebP format loads (Safari 14+)

#### Order Page Test (iPhone)
1. Navigate to order page on iPhone
2. **Form Input Check:**
   - [ ] Tap text input - no zoom occurs (16px font)
   - [ ] Keyboard appears correctly
   - [ ] Input fields don't get hidden by keyboard
   - [ ] Form scrolls to keep active field visible
3. **File Upload Check (CRITICAL):**
   - [ ] Tap file upload button
   - [ ] iOS action sheet appears with options:
     - "Take Photo"
     - "Photo Library"
     - "Browse"
   - [ ] Select photo from library - loads correctly
   - [ ] Preview image displays
   - [ ] Can change photo selection
4. **Checkout Flow:**
   - [ ] Tier selection cards tappable
   - [ ] Style selection works
   - [ ] Checkout button visible at bottom
   - [ ] Sticky checkout bar doesn't cover content

### iPad Testing

1. Open Safari on iPad
2. Test in both portrait and landscape
3. **Layout Check:**
   - [ ] Gallery shows 2-3 columns
   - [ ] Homepage adapts to tablet layout
   - [ ] No awkward spacing or gaps
4. **Touch Interaction:**
   - [ ] All touch targets work
   - [ ] Hover states trigger on tap (not hover)
   - [ ] Form inputs work correctly

---

## Bug Reporting

### How to Report a Bug

1. **Take Screenshots:**
   - On Mac: Cmd+Shift+4
   - On iPhone: Volume Up + Side button
   - On iPad: Top button + Volume Up

2. **Gather Device Info:**
   - Safari version: Safari > About Safari
   - iOS version: Settings > General > About
   - Device model: Settings > General > About > Model Name

3. **Document Steps:**
   - Write clear reproduction steps
   - Note expected vs actual behavior
   - Include any console errors

4. **Create Bug Report:**

   Use this template in `SAFARI_BUGS.md`:

   ```markdown
   ### Bug ID: SAFARI-XXX
   **Severity:** High | Medium | Low
   **Area:** Homepage | Gallery | Order | Blog
   **Device:** iPhone 14 Pro / Safari 17.2 macOS
   **iOS Version:** 17.2 (if applicable)

   **Description:**
   Clear description of the issue

   **Steps to Reproduce:**
   1. Navigate to [URL]
   2. Click/tap [element]
   3. Observe [issue]

   **Expected Behavior:**
   What should happen

   **Actual Behavior:**
   What actually happens

   **Screenshot:**
   ![Bug Screenshot](path/to/screenshot.png)

   **Console Errors:**
   ```
   [Paste any console errors here]
   ```

   **Workaround:**
   Temporary fix (if any)

   **Proposed Fix:**
   Suggested solution

   **Status:** Open
   ```

---

## Common Webkit Issues to Watch For

### Image Issues
- **WebP not loading:** Safari < 14 doesn't support WebP
  - Check Network tab for 404s
  - Verify Next.js Image component serves fallback
- **Image flickering:** Missing `-webkit-backface-visibility: hidden`
- **Blurry images:** Check image DPI and srcset

### Layout Issues
- **CSS Grid gaps:** May render differently than Chrome
- **Flexbox alignment:** Check vendor prefixes
- **Position sticky:** May need `-webkit-sticky`
- **Safe area insets:** Content under notch/home indicator

### Form Issues
- **Input zoom:** Font size < 16px causes zoom on focus
- **File upload:** iOS restrictions on camera/photo access
- **Autofill styling:** Yellow background on autofilled inputs
- **Keyboard covering inputs:** Need scroll adjustment

### Performance Issues
- **Backdrop filter lag:** Glass morphism effects can be slow
- **Transform jank:** Not hardware accelerated
- **Scroll performance:** Missing `-webkit-overflow-scrolling: touch`
- **Animation stutter:** Too many concurrent animations

### Touch Issues
- **Double-tap zoom:** Not prevented on interactive elements
- **Touch targets too small:** < 44px height/width
- **Horizontal scroll:** Not working on filter chips
- **Long-press menu:** Appears on images/links when unwanted

---

## Troubleshooting

### Test Failures

**Problem:** Playwright tests timeout
**Solution:**
```bash
# Increase timeout
npm run test:e2e -- --project=webkit --timeout=60000

# Or start dev server manually first
npm run dev
# Then in another terminal:
npm run test:e2e -- --project=webkit
```

**Problem:** Webkit browser not found
**Solution:**
```bash
# Install Playwright browsers
npx playwright install webkit
```

**Problem:** Screenshots don't match
**Solution:**
- Webkit renders fonts slightly differently
- Adjust threshold in playwright.config.ts
- Update baseline screenshots

### Device Testing Issues

**Problem:** iPhone not appearing in Safari > Develop menu
**Solution:**
1. Unplug and replug USB cable
2. On iPhone: Trust this computer
3. Enable Web Inspector in iPhone Settings
4. Restart Safari on Mac

**Problem:** Can't test file upload in simulator
**Solution:**
- Use physical device for file upload testing
- Simulator has limited photo library access

**Problem:** Safe area insets not showing
**Solution:**
- Must test on physical device with notch (iPhone X+)
- Simulator may not accurately represent safe areas

---

## Testing Checklist

Use this checklist to track your testing progress:

### Automated Tests
- [ ] Webkit desktop tests pass
- [ ] Mobile Safari tests pass
- [ ] iPhone SE tests pass
- [ ] iPad tests pass
- [ ] No console errors in webkit browser

### Manual Desktop Safari
- [ ] Homepage renders correctly
- [ ] Gallery images load
- [ ] Order page functional
- [ ] Blog pages render
- [ ] Animations smooth
- [ ] No layout issues

### Manual iOS Safari (iPhone)
- [ ] Homepage mobile layout
- [ ] Gallery grid (1 column)
- [ ] Filter chips scroll
- [ ] Touch targets adequate
- [ ] File upload works
- [ ] Payment flow functional
- [ ] No zoom on input focus

### Manual iPad Safari
- [ ] Tablet layout (2-3 columns)
- [ ] Touch interactions work
- [ ] Form inputs functional
- [ ] Portrait & landscape modes

### Performance
- [ ] LCP < 2.5s on Safari
- [ ] No layout shifts (CLS < 0.1)
- [ ] Animations smooth (60fps)
- [ ] Images lazy load correctly

---

## Next Steps After Testing

1. **Document all bugs** in SAFARI_BUGS.md
2. **Prioritize fixes** by severity (High > Medium > Low)
3. **Implement webkit fixes** in webkit-fixes.css
4. **Add regression tests** to webkit-compatibility.spec.ts
5. **Verify fixes** on actual devices
6. **Update documentation** with findings
7. **Run full test suite** before deployment

---

## Resources

- [Safari Developer Documentation](https://developer.apple.com/safari/)
- [Webkit Bug Database](https://bugs.webkit.org/)
- [Can I Use - WebKit Support](https://caniuse.com/)
- [Playwright Webkit Testing](https://playwright.dev/docs/browsers#webkit)
- [iOS Safari Quirks](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/)

---

**Happy Testing!** 🧪

If you find any critical bugs, escalate immediately. File upload and payment flow are highest priority for conversion funnel.
