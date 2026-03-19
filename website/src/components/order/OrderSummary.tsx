import { type TierConfig } from '@/lib/stripe';

/**
 * Props for OrderSummary component
 */
export interface OrderSummaryProps {
  /** Selected tier configuration */
  selectedTier: TierConfig;
  /** Gift card balance */
  giftCardBalance: number | null;
  /** Whether gift card is valid */
  giftCardValid: boolean;
  /** Discount code */
  discountCode: string | null;
  /** Loading state */
  loading: boolean;
  /** Submit handler */
  onSubmit: () => void;
  /** Social proof count */
  socialProofCount?: number;
}

/**
 * Order summary component with checkout button
 *
 * Displays pricing summary and checkout CTA
 */
export default function OrderSummary({
  selectedTier,
  giftCardBalance,
  giftCardValid,
  discountCode,
  loading,
  onSubmit,
  socialProofCount,
}: OrderSummaryProps) {
  // Calculate final price
  const basePrice = selectedTier.price;
  const giftCardDiscount = giftCardValid && giftCardBalance ? Math.min(giftCardBalance, basePrice) : 0;
  const finalPrice = Math.max(0, basePrice - giftCardDiscount);

  return (
    <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-6 sticky top-24">
      <h3 className="text-xl font-bold text-text-primary">Order Summary</h3>

      {/* Price Breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between text-base">
          <span className="text-text-secondary">{selectedTier.name}</span>
          <span className="text-text-primary font-semibold">${basePrice.toFixed(2)}</span>
        </div>

        {giftCardValid && giftCardBalance && giftCardBalance > 0 && (
          <div className="flex justify-between text-base">
            <span className="text-green-400">Gift Card</span>
            <span className="text-green-400 font-semibold">-${giftCardDiscount.toFixed(2)}</span>
          </div>
        )}

        {discountCode && (
          <div className="flex justify-between text-base">
            <span className="text-purple-400">Discount Code</span>
            <span className="text-purple-400 font-semibold">Applied</span>
          </div>
        )}

        <div className="h-px bg-white/[0.08]" />

        <div className="flex justify-between text-lg">
          <span className="text-text-primary font-bold">Total</span>
          <span className="text-gold font-bold text-2xl">${finalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className="w-full bg-gradient-to-r from-gold to-gold/80 text-black font-bold py-5 px-8 rounded-2xl text-lg shadow-lg shadow-gold/20 hover:shadow-gold/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </span>
        ) : (
          'Continue to Payment →'
        )}
      </button>

      {/* Trust Signals */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>Secure payment with Stripe</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span>100% satisfaction guarantee</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          <span>24-hour delivery</span>
        </div>

        {socialProofCount && (
          <div className="pt-4 border-t border-white/[0.08]">
            <p className="text-sm text-text-secondary text-center">
              <span className="text-gold font-semibold">{socialProofCount.toLocaleString()}+</span> portraits created
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
