# Safari & iOS Webkit Testing Report

**Testing Date:** March 19, 2026
**Site:** https://pawcasso-atelier.vercel.app/
**Tester:** Engineer 1, Cross-Browser Testing Team
**Target Browsers:** Safari 15.4+, iOS Safari 15+, iPadOS Safari 15+

---

## Executive Summary

This document tracks all webkit-specific bugs, compatibility issues, and mobile Safari quirks discovered during cross-browser testing of Pawcasso Atelier. The site has been designed with webkit compatibility in mind, but additional testing is required to verify behavior on actual Safari/iOS devices.

**Current Status:** ⚠️ TESTING IN PROGRESS

---

## Testing Coverage

### ✅ Already Implemented Webkit Fixes

The codebase already includes several webkit-specific optimizations:

1. **CSS Vendor Prefixes**
   - `-webkit-font-smoothing: antialiased` (globals.css:35)
   - `-webkit-background-clip: text` for gradient text (globals.css:130)
   - `-webkit-backdrop-filter` for glass morphism (globals.css:139)
   - `-webkit-tap-highlight-color` for touch feedback (globals.css:239, 243)
   - `-webkit-user-select: none` for non-selectable elements (globals.css:248)
   - `-webkit-overflow-scrolling: touch` for momentum scrolling (mobile-enhancements.css:88, 141)
   - `-webkit-text-size-adjust: 100%` to prevent text size changes (mobile-enhancements.css:162)

2. **iOS-Specific Optimizations**
   - 16px minimum font size on inputs to prevent zoom (mobile-enhancements.css:9-14)
   - Safe area insets for notched devices (globals.css:223-264)
   - iOS 100vh viewport bug fix (browser-compat.ts:96-104)
   - Touch event detection and handling (browser-compat.ts:156-159)

3. **Browser Detection**
   - Safari detection utility (browser-compat.ts:10-13)
   - iOS detection (browser-compat.ts:26-29)
   - Backdrop-filter support detection (browser-compat.ts:52-56)
   - Safe area inset calculation (browser-compat.ts:69-86)

---

## Known Webkit Issues to Test

### 🔴 HIGH PRIORITY

#### 1. Image Format Support (WebP)
**Area:** Gallery page, Homepage featured gallery, Order page style previews
**Issue:** Older Safari versions (pre-14) don't support WebP images
**Test:**
- [ ] Verify all images load on Safari 14+
- [ ] Check fallback behavior on Safari 13 (if possible)
- [ ] Test Next.js Image component automatic format conversion

**File Locations:**
- `/website/src/components/GalleryGrid.tsx` (lines 90-101)
- `/website/src/app/gallery/page.tsx`
- `/website/src/app/page.tsx` (featured gallery)

**Expected Behavior:** Next.js should automatically serve WebP to Safari 14+ and JPEG/PNG to older versions

---

#### 2. File Upload on iOS Safari
**Area:** Order page - Pet photo upload
**Issue:** iOS Safari has restrictions on file input behavior, especially with `accept` attribute
**Test:**
- [ ] Test file picker opens correctly on iPhone/iPad
- [ ] Verify camera/photo library options appear
- [ ] Check file size validation works
- [ ] Test upload progress indicators
- [ ] Verify preview image displays after selection

**File Locations:**
- `/website/src/app/order/page.tsx` (check for file input implementation)

**Known iOS Quirks:**
- File input must be triggered by user gesture (no programmatic clicks)
- `accept="image/*"` should work but test with specific MIME types
- Camera access requires HTTPS

---

#### 3. CSS Grid Layout Consistency
**Area:** Gallery grid, Homepage layout
**Issue:** CSS Grid rendering differences between webkit and other browsers
**Test:**
- [ ] Verify 3-column grid on desktop Safari
- [ ] Check 2-column grid on iPad
- [ ] Test 1-column grid on iPhone
- [ ] Verify aspect ratios maintain (3:4 for gallery images)

**File Locations:**
- `/website/src/components/GalleryGrid.tsx` (line 73)
- `/website/src/app/page.tsx` (line 143)

---

