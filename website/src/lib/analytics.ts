/**
 * Analytics utility for GA4 and Meta Pixel tracking
 * Comprehensive event tracking for Facebook/Instagram retargeting campaigns
 */

// Extend Window interface for gtag and fbq
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Meta Pixel standard event names
 */
export enum MetaEvent {
  PAGE_VIEW = 'PageView',
  VIEW_CONTENT = 'ViewContent',
  SEARCH = 'Search',
  ADD_TO_CART = 'AddToCart',
  ADD_TO_WISHLIST = 'AddToWishlist',
  INITIATE_CHECKOUT = 'InitiateCheckout',
  ADD_PAYMENT_INFO = 'AddPaymentInfo',
  PURCHASE = 'Purchase',
  LEAD = 'Lead',
  COMPLETE_REGISTRATION = 'CompleteRegistration',
}

/**
 * Product/content type for ViewContent events
 */
export enum ContentType {
  PRODUCT = 'product',
  GALLERY = 'product_group',
  ARTWORK = 'product',
}

/**
 * Google Analytics gtag wrapper
 */
export const gtag = (command: string, ...args: any[]): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(command, ...args);
  }
};

/**
 * Track custom event in both GA4 and Meta Pixel
 */
export const trackEvent = (eventName: string, params?: Record<string, any>): void => {
  // Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }

  // Meta Pixel - map GA4 events to Meta standard events
  if (typeof window !== 'undefined' && window.fbq) {
    const metaEventMap: Record<string, string> = {
      'begin_checkout': MetaEvent.INITIATE_CHECKOUT,
      'add_payment_info': MetaEvent.ADD_PAYMENT_INFO,
      'purchase': MetaEvent.PURCHASE,
      'view_gallery': MetaEvent.VIEW_CONTENT,
      'email_capture': MetaEvent.LEAD,
      'upload_photo': MetaEvent.ADD_TO_CART,
    };

    const metaEventName = metaEventMap[eventName] || 'trackCustom';

    if (metaEventName === 'trackCustom') {
      window.fbq('trackCustom', eventName, params);
    } else {
      window.fbq('track', metaEventName, params);
    }
  }
};

/**
 * Track page view in both GA4 and Meta Pixel
 */
export const trackPageView = (url: string): void => {
  // GA4 page view
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
      page_path: url,
    });
  }

  // Meta Pixel page view
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', MetaEvent.PAGE_VIEW);
  }
};

/**
 * Track ViewContent event (for retargeting audiences)
 * Use when user views gallery, specific artwork, or pricing
 */
export const trackViewContent = (params: {
  content_type: ContentType;
  content_ids?: string[];
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
}): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', MetaEvent.VIEW_CONTENT, {
      content_type: params.content_type,
      content_ids: params.content_ids || [],
      content_name: params.content_name,
      content_category: params.content_category,
      value: params.value,
      currency: params.currency || 'USD',
    });
  }

  // Also track in GA4
  gtag('event', 'view_item', {
    items: params.content_ids?.map((id) => ({
      item_id: id,
      item_name: params.content_name,
      item_category: params.content_category,
      price: params.value,
    })),
  });
};

/**
 * Track AddToCart event (triggered when user uploads pet photo)
 * This creates the "add-to-cart abandoners" audience
 */
export const trackAddToCart = (params: {
  content_ids: string[];
  content_name: string;
  content_type: string;
  value: number;
  currency?: string;
}): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', MetaEvent.ADD_TO_CART, {
      content_ids: params.content_ids,
      content_name: params.content_name,
      content_type: params.content_type,
      value: params.value,
      currency: params.currency || 'USD',
    });
  }

  // GA4 equivalent
  gtag('event', 'add_to_cart', {
    currency: params.currency || 'USD',
    value: params.value,
    items: [
      {
        item_id: params.content_ids[0],
        item_name: params.content_name,
        price: params.value,
      },
    ],
  });
};

/**
 * Track Lead event (email capture)
 * Creates "leads" audience for retargeting
 */
export const trackLead = (params?: {
  content_name?: string;
  value?: number;
  currency?: string;
}): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', MetaEvent.LEAD, {
      content_name: params?.content_name || 'Email Signup',
      value: params?.value,
      currency: params?.currency || 'USD',
    });
  }

  // GA4 equivalent
  gtag('event', 'generate_lead', {
    value: params?.value,
    currency: params?.currency || 'USD',
  });
};

