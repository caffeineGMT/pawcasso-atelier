# SEO Phase 2 - Engineer Quick Start Guide

**Last Updated:** March 19, 2026
**Status:** 🚧 IN PROGRESS
**Deadline:** March 24, 2026

---

## 📋 What's Been Done

### ✅ Completed (You can use these now)

1. **Dynamic OG Image API** (`/api/og`)
   - Generates unique Open Graph images for social sharing
   - Usage: `/api/og?title=Your+Title&subtitle=Subtitle&image=/gallery/image.webp`
   - Already integrated into Golden Retriever page

2. **Expanded Schema Markup Library** (`/lib/structured-data.ts`)
   - ✅ `generateReviewSchema()` - Customer testimonial markup
   - ✅ `generateFAQSchema()` - FAQ page markup (already existed)
   - ✅ `generateHowToSchema()` - Step-by-step guide markup
   - ✅ `generateArticleSchema()` - Blog post markup
   - ✅ `generateProductSchema()` - Product rich snippets (already existed)

3. **Breed-Specific Page Template** (`/golden-retriever-portraits/page.tsx`)
   - 1700+ words of SEO-optimized content
   - Integrated FAQ schema
   - Dynamic OG image
   - Photography tips section
   - Ready to clone for other breeds

4. **Sitemap Updated** (`/sitemap.ts`)
   - Added `/golden-retriever-portraits`
   - Placeholders for 4 more breed pages

---

## 🎯 Your Assignments

### **Engineer 1: Frontend SEO Developer**

**Status:** 🟢 Dynamic OG images DONE, performance audit pending

**Remaining Tasks:**

1. **Add Review Schema to Landing Pages** ⏱️ 2 hours
   - Add to: `/pet-portrait-styles`, `/custom-dog-portraits`, `/custom-cat-portraits`
   - Use testimonials from existing reviews
   - Example implementation:
     ```typescript
     import { generateReviewSchema, renderStructuredData } from '@/lib/structured-data';

     const reviews = [
       { author: "Sarah M.", rating: 5, reviewBody: "Absolutely stunning! My Golden looks like royalty." },
       { author: "James T.", rating: 5, reviewBody: "Best pet gift I've ever given." },
       { author: "Emily R.", rating: 5, reviewBody: "The Renaissance style is breathtaking." },
     ];

     const reviewSchema = generateReviewSchema(reviews, "Custom Pet Portrait");

     // In component:
     <script type="application/ld+json" dangerouslySetInnerHTML={renderStructuredData(reviewSchema)} />
     ```

2. **Update All Landing Pages to Use Dynamic OG Images** ⏱️ 1 hour
   - Update metadata in these files:
     - `/pet-portrait-styles/page.tsx`
     - `/custom-dog-portraits/page.tsx`
     - `/custom-cat-portraits/page.tsx`
     - `/pet-portrait-gift/page.tsx`
     - `/ai-pet-art/page.tsx`
     - `/ai-pet-portraits/page.tsx`
     - `/affordable-portraits/page.tsx`
     - `/memorial-portraits/page.tsx`
   - Change OpenGraph images from static to dynamic:
     ```typescript
     openGraph: {
       images: ['/api/og?title=17 Pet Portrait Styles&subtitle=From Renaissance to Modern AI Art&image=/gallery/cat_vermeer.webp'],
     }
     ```

3. **Core Web Vitals Audit** ⏱️ 3 hours
   - Run Lighthouse on all 9 SEO pages (8 existing + 1 new)
   - Target: 90+ Performance, 95+ SEO scores
   - Optimize:
     - Add `priority` prop to hero images
     - Lazy load gallery images
     - Preload critical fonts
     - Fix CLS issues (add explicit width/height)
   - Document results in `CORE_WEB_VITALS_AUDIT.md`

**Deliverables:**
- [ ] Review schema added to 3+ pages
- [ ] All 9 pages using dynamic OG images
- [ ] Lighthouse audit report (screenshot evidence)
- [ ] All pages scoring 90+ Performance, 95+ SEO

---

