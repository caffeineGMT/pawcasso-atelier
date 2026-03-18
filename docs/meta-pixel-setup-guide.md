# Meta Pixel & Conversions API Setup Guide

Complete step-by-step guide for setting up Facebook/Instagram retargeting infrastructure for Pawcasso Atelier.

---

## Prerequisites

- [ ] Facebook Business Manager account
- [ ] Meta Pixel created (get Pixel ID)
- [ ] Access to domain DNS settings (Vercel)
- [ ] Meta Conversions API access token

---

## Part 1: Facebook Business Manager Setup

### Step 1: Create Facebook Business Manager Account

1. Go to https://business.facebook.com/
2. Click "Create Account"
3. Enter business details:
   - Business Name: "Pawcasso Atelier"
   - Business Email: michaelguo@meta.com (or dedicated email)
   - Country: United States
4. Verify email and complete setup

### Step 2: Create Facebook Page

1. In Business Manager, go to "Pages" → "Add Page" → "Create New Page"
2. Page Details:
   - Page Name: Pawcasso Atelier
   - Category: Art & Craft Store
   - Bio: "Transform your pet into stunning AI-generated artwork. Custom portraits for $9."
   - Profile Photo: Logo
   - Cover Photo: Gallery collage
3. Add CTA button: "Shop Now" → https://pawcasso-atelier.vercel.app/order

### Step 3: Connect Instagram Account

1. In Business Manager, go to "Instagram accounts" → "Add"
2. Click "Connect Instagram account"
3. Log in to @pawcasso.atelier
4. Grant permissions
5. Link to Facebook Page

### Step 4: Create Ad Account

1. In Business Manager, go to "Ad Accounts" → "Add" → "Create a new ad account"
2. Details:
   - Name: Pawcasso Atelier Ad Account
   - Time Zone: Pacific Time (US & Canada)
   - Currency: USD ($)
3. Add payment method (credit card)
4. Set spending limit: $500/month (optional safety)

---

## Part 2: Meta Pixel Setup

### Step 1: Create Meta Pixel

1. In Business Manager, go to "Data Sources" → "Pixels" → "Add" → "Create a Pixel"
2. Name: "Pawcasso Atelier Pixel"
3. Website URL: https://pawcasso-atelier.vercel.app
4. Click "Create"
5. **Copy Pixel ID** (format: 123456789012345)

### Step 2: Add Pixel ID to Environment Variables

1. Go to Vercel dashboard → Pawcasso Atelier project
2. Settings → Environment Variables
3. Add new variable:
   - **Key:** `NEXT_PUBLIC_META_PIXEL_ID`
   - **Value:** [Your 15-digit Pixel ID]
   - **Environments:** Production, Preview, Development
4. Click "Save"
5. Redeploy application to apply changes

### Step 3: Verify Pixel Installation ✅

**Status:** Meta Pixel is already installed in the codebase at:
- File: `/website/src/app/layout.tsx`
- Lines: 100-123 (base pixel + noscript fallback)

To verify it's working:

1. Install **Meta Pixel Helper** Chrome extension:
   - https://chrome.google.com/webstore/detail/meta-pixel-helper/
2. Visit https://pawcasso-atelier.vercel.app
3. Click Meta Pixel Helper icon
4. Verify:
   - ✅ Pixel found
   - ✅ PageView event fires
   - ✅ No errors

### Step 4: Test Events

Navigate through the site and verify these events fire (use Pixel Helper):

1. **PageView** - All pages ✅
2. **ViewContent** - Visit /gallery ✅
3. **AddToCart** - Upload pet photo on /order ✅
4. **InitiateCheckout** - Submit order form ✅
5. **Lead** - Complete email capture modal ✅
6. **Search** - Use gallery filters ✅

### Step 5: Check Events Manager

1. Go to Meta Events Manager: https://business.facebook.com/events_manager2
2. Select "Pawcasso Atelier Pixel"
3. View "Test Events" tab
4. Perform actions on site
5. Events should appear within 20 minutes
6. Check "Event Match Quality" score (target: 6.0+)

---

## Part 3: Domain Verification

### Why Domain Verification?

- Required for iOS 14+ attribution
- Enables Aggregated Event Measurement (8 conversion events max)
- Improves data accuracy

### Step 1: Get Verification Meta Tag

1. In Business Manager, go to "Brand Safety" → "Domains"
2. Click "Add" → Enter: `pawcasso-atelier.vercel.app`
3. Click "Add domain"
4. Select "Meta-tag verification"
5. **Copy the meta tag** (format: `<meta name="facebook-domain-verification" content="abc123xyz..." />`)

### Step 2: Add Meta Tag to Website

1. Open `/website/src/app/layout.tsx`
2. Add meta tag inside `<head>` section (around line 74):

```tsx
<head>
  {/* Existing content */}
  <meta name="facebook-domain-verification" content="YOUR_VERIFICATION_CODE_HERE" />
</head>
```

3. Commit and deploy to production

### Step 3: Verify Domain

1. Back in Business Manager → Domains
2. Click "Verify" next to `pawcasso-atelier.vercel.app`
3. Wait 2-5 minutes
4. Status should change to "Verified" ✅

