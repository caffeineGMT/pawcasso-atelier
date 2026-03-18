# Reddit Marketing Strategy - Pawcasso Atelier

**Goal:** Drive organic traffic and build community trust through value-first engagement (not spammy promotion).

**Target Revenue:** 100 orders/month from Reddit = $900/month baseline revenue.

---

## Target Subreddits

### Primary (High Engagement)
- **r/aww** (36M members) - Cute pet photos, wholesome community
- **r/dogs** (3.4M members) - Dog owners, portrait buyers
- **r/cats** (5.2M members) - Cat owners, high engagement
- **r/somethingimade** (2M members) - Maker/builder community, showcase projects
- **r/InternetIsBeautiful** (17M members) - Cool web tools, tech-savvy audience

### Secondary (Niche)
- **r/BorderCollie**, **r/shiba**, **r/goldenretrievers** - Breed-specific subs (super engaged communities)
- **r/petloss** - Memorial portraits (sensitive, high-value market)
- **r/SideProject** - Side project showcase
- **r/Entrepreneur** - Business/monetization discussions

---

## Week-by-Week Execution Plan

### **Week 1-2: Genuine Engagement (Foundation Building)**

**Objective:** Build karma, establish credibility, become a familiar face.

**Actions:**
- ✅ Comment helpfully on pet photos in r/aww, r/dogs, r/cats (5-10 comments/day)
- ✅ Upvote quality content, reply to comments, ask questions
- ✅ Join conversations about pet care, training, funny pet stories
- ✅ **DO NOT mention your tool yet** - just be a normal community member

**Success Metrics:**
- 200+ comment karma
- 10+ genuine conversations with pet owners
- Familiar username in 2-3 subreddits

---

### **Week 3: Soft Launch ("I Built This" Post)**

**Objective:** Introduce the tool authentically in r/somethingimade.

**Post Format:**
- **Subreddit:** r/somethingimade
- **Title:** "I built an AI pet portrait generator - here's my Border Collie as Renaissance art"
- **Content:** Gallery image + story-driven caption (NOT a sales pitch)
- **Caption Template:**

```
I built an AI tool to turn pet photos into art portraits. Here's my Border Collie in Renaissance style.

I was spending hundreds on Fiverr commissions (weeks of waiting, $50-$200 each), so I thought: what if AI could do this for $9 in 24 hours?

Built this for myself, now sharing it. No markup, no BS—just a simple tool that turns pet photos into gallery-quality art.

What do you think? Would love feedback on the quality.

[DO NOT include link in post - let people ask]
```

**Post Strategy:**
- ✅ Post between 8-10 AM ET (peak Reddit traffic)
- ✅ Use high-quality gallery image (Cat with a Pearl Earring, Alfie Imperial Portrait, etc.)
- ✅ Reply to EVERY comment within first 2 hours
- ✅ If someone asks "where can I get this?", reply: "I set up a simple site - I can DM you if interested"
- ✅ Offer FREE portraits to top 5 engaged commenters (exchange for feedback)

**UTM Link to Share (via DM only):**
```
https://pawcasso-atelier.vercel.app/reddit?utm_source=reddit&utm_medium=organic&utm_campaign=somethingimade_launch&post=[POST_ID]
```

**Success Metrics:**
- 100+ upvotes on post
- 20+ comments
- 5-10 DM requests for the link
- 3-5 free portrait signups

---

### **Week 4+: Community Building & Scaling**

**Objective:** Convert early supporters into advocates, scale via word-of-mouth.

**Actions:**

1. **Deliver Free Portraits (48 hours max)**
   - Send high-quality portraits to Week 3 requesters
   - Include personal note: "Would love your feedback! If you like it, feel free to share on Reddit/Instagram"
   - Track who posts their portrait publicly

2. **Create r/pawcasso Subreddit**
   - Invite early customers to share their portraits
   - Weekly feature: "Portrait of the Week"
   - User-generated content gallery

3. **Organic Comment Engagement**
   - When you see "where can I get a pet portrait?" in r/aww or r/dogs, reply helpfully:
     ```
     I built a tool that does this! Turns pet photos into art in different styles (Renaissance, Ghibli, Pixar, etc). $9, 24 hours. I can DM you if you want to check it out - no pressure!

     (Here's what my Border Collie looks like in [style] - [imgur link])
     ```
   - ✅ Always include visual proof (gallery image)
   - ✅ Offer value first, link second
   - ✅ NEVER spam - max 1-2 helpful comments per day

4. **Seasonal/Trending Posts**
   - Holiday gift guides in r/dogs, r/cats (November-December)
   - "What's a unique gift for a pet owner?" threads
   - Pet memorial posts in r/petloss (sensitive, genuine support first)

---

## UTM Tracking & Analytics

**Purpose:** Understand which Reddit posts/comments drive the most conversions.

### UTM Code Structure

```
https://pawcasso-atelier.vercel.app/reddit?utm_source=reddit&utm_medium=organic&utm_campaign=[CAMPAIGN]&sub=[SUBREDDIT]&post=[POST_ID]
```

**Campaign Names:**
- `community` - General engagement comments
- `somethingimade_launch` - r/somethingimade "I built this" post
- `aww_organic` - r/aww helpful comments
- `free_portraits` - Free portrait offer

