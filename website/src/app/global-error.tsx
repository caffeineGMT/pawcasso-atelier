'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log critical error to monitoring service
    console.error('CRITICAL ERROR:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F8F7F4',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          padding: '20px',
        }}>
          <div style={{
            maxWidth: '500px',
            textAlign: 'center',
          }}>
            <svg
              style={{
                margin: '0 auto 2rem',
                width: '96px',
                height: '96px',
                color: '#E07A5F',
              }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>

            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#2B2D42',
              marginBottom: '1rem',
            }}>
              Critical Error
            </h1>

            <p style={{
              fontSize: '1.125rem',
              color: '#4A4A4A',
              marginBottom: '2rem',
              lineHeight: 1.6,
            }}>
              We encountered a critical error. Please refresh the page or contact support if the problem persists.
            </p>

            <button
              onClick={reset}
              style={{
                padding: '12px 32px',
                backgroundColor: '#E07A5F',
                color: 'white',
                border: 'none',
                borderRadius: '9999px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#D66951'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#E07A5F'}
            >
              Try Again
            </button>

            <p style={{
              marginTop: '2rem',
              fontSize: '0.875rem',
              color: '#6B7280',
            }}>
              Error ID: {error.digest || 'Unknown'}
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
