'use client';

import { useEffect, useRef, useCallback } from 'react';
import {
  CheckoutStep,
  trackCheckoutStep,
  trackFieldFocus,
  trackFieldBlur,
  trackFormError,
  trackBackButton,
  detectRageTap,
  trackOrientationChange,
  trackViewportResize,
  updateScrollDepth,
  incrementInteraction,
  getDeviceInfo,
  getFunnelSummary,
} from '@/lib/checkout-funnel';

interface UseCheckoutFunnelOptions {
  currentStep: number; // Wizard step 1-3
}

/**
 * React hook that auto-instruments the checkout wizard.
 * Attaches scroll, tap, orientation, and resize listeners.
 * Provides helpers for tracking form interactions and step transitions.
 */
export function useCheckoutFunnel({ currentStep }: UseCheckoutFunnelOptions) {
  const stepTrackedRef = useRef<Set<string>>(new Set());
  const previousStepRef = useRef<number>(currentStep);

  // Map wizard step numbers to CheckoutStep enum values
  const getCheckoutStep = useCallback((wizardStep: number): CheckoutStep => {
    switch (wizardStep) {
      case 1: return CheckoutStep.VIEW_PRODUCT;
      case 2: return CheckoutStep.STYLE_SELECTION;
      case 3: return CheckoutStep.CHECKOUT_FORM;
      default: return CheckoutStep.VIEW_PRODUCT;
    }
  }, []);

  // Track wizard step changes
  useEffect(() => {
    const stepKey = `step_${currentStep}`;
    if (!stepTrackedRef.current.has(stepKey)) {
      stepTrackedRef.current.add(stepKey);
      const checkoutStep = getCheckoutStep(currentStep);
      trackCheckoutStep(checkoutStep, { wizard_step: currentStep });
    }

    // Detect back navigation
    if (currentStep < previousStepRef.current) {
      trackBackButton(getCheckoutStep(currentStep), previousStepRef.current);
    }
    previousStepRef.current = currentStep;
  }, [currentStep, getCheckoutStep]);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => updateScrollDepth();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Interaction counting (clicks/taps)
  useEffect(() => {
    const checkoutStep = getCheckoutStep(currentStep);

    const handleClick = () => {
      incrementInteraction();
      detectRageTap(checkoutStep);
    };

    document.addEventListener('click', handleClick, { passive: true });
    return () => document.removeEventListener('click', handleClick);
  }, [currentStep, getCheckoutStep]);

  // Orientation change tracking
  useEffect(() => {
    const checkoutStep = getCheckoutStep(currentStep);
    const handler = () => trackOrientationChange(checkoutStep);

    window.addEventListener('orientationchange', handler);
    return () => window.removeEventListener('orientationchange', handler);
  }, [currentStep, getCheckoutStep]);

  // Viewport resize tracking (keyboard open/close on mobile)
  useEffect(() => {
    const device = getDeviceInfo();
    if (device.type !== 'mobile' && device.type !== 'tablet') return;

    const checkoutStep = getCheckoutStep(currentStep);
    let resizeTimer: ReturnType<typeof setTimeout>;

    const handler = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => trackViewportResize(checkoutStep), 300);
    };

    window.addEventListener('resize', handler, { passive: true });
    return () => {
      window.removeEventListener('resize', handler);
      clearTimeout(resizeTimer);
    };
  }, [currentStep, getCheckoutStep]);

  // ─── Exposed helpers ─────────────────────────────────────────────────────

  const trackField = useCallback((fieldName: string) => ({
    onFocus: () => trackFieldFocus(fieldName),
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      const hasError = e.target.getAttribute('aria-invalid') === 'true';
      trackFieldBlur(fieldName, value.length > 0, hasError);
    },
  }), []);

  const trackStepError = useCallback((field: string, error: string) => {
    trackFormError(getCheckoutStep(currentStep), field, error);
  }, [currentStep, getCheckoutStep]);

  const trackPhotoUpload = useCallback((metadata: Record<string, unknown>) => {
    if (!stepTrackedRef.current.has('photo_upload')) {
      stepTrackedRef.current.add('photo_upload');
      trackCheckoutStep(CheckoutStep.PHOTO_UPLOAD, metadata);
    }
  }, []);

  const trackTierSelection = useCallback((tier: string, price: number) => {
    trackCheckoutStep(CheckoutStep.TIER_SELECTION, { tier, price });
  }, []);

  const trackPaymentRedirect = useCallback((metadata: Record<string, unknown>) => {
    trackCheckoutStep(CheckoutStep.PAYMENT_REDIRECT, metadata);
  }, []);

  const trackPurchaseComplete = useCallback((orderId: string, amount: number, metadata: Record<string, unknown> = {}) => {
    trackCheckoutStep(CheckoutStep.PURCHASE_COMPLETE, {
      order_id: orderId,
      amount,
      ...metadata,
    });
  }, []);

  return {
    trackField,
    trackStepError,
    trackPhotoUpload,
    trackTierSelection,
    trackPaymentRedirect,
    trackPurchaseComplete,
    getFunnelSummary,
    getDeviceInfo,
  };
}
