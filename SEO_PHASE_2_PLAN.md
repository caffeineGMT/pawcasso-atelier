# SEO Phase 2: Advanced Technical SEO - Implementation Plan

**Date:** March 19, 2026
**Status:** ✅ **ACTIVE** - 3 Engineers Assigned
**Project:** Q1 2026 Product Polish Sprint
**Deadline:** March 24, 2026

---

## 🎯 Executive Summary

Phase 1 (COMPLETE) established SEO foundation:
- ✅ 8 SEO landing pages with 1500+ words each
- ✅ Sitemap.xml with all pages
- ✅ Robots.txt configured
- ✅ JSON-LD Product schema on all pages
- ✅ OpenGraph & Twitter Card metadata

**Phase 2 Goals:**
1. Dynamic OG image generation for social virality
2. Expanded schema markup (Review, FAQ, HowTo)
3. Google Search Console integration & monitoring
4. Core Web Vitals optimization for SEO ranking
5. Backlink acquisition strategy execution

**Expected Impact:**
- 2-3x social sharing rate (better OG images)
- Top 10 ranking for 5+ primary keywords within 60 days
- 1000+ organic sessions/month by Month 3
- 20+ high-quality backlinks from pet/lifestyle sites

---

## 👥 Engineer Assignments

### **Engineer 1: Frontend SEO Developer**
**Focus:** Dynamic OG images, performance optimization, schema expansion

**Tasks:**
1. ✅ **Dynamic OG Image Generation System**
   - Build API route `/api/og` using Vercel OG (Satori)
   - Generate unique OG images for each page with pet photos
   - Template: Page title + hero image + branding
   - Cache generated images in edge CDN

2. **Schema Markup Expansion**
   - Add Review schema to landing pages (pull from testimonials)
   - Add FAQ schema to /faq page and landing page FAQ sections
   - Add HowTo schema to /guide/pet-photo-tips
   - Validate all schemas with Google Rich Results Test

3. **Performance Optimization**
   - Audit Core Web Vitals (LCP, CLS, FID)
   - Optimize image loading (priority hints, lazy loading)
   - Add resource preloading for critical assets
   - Target: 90+ Lighthouse Performance score

**Deliverables:**
- `/website/src/app/api/og/route.tsx` - OG image generator
- Updated schema helpers in `/website/src/lib/structured-data.ts`
- Performance audit report
- All pages scoring 95+ on Lighthouse SEO

---

### **Engineer 2: SEO Specialist & Analytics**
**Focus:** Google Search Console, monitoring, technical SEO validation

**Tasks:**
1. **Google Search Console Setup**
   - Add property: https://pawcasso-atelier.vercel.app
   - Verify ownership (HTML file or DNS TXT record)
   - Submit sitemap.xml
   - Request manual indexing for 8 SEO landing pages
   - Set up email alerts for critical issues

2. **Keyword Monitoring Dashboard**
   - Track target keywords: custom dog portrait, custom cat portrait, pet portrait gift, ai pet portrait, pet portrait styles
   - Monitor ranking position (weekly)
   - Track click-through rate (CTR)
   - Identify ranking opportunities (positions 11-20)

3. **Technical SEO Validation**
   - Run Google Rich Results Test on all 8 landing pages
   - Validate sitemap in XML Sitemap Validator
   - Check mobile-friendliness (Google Mobile-Friendly Test)
   - Run Lighthouse SEO audits (target 95+)
   - Fix any crawl errors or indexing issues

**Deliverables:**
- Google Search Console configured and sitemap submitted
- Weekly keyword tracking spreadsheet (Sheets or Notion)
- Technical SEO audit report with all issues resolved
- Screenshot evidence of all pages passing Rich Results Test

---

### **Engineer 3: Content & Backlink Specialist**
**Focus:** Content expansion, backlink outreach, featured snippets

**Tasks:**
1. **Backlink Acquisition Strategy**
   - Identify 30 target websites (pet blogs, lifestyle sites, design blogs)
   - Create outreach email templates (value-first approach)
   - Offer guest posts or collaboration (e.g., "10 Best Pet Portrait Services")
   - Track outreach in spreadsheet (site, contact, status, result)
   - Goal: 10+ high-quality backlinks by end of month

2. **Content Expansion - Breed-Specific Pages**
   - Create 5 new landing pages:
     - `/golden-retriever-portraits` (high search volume)
     - `/corgi-portraits` (trending breed)
     - `/persian-cat-portraits` (popular cat breed)
     - `/french-bulldog-portraits` (high demand)
     - `/siamese-cat-portraits` (classic breed)
   - Follow SEO template: 1500+ words, 8+ images, structured data, internal linking
   - Target long-tail keywords: "[breed] portrait from photo"

