'use client';

import { useEffect } from 'react';

interface GoogleAdsConversionTrackerProps {
  orderId: string;
  amount: string;
  email?: string;
  tier: string;
}

/**
 * Client component that fires Google Ads purchase conversion on mount
 * Used on order success page to track completed purchases
 */
export default function GoogleAdsConversionTracker({
  orderId,
  amount,
  email,
  tier,
}: GoogleAdsConversionTrackerProps) {
  useEffect(() => {
    // Fire Google Ads conversion tracking
    if (typeof window !== 'undefined' && window.gtag) {
      const conversionId = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID;
      const conversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_PURCHASE;

      if (conversionId && conversionLabel) {
        // Standard conversion event
        window.gtag('event', 'conversion', {
          send_to: `${conversionId}/${conversionLabel}`,
          value: parseFloat(amount),
          currency: 'USD',
          transaction_id: orderId,
        });

        // Enhanced conversion with user data
        if (email) {
          window.gtag('set', 'user_data', {
            email: email,
          });
        }

        // Also send purchase event for Google Analytics
        window.gtag('event', 'purchase', {
          transaction_id: orderId,
          value: parseFloat(amount),
          currency: 'USD',
          items: [
            {
              item_id: `portrait_${tier}`,
              item_name: `AI Pet Portrait - ${tier}`,
              price: parseFloat(amount),
              quantity: 1,
            },
          ],
        });

        console.log('[Google Ads] Purchase conversion tracked:', {
          orderId,
          amount,
          tier,
        });
      }
    }
  }, [orderId, amount, email, tier]);

  return null;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
