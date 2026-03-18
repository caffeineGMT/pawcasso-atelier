# Mailchimp Email Automation Setup Guide

This guide walks through setting up the complete 5-email welcome sequence for Pawcasso Atelier's email capture system.

## Overview

**Goal:** 25% email capture rate, 8% email-to-purchase conversion

**Email Sequence:**
1. **Day 0 (Immediate):** Welcome email with 15% discount code + gallery showcase
2. **Day 2:** "How It Works" explainer with FAQ
3. **Day 4:** Social proof - customer testimonials + Instagram gallery
4. **Day 7:** Urgency - "Your 15% discount expires in 24 hours"
5. **Day 14:** Re-engagement - "Still thinking about it? Here's what makes us different"

---

## Prerequisites

1. **Mailchimp Account** (Free or paid plan)
2. **Audience (List) Created** in Mailchimp
3. **Mailchimp API Key** generated
4. **Environment Variables** configured (see below)

---

## Step 1: Get Your Mailchimp Credentials

### 1.1 Get API Key
1. Log in to Mailchimp
2. Navigate to **Account → Extras → API Keys**
3. Click **Create A Key**
4. Copy the API key (starts with a long alphanumeric string ending in `-us[X]`)

### 1.2 Get Server Prefix
- The server prefix is the last part of your API key (e.g., `us19`, `us6`, `us21`)
- Example API key: `abc123def456ghi789-us19` → Server prefix: `us19`

### 1.3 Get List/Audience ID
1. Navigate to **Audience → All contacts**
2. Click **Settings → Audience name and defaults**
3. Find **Audience ID** (alphanumeric string like `a1b2c3d4e5`)

---

## Step 2: Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Mailchimp Configuration
MAILCHIMP_API_KEY=your_api_key_here-us19
MAILCHIMP_SERVER_PREFIX=us19
MAILCHIMP_LIST_ID=a1b2c3d4e5
```

**Replace with your actual values!**

---

## Step 3: Create the Automation in Mailchimp

### 3.1 Create New Automation
1. Navigate to **Automations → Classic Automations**
2. Click **Create** → **Custom**
3. Name it: **"Welcome Series - Email Capture"**

### 3.2 Set Trigger
1. **Trigger:** When someone subscribes to your list
2. **Trigger filters:**
   - Tag contains "Website Signup" **OR** Tag contains "Exit Intent"
   - (These tags are automatically added by our `/api/subscribe` endpoint)

### 3.3 Add Workflow Delay Settings
Set timing to prevent spam:
- **Limit:** Don't send if subscriber joins more than 1 list in 24 hours
- **Send time optimization:** Enabled (sends at optimal time for each subscriber)

---

## Step 4: Build the 5-Email Sequence

### Email 1: Welcome + Discount (Immediate)

**Delay:** 0 hours (immediately after signup)

**Settings:**
- **From name:** Pawcasso Atelier
- **From email:** hello@pawcasso-atelier.com
- **Subject line:** `Welcome to Pawcasso! Here's your 15% off 🎨`
- **Preview text:** `Your exclusive discount code + gallery showcase inside`

**Content:**
- Import HTML from: `website/src/lib/email-templates/welcome-01-immediate.tsx`
- Or use Mailchimp's drag-and-drop editor to recreate the design
- **Key merge tags to include:**
  - `*|FNAME|*` (First name, if collected)
  - Discount code: `FIRST15` (hardcoded or use merge tag `*|DISCOUNT_CODE|*`)

**Template export command:**
```bash
# In your terminal, run:
cd website
npx tsx scripts/export-email-templates.ts
```

This will generate HTML files you can paste into Mailchimp's "Code your own" template editor.

---

### Email 2: How It Works (Day 2)

**Delay:** 2 days after previous email

**Settings:**
- **From name:** Pawcasso Atelier
- **From email:** hello@pawcasso-atelier.com
- **Subject line:** `How Pawcasso Works: 3 Simple Steps ⚡`
- **Preview text:** `Upload → Choose Style → Get Your Masterpiece in 24h`

**Content:**
- Import HTML from: `website/src/lib/email-templates/welcome-02-how-it-works.tsx`
- Includes FAQ section and detailed process explanation

**Condition to send:**
- Only send if subscriber **has not made a purchase** yet
- Add condition: "Campaign Activity → Has not clicked any campaign in the last 48 hours" (prevents sending to recent purchasers)

---

### Email 3: Social Proof (Day 4)

**Delay:** 2 days after previous email (Day 4 total)

**Settings:**
- **From name:** Pawcasso Atelier
- **From email:** hello@pawcasso-atelier.com
- **Subject line:** `What Pet Parents Are Saying About Pawcasso ⭐⭐⭐⭐⭐`
- **Preview text:** `2,400+ happy customers • 4.9/5 rating • 98% would recommend`