---

## Part 4: Meta Conversions API Setup

### Why Conversions API?

- Bypasses iOS 14+ tracking limitations (Apple ATT)
- More accurate attribution
- Better event match quality
- Improved retargeting audience building

### Step 1: Generate Access Token

1. In Business Manager, go to "Business Settings" → "System Users"
2. Click "Add" → Create system user:
   - Name: "Conversions API User"
   - Role: Admin
3. Click "Generate New Token"
4. Select:
   - App: None (use any app or "All Pixels")
   - Permissions: `ads_management`, `business_management`
   - Token expiration: Never
5. **Copy the access token** (format: `EAAG...`)
6. **IMPORTANT:** Store securely - shown only once!

### Step 2: Add Access Token to Environment Variables

1. Go to Vercel dashboard → Pawcasso Atelier project
2. Settings → Environment Variables
3. Add new variable:
   - **Key:** `META_CONVERSIONS_API_ACCESS_TOKEN`
   - **Value:** [Your access token from Step 1]
   - **Environments:** Production only (NOT preview/dev for security)
4. Click "Save"
5. Redeploy to production

### Step 3: Verify Server-Side Events ✅

**Status:** Conversions API integration code is ready at:
- File: `/website/src/lib/meta-conversions-api.ts`
- Integration: `/website/src/app/api/subscribe/route.ts`

To test:

1. Visit website and submit email in exit-intent modal
2. Go to Events Manager → Overview
3. Check "Event Source" column - should show:
   - Browser (client-side pixel)
   - Server (Conversions API)
4. Look for "Deduplicated" badge (means event matched correctly)

### Step 4: Configure Event Deduplication

Event deduplication prevents counting the same event twice (once from browser, once from server).

**Already implemented** via `event_id` parameter:
- Client-side: Events include unique `event_id`
- Server-side: Same `event_id` passed to Conversions API
- Meta automatically deduplicates matching IDs

### Step 5: Monitor Event Match Quality

1. Go to Events Manager → Overview → "Event Match Quality"
2. Target scores:
   - **Good:** 6.0+
   - **Excellent:** 8.0+
3. Improve score by passing more user data:
   - ✅ Email (hashed)
   - ✅ IP Address
   - ✅ User Agent
   - ✅ Facebook cookies (fbp, fbc)
   - ⚠️ Phone, Name, Address (optional)

---

## Part 5: Configure Aggregated Event Measurement (AEM)

### What is AEM?

iOS 14+ privacy changes limit tracking to 8 conversion events per domain. You must configure which events to prioritize.

### Step 1: Configure Priority Events

