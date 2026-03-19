import { z } from "zod";

/**
 * Form validation utilities with user-friendly error messages
 */

// Common validation schemas
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .max(255, "Email is too long");

export const nameSchema = z
  .string()
  .min(1, "Name is required")
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name is too long")
  .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes");

export const petNameSchema = z
  .string()
  .min(1, "Pet name is required")
  .min(2, "Pet name must be at least 2 characters")
  .max(50, "Pet name is too long");

export const phoneSchema = z
  .string()
  .regex(
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    "Please enter a valid phone number"
  )
  .optional()
  .or(z.literal(""));

export const urlSchema = z
  .string()
  .url("Please enter a valid URL")
  .optional()
  .or(z.literal(""));

export const imageFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 10 * 1024 * 1024, "Image must be less than 10MB")
  .refine(
    (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
    "Only JPEG, PNG, and WebP images are supported"
  );

// Validation error formatter
export function formatValidationErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};

  error.errors.forEach((err) => {
    const path = err.path.join(".");
    errors[path] = err.message;
  });

  return errors;
}

// Validation result type
export type ValidationResult<T> =
  | { success: true; data: T; errors: null }
  | { success: false; data: null; errors: Record<string, string> };

/**
 * Validate data against a Zod schema
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
      errors: null,
    };
  }

  return {
    success: false,
    data: null,
    errors: formatValidationErrors(result.error),
  };
}

/**
 * Create a debounced validation function
 */
export function createDebouncedValidator<T>(
  schema: z.ZodSchema<T>,
  onValidate: (result: ValidationResult<T>) => void,
  delay = 300
) {
  let timeoutId: NodeJS.Timeout;

  return (data: unknown) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      const result = validate(schema, data);
      onValidate(result);
    }, delay);
  };
}

// Order form validation
export const orderFormSchema = z.object({
  email: emailSchema,
  customerName: nameSchema,
  petName: petNameSchema,
  style: z.string().min(1, "Please select an art style"),
  tier: z.enum(["basic", "premium", "deluxe", "bundle"], {
    errorMap: () => ({ message: "Please select a package" }),
  }),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
  petPhoto: imageFileSchema.optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

export type OrderFormData = z.infer<typeof orderFormSchema>;

// Corporate quote form validation
export const corporateQuoteSchema = z.object({
  companyName: z.string().min(1, "Company name is required").max(100),
  contactName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  teamSize: z
    .number()
    .min(10, "Corporate orders require a minimum of 10 portraits")
    .max(10000, "Please contact us directly for orders over 10,000"),
  useCase: z.enum(
    ["employee_gifts", "client_gifts", "team_building", "event_giveaway", "other"],
    { errorMap: () => ({ message: "Please select a use case" }) }
  ),
  preferredDeliveryDate: z.date().optional(),
  notes: z.string().max(1000, "Notes must be less than 1000 characters").optional(),
});

export type CorporateQuoteData = z.infer<typeof corporateQuoteSchema>;

// Email signup validation
export const emailSignupSchema = z.object({
  email: emailSchema,
  name: nameSchema.optional(),
  source: z.string().optional(),
});

export type EmailSignupData = z.infer<typeof emailSignupSchema>;

// Contact form validation
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z.string().min(1, "Subject is required").max(200),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
