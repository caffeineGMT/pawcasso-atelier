"use client";

import { useEffect } from "react";
import { trackEvent, trackAnalyticsEvent } from "@/lib/analytics";
import { trackCheckoutStep, CheckoutStep, getFunnelSummary } from "@/lib/checkout-funnel";

interface SuccessPageTrackerProps {
  amount: string;
  tier?: string;
  sessionId?: string;
}

export default function SuccessPageTracker({ amount, tier, sessionId }: SuccessPageTrackerProps) {
  useEffect(() => {
    // Track purchase event with GA4 and Meta Pixel
    trackEvent('purchase', {
      value: parseFloat(amount),
      currency: 'USD',
      tier: tier || 'basic',
    });

    // Track purchase_complete for conversion funnel analytics
    trackAnalyticsEvent('purchase_complete', {
      order_id: sessionId,
      tier: tier || 'basic',
    }, parseFloat(amount));

    // Track checkout funnel: purchase complete
    trackCheckoutStep(CheckoutStep.PURCHASE_COMPLETE, {
      order_id: sessionId,
      amount: parseFloat(amount),
      tier: tier || 'basic',
    });

    // Send full funnel summary for analysis
    const summary = getFunnelSummary();
    if (summary.steps.length > 0) {
      fetch('/api/analytics/funnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: 'funnel_complete',
          sessionId: summary.sessionId,
          timestamp: new Date().toISOString(),
          metadata: {
            total_steps: summary.steps.length,
            total_time_ms: summary.totalTimeMs,
            device_type: summary.device.type,
            input_method: summary.device.inputMethod,
            viewport_width: summary.device.viewportWidth,
            connection_effective: summary.device.connectionEffective,
            dropoff_signals: summary.dropoffSignals.length,
            field_interactions: summary.fieldInteractions.length,
            amount: parseFloat(amount),
            tier: tier || 'basic',
          },
        }),
      }).catch(() => { /* silent */ });
    }
  }, [amount, tier, sessionId]);

  return null;
}
