/**
 * Funnel Analytics - Track conversion funnel steps and drop-off rates
 *
 * Conversion Funnel:
 * 1. Landing Page View → 2. Gallery View → 3. Order Page View →
 * 4. Photo Upload → 5. Tier Selection → 6. Checkout → 7. Purchase
 */

export enum FunnelStep {
  LANDING = 'landing',
  GALLERY = 'gallery',
  ORDER_PAGE = 'order_page',
  PHOTO_UPLOAD = 'photo_upload',
  TIER_SELECTION = 'tier_selection',
  CHECKOUT_INITIATE = 'checkout_initiate',
  PURCHASE = 'purchase',
}

export interface FunnelEvent {
  step: FunnelStep;
  sessionId: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Track funnel progression through each step
 */
export const trackFunnelStep = async (
  step: FunnelStep,
  metadata?: Record<string, any>
): Promise<void> => {
  if (typeof window === 'undefined') return;

  try {
    // Get or create session ID
    let sessionId = sessionStorage.getItem('funnel_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('funnel_session_id', sessionId);
      sessionStorage.setItem('funnel_start_time', new Date().toISOString());
    }

    // Store funnel step in session
    const funnelSteps = JSON.parse(sessionStorage.getItem('funnel_steps') || '[]');
    funnelSteps.push({
      step,
      timestamp: new Date().toISOString(),
      metadata,
    });
    sessionStorage.setItem('funnel_steps', JSON.stringify(funnelSteps));

    // Track to backend for analytics
    await fetch('/api/analytics/funnel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        step,
        sessionId,
        timestamp: new Date().toISOString(),
        metadata,
      }),
    });

    // Also track in Microsoft Clarity as custom tags
    if (window.clarity) {
      window.clarity('set', 'funnel_step', step);
      window.clarity('event', `funnel_${step}`);
    }

    // Track in GA4 for cross-reference
    if (window.gtag) {
      window.gtag('event', 'funnel_progression', {
        funnel_step: step,
        step_index: Object.values(FunnelStep).indexOf(step),
      });
    }
  } catch (error) {
    console.error('Failed to track funnel step:', error);
    // Silent fail
  }
};

/**
 * Calculate time spent in current funnel step
 */
export const getFunnelStepDuration = (step: FunnelStep): number | null => {
  if (typeof window === 'undefined') return null;

  try {
    const funnelSteps = JSON.parse(sessionStorage.getItem('funnel_steps') || '[]');
    const currentStepIndex = funnelSteps.findIndex((s: any) => s.step === step);

    if (currentStepIndex === -1) return null;

    const currentStep = funnelSteps[currentStepIndex];
    const nextStep = funnelSteps[currentStepIndex + 1];

    if (!nextStep) {
      // Current step is still active
      const now = new Date().getTime();
      const stepStart = new Date(currentStep.timestamp).getTime();
      return now - stepStart;
    }

    const stepStart = new Date(currentStep.timestamp).getTime();
    const stepEnd = new Date(nextStep.timestamp).getTime();
    return stepEnd - stepStart;
  } catch {
    return null;
  }
};

/**
 * Get all funnel steps for current session
 */
export const getFunnelHistory = (): FunnelEvent[] => {
  if (typeof window === 'undefined') return [];

  try {
    return JSON.parse(sessionStorage.getItem('funnel_steps') || '[]');
  } catch {
    return [];
  }
};

/**
 * Check if user has completed a specific funnel step
 */
export const hasCompletedStep = (step: FunnelStep): boolean => {
  const history = getFunnelHistory();
  return history.some((event) => event.step === step);
};

/**
 * Get furthest step reached in funnel
 */
export const getFurthestStep = (): FunnelStep | null => {
  const history = getFunnelHistory();
  if (history.length === 0) return null;

  const stepOrder = Object.values(FunnelStep);
  const stepIndices = history.map((event) => stepOrder.indexOf(event.step as FunnelStep));
  const maxIndex = Math.max(...stepIndices);

  return stepOrder[maxIndex];
};

/**
 * Extend Window interface for Clarity
 */
declare global {
  interface Window {
    clarity?: (command: string, ...args: unknown[]) => void;
  }
}
