/**
 * Base API client with retry logic and error handling
 */

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  retries = MAX_RETRIES
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      // If server error and retries left, retry
      if (response.status >= 500 && retries > 0) {
        await sleep(RETRY_DELAY_MS);
        return fetchWithRetry(url, options, retries - 1);
      }

      // Client error or no retries left
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || `Request failed: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (retries > 0) {
      await sleep(RETRY_DELAY_MS);
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

export const api = {
  get: async <T = any>(url: string): Promise<T> => {
    return fetchWithRetry<T>(url, { method: 'GET' });
  },

  post: async <T = any>(url: string, data?: any): Promise<T> => {
    return fetchWithRetry<T>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put: async <T = any>(url: string, data?: any): Promise<T> => {
    return fetchWithRetry<T>(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async <T = any>(url: string): Promise<T> => {
    return fetchWithRetry<T>(url, { method: 'DELETE' });
  },
};
