"use client";

import { useReportWebVitals } from "next/web-vitals";
import { useEffect } from "react";

export default function WebVitals() {
  useReportWebVitals((metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log("[Web Vitals]", metric.name, metric.value, metric.rating);
    }

    // Track to analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", metric.name, {
        value: Math.round(
          metric.name === "CLS" ? metric.value * 1000 : metric.value
        ),
        event_category: "Web Vitals",
        event_label: metric.id,
        non_interaction: true,
      });
    }

    // Track to Meta Pixel
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("trackCustom", "WebVitals", {
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
      });
    }

    // Send to custom analytics endpoint for tracking improvements
    fetch("/api/analytics/web-vitals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        id: metric.id,
        navigationType: metric.navigationType,
      }),
    }).catch((err) => {
      // Silent fail - don't block user experience
      console.error("Failed to track web vitals:", err);
    });
  });

  return null;
}

// Extend window interface for TypeScript
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}
