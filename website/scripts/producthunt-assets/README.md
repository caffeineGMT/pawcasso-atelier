# ProductHunt Launch Kit - Implementation Guide

**Launch Date:** Tuesday, March 25, 2026 at 12:01 AM Pacific Time
**Product:** Pawcasso Atelier - AI Pet Portraits
**Goal:** Top 5 Product of the Day, 500+ upvotes, 100+ new customers

---

## 📋 Pre-Launch Checklist (Complete by March 24, 2026)

### ProductHunt Setup
- [ ] Create ProductHunt maker account (@michaelguo)
- [ ] Draft product listing (use tagline-options.txt for tagline)
- [ ] Upload gallery images (4-6 images from website/public/gallery/)
- [ ] Embed demo video (see demo-video-script.md)
- [ ] Set launch date to March 25, 12:01 AM PT
- [ ] Add relevant tags: AI, Pets, Art, Gifts, E-commerce
- [ ] Set primary category: Design Tools
- [ ] Invite 3-5 co-makers/team members

### Demo Video Production
- [ ] Record screen demo following demo-video-script.md storyboard
- [ ] Edit with voiceover and background music
- [ ] Export in multiple formats (1080p YouTube, 9:16 Instagram, 1:1 square)
- [ ] Upload to YouTube (unlisted or public)
- [ ] Create custom thumbnail (before/after split with "$9" badge)
- [ ] Embed YouTube link in ProductHunt listing
- [ ] **Deadline:** March 22, 2026 (3 days before launch)

### Landing Page & Website
- [x] Launch page live at /launch with countdown timer ✅
- [x] Email capture form working ✅
- [x] API endpoint storing emails in Mailchimp ✅
- [ ] Test email auto-reply with discount code
- [ ] Verify countdown timer accuracy (March 25, 12:01 AM PT)
- [ ] Mobile responsiveness check
- [ ] Page speed optimization (< 3s load time)
- [ ] Social share buttons functional
- [ ] OG meta tags for social sharing

### Email Marketing
- [ ] Set up Mailchimp account
- [ ] Create "ProductHunt Launch" list/segment
- [ ] Configure API keys in .env.local:
  - MAILCHIMP_API_KEY
  - MAILCHIMP_SERVER_PREFIX
  - MAILCHIMP_LIST_ID
- [ ] Import supporter-emails.csv (200 contacts)
- [ ] Create email templates in Mailchimp:
  - Pre-launch outreach (send March 24, 9 AM)
  - Launch day reminder (send March 25, 9 AM)
  - Thank you follow-up (send March 26, 10 AM)
- [ ] Test email deliverability (send test to personal email)
- [ ] Set up UTM tracking parameters

### Discount Codes
- [ ] Create Stripe coupon codes:
  - LAUNCH50 (50% off, limited to first 5 orders per customer)
  - HUNTER50 (50% off for ProductHunt users)
  - FRIEND50 (50% off for personal contacts)
  - EARLY50 (50% off for community members)
- [ ] Test coupon application on checkout page
- [ ] Set expiration dates (or no expiration)
- [ ] Document code usage limits

### Social Media Preparation
- [ ] Schedule Instagram posts:
  - Day before launch (teaser)
  - Launch day (announcement + PH link)
  - Day after (thank you + results)
- [ ] Schedule Twitter/X posts:
  - Countdown series (7 days, 3 days, 1 day, launch)
  - Launch announcement thread
  - Live updates throughout launch day
- [ ] Prepare TikTok short-form video (0:30 version from demo-video-script.md)
- [ ] Create Pinterest pins linking to /launch page
- [ ] Set up Instagram Story highlights for "ProductHunt Launch"

### Content Assets
- [x] Demo video script completed ✅
- [x] Tagline options finalized ✅
- [x] First comment template ready ✅
- [x] Supporter outreach email drafted ✅
- [ ] ProductHunt thumbnail designed (1200×630px)
- [ ] Social media graphics created (Instagram post, Twitter card, etc.)
- [ ] Press kit prepared (logo, screenshots, boilerplate description)

### Testing
- [ ] End-to-end test: Launch page → Email signup → Confirmation email
- [ ] Test discount codes on order page
- [ ] Mobile testing (iOS Safari, Android Chrome)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Load testing (simulate 100+ concurrent users)
- [ ] Payment flow test with Stripe test mode

---

## 🚀 Launch Day Timeline (March 25, 2026)

### 12:01 AM PT - GO LIVE
- [ ] ProductHunt listing goes live automatically
- [ ] Post first comment immediately (use first-comment-template.md)
- [ ] Share ProductHunt link on personal social media
- [ ] Send ProductHunt link to close friends/family via DM

### 9:00 AM PT - Mass Outreach
- [ ] Send bulk email to supporter list (200 contacts)
- [ ] Post on Instagram with ProductHunt link
- [ ] Tweet launch announcement thread
- [ ] Post in relevant Facebook groups (with admin permission)
- [ ] Share in Slack communities (IndieHackers, tech groups)
- [ ] Post on LinkedIn

