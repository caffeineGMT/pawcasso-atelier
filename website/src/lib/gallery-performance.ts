/**
 * Performance monitoring utilities for gallery loading
 */

export interface PerformanceMetrics {
  /** Time to First Contentful Paint */
  fcp?: number;
  /** Time to Largest Contentful Paint */
  lcp?: number;
  /** First Input Delay */
  fid?: number;
  /** Cumulative Layout Shift */
  cls?: number;
  /** Time to Interactive */
  tti?: number;
  /** Custom: Gallery First Paint (time to render skeleton) */
  galleryFirstPaint?: number;
  /** Custom: Gallery Images Loaded (time until first 6 images loaded) */
  galleryImagesLoaded?: number;
  /** Custom: Total Images Count */
  totalImages?: number;
}

interface PerformanceObserverCallback {
  (metrics: PerformanceMetrics): void;
}

/**
 * Monitor Core Web Vitals and custom gallery performance metrics
 */
export class GalleryPerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private callbacks: PerformanceObserverCallback[] = [];
  private startTime: number;
  private observer: PerformanceObserver | null = null;

  constructor() {
    this.startTime = performance.now();
    this.initObservers();
  }

  private initObservers() {
    if (typeof window === 'undefined') return;

    try {
      // Observe paint metrics
      this.observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.entryType === 'paint') {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.fcp = entry.startTime;
              this.notifyCallbacks();
            }
          }

          if (entry.entryType === 'largest-contentful-paint') {
            this.metrics.lcp = entry.startTime;
            this.notifyCallbacks();
          }

          if (entry.entryType === 'first-input') {
            this.metrics.fid = (entry as any).processingStart - entry.startTime;
            this.notifyCallbacks();
          }

          if (entry.entryType === 'layout-shift') {
            if (!(entry as any).hadRecentInput) {
              this.metrics.cls = (this.metrics.cls || 0) + (entry as any).value;
              this.notifyCallbacks();
            }
          }
        }
      });

      this.observer.observe({
        entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift']
      });
    } catch (e) {
      console.warn('Performance Observer not supported:', e);
    }
  }

  /**
   * Mark gallery first paint (skeleton rendered)
   */
  markGalleryFirstPaint() {
    this.metrics.galleryFirstPaint = performance.now() - this.startTime;
    this.notifyCallbacks();
  }

  /**
   * Mark gallery images loaded (first batch of images rendered)
   */
  markGalleryImagesLoaded(count: number) {
    this.metrics.galleryImagesLoaded = performance.now() - this.startTime;
    this.metrics.totalImages = count;
    this.notifyCallbacks();
  }

  /**
   * Subscribe to performance metric updates
   */
  subscribe(callback: PerformanceObserverCallback) {
    this.callbacks.push(callback);
    // Immediately call with current metrics
    callback(this.metrics);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Get current metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Log metrics to console (development only)
   */
  logMetrics() {
    if (process.env.NODE_ENV === 'development') {
      console.table(this.metrics);
    }
  }

  /**
   * Send metrics to analytics
   */
  sendToAnalytics() {
    if (typeof window === 'undefined') return;

    // Send to analytics service (Google Analytics, etc.)
    if ((window as any).gtag) {
      Object.entries(this.metrics).forEach(([key, value]) => {
        if (value !== undefined) {
          (window as any).gtag('event', 'performance_metric', {
            metric_name: key,
            metric_value: Math.round(value),
            page_path: '/gallery',
          });
        }
      });
    }
  }

  private notifyCallbacks() {
    this.callbacks.forEach(cb => cb(this.metrics));
  }

  /**
   * Cleanup observers
   */
  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

/**
 * Hook for using performance monitoring in React components
 */
export function useGalleryPerformance() {
  if (typeof window === 'undefined') {
    return {
      monitor: null,
      markGalleryFirstPaint: () => {},
      markGalleryImagesLoaded: () => {},
    };
  }

  const monitor = new GalleryPerformanceMonitor();

  return {
    monitor,
    markGalleryFirstPaint: () => monitor.markGalleryFirstPaint(),
    markGalleryImagesLoaded: (count: number) => monitor.markGalleryImagesLoaded(count),
  };
}
