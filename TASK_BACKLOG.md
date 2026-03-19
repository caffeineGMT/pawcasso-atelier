# Pawcasso Atelier - Task Backlog

> Task tracking for production readiness and growth initiatives
> Last updated: 2026-03-18

---

## 🔴 IN PROGRESS

### [MOBILE UX] Mobile Checkout Flow UX Audit
**Priority:** P0 Critical
**Status:** IN PROGRESS
**Assigned:** 2 Engineers
**Started:** 2026-03-18

**Context:**
- 60%+ of traffic is mobile
- Identified as major conversion blocker
- Order page is 1237 lines - needs mobile optimization review
- Multi-step checkout wizard needs mobile UX validation

**Audit Scope:**
- [ ] Touch target audit (44x44px minimum)
- [ ] Form field mobile optimization
- [ ] Checkout flow friction analysis
- [ ] Mobile keyboard behavior
- [ ] Loading states and feedback
- [ ] Payment redirect UX
- [ ] Error handling on mobile
- [ ] Performance on 3G networks

**Target Completion:** 2026-03-19
**Findings Doc:** `MOBILE_CHECKOUT_UX_AUDIT.md`

---

### [PERFORMANCE] Image Optimization Pass - Critical for E-commerce
**Priority:** P1 High
**Status:** IN PROGRESS
**Assigned:** 3 Engineers (Performance Team)
**Started:** 2026-03-19
**Target Completion:** 2026-03-22 (3 days)

**Context:**
- 34 gallery images at 5-8MB each = ~200MB total load
- Critical blocker for mobile performance and SEO rankings
- Previous optimization (March 17) was basic - this is comprehensive
- Page load times directly impact conversion rates (1s delay = 7% conversion loss)

**Impact:**
- **Current**: ~200MB total image payload
- **Target**: <20MB with next-gen formats (90% reduction)
- **Expected**: 5x faster page loads, improved Core Web Vitals
- **Revenue Impact**: 10-15% conversion lift from faster load times

**Scope:**

1. **Engineer 1 - Image Audit & Conversion Pipeline**
   - Audit all images in `/public` and `/website/public`
   - Identify oversized images (>500KB unacceptable for web)
   - Build automated image optimization pipeline
   - Convert all images to WebP/AVIF with fallbacks
   - Generate multiple sizes for responsive images (320w, 640w, 1024w, 1920w)
   - Create sharp-based build script for automated optimization

2. **Engineer 2 - Responsive Image Implementation**
   - Implement `<picture>` elements with srcSet
   - Add art direction for mobile vs desktop crops
   - Lazy loading with intersection observer
   - Blur-up placeholders (LQIP - Low Quality Image Placeholders)
   - Update GalleryGrid, Hero, testimonials, blog images
   - Lighthouse score validation (target: 95+ performance)

3. **Engineer 3 - CDN Setup & Performance Validation**
   - Configure Next.js Image Optimization
   - Set up image CDN (Vercel Image Optimization or Cloudinary)
   - Add caching headers (1 year cache for immutable images)
   - Performance testing (Lighthouse, WebPageTest)
   - Core Web Vitals monitoring setup
   - Create image optimization documentation and guidelines

**Success Criteria:**
- [ ] All images <200KB (WebP format)
- [ ] Responsive srcSet on 100% of images
- [ ] Lighthouse Performance score >95
- [ ] LCP (Largest Contentful Paint) <2.5s
- [ ] CLS (Cumulative Layout Shift) <0.1
- [ ] Total page weight <2MB (down from ~200MB)
- [ ] Automated image optimization in build process

**Deliverables:**
- [ ] `scripts/optimize-images.js` (automated conversion script)
- [ ] Updated image components with responsive images
- [ ] `IMAGE_OPTIMIZATION_GUIDE.md` (documentation)
- [ ] Performance benchmark report (before/after)
- [ ] GitHub Actions workflow for image validation
- [ ] CDN configuration for production

**Dependencies:**
- sharp library (Node.js image processing)
- Next.js Image component (already available)
- Vercel Image Optimization (included in hosting)

**Notes:**
- This is a revenue-critical task - slow sites lose customers
- Mobile users (60% of traffic) are especially sensitive to load times
- Google ranks faster sites higher (SEO impact)
- Previous March 17 optimization was basic - this is production-grade

---

## 📋 BACKLOG (Prioritized)

### [REVENUE] Stripe Live Mode Switch
**Priority:** P0
**Status:** BACKLOG
**Blocker:** Cannot accept real payments until complete
**Tasks:**
- Switch from test keys to live keys on Vercel
- Place one real test order end-to-end
- Set up Stripe webhook → email notification
- Verify thank-you page flow