### **Engineer 2: SEO Specialist & Analytics**

**Status:** 🟡 Waiting for Google Search Console access

**Remaining Tasks:**

1. **Google Search Console Setup** ⏱️ 1 hour
   - Add property: https://pawcasso-atelier.vercel.app
   - Verify ownership (HTML file method or DNS TXT)
   - Submit sitemap: https://pawcasso-atelier.vercel.app/sitemap.xml
   - Request manual indexing for all 9 SEO pages
   - Configure email alerts for critical issues
   - **Blocker:** Need Michael's Google account credentials or access delegation

2. **Technical SEO Validation** ⏱️ 2 hours
   - Run Google Rich Results Test on all 9 pages
   - Validate sitemap: https://www.xml-sitemaps.com/validate-xml-sitemap.html
   - Run Mobile-Friendly Test: https://search.google.com/test/mobile-friendly
   - Check robots.txt: https://pawcasso-atelier.vercel.app/robots.txt
   - Document all passing tests in `TECHNICAL_SEO_VALIDATION.md`

3. **Keyword Tracking Dashboard Setup** ⏱️ 2 hours
   - Create Google Sheets or Notion tracker
   - Track these keywords:
     - custom dog portrait
     - custom cat portrait
     - pet portrait gift
     - ai pet portrait
     - pet portrait styles
     - golden retriever portrait (NEW)
     - [other breed keywords when pages go live]
   - Set up weekly manual checks (until Search Console has data)
   - Document baseline rankings (if any)

**Deliverables:**
- [ ] Google Search Console configured (pending access)
- [ ] Sitemap submitted and indexed (9+ URLs)
- [ ] All 9 pages pass Rich Results Test (screenshot evidence)
- [ ] Technical SEO validation report
- [ ] Keyword tracking dashboard (weekly updates)

---

### **Engineer 3: Content & Backlink Specialist**

**Status:** 🟢 1/5 breed pages done, backlink outreach pending

**Remaining Tasks:**

1. **Create 4 More Breed-Specific Landing Pages** ⏱️ 6-8 hours
   - Clone `/golden-retriever-portraits/page.tsx` as template
   - Create these pages:
     - `/corgi-portraits/page.tsx` (popular breed, high demand)
     - `/persian-cat-portraits/page.tsx` (classic cat breed)
     - `/french-bulldog-portraits/page.tsx` (trending breed)
     - `/siamese-cat-portraits/page.tsx` (elegant cat breed)
   - For each page:
     - Update metadata (title, description, keywords, OG image)
     - Customize content (breed-specific traits, photography tips)
     - Add 6 FAQ items (breed-specific questions)
     - Include FAQ schema
     - Target keyword: "[breed] portrait from photo"
     - Aim for 1500-1700 words
   - Update `/sitemap.ts` to include all 4 new pages

2. **Add FAQ Sections to All 8 Existing Landing Pages** ⏱️ 4 hours
   - Pages to update:
     - `/pet-portrait-styles/page.tsx`
     - `/custom-dog-portraits/page.tsx`
     - `/custom-cat-portraits/page.tsx`
     - `/pet-portrait-gift/page.tsx`
     - `/ai-pet-art/page.tsx`
     - `/ai-pet-portraits/page.tsx`
     - `/affordable-portraits/page.tsx`
     - `/memorial-portraits/page.tsx`
   - Add 5-6 FAQ items per page (use `/golden-retriever-portraits` as template)
   - Include FAQ schema markup
   - Target featured snippets (concise 40-60 word answers)

3. **Backlink Acquisition Strategy Execution** ⏱️ 10+ hours (ongoing)
   - Build target list of 30 websites (pet blogs, lifestyle sites, gift guides)
   - Create outreach email templates (see SEO_PHASE_2_PLAN.md for template)
   - Track outreach in spreadsheet:
     | Site | Contact | Email Sent | Response | Status | Link Acquired | DA |
     |------|---------|-----------|----------|--------|---------------|-----|
   - Prioritize:
     - Pet blogs: The Dodo, Rover, Petfinder, BarkPost, Catster
     - Lifestyle: Apartment Therapy, Design Milk, My Modern Met
     - Gift guides: UncommonGoods, Etsy Journal, BuzzFeed
   - Goal: 5+ high-quality backlinks by March 24, 10+ by end of month
   - Document in `BACKLINK_TRACKER.md`

