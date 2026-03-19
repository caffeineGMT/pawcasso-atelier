/**
 * Mobile Checkout Funnel Analytics
 *
 * Instruments every step of the checkout flow with device-aware tracking:
 * view_product → add_to_cart → checkout_form → payment → confirmation
 *
 * Captures mobile-specific signals: device type, viewport, touch vs mouse,
 * connection quality, orientation, scroll depth, form field interactions,
 * time per step, and rage taps.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type InputMethod = 'touch' | 'mouse' | 'unknown';

export enum CheckoutStep {
  VIEW_PRODUCT = 'view_product',
  PHOTO_UPLOAD = 'photo_upload',
  STYLE_SELECTION = 'style_selection',
  TIER_SELECTION = 'tier_selection',
  CHECKOUT_FORM = 'checkout_form',
  PAYMENT_REDIRECT = 'payment_redirect',
  PURCHASE_COMPLETE = 'purchase_complete',
}

export interface DeviceInfo {
  type: DeviceType;
  inputMethod: InputMethod;
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  pixelRatio: number;
  orientation: 'portrait' | 'landscape';
  userAgent: string;
  connectionType: string;
  connectionEffective: string;
  isStandalone: boolean; // PWA
}

export interface StepEvent {
  step: CheckoutStep;
  timestamp: string;
  device: DeviceInfo;
  metadata: Record<string, unknown>;
  timeInPreviousStep: number | null;
  scrollDepth: number;
  interactionCount: number;
}

export interface FormFieldInteraction {
  field: string;
  focusTime: string;
  blurTime: string | null;
  duration: number;
  changed: boolean;
  errorShown: boolean;
}

export interface MobileDropoffSignal {
  type: 'rage_tap' | 'orientation_change' | 'keyboard_dismiss' |
        'slow_connection' | 'viewport_resize' | 'scroll_abandon' |
        'form_error' | 'back_button' | 'long_pause';
  timestamp: string;
  step: CheckoutStep;
  metadata: Record<string, unknown>;
}

// ─── Device Detection ────────────────────────────────────────────────────────

export function getDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined') {
    return {
      type: 'desktop',
      inputMethod: 'unknown',
      screenWidth: 0,
      screenHeight: 0,
      viewportWidth: 0,
      viewportHeight: 0,
      pixelRatio: 1,
      orientation: 'portrait',
      userAgent: '',
      connectionType: 'unknown',
      connectionEffective: 'unknown',
      isStandalone: false,
    };
  }

  const ua = navigator.userAgent;
  const width = window.screen.width;
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  let type: DeviceType = 'desktop';
  if (/iPad|Android(?!.*Mobile)/i.test(ua) || (isTouch && width >= 768 && width < 1024)) {
    type = 'tablet';
  } else if (/Mobile|iPhone|iPod|Android.*Mobile|webOS|BlackBerry/i.test(ua) || (isTouch && width < 768)) {
    type = 'mobile';
  }

  const nav = navigator as Navigator & {
    connection?: { type?: string; effectiveType?: string };
    standalone?: boolean;
  };

  return {
    type,
    inputMethod: isTouch ? 'touch' : 'mouse',
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio || 1,
    orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
    userAgent: ua.substring(0, 200),
    connectionType: nav.connection?.type || 'unknown',
    connectionEffective: nav.connection?.effectiveType || 'unknown',
    isStandalone: nav.standalone || window.matchMedia('(display-mode: standalone)').matches,
  };
}

// ─── Session Management ──────────────────────────────────────────────────────

const FUNNEL_SESSION_KEY = 'checkout_funnel_session';
const FUNNEL_STEPS_KEY = 'checkout_funnel_steps';
const FUNNEL_INTERACTIONS_KEY = 'checkout_funnel_interactions';
const FUNNEL_DROPOFF_KEY = 'checkout_funnel_dropoffs';
const FUNNEL_FIELD_KEY = 'checkout_funnel_fields';

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sessionId = sessionStorage.getItem(FUNNEL_SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(FUNNEL_SESSION_KEY, sessionId);
  }
  return sessionId;
}

function getStoredSteps(): StepEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(sessionStorage.getItem(FUNNEL_STEPS_KEY) || '[]');
  } catch { return []; }
}

function storeStep(event: StepEvent): void {
  if (typeof window === 'undefined') return;
  const steps = getStoredSteps();
  steps.push(event);
  sessionStorage.setItem(FUNNEL_STEPS_KEY, JSON.stringify(steps));
}

// ─── Interaction Counting ────────────────────────────────────────────────────

let interactionCount = 0;
let scrollDepth = 0;

export function resetInteractionTracking(): void {
  interactionCount = 0;
  scrollDepth = 0;
}

export function incrementInteraction(): void {
  interactionCount++;
}

export function updateScrollDepth(): void {
  if (typeof window === 'undefined') return;
  const doc = document.documentElement;
  const scrollTop = window.scrollY || doc.scrollTop;
  const scrollHeight = doc.scrollHeight - doc.clientHeight;
  if (scrollHeight > 0) {
    const depth = Math.round((scrollTop / scrollHeight) * 100);
    if (depth > scrollDepth) scrollDepth = depth;
  }
}

// ─── Step Tracking ───────────────────────────────────────────────────────────

export async function trackCheckoutStep(
  step: CheckoutStep,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  if (typeof window === 'undefined') return;

  const sessionId = getOrCreateSessionId();
  const device = getDeviceInfo();
  const steps = getStoredSteps();

  // Calculate time in previous step
  let timeInPreviousStep: number | null = null;
  if (steps.length > 0) {
    const lastStep = steps[steps.length - 1];
    timeInPreviousStep = Date.now() - new Date(lastStep.timestamp).getTime();
  }

  const event: StepEvent = {
    step,
    timestamp: new Date().toISOString(),
    device,
    metadata: {
      ...metadata,
      pathname: window.location.pathname,
      referrer: document.referrer,
    },
    timeInPreviousStep,
    scrollDepth,
    interactionCount,
  };

  storeStep(event);
  resetInteractionTracking();

  // Fire to backend
  try {
    await fetch('/api/analytics/funnel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        step,
        sessionId,
        timestamp: event.timestamp,
        metadata: {
          ...event.metadata,
          device_type: device.type,
          input_method: device.inputMethod,
          screen_width: device.screenWidth,
          viewport_width: device.viewportWidth,
          viewport_height: device.viewportHeight,
          orientation: device.orientation,
          connection_type: device.connectionType,
          connection_effective: device.connectionEffective,
          pixel_ratio: device.pixelRatio,
          time_in_previous_step_ms: timeInPreviousStep,
          scroll_depth: scrollDepth,
          interaction_count: interactionCount,
          is_standalone: device.isStandalone,
        },
      }),
    });
  } catch {
    // Silent fail
  }

  // Mirror to GA4
  if (window.gtag) {
    window.gtag('event', `checkout_${step}`, {
      device_type: device.type,
      input_method: device.inputMethod,
      viewport_width: device.viewportWidth,
      time_in_previous_step: timeInPreviousStep,
      scroll_depth: scrollDepth,
    });
  }

  // Mirror to Clarity
  if (window.clarity) {
    window.clarity('set', 'checkout_step', step);
    window.clarity('set', 'device_type', device.type);
    window.clarity('event', `checkout_${step}`);
  }
}

// ─── Form Field Tracking ─────────────────────────────────────────────────────

const activeFieldTracking: Map<string, { focusTime: number }> = new Map();

export function trackFieldFocus(fieldName: string): void {
  activeFieldTracking.set(fieldName, { focusTime: Date.now() });
  incrementInteraction();
}

export function trackFieldBlur(fieldName: string, changed: boolean, hasError: boolean): void {
  const tracking = activeFieldTracking.get(fieldName);
  if (!tracking) return;

  const duration = Date.now() - tracking.focusTime;
  activeFieldTracking.delete(fieldName);

  const interaction: FormFieldInteraction = {
    field: fieldName,
    focusTime: new Date(tracking.focusTime).toISOString(),
    blurTime: new Date().toISOString(),
    duration,
    changed,
    errorShown: hasError,
  };

  // Store field interaction
  if (typeof window !== 'undefined') {
    try {
      const fields: FormFieldInteraction[] = JSON.parse(
        sessionStorage.getItem(FUNNEL_FIELD_KEY) || '[]'
      );
      fields.push(interaction);
      // Keep last 50 interactions
      if (fields.length > 50) fields.splice(0, fields.length - 50);
      sessionStorage.setItem(FUNNEL_FIELD_KEY, JSON.stringify(fields));
    } catch { /* silent */ }
  }

  // Track long form field times (possible confusion)
  if (duration > 30000 && window.gtag) {
    window.gtag('event', 'checkout_field_struggle', {
      field: fieldName,
      duration_ms: duration,
      had_error: hasError,
      device_type: getDeviceInfo().type,
    });
  }
}

