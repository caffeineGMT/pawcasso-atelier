"use client";

import { useState, useEffect } from "react";

interface UpsellModalProps {
  sessionId: string;
}

export default function UpsellModal({ sessionId }: UpsellModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    // Check if user has already declined this session's upsell
    const declinedKey = `upsell_declined_${sessionId}`;
    const hasDeclined = localStorage.getItem(declinedKey);

    if (hasDeclined) {
      return;
    }

    // Show modal after 2 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [sessionId]);

  const handleUpsell = async (upsellType: 'print' | 'license') => {
    setLoading(upsellType);

    try {
      const res = await fetch('/api/upsell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, upsellType }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Something went wrong. Please contact us on Instagram.');
        setLoading(null);
      }
    } catch (error) {
      console.error('Upsell error:', error);
      alert('Something went wrong. Please contact us on Instagram.');
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-[#0a0a0a] border border-white/[0.12] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-8 border-b border-white/[0.08]">
          <h2 className="text-3xl font-semibold tracking-tight mb-2">
            Upgrade Your <span className="text-gradient">Order</span>
          </h2>
          <p className="text-text-secondary">
            Add premium options to make the most of your portrait
          </p>
        </div>

        {/* Upsell Cards */}
        <div className="p-8 grid md:grid-cols-2 gap-6">
          {/* Print Package */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 hover:border-gold/40 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-text-primary">Print Package</h3>
                <p className="text-2xl font-bold text-gold mt-2">$19</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2 text-sm text-text-secondary">
                <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                High-resolution TIFF file (print-ready)
              </li>
              <li className="flex items-start gap-2 text-sm text-text-secondary">
                <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Lossless PNG file (6000x7500px)
              </li>
              <li className="flex items-start gap-2 text-sm text-text-secondary">
                <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Print dimensions guide (recommended sizes)
              </li>
              <li className="flex items-start gap-2 text-sm text-text-secondary">
                <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Color profile for professional printing
              </li>
            </ul>

            <button
              onClick={() => handleUpsell('print')}
              disabled={loading !== null}
              className="w-full py-3 bg-gold text-black font-semibold rounded-full hover:bg-gold/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'print' ? 'Processing...' : 'Add to Order'}
            </button>
          </div>

          {/* Commercial License */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 hover:border-gold/40 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-text-primary">Commercial License</h3>
                <p className="text-2xl font-bold text-gold mt-2">$99</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2 text-sm text-text-secondary">
                <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Use in commercial projects
              </li>
              <li className="flex items-start gap-2 text-sm text-text-secondary">
                <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Merchandise & product sales rights
              </li>
              <li className="flex items-start gap-2 text-sm text-text-secondary">
                <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Marketing & advertising usage
              </li>
              <li className="flex items-start gap-2 text-sm text-text-secondary">
                <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Legal usage rights documentation
              </li>
            </ul>

            <button
              onClick={() => handleUpsell('license')}
              disabled={loading !== null}
              className="w-full py-3 bg-gold text-black font-semibold rounded-full hover:bg-gold/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'license' ? 'Processing...' : 'Add to Order'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-white/[0.08] flex justify-center">
          <button
            onClick={handleDecline}
            disabled={loading !== null}
            className="px-6 py-2 text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            No thanks, continue
          </button>
        </div>
      </div>
    </div>
  );
}
