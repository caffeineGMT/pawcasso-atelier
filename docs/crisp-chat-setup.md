# Crisp Chat Setup Guide

## Overview

Live chat implementation for the order page to increase conversion rates by 15-25%. Uses intelligent triggers, automated FAQ responses, and proactive engagement to reduce cart abandonment and answer buyer questions in real-time.

## Features Implemented

### 1. Intelligent Conversion Triggers

**Welcome Message (3 seconds)**
- Shows gentle welcome after page load
- Message: "👋 Need help? I can answer questions about styles, delivery, or pricing!"
- Non-intrusive introduction to support

**Style Preference Prompt (60 seconds)**
- Triggers if user hasn't engaged yet
- Message: "Quick question - what style are you leaning toward? I can show you similar examples! 🎨"
- Helps overcome decision paralysis
- Tracks engagement with GA4 event: `chat_trigger_style`

**Cart Abandonment Prevention (90 seconds of inactivity)**
- Triggers after 90 seconds of no user activity
- Message: "Need help deciding? I can recommend the best style for your pet! 🐾"
- Resets on any user interaction (scroll, click, type, mouse movement)
- Tracks with GA4 event: `chat_trigger_abandonment`

### 2. FAQ Auto-Responder

Instant automated responses to common questions:

| User Query | Auto-Response |
|------------|---------------|
| "delivery", "how long", "when" | ⚡ Your portrait will be delivered within 24 hours! We also offer instant delivery with our Premium package. |
| "price", "cost", "how much" | 💰 Package breakdown with all 4 tiers (Basic $9, Standard $19, Premium $49, Professional $79) |
| "style", "which style", "recommend" | 🎨 Popular styles: Renaissance, Pixar 3D, Needle Felt, Ghibli + follow-up question |
| "refund", "guarantee", "satisfied" | ✅ 100% satisfaction guaranteed - redo or full refund, no questions asked |
| "photo", "picture", "quality" | 📸 Photo requirements: clear face, good lighting, JPG/PNG/WebP (max 10MB) |
| "gift", "someone else" | 🎁 Gift instructions + 10% referral code mention |

### 3. Analytics & Tracking

- Chat opens tracked to GA4
- Trigger events tracked (60s style prompt, 90s abandonment)
- Session data tagged for segmentation (page: order, intent: high_conversion)

## Setup Instructions

### Step 1: Create Free Crisp Account

