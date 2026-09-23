'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Seats Error Boundary
// -----------------------------------------------------------------------------
//
// Route-level error boundary for the Journey Seats step.
//
// Responsibilities:
// - Present a recoverable route-level error.
// - Allow Next.js to retry rendering the route.
//
// Non-responsibilities:
// - No API calls.
// - No capacity mutation.
// - No workflow navigation.
// - No domain/business logic.
// -----------------------------------------------------------------------------

interface JourneyCapacityErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function JourneyCapacityError({
  error,
  reset,
}: JourneyCapacityErrorProps) {
  return (
    <main className="px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
          <p className="text-sm font-semibold text-[var(--danger)]">
            Something went wrong
          </p>

          <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
            {error.message ||
              'We could not load the passenger seats step.'}
          </p>

          <button
            type="button"
            onClick={reset}
            className="mt-4 text-sm font-semibold text-[var(--brand)] hover:text-[var(--brand-hover)]"
          >
            Try again
          </button>
        </div>
      </div>
    </main>
  );
}

