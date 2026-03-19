# Email Delivery Testing Documentation

## Overview

Comprehensive testing suite for order confirmation and delivery emails. Validates:

- ✅ Email delivery to multiple providers (Gmail, Outlook, Yahoo, iCloud)
- ✅ Spam score and deliverability
- ✅ HTML/CSS rendering compatibility
- ✅ Email authentication (SPF, DKIM, DMARC)
- ✅ Content accuracy and link functionality
- ✅ E2E order flow with email triggers

---

## Quick Start

```bash
# 1. Check email authentication (SPF/DKIM/DMARC)
npm run email:check-auth

# 2. Validate HTML rendering
npm run email:validate-rendering

# 3. Send test emails to multiple providers
npm run email:test-delivery

# 4. Run E2E email flow tests
npm run test:e2e -- email-delivery.spec.ts
```

---

## Test Scripts

### 1. Email Authentication Checker

**Purpose:** Verify DNS records for email authentication

**Script:** `scripts/check-email-auth.ts`

**Command:**
```bash
npm run email:check-auth
```

**What it checks:**
- ✅ SPF record (Sender Policy Framework)
- ✅ DKIM record (DomainKeys Identified Mail)
- ✅ DMARC policy (Domain-based Message Authentication)
- ✅ MX records (Mail Exchange)

**Expected results:**
- All 4 checks should pass (100% score)
- If any fail, follow the setup instructions provided

**Why it matters:**
- Missing authentication causes emails to land in spam
- Gmail/Outlook require SPF + DKIM minimum
- DMARC provides additional protection and trust

---

### 2. Email Rendering Validator

**Purpose:** Check HTML/CSS compatibility across email clients

**Script:** `scripts/validate-email-rendering.ts`

**Command:**
```bash
npm run email:validate-rendering
```

**What it checks:**
- ✅ HTML validity
- ✅ Inline styles (required for email)
- ✅ No external CSS/JavaScript
- ✅ Image alt text (accessibility + spam filters)
- ✅ Email size < 100KB (Gmail clips at 102KB)
- ✅ No spam trigger words
- ✅ Text-to-image ratio
- ✅ Preview text
- ✅ Unsubscribe link

**Output:**
- Generates HTML previews in `email-previews/` directory
- Open in browser to visually test rendering
- Shows errors, warnings, and recommendations

**Target:**
- 0 errors (critical)
- < 3 warnings (non-critical)

---

### 3. Multi-Provider Delivery Test

**Purpose:** Send test emails to Gmail, Outlook, Yahoo, iCloud and check spam score

**Script:** `scripts/test-email-delivery.ts`

**Command:**
```bash
npm run email:test-delivery
```

**Setup:**

Create a `.env.local` file with test email addresses:

```bash
# Test email addresses for each provider
TEST_EMAIL_GMAIL=your-test@gmail.com
TEST_EMAIL_OUTLOOK=your-test@outlook.com
TEST_EMAIL_YAHOO=your-test@yahoo.com
TEST_EMAIL_ICLOUD=your-test@icloud.com

# For spam testing (get from https://www.mail-tester.com/)
TEST_EMAIL_MAILTESTER=test-xxxxx@mail-tester.com

# Production API keys
RESEND_API_KEY=re_xxxxx
```

**What it does:**
1. Validates email template content
2. Sends 3 email types to each provider:
   - Order Confirmation
   - Delivery Confirmation
   - Shipping Notification
3. Sends spam test to Mail-Tester.com
4. Generates results JSON file

**Manual verification checklist:**

After running, check each inbox and verify:

- [ ] Email arrived (not in spam)
- [ ] Images load correctly
- [ ] Links are clickable
- [ ] Mobile-responsive (test on phone)
- [ ] Order details are accurate
- [ ] Branding looks correct
- [ ] No broken layout

**Spam score target:** 9/10 or higher on Mail-Tester.com

---

### 4. E2E Email Flow Tests

**Purpose:** Test complete order-to-email flow in automated browser tests

**Script:** `e2e/email-delivery.spec.ts`

**Command:**
```bash
npm run test:e2e -- email-delivery.spec.ts
```