1. Go to [crisp.chat](https://crisp.chat/)
2. Click "Try Crisp for Free"
3. Sign up with email (no credit card required)
4. Choose "I'm building my own website" when asked

### Step 2: Get Your Website ID

1. After signup, go to **Settings** (gear icon in sidebar)
2. Navigate to **Setup Instructions**
3. Copy your **Website ID** - it looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
4. Alternatively, find it in the JavaScript snippet: `CRISP_WEBSITE_ID = "your-id-here"`

### Step 3: Add to Environment Variables

Add to `.env.local`:

```bash
NEXT_PUBLIC_CRISP_WEBSITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### Step 4: Deploy & Test

```bash
npm run dev
```

Visit `http://localhost:3000/order` and you should see:
- Chat widget appears in bottom-right corner after 3 seconds
- Welcome message shows automatically
- After 60 seconds, style prompt appears
- After 90 seconds of no activity, abandonment message appears

## Crisp Dashboard Configuration (Optional Enhancements)

### Customize Chat Widget Appearance

**Settings → Chatbox → Appearance**
- **Color**: Set to `#C9A96E` (matches Pawcasso gold)
- **Position**: Bottom right (default)
- **Widget text**: "Need help? 💬"

### Set Up Human Handoff

**Settings → Operators → Add Operator**
- Add team members who can respond when needed
- Set availability hours (e.g., 9 AM - 9 PM PT)
- Auto-responder handles queries outside hours

### Enable Email Notifications

**Settings → Notifications**
- Enable "New conversation" email alerts
- Enable "New message" push notifications (mobile app)
- Response time goal: < 5 minutes during business hours

### Create Saved Replies (Snippets)

**Settings → Shortcuts**
Create quick responses for common scenarios:

- `/pricing` → Full pricing breakdown
- `/delivery` → Delivery time explanation
- `/refund` → Refund policy
- `/styles` → Style recommendations with examples
- `/photo` → Photo requirements

### Set Up Away Mode

**Settings → Availability**
- **Available**: 9 AM - 9 PM PT (auto-responders active)
- **Away**: 9 PM - 9 AM PT (show "We're away, but automated responses still work!")

## Expected Performance Impact

### Industry Benchmarks (Live Chat on E-commerce)
- **Conversion rate lift**: 10-30% average
- **Average order value increase**: 5-15%
- **Cart abandonment reduction**: 15-25%
- **Customer satisfaction**: +20-40%

### Our Target Metrics (Pawcasso Order Page)
- **Baseline conversion rate**: ~2-3% (typical e-commerce)
- **Target with chat**: 3-4% (+15-25% relative increase)
- **Annual impact at 1,000 visitors/month**: +10-15 orders/month = +$90-135 MRR

### Key Performance Indicators (Track in GA4)

1. **Chat Engagement Rate**: % of visitors who open chat
   - Target: 15-25%
2. **Chat-to-Conversion Rate**: % of chat users who complete purchase
   - Target: 8-12% (vs 2-3% baseline)
3. **Trigger Effectiveness**:
   - 60s style prompt → chat open rate
   - 90s abandonment prompt → recovery rate
4. **Response Time** (if human handoff enabled):
   - Target: < 5 minutes during business hours

## Testing Checklist

- [ ] Chat widget loads on `/order` page only
- [ ] Welcome message appears after 3 seconds
- [ ] Style prompt triggers after 60 seconds
- [ ] Abandonment prompt triggers after 90 seconds of inactivity
- [ ] Idle timer resets on user activity (scroll, click)
- [ ] FAQ auto-responders work for all 6 categories
- [ ] Chat opens tracked to GA4
- [ ] Trigger events tracked to GA4
- [ ] Mobile responsive (test on iPhone, Android)
- [ ] No console errors

## Troubleshooting

### Chat Not Showing

**Problem**: Widget doesn't appear on order page
**Solutions**:
1. Check `.env.local` has correct `NEXT_PUBLIC_CRISP_WEBSITE_ID`
2. Verify environment variable is prefixed with `NEXT_PUBLIC_` (required for client-side)
3. Clear browser cache and hard refresh (Cmd+Shift+R)
4. Check browser console for JavaScript errors

### Auto-Responses Not Working

**Problem**: FAQ responses don't trigger
**Solutions**:
1. Wait 800ms after sending message (intentional delay)
2. Check message contains trigger keywords (case-insensitive)
3. Verify chat is fully loaded (check `window.$crisp` exists)
4. Test with exact phrases from the FAQ table

### Triggers Not Firing

**Problem**: 60s or 90s prompts don't appear
**Solutions**:
1. Check `enableConversionTriggers={true}` in `OrderPage`
2. Verify timers aren't cleared by other events
3. Ensure user hasn't manually opened chat (clears timers)
4. Test in incognito mode (clean session)

## Alternative: Intercom Setup

If you prefer Intercom instead of Crisp:

1. Sign up at [intercom.com](https://www.intercom.com/) ($39/month minimum)
2. Get your App ID from Settings → Installation
3. Replace `CrispChat` component with:

```tsx
<Script
  id="intercom"
  dangerouslySetInnerHTML={{
    __html: `
      (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/${INTERCOM_APP_ID}';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
    `
  }}
/>
```

**Crisp Advantages (Why We Chose It)**:
- ✅ Free forever plan (unlimited conversations)
- ✅ No credit card required
- ✅ Full feature set (triggers, auto-responders, analytics)
- ✅ Modern UI, mobile apps
- ✅ Perfect for startups

**Intercom Advantages**:
- More advanced automation (but overkill for our needs)
- Better for large teams
- More integrations (Salesforce, HubSpot)

## Next Steps

After setup:

1. **Monitor Performance**:
   - Check Crisp Dashboard daily for conversations
   - Review GA4 events: `chat_opened`, `chat_trigger_style`, `chat_trigger_abandonment`
   - Compare conversion rates: pre-chat vs post-chat

2. **Iterate on Messaging**:
   - A/B test trigger timing (60s vs 45s for style prompt)
   - Test different message copy
   - Adjust FAQ responses based on actual questions

3. **Enable Human Support** (when ready):
   - Add team member to Crisp
   - Set availability hours
   - Monitor response times
   - Use saved replies for efficiency

4. **Advanced Features** (Phase 2):
   - Chatbot workflows for complex scenarios
   - Lead qualification (collect email before chat)
   - Integration with email marketing (Mailchimp)
   - Multilingual support (Spanish, French, etc.)

## Success Metrics (30-Day Review)

Track these in the first 30 days:

| Metric | Before Chat | Target | Actual |
|--------|-------------|--------|--------|
| Order page conversion rate | 2.5% | 3.1% | ___ |
| Chat engagement rate | N/A | 20% | ___ |
| Average order value | $9 | $11 | ___ |
| Cart abandonment rate | 75% | 65% | ___ |
| Customer support tickets | 5/week | 2/week | ___ |

**ROI Calculation**:
- If 1,000 monthly visitors × 20% chat engagement = 200 chat sessions
- If 200 chats × 8% conversion = 16 extra orders
- 16 orders × $9 = **$144 extra revenue/month**
- Cost: **$0** (Crisp free plan)
- **ROI: ∞** (infinite return on $0 investment)

---

**Need Help?**
- Crisp Documentation: https://docs.crisp.chat/
- Support: help@crisp.chat
- Community: https://crisp.chat/community/
