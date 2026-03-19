/**
 * Haptic Feedback Utility for Mobile Interactions
 * Provides vibration feedback for button taps and interactions
 */

type HapticIntensity = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

interface HapticPattern {
  duration?: number;
  pattern?: number[];
}

const HAPTIC_PATTERNS: Record<HapticIntensity, HapticPattern> = {
  light: { duration: 10 },
  medium: { duration: 20 },
  heavy: { duration: 30 },
  success: { pattern: [10, 50, 10] },
  warning: { pattern: [20, 100, 20] },
  error: { pattern: [30, 100, 30, 100, 30] },
};

/**
 * Check if haptic feedback is supported in the current browser
 */
export function isHapticSupported(): boolean {
  return 'vibrate' in navigator;
}

/**
 * Trigger haptic feedback with specified intensity
 * @param intensity - The intensity/type of haptic feedback
 */
export function hapticFeedback(intensity: HapticIntensity = 'light'): void {
  if (!isHapticSupported()) return;

  try {
    const pattern = HAPTIC_PATTERNS[intensity];

    if (pattern.pattern) {
      navigator.vibrate(pattern.pattern);
    } else if (pattern.duration) {
      navigator.vibrate(pattern.duration);
    }
  } catch (error) {
    // Silently fail if haptic feedback fails
    console.debug('Haptic feedback failed:', error);
  }
}

/**
 * Trigger light haptic feedback for button taps
 */
export function hapticTap(): void {
  hapticFeedback('light');
}

/**
 * Trigger medium haptic feedback for significant interactions
 */
export function hapticClick(): void {
  hapticFeedback('medium');
}

/**
 * Trigger success haptic feedback
 */
export function hapticSuccess(): void {
  hapticFeedback('success');
}

/**
 * Trigger error haptic feedback
 */
export function hapticError(): void {
  hapticFeedback('error');
}

/**
 * Trigger warning haptic feedback
 */
export function hapticWarning(): void {
  hapticFeedback('warning');
}

/**
 * Higher-order function to add haptic feedback to click handlers
 * @param handler - Original click handler
 * @param intensity - Haptic intensity
 * @returns Enhanced click handler with haptic feedback
 */
export function withHaptic<T extends (...args: any[]) => any>(
  handler: T,
  intensity: HapticIntensity = 'light'
): T {
  return ((...args: any[]) => {
    hapticFeedback(intensity);
    return handler(...args);
  }) as T;
}