**Deliverables:**
- [ ] 4 new breed-specific pages created and deployed
- [ ] FAQ sections added to all 8 existing landing pages
- [ ] Backlink outreach to 30 sites initiated
- [ ] 5+ backlinks acquired (verified in spreadsheet)
- [ ] Sitemap updated with all 5 breed pages

---

## 🛠️ How to Use the Schema Markup Library

### **Product Schema (Already Exists)**

```typescript
import { generateProductSchema, renderStructuredData } from '@/lib/structured-data';

const productSchema = generateProductSchema({
  name: "Custom Golden Retriever Portrait",
  price: 9,
  image: "https://pawcasso-atelier.vercel.app/gallery/dog.webp",
  description: "AI-generated Golden Retriever portraits...",
  aggregateRating: {
    ratingValue: 4.9,
    reviewCount: 127,
  },
});

// In component JSX:
<script type="application/ld+json" dangerouslySetInnerHTML={renderStructuredData(productSchema)} />
```

### **Review Schema (NEW)**

```typescript
import { generateReviewSchema, renderStructuredData } from '@/lib/structured-data';

const reviews = [
  {
    author: "Sarah Johnson",
    rating: 5,
    reviewBody: "The Renaissance style portrait of my Golden Retriever is absolutely stunning. It arrived in less than 24 hours!",
    datePublished: "2026-03-15",
  },
  {
    author: "Michael Chen",
    rating: 5,
    reviewBody: "Best pet gift I've ever purchased. The quality exceeded my expectations.",
  },
];

const reviewSchema = generateReviewSchema(reviews, "Custom Pet Portrait");

<script type="application/ld+json" dangerouslySetInnerHTML={renderStructuredData(reviewSchema)} />
```

### **FAQ Schema (Already Exists)**

```typescript
import { generateFAQSchema, renderStructuredData } from '@/lib/structured-data';

const faqs = [
  {
    question: "How much does a pet portrait cost?",
    answer: "Custom pet portraits start at $9 for digital delivery. Premium options with frames range from $29-79.",
  },
  {
    question: "How long does delivery take?",
    answer: "Most portraits are delivered within 24 hours via email as high-resolution digital files.",
  },
];

const faqSchema = generateFAQSchema(faqs);

<script type="application/ld+json" dangerouslySetInnerHTML={renderStructuredData(faqSchema)} />
```

### **HowTo Schema (NEW)**

```typescript
import { generateHowToSchema, renderStructuredData } from '@/lib/structured-data';

const howToSchema = generateHowToSchema({
  name: "How to Take the Perfect Pet Photo for a Portrait",
  description: "Follow these 5 steps to capture a stunning photo of your pet for a custom portrait.",
  totalTime: "PT10M", // 10 minutes in ISO 8601 duration format
  image: "https://pawcasso-atelier.vercel.app/guide/pet-photo-tips.jpg",
  steps: [
    {
      name: "Choose natural outdoor lighting",
      text: "Photograph your pet outdoors during golden hour (early morning or late afternoon) for warm, flattering light.",
    },
    {
      name: "Get down to their eye level",
      text: "Crouch or lie down to photograph at your pet's eye level for an engaging perspective.",
    },
    {
      name: "Focus on their face and eyes",
      text: "Ensure their face fills the frame and their eyes are sharp and in focus.",
    },
  ],
});

<script type="application/ld+json" dangerouslySetInnerHTML={renderStructuredData(howToSchema)} />
```

### **Article Schema (NEW)**

