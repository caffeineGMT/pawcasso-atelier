import { useState, useCallback } from "react";
import { z } from "zod";
import { validate, type ValidationResult } from "@/lib/form-validation";
import { api, type RequestOptions } from "@/lib/api-client";
import { toast } from "sonner";

/**
 * Custom hook for form handling with validation and API submission
 */
export function useForm<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  onSuccess?: (data: z.infer<typeof schema>) => void
) {
  type FormData = z.infer<typeof schema>;

  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;

      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear error for this field
      if (errors[field as string]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field as string];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const handleFileChange = useCallback(
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      setFormData((prev) => ({ ...prev, [field]: file }));

      // Clear error for this field
      if (errors[field as string]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field as string];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const validateForm = useCallback((): ValidationResult<FormData> => {
    const result = validate(schema, formData);

    if (!result.success) {
      setErrors(result.errors);
      toast.error("Validation failed", {
        description: "Please check the form for errors",
      });
    }

    return result;
  }, [schema, formData]);

  const submitForm = useCallback(
    async (endpoint: string, options?: RequestOptions) => {
      const validationResult = validateForm();

      if (!validationResult.success) {
        return { success: false, error: "Validation failed" };
      }

      setIsSubmitting(true);

      try {
        const result = await api.post(endpoint, validationResult.data, {
          retries: 3,
          retryDelay: 1000,
          ...options,
        });

        if (onSuccess) {
          onSuccess(validationResult.data);
        }

        return { success: true, data: result };
      } catch (error) {
        return { success: false, error };
      } finally {
        setIsSubmitting(false);
      }
    },
    [validateForm, onSuccess]
  );

  const resetForm = useCallback(() => {
    setFormData({});
    setErrors({});
    setIsSubmitting(false);
  }, []);

  const setFieldValue = useCallback((field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleFileChange,
    validateForm,
    submitForm,
    resetForm,
    setFieldValue,
    setFieldError,
    setFormData,
  };
}
