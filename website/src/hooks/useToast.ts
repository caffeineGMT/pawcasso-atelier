/**
 * Enhanced toast hook with better error handling
 */

import { toast as sonnerToast } from 'sonner';
import { getUserErrorMessage, parseError, AppError } from '@/lib/errors';

export interface ToastOptions {
  duration?: number;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Toast utilities with consistent styling and error handling
 */
export function useToast() {
  const success = (message: string, options?: ToastOptions) => {
    return sonnerToast.success(message, {
      duration: options?.duration || 4000,
      description: options?.description,
      action: options?.action,
    });
  };

  const error = (messageOrError: string | Error | unknown, options?: ToastOptions) => {
    let message: string;
    let description: string | undefined = options?.description;

    if (typeof messageOrError === 'string') {
      message = messageOrError;
    } else {
      const appError = parseError(messageOrError);
      message = appError.userMessage;

      // In development, show technical error in description
      if (process.env.NODE_ENV === 'development' && appError.message !== appError.userMessage) {
        description = appError.message;
      }
    }

    return sonnerToast.error(message, {
      duration: options?.duration || 6000,
      description,
      action: options?.action,
    });
  };

  const warning = (message: string, options?: ToastOptions) => {
    return sonnerToast.warning(message, {
      duration: options?.duration || 5000,
      description: options?.description,
      action: options?.action,
    });
  };

  const info = (message: string, options?: ToastOptions) => {
    return sonnerToast.info(message, {
      duration: options?.duration || 4000,
      description: options?.description,
      action: options?.action,
    });
  };

  const loading = (message: string) => {
    return sonnerToast.loading(message);
  };

  const promise = <T,>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading: options.loading,
      success: options.success,
      error: (err) => {
        if (typeof options.error === 'function') {
          return options.error(err);
        }
        const appError = parseError(err);
        return appError.userMessage || options.error;
      },
    });
  };

  const dismiss = (toastId?: string | number) => {
    return sonnerToast.dismiss(toastId);
  };

  return {
    success,
    error,
    warning,
    info,
    loading,
    promise,
    dismiss,
  };
}