3. **Featured Snippet Optimization**
   - Identify question keywords: "How much does a pet portrait cost?", "What makes a good pet photo?", "How long does a custom pet portrait take?"
   - Add FAQ sections to landing pages with concise answers (40-60 words)
   - Use proper HTML markup (`<dl>`, `<dt>`, `<dd>` or FAQ schema)
   - Aim for "Position 0" (featured snippet) for 3+ questions

**Deliverables:**
- 5 new breed-specific landing pages
- Backlink acquisition tracker (30 targets, 10+ acquired)
- FAQ section added to all 8 existing landing pages
- Evidence of featured snippet targeting (Search Console data)

---

## 📊 Technical Implementation Details

### **1. Dynamic OG Image Generation**

**Technology:** Vercel OG (Satori) - generates images at build time or on-demand

**Implementation:**

```typescript
// /website/src/app/api/og/route.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Pawcasso Atelier';
  const image = searchParams.get('image') || '/gallery/cat_vermeer.webp';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))',
          }}
        />
        <h1
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: 'white',
            textAlign: 'center',
            padding: '0 80px',
            zIndex: 10,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: 32,
            color: '#C9A96E',
            marginTop: 20,
            zIndex: 10,
          }}
        >
          Pawcasso Atelier
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

**Usage in page metadata:**

```typescript
// /website/src/app/pet-portrait-styles/page.tsx
export const metadata: Metadata = {
  // ... existing metadata
  openGraph: {
    images: ['/api/og?title=17 Pet Portrait Styles&image=/gallery/cat_vermeer.webp'],
  },
};
```

**Benefit:** Every page gets a unique, visually appealing OG image → higher click-through rate on social media

---

### **2. Schema Markup Expansion**

**Current State:** Product schema only
**Target:** Product + Review + FAQ + HowTo schemas

**Review Schema:**

```typescript
// /website/src/lib/structured-data.ts
export function generateReviewSchema(reviews: Review[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "Product",
      "name": "Custom Pet Portrait"
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length,
      "bestRating": 5
    },
    "author": {
      "@type": "Person",
      "name": reviews[0].author
    },
    "reviewBody": reviews[0].text
  };
}
```

**FAQ Schema:**

```typescript
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}
```

**HowTo Schema:**

```typescript
export function generateHowToSchema(title: string, steps: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": title,
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "text": step
    }))
  };
}
```

---

### **3. Google Search Console Setup**

**Step 1: Add Property**
1. Go to https://search.google.com/search-console
2. Click "Add Property"
3. Choose "URL prefix" method
4. Enter: https://pawcasso-atelier.vercel.app

**Step 2: Verify Ownership**

**Option A: HTML File Upload (Recommended)**
1. Download verification file (e.g., `google123abc.html`)
2. Place in `/website/public/google123abc.html`
3. Deploy to Vercel
4. Click "Verify" in Search Console

**Option B: DNS Verification**
1. Add TXT record to domain DNS
2. Value: `google-site-verification=ABC123...`
3. Wait 5-30 minutes for propagation
4. Click "Verify"

**Step 3: Submit Sitemap**
1. In Search Console, go to "Sitemaps" (left sidebar)
2. Enter: `https://pawcasso-atelier.vercel.app/sitemap.xml`
3. Click "Submit"
4. Expected result: 20-25 URLs discovered

**Step 4: Request Indexing (Priority Pages)**

Manually request indexing for these pages (in order):
1. `/pet-portrait-styles` - Comprehensive guide, high backlink potential
2. `/custom-dog-portraits` - High search volume keyword
3. `/custom-cat-portraits` - High search volume keyword
4. `/pet-portrait-gift` - High conversion intent
5. `/ai-pet-art` - Differentiator keyword
6. `/affordable-portraits` - Price-focused keyword
7. `/memorial-portraits` - Emotional niche
8. `/ai-pet-portraits` - Core offering page

**Step 5: Set Up Alerts**
- Enable email notifications for:
  - Critical indexing issues
  - Manual actions (penalties)
  - Security issues
  - Significant ranking drops

---

### **4. Core Web Vitals Optimization**

**Target Metrics (for SEO ranking):**
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

**Optimization Strategies:**

