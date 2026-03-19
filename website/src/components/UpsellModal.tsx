"use client";

import { useState, useEffect } from "react";
import { PRINT_UPSELL_PRICES, type PrintProductType } from "@/lib/stripe";
import { useFocusTrap, useAnnouncer } from "@/lib/accessibility";

interface UpsellModalProps {
  sessionId: string;
}

export default function UpsellModal({ sessionId }: UpsellModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState<PrintProductType | null>(null);
  const containerRef = useFocusTrap(isOpen);
  const { announcePolite, announceAssertive } = useAnnouncer();

  useEffect(() => {
    // Check if user has already declined this session's upsell
    const declinedKey = `upsell_declined_${sessionId}`;
    const hasDeclined = localStorage.getItem(declinedKey);

    if (hasDeclined) {
      return;
    }

    // Show modal at 3 seconds for digital-only purchases
    const timer = setTimeout(() => {
      setIsOpen(true);
      announcePolite?.('Special offer: Add a print to your order and save 20%');
    }, 3000);

    return () => clearTimeout(timer);
  }, [sessionId, announcePolite]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleDecline();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handlePrintUpsell = async (productType: PrintProductType) => {
    setLoading(productType);
    announcePolite?.(`Adding ${PRINT_UPSELL_PRICES[productType].name} to your order...`);

    try {
      const res = await fetch('/api/checkout/print-upsell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalSessionId: sessionId,
          productType
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        const errorMsg = 'Something went wrong. Please try again.';
        announceAssertive?.(errorMsg);
        alert(errorMsg);
        setLoading(null);
      }
    } catch (error) {
      console.error('Print upsell error:', error);
      const errorMsg = 'Something went wrong. Please try again.';
      announceAssertive?.(errorMsg);
      alert(errorMsg);
      setLoading(null);
    }
  };

  const handleDecline = () => {
    // Store decline in localStorage
    const declinedKey = `upsell_declined_${sessionId}`;
    localStorage.setItem(declinedKey, 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upsell-modal-title"
      aria-describedby="upsell-modal-description"
    >
      <div
        ref={containerRef as React.RefObject<HTMLDivElement>}
        className="bg-[#0a0a0a] border border-white/[0.12] rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-8 border-b border-white/[0.08]">
          <h2 id="upsell-modal-title" className="text-3xl font-semibold tracking-tight mb-2">
            Love Your Portrait? <span className="text-gradient">Get It Printed!</span>
          </h2>
          <p id="upsell-modal-description" className="text-text-secondary">
            Limited time: 20% off all print products for digital buyers
          </p>
        </div>

        {/* Print Product Cards */}
        <div className="p-8 grid md:grid-cols-3 gap-6">
          {/* Framed Print */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 hover:border-gold/40 transition-all relative">
            <div className="absolute top-4 right-4 bg-gold/20 text-gold text-xs font-bold px-3 py-1 rounded-full">
              SAVE $10
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-text-primary">{PRINT_UPSELL_PRICES.framed.name}</h3>
              <div className="flex items-baseline gap-2 mt-2">
                <p className="text-2xl font-bold text-gold">${PRINT_UPSELL_PRICES.framed.discountedPrice}</p>
                <p className="text-sm text-text-secondary line-through">${PRINT_UPSELL_PRICES.framed.originalPrice}</p>
              </div>
              <p className="text-xs text-text-secondary mt-1">{PRINT_UPSELL_PRICES.framed.description}</p>
            </div>

            <ul className="space-y-2 mb-6">
              {PRINT_UPSELL_PRICES.framed.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-text-secondary">
                  <svg className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePrintUpsell('framed')}
              disabled={loading !== null}
              className="w-full py-3 bg-gold text-black font-semibold rounded-full hover:bg-gold/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
              aria-label={`Add ${PRINT_UPSELL_PRICES.framed.name} for $${PRINT_UPSELL_PRICES.framed.discountedPrice}`}
            >
              {loading === 'framed' ? 'Processing...' : 'Add Framed Print'}
            </button>
          </div>

          {/* Canvas Wrap */}
          <div className="bg-white/[0.03] border border-gold/30 rounded-xl p-6 hover:border-gold/50 transition-all relative ring-2 ring-gold/20">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-black text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
              MOST POPULAR
            </div>
            <div className="absolute top-4 right-4 bg-gold/20 text-gold text-xs font-bold px-3 py-1 rounded-full">
              SAVE $20
            </div>
            <div className="mb-4 mt-2">
              <h3 className="text-xl font-semibold text-text-primary">{PRINT_UPSELL_PRICES.canvas.name}</h3>
              <div className="flex items-baseline gap-2 mt-2">
                <p className="text-2xl font-bold text-gold">${PRINT_UPSELL_PRICES.canvas.discountedPrice}</p>
                <p className="text-sm text-text-secondary line-through">${PRINT_UPSELL_PRICES.canvas.originalPrice}</p>
              </div>
              <p className="text-xs text-text-secondary mt-1">{PRINT_UPSELL_PRICES.canvas.description}</p>
            </div>

            <ul className="space-y-2 mb-6">
              {PRINT_UPSELL_PRICES.canvas.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-text-secondary">
                  <svg className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePrintUpsell('canvas')}
              disabled={loading !== null}
              className="w-full py-3 bg-gold text-black font-semibold rounded-full hover:bg-gold/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
              aria-label={`Add ${PRINT_UPSELL_PRICES.canvas.name} for $${PRINT_UPSELL_PRICES.canvas.discountedPrice} - Most popular`}
            >
              {loading === 'canvas' ? 'Processing...' : 'Add Canvas Wrap'}
            </button>
          </div>

          {/* Metal Print */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 hover:border-gold/40 transition-all relative">
            <div className="absolute top-4 right-4 bg-gold/20 text-gold text-xs font-bold px-3 py-1 rounded-full">
              SAVE $30
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-text-primary">{PRINT_UPSELL_PRICES.metal.name}</h3>
              <div className="flex items-baseline gap-2 mt-2">
                <p className="text-2xl font-bold text-gold">${PRINT_UPSELL_PRICES.metal.discountedPrice}</p>
                <p className="text-sm text-text-secondary line-through">${PRINT_UPSELL_PRICES.metal.originalPrice}</p>
              </div>
              <p className="text-xs text-text-secondary mt-1">{PRINT_UPSELL_PRICES.metal.description}</p>
            </div>

            <ul className="space-y-2 mb-6">
              {PRINT_UPSELL_PRICES.metal.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-text-secondary">
                  <svg className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePrintUpsell('metal')}
              disabled={loading !== null}
              className="w-full py-3 bg-gold text-black font-semibold rounded-full hover:bg-gold/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
              aria-label={`Add ${PRINT_UPSELL_PRICES.metal.name} for $${PRINT_UPSELL_PRICES.metal.discountedPrice}`}
            >
              {loading === 'metal' ? 'Processing...' : 'Add Metal Print'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-white/[0.08] flex flex-col items-center gap-2">
          <p className="text-xs text-gold font-semibold" role="timer" aria-live="polite">
            ⏰ Limited time: 20% off expires in 10 minutes
          </p>
          <button
            onClick={handleDecline}
            disabled={loading !== null}
            className="px-6 py-2 text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded-sm"
            aria-label="Decline print offer and keep digital only"
          >
            No thanks, I&apos;ll keep digital only
          </button>
        </div>
      </div>
    </div>
  );
}
