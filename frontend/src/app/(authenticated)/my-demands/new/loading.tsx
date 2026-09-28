// -----------------------------------------------------------------------------
// sisiMove — Create Journey Demand Loading State
// -----------------------------------------------------------------------------
//
// Route-segment loading UI for:
//
//   /my-demands/new
//
// This boundary owns only route loading presentation. It does not construct,
// fetch, validate, or submit a Journey Demand.
//
// The skeleton mirrors the compact multi-step creation experience.
//
// -----------------------------------------------------------------------------

import { Skeleton } from '@/components/ui';

export default function NewJourneyDemandLoading() {
  return (
    <main
      className="page-shell"
      aria-label="Loading journey demand creation"
      aria-busy="true"
    >
      <div className="page-container">
        <div className="mx-auto w-full max-w-2xl">
          <div className="space-y-2">
            <Skeleton
              className="h-7 w-56"
              radius="sm"
            />

            <Skeleton
              className="h-4 w-80 max-w-full"
              radius="sm"
            />
          </div>

          <div className="mt-6 space-y-4">
            <Skeleton
              className="h-12 w-full"
              radius="lg"
            />

            <Skeleton
              className="h-52 w-full"
              radius="lg"
            />

            <div className="flex flex-col gap-3 border-t border-[var(--border-subtle)] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <Skeleton
                className="h-10 w-20"
                radius="md"
              />

              <Skeleton
                className="h-10 w-28"
                radius="md"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

