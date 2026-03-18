/**
 * Google Ads Campaign Configuration & Conversion Tracking
 *
 * Campaign: Pawcasso Atelier - Custom Pet Portraits
 * Target Markets: US, Canada, UK, Australia
 * Monthly Budget: $500 ($16.67/day)
 *
 * Ad Groups:
 *   1. Dog Portraits  → /custom-dog-portraits  (Target CPA: $5)
 *   2. Cat Portraits  → /custom-cat-portraits  (Target CPA: $5)
 *   3. Pet Gifts      → /pet-portrait-gift     (Target CPA: $5)
 */

// Conversion IDs & Labels - set via environment variables in Vercel dashboard
export const GOOGLE_ADS_CONVERSION_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID || 'AW-XXXXXXXXXX';

export const CONVERSION_LABELS = {
  purchase: process.env.NEXT_PUBLIC_GADS_LABEL_PURCHASE || 'purchase_label',
  subscription: process.env.NEXT_PUBLIC_GADS_LABEL_SUBSCRIPTION || 'subscription_label',
  quote_request: process.env.NEXT_PUBLIC_GADS_LABEL_QUOTE_REQUEST || 'quote_request_label',
  add_to_cart: process.env.NEXT_PUBLIC_GADS_LABEL_ADD_TO_CART || 'add_to_cart_label',
  begin_checkout: process.env.NEXT_PUBLIC_GADS_LABEL_BEGIN_CHECKOUT || 'begin_checkout_label',
} as const;

export type ConversionType = keyof typeof CONVERSION_LABELS;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Track a Google Ads conversion event.
 *
 * @param type - The conversion event type (purchase, subscription, quote_request, etc.)
 * @param value - Dollar value of the conversion (0 for lead gen events)
 * @param transactionId - Optional order/session ID for deduplication
 * @param currency - Currency code (default: USD)
 */
export function trackConversion(
  type: ConversionType,
  value: number,
  transactionId?: string,
  currency: string = 'USD'
): void {
  if (typeof window === 'undefined' || !window.gtag) return;

  const label = CONVERSION_LABELS[type];

  window.gtag('event', 'conversion', {
    send_to: `${GOOGLE_ADS_CONVERSION_ID}/${label}`,
    value,
    currency,
    transaction_id: transactionId,
  });
}

/**
 * Track a purchase conversion with enhanced conversion data for better attribution.
 */
export function trackPurchaseConversion(params: {
  orderId: string;
  value: number;
  currency?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}): void {
  if (typeof window === 'undefined' || !window.gtag) return;

  // Set enhanced conversion user data if available
  if (params.email) {
    window.gtag('set', 'user_data', {
      email: params.email,
      address: {
        first_name: params.firstName,
        last_name: params.lastName,
      },
    });
  }

  trackConversion('purchase', params.value, params.orderId, params.currency || 'USD');
}

/**
 * Track a subscription conversion (tier upgrade).
 */
export function trackSubscriptionConversion(params: {
  tier: string;
  value: number;
  orderId?: string;
}): void {
  trackConversion('subscription', params.value, params.orderId);
}

/**
 * Track a quote request conversion (corporate/bulk order lead).
 */
export function trackQuoteRequestConversion(inquiryId?: string): void {
  trackConversion('quote_request', 0, inquiryId);
}

/**
 * Server-side conversion tracking via Google Ads API.
 * Used in webhooks where window.gtag is unavailable.
 *
 * Sends conversion data to Google's measurement endpoint.
 */
export async function trackServerSideConversion(params: {
  type: ConversionType;
  value: number;
  transactionId: string;
  currency?: string;
}): Promise<void> {
  const measurementId = process.env.NEXT_PUBLIC_GA_ID;
  const apiSecret = process.env.GA_API_SECRET;

  if (!measurementId || !apiSecret) {
    console.log(`[Google Ads] Server-side conversion tracked (offline): ${params.type} = $${params.value} (txn: ${params.transactionId})`);
    return;
  }

  try {
    const response = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: params.transactionId,
          events: [
            {
              name: params.type === 'purchase' ? 'purchase' : 'generate_lead',
              params: {
                transaction_id: params.transactionId,
                value: params.value,
                currency: params.currency || 'USD',
                conversion_type: params.type,
              },
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      console.error(`[Google Ads] Server-side tracking failed: ${response.status}`);
    }
  } catch (error) {
    console.error('[Google Ads] Server-side tracking error:', error);
  }
}

/**
 * Ad Group Configuration for reference and campaign management.
 */
export const AD_GROUPS = {
  dog_portraits: {
    name: 'Dog Portraits',
    landingPage: '/custom-dog-portraits',
    bidStrategy: 'Target CPA $5',
    keywords: [
      { term: 'custom dog portrait', matchType: 'Exact' },
      { term: 'dog portrait painting', matchType: 'Phrase' },
      { term: 'personalized dog art', matchType: 'Broad' },
    ],
    adCopy: {
      headline1: 'Turn Your Dog\'s Photo Into Art',
      headline2: 'AI-Powered Custom Portraits',
      headline3: 'From $9 | 24-Hour Delivery',
      description1: 'Transform your dog into stunning art. 17 styles including Renaissance, Ghibli & Pixar 3D. Print-ready quality.',
      description2: 'Custom dog portraits from just $9. Upload photo, choose style, get art in 24 hours. 4.9-star rated.',
    },
  },
  cat_portraits: {
    name: 'Cat Portraits',
    landingPage: '/custom-cat-portraits',
    bidStrategy: 'Target CPA $5',
    keywords: [
      { term: 'custom cat portrait', matchType: 'Exact' },
      { term: 'cat portrait artist', matchType: 'Phrase' },
      { term: 'cat painting from photo', matchType: 'Broad' },
    ],
    adCopy: {
      headline1: 'Custom Cat Portraits From $9',
      headline2: 'AI Art From Your Cat\'s Photo',
      headline3: '17 Styles | 24-Hour Delivery',
      description1: 'Your cat as fine art. Persian, Tabby, Siamese - all breeds. Renaissance, Watercolor, Ghibli & more.',
      description2: 'Custom cat portraits in 17 art styles. Upload photo, get museum-quality art in 24 hours. From $9.',
    },
  },
  pet_gifts: {
    name: 'Pet Gifts',
    landingPage: '/pet-portrait-gift',
    bidStrategy: 'Target CPA $5',
    keywords: [
      { term: 'pet memorial gift', matchType: 'Exact' },
      { term: 'pet loss gift', matchType: 'Phrase' },
      { term: 'unique pet gift', matchType: 'Broad' },
    ],
    adCopy: {
      headline1: 'The Perfect Gift for Pet Lovers',
      headline2: 'Custom Pet Portrait Art',
      headline3: 'From $9 | Gift Cards Available',
      description1: 'Personalized pet portraits that make unforgettable gifts. Birthdays, holidays, memorials. 17 styles.',
      description2: 'Unique pet gifts from $9. Custom AI art of any pet. Gift cards available. 24-hour delivery.',
    },
  },
} as const;

/**
 * Campaign configuration for Performance Max.
 */
export const CAMPAIGN_CONFIG = {
  name: 'Pawcasso Atelier - Performance Max',
  type: 'Performance Max',
  dailyBudget: 16.67,
  monthlyBudget: 500,
  targetCountries: ['US', 'CA', 'GB', 'AU'],
  conversionGoals: ['purchase', 'subscription', 'quote_request'],
  bidStrategy: 'Maximize Conversions',
  targetCPA: 5.00,
} as const;
