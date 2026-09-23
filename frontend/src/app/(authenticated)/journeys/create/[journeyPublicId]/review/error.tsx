'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Review Route Error
// -----------------------------------------------------------------------------

import { useEffect } from 'react';

// =============================================================================
// Props
// =============================================================================

interface JourneyReviewErrorProps {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
}

// =============================================================================
// Component
// =============================================================================

export default function JourneyReviewError({
  error,
  reset,
}: JourneyReviewErrorProps) {
  // ---------------------------------------------------------------------------
  // Runtime diagnostics
  // ---------------------------------------------------------------------------

  useEffect(() => {
    console.error(
      'Journey review route error:',
      error,
    );
  }, [error]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <main className="min-h-[60vh] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-2xl">
        <section
          aria-labelledby="journey-review-route-error-title"
          className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 sm:p-6"
        >
          <p className="text-sm font-medium text-[var(--brand)]">
            Journey creation
          </p>

          <h1
            id="journey-review-route-error-title"
            className="mt-1 text-lg font-semibold text-[var(--foreground)]"
          >
            Review journey
          </h1>

          <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
            Something went wrong while opening the journey review.
          </p>

          <button
            type="button"
            onClick={reset}
            className="mt-5 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--background-subtle)]"
          >
            Try again
          </button>
        </section>
      </div>
    </main>
  );
}