**LCP Optimization:**
```typescript
// Add priority hint to hero images
<Image
  src="/gallery/hero.webp"
  alt="Pet portrait"
  priority  // Next.js will preload this image
  sizes="100vw"
/>

// Preload critical fonts
<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
```

**CLS Optimization:**
```typescript
// Always specify image dimensions
<Image
  src="/gallery/hero.webp"
  width={2048}
  height={2048}
  alt="Pet portrait"
/>

// Reserve space for lazy-loaded content
<div className="aspect-square">
  <Image ... />
</div>
```

**FID Optimization:**
- Use Next.js `loading.tsx` for instant feedback
- Implement React Suspense for async components
- Minimize JavaScript execution time

---

### **5. Backlink Acquisition Strategy**

**Target Websites (30 high-quality sites):**

**Pet Blogs & Communities:**
- The Dodo
- Rover Blog
- Petfinder Blog
- Modern Dog Magazine
- Catster
- BarkPost
- PetMD
- Chewy Blog
- Pawp Blog
- Pet Life Today

**Lifestyle & Design Blogs:**
- Apartment Therapy
- Design Milk
- My Modern Met
- Colossal Art
- The Every Girl
- Cup of Jo
- A Beautiful Mess
- Wit & Delight
- Emily Henderson
- Studio DIY

**Gift & Shopping Guides:**
- UncommonGoods Blog
- Etsy Journal
- BuzzFeed Gift Guides
- Wirecutter (NYT)
- Good Housekeeping Gift Guide
- Real Simple
- PopSugar Gift Guides
- The Strategist (NY Mag)
- Gear Patrol
- Cool Material

**Outreach Email Template:**

```
Subject: Partnership Idea: AI Pet Portraits for [Blog Name] Readers

Hi [Name],

I'm [Your Name] from Pawcasso Atelier (pawcasso-atelier.vercel.app), where we create custom AI-generated pet portraits in 17+ artistic styles.

I've been a longtime reader of [Blog Name] and especially loved your recent post on [specific article]. Your readers clearly love thoughtful, creative pet content, which is why I think they'd enjoy learning about AI pet portraiture.

I'd love to collaborate with you in one of these ways:

1. **Guest Post:** I could write "The Ultimate Guide to Commissioning Pet Portraits" (1500+ words, with expert tips on photography, framing, and choosing the right style)

2. **Product Feature:** Include Pawcasso in your next "Best Pet Gifts" or "Unique Home Decor" roundup

3. **Giveaway Partnership:** We'd sponsor a giveaway (3 free portraits, $150 value) for your readers

No strings attached—I'm happy to provide value first. Let me know if any of these resonate!

Best,
[Your Name]
Pawcasso Atelier
[Email]
```

**Tracking Spreadsheet:**

| Site | Contact | Email Sent | Response | Status | Link Acquired | DA (Domain Authority) |
|------|---------|-----------|----------|--------|---------------|---------------------|
| The Dodo | [email] | 2026-03-20 | Pending | Outreach | - | 78 |
| Rover Blog | [email] | 2026-03-20 | Interested | Follow-up | - | 72 |
| ... | ... | ... | ... | ... | ... | ... |

**Goal:** 10+ backlinks by end of March, 20+ by end of April

---

## 📈 Success Metrics & KPIs

### **Week 1 (March 19-26):**
- ✅ All 3 engineers assigned and onboarded
- ✅ Google Search Console configured
- ✅ Sitemap submitted and indexed
- ✅ Dynamic OG images implemented
- ✅ Schema markup expansion complete
- ✅ 5 new breed-specific pages created
- ✅ Backlink outreach to 30 sites initiated

### **Week 2-3 (March 27 - April 9):**
- Pages start appearing in search results for brand queries
- 5+ backlinks acquired
- Impressions spike in Search Console
- Long-tail keywords ranking on page 2-3 (position 11-30)

### **Week 4-8 (April 10 - May 14):**
- Primary keywords move to page 1 (position 1-10)
- 10+ high-quality backlinks acquired
- 500-1000 organic sessions/month
- Featured snippets for 2-3 question keywords

### **Month 3 (June 2026):**
- 1000-2000 organic sessions/month
- 20+ high-quality backlinks
- Top 5 ranking for 3+ primary keywords
- 2-4% landing page conversion rate
- $1000-3000 monthly revenue from organic traffic alone

---

## ✅ Acceptance Criteria

