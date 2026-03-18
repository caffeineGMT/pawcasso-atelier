# Hacker News "Show HN" Launch Campaign - Pawcasso Atelier

**Launch Window:** Tuesday-Thursday, 8-10am PT (optimal HN posting time)
**Goal:** Front page for 4+ hours, 200-500 signups, 5-10% conversion
**Angle:** Technical transparency - "Show HN: I built an AI pet portrait generator using Manus/Flux"

---

## 📂 Campaign Files

### Core Materials
- **[LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md)** — Master checklist with timeline, tasks, success metrics
- **[hn-post-draft.md](./hn-post-draft.md)** — Complete HN post with title, description, technical details
- **[comment-playbook.md](./comment-playbook.md)** — Response templates for 20+ common HN questions/criticisms
- **[technical-blog-post.md](./technical-blog-post.md)** — Deep-dive technical post (link from HN for credibility)
- **[hn-exclusive-offer.md](./hn-exclusive-offer.md)** — Stripe coupon setup for HN community
- **[response-strategy.md](./response-strategy.md)** — How to respond to maximize ranking and conversions
- **[tracking-analytics.md](./tracking-analytics.md)** — UTM parameters, analytics setup, conversion tracking

---

## 🚀 Quick Start Guide

### 3 Days Before Launch
- [ ] Write technical blog post and publish on website (see [technical-blog-post.md](./technical-blog-post.md))
- [ ] Set up HN-exclusive Stripe discount codes (see [hn-exclusive-offer.md](./hn-exclusive-offer.md))
- [ ] Prepare 3-5 demo screenshots for HN post comments
- [ ] Test entire order flow with HACKERNEWS50 discount code
- [ ] Set up UTM tracking for HN traffic (see [tracking-analytics.md](./tracking-analytics.md))

### 1 Day Before Launch
- [ ] Draft HN post title and body (see [hn-post-draft.md](./hn-post-draft.md))
- [ ] Review comment playbook - internalize responses (see [comment-playbook.md](./comment-playbook.md))
- [ ] Set phone notifications to Max/Focus mode for HN
- [ ] Clear calendar for first 2 hours after posting (critical response window)
- [ ] Have demo screenshots and technical details ready to paste

### Launch Day (Tuesday-Thursday, 8-10am PT)
- [ ] **8:00 AM PT:** Submit to HN with "Show HN:" prefix
- [ ] **8:01 AM:** Post first comment with technical details and HN-exclusive offer
- [ ] **8:00-10:00 AM:** Respond to EVERY comment within 5 minutes (critical ranking window)
- [ ] **10:00 AM-6:00 PM:** Respond within 15-30 minutes
- [ ] **6:00 PM+:** Respond within 1-2 hours
- [ ] Monitor HN rank every 15 minutes (goal: crack front page by 10am)

