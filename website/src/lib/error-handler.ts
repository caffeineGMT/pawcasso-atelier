import { toast } from "sonner";

/**
 * Centralized error handling utilities
 */

export type ErrorType =
  | "network"
  | "validation"
  | "authentication"
  | "authorization"
  | "not_found"
  | "server"
  | "timeout"
  | "unknown";

export interface AppError {
  type: ErrorType;
  message: string;
  details?: string;
  statusCode?: number;
  retry?: boolean;
}

/**
 * Parse error from various sources (Response, Error, unknown)
 */
export async function parseError(error: unknown): Promise<AppError> {
  // Handle Response objects
  if (error instanceof Response) {
    const statusCode = error.status;
    let message = error.statusText;
    let details: string | undefined;

    try {
      const data = await error.json();
      message = data.error || data.message || message;
      details = data.details;
    } catch {
      // Ignore JSON parsing errors
    }

    return {
      type: getErrorTypeFromStatus(statusCode),
      message,
      details,
      statusCode,
      retry: statusCode >= 500,
    };
  }

  // Handle Error objects
  if (error instanceof Error) {
    return {
      type: getErrorTypeFromMessage(error.message),
      message: error.message,
      retry: false,
    };
  }

  // Handle unknown errors
  return {
    type: "unknown",
    message: "An unexpected error occurred",
    retry: false,
  };
}

/**
 * Determine error type from HTTP status code
 */
function getErrorTypeFromStatus(status: number): ErrorType {
  if (status >= 500) return "server";
  if (status === 404) return "not_found";
  if (status === 401) return "authentication";
  if (status === 403) return "authorization";
  if (status === 400) return "validation";
  if (status === 408 || status === 504) return "timeout";
  return "unknown";
}

/**
 * Determine error type from error message
 */
function getErrorTypeFromMessage(message: string): ErrorType {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("network") || lowerMessage.includes("fetch")) return "network";
  if (lowerMessage.includes("timeout")) return "timeout";
  if (lowerMessage.includes("unauthorized") || lowerMessage.includes("unauthenticated")) return "authentication";
  if (lowerMessage.includes("forbidden")) return "authorization";
  if (lowerMessage.includes("not found")) return "not_found";
  if (lowerMessage.includes("validation") || lowerMessage.includes("invalid")) return "validation";

  return "unknown";
}

/**
 * Get user-friendly error message
 */
export function getUserMessage(error: AppError): string {
  switch (error.type) {
    case "network":
      return "Network error. Please check your internet connection and try again.";
    case "timeout":
      return "Request timed out. Please try again.";
    case "authentication":
      return "You need to sign in to continue.";
    case "authorization":
      return "You don't have permission to perform this action.";
    case "not_found":
      return "The requested resource was not found.";
    case "server":
      return "Server error. Please try again later.";
    case "validation":
      return error.message || "Invalid input. Please check your data and try again.";
    default:
      return error.message || "An unexpected error occurred. Please try again.";
  }
}

/**
 * Show error toast notification
 */
export function showErrorToast(error: AppError | unknown) {
  const appError = error instanceof Error || error instanceof Response
    ? parseError(error)
    : (error as AppError);

  Promise.resolve(appError).then((err) => {
    const message = getUserMessage(err);

    toast.error("Error", {
      description: message,
      duration: 5000,
      action: err.retry
        ? {
            label: "Retry",
            onClick: () => window.location.reload(),
          }
        : undefined,
    });
  });
}

/**
 * Handle API errors with automatic toast notification
 */
export async function handleApiError(error: unknown): Promise<AppError> {
  const appError = await parseError(error);
  showErrorToast(appError);
  return appError;
}

/**
 * Create a user-friendly error for display
 */
export function createError(
  type: ErrorType,
  message: string,
  options?: { details?: string; statusCode?: number; retry?: boolean }
): AppError {
  return {
    type,
    message,
    details: options?.details,
    statusCode: options?.statusCode,
    retry: options?.retry ?? false,
  };
}

/**
 * Check if user is online
 */
export function isOnline(): boolean {
  if (typeof navigator === "undefined") return true;
  return navigator.onLine;
}

/**
 * Wait for online connection
 */
export function waitForOnline(): Promise<void> {
  return new Promise((resolve) => {
    if (isOnline()) {
      resolve();
      return;
    }

    const handleOnline = () => {
      window.removeEventListener("online", handleOnline);
      resolve();
    };

    window.addEventListener("online", handleOnline);
  });
}
