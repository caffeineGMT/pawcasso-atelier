'use client';

import { useEffect } from 'react';
import { applyBrowserFixes } from '@/lib/browser-compat';

/**
 * BrowserCompat Component
 * Applies browser-specific fixes and polyfills on mount
 */
export default function BrowserCompat() {
  useEffect(() => {
    applyBrowserFixes();
  }, []);

  return null; // This component doesn't render anything
}
