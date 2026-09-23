// -----------------------------------------------------------------------------
// sisiMove — Journey Creation — Schedule Error Boundary
// -----------------------------------------------------------------------------
//
// Route-level error boundary for:
//
//   /authenticated/journeys/create/:journeyPublicId/schedule
//
// Responsibilities:
// - Catch unexpected errors within the Schedule route segment.
// - Provide a safe retry action.
//
// Expected query and mutation errors are handled by the page itself.
// Unexpected route errors are handled here.
//
// -----------------------------------------------------------------------------

'use client';

import {
  useEffect,
} from 'react';

import {
  Button,
} from '@/components/ui/button';

// =============================================================================
// Types
// =============================================================================

interface JourneyScheduleErrorProps {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
}

// =============================================================================
// Error boundary
// =============================================================================

export default function JourneyScheduleError({
  error,
  reset,
}: JourneyScheduleErrorProps) {
  // ---------------------------------------------------------------------------
  // Log unexpected errors.
  // ---------------------------------------------------------------------------

  useEffect(() => {
    console.error(
      'Journey schedule route error:',
      error,
    );
  }, [error]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <main className="min-h-[60vh] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-2xl">
        <section
          role="alert"
          aria-labelledby="journey-schedule-error-title"
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"
        >
          <p className="text-sm font-medium text-[var(--brand)]">
            Journey creation
          </p>

          <h1
            id="journey-schedule-error-title"
            className="mt-1 text-xl font-semibold text-[var(--foreground)]"
          >
            Schedule
          </h1>

          <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
            We could not load this step of your journey. Please try again.
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