**Content:**
- Import HTML from: `website/src/lib/email-templates/welcome-03-social-proof.tsx`
- Features 4 customer testimonials, stats, and Instagram CTA

**Condition to send:**
- Only send if subscriber **has not made a purchase** yet

---

### Email 4: Urgency (Day 7)

**Delay:** 3 days after previous email (Day 7 total)

**Settings:**
- **From name:** Pawcasso Atelier
- **From email:** hello@pawcasso-atelier.com
- **Subject line:** `⏰ Your 15% discount expires in 24 hours!`
- **Preview text:** `Last chance to save on your custom pet portrait`

**Content:**
- Import HTML from: `website/src/lib/email-templates/welcome-04-urgency.tsx`
- Creates urgency around discount expiration
- Highlights value proposition ($7.65 after discount vs. $50-$200 elsewhere)

**Condition to send:**
- Only send if subscriber **has not made a purchase** yet

**Note:** This email claims the discount expires in 24 hours. You can either:
1. Actually expire the discount code after 7 days (recommended for authenticity)
2. Keep the code active but use urgency as marketing tactic
3. Generate unique time-limited codes per subscriber (requires Stripe/custom logic)

---

### Email 5: Re-engagement (Day 14)

**Delay:** 7 days after previous email (Day 14 total)

**Settings:**
- **From name:** Pawcasso Atelier
- **From email:** hello@pawcasso-atelier.com
- **Subject line:** `Still thinking about it? Here's what makes us different`
- **Preview text:** `Why Pawcasso is better than traditional artists & print services`

**Content:**
- Import HTML from: `website/src/lib/email-templates/welcome-05-reengagement.tsx`
- Final email in the sequence
- Comparison table, customer story, "last email" notice
- Focuses on differentiation and overcoming objections

**Condition to send:**
- Only send if subscriber **has not made a purchase** yet

**After this email:**
- Move subscriber to "Engaged but Not Purchased" segment
- Optionally add to monthly newsletter or special promotions list
- DO NOT continue automated emails (respect the "last email" promise)

---

## Step 5: Set Up Purchase-Based Automation Stop

To prevent emails from being sent to customers who have already purchased:

### Option A: Manual Mailchimp Tags (Simple)
1. After each purchase, manually tag the customer as "Purchased"
2. In each automation email, add condition: "Does not have tag 'Purchased'"

### Option B: Stripe + Mailchimp Integration (Recommended)
1. Use Zapier or Make.com to connect Stripe to Mailchimp
2. **Trigger:** New payment succeeded in Stripe
3. **Action:** Add tag "Purchased" to subscriber in Mailchimp + Unsubscribe from automation

### Option C: Custom Webhook (Advanced)
1. In `website/src/app/api/webhooks/stripe/route.ts`, add:
```typescript
// After successful payment, tag customer in Mailchimp
if (session.customer_email) {
  await mailchimp.lists.updateListMemberTags(
    process.env.MAILCHIMP_LIST_ID!,
    md5(session.customer_email.toLowerCase()),
    {
      tags: [
        { name: 'Purchased', status: 'active' },
        { name: 'Customer', status: 'active' }
      ]
    }
  );
}
```

---

## Step 6: Test the Automation

### 6.1 Test Subscriber
1. Create a test email address (e.g., `test+pawcasso@gmail.com`)
2. Subscribe via your website's exit-intent modal
3. Verify emails arrive at the correct intervals

### 6.2 Speed Up Testing
- In Mailchimp automation settings, you can temporarily set delays to "0 hours" for testing
- **Don't forget to change them back to real delays before going live!**

### 6.3 Check Email Rendering
- Send test emails to:
  - Gmail (desktop & mobile)
  - Apple Mail (iOS & macOS)
  - Outlook (desktop & web)
  - Yahoo Mail

---

## Step 7: Monitor Performance

### Key Metrics to Track in Mailchimp Dashboard:

1. **Email Capture Rate:**
   - Goal: 25%
   - Formula: (Email signups ÷ Total visitors) × 100
   - Track via Google Analytics + Mailchimp signup count

2. **Open Rates by Email:**
   - Email 1 (Welcome): Target 60-70%
   - Email 2 (How It Works): Target 40-50%
   - Email 3 (Social Proof): Target 35-45%
   - Email 4 (Urgency): Target 50-60% (urgency subject line)
   - Email 5 (Re-engagement): Target 25-35%

3. **Click-Through Rates (CTR):**
   - Overall target: 8-12%
   - Track clicks on "Order Your Portrait Now" button

