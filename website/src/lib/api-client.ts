/**
 * API Client with automatic retry, timeout, and error handling
 */

import { parseError, showErrorToast, isOnline, waitForOnline } from "./error-handler";
import { toast } from "sonner";

export interface RequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  showToastOnError?: boolean;
  onRetry?: (attempt: number, maxRetries: number) => void;
}

const DEFAULT_TIMEOUT = 30000; // 30 seconds
const DEFAULT_RETRIES = 3;
const DEFAULT_RETRY_DELAY = 1000; // 1 second

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

/**
 * Enhanced fetch with retry logic and error handling
 */
export async function apiRequest<T = any>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    timeout = DEFAULT_TIMEOUT,
    retries = DEFAULT_RETRIES,
    retryDelay = DEFAULT_RETRY_DELAY,
    showToastOnError = true,
    onRetry,
    ...fetchOptions
  } = options;

  let lastError: Error | Response | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Check if online
      if (!isOnline()) {
        toast.error("No internet connection", {
          description: "Waiting for connection...",
          duration: Infinity,
          id: "offline-toast",
        });
        await waitForOnline();
        toast.dismiss("offline-toast");
        toast.success("Back online", {
          description: "Retrying request...",
          duration: 2000,
        });
      }

      // Make request
      const response = await fetchWithTimeout(url, fetchOptions, timeout);

      // Check if response is ok
      if (!response.ok) {
        lastError = response;

        // Don't retry client errors (4xx), except 408 (timeout) and 429 (rate limit)
        if (response.status >= 400 && response.status < 500) {
          if (response.status !== 408 && response.status !== 429) {
            throw response;
          }
        }

        // Retry server errors (5xx)
        if (attempt < retries) {
          if (onRetry) onRetry(attempt + 1, retries);

          const delay = retryDelay * Math.pow(2, attempt); // Exponential backoff
          await sleep(delay);
          continue;
        }

        throw response;
      }

      // Parse response
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }

      return await response.text() as T;
    } catch (error) {
      lastError = error as Error | Response;

      // Don't retry on abort or network errors after max retries
      if (attempt >= retries) {
        if (showToastOnError) {
          const appError = await parseError(error);
          showErrorToast(appError);
        }
        throw error;
      }

      // Retry on network errors
      if (error instanceof Error && (
        error.name === "AbortError" ||
        error.message.includes("fetch") ||
        error.message.includes("network")
      )) {
        if (onRetry) onRetry(attempt + 1, retries);

        const delay = retryDelay * Math.pow(2, attempt);
        await sleep(delay);
        continue;
      }

      // Don't retry other errors
      if (showToastOnError) {
        const appError = await parseError(error);
        showErrorToast(appError);
      }
      throw error;
    }
  }

  // Should never reach here, but TypeScript requires it
  throw lastError || new Error("Request failed after retries");
}

/**
 * Convenience methods for common HTTP methods
 */
export const api = {
  get: <T = any>(url: string, options?: RequestOptions) =>
    apiRequest<T>(url, { ...options, method: "GET" }),

  post: <T = any>(url: string, data?: any, options?: RequestOptions) =>
    apiRequest<T>(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T = any>(url: string, data?: any, options?: RequestOptions) =>
    apiRequest<T>(url, {
      ...options,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T = any>(url: string, data?: any, options?: RequestOptions) =>
    apiRequest<T>(url, {
      ...options,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T = any>(url: string, options?: RequestOptions) =>
    apiRequest<T>(url, { ...options, method: "DELETE" }),
};
