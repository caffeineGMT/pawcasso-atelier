/**
 * Meta Pixel Implementation for Pawcasso Atelier
 *
 * This file contains the Meta Pixel setup and event tracking
 * for conversion tracking in Meta Ads campaigns.
 *
 * Installation:
 * 1. Get your Pixel ID from Meta Events Manager
 * 2. Replace PIXEL_ID with your actual ID
 * 3. Add this script to website/src/app/layout.tsx
 */

// Meta Pixel Base Code (add to <head>)
export const MetaPixelScript = () => {
  const PIXEL_ID = "YOUR_PIXEL_ID_HERE"; // Replace with actual Pixel ID

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
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
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
};

// Type definitions for Meta Pixel events
declare global {
  interface Window {
    fbq: (
      action: 'track' | 'trackCustom',
      eventName: string,
      parameters?: Record<string, any>
    ) => void;
  }
}

// Event tracking functions
export const trackViewContent = (contentName: string, contentType = 'product') => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: contentName,
      content_category: 'Pet Art',
      content_type: contentType,
    });
  }
};

export const trackInitiateCheckout = (artStyle: string, petType: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      content_name: 'Pet Portrait Order',
      value: 9.0,
      currency: 'USD',
      content_category: artStyle,
      custom_pet_type: petType,
    });
  }
};

export const trackPurchase = (
  orderId: string,
  artStyle: string,
  petType: string
) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Purchase', {
      value: 9.0,
      currency: 'USD',
      content_name: 'AI Pet Portrait',
      content_type: 'product',
      content_ids: [orderId],
      content_category: artStyle,
      custom_pet_type: petType,
    });
  }
};

export const trackAddToCart = (artStyle: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_name: `Pet Portrait - ${artStyle}`,
      value: 9.0,
      currency: 'USD',
      content_type: 'product',
    });
  }
};

export const trackSearch = (searchTerm: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Search', {
      search_string: searchTerm,
      content_category: 'Art Style Search',
    });
  }
};

// Custom event for style browsing
export const trackStyleFilter = (style: string, animal: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'StyleFilter', {
      selected_style: style,
      selected_animal: animal,
    });
  }
};

/**
 * USAGE EXAMPLES:
 *
 * 1. In website/src/app/layout.tsx:
 *
 * import { MetaPixelScript } from '@/lib/tracking/meta-pixel';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <head>
 *         <MetaPixelScript />
 *       </head>
 *       <body>{children}</body>
 *     </html>
 *   );
 * }
 *
 * 2. In website/src/app/gallery/page.tsx:
 *
 * import { trackViewContent } from '@/lib/tracking/meta-pixel';
 *
 * useEffect(() => {
 *   trackViewContent('Pet Portrait Gallery', 'product_group');
 * }, []);
 *
 * 3. In website/src/app/order/page.tsx:
 *
 * import { trackInitiateCheckout } from '@/lib/tracking/meta-pixel';
 *
 * const handleSubmit = (formData) => {
 *   trackInitiateCheckout(formData.artStyle, formData.petType);
 *   // ... rest of form submission
 * };
 *
 * 4. After Stripe payment success:
 *
 * import { trackPurchase } from '@/lib/tracking/meta-pixel';
 *
 * const handlePaymentSuccess = (session) => {
 *   trackPurchase(session.id, artStyle, petType);
 *   // ... redirect to success page
 * };
 */
