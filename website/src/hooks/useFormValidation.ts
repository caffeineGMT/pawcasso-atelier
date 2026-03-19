/**
 * Form validation hook with real-time feedback
 */

import { useState, useCallback } from 'react';
import { validateField } from '@/lib/validation';

export interface FieldErrors {
  [key: string]: string | undefined;
}

export interface TouchedFields {
  [key: string]: boolean;
}

/**
 * Hook for managing form validation state
 */
export function useFormValidation<T extends Record<string, unknown>>() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});

  // Validate a single field
  const validateSingleField = useCallback(
    (fieldName: keyof T, value: unknown): string | undefined => {
      // @ts-ignore - String(fieldName) produces valid key
      const error = validateField(String(fieldName), value);
      setErrors((prev) => ({
        ...prev,
        [fieldName]: error,
      }));
      return error;
    },
    []
  );

  // Mark field as touched
  const touchField = useCallback((fieldName: keyof T) => {
    setTouched((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
  }, []);

  // Handle field blur (validate and mark as touched)
  const handleBlur = useCallback(
    (fieldName: keyof T, value: unknown) => {
      touchField(fieldName);
      validateSingleField(fieldName, value);
    },
    [touchField, validateSingleField]
  );

  // Handle field change (validate if already touched)
  const handleChange = useCallback(
    (fieldName: keyof T, value: unknown) => {
      if (touched[fieldName as string]) {
        validateSingleField(fieldName, value);
      }
    },
    [touched, validateSingleField]
  );

  // Clear error for a field
  const clearError = useCallback((fieldName: keyof T) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName as string];
      return newErrors;
    });
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Reset touched state
  const resetTouched = useCallback(() => {
    setTouched({});
  }, []);

  // Reset everything
  const reset = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  // Set errors manually
  const setFieldError = useCallback((fieldName: keyof T, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  }, []);

  // Set multiple errors
  const setMultipleErrors = useCallback((newErrors: FieldErrors) => {
    setErrors((prev) => ({
      ...prev,
      ...newErrors,
    }));
  }, []);

  // Check if form has any errors
  const hasErrors = Object.values(errors).some((error) => error !== undefined);

  // Get error for a specific field (only if touched)
  const getFieldError = useCallback(
    (fieldName: keyof T): string | undefined => {
      return touched[fieldName as string] ? errors[fieldName as string] : undefined;
    },
    [errors, touched]
  );

  return {
    errors,
    touched,
    hasErrors,
    validateSingleField,
    touchField,
    handleBlur,
    handleChange,
    clearError,
    clearErrors,
    resetTouched,
    reset,
    setFieldError,
    setMultipleErrors,
    getFieldError,
  };
}
