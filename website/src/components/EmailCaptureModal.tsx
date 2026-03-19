'use client';

import { useState, useEffect } from 'react';
import { trackLead } from '@/lib/analytics';
import { useFocusTrap, useAnnouncer } from '@/lib/accessibility';

const STORAGE_KEY = 'emailCaptured';
const SUPPRESSION_DAYS = 7;
const AUTO_TRIGGER_DELAY = 45000; // 45 seconds

export default function EmailCaptureModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [copied, setCopied] = useState(false);
  const containerRef = useFocusTrap(isOpen);
  const { announcePolite, announceAssertive } = useAnnouncer();

  useEffect(() => {
    // Check if user already captured email within suppression window
    const checkSuppression = () => {
      const capturedTimestamp = localStorage.getItem(STORAGE_KEY);
      if (capturedTimestamp) {
        const daysSince = (Date.now() - parseInt(capturedTimestamp)) / (1000 * 60 * 60 * 24);
        if (daysSince < SUPPRESSION_DAYS) {
          return true; // Suppressed
        }
      }
      return false;
    };

    if (checkSuppression()) {
      return; // Don't show modal
    }

    let hasTriggered = false;

    // Exit-intent detector (desktop)
    const handleMouseLeave = (e: MouseEvent) => {
      if (!hasTriggered && e.clientY <= 0) {
        hasTriggered = true;
        setIsOpen(true);
      }
    };

    // Auto-trigger after 45 seconds
    const autoTriggerTimer = setTimeout(() => {
      if (!hasTriggered) {
        hasTriggered = true;
        setIsOpen(true);
      }
    }, AUTO_TRIGGER_DELAY);

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(autoTriggerTimer);
    };
  }, []);

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      const errorMsg = 'Please enter a valid email address';
      setError(errorMsg);
      announceAssertive?.(errorMsg);
      return;
    }

    setIsSubmitting(true);
    announcePolite?.('Submitting email...');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
        setDiscountCode(data.discountCode || 'FIRST15');
        setSubmitted(true);
        announcePolite?.(`Success! Your discount code ${data.discountCode || 'FIRST15'} has been sent to your email.`);

        // Track Lead event for Meta Pixel (creates "leads" retargeting audience)
        trackLead({
          content_name: 'Email Signup - Exit Intent Modal',
          value: 9, // Estimated lifetime value
          currency: 'USD',
        });

        // Auto-close after 3 seconds
        setTimeout(() => {
          setIsOpen(false);
        }, 3000);
      } else {
        const errorMsg = data.error || 'Something went wrong. Please try again.';
        setError(errorMsg);
        announceAssertive?.(errorMsg);
      }
    } catch (err) {
      const errorMsg = 'Network error. Please check your connection.';
      setError(errorMsg);
      announceAssertive?.(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    setIsOpen(false);
  };

  const handleCopyCode = () => {
    if (discountCode) {
      navigator.clipboard.writeText(discountCode);
      setCopied(true);
      announcePolite?.(`Discount code ${discountCode} copied to clipboard`);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="email-modal-title"
        aria-describedby="email-modal-description"
      >
        {/* Desktop: Centered Modal | Mobile: Bottom Sheet */}
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className="pointer-events-auto w-full max-w-md
                     sm:rounded-2xl sm:animate-scale-in
                     max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:right-0
                     max-sm:rounded-t-3xl max-sm:max-h-[80vh] max-sm:animate-slide-up
                     bg-bg-elevated border border-white/[0.08]
                     p-6 sm:p-10 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center
                       rounded-full hover:bg-white/[0.08] text-white/40 hover:text-white/80
                       transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-bg-elevated"
            aria-label="Close discount modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {!submitted ? (
            // Email capture form
            <form onSubmit={handleSubmit} noValidate>
              <h2 id="email-modal-title" className="text-3xl font-bold text-gradient mb-2">
                Get 15% Off Your First Portrait
              </h2>
              <p id="email-modal-description" className="text-text-secondary mb-6">
                Join our community and get an exclusive discount code sent to your inbox.
              </p>

              <div className="flex gap-2 mb-4">
                <label htmlFor="email-input" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`flex-1 bg-white/[0.06] border rounded-xl px-4 py-3 text-base
                             text-text-primary placeholder:text-text-secondary/50
                             focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-colors
                             ${error ? 'border-red-500 focus:ring-red-500' : 'border-white/[0.08]'}`}
                  disabled={isSubmitting}
                  required
                  aria-invalid={error ? 'true' : 'false'}
                  aria-describedby={error ? 'email-error' : undefined}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gold text-bg px-6 rounded-xl font-semibold
                           hover:bg-gold-light transition-colors disabled:opacity-50
                           disabled:cursor-not-allowed whitespace-nowrap
                           focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-bg-elevated"
                  aria-label={isSubmitting ? 'Sending email...' : 'Get discount code'}
                >
                  {isSubmitting ? 'Sending...' : 'Get Code'}
                </button>
              </div>

              {error && (
                <p id="email-error" className="text-red-500 text-sm mb-4" role="alert">
                  {error}
                </p>
              )}

              <p className="text-xs text-white/40 text-center">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </form>
          ) : (
            // Success state with discount code
            <div className="text-center py-4" role="status" aria-live="polite">
              <div className="mb-6">
                <div className="text-5xl mb-4" role="img" aria-label="Party celebration">🎉</div>
                <h2 id="email-modal-title" className="text-2xl font-bold text-gradient mb-2">
                  Check Your Email!
                </h2>
                <p id="email-modal-description" className="text-text-secondary mb-6">
                  Your discount code has been sent. Use it at checkout:
                </p>
              </div>

              <button
                onClick={handleCopyCode}
                className="group cursor-pointer bg-white/[0.06] border border-white/[0.08]
                         rounded-2xl p-6 hover:bg-white/[0.08] transition-colors w-full
                         focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-bg-elevated"
                aria-label={`Copy discount code ${discountCode}`}
                type="button"
              >
                <div className="text-6xl font-bold text-gradient mb-2 font-mono tracking-tight" aria-hidden="true">
                  {discountCode}
                </div>
                <div className="text-xs text-text-secondary group-hover:text-text-primary transition-colors">
                  {copied ? (
                    <span className="flex items-center justify-center gap-1">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </span>
                  ) : (
                    'Click to copy'
                  )}
                </div>
              </button>

              <p className="text-xs text-white/40 mt-6">
                This modal will close automatically in a moment...
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
