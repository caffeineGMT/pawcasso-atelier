"use client";

import { useState, FormEvent } from "react";
import { Input, Textarea } from "@/components/FormInputs";
import { contactFormSchema, type ContactFormData, validate } from "@/lib/form-validation";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

/**
 * Example contact form with comprehensive validation and error handling
 */
export function ContactForm() {
  const [formData, setFormData] = useState<Partial<ContactFormData>>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof ContactFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationResult = validate(contactFormSchema, formData);

    if (!validationResult.success) {
      setErrors(validationResult.errors);
      toast.error("Validation failed", {
        description: "Please check the form for errors",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit form with retry logic
      const result = await api.post("/api/contact", validationResult.data, {
        retries: 3,
        retryDelay: 1000,
        onRetry: (attempt, maxRetries) => {
          toast.loading(`Retrying... (${attempt}/${maxRetries})`, {
            id: "contact-retry",
          });
        },
      });

      toast.dismiss("contact-retry");
      toast.success("Message sent!", {
        description: "We'll get back to you as soon as possible.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      // Error is already handled by api-client with toast notification
      console.error("Contact form error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <Input
        id="name"
        type="text"
        label="Name"
        value={formData.name}
        onChange={handleChange("name")}
        error={errors.name}
        required
        disabled={isSubmitting}
        placeholder="John Doe"
      />

      <Input
        id="email"
        type="email"
        label="Email"
        value={formData.email}
        onChange={handleChange("email")}
        error={errors.email}
        required
        disabled={isSubmitting}
        placeholder="john@example.com"
        hint="We'll never share your email with anyone else."
      />

      <Input
        id="subject"
        type="text"
        label="Subject"
        value={formData.subject}
        onChange={handleChange("subject")}
        error={errors.subject}
        required
        disabled={isSubmitting}
        placeholder="How can we help?"
      />

      <Textarea
        id="message"
        label="Message"
        value={formData.message}
        onChange={handleChange("message")}
        error={errors.message}
        required
        disabled={isSubmitting}
        placeholder="Tell us more about your inquiry..."
        rows={6}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#D4AF37] text-black font-semibold py-3 px-6 rounded-lg hover:bg-[#C5A028] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}
