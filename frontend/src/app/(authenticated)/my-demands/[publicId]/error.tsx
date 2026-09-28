'use client';

// -----------------------------------------------------------------------------
// sisiMove — My Journey Demand Error
// -----------------------------------------------------------------------------
//
// App Router error boundary for the authenticated Journey Demand detail.
//
// This boundary:
// - presents the error;
// - allows the route segment to be retried.
//
// It does not:
// - inspect ownership;
// - interpret backend lifecycle state;
// - perform API calls directly;
// - reconstruct Journey Demand state.
//
// `reset()` is supplied by Next.js and retries rendering the failed route
// segment.
//
// -----------------------------------------------------------------------------

import { cn } from '@/foundation';

interface MyJourneyDemandErrorProps {
  readonly error: Error & {
    readonly digest?: string;
  };
  readonly reset: () => void;
}

export default function MyJourneyDemandError({
  error,
  reset,
}: MyJourneyDemandErrorProps) {
  return (
    <main
      className="page-container"
      aria-labelledby="my-journey-demand-error-heading"
    >
      <section className="surface min-w-0 p-4 sm:p-5">
        <div className="min-w-0">
          <h1
            id="my-journey-demand-error-heading"
            className="text-base font-semibold text-foreground"
          >
            Unable to load Journey Demand
          </h1>

          <p className="mt-1 text-sm text-foreground-muted">
            {error.message ||
              'Something went wrong while loading this Journey Demand.'}
          </p>

          <button
            type="button"
            onClick={reset}
            className={cn(
              'mt-4 inline-flex items-center justify-center',
              'rounded-md border border-border',
              'px-3 py-2',
              'text-sm font-medium text-foreground',
              'transition-colors',
              'hover:bg-background-subtle',
              'focus-visible:outline-none',
              'focus-visible:ring-2',
              'focus-visible:ring-brand',
              'focus-visible:ring-offset-2',
            )}
          >
            Try again
          </button>
        </div>
      </section>
    </main>
  );
}

