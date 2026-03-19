/**
 * Props for GiftCardInput component
 */
export interface GiftCardInputProps {
  /** Gift card code input value */
  giftCardCode: string;
  /** Set gift card code */
  onCodeChange: (code: string) => void;
  /** Whether gift card is valid */
  isValid: boolean;
  /** Gift card balance */
  balance: number | null;
  /** Error message */
  error: string | null;
  /** Loading state */
  loading: boolean;
  /** Whether section is expanded */
  isExpanded: boolean;
  /** Toggle expanded state */
  onToggleExpanded: () => void;
  /** Apply gift card */
  onApply: () => void;
  /** Clear/remove gift card */
  onClear?: () => void;
}

/**
 * Gift card input component with collapsible UI
 *
 * Handles gift card code input, validation, and display
 */
export default function GiftCardInput({
  giftCardCode,
  onCodeChange,
  isValid,
  balance,
  error,
  loading,
  isExpanded,
  onToggleExpanded,
  onApply,
  onClear,
}: GiftCardInputProps) {
  return (
    <div className="border border-white/[0.08] rounded-2xl overflow-hidden bg-white/[0.03]">
      <button
        type="button"
        onClick={onToggleExpanded}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/[0.06] transition-all text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path
                fillRule="evenodd"
                d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-text-primary">Have a gift card?</h3>
            <p className="text-sm text-text-secondary">Apply your gift card code</p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-text-secondary transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6 pt-2 border-t border-white/[0.08]">
          {!isValid ? (
            <>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={giftCardCode}
                  onChange={(e) => onCodeChange(e.target.value.toUpperCase())}
                  placeholder="GIFT-XXXX-XXXX"
                  className="flex-1 bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-base text-text-primary focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-white/20"
                />
                <button
                  type="button"
                  onClick={onApply}
                  disabled={loading || !giftCardCode.trim()}
                  className="px-6 py-3 bg-gold text-black font-semibold rounded-xl hover:bg-gold/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Checking...' : 'Apply'}
                </button>
              </div>
              {error && <p className="text-red-400 text-sm font-medium">{error}</p>}
            </>
          ) : (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-green-400 font-semibold text-sm">Gift card applied!</p>
                    </div>
                    <p className="text-sm text-text-secondary">
                      Code: <span className="font-mono text-text-primary">{giftCardCode}</span>
                    </p>
                    <p className="text-sm text-text-secondary mt-1">
                      Balance: <span className="font-bold text-green-400">${balance?.toFixed(2)}</span>
                    </p>
                  </div>
                  {onClear && (
                    <button
                      type="button"
                      onClick={onClear}
                      className="text-text-secondary hover:text-red-400 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