4. **Email-to-Purchase Conversion:**
   - Goal: 8%
   - Formula: (Purchases from email subscribers ÷ Total email signups) × 100
   - Requires UTM tracking or Stripe customer email matching

5. **Unsubscribe Rate:**
   - Keep below 1% per email
   - If higher, reduce email frequency or improve content

---

## Step 8: A/B Testing Ideas

After the automation runs for 2-4 weeks, test variations:

### Subject Line Tests:
- **Email 1:** `Welcome! Here's 15% off 🎨` vs. `Your Pet Portrait Discount Inside`
- **Email 4:** `⏰ Expires in 24h!` vs. `Last Chance: 15% Off Ends Tomorrow`

### Content Tests:
- Different gallery images in Email 1
- Longer vs. shorter FAQ section in Email 2
- More vs. fewer testimonials in Email 3

### Timing Tests:
- Send Email 4 on Day 6 instead of Day 7
- Send Email 5 on Day 10 instead of Day 14

---

## Step 9: Ongoing Optimization

### Monthly Review Checklist:
- [ ] Check overall sequence completion rate (% who receive all 5 emails)
- [ ] Identify drop-off points (which email has highest unsubscribe rate?)
- [ ] Review purchase attribution (which email drives most conversions?)
- [ ] Update testimonials in Email 3 with fresh reviews
- [ ] Refresh gallery images seasonally

### Quarterly Updates:
- [ ] Update stats in Email 3 (customer count, rating)
- [ ] Refresh "Recent Customer Story" in Email 5
- [ ] Review and update FAQ based on common support questions
- [ ] Test new discount strategies (10% vs. 15%, BOGO, etc.)

---

## Troubleshooting

### Problem: Emails not sending
**Solution:**
- Check Mailchimp automation is "Active" (not paused)
- Verify trigger conditions are met (tags applied correctly)
- Check subscriber email is valid and confirmed

### Problem: High unsubscribe rate
**Solution:**
- Reduce email frequency (increase delays)
- Improve email copy and design
- Segment better (only send to interested subscribers)

### Problem: Low open rates
**Solution:**
- Test different subject lines
- Improve preview text
- Check sender reputation (avoid spam triggers)
- Send at different times (A/B test send times)

### Problem: Low conversion rate
**Solution:**
- Strengthen CTAs (clearer buttons, more prominent placement)
- Add more social proof and urgency
- Simplify the purchase process (reduce friction)
- Test different discount amounts

---

## Advanced: Dynamic Discount Codes

To generate unique discount codes per subscriber:

### Using Stripe Coupons:
1. Create a Stripe coupon: `FIRST15` (15% off)
2. In `/api/subscribe`, generate unique codes:
```typescript
const discountCode = `FIRST15-${Date.now().toString(36).toUpperCase()}`;
// Store in Mailchimp merge field
await mailchimp.lists.setListMember(listId, email, {
  merge_fields: {
    DISCOUNT: discountCode,
  },
});
```
3. Use `*|DISCOUNT|*` merge tag in email templates

---

## Support Resources

- **Mailchimp Help Center:** https://mailchimp.com/help/
- **Mailchimp API Docs:** https://mailchimp.com/developer/
- **React Email Docs:** https://react.email/docs
- **Stripe Coupon API:** https://stripe.com/docs/api/coupons

---

## Email Sequence Summary

| Email | Day | Subject | Goal | Target Metrics |
|-------|-----|---------|------|----------------|
| 1. Welcome | 0 | Welcome to Pawcasso! Here's your 15% off 🎨 | Deliver discount, showcase gallery | 65% open, 10% CTR |
| 2. How It Works | 2 | How Pawcasso Works: 3 Simple Steps ⚡ | Educate, reduce friction | 45% open, 8% CTR |
| 3. Social Proof | 4 | What Pet Parents Are Saying ⭐⭐⭐⭐⭐ | Build trust, show results | 40% open, 7% CTR |
| 4. Urgency | 7 | ⏰ Your 15% discount expires in 24 hours! | Create FOMO, drive conversions | 55% open, 12% CTR |
| 5. Re-engagement | 14 | Still thinking about it? Here's what makes us different | Final push, differentiation | 30% open, 6% CTR |

**Overall sequence goal:** 8% email-to-purchase conversion rate

---

## Next Steps

1. ✅ Set up Mailchimp account and get API credentials
2. ✅ Configure environment variables in `.env.local`
3. ✅ Create the automation in Mailchimp dashboard
4. ✅ Import email templates (HTML from React Email components)
5. ✅ Test with a dummy email address
6. ✅ Launch automation and monitor performance
7. ✅ Optimize based on data after 2-4 weeks

---

**Questions?** Contact the development team or refer to the Mailchimp documentation.
