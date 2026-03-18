# HN Launch Implementation Summary

**Created:** March 18, 2026
**Status:** Ready to execute
**Launch Window:** Tuesday-Thursday, 8-10am PT (optimal HN traffic)

---

## What's Included

### 📂 8 Complete Launch Documents

1. **[README.md](./README.md)** — Campaign overview, strategy, quick links
2. **[LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md)** — Day-by-day timeline with 100+ action items
3. **[hn-post-draft.md](./hn-post-draft.md)** — 4 title options, 3 body drafts, first comment template
4. **[comment-playbook.md](./comment-playbook.md)** — Pre-written responses for 20+ common HN questions
5. **[response-strategy.md](./response-strategy.md)** — Tactical guide to maximizing ranking and conversions
6. **[hn-exclusive-offer.md](./hn-exclusive-offer.md)** — Stripe coupon setup (HACKERNEWS50, HACKERNEWS25)
7. **[technical-blog-post.md](./technical-blog-post.md)** — 2,000-word deep-dive for credibility
8. **[tracking-analytics.md](./tracking-analytics.md)** — UTM parameters, Google Analytics events, metrics dashboard

---

## Next Steps

### 3 Days Before Launch

1. **Write and publish technical blog post**
   - Location: `website/src/app/blog/building-ai-pet-portrait-generator/page.tsx`
   - Content: Use [technical-blog-post.md](./technical-blog-post.md) as template
   - SEO: Add Open Graph tags, canonical URL, structured data

2. **Set up Stripe discount codes**
   - HACKERNEWS50: 100% off, 50 redemptions, 7 days
   - HACKERNEWS25: 25% off, unlimited, 30 days
   - Test both codes in test mode, then switch to LIVE

3. **Add discount code field to order form**
   - Location: `website/src/app/order/page.tsx`
   - Add validation API route: `website/src/app/api/validate-coupon/route.ts`
   - Update checkout API to accept discount codes

4. **Set up tracking**
   - Add UTM parameters to all HN links
   - Verify Google Analytics event tracking
   - Test Stripe metadata capture

### 1 Day Before Launch

1. **Draft HN post**
   - Use [hn-post-draft.md](./hn-post-draft.md) Draft A (Technical Transparency)
   - Title: "Show HN: I automated custom pet portraits with Manus/Flux for $9"
   - Save in notes app for quick paste

2. **Review comment playbook**
   - Read through [comment-playbook.md](./comment-playbook.md)
   - Internalize tone and structure
   - Practice responding to mock questions

3. **Final tests**
   - Test order flow with HACKERNEWS50 (should be $0.00)
   - Test order flow with HACKERNEWS25 (should be 25% off)
   - Load test website (100 concurrent users)

### Launch Day (8:00 AM PT)

1. **Submit to HN**
   - Go to: https://news.ycombinator.com/submit
   - Paste title and body from draft
   - Post as "text" (not URL)

2. **Post first comment immediately**
   - Additional context + HN-exclusive offer
   - Use [hn-post-draft.md](./hn-post-draft.md) first comment template

3. **Respond to EVERY comment within 5 minutes** (first 2 hours)
   - Use [comment-playbook.md](./comment-playbook.md) for common questions
   - Follow [response-strategy.md](./response-strategy.md) for tone and structure

4. **Monitor and update**
   - Post updates at 1hr, 4hr, 10hr marks
   - Track metrics (Stripe, GA, HN rank)
   - Celebrate milestones (HACKERNEWS50 at 25/50, sold out, etc.)

---

## Key Decisions Made

### Offer Strategy: Free > Discount
- **HACKERNEWS50:** 100% off (free) for first 50 users
- **Why:** HN values generosity, free = better testimonials, $88.50 cost is worth front page exposure
- **Alternative considered:** 50% off (cheaper but less generous)

### Post Angle: Technical Transparency
- **Approach:** Lead with tech stack, cost breakdown, honest challenges
- **Why:** HN rewards honesty about failures and learning
- **Alternative considered:** Business/maker story (too "soft" for HN)

### Response Philosophy: Humble + Specific
- **Tone:** Acknowledge criticism, share details, invite collaboration
- **Why:** HN hates defensiveness and marketing speak
- **Alternative considered:** Professional/corporate tone (too salesy)