/**
 * Track InitiateCheckout event
 * Creates "checkout initiators" audience
 */
export const trackInitiateCheckout = (params: {
  content_ids: string[];
  contents: Array<{ id: string; quantity: number }>;
  value: number;
  currency?: string;
  num_items?: number;
}): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', MetaEvent.INITIATE_CHECKOUT, {
      content_ids: params.content_ids,
      contents: params.contents,
      value: params.value,
      currency: params.currency || 'USD',
      num_items: params.num_items || 1,
    });
  }

  // GA4 equivalent
  gtag('event', 'begin_checkout', {
    currency: params.currency || 'USD',
    value: params.value,
    items: params.contents.map((item) => ({
      item_id: item.id,
      quantity: item.quantity,
    })),
  });
};

/**
 * Track Purchase event with enhanced data
 * Creates "past purchasers" audience for lookalike campaigns
 */
export const trackPurchase = (params: {
  content_ids: string[];
  content_type: string;
  value: number;
  currency?: string;
  transaction_id?: string;
  num_items?: number;
}): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', MetaEvent.PURCHASE, {
      content_ids: params.content_ids,
      content_type: params.content_type,
      value: params.value,
      currency: params.currency || 'USD',
      num_items: params.num_items || 1,
    });
  }

  // GA4 equivalent
  gtag('event', 'purchase', {
    transaction_id: params.transaction_id,
    value: params.value,
    currency: params.currency || 'USD',
    items: params.content_ids.map((id) => ({
      item_id: id,
      quantity: 1,
    })),
  });
};

/**
 * Track Search event (style/animal filters)
 * Helps build interest-based audiences
 */
export const trackSearch = (searchTerm: string): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', MetaEvent.SEARCH, {
      search_string: searchTerm,
    });
  }

  gtag('event', 'search', {
    search_term: searchTerm,
  });
};

/**
 * Track custom engagement events for audience building
 */
export const trackEngagement = (
  action: 'style_preview' | 'photo_upload_start' | 'tier_selection' | 'discount_view' | 'instagram_click' | 'launch_signup' | 'wizard_step_2' | 'wizard_step_3' | 'wizard_back' | 'gift_card_applied',
  metadata?: Record<string, any>
): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', `Engagement_${action}`, metadata);
  }

  gtag('event', action, metadata);
};

/**
 * Set user properties for better audience segmentation
 */
export const setUserProperties = (properties: {
  user_id?: string;
  user_email?: string;
  customer_type?: 'new' | 'returning' | 'vip';
  lifetime_value?: number;
}): void => {
  // Set GA4 user properties
  if (typeof window !== 'undefined' && window.gtag && properties.user_id) {
    window.gtag('set', 'user_properties', {
      customer_type: properties.customer_type,
      lifetime_value: properties.lifetime_value,
    });
  }

  // Advanced matching for Meta Pixel (email hashing handled server-side)
  if (typeof window !== 'undefined' && window.fbq && properties.user_email) {
    // Meta Pixel advanced matching is set via init, not dynamically
    // Store for later server-side API calls
    sessionStorage.setItem('user_email', properties.user_email);
  }
};

/**
 * Track analytics event to database for attribution and conversion tracking
 * Captures UTM params, session data, and revenue
 */
export const trackAnalyticsEvent = async (
  eventName: string,
  metadata?: Record<string, any>,
  revenue = 0
): Promise<void> => {
  if (typeof window === 'undefined') return;

  try {
    // Dynamically import to avoid SSR issues
    const { getStoredUTMParams } = await import('./utm-tracker');
    const utm = getStoredUTMParams();

    // Get or create session ID
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('session_id', sessionId);
    }

    // Get user email if available
    const userId = sessionStorage.getItem('user_email') || null;

    // Track event via API
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName,
        metadata: {
          ...metadata,
          pathname: window.location.pathname,
          referrer: document.referrer,
        },
        revenue,
        sessionId,
        userId,
        utm,
      }),
    });
  } catch (error) {
    console.error('Failed to track analytics event:', error);
    // Silent fail - don't break user experience
  }
};
