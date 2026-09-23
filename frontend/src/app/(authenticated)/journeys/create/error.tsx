'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Creation Error Boundary
// -----------------------------------------------------------------------------
//
// Next.js route-level error boundary for the Journey creation entry route.
//
// This boundary handles unexpected errors thrown while rendering or loading
// the route tree.
//
// It is intentionally separate from mutation errors handled by page.tsx.
//
// page.tsx
//     Handles the expected/recoverable Journey draft creation mutation error
//     and allows the user to retry the same idempotent creation attempt.
//
// error.tsx
//     Handles an unexpected route-level failure and delegates recovery to
//     Next.js through reset().
//
// This file does NOT:
// - call the Journey API;
// - create a Journey draft;
// - use React Query;
// - normalize API mutation errors;
// - manage idempotency;
// - perform custom navigation.
//
// -----------------------------------------------------------------------------

import { useEffect } from 'react';

interface JourneyCreateErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function JourneyCreateError({
  error,
  reset,
}: JourneyCreateErrorProps) {
  // ---------------------------------------------------------------------------
  // Diagnostics
  // ---------------------------------------------------------------------------
  //
  // Keep the route boundary itself responsible only for reporting the
  // unexpected error. Application-specific error normalization belongs to the
  // feature/application layer.
  // ---------------------------------------------------------------------------

  useEffect(() => {
    console.error('Journey creation route error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[var(--background-brand)]">
      <div className="page-container py-6 sm:py-8">
        <section
          role="alert"
          aria-labelledby="journey-create-route-error-title"
          className="surface p-6 sm:p-8"
        >
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
              sisiMove Journey
            </p>

            <h1
              id="journey-create-route-error-title"
              className="mt-2 text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl"
            >
              We couldn&apos;t start your journey
            </h1>

            <p className="mt-2 text-sm leading-6 text-[var(--foreground-secondary)]">
              Something went wrong while loading the journey creation page.
              Please try again.
            </p>

            <div className="mt-5">
              <button
                type="button"
                onClick={reset}
                className="inline-flex min-h-10 items-center justify-center rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--brand-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-2"
              >
                Try again
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

