'use client';

// -----------------------------------------------------------------------------
// sisiMove — My Journey Bookings Error State
// -----------------------------------------------------------------------------
//
// Route-level error boundary for /my-bookings.
//
// Responsibilities:
// - Present a recoverable error state when the booking page fails.
// - Allow the user to retry the failed route segment.
// - Keep error presentation compact and consistent with the authenticated UI.
//
// Non-responsibilities:
// - Inspecting or exposing backend error internals.
// - Performing booking mutations.
// - Fetching bookings directly.
// - Reconstructing booking state.
//
// Next.js requires this file to be a Client Component because the `reset`
// callback is supplied by the App Router error boundary.
// -----------------------------------------------------------------------------

import { useEffect } from 'react';

import { Button } from '@/components/ui';

export interface MyBookingsErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function MyBookingsError({
  error,
  reset,
}: MyBookingsErrorProps) {
  useEffect(() => {
    // Keep the error object available to the runtime for diagnostics without
    // exposing implementation details to the user interface.
    void error;
  }, [error]);

  return (
    <main className="page-shell">
      <div className="page-container">
        <section
          aria-labelledby="my-bookings-error-title"
          className="section-sm"
        >
          <div className="rounded-[var(--radius-lg)] border border-[var(--danger)] bg-[var(--danger-soft)] p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--danger)]">
              Bookings
            </p>

            <h1
              id="my-bookings-error-title"
              className="mt-1 text-base font-semibold text-[var(--foreground)]"
            >
              We couldn&apos;t load your bookings
            </h1>

            <p className="mt-2 max-w-md text-sm text-[var(--foreground-secondary)]">
              Something went wrong while loading your bookings. Please try
              again.
            </p>

            <div className="mt-4">
              <Button
                type="button"
                variant="primary"
                onClick={reset}
              >
                Try again
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}