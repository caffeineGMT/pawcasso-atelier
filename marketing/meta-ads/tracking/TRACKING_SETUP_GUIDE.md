# Meta Pixel & Conversion Tracking Setup Guide

## Overview
This guide will help you set up Meta Pixel tracking and Conversions API for accurate campaign performance measurement.

---

## Step 1: Create Meta Pixel

### 1.1 Access Meta Events Manager
1. Go to [Meta Events Manager](https://business.facebook.com/events_manager2)
2. Click **Connect Data Sources**
3. Select **Web**
4. Click **Get Started**

### 1.2 Name Your Pixel
- Pixel Name: **Pawcasso Atelier Website**
- Website URL: `https://pawcasso-atelier.vercel.app`
- Click **Create Pixel**

### 1.3 Get Your Pixel ID
- Your Pixel ID will be displayed (looks like: `123456789012345`)
- Copy this ID for later use

---

## Step 2: Install Meta Pixel on Website

### 2.1 Add Pixel to Next.js App

**File:** `website/src/app/layout.tsx`

Add the following to your root layout:

```tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  const PIXEL_ID = "YOUR_PIXEL_ID_HERE"; // Replace with actual ID

  return (
    <html lang="en">
      <head>
        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 2.2 Verify Pixel Installation
1. Install [Meta Pixel Helper Chrome Extension](https://chrome.google.com/webstore/detail/meta-pixel-helper)
2. Visit your website: `https://pawcasso-atelier.vercel.app`
3. Click the extension icon
4. Verify "PageView" event is firing ✅

---

## Step 3: Set Up Conversion Events

### 3.1 ViewContent Event (Gallery Page)

**File:** `website/src/app/gallery/page.tsx`

```tsx
'use client';
import { useEffect } from 'react';

export default function GalleryPage() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_name: 'Pet Portrait Gallery',
        content_category: 'Pet Art',
        content_type: 'product',
      });
    }
  }, []);

  // ... rest of component
}
```

### 3.2 InitiateCheckout Event (Order Form)

**File:** `website/src/app/order/page.tsx`

```tsx
const handleSubmit = async (formData: FormData) => {
  const artStyle = formData.get('artStyle');
  const petType = formData.get('petType');

  // Track checkout initiation
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      content_name: 'Pet Portrait Order',
      value: 9.0,
      currency: 'USD',
      content_category: artStyle,
    });
  }

  // Continue with Stripe checkout
  // ...
};
```

### 3.3 Purchase Event (Stripe Success)

**File:** `website/src/app/api/webhook/stripe/route.ts` (server-side)

OR

**File:** `website/src/app/order/success/page.tsx` (client-side)

```tsx
'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId && typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Purchase', {
        value: 9.0,
        currency: 'USD',
        content_name: 'AI Pet Portrait',
        content_type: 'product',
        content_ids: [sessionId],
      });
    }
  }, [sessionId]);

  return <div>Thank you for your order!</div>;
}
```

---

## Step 4: Set Up Conversions API (Server-Side Tracking)

### Why Conversions API?
- iOS 14+ tracking limitations
- Ad blockers bypass client-side pixels
- Improved data accuracy and attribution

### 4.1 Install Meta Business SDK

```bash
cd website
npm install facebook-nodejs-business-sdk
```

### 4.2 Create Conversions API Handler

**File:** `website/src/lib/meta-conversions-api.ts`

```typescript
import { EventRequest, UserData, ServerEvent, CustomData } from 'facebook-nodejs-business-sdk';

const ACCESS_TOKEN = process.env.META_CONVERSIONS_API_TOKEN!;
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID!;

export async function trackServerPurchase(params: {
  email: string;
  orderId: string;
  value: number;
  currency: string;
  userAgent: string;
  ipAddress: string;
}) {
  const userData = new UserData()
    .setEmail(params.email)
    .setClientIpAddress(params.ipAddress)
    .setClientUserAgent(params.userAgent);

  const customData = new CustomData()
    .setValue(params.value)
    .setCurrency(params.currency)
    .setContentName('AI Pet Portrait')
    .setContentType('product')
    .setContentIds([params.orderId]);

  const serverEvent = new ServerEvent()
    .setEventName('Purchase')
    .setEventTime(Math.floor(Date.now() / 1000))
    .setUserData(userData)
    .setCustomData(customData)
    .setEventSourceUrl('https://pawcasso-atelier.vercel.app/order/success')
    .setActionSource('website');

  const eventRequest = new EventRequest(ACCESS_TOKEN, PIXEL_ID).setEvents([
    serverEvent,
  ]);

  try {
    const response = await eventRequest.execute();
    console.log('Conversions API Success:', response);
    return response;
  } catch (error) {
    console.error('Conversions API Error:', error);
    throw error;
  }
}
```

### 4.3 Get Conversions API Access Token

1. Go to [Meta Events Manager](https://business.facebook.com/events_manager2)
2. Select your Pixel
3. Click **Settings** tab
4. Scroll to **Conversions API**
5. Click **Generate Access Token**
6. Copy token and add to `.env.local`:

```env
META_CONVERSIONS_API_TOKEN=your_token_here
NEXT_PUBLIC_META_PIXEL_ID=your_pixel_id_here
```

### 4.4 Call Conversions API After Purchase

**File:** `website/src/app/api/webhook/stripe/route.ts`

```typescript
import { trackServerPurchase } from '@/lib/meta-conversions-api';

export async function POST(req: Request) {
  const event = await stripe.webhooks.constructEvent(
    body,
    signature,
    webhookSecret
  );

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Track purchase with Conversions API
    await trackServerPurchase({
      email: session.customer_email!,
      orderId: session.id,
      value: 9.0,
      currency: 'usd',
      userAgent: req.headers.get('user-agent') || '',
      ipAddress: req.headers.get('x-forwarded-for') || req.ip || '',
    });
  }

  return new Response('Success', { status: 200 });
}
```

---

## Step 5: Test Your Tracking

### 5.1 Use Meta Test Events Tool
1. Go to [Meta Events Manager](https://business.facebook.com/events_manager2)
2. Select your Pixel
3. Click **Test Events** tab
4. Enter your website URL
5. Browse your site and submit a test order
6. Verify events appear in Test Events tab:
   - ✅ PageView
   - ✅ ViewContent
   - ✅ InitiateCheckout
   - ✅ Purchase

### 5.2 Check Event Quality
- Events should show **Good** quality score
- User data parameters should be present (email, IP, user agent)
- Value and currency should be correct ($9 USD)

---

## Step 6: Create Custom Conversions (Optional)

### 6.1 Gallery Viewers Custom Conversion
1. Go to Events Manager → Custom Conversions
2. Click **Create Custom Conversion**
3. Name: "Gallery Viewers"
4. Rule: `ViewContent` AND `content_name` contains "Gallery"
5. Save

### 6.2 Cart Abandoners Custom Conversion
1. Name: "Cart Abandoners"
2. Rule: `InitiateCheckout` AND NOT `Purchase` (within 24 hours)
3. Save

---

## Step 7: Verify Data in Ads Manager

### 7.1 Check Event Count
1. Go to [Meta Ads Manager](https://business.facebook.com/adsmanager)
2. Click **Events Manager** in top menu
3. Select your Pixel
4. Verify events are being received:
   - PageView: Should see immediate data
   - ViewContent: Track gallery visits
   - InitiateCheckout: Track order form submissions
   - Purchase: Track completed orders

### 7.2 Attribution Window Settings
1. Go to Events Manager → Pixel Settings
2. Set Attribution Window:
   - Click: 7-day click
   - View: 1-day view
3. Save changes

---

## Troubleshooting

### Pixel Not Firing
- Check browser console for errors
- Verify Pixel ID is correct
- Disable ad blockers for testing
- Use Meta Pixel Helper extension

### Events Not Showing in Events Manager
- Wait 20-30 minutes for data processing
- Check Test Events tool for real-time debugging
- Verify `window.fbq` is defined before calling

### Conversions API Errors
- Verify Access Token is valid
- Check that token has correct permissions
- Ensure IP address and User Agent are being passed
- Check server logs for error messages

---

## Environment Variables Checklist

Add these to `website/.env.local`:

```env
# Meta Pixel & Conversions API
NEXT_PUBLIC_META_PIXEL_ID=123456789012345
META_CONVERSIONS_API_TOKEN=EAAxxxxxxxxxxxxx
```

**Important:** Never commit `.env.local` to git!

---

## Summary Checklist

- [ ] Created Meta Pixel in Events Manager
- [ ] Installed Pixel code in `layout.tsx`
- [ ] Added ViewContent event to gallery page
- [ ] Added InitiateCheckout event to order form
- [ ] Added Purchase event to success page
- [ ] Set up Conversions API with access token
- [ ] Tested all events using Test Events tool
- [ ] Verified events in Events Manager (after 30 min)
- [ ] Created custom conversions (optional)
- [ ] Meta Pixel Helper extension shows green checkmark

**Once all checked ✅, your tracking is ready for the ad campaign!**
