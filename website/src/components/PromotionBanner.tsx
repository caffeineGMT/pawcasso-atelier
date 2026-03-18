"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getActivePromotion, type Promotion } from "@/lib/promotions";

export default function PromotionBanner() {
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const activePromo = getActivePromotion();
    if (activePromo) {
      // Check if user has dismissed this specific promotion
      const dismissKey = `promo_dismissed_${activePromo.id}`;
      const wasDismissed = localStorage.getItem(dismissKey) === 'true';

      if (!wasDismissed) {
        setPromotion(activePromo);
      }
    }
  }, []);

  const handleDismiss = () => {
    if (promotion) {
      const dismissKey = `promo_dismissed_${promotion.id}`;
      localStorage.setItem(dismissKey, 'true');
      setIsDismissed(true);
    }
  };

  // Don't render anything if no promotion or dismissed
  if (!promotion || isDismissed) {
    return null;
  }

  const linkHref = promotion.bundleSlug
    ? `/bundles/${promotion.bundleSlug}`
    : `/order?code=${promotion.couponCode}`;

  return (
    <div
      className="relative bg-gradient-to-r from-black via-background-elevated to-black border-b border-white/[0.08]"
      style={{
        background: `linear-gradient(90deg, ${promotion.theme.accentColor}15 0%, ${promotion.theme.primaryColor}25 50%, ${promotion.theme.accentColor}15 100%)`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3 flex items-center justify-between gap-4">
          {/* Banner Content */}
          <div className="flex-1 flex items-center justify-center gap-3 min-w-0">
            <span className="text-2xl flex-shrink-0" aria-hidden="true">
              {promotion.theme.emoji}
            </span>
            <p className="text-sm sm:text-base text-text-primary font-medium text-center truncate sm:whitespace-normal">
              {promotion.bannerText}
            </p>
          </div>

          {/* CTA Button */}
          <Link
            href={linkHref}
            className="flex-shrink-0 px-4 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-white/90 transition-all whitespace-nowrap"
            style={{
              backgroundColor: promotion.theme.primaryColor,
              color: '#000000',
            }}
          >
            {promotion.ctaText}
          </Link>

          {/* Dismiss Button */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 text-white/40 hover:text-white/80 transition-colors"
            aria-label="Dismiss promotion"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
