/**
 * Centralized error handling utilities
 * Provides consistent error messages and handling across the application
 */

// Error types
export enum ErrorType {
  VALIDATION = 'validation',
  NETWORK = 'network',
  API = 'api',
  UPLOAD = 'upload',
  PAYMENT = 'payment',
  AUTH = 'auth',
  UNKNOWN = 'unknown',
}

// Custom error class with metadata
export class AppError extends Error {
  type: ErrorType;
  userMessage: string;
  metadata?: Record<string, unknown>;
  recoverable: boolean;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    userMessage?: string,
    metadata?: Record<string, unknown>,
    recoverable = true
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.userMessage = userMessage || this.getDefaultUserMessage(type);
    this.metadata = metadata;
    this.recoverable = recoverable;
  }

  private getDefaultUserMessage(type: ErrorType): string {
    const messages: Record<ErrorType, string> = {
      [ErrorType.VALIDATION]: 'Please check your input and try again.',
      [ErrorType.NETWORK]: 'Network error. Please check your connection and try again.',
      [ErrorType.API]: 'Something went wrong. Please try again in a moment.',
      [ErrorType.UPLOAD]: 'Failed to upload file. Please try again.',
      [ErrorType.PAYMENT]: 'Payment processing failed. Please try again or contact support.',
      [ErrorType.AUTH]: 'Authentication failed. Please sign in again.',
      [ErrorType.UNKNOWN]: 'An unexpected error occurred. Please try again.',
    };
    return messages[type];
  }
}

// User-friendly error messages
export const ERROR_MESSAGES = {
  // Upload errors
  UPLOAD_FAILED: 'Failed to upload your photo. Please try again.',
  FILE_TOO_LARGE: 'File size exceeds 10MB. Please choose a smaller image.',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload JPG, PNG, HEIC, or WebP.',
  UPLOAD_TIMEOUT: 'Upload is taking too long. Please check your connection and try again.',

  // Form validation
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_NAME: 'Please enter a valid name.',
  NO_PHOTO: 'Please upload a photo of your pet.',
  NO_STYLE: 'Please select an art style.',
  NO_TIER: 'Please select a package.',

  // API errors
  API_ERROR: 'Server error. Please try again in a moment.',
  CHECKOUT_FAILED: 'Failed to create checkout session. Please try again or contact support.',
  ORDER_NOT_FOUND: 'Order not found. Please contact support.',

  // Network errors
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  TIMEOUT: 'Request timed out. Please try again.',

  // Payment errors
  PAYMENT_FAILED: 'Payment failed. Please check your payment details and try again.',
  INVALID_GIFT_CARD: 'Invalid gift card code. Please check and try again.',
  EXPIRED_GIFT_CARD: 'This gift card has expired.',
  INSUFFICIENT_BALANCE: 'Insufficient gift card balance.',

  // Auth errors
  AUTH_REQUIRED: 'Please sign in to continue.',
  INVALID_TOKEN: 'Invalid or expired session. Please sign in again.',

  // Generic
  UNKNOWN_ERROR: 'Something went wrong. Please try again.',
  TRY_AGAIN_LATER: 'Please try again later or contact support if the problem persists.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  UPLOAD_SUCCESS: 'Photo uploaded successfully!',
  ORDER_CREATED: 'Order created! Redirecting to payment...',
  PAYMENT_SUCCESS: 'Payment successful! Your portrait is being created.',
  GIFT_CARD_APPLIED: 'Gift card applied successfully!',
  EMAIL_SUBSCRIBED: 'Successfully subscribed to updates!',
  PHOTO_SAVED: 'Photo saved!',
} as const;

// Parse error from various sources
export function parseError(error: unknown): AppError {
  // Already an AppError
  if (error instanceof AppError) {
    return error;
  }

  // Standard Error
  if (error instanceof Error) {
    // Network errors
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return new AppError(
        error.message,
        ErrorType.NETWORK,
        ERROR_MESSAGES.NETWORK_ERROR
      );
    }

    // Timeout errors
    if (error.message.includes('timeout')) {
      return new AppError(
        error.message,
        ErrorType.NETWORK,
        ERROR_MESSAGES.TIMEOUT
      );
    }

    return new AppError(error.message, ErrorType.UNKNOWN);
  }

  // API response errors
  if (typeof error === 'object' && error !== null) {
    const err = error as { message?: string; error?: string; status?: number };
    const message = err.error || err.message || 'Unknown error';

    // Determine error type from status code
    let type = ErrorType.API;
    if (err.status === 401 || err.status === 403) {
      type = ErrorType.AUTH;
    } else if (err.status === 400) {
      type = ErrorType.VALIDATION;
    } else if (err.status && err.status >= 500) {
      type = ErrorType.API;
    }

    return new AppError(message, type, undefined, { status: err.status });
  }

  // String error
  if (typeof error === 'string') {
    return new AppError(error, ErrorType.UNKNOWN);
  }

  // Unknown error type
  return new AppError('Unknown error occurred', ErrorType.UNKNOWN);
}

// Log error (can be extended to send to error tracking service)
export function logError(error: AppError | Error, context?: Record<string, unknown>) {
  const errorData = {
    name: error.name,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    ...context,
    ...(error instanceof AppError ? {
      type: error.type,
      userMessage: error.userMessage,
      metadata: error.metadata,
      recoverable: error.recoverable,
    } : {}),
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[Error]', errorData);
  }

  // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
  // Example: Sentry.captureException(error, { extra: errorData });

  return errorData;
}

// Get user-friendly error message
export function getUserErrorMessage(error: unknown): string {
  const appError = parseError(error);
  return appError.userMessage;
}

// Check if error is recoverable
export function isRecoverableError(error: unknown): boolean {
  const appError = parseError(error);
  return appError.recoverable;
}
