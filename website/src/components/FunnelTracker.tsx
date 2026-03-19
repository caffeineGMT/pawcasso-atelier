'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackFunnelStep, FunnelStep } from '@/lib/funnel-analytics';

/**
 * Automatic funnel tracking for key pages
 * Wrap your app/pages with this component or add manually
 */
export function FunnelTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Map pathnames to funnel steps
    const pathToFunnelStep: Record<string, FunnelStep> = {
      '/': FunnelStep.LANDING,
      '/gallery': FunnelStep.GALLERY,
      '/order': FunnelStep.ORDER_PAGE,
    };

    const step = pathToFunnelStep[pathname];
    if (step) {
      trackFunnelStep(step, {
        pathname,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
      });
    }
  }, [pathname]);

  return null;
}

/**
 * Manual funnel tracking for order flow events
 */
export const trackOrderFunnel = {
  photoUploaded: (metadata?: Record<string, any>) => {
    trackFunnelStep(FunnelStep.PHOTO_UPLOAD, {
      ...metadata,
      timestamp: new Date().toISOString(),
    });
  },

  tierSelected: (tier: string, price: number, metadata?: Record<string, any>) => {
    trackFunnelStep(FunnelStep.TIER_SELECTION, {
      tier,
      price,
      ...metadata,
      timestamp: new Date().toISOString(),
    });
  },

  checkoutInitiated: (tier: string, amount: number, metadata?: Record<string, any>) => {
    trackFunnelStep(FunnelStep.CHECKOUT_INITIATE, {
      tier,
      amount,
      ...metadata,
      timestamp: new Date().toISOString(),
    });
  },

  purchaseCompleted: (orderId: string, amount: number, metadata?: Record<string, any>) => {
    trackFunnelStep(FunnelStep.PURCHASE, {
      orderId,
      amount,
      ...metadata,
      timestamp: new Date().toISOString(),
    });
  },
};
