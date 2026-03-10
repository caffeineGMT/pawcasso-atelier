# Pawcasso Atelier — Roadmap

> Living document. Revisit, check off, reprioritize as the business evolves.
> Last updated: 2026-03-10

---

## Vision

A fully self-automated AI art business. Manus generates content, n8n orchestrates the pipeline, Instagram grows the audience, and the website converts followers into paying customers. Michael's role: creative direction, review/approval, and steering the business.

---

## Current State (as of March 10, 2026)

| Area | Status |
|------|--------|
| **Website** | Live at pawcasso-atelier.vercel.app — Apple-style design, 34 artworks, gallery filters, $9 checkout |
| **Stripe** | Test mode working, checkout → thank-you flow complete |
| **Instagram** | @pawcasso.atelier created, 23 captions ready in `content/captions/ready-to-post.json` |
| **n8n Workflow** | Active (ID: JI702eSmG1pEdAxf), daily 8 AM PT trigger, 12 nodes |
| **Manus API** | Confirmed working, ~53-114 credits per image |
| **Content** | 34 gallery pieces across 19 styles and 22 animal types |
| **Posting Schedule** | Week 1-2 mapped in `content/posting-schedule.md` |

---

## Phase 1: Launch & First Revenue (Week of March 10)

The goal: start posting, start selling, close the loop from content → audience → revenue.

### 1.1 Go Live with Stripe (P0)
- [ ] Switch Stripe from test keys to live keys on Vercel
- [ ] Place one real test order end-to-end
- [ ] Set up Stripe webhook → email notification for new orders (so you actually know when someone pays)
- [ ] Verify thank-you page and order confirmation flow

### 1.2 Start Posting to Instagram (P0)
- [ ] Post Day 1 content: "Moonlit Garden" (Golden Retriever Ghibli) — March 10
- [ ] Follow Week 1 schedule from `posting-schedule.md`
- [ ] Add hashtags in first comment (not caption body)
- [ ] Share each post to Stories with engagement sticker (poll/question)
- [ ] Reply to every comment within 2 hours

### 1.3 Photo Upload on Order Page (P0)
- [ ] Add file upload field to order form (customers need to send a photo of their pet)
- [ ] Options: Vercel Blob, Cloudinary, or simple email attachment
- [ ] Show upload preview on the form
- [ ] Include uploaded photo URL in Stripe metadata / webhook payload

### 1.4 Order Fulfillment Pipeline (P1)
- [ ] Define the fulfillment flow: order received → generate portrait → deliver via email
- [ ] Set up email delivery (Resend, SendGrid, or manual for now)
- [ ] Target: 24-hour turnaround as promised on the site

---

## Phase 2: Automation & Growth (Weeks 2-4)

### 2.1 Instagram Graph API (P1)
- [ ] Set up Meta Business Suite / Creator Studio for @pawcasso.atelier
- [ ] Get Instagram Graph API credentials (Facebook App → Instagram Basic Display or Business API)
- [ ] Build or connect n8n node for automated posting
- [ ] Human-in-the-loop: queue for review → approve → auto-post

### 2.2 n8n Pipeline Hardening (P1)
- [ ] Replace httpbin.org dummy in "Send to Michael for Review" node with real GChat webhook
  - Store webhook URL at `~/.claude/metaclaw/.gchat_webhook`
- [ ] Verify first automated run (8 AM PT daily trigger)
- [ ] Update stale Manus API key in n8n workflow
- [ ] Add error handling / retry logic for Manus API failures
- [ ] Add quality gate: n8n calls Manus back if image quality is poor (creative orchestrator vision)

### 2.3 Website Performance (P1)
- [ ] **Image optimization** — gallery images are 5-8MB PNGs. Convert to WebP, use Next.js `<Image>` with proper srcSet/sizes
- [ ] **Mobile audit** — test all pages on iPhone/Android viewports, especially gallery grid and order form
- [ ] **Loading states** — add skeleton loaders for gallery, shimmer on image load
- [ ] **Lighthouse score** — target 90+ on Performance, Accessibility, SEO

### 2.4 SEO & Discovery (P2)
- [ ] Add Open Graph / Twitter Card meta tags to all pages
- [ ] Generate OG images for gallery pieces (auto-generated via `next/og` or static)
- [ ] Add structured data (JSON-LD) for Product schema on order page
- [ ] Sitemap.xml and robots.txt
- [ ] Google Search Console setup

---

## Phase 3: Content Engine & Brand (Month 2)

### 3.1 Content Volume (P1)
- [ ] Scale to 2 posts/day (morning + evening for different time zones)
- [ ] Build content backlog: always have 2 weeks of ready-to-post content
- [ ] Expand content pillars:
  - **Reels/TikTok**: style transformation reveals, before/after, zoom-in details
  - **Carousels**: "Which style suits your pet?" polls
  - **Behind the scenes**: show the AI generation process (screen recordings)
- [ ] Track which styles/animals get the most engagement → double down

