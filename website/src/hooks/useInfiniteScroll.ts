import { useEffect, useRef, useState, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  /** Initial number of items to load */
  initialLoad?: number;
  /** Number of items to load per batch */
  itemsPerPage?: number;
  /** Root margin for IntersectionObserver (triggers loading before reaching bottom) */
  rootMargin?: string;
  /** Threshold for IntersectionObserver */
  threshold?: number;
}

interface UseInfiniteScrollResult<T> {
  /** Currently visible items */
  visibleItems: T[];
  /** Whether more items are being loaded */
  isLoadingMore: boolean;
  /** Whether all items have been loaded */
  hasMore: boolean;
  /** Ref to attach to the "load more" trigger element */
  loadMoreRef: React.RefObject<HTMLDivElement>;
  /** Total number of items loaded so far */
  loadedCount: number;
  /** Manually trigger loading more items */
  loadMore: () => void;
  /** Reset to initial state */
  reset: () => void;
}

/**
 * Custom hook for infinite scroll functionality using IntersectionObserver
 * Optimized for performance with large datasets
 */
export function useInfiniteScroll<T>(
  allItems: T[],
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollResult<T> {
  const {
    initialLoad = 24,
    itemsPerPage = 12,
    rootMargin = '400px',
    threshold = 0.1,
  } = options;

  const [visibleCount, setVisibleCount] = useState(initialLoad);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const visibleItems = allItems.slice(0, visibleCount);
  const hasMore = visibleCount < allItems.length;

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);

    // Simulate slight delay for smooth UX (batched loading)
    requestAnimationFrame(() => {
      setVisibleCount((prev) => Math.min(prev + itemsPerPage, allItems.length));
      setIsLoadingMore(false);
    });
  }, [hasMore, isLoadingMore, itemsPerPage, allItems.length]);

  // Reset function for filter changes
  const reset = useCallback(() => {
    setVisibleCount(initialLoad);
    setIsLoadingMore(false);
  }, [initialLoad]);

  // Set up IntersectionObserver
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore) return;

    const options: IntersectionObserverInit = {
      root: null,
      rootMargin,
      threshold,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        loadMore();
      }
    }, options);

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadMore, rootMargin, threshold]);

  // Reset when total items change (e.g., filters applied)
  useEffect(() => {
    reset();
  }, [allItems.length]);

  return {
    visibleItems,
    isLoadingMore,
    hasMore,
    loadMoreRef,
    loadedCount: visibleCount,
    loadMore,
    reset,
  };
}
