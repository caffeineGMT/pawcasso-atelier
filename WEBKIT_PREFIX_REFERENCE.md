# Webkit Vendor Prefix Quick Reference

**Quick reference for webkit-specific CSS properties and JavaScript APIs**

---

## CSS Vendor Prefixes

### Transform & Animation
```css
/* Transform */
-webkit-transform: translateY(10px);
transform: translateY(10px);

/* Transform Origin */
-webkit-transform-origin: center center;
transform-origin: center center;

/* Transition */
-webkit-transition: all 0.3s ease;
transition: all 0.3s ease;

/* Animation */
-webkit-animation: fadeIn 1s ease;
animation: fadeIn 1s ease;

/* Backface Visibility */
-webkit-backface-visibility: hidden;
backface-visibility: hidden;

/* Perspective */
-webkit-perspective: 1000px;
perspective: 1000px;
```

### Appearance & UI
```css
/* Appearance (remove default styling) */
-webkit-appearance: none;
-moz-appearance: none;
appearance: none;

/* User Select */
-webkit-user-select: none;
-moz-user-select: none;
user-select: none;

/* Tap Highlight Color */
-webkit-tap-highlight-color: rgba(201, 169, 110, 0.3);

/* Touch Callout (long-press menu) */
-webkit-touch-callout: none;

/* User Drag (for images) */
-webkit-user-drag: none;
```

### Text & Fonts
```css
/* Font Smoothing */
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;

/* Text Size Adjust (prevent zoom on orientation change) */
-webkit-text-size-adjust: 100%;
-ms-text-size-adjust: 100%;
text-size-adjust: 100%;

/* Text Fill Color (for gradient text) */
-webkit-text-fill-color: transparent;

/* Background Clip (for gradient text) */
-webkit-background-clip: text;
background-clip: text;
```

### Flexbox
```css
/* Display Flex */
display: -webkit-box;
display: -webkit-flex;
display: -ms-flexbox;
display: flex;

/* Flex Direction */
-webkit-flex-direction: column;
-ms-flex-direction: column;
flex-direction: column;

/* Flex Wrap */
-webkit-flex-wrap: wrap;
-ms-flex-wrap: wrap;
flex-wrap: wrap;

/* Align Items */
-webkit-align-items: center;
-ms-flex-align: center;
align-items: center;

/* Justify Content */
-webkit-justify-content: space-between;
-ms-flex-pack: justify;
justify-content: space-between;
```

### Visual Effects
```css
/* Backdrop Filter (glass morphism) */
-webkit-backdrop-filter: blur(10px);
backdrop-filter: blur(10px);

/* Filter */
-webkit-filter: blur(5px);
filter: blur(5px);

/* Mask */
-webkit-mask-image: url(mask.png);
mask-image: url(mask.png);

/* Mask Size */
-webkit-mask-size: cover;
mask-size: cover;

/* Box Shadow */
-webkit-box-shadow: 0 4px 6px rgba(0,0,0,0.1);
box-shadow: 0 4px 6px rgba(0,0,0,0.1);

/* Box Sizing */
-webkit-box-sizing: border-box;
-moz-box-sizing: border-box;
box-sizing: border-box;
```

### Layout
```css
/* Position Sticky */
position: -webkit-sticky;
position: sticky;

/* Clip Path */
-webkit-clip-path: circle(50%);
clip-path: circle(50%);

/* Object Fit */
-o-object-fit: cover;
object-fit: cover;
```

### Scrolling
```css
/* Overflow Scrolling (momentum on iOS) */
-webkit-overflow-scrolling: touch;

/* Scrollbar Width */
scrollbar-width: thin; /* Firefox */

/* Scrollbar Styling (Webkit only) */
::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.3);
  border-radius: 6px;
}
```

### Forms
```css
/* Remove search input cancel button */
input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none;
}

/* File upload button */
input[type="file"]::-webkit-file-upload-button {
  -webkit-appearance: button;
  cursor: pointer;
}

/* Autofill styling */
input:-webkit-autofill {
  -webkit-text-fill-color: white;
  -webkit-box-shadow: 0 0 0px 1000px black inset;
}

/* Placeholder */
::-webkit-input-placeholder {
  color: rgba(255,255,255,0.5);
}
```

### Print
```css
/* Print Color Adjust */
-webkit-print-color-adjust: exact;
print-color-adjust: exact;
```

---

## iOS Safari Specific

### Viewport Height Fix
```css
/* Fix for 100vh on mobile Safari */
.min-h-screen {
  min-height: 100vh;
  min-height: -webkit-fill-available;
}

html {
  height: -webkit-fill-available;
}
```

### Safe Area Insets (Notch Support)
```css
/* Safe area insets */
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
padding-left: env(safe-area-inset-left);
padding-right: env(safe-area-inset-right);

/* Combined with fallback */
padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
```

### Prevent Zoom on Input Focus
```css
/* iOS Safari detection */
@supports (-webkit-touch-callout: none) {
  input, textarea, select {
    font-size: 16px !important; /* Minimum to prevent zoom */
  }
}
```