#### 4. Backdrop Filter Performance
**Area:** Glass morphism effects, modals, overlays
**Issue:** `-webkit-backdrop-filter` can cause performance issues on older devices
**Test:**
- [ ] Test glass morphism on order page
- [ ] Verify backdrop blur doesn't lag on scroll
- [ ] Check modal overlays render correctly
- [ ] Test on iPhone SE (older hardware)

**File Locations:**
- `/website/src/app/globals.css` (lines 136-140)
- Check for `.glass` class usage throughout app

---

#### 5. Smooth Scrolling
**Area:** All pages with anchor links and scroll behavior
**Issue:** Safari 15.3 and below don't support `scroll-behavior: smooth`
**Test:**
- [ ] Verify smooth scroll polyfill works (browser-compat.ts)
- [ ] Test anchor link navigation
- [ ] Check scroll-to-top behavior

**File Locations:**
- `/website/src/app/globals.css` (lines 17-29)
- `/website/src/lib/browser-compat.ts` (lines 119-151)

---

### 🟡 MEDIUM PRIORITY

#### 6. Touch Event Handling
**Area:** Gallery filters, carousel interactions, form inputs
**Issue:** Touch events may behave differently than mouse events
**Test:**
- [ ] Test horizontal scroll on filter chips (gallery page)
- [ ] Verify touch-action: pan-x works (gallery/page.tsx line 91)
- [ ] Check double-tap zoom is prevented on buttons
- [ ] Test swipe gestures on mobile

**File Locations:**
- `/website/src/app/gallery/page.tsx` (lines 91, 122)
- `/website/src/app/mobile-enhancements.css` (line 33)

---

#### 7. Form Input Behavior
**Area:** Order page form, contact forms
**Issue:** iOS Safari handles form validation and autofill differently
**Test:**
- [ ] Test HTML5 validation messages display correctly
- [ ] Verify autofill works for email/name fields
- [ ] Check input focus doesn't cause page zoom (16px min font check)
- [ ] Test custom validation UI

**File Locations:**
- `/website/src/lib/form-validation.ts` (modified file in git status)
- `/website/src/app/mobile-enhancements.css` (lines 37-48)

---

#### 8. Payment Button Rendering (Stripe)
**Area:** Order page - Stripe checkout button
**Issue:** Stripe Elements may render differently in Safari
**Test:**
- [ ] Verify Stripe.js loads correctly
- [ ] Check payment button styling
- [ ] Test 3D Secure flow on iOS Safari
- [ ] Verify Apple Pay integration (if enabled)

**File Locations:**
- `/website/e2e/payment.spec.ts` (lines 21-32)
- Order page Stripe Elements implementation

---

#### 9. CSS Animations & Transitions
**Area:** Homepage hero animations, gallery hover effects, page transitions
**Issue:** Webkit may handle transforms and animations differently
**Test:**
- [ ] Test fade-in-up animations on homepage
- [ ] Verify gallery hover effects work (scale transforms)
- [ ] Check for animation jank on scroll
- [ ] Test with "prefers-reduced-motion"

**File Locations:**
- `/website/src/app/globals.css` (lines 44-125)
- `/website/src/components/GalleryGrid.tsx` (line 95)

---

#### 10. Viewport and Safe Areas
**Area:** All pages, especially on iPhone X+ with notch
**Issue:** Safe area insets must be respected on notched devices
**Test:**
- [ ] Test on iPhone 14 Pro (notch)
- [ ] Verify content doesn't go under notch
- [ ] Check bottom safe area on iPhone SE
- [ ] Test landscape orientation

**File Locations:**
- `/website/src/app/globals.css` (lines 222-265)
- `/website/src/lib/browser-compat.ts` (lines 42-46, 69-86)

---

### 🟢 LOW PRIORITY

#### 11. Font Rendering
**Area:** All text, especially thin fonts
**Issue:** Webkit renders fonts slightly differently than other browsers
**Test:**
- [ ] Compare font weights across browsers
- [ ] Verify `-webkit-font-smoothing: antialiased` improves rendering
- [ ] Check gradient text readability

