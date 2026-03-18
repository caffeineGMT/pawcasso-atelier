# Hacker News Launch Checklist

**Launch Window:** Tuesday-Thursday, 8-10am PT
**Campaign Duration:** 48 hours (active engagement)
**Budget:** $88.50 (50 free portraits via Manus API)
**Time Investment:** ~20 hours (planning + active engagement)

---

## 3 Days Before Launch (Sunday)

### Content Preparation
- [ ] Write and publish technical blog post (see [technical-blog-post.md](./technical-blog-post.md))
  - [ ] Deploy to `website/src/app/blog/building-ai-pet-portrait-generator/page.tsx`
  - [ ] Add Open Graph meta tags (title, description, image)
  - [ ] Test on mobile and desktop
  - [ ] Share on Twitter/LinkedIn for initial traction
- [ ] Prepare 5 demo screenshots for HN comments
  - [ ] Order flow (upload → style selection → checkout)
  - [ ] Gallery view (mobile + desktop)
  - [ ] Before/after transformations (3-4 examples)
  - [ ] Behind-the-scenes (Manus API call, prompt engineering)
  - [ ] Upload to Imgur or host on website

### Technical Setup
- [ ] Create Stripe discount codes (see [hn-exclusive-offer.md](./hn-exclusive-offer.md))
  - [ ] HACKERNEWS50: 100% off, 50 redemptions, 7 days
  - [ ] HACKERNEWS25: 25% off, unlimited, 30 days
  - [ ] Test both codes in Stripe test mode
  - [ ] Switch to LIVE mode
- [ ] Add discount code field to order form
  - [ ] Frontend validation (API call to validate coupon)
  - [ ] Show discount amount in real-time
  - [ ] Pass discount code to Stripe Checkout
- [ ] Set up UTM tracking (see [tracking-analytics.md](./tracking-analytics.md))
  - [ ] Add `?utm_source=hackernews&utm_medium=show-hn&utm_campaign=hn-launch-2026-03` to all links
  - [ ] Test Google Analytics event tracking
  - [ ] Verify Vercel Analytics is capturing HN traffic
- [ ] Verify order fulfillment pipeline
  - [ ] Place test order with HACKERNEWS50 (should be $0.00)
  - [ ] Confirm order appears in Stripe dashboard
  - [ ] Test manual QA workflow (Google Sheet)
  - [ ] Test email delivery (Resend)

### Operational Setup
- [ ] Clear calendar for launch day (8am-6pm PT)
- [ ] Set up monitoring
  - [ ] Stripe dashboard bookmarked
  - [ ] Google Analytics open in tab
  - [ ] Vercel deployment logs open
  - [ ] HN post URL (will be live on launch day)
- [ ] Prepare emergency contacts
  - [ ] Vercel support (for deployment issues)
  - [ ] Stripe support (for payment issues)
  - [ ] Manus API support (for generation issues)

---

## 1 Day Before Launch (Monday)

### Final Content Review
- [ ] Draft HN post (see [hn-post-draft.md](./hn-post-draft.md))
  - [ ] Title: "Show HN: I automated custom pet portraits with Manus/Flux for $9"
  - [ ] Body: Technical transparency (1,500-1,800 chars)
  - [ ] First comment: Additional context + HN-exclusive offer (ready to paste)
  - [ ] Save drafts in notes app (in case you need to repost)
- [ ] Review comment playbook (see [comment-playbook.md](./comment-playbook.md))
  - [ ] Read through all 20+ response templates
  - [ ] Internalize tone and structure
  - [ ] Practice responding to mock questions

### Website Hardening
- [ ] Load test order page
  - [ ] Use Vercel Load Testing or Artillery
  - [ ] Target: 100 concurrent users (HN traffic spike)
  - [ ] Verify Edge Functions don't timeout
- [ ] Error monitoring
  - [ ] Verify Vercel error tracking is enabled
  - [ ] Test 404 pages, broken links
  - [ ] Verify Stripe webhook is live (test with Stripe CLI)
- [ ] Mobile optimization
  - [ ] Test order form on iPhone Safari, Chrome
  - [ ] Test gallery filters on mobile
  - [ ] Verify discount code field works on mobile keyboard
