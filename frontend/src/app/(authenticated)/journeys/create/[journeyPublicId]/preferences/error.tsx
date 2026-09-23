'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Preferences Route Error
// -----------------------------------------------------------------------------

import { useEffect } from 'react';

interface JourneyPreferencesErrorProps {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
}

export default function JourneyPreferencesError({
  error,
  reset,
}: JourneyPreferencesErrorProps) {
  useEffect(() => {
    console.error(
      'Journey preferences route error:',
      error,
    );
  }, [error]);

  return (
    <main className="min-h-[60vh] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-2xl">
        <section
          aria-labelledby="journey-preferences-route-error-title"
          className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 sm:p-6"
        >
          <p className="text-sm font-medium text-[var(--brand)]">
            Journey creation
          </p>

          <h1
            id="journey-preferences-route-error-title"
            className="mt-1 text-lg font-semibold text-[var(--foreground)]"
          >
            Journey preferences
          </h1>

          <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
            Something went wrong while opening this step.
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