"use client";

import { ReactNode, InputHTMLAttributes } from "react";
import { clsx } from "clsx";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
}

/**
 * Form field component with validation feedback
 */
export function FormField({
  label,
  error,
  helperText,
  icon,
  className,
  ...inputProps
}: FormFieldProps) {
  const hasError = Boolean(error);

  return (
    <div className="w-full">
      <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2 font-medium">
        {label}
        {inputProps.required && <span className="text-red-400 ml-1">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
            {icon}
          </div>
        )}

        <input
          {...inputProps}
          className={clsx(
            'w-full min-h-[48px] bg-white/[0.06] border rounded-xl px-4 py-3 text-lg text-text-primary transition-all placeholder:text-white/20',
            'focus:outline-none focus:ring-1',
            hasError
              ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30'
              : 'border-white/[0.08] focus:border-gold/60 focus:ring-gold/30',
            icon && 'pl-12',
            inputProps.disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          aria-invalid={hasError}
          aria-describedby={
            error
              ? `${inputProps.id}-error`
              : helperText
              ? `${inputProps.id}-helper`
              : undefined
          }
        />
      </div>

      {error && (
        <p
          id={`${inputProps.id}-error`}
          className="text-red-400 text-sm mt-2 flex items-center gap-1 animate-shake"
          role="alert"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}

      {!error && helperText && (
        <p
          id={`${inputProps.id}-helper`}
          className="text-white/40 text-xs mt-2"
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
