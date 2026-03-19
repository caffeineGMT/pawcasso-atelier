/**
 * Browser Compatibility Utilities
 * Detect browser capabilities and apply polyfills/fallbacks
 */

export const BrowserDetect = {
  /**
   * Detect if running in Safari
   */
  isSafari(): boolean {
    if (typeof window === 'undefined') return false;
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  },

  /**
   * Detect if running in Firefox
   */
  isFirefox(): boolean {
    if (typeof window === 'undefined') return false;
    return /firefox/i.test(navigator.userAgent);
  },

  /**
   * Detect if running on iOS
   */
  isIOS(): boolean {
    if (typeof window === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  },

  /**
   * Detect if running on Android
   */
  isAndroid(): boolean {
    if (typeof window === 'undefined') return false;
    return /android/i.test(navigator.userAgent);
  },

  /**
   * Detect if device has a notch (safe area insets)
   */
  hasNotch(): boolean {
    if (typeof window === 'undefined') return false;
    const iPhone = /iPhone/.test(navigator.userAgent) && !(window as any).MSStream;
    const aspect = window.screen.width / window.screen.height;
    return iPhone && (aspect > 0.5 && aspect < 0.6);
  },

  /**
   * Check if browser supports backdrop-filter
   */
  supportsBackdropFilter(): boolean {
    if (typeof window === 'undefined') return false;
    return CSS.supports('backdrop-filter', 'blur(1px)') ||
           CSS.supports('-webkit-backdrop-filter', 'blur(1px)');
  },

  /**
   * Check if browser supports smooth scrolling
   */
  supportsSmoothScroll(): boolean {
    if (typeof window === 'undefined') return false;
    return 'scrollBehavior' in document.documentElement.style;
  },

  /**
   * Get safe area insets (for notched devices)
   */
  getSafeAreaInsets(): { top: number; bottom: number; left: number; right: number } {
    if (typeof window === 'undefined') {
      return { top: 0, bottom: 0, left: 0, right: 0 };
    }

    const getInset = (position: string): number => {
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue(`env(safe-area-inset-${position})`) || '0px';
      return parseInt(value, 10) || 0;
    };

    return {
      top: getInset('top'),
      bottom: getInset('bottom'),
      left: getInset('left'),
      right: getInset('right'),
    };
  },
};

/**
 * Apply browser-specific fixes on mount
 */
export function applyBrowserFixes(): void {
  if (typeof window === 'undefined') return;

  // Fix for iOS Safari 100vh issue
  if (BrowserDetect.isIOS()) {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
  }

  // Add browser-specific classes to html element
  const html = document.documentElement;
  if (BrowserDetect.isSafari()) html.classList.add('is-safari');
  if (BrowserDetect.isFirefox()) html.classList.add('is-firefox');
  if (BrowserDetect.isIOS()) html.classList.add('is-ios');
  if (BrowserDetect.isAndroid()) html.classList.add('is-android');
  if (BrowserDetect.hasNotch()) html.classList.add('has-notch');
  if (!BrowserDetect.supportsBackdropFilter()) html.classList.add('no-backdrop-filter');
}

/**
 * Smooth scroll polyfill for browsers that don't support it natively
 */
export function smoothScrollTo(targetId: string): void {
  const target = document.getElementById(targetId);
  if (!target) return;

  if (BrowserDetect.supportsSmoothScroll()) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    // Polyfill with requestAnimationFrame
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1000;
    let start: number | null = null;

    function step(timestamp: number) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percentage = Math.min(progress / duration, 1);
      // Easing function (ease-in-out)
      const ease = percentage < 0.5
        ? 2 * percentage * percentage
        : -1 + (4 - 2 * percentage) * percentage;

      window.scrollTo(0, startPosition + distance * ease);

      if (progress < duration) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
  }
}

/**
 * Check if touch events are supported
 */
export function supportsTouchEvents(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Get viewport dimensions (handles iOS viewport bug)
 */
export function getViewportDimensions(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }

  return {
    width: window.innerWidth || document.documentElement.clientWidth,
    height: BrowserDetect.isIOS()
      ? window.innerHeight
      : window.innerHeight || document.documentElement.clientHeight,
  };
}
