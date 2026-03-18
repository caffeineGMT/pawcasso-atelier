"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

function VerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        {/* Envelope Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-3xl font-semibold text-text-primary mb-3">
          Check your email
        </h1>

        {/* Subheadline */}
        <p className="text-text-secondary mb-8">
          {email ? (
            <>
              We sent a magic link to <strong className="text-text-primary">{email}</strong>
            </>
          ) : (
            "We sent you a magic link to sign in"
          )}
        </p>

        <div className="rounded-xl bg-bg-card border border-white/[0.08] p-6 text-left">
          <h3 className="font-semibold text-text-primary mb-3">What&apos;s next?</h3>
          <ol className="space-y-2 text-sm text-text-secondary">
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                1
              </span>
              <span>Check your email inbox (and spam folder)</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                2
              </span>
              <span>Click the magic link in the email</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                3
              </span>
              <span>You&apos;ll be automatically signed in</span>
            </li>
          </ol>
        </div>

        <p className="text-xs text-text-secondary mt-6">
          Didn&apos;t receive the email?{" "}
          <a href="/auth/signin" className="text-primary hover:text-primary-light">
            Try again
          </a>
        </p>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="text-text-primary">Loading...</div></div>}>
      <VerifyContent />
    </Suspense>
  );
}
