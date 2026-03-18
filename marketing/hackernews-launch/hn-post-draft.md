# Hacker News Post Draft

## Title Options (Pick One)

### Option 1: Technical + Specific (RECOMMENDED)
```
Show HN: I automated custom pet portraits with Manus/Flux for $9
```
**Why it works:** Specific tech (Manus/Flux), concrete pricing, clear value prop

### Option 2: Learning Journey
```
Show HN: Building an AI pet portrait business - what I learned about prompt engineering
```
**Why it works:** "Learning in public" angle, HN loves post-mortems

### Option 3: Cost Transparency
```
Show HN: AI pet portraits - $0.53 API cost, $9 price, here's the breakdown
```
**Why it works:** Radical transparency, sparks pricing discussion

### Option 4: Technical Challenge
```
Show HN: I built a pet portrait generator - 40% of AI outputs fail and need retries
```
**Why it works:** Honest about technical challenges, invites problem-solving discussion

---

## Post Body (Submit as "Text")

**Important:** HN allows either URL or text, not both. For Show HN, text posts with a link in the body perform better because they allow you to frame the narrative.

### Draft A: Technical Transparency (RECOMMENDED)

```
I built Pawcasso Atelier (https://pawcasso-atelier.vercel.app) - an automated pet portrait generator using Manus (Flux Pro 1.1 under the hood).

Tech stack:
- Next.js 14 (App Router) + TypeScript
- Manus API for image generation (Flux Pro 1.1)
- Stripe for payments
- Vercel deployment

Interesting technical challenges:

1. Prompt engineering: ~40% of initial outputs fail (wrong style, poor composition, weird artifacts). I built a simple retry loop with style-specific prompts. Still manual QA every portrait before sending.

2. Cost structure: Manus charges $0.53-1.14 per image depending on resolution. With 40% retry rate, actual cost is ~$1.50-2.00 per portrait. I charge $9. Breakdown:
   - API costs: ~$1.75 avg
   - Stripe fees: $0.56
   - Email delivery: $0.02
   - Manual QA time: ~5 min/portrait
   - Margin: ~$4-5

3. Style consistency: Different artistic styles (Renaissance, Pixar 3D, Needle Felt) need completely different prompts. I ended up with 17 style templates, each tuned over 50+ test runs.

4. Latency: Flux Pro 1.1 takes 15-45 seconds per image. For premium orders (4-image bundles), total generation time can hit 3+ minutes. Looking at batch optimization.

Open questions I'm still figuring out:
- How to automate QA? (Current plan: fine-tune a smaller classifier model)
- Ideal price point? ($9 feels right but I'm testing $12)
- Should I expose prompt customization to users? (Risky but higher willingness-to-pay)

**HN-exclusive offer:** First 50 people can get a free portrait (normally $9) with code HACKERNEWS50. Just want feedback and testimonials from this community.

Gallery: https://pawcasso-atelier.vercel.app/gallery
Order: https://pawcasso-atelier.vercel.app/order

Happy to answer technical questions or share more details about the stack/decisions!
```

