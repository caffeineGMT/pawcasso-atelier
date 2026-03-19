import { useEffect, useRef, useState } from 'react';

interface UseLazyImageOptions {
  /** Root margin for IntersectionObserver (loads before image enters viewport) */
  rootMargin?: string;
  /** Threshold for IntersectionObserver */
  threshold?: number;
  /** Whether to load immediately (for above-fold content) */
  eager?: boolean;
}

interface UseLazyImageResult {
  /** Ref to attach to the image container */
  ref: React.RefObject<HTMLDivElement>;
  /** Whether the image should load */
  shouldLoad: boolean;
  /** Whether the image has been loaded */
  isLoaded: boolean;
  /** Callback to mark image as loaded */
  onLoad: () => void;
}

/**
 * Custom hook for optimized lazy loading of images
 * Uses IntersectionObserver to load images only when they're near the viewport
 */
export function useLazyImage(options: UseLazyImageOptions = {}): UseLazyImageResult {
  const {
    rootMargin = '200px',
    threshold = 0.01,
    eager = false,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(eager);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // If eager loading, load immediately
    if (eager) {
      setShouldLoad(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    // Set up IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            // Once we decide to load, we can disconnect
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [eager, rootMargin, threshold]);

  const onLoad = () => {
    setIsLoaded(true);
  };

  return {
    ref,
    shouldLoad,
    isLoaded,
    onLoad,
  };
}
