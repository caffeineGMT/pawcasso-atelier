/**
 * UTM Parameter Tracking Utility
 * Captures and persists UTM parameters across page navigation
 */

export interface UTMParams {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
}

/**
 * Capture UTM parameters from current URL
 * Persists to sessionStorage for multi-page attribution
 */
export function captureUTMParams(): UTMParams {
  if (typeof window === 'undefined') {
    return {
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmContent: null,
      utmTerm: null,
    };
  }

  const params = new URLSearchParams(window.location.search);
  const utm: UTMParams = {
    utmSource: params.get('utm_source'),
    utmMedium: params.get('utm_medium'),
    utmCampaign: params.get('utm_campaign'),
    utmContent: params.get('utm_content'),
    utmTerm: params.get('utm_term'),
  };

  // Persist to sessionStorage if any UTM params present
  if (Object.values(utm).some((v) => v)) {
    sessionStorage.setItem('utm_params', JSON.stringify(utm));
  }

  return utm;
}

/**
 * Retrieve stored UTM parameters from sessionStorage
 * Returns stored params or empty object if none exist
 */
export function getStoredUTMParams(): UTMParams {
  if (typeof window === 'undefined') {
    return {
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmContent: null,
      utmTerm: null,
    };
  }

  const stored = sessionStorage.getItem('utm_params');
  if (!stored) {
    return {
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmContent: null,
      utmTerm: null,
    };
  }

  try {
    return JSON.parse(stored);
  } catch {
    return {
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmContent: null,
      utmTerm: null,
    };
  }
}

/**
 * Clear stored UTM parameters
 * Useful for testing or manual reset
 */
export function clearUTMParams(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('utm_params');
  }
}