**Character count:** ~1,650 (well under HN's limit)

---

### Draft B: Learning Journey

```
Two months ago I wanted to surprise my wife with an AI portrait of our Border Collie. Tried MidJourney, DALL-E, and Flux - all required 10+ prompt iterations to get something decent. So I built an automated version.

Pawcasso Atelier: https://pawcasso-atelier.vercel.app

What I learned building this:

1. Prompt engineering is harder than I expected. My first version had a 60% failure rate (wrong animal, bad composition, AI artifacts). After 200+ test runs, I got it down to 40%. Still not good enough to fully automate.

2. AI output quality varies wildly by style. Renaissance portraits work great (stable, predictable). Pixar 3D is a nightmare (eyes misaligned, proportions weird). Had to build style-specific prompt templates.

3. Pricing is psychological. I started at $5 (barely profitable), tested $15 (too expensive), settled on $9 (Goldilocks zone). Current margin is ~$4-5 per portrait after API costs, Stripe fees, and QA time.

4. Manual QA is unavoidable right now. I review every portrait before sending. Takes 5 minutes, but it's the difference between "wow, amazing!" and "this is garbage". Looking into fine-tuning a classifier to automate this.

Tech stack: Next.js 14, Manus API (Flux Pro 1.1), Stripe, Vercel. Entire site + backend is <3,000 lines of TypeScript.

HN-exclusive: First 50 people get a free portrait with HACKERNEWS50. I just want feedback and testimonials from people who appreciate the tech.

Happy to answer questions about the implementation, prompt engineering, or business side!
```

**Character count:** ~1,550

---

### Draft C: Cost Breakdown (Most Transparent)

```
I built an AI pet portrait generator and I'm sharing the full cost breakdown because I wish more makers did this.

Site: https://pawcasso-atelier.vercel.app

**Revenue per order:**
- Customer pays: $9.00

**Costs per order:**
- Manus API (1 image, avg 3 attempts): $1.75
- Stripe payment processing: $0.56
- Email delivery (Resend): $0.02
- Vercel hosting: ~$0.05 (amortized)
- My QA time (5 min @ $60/hr): $5.00
- Total cost: $7.38
- Profit: $1.62 (18% margin)

If I can automate QA (working on this), margin jumps to ~$6.62 (74%).

**Tech implementation:**
- Next.js 14 (App Router) for the site
- Manus API (wraps Flux Pro 1.1) for image gen
- Stripe for checkout
- Manual QA in a Google Sheet (yes, really)

**What doesn't work yet:**
- 40% of AI outputs fail and need regeneration
- Manual QA takes 5 min/portrait (bottleneck)
- No automated order fulfillment (I email portraits manually via Resend)

**Next steps:**
- Fine-tune a ViT classifier for automated QA
- Build Stripe webhook → Manus → email delivery pipeline
- Test dynamic pricing ($9 vs $12 vs variable by style)

First 50 HN users get a free portrait (HACKERNEWS50). Just want feedback from technical folks who understand the constraints.

AMA about the stack, prompt engineering, or business economics!
```

**Character count:** ~1,400

---

## First Comment (Post Immediately After Submission)

**Critical:** Post this as your first comment within 60 seconds of submitting. This provides context and shows you're engaged.

```
Hey HN! I'm the maker. Quick additional context:

**Why I built this:**
My wife and I have a Border Collie (Instagram: @bc_alfie) and I wanted to create a custom portrait. Tried all the major AI tools - spent 2 hours prompt engineering to get one decent result. Realized there's a business here if I could automate the hard parts.

**Technical details:**
- Manus API (Flux Pro 1.1) for generation
- Next.js 14 + TypeScript for frontend
- Stripe Checkout for payments
- Deployed on Vercel (Edge Functions for API routes)
- Manual QA in Google Sheets (embarrassingly low-tech but works)

**Open challenges I'd love input on:**
1. How to automate QA? (Thinking ViT fine-tuned on good/bad outputs)
2. Reducing API costs? (Batch requests, prompt caching?)
3. Dynamic pricing by style? (Some styles have 60% retry rate, others 20%)

**HN-exclusive offer:**
HACKERNEWS50 - First 50 people get a FREE portrait (normally $9)
HACKERNEWS25 - 25% off for the next 30 days

Gallery: https://pawcasso-atelier.vercel.app/gallery
Order: https://pawcasso-atelier.vercel.app/order

Happy to answer any questions about the implementation, costs, or business model. Thanks for checking it out!
```

---

## Alternative Hooks (If Main Post Doesn't Get Traction)

### Hook 1: Technical Deep-Dive
```
Show HN: I reverse-engineered optimal Flux prompts for pet portraits (40% → 10% failure rate)
```

### Hook 2: Business Angle
```
Show HN: My AI side project did $450 in the first week - here's what worked
```

### Hook 3: Open Source Component
```
Show HN: Open-sourcing my Flux prompt optimizer for pet portraits (Next.js + TS)
```

### Hook 4: Pricing Experiment
```
Show HN: Testing $6 vs $9 vs $12 for AI pet portraits - live A/B test results
```

---

## Submission Checklist

**Before Posting:**
- [ ] Title is <80 characters
- [ ] Title starts with "Show HN:" (required for Show HN posts)
- [ ] Body is <2000 characters (HN text post limit)
- [ ] Link is in the body (not URL field)
- [ ] First comment is drafted and ready to paste
- [ ] HACKERNEWS50 discount code is active in Stripe
- [ ] Website is live and tested (checkout flow works)
- [ ] Phone notifications are ON for HN

**Timing:**
- [ ] Tuesday-Thursday (best days for Show HN)
- [ ] 8-10am PT (peak HN activity)
- [ ] Not within 48 hours of similar AI/pet product launches (check HN front page)

**After Posting:**
- [ ] Post first comment within 60 seconds
- [ ] Set 5-minute timer to check for new comments
- [ ] Respond to EVERY comment in first 2 hours
- [ ] Monitor upvotes/rank every 15 minutes

---

## Title Analysis Tool

Use this formula to optimize your title:

**Components:**
1. ✅ "Show HN:" prefix (required)
2. ✅ Specific verb (built, automated, reverse-engineered)
3. ✅ Concrete thing (pet portraits, not "AI art tool")
4. ✅ Interesting technical detail (Manus/Flux, $9, 40% failure rate)
5. ✅ Clear value prop (custom portraits, cheap, fast)

**Bad Examples:**
- ❌ "Show HN: My new AI project" (too vague)
- ❌ "Show HN: Revolutionary pet portrait platform" (marketing speak)
- ❌ "Show HN: Check out what I built!" (no specifics)

**Good Examples:**
- ✅ "Show HN: I automated pet portraits with Flux - $0.53 cost, $9 price"
- ✅ "Show HN: Building an AI portrait business - what I learned about prompt engineering"
- ✅ "Show HN: Pet portrait generator with 17 artistic styles (Next.js + Manus)"

---

## Response Time Targets

**Critical Window (First 2 Hours):**
- Respond within 5 minutes to every comment
- Use phone notifications
- Have laptop ready with pre-drafted responses

**Active Window (Hours 2-8):**
- Respond within 15-30 minutes
- Can batch responses every 30 min

**Maintenance Window (Hours 8-48):**
- Respond within 1-2 hours
- Focus on quality over speed

**Why Response Speed Matters:**
- HN algorithm boosts posts with high engagement
- Fast responses = more comments = more upvotes
- Shows you're a real person, not a marketer
- Builds trust with potential customers

---

## Pre-Written Response Templates

See [comment-playbook.md](./comment-playbook.md) for full response library. Key templates:

**For "Just an API wrapper" criticism:**
> "Totally fair - the core generation is just calling Manus API. The value I'm adding is: (1) Prompt engineering (took 200+ test runs to get 60% → 40% failure rate), (2) Manual QA (I review every portrait before sending), (3) Style templates (17 different artistic styles with custom prompts). Right now it's 80% API wrapper, 20% prompt engineering. If I can automate QA, the business gets way more interesting technically."

**For pricing questions:**
> "Here's the full breakdown: Manus API costs $0.53-1.14 per image. With ~40% retry rate, actual cost is ~$1.75 per portrait. Add Stripe fees ($0.56), email delivery ($0.02), and 5 minutes of my QA time. Margin is ~$4-5 at $9 pricing. I'm testing $12 this month to see if conversion rate drops. Open to feedback on what feels fair!"

**For "I built this in 30 minutes" comments:**
> "Ha, the first version took me 3 hours! The hard part wasn't the initial build - it was getting the failure rate down from 60% to 40%. That took weeks of prompt testing. And I still haven't solved automated QA, which is the real bottleneck. Would love to hear how you'd approach it!"

---

## URL Parameters for Tracking

Add UTM parameters to all HN links:

**Main link:**
```
https://pawcasso-atelier.vercel.app?utm_source=hackernews&utm_medium=show-hn&utm_campaign=hn-launch-2026-03
```

**Order page:**
```
https://pawcasso-atelier.vercel.app/order?utm_source=hackernews&utm_medium=show-hn&utm_campaign=hn-launch-2026-03
```

**Gallery:**
```
https://pawcasso-atelier.vercel.app/gallery?utm_source=hackernews&utm_medium=show-hn&utm_campaign=hn-launch-2026-03
```

This lets you track HN-specific conversions in Google Analytics / Vercel Analytics.

---

**Final Recommendation:** Use Draft A (Technical Transparency) with Title Option 1. HN values honesty about challenges and cost breakdowns. Lead with the tech, not the product.
