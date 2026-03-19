'use client';

import { useState, useEffect } from 'react';

interface MobileCheckoutBarProps {
  currentStep: number;
  totalSteps: number;
  ctaLabel: string;
  price?: string;
  onCtaClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

/**
 * Sticky bottom CTA bar for mobile checkout.
 * Shows order summary and primary action button.
 * Only visible on mobile devices when scrolled past the main CTA.
 */
export default function MobileCheckoutBar({
  currentStep,
  totalSteps,
  ctaLabel,
  price,
  onCtaClick,
  disabled = false,
  loading = false,
}: MobileCheckoutBarProps) {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setVisible(false);
      return;
    }

    const handleScroll = () => {
      // Show sticky bar when scrolled past 400px (past the initial viewport)
      setVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  if (!isMobile || !visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-white/[0.08] safe-area-bottom"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <div className="px-4 pt-3 flex items-center gap-3">
        {/* Step indicator */}
        <div className="flex-shrink-0">
          <div className="flex gap-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i < currentStep
                    ? 'w-6 bg-gold'
                    : i === currentStep
                    ? 'w-6 bg-gold/50'
                    : 'w-3 bg-white/20'
                }`}
              />
            ))}
          </div>
          {price && (
            <p className="text-xs text-text-secondary mt-1">
              Total: <span className="text-gold font-bold">{price}</span>
            </p>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={onCtaClick}
          disabled={disabled || loading}
          className="flex-1 min-h-[48px] py-3 bg-gold text-black font-bold text-base rounded-full
                     active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed
                     shadow-lg shadow-gold/20"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing...
            </span>
          ) : (
            ctaLabel
          )}
        </button>
      </div>
    </div>
  );
}
