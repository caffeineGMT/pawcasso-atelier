/**
 * Accessibility Utilities for WCAG 2.1 AA Compliance
 *
 * This module provides utilities for:
 * - Focus management
 * - Keyboard navigation
 * - ARIA live regions
 * - Focus trapping for modals
 */

import { useEffect, useRef, useCallback } from 'react';

/**
 * Focus trap hook for modals and dialogs
 * Traps focus within a container element for keyboard accessibility
 */
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;

    // Store the currently focused element to restore later
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Get all focusable elements within the container
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus the first element when trap activates
    firstElement.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);

    return () => {
      container.removeEventListener('keydown', handleTabKey);

      // Restore focus to the previously focused element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isActive]);

  return containerRef;
}

/**
 * Keyboard navigation handler
 * Provides standardized keyboard event handling
 */
export function useKeyboardHandler(handlers: {
  onEscape?: () => void;
  onEnter?: () => void;
  onSpace?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onHome?: () => void;
  onEnd?: () => void;
}) {
  return useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        handlers.onEscape?.();
        break;
      case 'Enter':
        handlers.onEnter?.();
        break;
      case ' ':
        e.preventDefault(); // Prevent page scroll
        handlers.onSpace?.();
        break;
      case 'ArrowUp':
        e.preventDefault();
        handlers.onArrowUp?.();
        break;
      case 'ArrowDown':
        e.preventDefault();
        handlers.onArrowDown?.();
        break;
      case 'ArrowLeft':
        handlers.onArrowLeft?.();
        break;
      case 'ArrowRight':
        handlers.onArrowRight?.();
        break;
      case 'Home':
        e.preventDefault();
        handlers.onHome?.();
        break;
      case 'End':
        e.preventDefault();
        handlers.onEnd?.();
        break;
    }
  }, [handlers]);
}

/**
 * Live region announcer for screen readers
 * Creates and manages ARIA live regions for dynamic content updates
 */
export class LiveRegionAnnouncer {
  private static instance: LiveRegionAnnouncer;
  private politeRegion: HTMLDivElement | null = null;
  private assertiveRegion: HTMLDivElement | null = null;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.createRegions();
    }
  }

  static getInstance(): LiveRegionAnnouncer {
    if (!LiveRegionAnnouncer.instance) {
      LiveRegionAnnouncer.instance = new LiveRegionAnnouncer();
    }
    return LiveRegionAnnouncer.instance;
  }

  private createRegions() {
    // Polite announcements (non-urgent)
    this.politeRegion = document.createElement('div');
    this.politeRegion.setAttribute('aria-live', 'polite');
    this.politeRegion.setAttribute('aria-atomic', 'true');
    this.politeRegion.className = 'sr-only';
    document.body.appendChild(this.politeRegion);

    // Assertive announcements (urgent)
    this.assertiveRegion = document.createElement('div');
    this.assertiveRegion.setAttribute('aria-live', 'assertive');
    this.assertiveRegion.setAttribute('aria-atomic', 'true');
    this.assertiveRegion.className = 'sr-only';
    document.body.appendChild(this.assertiveRegion);
  }

  /**
   * Announce a message to screen readers (polite - waits for pause in speech)
   */
  announcePolite(message: string) {
    if (this.politeRegion) {
      this.politeRegion.textContent = '';
      // Force reflow to ensure announcement
      void this.politeRegion.offsetHeight;
      this.politeRegion.textContent = message;

      // Clear after announcement
      setTimeout(() => {
        if (this.politeRegion) this.politeRegion.textContent = '';
      }, 1000);
    }
  }

  /**
   * Announce a message to screen readers (assertive - interrupts current speech)
   */
  announceAssertive(message: string) {
    if (this.assertiveRegion) {
      this.assertiveRegion.textContent = '';
      void this.assertiveRegion.offsetHeight;
      this.assertiveRegion.textContent = message;

      setTimeout(() => {
        if (this.assertiveRegion) this.assertiveRegion.textContent = '';
      }, 1000);
    }
  }
}

/**
 * Hook to announce messages to screen readers
 */
export function useAnnouncer() {
  const announcer = useRef<LiveRegionAnnouncer | null>(null);

  useEffect(() => {
    announcer.current = LiveRegionAnnouncer.getInstance();
  }, []);

  return {
    announcePolite: (message: string) => announcer.current?.announcePolite(message),
    announceAssertive: (message: string) => announcer.current?.announceAssertive(message),
  };
}

/**
 * Check if color contrast meets WCAG AA standards
 * Returns true if contrast ratio is at least 4.5:1 for normal text
 * or 3:1 for large text (18pt+ or 14pt+ bold)
 */
export function meetsContrastRequirements(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  const requiredRatio = isLargeText ? 3 : 4.5;
  return ratio >= requiredRatio;
}

/**
 * Calculate contrast ratio between two colors
 * Based on WCAG 2.1 formula
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calculate relative luminance of a color
 */
function getRelativeLuminance(color: string): number {
  const rgb = hexToRgb(color);
  if (!rgb) return 0;

  const [r, g, b] = rgb.map((val) => {
    const normalized = val / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Convert hex color to RGB array
 */
function hexToRgb(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null;
}

/**
 * Generate a unique ID for ARIA attributes
 */
let idCounter = 0;
export function generateId(prefix: string = 'a11y'): string {
  return `${prefix}-${++idCounter}`;
}

/**
 * Roving tabindex hook for keyboard navigation in lists/grids
 * Implements the roving tabindex pattern for arrow key navigation
 */
export function useRovingTabIndex(itemCount: number) {
  const [focusedIndex, setFocusedIndex] = React.useState(0);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    let newIndex = index;

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        newIndex = (index + 1) % itemCount;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = index === 0 ? itemCount - 1 : index - 1;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = itemCount - 1;
        break;
      default:
        return;
    }

    setFocusedIndex(newIndex);
    itemRefs.current[newIndex]?.focus();
  }, [itemCount]);

  const getItemProps = (index: number) => ({
    ref: (el: HTMLElement | null) => {
      itemRefs.current[index] = el;
    },
    tabIndex: index === focusedIndex ? 0 : -1,
    onKeyDown: (e: React.KeyboardEvent) => handleKeyDown(e, index),
  });

  return { getItemProps, focusedIndex, setFocusedIndex };
}

// Import React for useRovingTabIndex
import * as React from 'react';