**Engineer 1 (Frontend):**
- [ ] Dynamic OG image API route working (`/api/og`)
- [ ] All 13 pages (8 existing + 5 new breed pages) have unique OG images
- [ ] Review schema added to landing pages
- [ ] FAQ schema added to /faq and landing page FAQ sections
- [ ] HowTo schema added to /guide/pet-photo-tips
- [ ] All schemas validated with Google Rich Results Test (screenshot evidence)
- [ ] Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] Lighthouse Performance score 90+, SEO score 95+

**Engineer 2 (SEO Specialist):**
- [ ] Google Search Console property added and verified
- [ ] Sitemap.xml submitted and indexed (20+ URLs)
- [ ] Manual indexing requested for all 8 SEO landing pages
- [ ] Keyword tracking dashboard set up (weekly updates)
- [ ] All 13 pages pass Google Rich Results Test
- [ ] All pages pass Mobile-Friendly Test
- [ ] Technical SEO audit report delivered (no critical issues)
- [ ] Email alerts configured for Search Console

**Engineer 3 (Content):**
- [ ] 5 breed-specific landing pages created and deployed
  - [ ] /golden-retriever-portraits
  - [ ] /corgi-portraits
  - [ ] /persian-cat-portraits
  - [ ] /french-bulldog-portraits
  - [ ] /siamese-cat-portraits
- [ ] FAQ sections added to all 8 existing landing pages
- [ ] Backlink outreach to 30 sites (tracked in spreadsheet)
- [ ] 5+ backlinks acquired by deadline (March 24)
- [ ] 3+ featured snippet opportunities identified and optimized

---

## 🚀 Deployment Plan

**Pre-Deployment Checklist:**
1. Run `npm run build` - verify zero errors
2. Test all pages locally (http://localhost:3000)
3. Validate all schemas on Rich Results Test
4. Run Lighthouse audits on all pages (local)
5. Check OG images render correctly (use opengraph.xyz)

**Deployment Steps:**
1. Commit all changes: `git add -A && git commit -m "feat: SEO Phase 2 - OG images, schema expansion, 5 breed pages"`
2. Push to GitHub: `git push origin main`
3. GitHub Actions auto-deploys to GitHub Pages (staging)
4. Review staging site: https://caffeinegmt.github.io/pawcasso-atelier/
5. Michael manually deploys to Vercel production when ready

**Post-Deployment Validation:**
1. Visit https://pawcasso-atelier.vercel.app/sitemap.xml (verify all pages listed)
2. Visit https://pawcasso-atelier.vercel.app/robots.txt (verify sitemap reference)
3. Test OG images: https://opengraph.xyz
4. Run PageSpeed Insights: https://pagespeed.web.dev/
5. Check Google Search Console: Verify no indexing errors
6. Test dynamic OG route: https://pawcasso-atelier.vercel.app/api/og?title=Test

---

## 📝 Key Decisions & Rationale

1. **Vercel OG for Image Generation:** Chosen over ImageMagick or Puppeteer for edge compatibility and instant generation without heavy dependencies

2. **5 Breed-Specific Pages:** Focus on high-demand breeds (Golden Retriever, Corgi, French Bulldog) to capture long-tail keyword traffic

3. **Backlink Quality Over Quantity:** Targeting 10-20 high-DA backlinks from pet/lifestyle sites rather than 100+ low-quality directory submissions

4. **Featured Snippet Strategy:** FAQ format chosen over paragraph format for higher snippet win rate

5. **Core Web Vitals Priority:** LCP and CLS optimizations prioritized over FID (users rarely interact immediately on landing pages)

---

## 💡 Future Optimization Opportunities

**Phase 3 (April 2026):**
- International SEO: Add Spanish landing pages (/retratos-mascotas)
- Video SEO: Embed YouTube tutorials on pet photography
- Local SEO: If offering print fulfillment, add location-based pages
- Voice Search Optimization: Target conversational queries ("Where can I get a pet portrait?")

**Phase 4 (May-June 2026):**
- User-Generated Content: Customer photo galleries with testimonials
- Pinterest SEO: Create Rich Pins for all products
- Reddit/Quora Strategy: Answer pet portrait questions with backlinks
- Influencer Partnerships: Pet influencers review service (backlinks + social proof)

---

**Implementation Status:** 🚧 **IN PROGRESS**
**Engineers Assigned:** ✅ **3 Engineers Active**
**Estimated Completion:** March 24, 2026
**Risk Level:** 🟢 **LOW** (well-defined scope, proven techniques)

---

*This plan builds on Phase 1's strong foundation to unlock sustainable organic traffic growth and position Pawcasso Atelier as the #1 result for premium pet portrait keywords.*
