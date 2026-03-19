import { useState } from 'react';

/**
 * State and handlers for gift card functionality
 */
export interface UseGiftCardReturn {
  /** Gift card code input value */
  giftCardCode: string;
  /** Gift card balance in dollars */
  giftCardBalance: number | null;
  /** Whether gift card is valid */
  giftCardValid: boolean;
  /** Gift card error message */
  giftCardError: string | null;
  /** Whether validation is in progress */
  giftCardLoading: boolean;
  /** Whether gift card section is expanded */
  giftCardExpanded: boolean;
  /** Set gift card code */
  setGiftCardCode: (code: string) => void;
  /** Toggle expanded state */
  setGiftCardExpanded: (expanded: boolean) => void;
  /** Apply/validate gift card */
  handleGiftCardApply: () => Promise<void>;
  /** Reset gift card state */
  resetGiftCard: () => void;
}

/**
 * Custom hook for handling gift card validation and state
 *
 * @param validationEndpoint - API endpoint for validating gift cards
 * @param onSuccess - Optional callback when gift card is successfully applied
 *
 * @example
 * ```tsx
 * const {
 *   giftCardCode,
 *   giftCardBalance,
 *   handleGiftCardApply
 * } = useGiftCard('/api/gift/validate', (balance) => {
 *   console.log(`Applied $${balance} gift card`);
 * });
 * ```
 */
export function useGiftCard(
  validationEndpoint: string = '/api/gift/validate',
  onSuccess?: (balance: number) => void
): UseGiftCardReturn {
  const [giftCardExpanded, setGiftCardExpanded] = useState(false);
  const [giftCardCode, setGiftCardCode] = useState("");
  const [giftCardBalance, setGiftCardBalance] = useState<number | null>(null);
  const [giftCardValid, setGiftCardValid] = useState(false);
  const [giftCardError, setGiftCardError] = useState<string | null>(null);
  const [giftCardLoading, setGiftCardLoading] = useState(false);

  /**
   * Validates and applies the gift card
   */
  const handleGiftCardApply = async (): Promise<void> => {
    if (!giftCardCode.trim()) {
      setGiftCardError("Please enter a gift card code");
      return;
    }

    setGiftCardLoading(true);
    setGiftCardError(null);

    try {
      const res = await fetch(`${validationEndpoint}?code=${encodeURIComponent(giftCardCode.trim())}`);
      const data = await res.json();

      if (data.valid) {
        setGiftCardBalance(data.balance);
        setGiftCardValid(true);
        setGiftCardError(null);
        onSuccess?.(data.balance);
      } else {
        setGiftCardBalance(null);
        setGiftCardValid(false);
        setGiftCardError(data.error || "Invalid gift card code");
      }
    } catch (error) {
      setGiftCardBalance(null);
      setGiftCardValid(false);
      setGiftCardError("Failed to validate gift card. Please try again.");
    } finally {
      setGiftCardLoading(false);
    }
  };

  /**
   * Resets all gift card state
   */
  const resetGiftCard = (): void => {
    setGiftCardCode("");
    setGiftCardBalance(null);
    setGiftCardValid(false);
    setGiftCardError(null);
    setGiftCardLoading(false);
    setGiftCardExpanded(false);
  };

  return {
    giftCardCode,
    giftCardBalance,
    giftCardValid,
    giftCardError,
    giftCardLoading,
    giftCardExpanded,
    setGiftCardCode,
    setGiftCardExpanded,
    handleGiftCardApply,
    resetGiftCard,
  };
}
