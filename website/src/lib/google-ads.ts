/**
 * Google Ads Conversion Tracking & Enhanced Conversions
 *
 * This module handles Google Ads conversion tracking with enhanced conversions
 * for better attribution and performance measurement.
 */

// Google Ads Conversion IDs and Labels (replace with your actual values)
export const GOOGLE_ADS_CONFIG = {
  conversionId: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID || 'AW-XXXXXXXXXX',
  conversionLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL || 'XXXXXXXXXXXX',

  // Conversion labels for different events
  labels: {
    purchase: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_PURCHASE || 'purchase_label',
    addToCart: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_ADD_TO_CART || 'add_to_cart_label',
    beginCheckout: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_BEGIN_CHECKOUT || 'begin_checkout_label',
    pageView: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_PAGE_VIEW || 'page_view_label',
  }
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Initialize Google Ads tracking
 */
export const initGoogleAds = () => {
  if (typeof window === 'undefined' || !GOOGLE_ADS_CONFIG.conversionId) return;

  // gtag is loaded via Script component in layout
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer?.push(arguments);
  };
};

/**
 * Track a conversion event
 */
export const trackConversion = (
  conversionLabel: string,
  value?: number,
  currency: string = 'USD',
  transactionId?: string
) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'conversion', {
    send_to: `${GOOGLE_ADS_CONFIG.conversionId}/${conversionLabel}`,
    value: value,
    currency: currency,
    transaction_id: transactionId,
  });
};

/**
 * Track a purchase conversion with enhanced conversion data
 */
export const trackPurchase = (params: {
  orderId: string;
  value: number;
  currency?: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  street?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
}) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  const {
    orderId,
    value,
    currency = 'USD',
    email,
    phone,
    firstName,
    lastName,
    street,
    city,
    region,
    postalCode,
    country,
  } = params;

  // Standard conversion tracking
  trackConversion(GOOGLE_ADS_CONFIG.labels.purchase, value, currency, orderId);

  // Enhanced conversion data (improves attribution)
  if (email) {
    window.gtag('set', 'user_data', {
      email: email,
      phone_number: phone,
      address: {
        first_name: firstName,
        last_name: lastName,
        street: street,
        city: city,
        region: region,
        postal_code: postalCode,
        country: country,
      }
    });
  }
};

/**
 * Track add to cart event
 */
export const trackAddToCartAds = (params: {
  value: number;
  currency?: string;
  items?: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  trackConversion(
    GOOGLE_ADS_CONFIG.labels.addToCart,
    params.value,
    params.currency || 'USD'
  );
};

/**
 * Track begin checkout event
 */
export const trackBeginCheckoutAds = (params: {
  value: number;
  currency?: string;
  items?: Array<{
    id: string;
    quantity: number;
  }>;
}) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  trackConversion(
    GOOGLE_ADS_CONFIG.labels.beginCheckout,
    params.value,
    params.currency || 'USD'
  );
};

/**
 * Track page view for remarketing
 */
export const trackPageViewAds = (params?: {
  pageType?: 'home' | 'product' | 'cart' | 'checkout' | 'purchase' | 'other';
  value?: number;
}) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'page_view', {
    send_to: GOOGLE_ADS_CONFIG.conversionId,
    ecomm_pagetype: params?.pageType || 'other',
    ecomm_totalvalue: params?.value,
  });
};

/**
 * Track dynamic remarketing events
 * Used for creating custom audiences and showing relevant ads
 */
export const trackDynamicRemarketing = (params: {
  event: 'view_item' | 'add_to_cart' | 'purchase' | 'view_item_list';
  value?: number;
  items: Array<{
    id: string;
    google_business_vertical?: 'retail' | 'education' | 'flights' | 'hotels' | 'jobs' | 'local' | 'real_estate' | 'travel' | 'custom';
  }>;
}) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', params.event, {
    send_to: GOOGLE_ADS_CONFIG.conversionId,
    value: params.value,
    items: params.items,
  });
};