**What it tests:**
- ✅ Order placement triggers email send
- ✅ Email sent timestamp recorded in database
- ✅ Duplicate emails prevented
- ✅ Correct order details in email
- ✅ Delivery confirmation triggers
- ✅ Scheduled emails (review requests, reorder incentives)
- ✅ Error handling for Resend API failures

**Requirements:**
- Stripe test mode API keys
- Resend API key
- Local database running

---

## Email Provider Testing Matrix

| Provider | Test Email | Priority | Notes |
|----------|-----------|----------|-------|
| Gmail | TEST_EMAIL_GMAIL | HIGH | 43% market share |
| Outlook | TEST_EMAIL_OUTLOOK | HIGH | 9% market share |
| Yahoo | TEST_EMAIL_YAHOO | MEDIUM | 3% market share |
| iCloud | TEST_EMAIL_ICLOUD | MEDIUM | Apple users |
| Mail-Tester | TEST_EMAIL_MAILTESTER | HIGH | Spam score check |

---

## Spam Score Optimization

### Target: 9/10 or higher on Mail-Tester.com

**How to check:**
1. Visit https://www.mail-tester.com/
2. Copy the test email address shown
3. Set `TEST_EMAIL_MAILTESTER` env var
4. Run `npm run email:test-delivery`
5. Visit the results URL provided

**Common issues and fixes:**

| Issue | Fix | Impact |
|-------|-----|--------|
| Missing SPF | Add `v=spf1 include:resend.com ~all` | -2 points |
| Missing DKIM | Configure in Resend dashboard | -2 points |
| Missing DMARC | Add DMARC policy record | -1 point |
| Spam trigger words | Remove "FREE", "!!!", "CLICK HERE" | -1 point |
| No unsubscribe link | Add to footer | -0.5 points |
| Poor text/image ratio | Add more text content | -0.5 points |

---

## Email Authentication Setup (Resend)

### Step 1: Add Domain to Resend

1. Log into https://resend.com/domains
2. Click "Add Domain"
3. Enter: `pawcasso-atelier.com`
4. Resend will provide DNS records

### Step 2: Add DNS Records

Add these records to your DNS provider (Vercel, Cloudflare, etc.):

**SPF Record:**
```
Type: TXT
Name: @
Value: v=spf1 include:resend.com ~all
```

**DKIM Record:**
```
Type: TXT
Name: resend._domainkey
Value: [provided by Resend dashboard]
```