### Launch Timing: Tuesday-Thursday, 8-10am PT
- **Why:** Highest HN traffic, best chance of front page
- **Alternative considered:** Monday (too slow), Friday (weekend drop-off)

---

## Success Metrics

### Minimum (Solid Launch)
- 20+ HN points
- Front page for 2+ hours
- 50+ site visitors
- 10+ orders

### Target (Strong Launch)
- 50+ HN points
- Front page for 4+ hours
- 200+ site visitors
- 30+ orders

### Stretch (Viral Launch)
- 100+ HN points
- Top 5 rank for 8+ hours
- 500+ site visitors
- 50+ orders
- Press pickup

---

## Budget & Time Investment

### Direct Costs
- Manus API (50 free portraits): $87.50
- Stripe fees (negligible on $0 orders): $0
- **Total:** $87.50

### Time Investment
- Planning & content creation: 8 hours (already done)
- Launch day (active engagement): 8 hours
- Post-launch follow-up: 4 hours
- **Total:** 20 hours

### Expected ROI
- Front page exposure: 50k+ impressions
- Website traffic: 200-500 visitors
- Email subscribers: 50-70
- Testimonials: 10-20
- Word-of-mouth: Priceless

**Conservative ROI:** 10x (cost of free portraits vs value of exposure)
**Optimistic ROI:** 50x (if 10% of free users become paying customers)

---

## Files to Customize Before Launch

### 1. Technical Blog Post
- [ ] Replace `[DATE]` with actual publish date
- [ ] Replace `[your-email@example.com]` with your email
- [ ] Add real gallery screenshot URLs
- [ ] Update "Published" date at bottom

### 2. HN Post Draft
- [ ] Choose title (recommend Option 1)
- [ ] Choose body (recommend Draft A)
- [ ] Update "Order:" link with UTM parameters
- [ ] Save in notes app for quick copy-paste

### 3. Tracking URLs
- [ ] Update `utm_campaign` with actual launch date (e.g., `hn-launch-2026-03-22`)
- [ ] Test all UTM-tagged links in Google Analytics
- [ ] Verify they appear in GA real-time dashboard

---

## Common Pitfalls to Avoid

### ❌ Don't
- Ask for upvotes (against HN rules)
- Argue with critics (kills engagement)
- Use marketing buzzwords (HN hates this)
- Copy-paste generic responses (people notice)
- Delete and repost (HN penalizes this)

### ✅ Do
- Respond within 5 minutes (first 2 hours)
- Be humble and honest
- Share technical details and costs
- Thank everyone (even critics)
- Have fun and learn in public

---

## Emergency Contacts

### If Site Crashes
- **Vercel Support:** support@vercel.com
- **Backup:** Post on HN "Site down due to HN traffic - email me at [email] to order manually"

### If Stripe Breaks
- **Stripe Support:** https://support.stripe.com
- **Backup:** Manual Stripe invoices via email

### If Manus API Down
- **Manus Support:** [check Manus docs]
- **Backup:** Queue orders, process when API is back up

---

## Post-Launch Actions

### Day 1 (Wednesday)
- [ ] Send thank you email to HACKERNEWS50 users
- [ ] Continue responding to HN comments (within 2-4 hours)
- [ ] Write quick post-mortem notes (what worked, what didn't)

### Week 1
- [ ] Process all free portrait orders (24-hour turnaround)
- [ ] Collect testimonials (email follow-up 3 days after delivery)
- [ ] Write full post-mortem blog post

### Week 2
- [ ] Post "Ask HN: I launched last week - here's what I learned"
- [ ] Share on Twitter, LinkedIn, Indie Hackers
- [ ] Iterate on product based on HN feedback

---

## Final Checklist

**Before you launch:**
- [ ] All 8 campaign documents reviewed
- [ ] Technical blog post published
- [ ] Stripe discount codes created (test mode → LIVE mode)
- [ ] Discount code field added to order form
- [ ] UTM tracking set up and tested
- [ ] Order flow tested end-to-end
- [ ] HN post drafted and saved
- [ ] Comment playbook reviewed
- [ ] Phone notifications ON
- [ ] Calendar cleared for 8+ hours
- [ ] Coffee ready ☕

**You're ready to launch! 🚀**

---

**Questions?** Re-read:
- [README.md](./README.md) for strategy overview
- [LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md) for step-by-step timeline
- [response-strategy.md](./response-strategy.md) for tactical response guide

**Good luck on Hacker News! 🪶**