**Tracking Dashboard:**
- All Reddit referrals logged to `reddit_referrals` table in Vercel Postgres
- View analytics: `/api/analytics/reddit-stats` (TODO: build simple dashboard)

**Key Metrics to Track:**
- Landing page visits from Reddit
- Conversion rate (visit → order)
- Which subreddits drive highest quality traffic
- Which posts/comments generate most interest

---

## Content Kit Generator

**Location:** `/content-engine/reddit-content-kit.ts`

**Usage:**

```bash
# List all available gallery images
tsx content-engine/reddit-content-kit.ts list

# Generate content kit with random image
tsx content-engine/reddit-content-kit.ts generate

# Generate content kit with specific image
tsx content-engine/reddit-content-kit.ts generate 5
```

**Output:**
- Selected gallery image details
- 5 caption variants (different tones for different subs)
- UTM tracking link
- Posting guidelines
- Saved JSON file for reference

---

## Free Portrait Request System

**Landing Page:** `/reddit/free`

**Process:**
1. User fills out form (name, email, Reddit username, pet photo, style)
2. Request saved to `free_portrait_requests` database table
3. Confirmation email sent to user
4. Notification email sent to you (michaelguo@meta.com)
5. Generate portrait via n8n workflow (existing pipeline)
6. Email portrait to user within 48 hours
7. Ask for feedback via email reply or Reddit tag

**Workflow Integration:**
- Use existing n8n portrait generation workflow
- Manual trigger: Submit photo URL + style to n8n form
- Auto-send email with portrait attached

---

## Reddit DOs and DON'Ts

### ✅ DO:
- Build karma through genuine engagement first
- Share personal story ("I built this for my dogs")
- Offer free portraits for feedback
- Reply to every comment on your posts
- Use high-quality gallery images as proof
- Track which posts drive conversions (UTM codes)
- Be transparent about it being a paid service (when asked)

### ❌ DON'T:
- Spam multiple subs on the same day
- Drop links unprompted in comments
- Use the same title/caption across posts
- Argue with critics or negative comments
- Promise features you can't deliver
- Post during low-traffic hours (late night)
- Ignore comments for more than 2 hours

---

## Success Metrics (Target by Month 2)

- **Reddit Referral Traffic:** 500+ visits/month
- **Conversion Rate:** 5% (25 orders from 500 visits)
- **Revenue from Reddit:** $225/month minimum (25 orders × $9)
- **r/pawcasso Members:** 50+ users sharing their portraits
- **Average Post Engagement:** 100+ upvotes, 20+ comments
- **Free Portrait Conversion:** 50% of free portrait recipients become paying customers or advocates

---

## Automation & Tools

### Built Infrastructure:
- ✅ Reddit landing page: `/reddit`
- ✅ Free portrait request form: `/reddit/free`
- ✅ UTM tracking endpoint: `/api/analytics/reddit-referral`
- ✅ Free portrait API: `/api/reddit/free-portrait`
- ✅ Content kit generator: `content-engine/reddit-content-kit.ts`

### To Build (Optional):
- [ ] Analytics dashboard: `/admin/reddit-stats` (view referral data)
- [ ] Automated free portrait workflow: Auto-trigger n8n on form submit
- [ ] Reddit comment monitor: Track mentions of "pet portrait" in target subs
- [ ] Testimonial collector: Auto-request reviews from satisfied customers

---

## Example Posts (Ready to Use)

### r/somethingimade Launch Post

**Title:** "I built an AI pet portrait generator - here's my Border Collie as Renaissance art"

**Image:** Cat with a Pearl Earring or Alfie Imperial Portrait

**Caption:**
```
I built an AI tool to turn pet photos into art portraits. Here's my Border Collie in Renaissance style.

I was spending hundreds on Fiverr commissions (weeks of waiting, $50-$200 each), so I thought: what if AI could do this for $9 in 24 hours?

Built this for myself, now sharing it. 17 art styles (Renaissance, Ghibli, Pixar 3D, Ukiyo-e, etc). Upload photo → pick style → get high-res digital file in 24 hours.

What do you think? Would love feedback on the quality. Happy to answer any questions about how it works!
```

---

### r/aww Casual Post

**Title:** "My Border Collie as Renaissance art ❤️"

**Image:** Any Alfie portrait

**Caption:**
```
Turned my boy Alfie into Renaissance art using an AI tool I've been working on. Thought you all might appreciate this 🎨

He's never been more regal.
```

---

### Comment Reply Template (When Asked)

**Scenario:** Someone asks "Where can I get this?"

**Reply:**
```
Hey! I set up a simple site for it - turns pet photos into portraits in different art styles (Renaissance, Ghibli, Pixar, etc).

$9, delivered in 24 hours. I can DM you the link if you're interested - no pressure though!

Here's what my Border Collie looks like in a few different styles: [imgur gallery link]
```

---

## Next Steps

1. **Week 1 (Now):** Start genuine engagement in r/aww, r/dogs, r/cats
2. **Week 2:** Build karma to 200+, become familiar face
3. **Week 3:** Post "I built this" in r/somethingimade
4. **Week 4:** Deliver free portraits, collect testimonials
5. **Week 5+:** Scale via organic comments, create r/pawcasso subreddit

**Remember:** Reddit rewards authenticity. Be helpful, be genuine, build trust. The conversions will follow.