// ─── Drop-off Signal Detection ───────────────────────────────────────────────

let rageTapCount = 0;
let lastTapTime = 0;
let rageTapTimer: ReturnType<typeof setTimeout> | null = null;

export function detectRageTap(currentStep: CheckoutStep): void {
  const now = Date.now();
  if (now - lastTapTime < 500) {
    rageTapCount++;
    if (rageTapCount >= 3) {
      trackDropoffSignal({
        type: 'rage_tap',
        timestamp: new Date().toISOString(),
        step: currentStep,
        metadata: { tap_count: rageTapCount },
      });
      rageTapCount = 0;
    }
  } else {
    rageTapCount = 1;
  }
  lastTapTime = now;

  if (rageTapTimer) clearTimeout(rageTapTimer);
  rageTapTimer = setTimeout(() => { rageTapCount = 0; }, 1000);
}

export function trackOrientationChange(currentStep: CheckoutStep): void {
  trackDropoffSignal({
    type: 'orientation_change',
    timestamp: new Date().toISOString(),
    step: currentStep,
    metadata: {
      new_orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
    },
  });
}

export function trackViewportResize(currentStep: CheckoutStep): void {
  // Keyboard open/close on mobile causes viewport resize
  const device = getDeviceInfo();
  if (device.type === 'mobile' || device.type === 'tablet') {
    const heightDiff = device.screenHeight - window.innerHeight;
    const keyboardLikelyOpen = heightDiff > 200;
    trackDropoffSignal({
      type: 'viewport_resize',
      timestamp: new Date().toISOString(),
      step: currentStep,
      metadata: {
        viewport_height: window.innerHeight,
        screen_height: device.screenHeight,
        keyboard_likely_open: keyboardLikelyOpen,
        height_diff: heightDiff,
      },
    });
  }
}

