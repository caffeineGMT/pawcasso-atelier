"use client";

import { useState } from "react";
import { PORTRAIT_UPSELL } from "@/lib/stripe";
import { useFocusTrap, useAnnouncer } from "@/lib/accessibility";
import { trackEvent } from "@/lib/analytics";
import Image from "next/image";

interface CheckoutUpsellModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
  petName?: string;
  style?: string;
}

export default function CheckoutUpsellModal({
  isOpen,
  onAccept,
  onDecline,
  petName = "your pet",
  style = "custom art",
}: CheckoutUpsellModalProps) {
  const [isAccepting, setIsAccepting] = useState(false);
  const containerRef = useFocusTrap(isOpen);
  const { announcePolite } = useAnnouncer();

  if (!isOpen) return null;

  const handleAccept = () => {
    setIsAccepting(true);
    announcePolite?.('Adding second portrait to your order...');
    trackEvent('checkout_upsell_accepted', {
      upsell_type: 'second_portrait',
      upsell_price: PORTRAIT_UPSELL.discountedPrice,
      discount_percent: PORTRAIT_UPSELL.discountPercent,
    });
    onAccept();
  };

  const handleDecline = () => {
    announcePolite?.('Continuing with original order...');
    trackEvent('checkout_upsell_declined', {
      upsell_type: 'second_portrait',
      upsell_price: PORTRAIT_UPSELL.discountedPrice,
    });
    onDecline();
  };

  // Handle escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleDecline();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-upsell-title"
      aria-describedby="checkout-upsell-description"
      onKeyDown={handleKeyDown}
    >
      <div
        ref={containerRef as React.RefObject<HTMLDivElement>}
        className="bg-[#0a0a0a] border border-white/[0.12] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header with urgency badge */}
        <div className="relative p-6 md:p-8 border-b border-white/[0.08]">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E07A5F] text-white text-xs font-bold px-6 py-2 rounded-full shadow-lg animate-pulse">
            ⚡ LIMITED TIME OFFER
          </div>

          <div className="text-center mt-4">
            <h2 id="checkout-upsell-title" className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
              Wait! <span className="text-gradient">Double Your Portraits</span>
            </h2>
            <p id="checkout-upsell-description" className="text-text-secondary text-sm md:text-base">
              Get a 2nd portrait of {petName} for just <span className="text-gold font-bold">${PORTRAIT_UPSELL.discountedPrice}</span>
              <span className="text-text-tertiary line-through ml-2">${PORTRAIT_UPSELL.originalPrice}</span>
              <span className="text-[#E07A5F] font-semibold ml-2">({PORTRAIT_UPSELL.discountPercent}% OFF)</span>
            </p>
          </div>
        </div>

        {/* Offer Details */}
        <div className="p-6 md:p-8">
          {/* Visual comparison */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 mb-2">
                <div className="aspect-[4/5] bg-gradient-to-br from-gold/20 to-[#E07A5F]/20 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-4xl">🎨</span>
                </div>
                <p className="text-xs text-text-secondary">Portrait #1</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/[0.03] border border-gold/30 rounded-xl p-4 mb-2 ring-2 ring-gold/20">
                <div className="aspect-[4/5] bg-gradient-to-br from-gold/30 to-[#E07A5F]/30 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-4xl">✨</span>
                </div>
                <p className="text-xs text-gold font-semibold">Portrait #2 - ${PORTRAIT_UPSELL.discountedPrice}</p>
              </div>
            </div>
          </div>

          {/* Value proposition */}
          <div className="bg-gradient-to-br from-gold/10 to-[#E07A5F]/10 border border-gold/20 rounded-xl p-4 md:p-6 mb-6">
            <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Why add a 2nd portrait?
            </h3>
            <ul className="space-y-2">
              {PORTRAIT_UPSELL.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs md:text-sm text-text-secondary">
                  <svg className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Social proof */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-gold to-[#E07A5F] flex items-center justify-center text-white font-bold text-sm">
                87%
              </div>
              <div>
                <p className="text-sm text-text-primary font-medium mb-1">
                  Most customers choose the 2nd portrait
                </p>
                <p className="text-xs text-text-secondary">
                  Perfect for gifting to friends & family, or creating a gallery wall at home
                </p>
              </div>
            </div>
          </div>

          {/* Urgency timer */}
          <div className="text-center mb-6">
            <p className="text-xs text-gold font-semibold animate-pulse" role="timer" aria-live="polite">
              ⏰ This 30% discount is only available now — won&apos;t see it again!
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="p-6 md:p-8 border-t border-white/[0.08] space-y-3">
          <button
            onClick={handleAccept}
            disabled={isAccepting}
            className="w-full py-4 bg-gradient-to-r from-gold to-[#E07A5F] text-black font-bold rounded-full hover:shadow-lg hover:shadow-gold/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
            aria-label={`Yes, add 2nd portrait for $${PORTRAIT_UPSELL.discountedPrice} (${PORTRAIT_UPSELL.discountPercent}% off)`}
          >
            {isAccepting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <>
                YES! Add 2nd Portrait for ${PORTRAIT_UPSELL.discountedPrice}
                <span className="text-xs ml-2 opacity-90">(Save ${PORTRAIT_UPSELL.originalPrice - PORTRAIT_UPSELL.discountedPrice})</span>
              </>
            )}
          </button>

          <button
            onClick={handleDecline}
            disabled={isAccepting}
            className="w-full py-3 text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded-sm"
            aria-label="No thanks, continue with 1 portrait only"
          >
            No thanks, I&apos;ll just get 1 portrait
          </button>
        </div>
      </div>
    </div>
  );
}