### Throughout the Day (Every 2 hours)
- [ ] Reply to ALL ProductHunt comments within 15 minutes
- [ ] Share updates on social media (upvote milestones, testimonials)
- [ ] Generate free sample portraits for commenters who drop pet photos
- [ ] Monitor analytics (traffic, signups, conversions)
- [ ] Engage with any press/media inquiries

### 12:00 PM PT - Mid-Day Push
- [ ] Tweet current ranking + call-to-action for upvotes
- [ ] Instagram Story update with ProductHunt link
- [ ] Follow up with unopened emails (resend with new subject)

### 6:00 PM PT - Evening Push
- [ ] Final push on social media for upvotes
- [ ] Thank early supporters publicly
- [ ] Share customer testimonials/portraits created today

### 11:59 PM PT - End of Launch Day
- [ ] Screenshot final ranking
- [ ] Prepare thank-you post for next day
- [ ] Calculate metrics (upvotes, comments, traffic, sales)

---

## 📊 Success Metrics

### ProductHunt Goals
- **Minimum:** Top 10 Product of the Day
- **Target:** Top 5 Product of the Day
- **Stretch:** #1 Product of the Day

### Engagement Goals
- **Upvotes:** 500+ (minimum 300)
- **Comments:** 100+ (minimum 50)
- **ProductHunt Traffic:** 5,000+ visitors

### Business Goals
- **Email Signups:** 1,000+ (from /launch page)
- **New Customers:** 100+ orders on launch day
- **Revenue:** $900+ (100 orders × $9, or $450 with 50% discount)
- **Instagram Followers:** +500 new followers
- **Returning Visitors:** 30%+ return within 7 days

### Virality Metrics
- **Social Shares:** 200+ combined (Instagram, Twitter, Facebook)
- **Press Mentions:** 1-3 tech blogs/newsletters
- **Influencer Shoutouts:** 5+ pet influencers sharing

---

## 🎯 Post-Launch Action Items (March 26-30)

### Day After Launch (March 26)
- [ ] Send thank-you email to all supporters
- [ ] Post ProductHunt results on social media
- [ ] Create case study blog post: "How We Launched on ProductHunt"
- [ ] Update website hero with "Featured on ProductHunt" badge
- [ ] Collect testimonials from launch day customers
- [ ] Respond to all customer support inquiries

### Week After Launch (March 27-31)
- [ ] Analyze traffic sources (where did users come from?)
- [ ] A/B test pricing based on launch feedback
- [ ] Implement top 3 feature requests from comments
- [ ] Reach out to tech journalists for follow-up coverage
- [ ] Create retargeting ads for ProductHunt visitors who didn't convert
- [ ] Plan ProductHunt Ship updates (ongoing product updates)

---

## 📧 Mailchimp Email Sequences

### Sequence 1: Pre-Launch (March 24)
**Subject:** Quick favor? Launching tomorrow on ProductHunt 🚀
**Goal:** Drive awareness, get upvote commitments
**CTA:** Preview gallery, save the date
**Send Time:** 9:00 AM PT

### Sequence 2: Launch Day (March 25)
**Subject:** We're LIVE on ProductHunt! 🎨🚀
**Goal:** Drive upvotes and comments
**CTA:** Upvote now, get 50% off
**Send Time:** 9:00 AM PT

### Sequence 3: Thank You (March 26)
**Subject:** THANK YOU! We hit #[rank] on ProductHunt 🎉
**Goal:** Show gratitude, encourage purchases
**CTA:** Use your 50% discount code
**Send Time:** 10:00 AM PT

---

## 🛠️ Technical Setup

### Environment Variables (.env.local)
```bash
# Mailchimp
MAILCHIMP_API_KEY=your_mailchimp_api_key_here
MAILCHIMP_SERVER_PREFIX=us1
MAILCHIMP_LIST_ID=your_list_id_here

# Stripe Discount Codes
STRIPE_COUPON_LAUNCH50=50PERCENTOFF
```

### API Endpoints
- `/api/launch/subscribe` - Email signup for launch list
- `/api/checkout` - Stripe checkout with discount code support

### Deploy to Production
```bash
cd website
npm run build
vercel --prod
```

### Monitor After Deploy
- [ ] Check /launch page loads correctly
- [ ] Test email signup form
- [ ] Verify Mailchimp integration
- [ ] Check error tracking (Vercel logs)
- [ ] Monitor API rate limits

---

## 📱 Social Media Copy Templates

### Instagram Post (Launch Day)
```
🎨 We're LIVE on ProductHunt! 🚀

Pawcasso Atelier is officially launching TODAY. Transform your pet into a masterpiece in 16 art styles for just $9.

Renaissance, Pixar 3D, Ukiyo-e, Needle Felt, and more. High-res digital portraits delivered in 24 hours.

💛 Upvote us on ProductHunt (link in bio)
💛 Get 50% off with code HUNTER50

#ProductHunt #AIPetPortraits #PetArt #AIArt #DogPortrait #CatPortrait #PawcassoAtelier
```

