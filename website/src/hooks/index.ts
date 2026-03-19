/**
 * Order page hooks - Custom hooks for order flow management
 */
export { useFileUpload } from './useFileUpload';
export type { UseFileUploadReturn, FileUploadConfig } from './useFileUpload';

export { useGiftCard } from './useGiftCard';
export type { UseGiftCardReturn } from './useGiftCard';

export { useCountdownTimer } from './useCountdownTimer';
export type { UseCountdownTimerReturn } from './useCountdownTimer';

export { useSocialProof } from './useSocialProof';
export type { UseSocialProofReturn } from './useSocialProof';

export { useOrderForm } from './useOrderForm';
export type {
  UseOrderFormReturn,
  OrderFormData,
  OrderFormErrors,
  OrderFormValidation,
} from './useOrderForm';

export { useOrderParams } from './useOrderParams';
export type { UseOrderParamsReturn } from './useOrderParams';
