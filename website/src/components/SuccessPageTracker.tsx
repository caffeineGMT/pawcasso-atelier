"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

interface SuccessPageTrackerProps {
  amount: string;
  tier?: string;
}

export default function SuccessPageTracker({ amount, tier }: SuccessPageTrackerProps) {
  useEffect(() => {
    // Track purchase event with GA4 and Meta Pixel
    trackEvent('purchase', {
      value: parseFloat(amount),
      currency: 'USD',
      tier: tier || 'basic',
    });
  }, [amount, tier]);

  // This component doesn't render anything
  return null;
}