- [ ] Content check
  - [ ] Fix any typos in gallery, order page, homepage
  - [ ] Verify all 14 gallery images load correctly
  - [ ] Update meta descriptions (SEO)

### Final Tests
- [ ] Test complete order flow (end-to-end)
  - [ ] Order with HACKERNEWS50 (free)
  - [ ] Order with HACKERNEWS25 (25% off)
  - [ ] Order with no discount code
  - [ ] Verify Stripe metadata captures discount code
  - [ ] Verify email delivery works
- [ ] Test website under load
  - [ ] Open 20 tabs to order page (simulate traffic spike)
  - [ ] Verify site doesn't crash
  - [ ] Check Vercel Edge Function logs for errors

### Notifications Setup
- [ ] Phone alerts for HN
  - [ ] Download HN app or set up web notifications
  - [ ] Turn ON notifications for all HN activity
  - [ ] Set phone to Max/Focus mode
- [ ] Browser tabs ready
  - [ ] HN homepage: https://news.ycombinator.com
  - [ ] Stripe dashboard: https://dashboard.stripe.com
  - [ ] Google Analytics: https://analytics.google.com
  - [ ] Vercel deployments: https://vercel.com/dashboard
  - [ ] Comment playbook: Open in separate window

---

## Launch Day (Tuesday 8am PT)

### Hour 0: 8:00 AM - Submission