**File Locations:**
- `/website/src/app/globals.css` (line 35)

---

#### 12. Scrollbar Styling
**Area:** Gallery filter chips, any overflow scroll areas
**Issue:** `::-webkit-scrollbar` only works in webkit browsers
**Test:**
- [ ] Verify custom scrollbar appears in Safari
- [ ] Check `scrollbar-hide` class works
- [ ] Test horizontal scroll indicators

**File Locations:**
- `/website/src/app/globals.css` (lines 191-221)

---

## Testing Methodology

### Desktop Safari Testing
1. Open Safari on macOS (latest version)
2. Test all pages: Homepage, Gallery, Order, Blog
3. Verify responsive design at various viewport sizes
4. Use Safari Developer Tools to check for console errors
5. Test Web Inspector to verify webkit-specific CSS is applied

### iOS Safari Testing
**Required Devices:**
- iPhone SE (small screen, home button)
- iPhone 14 (standard size, notch)
- iPad Pro (tablet layout)

**Test Checklist per Device:**
1. Homepage
   - [ ] Hero section loads and animates
   - [ ] CTA buttons respond to touch
   - [ ] Scroll is smooth
   - [ ] Safe areas respected

2. Gallery Page
   - [ ] Images load with lazy loading
   - [ ] Filter chips scroll horizontally
   - [ ] Tap to open lightbox works
   - [ ] Lightbox closes correctly

3. Order Page
   - [ ] Photo upload opens camera/library
   - [ ] Form inputs don't cause zoom
   - [ ] Tier selection works
   - [ ] Checkout button is accessible

4. Blog Page
   - [ ] Content renders correctly
   - [ ] Images load
   - [ ] Links are tappable

---

## Automated Testing with Playwright

### Current Configuration
The Playwright config already includes webkit testing:
- Desktop Safari (webkit browser)
- Mobile Safari (iPhone 12)
- iPhone SE
- iPad Pro

### Run Webkit Tests
```bash
cd website
npm run test:e2e -- --project=webkit
npm run test:e2e -- --project="Mobile Safari"
npm run test:e2e -- --project="iPhone SE"
npm run test:e2e -- --project=iPad
```

### Known Test Issues
- Tests currently fail due to missing dev server (see test run output)
- Stripe-dependent tests require API keys
- Need to start dev server: `npm run dev` before running tests

---

## Webkit-Specific CSS Fixes Applied

### 1. Text Gradient Support
```css
.text-gradient {
  background: linear-gradient(135deg, #C9A96E 0%, #E8D5A8 50%, #C9A96E 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### 2. Glass Morphism
```css
.glass {
  background: rgba(17, 17, 17, 0.72);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
}
```

### 3. Tap Highlight
```css
.tap-highlight-gold {
  -webkit-tap-highlight-color: rgba(201, 169, 110, 0.3);
}
```

### 4. User Select
```css
.no-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}
```

### 5. Momentum Scrolling
```css
html {
  -webkit-overflow-scrolling: touch;
}
```

---

## Additional Webkit Vendor Prefixes Needed

Based on common webkit issues, consider adding these if not already present:

### CSS Properties
```css
/* Flexbox */
display: -webkit-flex;
display: flex;

/* Transform */
-webkit-transform: translateY(10px);
transform: translateY(10px);

/* Transition */
-webkit-transition: all 0.3s ease;
transition: all 0.3s ease;

/* Box Shadow */
-webkit-box-shadow: 0 4px 6px rgba(0,0,0,0.1);
box-shadow: 0 4px 6px rgba(0,0,0,0.1);

