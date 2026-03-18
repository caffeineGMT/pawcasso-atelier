"use client";

import { useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const badges = [
  {
    icon: '🔒',
    title: 'Secure Checkout',
    subtitle: 'SSL encrypted',
  },
  {
    icon: '✓',
    title: '100% Satisfaction',
    subtitle: 'Free revisions',
  },
  {
    icon: '⚡',
    title: '24hr Delivery',
    subtitle: 'Or your money back',
  },
  {
    icon: '💳',
    title: 'Safe Payment',
    subtitle: 'Stripe powered',
  },
  {
    icon: '🎨',
    title: 'Professional Quality',
    subtitle: '4.9/5 avg rating',
  },
];

export default function TrustBadges() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      dragFree: true,
      containScroll: 'trimSnaps',
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  useEffect(() => {
    if (emblaApi) {
      // Auto-scroll is handled by the Autoplay plugin
    }
  }, [emblaApi]);

  return (
    <div className="trust-badges-container mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-3 sm:gap-4">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[200px] sm:w-[220px] bg-white/[0.03] border border-white/[0.08] rounded-xl px-5 py-4 hover:bg-white/[0.06] hover:border-gold/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl flex-shrink-0">{badge.icon}</div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-text-primary truncate">
                    {badge.title}
                  </div>
                  <div className="text-xs text-text-secondary truncate">
                    {badge.subtitle}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Duplicate badges for seamless infinite scroll */}
          {badges.map((badge, index) => (
            <div
              key={`duplicate-${index}`}
              className="flex-shrink-0 w-[200px] sm:w-[220px] bg-white/[0.03] border border-white/[0.08] rounded-xl px-5 py-4 hover:bg-white/[0.06] hover:border-gold/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl flex-shrink-0">{badge.icon}</div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-text-primary truncate">
                    {badge.title}
                  </div>
                  <div className="text-xs text-text-secondary truncate">
                    {badge.subtitle}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