1. Go to Events Manager → "Aggregated Event Measurement"
2. Click "Configure Web Events"
3. Add domain: `pawcasso-atelier.vercel.app`
4. Rank events (priority order):
   1. **Purchase** (HIGHEST - must be #1)
   2. **InitiateCheckout**
   3. **AddToCart**
   4. **Lead**
   5. **AddPaymentInfo**
   6. **ViewContent**
   7. **Search**
   8. **PageView** (LOWEST)
5. Click "Submit" → Wait for Apple approval (24-72 hours)

---

## Part 6: Create Custom Audiences

### Audience #1: Website Visitors (14-day)

1. Go to Ads Manager → Audiences → "Create Audience" → "Custom Audience"
2. Source: "Website"
3. Events: "All website visitors"
4. Retention: Last 14 days
5. Name: `Pawcasso - All Website Visitors (14d)`
6. Description: "Anyone who visited the site in the last 14 days"
7. Click "Create Audience"

### Audience #2: Gallery Browsers (14-day)

1. Create Audience → Website
2. Events: "People who visited specific web pages"
3. URL contains: `/gallery`
4. Retention: Last 14 days
5. Name: `Pawcasso - Gallery Browsers (14d)`
6. Click "Create Audience"

### Audience #3: Add-to-Cart Abandoners (14-day) ⚡ CRITICAL

1. Create Audience → Website
2. Include: "People who meet ALL of the following criteria"
   - Event: AddToCart (in last 14 days)
3. Exclude: "People who meet ANY of the following criteria"
   - Event: Purchase (in last 14 days)
4. Name: `Pawcasso - Cart Abandoners (14d)`
5. Click "Create Audience"

### Audience #4: Checkout Abandoners (14-day)

1. Create Audience → Website
2. Include:
   - Event: InitiateCheckout OR AddPaymentInfo (in last 14 days)
3. Exclude:
   - Event: Purchase (in last 14 days)
4. Name: `Pawcasso - Checkout Abandoners (14d)`
5. Click "Create Audience"

### Audience #5: Past Purchasers (180-day)

1. Create Audience → Website
2. Events: Purchase (in last 180 days)
3. Name: `Pawcasso - Past Customers (180d)`
4. Click "Create Audience"

### Audience #6: Email Leads (30-day)

1. Create Audience → Website
2. Events: Lead (in last 30 days)
3. Exclude: Purchase (in last 30 days)
4. Name: `Pawcasso - Email Leads (30d)`
5. Click "Create Audience"

---

## Part 7: Test Audience Population

### Minimum Audience Size

- Facebook requires **100+ people** in an audience before you can use it in ads
- Gallery Browsers: Should reach 100+ within 7-14 days
- Cart Abandoners: Should reach 100+ within 14-21 days
- Past Purchasers: Will grow over time

### Monitoring

1. Go to Ads Manager → Audiences
2. Check "Audience Size" column
3. Status indicators:
   - Red "!" = < 1,000 people (too small, may not deliver)
   - Yellow warning = 1,000-50,000 people (OK)
   - Green = 50,000+ people (optimal)

**Note:** Cart abandoner audiences will start small - that's expected!

---

## Part 8: Create Test Campaign

### Quick Test Campaign (Before Full Launch)

1. Go to Ads Manager → "Create" → "Campaign"
2. Objective: "Traffic"
3. Campaign Name: "TEST - Website Visitors"
4. Budget: $10/day
5. Ad Set:
   - Audience: Website Visitors (14d)
   - Placements: Automatic
   - Budget: $10/day
6. Ad:
   - Format: Single Image
   - Primary Text: "Transform your pet into art for $9"
   - Headline: "Custom Pet Portraits"
   - CTA: "Shop Now"
   - Destination: https://pawcasso-atelier.vercel.app/order
7. Click "Publish"
8. Run for 3-5 days
9. Check metrics:
   - CTR > 1%: Good
   - CPM < $15: Good
   - CPC < $1.50: Good

---

## Environment Variables Checklist

Add these to Vercel → Settings → Environment Variables:

- [x] `NEXT_PUBLIC_META_PIXEL_ID` - Your Meta Pixel ID (client-side)
- [ ] `META_CONVERSIONS_API_ACCESS_TOKEN` - System user access token (server-side)

**Security Note:** `META_CONVERSIONS_API_ACCESS_TOKEN` should ONLY be in Production environment, not Preview/Development.

---

## Troubleshooting

### Problem: "Pixel not found" in Meta Pixel Helper

**Causes:**
- Pixel ID not set in environment variables
- Website not redeployed after adding env var
- Ad blocker blocking pixel

**Solutions:**
1. Check Vercel env vars are set correctly
2. Redeploy site: `git push origin main`
3. Disable ad blocker temporarily
4. Check browser console for errors

---

### Problem: Events not showing in Events Manager

**Causes:**
- Events take 20+ minutes to appear
- Pixel ID mismatch
- Client clock drift
- Events blocked by privacy tools

**Solutions:**
1. Wait 30-60 minutes
2. Verify Pixel ID matches in code and Business Manager
3. Check "Test Events" tab for real-time data
4. Test in incognito mode (no extensions)

---

### Problem: Low Event Match Quality (< 6.0)

**Causes:**
- Missing user data (email, IP, user agent)
- Cookies blocked
- No server-side tracking

**Solutions:**
1. Implement Conversions API (done ✅)
2. Pass more user parameters (email hash, IP, etc.)
3. Use Advanced Matching in pixel code
4. Verify cookies are being set (_fbp, _fbc)

---

### Problem: Audience size not growing

**Causes:**
- Low website traffic
- Events not firing correctly
- Too restrictive criteria
- Domain not verified

**Solutions:**
1. Drive more traffic (organic, social, ads)
2. Verify events are firing (Pixel Helper)
3. Broaden audience criteria (e.g., 30 days instead of 14)
4. Complete domain verification

---

### Problem: "Domain not eligible for conversion lift studies"

**Cause:**
- Domain not verified

**Solution:**
- Complete Part 3: Domain Verification

---

## Testing Checklist

Before launching campaigns, verify:

- [x] Meta Pixel installed and firing ✅
- [x] All 8 standard events tracking correctly ✅
- [ ] Domain verified in Business Manager
- [ ] Conversions API access token configured
- [ ] Events showing in Events Manager (wait 24hrs)
- [ ] Event Match Quality score > 6.0
- [ ] Minimum 1 audience has 100+ people
- [ ] Test campaign created and running
- [ ] Pixel Helper shows no errors
- [ ] AEM configured (8 priority events)

---

## Next Steps After Setup

1. **Wait 7-14 days** to build audiences (need 100+ people)
2. **Launch retargeting campaigns** (see `facebook-retargeting-campaign.md`)
3. **Monitor ROAS** daily (target: 2.5x minimum)
4. **Optimize creatives** based on performance
5. **Scale budgets** when ROAS > 3.0x
6. **Create lookalikes** after 100 purchases

---

## Resources

- Meta Pixel Setup: https://www.facebook.com/business/help/952192354843755
- Conversions API Docs: https://developers.facebook.com/docs/marketing-api/conversions-api
- Events Manager: https://business.facebook.com/events_manager2
- Pixel Helper: https://chrome.google.com/webstore/detail/meta-pixel-helper/
- Business Manager: https://business.facebook.com/

---

**Last Updated:** March 2026
**Status:** Pixel code ready ✅ | Domain verification pending | Conversions API ready ✅
