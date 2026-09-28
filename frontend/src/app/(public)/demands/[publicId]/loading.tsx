// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand Detail Loading
// -----------------------------------------------------------------------------
//
// Route-level loading UI for:
//
//   /demands/[publicId]
//
// Responsibilities:
// - provide immediate feedback while the public demand detail route loads;
// - preserve the compact SisiMove marketplace visual language.
//
// Non-responsibilities:
// - no data fetching;
// - no query ownership;
// - no public Journey Demand reconstruction;
// - no dependency on the detail query;
// - no error handling.
//
// -----------------------------------------------------------------------------

import { Skeleton } from '@/components/ui';

export default function JourneyDemandDetailLoading() {
  return (
    <main
      className="page-shell"
      aria-busy="true"
      aria-label="Loading journey demand"
    >
      <div className="page-container">
        <span className="sr-only">
          Loading journey demand…
        </span>

        <section
          className="py-6 sm:py-8"
          aria-hidden="true"
        >
          <div className="mx-auto w-full max-w-3xl">
            <div className="surface p-4 shadow-[var(--shadow-sm)] sm:p-6">
              <div className="space-y-5">
                {/* -----------------------------------------------------------
                    Header
                    ----------------------------------------------------------- */}

                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton
                      className="h-5 w-36"
                      radius="sm"
                    />

                    <Skeleton
                      className="h-7 w-64 max-w-full"
                      radius="md"
                    />
                  </div>

                  <Skeleton
                    className="h-6 w-16 shrink-0"
                    radius="full"
                  />
                </div>

                {/* -----------------------------------------------------------
                    Requester
                    ----------------------------------------------------------- */}

                <div className="flex items-center gap-3">
                  <Skeleton
                    className="h-10 w-10 shrink-0"
                    radius="full"
                  />

                  <div className="min-w-0 flex-1 space-y-1.5">
                    <Skeleton
                      className="h-4 w-32"
                      radius="sm"
                    />

                    <Skeleton
                      className="h-3 w-52 max-w-full"
                      radius="sm"
                    />
                  </div>
                </div>

                {/* -----------------------------------------------------------
                    Route
                    ----------------------------------------------------------- */}

                <div className="space-y-2">
                  <Skeleton
                    className="h-7 w-72 max-w-full"
                    radius="md"
                  />

                  <Skeleton
                    className="h-4 w-48 max-w-full"
                    radius="sm"
                  />

                  <Skeleton
                    className="h-4 w-40 max-w-full"
                    radius="sm"
                  />
                </div>

                {/* -----------------------------------------------------------
                    Demand / schedule / pricing
                    ----------------------------------------------------------- */}

                <div className="border-t border-[var(--border-subtle)] pt-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Skeleton
                        className="h-3 w-20"
                        radius="sm"
                      />

                      <Skeleton
                        className="h-5 w-32"
                        radius="sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Skeleton
                        className="h-3 w-24"
                        radius="sm"
                      />

                      <Skeleton
                        className="h-5 w-36"
                        radius="sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Skeleton
                        className="h-3 w-16"
                        radius="sm"
                      />

                      <Skeleton
                        className="h-5 w-32"
                        radius="sm"
                      />
                    </div>
                  </div>
                </div>

                {/* -----------------------------------------------------------
                    Actions
                    ----------------------------------------------------------- */}

                <div className="flex gap-2 border-t border-[var(--border-subtle)] pt-4">
                  <Skeleton
                    className="h-10 flex-1 sm:w-32 sm:flex-none"
                    radius="md"
                  />

                  <Skeleton
                    className="h-10 flex-1 sm:w-32 sm:flex-none"
                    radius="md"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

