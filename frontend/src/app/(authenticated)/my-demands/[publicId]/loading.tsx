// -----------------------------------------------------------------------------
// sisiMove — My Journey Demand Loading
// -----------------------------------------------------------------------------
//
// App Router loading boundary for the authenticated Journey Demand detail.
//
// This file contains presentation only.
// Data fetching remains owned by MyJourneyDemandDetailRoute.
//
// -----------------------------------------------------------------------------

import { cn } from '@/foundation';

export default function MyJourneyDemandLoading() {
  return (
    <main
      className="page-container"
      aria-busy="true"
      aria-labelledby="my-journey-demand-loading-heading"
    >
      <section className="surface min-w-0 p-4 sm:p-5">
        <h1
          id="my-journey-demand-loading-heading"
          className="sr-only"
        >
          Loading Journey Demand
        </h1>

        <div
          className={cn(
            'min-w-0 space-y-4',
          )}
        >
          <div
            className="h-4 w-24 animate-pulse rounded bg-background-subtle"
            aria-hidden="true"
          />

          <div
            className="h-7 w-72 max-w-full animate-pulse rounded bg-background-subtle"
            aria-hidden="true"
          />

          <div
            className="h-5 w-20 animate-pulse rounded-full bg-background-subtle"
            aria-hidden="true"
          />

          <div className="space-y-3">
            <div
              className="h-20 w-full animate-pulse rounded-lg bg-background-subtle"
              aria-hidden="true"
            />

            <div
              className="h-20 w-full animate-pulse rounded-lg bg-background-subtle"
              aria-hidden="true"
            />

            <div
              className="h-20 w-full animate-pulse rounded-lg bg-background-subtle"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