export function trackFormError(currentStep: CheckoutStep, field: string, error: string): void {
  trackDropoffSignal({
    type: 'form_error',
    timestamp: new Date().toISOString(),
    step: currentStep,
    metadata: { field, error, device_type: getDeviceInfo().type },
  });
}

export function trackBackButton(currentStep: CheckoutStep, fromStep: number): void {
  trackDropoffSignal({
    type: 'back_button',
    timestamp: new Date().toISOString(),
    step: currentStep,
    metadata: { from_step: fromStep, device_type: getDeviceInfo().type },
  });
}

async function trackDropoffSignal(signal: MobileDropoffSignal): Promise<void> {
  if (typeof window === 'undefined') return;

  // Store locally
  try {
    const signals: MobileDropoffSignal[] = JSON.parse(
      sessionStorage.getItem(FUNNEL_DROPOFF_KEY) || '[]'
    );
    signals.push(signal);
    if (signals.length > 100) signals.splice(0, signals.length - 100);
    sessionStorage.setItem(FUNNEL_DROPOFF_KEY, JSON.stringify(signals));
  } catch { /* silent */ }

  // Send to backend
  try {
    const sessionId = getOrCreateSessionId();
    await fetch('/api/analytics/funnel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        step: `dropoff_${signal.type}`,
        sessionId,
        timestamp: signal.timestamp,
        metadata: {
          ...signal.metadata,
          current_step: signal.step,
          signal_type: signal.type,
        },
      }),
    });
  } catch { /* silent */ }

  // GA4
  if (window.gtag) {
    window.gtag('event', 'checkout_dropoff_signal', {
      signal_type: signal.type,
      checkout_step: signal.step,
      device_type: getDeviceInfo().type,
    });
  }
}

// ─── Funnel Summary ──────────────────────────────────────────────────────────

export interface FunnelSummary {
  sessionId: string;
  steps: StepEvent[];
  dropoffSignals: MobileDropoffSignal[];
  fieldInteractions: FormFieldInteraction[];
  device: DeviceInfo;
  furthestStep: CheckoutStep | null;
  totalTimeMs: number;
  completed: boolean;
}

export function getFunnelSummary(): FunnelSummary {
  const steps = getStoredSteps();
  const device = getDeviceInfo();

  let dropoffSignals: MobileDropoffSignal[] = [];
  let fieldInteractions: FormFieldInteraction[] = [];

  if (typeof window !== 'undefined') {
    try {
      dropoffSignals = JSON.parse(sessionStorage.getItem(FUNNEL_DROPOFF_KEY) || '[]');
      fieldInteractions = JSON.parse(sessionStorage.getItem(FUNNEL_FIELD_KEY) || '[]');
    } catch { /* silent */ }
  }

  const stepOrder = Object.values(CheckoutStep);
  let furthestStep: CheckoutStep | null = null;
  let maxIndex = -1;
  for (const step of steps) {
    const idx = stepOrder.indexOf(step.step);
    if (idx > maxIndex) {
      maxIndex = idx;
      furthestStep = step.step;
    }
  }

  let totalTimeMs = 0;
  if (steps.length >= 2) {
    const first = new Date(steps[0].timestamp).getTime();
    const last = new Date(steps[steps.length - 1].timestamp).getTime();
    totalTimeMs = last - first;
  }

  return {
    sessionId: getOrCreateSessionId(),
    steps,
    dropoffSignals,
    fieldInteractions,
    device,
    furthestStep,
    totalTimeMs,
    completed: furthestStep === CheckoutStep.PURCHASE_COMPLETE,
  };
}

// Note: Window type augmentation for gtag and clarity is defined in analytics.ts and funnel-analytics.ts
