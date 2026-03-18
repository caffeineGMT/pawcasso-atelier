/**
 * Analytics utility for GA4 and Meta Pixel tracking
 */

// Extend Window interface for gtag and fbq
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    dataLayer?: any[];
  }
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
      'begin_checkout': 'InitiateCheckout',
      'add_payment_info': 'AddPaymentInfo',
      'purchase': 'Purchase',
      'view_gallery': 'ViewContent',
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
    window.fbq('track', 'PageView');
  }
};