### Touch Action
```css
/* Prevent double-tap zoom */
button, a {
  touch-action: manipulation;
}

/* Allow only horizontal scroll */
.scroll-container {
  touch-action: pan-x;
}

/* Allow only vertical scroll */
.scroll-container {
  touch-action: pan-y;
}
```

---

## JavaScript APIs

### Browser Detection
```javascript
// Detect Safari
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

// Detect iOS
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

// Detect iOS Safari specifically
const isIOSSafari = isIOS && /Safari/.test(navigator.userAgent);
```

### Feature Detection
```javascript
// Check backdrop-filter support
const supportsBackdropFilter = CSS.supports('backdrop-filter', 'blur(1px)') ||
                               CSS.supports('-webkit-backdrop-filter', 'blur(1px)');

// Check smooth scroll support
const supportsSmoothScroll = 'scrollBehavior' in document.documentElement.style;

// Check touch events
const supportsTouchEvents = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
```

### iOS Viewport Height Fix
```javascript
// Fix iOS 100vh issue
function setVH() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setVH();
window.addEventListener('resize', setVH);
window.addEventListener('orientationchange', setVH);
```

### Safe Area Insets
```javascript
// Get safe area insets
function getSafeAreaInsets() {
  const getInset = (position) => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(`env(safe-area-inset-${position})`) || '0px';
    return parseInt(value, 10) || 0;
  };

  return {
    top: getInset('top'),
    bottom: getInset('bottom'),
    left: getInset('left'),
    right: getInset('right'),
  };
}
```

### Smooth Scroll Polyfill
```javascript
// Polyfill for smooth scrolling
function smoothScrollTo(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;

  if ('scrollBehavior' in document.documentElement.style) {
    target.scrollIntoView({ behavior: 'smooth' });
  } else {
    // Manual smooth scroll implementation
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1000;
    let start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percentage = Math.min(progress / duration, 1);
      const ease = percentage < 0.5
        ? 2 * percentage * percentage
        : -1 + (4 - 2 * percentage) * percentage;

      window.scrollTo(0, startPosition + distance * ease);

      if (progress < duration) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
  }
}
```

---

## Meta Tags for iOS

### Viewport Meta Tag
```html
<!-- Standard viewport -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">

<!-- Disable user scaling (not recommended) -->
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">

<!-- Support safe area insets -->
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

### iOS Specific Meta Tags
```html
<!-- iOS app-capable (hide Safari UI) -->
<meta name="apple-mobile-web-app-capable" content="yes">

<!-- iOS status bar style -->
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

<!-- iOS app title -->
<meta name="apple-mobile-web-app-title" content="Pawcasso">

<!-- iOS icon -->
<link rel="apple-touch-icon" href="/apple-touch-icon.png">

<!-- Disable automatic phone number detection -->
<meta name="format-detection" content="telephone=no">
```

---

## Common Webkit Issues & Fixes

### Issue: Content behind notch
**Fix:**
```css
padding-top: max(1rem, env(safe-area-inset-top));
```

### Issue: 100vh too tall on mobile
**Fix:**
```css
min-height: 100vh;
min-height: -webkit-fill-available;
```

### Issue: Input zoom on iOS
**Fix:**
```css
input { font-size: 16px !important; }
```

### Issue: Gradient text not showing
**Fix:**
```css
background: linear-gradient(to right, red, blue);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

### Issue: Glass effect not working
**Fix:**
```css
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
```

### Issue: Sticky not working
**Fix:**
```css
position: -webkit-sticky;
position: sticky;
```

### Issue: Animations janky
**Fix:**
```css
-webkit-transform: translateZ(0);
transform: translateZ(0);
-webkit-backface-visibility: hidden;
backface-visibility: hidden;
```

---

## Browser Support Versions

| Feature | Safari | iOS Safari |
|---------|--------|------------|
| WebP Images | 14+ | 14+ |
| `backdrop-filter` | 15.4+ | 15.4+ |
| `aspect-ratio` | 15+ | 15+ |
| `gap` (Flexbox) | 14.1+ | 14.5+ |
| `:focus-visible` | 15.4+ | 15.4+ |
| Scroll behavior | 15.4+ | 15.4+ |
| Safe area insets | 11+ | 11+ |
| CSS Grid | 10.1+ | 10.3+ |

---

## Autoprefixer Config

If using PostCSS with Autoprefixer, configure browserslist:

```json
// package.json
{
  "browserslist": [
    "last 2 versions",
    "Safari >= 14",
    "iOS >= 14"
  ]
}
```

Or `.browserslistrc`:
```
last 2 versions
Safari >= 14
iOS >= 14
not dead
```

---

## Testing Tools

- **Safari Developer Tools:** Cmd+Option+I
- **iOS Simulator:** Xcode > Open Developer Tool > Simulator
- **Remote Debugging:** Safari > Develop > [Device Name]
- **Responsive Mode:** Safari > Develop > Enter Responsive Design Mode
- **Webkit Feature Status:** https://webkit.org/status/

---

**Last Updated:** March 19, 2026
**Maintainer:** Engineer 1, Cross-Browser Testing Team
