// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand Marketplace Loading
// -----------------------------------------------------------------------------
//
// Route-level loading UI for:
//
//   /demands
//
// Responsibilities:
// - provide immediate marketplace feedback while the public demand query loads;
// - preserve the compact, mobile-first marketplace layout;
// - approximate the Journey Demand card structure without rendering real data.
//
// Non-responsibilities:
// - no data fetching;
// - no query ownership;
// - no error handling;
// - no empty-state handling;
// - no business-state reconstruction;
// - no dependency on JourneyDemandMarketplace;
// - no dependency on JourneyDemandCard.
//
// Next.js renders this route-level loading UI while the page segment is loading.
// -----------------------------------------------------------------------------

import { Skeleton } from '@/components/ui';

const SKELETON_ITEMS = [0, 1, 2] as const;

export default function JourneyDemandsLoading() {
  return (
    <main
      className="page-shell"
      aria-busy="true"
      aria-label="Loading journey demands"
    >
      <div className="page-container">
        <span className="sr-only">
          Loading journey demands…
        </span>

        <section
          className="space-y-4 py-6 sm:py-8"
          aria-hidden="true"
        >
          {/* -----------------------------------------------------------------
              Marketplace heading
              ----------------------------------------------------------------- */}

          <div className="space-y-2">
            <Skeleton
              className="h-7 w-48"
              radius="md"
            />

            <Skeleton
              className="h-4 w-72 max-w-full"
              radius="sm"
            />
          </div>

          {/* -----------------------------------------------------------------
              Demand cards
              ----------------------------------------------------------------- */}

          <div className="w-full space-y-3">
            {SKELETON_ITEMS.map((item) => (
              <div
                key={item}
                className="w-full overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)] sm:p-5"
              >
                <div className="space-y-4">
                  {/* Header */}

                  <div className="flex items-start justify-between gap-3">
                    <Skeleton
                      className="h-5 w-32"
                      radius="sm"
                    />

                    <Skeleton
                      className="h-6 w-16"
                      radius="full"
                    />
                  </div>

                  {/* Requester */}

                  <div className="flex min-w-0 items-center gap-3">
                    <Skeleton
                      className="h-9 w-9 shrink-0"
                      radius="full"
                    />

                    <div className="min-w-0 flex-1 space-y-1.5">
                      <Skeleton
                        className="h-4 w-28"
                        radius="sm"
                      />

                      <Skeleton
                        className="h-3 w-44 max-w-full"
                        radius="sm"
                      />
                    </div>
                  </div>

                  {/* Route */}

                  <div className="space-y-2">
                    <Skeleton
                      className="h-5 w-64 max-w-full"
                      radius="sm"
                    />

                    <Skeleton
                      className="h-3 w-36"
                      radius="sm"
                    />
                  </div>

                  {/* Demand */}

                  <Skeleton
                    className="h-4 w-40"
                    radius="sm"
                  />

                  {/* Schedule + pricing */}

                  <div className="flex flex-col gap-3 border-t border-[var(--border-subtle)] pt-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-1.5">
                      <Skeleton
                        className="h-4 w-36"
                        radius="sm"
                      />

                      <Skeleton
                        className="h-3 w-44"
                        radius="sm"
                      />
                    </div>

                    <Skeleton
                      className="h-5 w-32 sm:ml-auto"
                      radius="sm"
                    />
                  </div>

                  {/* Actions */}

                  <div className="flex gap-2">
                    <Skeleton
                      className="h-9 flex-1 sm:w-28 sm:flex-none"
                      radius="md"
                    />

                    <Skeleton
                      className="h-9 flex-1 sm:w-28 sm:flex-none"
                      radius="md"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
