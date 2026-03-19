# Mobile UX Testing Checklist

## Touch Targets (WCAG AAA - 44x44px minimum)

### Header Component
- [x] Mobile hamburger menu button: 44x44px
- [x] Desktop "Order" CTA button: increased padding (py-3)
- [x] Mobile menu links: 44px minimum height
- [x] Mobile menu "Order Portrait" button: 48px minimum height
- [x] Haptic feedback on all menu interactions

### Homepage
- [ ] Hero "Order Your Portrait" button: 44px minimum height
- [ ] Hero "Follow Us" button: 44px minimum height
- [ ] "Get Started" pricing button: 44px minimum height
- [ ] "Commission a Portrait" final CTA: 44px minimum height
- [ ] Gallery "View full gallery" link: adequate padding

### Order Page (Critical for Conversions)
- [ ] File upload area: large, easy-to-tap target
- [ ] "Next" buttons: 56px minimum height (already implemented)
- [ ] "Back" buttons: 56px minimum height (already implemented)
- [ ] Tier selection cards: adequate spacing and size
- [ ] Art style selection buttons: minimum 44px height
- [ ] Input fields: 48px minimum height
- [ ] Textarea: 120px minimum height
- [ ] "Proceed to Checkout" button: 56px height
- [ ] Gift card expand/collapse: 44px minimum
- [ ] Guarantee expand/collapse: 44px minimum

## Viewport Configuration
- [x] viewport export in layout.tsx with proper metadata
- [x] initialScale: 1
- [x] maximumScale: 5 (allows zoom for accessibility)
- [x] userScalable: true
- [x] themeColor: #000000 (matches dark theme)

## Haptic Feedback
- [x] Haptic utility library created (lib/haptics.ts)
- [x] Header menu interactions
- [ ] Homepage CTA buttons
- [ ] Order form buttons
- [ ] Style selection
- [ ] Tier selection
- [ ] File upload success
- [ ] Form submission
- [ ] Success/error states

## Input Field Optimization

### Order Form Inputs
- Email field: min-h-[48px], text-lg for readability
- Pet name field: min-h-[48px]
- Special requests textarea: min-h-[120px]
- Gift card code input: adequately sized
- Clear focus states with gold rings
- Proper autocomplete attributes
- Large enough font sizes (16px minimum to prevent zoom on iOS)

### Spacing & Layout
- Adequate padding between form sections (mb-6)
- Mobile-friendly stack layout
- Proper touch target spacing (gap-4, gap-6)
- Safe area inset support for notched devices

## Mobile-Specific Features

### Drag & Drop
- Visual feedback on drag over
- Clear empty state messaging
- Mobile-friendly file size limits (10MB)
- Support for HEIC/HEIF (iPhone native format)

### Progress Indicators
- Upload progress bar with percentage
- Loading states on buttons
- Clear success/error messaging
- Visual confirmation of uploaded photo

### Error States
- Clear error messages
- Adequate contrast for readability
- Positioned close to relevant fields
- Animation to draw attention (animate-shake)

## Device Testing Matrix

### iOS
- [ ] iPhone SE (small screen - 375px)
- [ ] iPhone 12/13/14 Pro (standard - 390px)
- [ ] iPhone 14 Pro Max (large - 428px)
- [ ] iPad (tablet - 768px+)
- [ ] Safari browser
- [ ] Test with iOS accessibility features (larger text)

### Android
- [ ] Small phone (360px)
- [ ] Standard phone (412px)
- [ ] Large phone (480px)
- [ ] Tablet (768px+)
- [ ] Chrome browser
- [ ] Samsung Internet
- [ ] Test with Android accessibility features

## Performance Checks
- [ ] First Contentful Paint < 1.5s on 3G
- [ ] Time to Interactive < 3s on mobile
- [ ] No layout shift on button press
- [ ] Smooth scroll performance
- [ ] Image lazy loading working
- [ ] No janky animations

## Accessibility
- [ ] Buttons have aria-labels where needed
- [ ] Form inputs have proper labels
- [ ] Focus visible on all interactive elements
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Color contrast meets WCAG AA (text) and AAA (touch targets)

## Common Mobile UX Issues to Check
- [ ] No horizontal scroll at any breakpoint
- [ ] No text too small to read (16px minimum)
- [ ] No elements cut off on small screens
- [ ] Sticky header doesn't overlap content
- [ ] Form inputs don't trigger unwanted zoom on iOS
- [ ] Bottom navigation/CTAs visible above keyboard
- [ ] Safe area respected on notched devices
- [ ] Loading states don't flash too quickly (minimum 300ms)

## Conversion Optimization
- [ ] Order form fits in one viewport on mobile (no scroll fatigue)
- [ ] Clear progress indicator across wizard steps
- [ ] Trust badges visible on mobile
- [ ] Social proof stats prominent
- [ ] CTA buttons always visible/accessible
- [ ] Minimal friction in checkout flow
- [ ] Guest checkout available (no required account)

## Network Conditions
- [ ] Test on 3G connection
- [ ] Test with intermittent connectivity
- [ ] Offline error handling
- [ ] Graceful image loading failures
- [ ] API timeout handling

## Edge Cases
- [ ] Very long pet names
- [ ] Very long email addresses
- [ ] Special characters in inputs
- [ ] Multiple file upload attempts
- [ ] Large file uploads (near 10MB limit)
- [ ] Landscape orientation
- [ ] Split screen / multitasking
- [ ] Dark mode (if supported)