### 3.2 Cross-Platform (P2)
- [ ] TikTok account + short-form video content
- [ ] Pinterest boards (leverage existing scraper at `services/pinterest-scraper/`)
- [ ] RedNote (Xiaohongshu) — huge market for pet content in Asia
- [ ] Deploy Pinterest scraper microservice

### 3.3 Email & Community (P2)
- [ ] Email capture on website — "Get 10% off your first portrait" or "Free weekly art drops"
- [ ] Welcome email sequence (Resend, ConvertKit, or Mailchimp)
- [ ] Community engagement strategy: UGC reposts, pet photo contests, follower spotlights

### 3.4 Blog / Content Marketing (P3)
- [ ] SEO landing pages: "Best AI Pet Portrait Styles", "Custom Cat Portraits", etc.
- [ ] Style guide pages — one page per art style with examples
- [ ] Target long-tail keywords for organic traffic

---

## Phase 4: Scale & Optimize (Month 3+)

### 4.1 Pricing & Products (P1)
- [ ] Test price points ($9 → $12 → $15) based on demand
- [ ] Add premium tiers: multi-pet portraits, custom backgrounds, print-ready (if demand exists)
- [ ] Gift card / gift-a-portrait flow
- [ ] Seasonal collections (holiday, zodiac series, etc.)

### 4.2 Customer Experience (P1)
- [ ] Customer dashboard — order status tracking
- [ ] Gallery of customer portraits (with permission) — social proof
- [ ] Testimonials section on website
- [ ] Referral program ("Share with a friend, both get $2 off")

### 4.3 Analytics & Optimization (P2)
- [ ] Vercel Analytics or Google Analytics on the website
- [ ] Track conversion funnel: landing → gallery → order → checkout → payment
- [ ] Instagram analytics: engagement rate, follower growth, best posting times
- [ ] A/B test order page copy, CTA buttons, pricing display
- [ ] Error monitoring (Sentry) for production issues

### 4.4 Advanced Automation (P3)
- [ ] Fully automated order pipeline: Stripe webhook → Manus generates portrait → email delivery
- [ ] Auto-generate captions with trending hashtag research
- [ ] Smart scheduling: post at optimal times based on audience analytics
- [ ] Auto-respond to DMs with order link (within Instagram DM API limits)

---

## Technical Debt & Infrastructure

| Item | Priority | Notes |
|------|----------|-------|
| Image optimization (PNG → WebP) | P1 | 34 images at 5-8MB each = ~200MB gallery load |
| n8n Manus API key stale | P1 | Workflow ID `xvJtL2RsY0MSHP15` needs updated key |
| GChat webhook for n8n | P1 | Currently posts to httpbin.org (dummy) |
| Pinterest scraper not deployed | P3 | Built at `services/pinterest-scraper/`, needs hosting |
| Stripe test → live | P0 | Can't take real money until this is done |
| Instagram API credentials | P1 | Needed for automated posting |

---

## Key Metrics to Track

| Metric | Target (Month 1) | Target (Month 3) |
|--------|-------------------|-------------------|
| Instagram followers | 1,000 | 10,000 |
| Daily posts | 1 | 2 |
| Website visitors/day | 50 | 500 |
| Orders/week | 5 | 50 |
| Revenue/month | $200 | $2,000 |
| Content backlog | 1 week | 3 weeks |
| Avg engagement rate | 5% | 8% |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    n8n (Orchestrator)                │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ Schedule  │→ │ Concept  │→ │ Manus API         │  │
│  │ Trigger   │  │ Generator│  │ (Image Generation)│  │
│  └──────────┘  └──────────┘  └───────┬───────────┘  │
│                                       │              │
│  ┌──────────┐  ┌──────────┐  ┌───────▼───────────┐  │
│  │ Instagram │← │ Approval │← │ GChat Review      │  │
│  │ Graph API │  │ Gate     │  │ Notification      │  │
│  └──────────┘  └──────────┘  └───────────────────┘  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│              Website (Next.js on Vercel)             │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ Gallery   │  │ Order    │  │ Stripe Checkout   │  │
│  │ (34 works)│  │ Form     │  │ ($9 digital)      │  │
│  └──────────┘  └──────────┘  └───────┬───────────┘  │
│                                       │              │
│  ┌──────────┐                 ┌───────▼───────────┐  │
│  │ Thank You │←────────────── │ Webhook →          │  │
│  │ Page      │                │ Fulfillment        │  │
│  └──────────┘                └───────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## Links & References

| Resource | URL / Path |
|----------|------------|
| Website | https://pawcasso-atelier.vercel.app |
| GitHub | caffeineGMT/pawcasso-atelier |
| Instagram | @pawcasso.atelier |
| Vercel Project | prj_0FaENVlTCjWiSfuesP2wa5ga68Md |
| n8n Workflow | ID: JI702eSmG1pEdAxf |
| Manus API Key | `~/.claude/metaclaw/.manus_api_key` |
| Vercel Token | `~/.claude/metaclaw/.vercel_token` |
| Captions | `content/captions/ready-to-post.json` |
| Posting Schedule | `content/posting-schedule.md` |
| Stripe Config | `website/src/lib/stripe.ts` |