**DMARC Record:**
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@pawcasso-atelier.com
```

### Step 3: Verify Setup

```bash
npm run email:check-auth
```

Should show 100% (4/4 checks passed).

**DNS propagation:** Can take up to 48 hours, but usually 15-30 minutes.

---

## Deliverability Best Practices

### 1. Domain Warm-Up

**Why:** Sending large volumes immediately triggers spam filters

**How:**
- Week 1: 50 emails/day
- Week 2: 200 emails/day
- Week 3: 500 emails/day
- Week 4+: Full volume

### 2. Monitor Bounce Rates

**Target:** < 2% bounce rate

**Action:**
- Hard bounces: Remove immediately
- Soft bounces: Retry 3x, then remove
- Use Resend dashboard to monitor

### 3. Engagement Metrics

**High engagement = better deliverability**

**Optimize for:**
- Open rate > 20%
- Click rate > 3%
- Unsubscribe rate < 0.5%
- Spam complaints < 0.1%

**How to improve:**
- Compelling subject lines
- Personalized content
- Clear CTAs
- Mobile-optimized
- Send at optimal times (10am-2pm local time)

### 4. List Hygiene

**Clean list = better reputation**

**Remove:**
- Hard bounces (immediately)
- Inactive subscribers (6+ months no open)
- Spam complaints
- Invalid email formats

### 5. Content Quality

**Avoid spam triggers:**
- ❌ ALL CAPS SUBJECT LINES
- ❌ Excessive punctuation!!!
- ❌ "FREE", "ACT NOW", "LIMITED TIME"
- ❌ Too many links (max 3-5)
- ❌ Image-only emails (no text)

**Use instead:**
- ✅ Personalized subject lines
- ✅ Plain text + HTML versions
- ✅ Balanced text/image ratio
- ✅ Clear from name/address
- ✅ Professional formatting

---

## Troubleshooting

### Emails going to spam

**Check:**
1. SPF/DKIM/DMARC configured? → `npm run email:check-auth`
2. Spam score acceptable? → Test with Mail-Tester.com
3. Domain warmed up? → Start slow, increase gradually
4. Content quality? → Remove spam trigger words
5. Engagement good? → Monitor open/click rates

### Emails not delivering

**Check:**
1. Resend API key valid? → Check `.env` file
2. Domain verified in Resend? → Check dashboard
3. Recipient email valid? → Test with your own email
4. Rate limits hit? → Check Resend dashboard
5. Database timestamp set? → Check `orderConfirmationEmailSentAt`

### HTML rendering issues

**Check:**
1. Inline styles used? → `npm run email:validate-rendering`
2. No external CSS? → Should use inline only
3. Email size < 100KB? → Compress images
4. Test in actual clients → Use Litmus/Email on Acid

### Duplicate emails

**Check:**
1. Webhook retries? → Resend retries on failure
2. Duplicate prevention logic? → Check `orderConfirmationEmailSentAt`
3. Multiple webhook endpoints? → Only one should be active

---

## Testing Checklist

Before launching to production, complete this checklist:

### Email Authentication
- [ ] SPF record configured
- [ ] DKIM record configured
- [ ] DMARC policy configured
- [ ] All 4 checks pass: `npm run email:check-auth`

### HTML Rendering
- [ ] No critical errors: `npm run email:validate-rendering`
- [ ] < 3 warnings
- [ ] Previews look correct in browser

### Multi-Provider Testing
- [ ] Test emails sent to Gmail, Outlook, Yahoo, iCloud
- [ ] All emails arrived (not in spam)
- [ ] Images load correctly
- [ ] Links work
- [ ] Mobile-responsive

### Spam Score
- [ ] Mail-Tester score ≥ 9/10
- [ ] No spam trigger words
- [ ] Unsubscribe link present
- [ ] Good text/image ratio

### E2E Flow
- [ ] Order triggers email
- [ ] Email sent timestamp recorded
- [ ] No duplicate emails
- [ ] Correct order details
- [ ] Error handling works

### Production Readiness
- [ ] Resend API key configured (production)
- [ ] Domain verified in Resend
- [ ] DNS propagation complete (48h)
- [ ] Rate limits understood
- [ ] Monitoring dashboard set up
- [ ] Bounce handling configured

---

## Monitoring & Maintenance

### Weekly Checks
- Bounce rate < 2%
- Open rate > 20%
- Spam complaints < 0.1%
- Deliverability > 98%

### Monthly Checks
- Review Resend dashboard analytics
- Clean inactive subscribers
- Test spam score (should stay 9/10+)
- Re-run `npm run email:check-auth`

### Quarterly Checks
- Review email content for improvements
- A/B test subject lines
- Update email templates if needed
- Audit unsubscribe rate

---

## Resources

### Testing Tools
- **Mail-Tester:** https://www.mail-tester.com/ (Free spam score)
- **Litmus:** https://litmus.com/ (Paid, comprehensive)
- **Email on Acid:** https://www.emailonacid.com/ (Paid)
- **Mailtrap:** https://mailtrap.io/ (Free email preview)

### Email Best Practices
- **Resend Docs:** https://resend.com/docs
- **Email Marketing Rules:** https://www.ftc.gov/tips-advice/business-center/guidance/can-spam-act-compliance-guide-business
- **Email Deliverability Guide:** https://postmarkapp.com/guides/email-deliverability

### DNS Tools
- **DNS Checker:** https://dnschecker.org/
- **MX Toolbox:** https://mxtoolbox.com/
- **Google Admin Toolbox:** https://toolbox.googleapps.com/apps/checkmx/

---

## Support

If you encounter issues:

1. Check this documentation first
2. Run diagnostics: `npm run email:check-auth`
3. Check Resend dashboard for errors
4. Review Resend docs: https://resend.com/docs
5. Contact Resend support (responsive, helpful)

---

**Last Updated:** March 19, 2026
**Maintained by:** Pawcasso Atelier Engineering Team