### Post-Launch (Day 2+)
- [ ] Continue responding to comments for 48 hours
- [ ] Send personal thank yous to thoughtful commenters
- [ ] Write post-mortem blog post (what worked, what didn't, metrics)
- [ ] Analyze conversion data (traffic, signups, revenue)
- [ ] Iterate on product based on HN feedback

---

## 🎯 HN-Specific Strategy

### What Works on HN
1. **Technical transparency** - Share stack, decisions, tradeoffs, failures
2. **Maker story** - Why you built this, personal motivation, learning journey
3. **Honest limitations** - Acknowledge what doesn't work yet, what you're improving
4. **Generous offers** - Free value for HN community (free portraits, not just discounts)
5. **Rapid engagement** - Respond fast, thoughtfully, humbly

### What Kills HN Posts
1. **Marketing speak** - "Revolutionary", "game-changing", "disrupting"
2. **Vague responses** - "We're working on it" without specifics
3. **Defensiveness** - Arguing with criticism instead of acknowledging it
4. **Slow responses** - Waiting >30 minutes to reply in first 2 hours
5. **Fake engagement** - Generic responses, copy-paste replies

### HN-Specific Value Proposition
**Don't say:** "AI Pet Portraits - Museum-quality art in 24 hours"
**Do say:** "Show HN: I automated custom pet portraits with Manus/Flux - $9 because compute is cheap"

**Positioning:**
- Technical experiment that became a business
- Learning in public - sharing prompts, costs, architecture
- Honest about AI limitations (sometimes fails, needs regeneration)
- Transparent pricing (exactly what Manus costs vs. what I charge)

### Front Page Success Factors
1. **Post timing:** Tuesday-Thursday 8-10am PT (highest HN traffic)
2. **Title format:** "Show HN: [Specific thing you built] with [Interesting tech]"
3. **First 2 hours:** Get 10+ upvotes and 5+ comments (algorithm boost)
4. **Comment quality:** Thoughtful, detailed responses (HN rewards depth)
5. **Controversy/Interest:** Technical decisions that spark discussion (why Manus? why $9?)

---

## 🎁 HN-Exclusive Offer

### HACKERNEWS50
- **Discount:** First 50 HN users get FREE portrait (normally $9)
- **Code:** HACKERNEWS50
- **Limit:** 50 redemptions
- **Duration:** 7 days from launch
- **Purpose:** Show gratitude, build goodwill, get testimonials

### HACKERNEWS25
- **Discount:** 25% off ($9 → $6.75)
- **Code:** HACKERNEWS25
- **Limit:** Unlimited
- **Duration:** 30 days from launch
- **Purpose:** Extended offer for late HN readers

**Why free instead of discount:**
- HN users value generosity over deals
- Free = testimonials + word-of-mouth
- 50 free portraits = $450 cost (Manus credits) → worth it for front page exposure
- Positions you as "giving back to the community" not "selling to them"

---

## 📊 Success Metrics

### Minimum (Solid Launch)
- 20+ points on HN
- Front page for 2+ hours
- 50+ site visitors from HN
- 10+ orders (free + paid combined)
- 5+ meaningful technical discussions in comments

### Target (Strong Launch)
- 50+ points on HN
- Front page for 4+ hours
- 200+ site visitors from HN
- 30+ orders (50% conversion on free, 5% on paid)
- 10+ meaningful technical discussions
- 1-2 follow-up posts on Twitter/Reddit from HN users

### Stretch (Viral Launch)
- 100+ points on HN
- Front page for 8+ hours, top 5 ranking
- 500+ site visitors from HN
- 50+ orders
- 20+ meaningful discussions
- Press pickup (TechCrunch, The Verge mentions)
- 1-2 API partnership inquiries

---

## 💬 Response Philosophy

### Tone
- **Humble:** "Thanks for trying it! Yeah, that's a known issue I'm working on"
- **Technical:** Share specific details (Manus API costs, latency, failure rates)
- **Honest:** Acknowledge limitations, don't oversell
- **Grateful:** Thank everyone, even critics

### Structure
1. **Acknowledge:** "Great question" / "That's fair criticism"
2. **Answer:** Specific technical details, numbers, decisions
3. **Context:** Why you made that choice, what you learned
4. **Next steps:** What you're improving, timeline

### Example (Good)
> Q: "Why $9? That seems expensive for an API call that costs $0.50."
>
> A: "Fair question! Here's the breakdown: Manus API costs $0.53-1.14 per image (depends on resolution/style). I charge $9 because:
> - ~40% regeneration rate (prompts fail, need retries)
> - Manual QA review (I check every portrait before sending)
> - Stripe fees (2.9% + $0.30)
> - Email delivery (Resend API)
> - Actual margin is ~$4-5 per portrait
>
> I'm testing $9 vs $12 this month to see what converts better. If I can fully automate QA, I'd drop it to $6. Open to feedback!"

### Example (Bad)
> Q: "Why $9? That seems expensive for an API call that costs $0.50."
>
> A: "Thanks for the feedback! We've priced it competitively based on market research."

---

## 🏆 Post-Launch Playbook

### If Front Page in First Hour
- Keep responding to every comment
- Share behind-the-scenes technical details
- Post update in comments with live metrics (orders, traffic, uptime)
- Don't get cocky - stay humble and helpful

### If Not Trending After 2 Hours
- Check title (is it clear? interesting?)
- Post detailed technical comment (might spark new discussion)
- Share link in relevant communities (r/SideProject, Indie Hackers)
- Don't delete and repost (HN penalizes this)

### If Criticism Overwhelms Positive
- Don't argue or get defensive
- Acknowledge valid points
- Share what you're learning
- Use it as product feedback (HN users are your ideal early adopters)

### If Server/Payment Issues
- Post immediate update in comments
- Be transparent about the issue
- Offer to manually process orders via email
- Turn it into a learning moment (HN loves "what went wrong" stories)

---

## 📝 Content Calendar

### Before Launch
- **Day -3:** Publish technical blog post
- **Day -2:** Set up tracking, test discount codes
- **Day -1:** Draft post, review playbook

### Launch Day
- **8:00 AM:** Submit to HN
- **8:01 AM:** Post first comment (technical details + offer)
- **8-10 AM:** Respond to every comment within 5 minutes
- **10 AM-6 PM:** Respond within 15-30 minutes
- **6 PM:** Post update with metrics (traffic, orders, learnings)

### Post-Launch
- **Day +1:** Continue responding, thank commenters
- **Day +2:** Write post-mortem blog post
- **Day +7:** Review metrics, send follow-up to free portrait recipients (ask for testimonials)
- **Day +30:** Long-form retrospective (what HN taught me about the business)

---

## 🔗 Quick Links

- **Website:** https://pawcasso-atelier.vercel.app
- **HN Post:** [Will be live on launch day]
- **Technical Blog:** [To be published 3 days before launch]
- **Stripe Dashboard:** https://dashboard.stripe.com/
- **HN Guidelines:** https://news.ycombinator.com/newsguidelines.html
- **Show HN Guidelines:** https://news.ycombinator.com/showhn.html

---

## ⚠️ HN-Specific Risks

### Getting Flagged/Killed
- **Avoid:** Self-promotion without substance (HN mods kill these fast)
- **Avoid:** Reposting same link within 30 days
- **Avoid:** Vote manipulation (asking friends to upvote = instant ban)
- **Do:** Focus on technical details, learning in public, generosity

### Getting Roasted in Comments
- **Expect:** "This is just a wrapper around an API"
- **Expect:** "Why would anyone pay $9 for this?"
- **Expect:** "I built this in 30 minutes on a weekend"
- **Strategy:** Acknowledge, explain your value-add, share learnings

### Low Engagement
- **If <5 upvotes in 1 hour:** Post detailed technical comment to spark discussion
- **If <10 comments in 2 hours:** Share on Twitter with "just posted on HN" (light cross-promotion)
- **Don't:** Delete and repost (HN penalizes this severely)

---

## 📋 Final Pre-Launch Checklist

**3 Days Before:**
- [ ] Technical blog post written and published
- [ ] HN-exclusive discount codes created in Stripe
- [ ] Demo screenshots prepared (3-5 high-quality images)
- [ ] UTM tracking parameters set up
- [ ] Order flow tested end-to-end with discount codes

**1 Day Before:**
- [ ] HN post title and body drafted (see [hn-post-draft.md](./hn-post-draft.md))
- [ ] Comment playbook reviewed and internalized (see [comment-playbook.md](./comment-playbook.md))
- [ ] Phone notifications set to Max/Focus
- [ ] Calendar cleared for first 2 hours after posting
- [ ] Technical details and screenshots ready to paste

**Launch Day:**
- [ ] HN post submitted at 8-10am PT
- [ ] First comment posted immediately (technical details + offer)
- [ ] Responding to every comment within 5 minutes (first 2 hours)
- [ ] Monitoring HN rank every 15 minutes

---

**Created by:** Michael Guo
**Campaign Budget:** $450 (50 free portraits via Manus API)
**Time Investment:** ~20 hours (planning, content, responding)
**Expected ROI:** Front page exposure (50k+ impressions) + 200-500 visitors + 30+ orders + product validation

**Let's hit the HN front page! 🚀**
