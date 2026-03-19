/**
 * Domain-specific API client functions
 *
 * Uses the base api client with retry logic and error handling
 */

import { api } from './api-client';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

/**
 * Gift Card API
 */
export const giftCardApi = {
  /**
   * Validate gift card code
   */
  validate: async (code: string): Promise<ApiResponse<{ balance: number; valid: boolean }>> => {
    return api.get(`/api/gift/validate?code=${encodeURIComponent(code.trim())}`);
  },
};

/**
 * Checkout API
 */
export const checkoutApi = {
  /**
   * Create checkout session
   */
  createSession: async (data: {
    tierId: string;
    name: string;
    email: string;
    petName: string;
    style: string;
    photoUrl: string;
    notes?: string;
    discountCode?: string;
    giftCardCode?: string;
    referralCode?: string;
    variantId?: string;
    sessionId?: string;
  }): Promise<ApiResponse<{ url: string }>> => {
    return api.post('/api/checkout', data);
  },

  /**
   * Create portrait upsell session (2nd portrait for $35)
   */
  createUpsellSession: async (data: {
    tierId: string;
    name: string;
    email: string;
    petName: string;
    style: string;
    photoUrl: string;
    notes?: string;
  }): Promise<ApiResponse<{ url: string }>> => {
    return api.post('/api/checkout/portrait-upsell', data);
  },
};

/**
 * Referral API
 */
export const referralApi = {
  /**
   * Validate referral code
   */
  validate: async (code: string): Promise<ApiResponse<{ valid: boolean; discount: number }>> => {
    return api.post('/api/referral/validate', { code });
  },

  /**
   * Track referral click
   */
  trackClick: async (code: string): Promise<void> => {
    await api.post('/api/referral/track-click', { code });
  },
};

/**
 * Upload API
 */
export const uploadApi = {
  /**
   * Upload photo to blob storage
   */
  uploadPhoto: async (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    // For progress tracking, we need to use XMLHttpRequest
    if (onProgress) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            onProgress(percentComplete);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (err) {
              reject(new Error('Failed to parse response'));
            }
          } else {
            reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });

        xhr.open('POST', '/api/upload');
        xhr.send(formData);
      });
    }

    // Standard fetch for uploads without progress
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },
};

/**
 * Corporate API
 */
export const corporateApi = {
  /**
   * Submit quote request
   */
  submitQuote: async (data: {
    companyName: string;
    email: string;
    numberOfEmployees: number;
    message?: string;
  }): Promise<ApiResponse<{ success: boolean }>> => {
    return api.post('/api/corporate/quote', data);
  },

  /**
   * Submit bulk order
   */
  submitBulkOrder: async (data: {
    token: string;
    employeeData: unknown[];
  }): Promise<ApiResponse<{ success: boolean }>> => {
    return api.post('/api/corporate/bulk-order', data);
  },
};

/**
 * Portal API
 */
export const portalApi = {
  /**
   * Fetch user orders
   */
  fetchOrders: async (): Promise<unknown[]> => {
    const response = await api.get<{ orders: unknown[] }>('/api/portal/orders');
    return response.orders;
  },

  /**
   * Access billing portal
   */
  accessBillingPortal: async (): Promise<{ url: string }> => {
    return api.post('/api/portal/billing');
  },
};