### [AUTOMATION] Instagram Graph API Setup
**Priority:** P1
**Status:** BACKLOG
**Tasks:**
- Set up Meta Business Suite for @pawcasso.atelier
- Get Instagram Graph API credentials
- Build n8n node for automated posting
- Implement human-in-the-loop review flow

### [UX] Customer Dashboard
**Priority:** P2
**Status:** BACKLOG
**Features:**
- Order status tracking
- Download portrait history
- Account credits display
- Referral link management

### [SEO] Technical SEO Improvements
**Priority:** P2
**Status:** BACKLOG
**Tasks:**
- Add Open Graph / Twitter Card meta tags
- Generate OG images for gallery pieces
- Add JSON-LD structured data
- Create sitemap.xml and robots.txt
- Google Search Console setup

---

## ✅ COMPLETED

### [ACCESSIBILITY] WCAG 2.1 AA Compliance Audit
**Completed:** 2026-03-17
**Summary:** Added ARIA labels, keyboard navigation, accessible forms

### [PERFORMANCE] Core Web Vitals Optimization
**Completed:** 2026-03-17
**Summary:** Lazy loading, skeleton loaders, optimized bundle

### [MOBILE UX] Mobile Experience Polish
**Completed:** 2026-03-17
**Summary:** Touch targets, haptic feedback, responsive grid

### [UX] Loading States & Skeleton Loaders
**Completed:** 2026-03-17
**Summary:** Skeleton loaders for gallery, blog, dashboard

### [UX] Error Handling & User Feedback
**Completed:** 2026-03-18
**Summary:** Comprehensive error system, toast notifications, retry logic
**Report:** `website/TASK_COMPLETION_REPORT.md`

### [SEO] Technical SEO Improvements
**Completed:** 2026-03-17
**Summary:** Meta tags, structured data, sitemap

### [POLISH] Component Refactoring & Code Quality
**Completed:** 2026-03-17
**Summary:** Split large components, extracted reusable logic

### [PERFORMANCE] Image Optimization Pass
**Completed:** 2026-03-17
**Summary:** WebP conversion, responsive images

### [REVENUE] Cart Abandonment Email Sequence
**Completed:** 2026-03-18
**Summary:** 3-email series (1hr, 24hr, 72hr) with discount escalation

### [REVENUE] Conversion Rate Optimization Audit
**Completed:** 2026-03-18
**Summary:** Heatmap tracking, funnel analysis, A/B testing infrastructure

### [REVENUE] Live Social Proof Widgets
**Completed:** 2026-03-18
**Summary:** Real-time order notifications, review badges

### [REVENUE] Gift Card System
**Completed:** 2026-03-18
**Summary:** Purchase, redeem, viral growth driver

### [REVENUE] Customer Acquisition Cost Dashboard
**Completed:** 2026-03-19
**Summary:** CAC tracking by channel with LTV:CAC ratio

### [CRITICAL] Real Customer Testimonial Collection
**Completed:** 2026-03-19
**Summary:** Automated 7-day post-delivery review emails

### [URGENT] Daily Instagram Content Generation
**Completed:** 2026-03-19
**Summary:** Automated IG content system with n8n integration
**Docs:** `IG_CONTENT_SYSTEM.md`

---

## 📊 Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Mobile Traffic | 60%+ | - |
| Mobile Conversion Rate | **TBD** | +20% |
| Checkout Completion Rate | **TBD** | 80%+ |
| Page Load Time (Mobile 3G) | **TBD** | <3s |
| Core Web Vitals | **TBD** | All Green |
| Total Image Payload | ~200MB | <20MB |
| Lighthouse Performance Score | **TBD** | 95+ |
| Largest Contentful Paint (LCP) | **TBD** | <2.5s |
| Cumulative Layout Shift (CLS) | **TBD** | <0.1 |

---

## 👥 Team Allocation

| Engineer | Current Assignment | Status |
|----------|-------------------|--------|
| Mobile UX - Engineer 1 | Mobile Checkout UX Audit | Active |
| Mobile UX - Engineer 2 | Mobile Checkout UX Audit | Active |
| Performance - Engineer 1 | Image Optimization - Audit & Pipeline | Active |
| Performance - Engineer 2 | Image Optimization - Responsive Implementation | Active |
| Performance - Engineer 3 | Image Optimization - CDN & Validation | Active |

---

## 🎯 Success Criteria - Mobile Checkout Audit

1. **All mobile UX issues identified and documented**
2. **Critical fixes implemented (P0 blockers)**
3. **Mobile conversion baseline established**
4. **A/B test plan created for top 3 friction points**
5. **Performance budget defined for mobile**

---

_This backlog is actively maintained. Completed tasks archived to `COMPLETED_TASKS.md`_