### Twitter Thread (Launch Day)
```
🧵 THREAD: We're launching Pawcasso Atelier on @ProductHunt today! 🎨

Here's what we built and why it matters... (1/7)

1/ Problem: Custom pet portraits cost $200-500 and take weeks. Most pet parents can't justify the cost. But everyone wants to immortalize their furry friends.

2/ Solution: AI-powered pet portraits in 16 curated art styles. Upload a photo, pick a style (Renaissance, Pixar 3D, Ukiyo-e...), get 3 high-res portraits in 24 hours. All for $9.

3/ Tech stack: Next.js 14, TypeScript, Manus API (DALL-E 3), Stripe, Vercel. Built in 3 weeks as a side project. Now serving 200+ happy customers.

4/ Quality matters: Every portrait is reviewed by a human before delivery. We reject ~15% of AI outputs and regenerate until it's gallery-worthy. No generic AI slop.

5/ Launch special: First 100 supporters get 50% OFF with code HUNTER50. That's $4.50 per portrait. Link in bio.

6/ How you can help:
→ Upvote us on ProductHunt
→ Leave a comment
→ Share with pet-loving friends

7/ Check it out: [ProductHunt link]

Thanks for the support! Every upvote helps us reach more pet parents. 🐾❤️
```

### LinkedIn Post (Professional)
```
Excited to share that Pawcasso Atelier is launching on ProductHunt today! 🚀

As a pet parent and former SWE at Meta, I built this to solve a personal problem: custom pet portraits were too expensive and took too long. So I combined AI with art curation to make it accessible.

What we do:
✨ AI-generated pet portraits in 16 art styles
💰 $9 per portrait (vs. $200-500 for custom artists)
⚡ 24-hour delivery (vs. 2-4 weeks)
🎨 Human-reviewed quality control

Tech stack: Next.js, TypeScript, OpenAI API, Stripe, Vercel

If you're interested in AI applications for consumer products or just love pets, I'd appreciate your support on ProductHunt! Link in comments.

#ProductLaunch #AIArt #SideProject #BuildInPublic
```

---

## ⚠️ Common Issues & Solutions

### Issue: Countdown timer shows wrong time
**Solution:** Verify timezone is set to Pacific Time in page.tsx. Check user's local time vs. server time.

### Issue: Email signup not working
**Solution:**
1. Check Mailchimp API credentials in .env.local
2. Verify MAILCHIMP_LIST_ID is correct
3. Check API route logs in Vercel dashboard
4. Test with curl to isolate frontend vs. backend issue

### Issue: Discount code not applying
**Solution:**
1. Verify Stripe coupon is created in dashboard
2. Check coupon ID matches code in checkout
3. Ensure coupon is active and not expired
4. Test in Stripe test mode first

### Issue: High traffic causing slowdowns
**Solution:**
1. Enable Vercel Edge Caching for static pages
2. Implement rate limiting on API routes
3. Upgrade Vercel plan if needed (Pro tier)
4. Use Cloudflare for DDoS protection

### Issue: ProductHunt link not ranking
**Solution:**
1. Increase engagement in first 2 hours (critical window)
2. Reply to every comment quickly
3. Share on social media with direct link
4. Coordinate group upvotes (but don't manipulate!)

---

## 📞 Support Contacts

### Technical Issues
- **Developer:** Michael Guo (michaelguo@meta.com)
- **Vercel Support:** support@vercel.com
- **Stripe Support:** support@stripe.com

### Marketing/Press
- **Email:** hello@pawcasso-atelier.com
- **Instagram:** @pawcasso.atelier
- **Twitter:** @pawcassoatelier

### Emergency Contacts
- **If website goes down:** Contact Vercel support immediately
- **If payment issues:** Contact Stripe support
- **If email delivery fails:** Check Mailchimp status page

---

## ✅ Final Pre-Launch Checklist (Morning of March 25)

1 Hour Before Launch (11:00 PM on March 24):
- [ ] Clear browser cache and test /launch page
- [ ] Have first-comment-template.md open and ready
- [ ] Log into ProductHunt maker account
- [ ] Prepare 5 free sample portraits to give away in comments
- [ ] Queue up social media posts in Buffer/Hootsuite
- [ ] Charge laptop and phone (long day ahead!)
- [ ] Set phone alarms for key milestones (9 AM push, 12 PM, 6 PM)
- [ ] Have analytics dashboards open (Vercel, Stripe, Mailchimp)
- [ ] Notify family/spouse you'll be focused on launch all day

**Good luck! 🚀🎨**

---

**Document Version:** 1.0
**Last Updated:** March 18, 2026
**Owner:** Michael Guo
**Status:** READY FOR LAUNCH
