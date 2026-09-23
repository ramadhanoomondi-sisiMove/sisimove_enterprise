// -----------------------------------------------------------------------------
// sisiMove — Journey Creation — Route Error Boundary
// -----------------------------------------------------------------------------
//
// Next.js route-level error boundary.
//
// Responsibilities:
// - Present an unexpected Route-step failure.
// - Allow the user to retry the failed route segment.
//
// Non-responsibilities:
// - No API calls.
// - No Journey mutation.
// - No error normalization.
// - No workflow navigation.
// - No domain/business-rule handling.
//
// -----------------------------------------------------------------------------

'use client';

import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

// =============================================================================
// Types
// =============================================================================

interface JourneyRouteErrorProps {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
}

// =============================================================================
// Error boundary
// =============================================================================

export default function JourneyRouteError({
  error,
  reset,
}: JourneyRouteErrorProps) {
  useEffect(() => {
    console.error(
      'sisiMove Journey Route error:',
      error,
    );
  }, [error]);

  return (
    <main className="min-h-[60vh] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-2xl">
        <section
          aria-labelledby="journey-route-error-title"
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"
        >
          <p className="text-sm font-medium text-[var(--brand)]">
            Journey creation
          </p>

          <h1
            id="journey-route-error-title"
            className="mt-1 text-xl font-semibold text-[var(--foreground)]"
          >
            We could not load this route
          </h1>

          <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
            Something went wrong while loading this part of your
            journey. Your saved journey data has not been changed.
          </p>

          <div className="mt-5">
            <Button
              type="button"
              onClick={reset}
            >
              Try again
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}