**8:00 AM:**
- [ ] Submit to HN
  - [ ] Go to: https://news.ycombinator.com/submit
  - [ ] Title: "Show HN: I automated custom pet portraits with Manus/Flux for $9"
  - [ ] URL: Leave blank (we're submitting as "text")
  - [ ] Text: Paste from [hn-post-draft.md](./hn-post-draft.md) (Draft A - Technical Transparency)
  - [ ] Click "submit"
- [ ] Copy HN post URL (e.g., https://news.ycombinator.com/item?id=12345678)
- [ ] Bookmark HN post URL
- [ ] Set 5-minute timer for comment check

**8:01 AM:**
- [ ] Post first comment with additional context
  - [ ] Paste from [hn-post-draft.md](./hn-post-draft.md) (First Comment section)
  - [ ] Include HACKERNEWS50 and HACKERNEWS25 codes
  - [ ] Include direct links to order page with UTM parameters

**8:05 AM:**
- [ ] Check HN rank
  - [ ] Go to: https://news.ycombinator.com/newest
  - [ ] Find your post (should be top 5)
  - [ ] Note current rank and upvotes

**8:10 AM:**
- [ ] Share on Twitter (light cross-promotion)
  - [ ] "Just posted on HN about building an AI pet portrait generator. Would love your feedback! [HN link]"
  - [ ] Don't ask for upvotes (against HN rules)

---

### Hour 1-2: 8:00-10:00 AM - Critical Engagement Window

**Every 5 Minutes:**
- [ ] Check for new comments on HN
- [ ] Respond to EVERY comment within 5 minutes
- [ ] Use comment playbook for common questions (see [comment-playbook.md](./comment-playbook.md))
- [ ] Be humble, specific, grateful

**Every 15 Minutes:**
- [ ] Check HN rank (https://news.ycombinator.com)
  - [ ] Goal: Front page (top 30) by 9:00 AM
  - [ ] Goal: Top 10 by 10:00 AM
- [ ] Monitor Stripe dashboard for orders
  - [ ] Note HACKERNEWS50 redemptions
  - [ ] Celebrate milestones (10, 25, 50 redemptions)

**9:00 AM:**
- [ ] Post update if trending well
  - [ ] "Update: Thanks for the amazing response! HACKERNEWS50 is 25/50 used. If you want a free portrait, grab it now!"
- [ ] OR post technical deep-dive if engagement is slow
  - [ ] Share detailed prompt engineering learnings
  - [ ] Post screenshot of Manus API call

**10:00 AM:**
- [ ] Assess launch status
  - [ ] **Success:** Front page (top 30), 10+ comments, 5+ orders
  - [ ] **Moderate:** Page 2 (30-60), 5+ comments, 2+ orders
  - [ ] **Struggling:** Page 3+ (<60), <5 comments, <2 orders

---

### Hour 2-8: 10:00 AM - 6:00 PM - Active Engagement

**Every 15-30 Minutes:**
- [ ] Check for new comments
- [ ] Respond within 15-30 minutes (still fast, but not as critical)
- [ ] Monitor HN rank (goal: stay on front page for 4+ hours)

**12:00 PM (Midday):**
- [ ] Post update with metrics
  - [ ] "Update: 4 hours in. Crazy response - 30+ orders, HACKERNEWS50 is sold out (50/50). Use HACKERNEWS25 for 25% off!"
  - [ ] Share interesting learnings from comments
  - [ ] Thank specific commenters who gave great feedback

**3:00 PM:**
- [ ] Post technical screenshot (if engagement is high)
  - [ ] Behind-the-scenes: Manus API call, prompt engineering process
  - [ ] "Lots of questions about prompt engineering. Here's what a typical API call looks like: [screenshot]"

**6:00 PM:**
- [ ] Wind down active engagement
  - [ ] Continue responding, but slower (within 1-2 hours)
  - [ ] Post final update: "Heading offline for the evening. Will respond to all questions tomorrow morning. Thanks for the incredible feedback!"

---

### Hour 8-24: 6:00 PM - Next Day - Maintenance

**Every 1-2 Hours:**
- [ ] Check for new comments
- [ ] Respond thoughtfully (focus on quality over speed)
- [ ] Monitor order volume and Stripe dashboard

**Before Bed:**
- [ ] Export analytics data
  - [ ] Stripe: Total orders, revenue, discount code usage
  - [ ] Google Analytics: Traffic, conversion rate, bounce rate
  - [ ] HN: Upvotes, comments, rank
- [ ] Write quick post-mortem notes
  - [ ] What worked well?
  - [ ] What didn't work?
  - [ ] Surprising questions/criticisms?

**Next Morning:**
- [ ] Post morning update on HN
  - [ ] "Morning update: 24 hours in, 50+ orders, 100+ comments. Blown away by the response. Still answering questions - fire away!"
  - [ ] Share overnight metrics
  - [ ] Thank commenters by name

---

## Day 2-7: Post-Launch Follow-Up

### Day 2 (Wednesday)
- [ ] Continue responding to HN comments (within 2-4 hours)
- [ ] Send thank you email to HACKERNEWS50 users
  - [ ] Subject: "Thanks for trying Pawcasso (from HN)!"
  - [ ] Ask for feedback and testimonials
  - [ ] See [hn-exclusive-offer.md](./hn-exclusive-offer.md) for email template
- [ ] Write post-mortem blog post (draft)
  - [ ] What worked: Technical transparency, fast responses, generous offer
  - [ ] What didn't work: [TBD based on actual results]
  - [ ] Metrics: Traffic, orders, revenue, comments, upvotes
- [ ] Share recap on Twitter/LinkedIn
  - [ ] "HN launch recap: [X] upvotes, [Y] orders, [Z] learnings. Full writeup: [blog link]"

### Day 3-7 (Thursday-Monday)
- [ ] Continue responding to HN comments (within 4-8 hours)
- [ ] Monitor HACKERNEWS25 usage (30-day window)
- [ ] Process all free portrait orders (HACKERNEWS50)
  - [ ] Manual QA (5 min per portrait)
  - [ ] Email delivery within 24 hours
  - [ ] Track satisfaction (ask for ratings in email)
- [ ] Collect testimonials from happy customers
  - [ ] Email follow-up 3 days after delivery
  - [ ] Ask for 1-sentence testimonial
  - [ ] Offer $5 credit for future order (incentive)

### Week 2
- [ ] Write full post-mortem blog post
  - [ ] Publish on website
  - [ ] Share on HN as "Ask HN: I launched on HN last week - here's what I learned"
  - [ ] Share on Twitter, LinkedIn, Indie Hackers
- [ ] Analyze HN user behavior
  - [ ] Conversion rate: HN visitors → orders
  - [ ] Retention: HACKERNEWS50 users who ordered again
  - [ ] LTV: Average revenue per HN user
- [ ] Iterate on product based on feedback
  - [ ] Common feature requests?
  - [ ] Pricing concerns?
  - [ ] Quality issues?

---

## Success Metrics

### Minimum (Solid Launch)
- [ ] 20+ HN points
- [ ] Front page for 2+ hours
- [ ] 50+ website visitors from HN
- [ ] 10+ orders (free + paid)
- [ ] 5+ meaningful technical discussions

### Target (Strong Launch)
- [ ] 50+ HN points
- [ ] Front page for 4+ hours
- [ ] 200+ website visitors from HN
- [ ] 30+ orders (50% conversion on free, 5% on paid)
- [ ] 10+ meaningful technical discussions

### Stretch (Viral Launch)
- [ ] 100+ HN points
- [ ] Front page for 8+ hours, top 5 rank
- [ ] 500+ website visitors from HN
- [ ] 50+ orders
- [ ] 20+ meaningful discussions
- [ ] Press pickup (TechCrunch, The Verge)

---

## Contingency Plans

### If Site Crashes Under Traffic
- [ ] Post update on HN: "Site is down due to HN traffic (rookie mistake!). Email me at [email] to order manually."
- [ ] Check Vercel logs for errors
- [ ] Scale up Vercel Edge Functions if needed
- [ ] Process manual orders via Stripe invoices

### If Stripe Checkout Breaks
- [ ] Post update: "Stripe integration issue (on me). Email [email] with pet photo + style, I'll send invoice manually."
- [ ] Debug Stripe webhook
- [ ] Fall back to manual Stripe invoice workflow

### If Manus API Goes Down
- [ ] Post update: "Manus API is down (not my fault this time!). Queueing orders, will process ASAP."
- [ ] Check Manus API status page
- [ ] Email queued customers with ETA
- [ ] Extend HACKERNEWS50 validity if needed

### If Not Trending After 2 Hours
- [ ] Post detailed technical comment to spark discussion
- [ ] Share prompt engineering learnings
- [ ] Post screenshot of Manus API call
- [ ] Don't delete and repost (HN penalizes this)

### If HACKERNEWS50 Runs Out in <1 Hour
- [ ] Extend to 100 redemptions (double it)
- [ ] Post update: "HACKERNEWS50 sold out in 45 min! Extending to 100 redemptions."
- [ ] OR create HACKERNEWS75 (75% off) for next 50 people

### If Getting Heavily Criticized
- [ ] Don't argue or get defensive
- [ ] Acknowledge valid criticisms
- [ ] Share what you're learning
- [ ] Use feedback to improve product
- [ ] Remember: HN users are your ideal early adopters

---

## Tools & Resources

### HN Monitoring
- **HN Homepage:** https://news.ycombinator.com
- **HN Newest:** https://news.ycombinator.com/newest
- **HN Algolia (search):** https://hn.algolia.com
- **HN Mobile App:** Download for push notifications

### Analytics
- **Google Analytics:** https://analytics.google.com
- **Vercel Analytics:** https://vercel.com/dashboard
- **Stripe Dashboard:** https://dashboard.stripe.com

### Communication
- **Comment Playbook:** [comment-playbook.md](./comment-playbook.md)
- **Technical Blog Post:** [link to published post]
- **Demo Screenshots:** [Imgur album or website folder]

### Support
- **Vercel Support:** support@vercel.com
- **Stripe Support:** https://support.stripe.com
- **Manus API Support:** [check Manus docs]

---

## Final Pre-Launch Checklist (Morning Of)

**7:30 AM (30 min before launch):**
- [ ] Coffee ready ☕
- [ ] Phone charged and notifications ON
- [ ] Laptop plugged in
- [ ] All browser tabs open (HN, Stripe, Analytics, Playbook)
- [ ] HN post draft ready to paste
- [ ] First comment ready to paste
- [ ] Calendar cleared for 2+ hours
- [ ] Mental state: Calm, humble, ready to engage

**8:00 AM:**
- [ ] Submit to HN
- [ ] Post first comment
- [ ] Start 5-minute timer
- [ ] Take a deep breath
- [ ] Let's hit the front page! 🚀

---

**Remember:** HN rewards honesty, humility, and technical depth. Be yourself. Share what you learned. Help others. The rest will follow.

**Good luck!** 🪶
