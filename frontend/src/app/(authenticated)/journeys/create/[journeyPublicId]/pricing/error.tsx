'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Pricing Route Error
// -----------------------------------------------------------------------------
//
// Route-level error boundary for the Journey Pricing step.
//
// This handles unexpected errors that escape the page-level query/mutation
// handling. The page itself remains responsible for presenting expected
// application/API errors.
//
// -----------------------------------------------------------------------------

import { useEffect } from 'react';

interface JourneyPricingErrorProps {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
}

export default function JourneyPricingError({
  error,
  reset,
}: JourneyPricingErrorProps) {
  useEffect(() => {
    // Keep the error available for development diagnostics without exposing
    // implementation details in the user-facing interface.
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[60vh] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-2xl">
        <section
          aria-labelledby="journey-pricing-route-error-title"
          className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 sm:p-6"
        >
          <p className="text-sm font-medium text-[var(--brand)]">
            Journey creation
          </p>

          <h1
            id="journey-pricing-route-error-title"
            className="mt-1 text-xl font-semibold tracking-tight text-[var(--foreground)]"
          >
            We could not load pricing
          </h1>

          <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
            Something went wrong while loading this step of your
            journey. You can try again.
          </p>

          <button
            type="button"
            onClick={reset}
            className="mt-5 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--background-subtle)]"
          >
            Try again
          </button>
        </section>
      </div>
    </main>
  );
}