/* Appearance (form controls) */
-webkit-appearance: none;
appearance: none;
```

---

## Browser Compatibility Testing Checklist

### Feature Detection
- [x] Safari detection implemented (BrowserDetect.isSafari)
- [x] iOS detection implemented (BrowserDetect.isIOS)
- [x] Backdrop-filter support check
- [x] Touch events support check
- [x] Safe area insets detection

### CSS Features
- [x] Vendor prefixes for background-clip
- [x] Vendor prefixes for backdrop-filter
- [x] Vendor prefixes for tap-highlight-color
- [x] Vendor prefixes for user-select
- [x] Vendor prefixes for overflow-scrolling
- [ ] Test all animations in Safari
- [ ] Verify gradient text renders

### JavaScript Features
- [x] iOS viewport height fix (browser-compat.ts)
- [x] Smooth scroll polyfill
- [x] Touch event detection
- [ ] Test all event handlers on iOS
- [ ] Verify analytics tracking in Safari

### Mobile Optimizations
- [x] 16px min font size on inputs
- [x] Safe area insets for notched devices
- [x] Touch target sizes (44px minimum)
- [x] Prevent double-tap zoom
- [ ] Test file upload on iOS
- [ ] Verify payment flow on iPhone

---

## Reported Bugs

### Bug Template
```markdown
**Bug ID:** SAFARI-001
**Severity:** High | Medium | Low
**Area:** Homepage | Gallery | Order | Blog
**Device/Browser:** Safari 17.2 / iOS 17.2 Safari / iPad Safari
**Description:** Clear description of the issue
**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three
**Expected Behavior:** What should happen
**Actual Behavior:** What actually happens
**Screenshot:** [Attach screenshot]
**Workaround:** Temporary fix (if any)
**Fix:** Proposed permanent solution
**Status:** Open | In Progress | Fixed | Won't Fix
```

---

## No Bugs Found (Yet)

This section will be populated as testing progresses. If no bugs are found, this is a good sign that the webkit-specific fixes already in place are working.

---

## Performance Testing on Safari

### Metrics to Track
1. **First Contentful Paint (FCP)** - Target: < 1.8s
2. **Largest Contentful Paint (LCP)** - Target: < 2.5s
3. **Time to Interactive (TTI)** - Target: < 3.8s
4. **Cumulative Layout Shift (CLS)** - Target: < 0.1
5. **First Input Delay (FID)** - Target: < 100ms

### Tools
- Safari Web Inspector > Timelines
- Lighthouse (Safari DevTools)
- WebPageTest.org (Safari browser option)

---

## Next Steps

1. **Manual Testing Required:**
   - [ ] Test on physical iPhone SE device
   - [ ] Test on physical iPhone 14 device
   - [ ] Test on physical iPad Pro device
   - [ ] Test on macOS Safari (latest version)

2. **Automated Testing:**
   - [ ] Fix Playwright test environment (start dev server)
   - [ ] Run full webkit test suite
   - [ ] Add webkit-specific test cases
   - [ ] Set up CI/CD webkit testing

3. **Bug Fixes:**
   - [ ] Document any webkit-specific bugs found
   - [ ] Implement fixes with vendor prefixes
   - [ ] Add regression tests
   - [ ] Verify fixes on actual devices

4. **Documentation:**
   - [ ] Update this document with findings
   - [ ] Add screenshots of bugs
   - [ ] Document webkit workarounds
   - [ ] Create developer guidelines for webkit compatibility

---

## Resources

### Webkit Documentation
- [Safari Developer Documentation](https://developer.apple.com/safari/)
- [WebKit CSS Reference](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariCSSRef/)
- [iOS Safari Specific Features](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/)

### Testing Tools
- [Browserstack](https://www.browserstack.com/) - Real device testing
- [Sauce Labs](https://saucelabs.com/) - Safari/iOS testing
- [WebPageTest](https://www.webpagetest.org/) - Performance testing
- [Can I Use](https://caniuse.com/) - Feature compatibility

### Webkit Bugs Database
- [WebKit Bugzilla](https://bugs.webkit.org/)
- [Safari Technology Preview](https://developer.apple.com/safari/technology-preview/)

---

## Conclusion

The Pawcasso Atelier codebase shows excellent webkit compatibility awareness with comprehensive vendor prefixes, iOS-specific optimizations, and browser detection utilities already in place. The next phase requires actual device testing to verify these implementations work as expected.

**Recommendation:** Prioritize testing file upload functionality and payment flow on iOS Safari, as these are critical conversion funnel steps.

---

**Document Version:** 1.0
**Last Updated:** March 19, 2026
**Next Review:** After device testing completion
