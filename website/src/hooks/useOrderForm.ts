import { useState } from 'react';
import { type TierId } from '@/lib/stripe';

/**
 * Order form field values
 */
export interface OrderFormData {
  name: string;
  email: string;
  petName: string;
  style: string;
  notes: string;
  selectedTier: TierId;
}

/**
 * Form validation errors
 */
export interface OrderFormErrors {
  step1Error: string;
  step2Error: string;
}

/**
 * Return type for useOrderForm hook
 */
export interface UseOrderFormReturn {
  /** Current wizard step (1-3) */
  currentStep: number;
  /** Form field values */
  formData: OrderFormData;
  /** Validation errors */
  errors: OrderFormErrors;
  /** Update a form field */
  updateField: <K extends keyof OrderFormData>(field: K, value: OrderFormData[K]) => void;
  /** Validate current step and move to next */
  handleNext: () => boolean;
  /** Move to previous step */
  handleBack: () => void;
  /** Go to specific step */
  goToStep: (step: number) => void;
  /** Set step 1 error */
  setStep1Error: (error: string) => void;
  /** Set step 2 error */
  setStep2Error: (error: string) => void;
}

/**
 * Validation rules for order form steps
 */
export interface OrderFormValidation {
  /** Custom validator for step 1 */
  validateStep1?: (data: OrderFormData) => string | null;
  /** Custom validator for step 2 */
  validateStep2?: (data: OrderFormData) => string | null;
}

/**
 * Custom hook for managing multi-step order form state and validation
 *
 * @param initialData - Initial form values
 * @param validation - Custom validation functions
 * @param uploadedPhotoUrl - URL of uploaded photo (required for step 1 validation)
 *
 * @example
 * ```tsx
 * const {
 *   currentStep,
 *   formData,
 *   updateField,
 *   handleNext
 * } = useOrderForm({
 *   selectedTier: 'premium'
 * }, {
 *   validateStep1: (data) => {
 *     if (!data.petName) return "Pet name required";
 *     return null;
 *   }
 * });
 * ```
 */
export function useOrderForm(
  initialData: Partial<OrderFormData> = {},
  validation: OrderFormValidation = {},
  uploadedPhotoUrl: string | null = null
): UseOrderFormReturn {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OrderFormData>({
    name: '',
    email: '',
    petName: '',
    style: '',
    notes: '',
    selectedTier: 'basic',
    ...initialData,
  });
  const [step1Error, setStep1Error] = useState<string>("");
  const [step2Error, setStep2Error] = useState<string>("");

  /**
   * Updates a single form field
   */
  const updateField = <K extends keyof OrderFormData>(
    field: K,
    value: OrderFormData[K]
  ): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Default validation for step 1 (photo + pet name)
   */
  const defaultValidateStep1 = (): string | null => {
    if (!uploadedPhotoUrl) {
      return "Please upload a photo of your pet";
    }
    if (!formData.petName.trim()) {
      return "Please enter your pet's name";
    }
    return null;
  };

  /**
   * Default validation for step 2 (style selection)
   */
  const defaultValidateStep2 = (): string | null => {
    if (!formData.style) {
      return "Please select an art style";
    }
    return null;
  };

  /**
   * Validates step 1
   */
  const validateStep1 = (): boolean => {
    const error = validation.validateStep1?.(formData) ?? defaultValidateStep1();
    if (error) {
      setStep1Error(error);
      return false;
    }
    setStep1Error("");
    return true;
  };

  /**
   * Validates step 2
   */
  const validateStep2 = (): boolean => {
    const error = validation.validateStep2?.(formData) ?? defaultValidateStep2();
    if (error) {
      setStep2Error(error);
      return false;
    }
    setStep2Error("");
    return true;
  };

  /**
   * Handles next button - validates and proceeds to next step
   */
  const handleNext = (): boolean => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
      return true;
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
      return true;
    }
    return false;
  };

  /**
   * Handles back button
   */
  const handleBack = (): void => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  /**
   * Go to specific step (no validation)
   */
  const goToStep = (step: number): void => {
    if (step >= 1 && step <= 3) {
      setCurrentStep(step);
    }
  };

  return {
    currentStep,
    formData,
    errors: {
      step1Error,
      step2Error,
    },
    updateField,
    handleNext,
    handleBack,
    goToStep,
    setStep1Error,
    setStep2Error,
  };
}