```typescript
import { generateArticleSchema, renderStructuredData } from '@/lib/structured-data';

const articleSchema = generateArticleSchema({
  headline: "10 Tips for Choosing the Perfect Pet Portrait Style",
  description: "A comprehensive guide to selecting the right artistic style for your pet's personality.",
  image: "https://pawcasso-atelier.vercel.app/blog/portrait-styles.jpg",
  datePublished: "2026-03-15",
  dateModified: "2026-03-15",
  author: "Pawcasso Atelier Team",
});

<script type="application/ld+json" dangerouslySetInnerHTML={renderStructuredData(articleSchema)} />
```

---

## 🧪 Testing & Validation

### **Before Deploying:**

1. **Build Test**
   ```bash
   npm run build
   # Verify zero errors
   ```

2. **Local Testing**
   ```bash
   npm run dev
   # Visit http://localhost:3000/your-page
   # Check that FAQ sections render
   # Verify OG images: view-source and check <meta property="og:image">
   ```

3. **Rich Results Test**
   - Visit: https://search.google.com/test/rich-results
   - Enter: https://pawcasso-atelier.vercel.app/your-page
   - Verify: Product, Review, FAQ schemas all pass

4. **OG Image Validation**
   - Visit: https://www.opengraph.xyz/url/https%3A%2F%2Fpawcasso-atelier.vercel.app%2Fyour-page
   - Verify: Custom OG image displays correctly

### **After Deploying:**

1. **Sitemap Check**
   - Visit: https://pawcasso-atelier.vercel.app/sitemap.xml
   - Verify: All 13 pages listed (9 existing + 4 new breed pages)

2. **Lighthouse Audit**
   - Visit: https://pagespeed.web.dev/
   - Test each new page
   - Target: 90+ Performance, 95+ SEO, 95+ Accessibility

3. **Mobile-Friendly Test**
   - Visit: https://search.google.com/test/mobile-friendly
   - Test each new page
   - Verify: All pages pass

---

## 📝 Documentation to Create

Each engineer should create these reports in the project root:

**Engineer 1:**
- `CORE_WEB_VITALS_AUDIT.md` - Lighthouse scores for all pages (before/after)
- `SCHEMA_IMPLEMENTATION_REPORT.md` - List of pages with Review schema added

**Engineer 2:**
- `TECHNICAL_SEO_VALIDATION.md` - Rich Results Test screenshots, sitemap validation
- `KEYWORD_TRACKING_DASHBOARD.md` - Link to Google Sheets/Notion, baseline rankings

**Engineer 3:**
- `BACKLINK_TRACKER.md` - Full outreach list, email templates, acquisition status
- `BREED_PAGES_SUMMARY.md` - List of 5 breed pages with key metrics (word count, FAQs, images)

---

## 🚀 Deployment Workflow

**REMEMBER: Follow the deployment rules in CLAUDE.md!**

1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Fix any build errors** (mandatory)

3. **Commit and push to GitHub:**
   ```bash
   git add -A
   git commit -m "feat: SEO Phase 2 - [describe your work]"
   git push origin main
   ```

4. **GitHub Actions auto-deploys** to GitHub Pages (staging)

5. **Michael manually deploys** to Vercel production when ready

**DO NOT:**
- ❌ Deploy to Vercel directly
- ❌ Push with build errors
- ❌ Skip the build verification step

---

## 🎯 Success Metrics

**By March 24, 2026:**
- ✅ 13 total SEO pages (9 existing + 4 new breed pages)
- ✅ All pages have unique dynamic OG images
- ✅ Review schema on 5+ pages
- ✅ FAQ schema on 13 pages
- ✅ Google Search Console configured and sitemap indexed
- ✅ All pages pass Rich Results Test
- ✅ Lighthouse scores: 90+ Performance, 95+ SEO
- ✅ 5+ high-quality backlinks acquired
- ✅ Backlink outreach to 30 sites initiated

**By End of April 2026:**
- 10+ high-quality backlinks
- Top 20 ranking for 3+ primary keywords
- 200-500 organic sessions/month

---

## 💬 Questions?

- Slack: #pawcasso-seo (hypothetical)
- Reference: SEO_PHASE_2_PLAN.md (comprehensive technical plan)
- Reference: SEO_IMPLEMENTATION_SUMMARY.md (Phase 1 completed work)

---

**Let's ship this! 🚀**
