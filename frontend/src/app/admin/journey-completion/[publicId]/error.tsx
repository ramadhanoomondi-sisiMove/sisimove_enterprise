
'use client';

import { useEffect } from 'react';

interface JourneyCompletionDetailErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function JourneyCompletionDetailError({
  error,
  reset,
}: JourneyCompletionDetailErrorProps) {
  useEffect(() => {
    console.error('Journey completion detail page error:', error);
  }, [error]);

  return (
    <main className="page-shell">
      <div className="page-container">
        <section
          role="alert"
          className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger-soft)] p-6"
        >
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Unable to load journey completion
            </h2>

            <p className="text-sm text-[var(--foreground-secondary)]">
              Something went wrong while loading this journey completion.
              Please try again.
            </p>

            {error.digest ? (
              <p className="text-xs text-[var(--foreground-muted)]">
                Error reference: {error.digest}
              </p>
            ) : null}

            <button
              type="button"
              onClick={reset}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--background-subtle)]"
            >
              Try again
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
