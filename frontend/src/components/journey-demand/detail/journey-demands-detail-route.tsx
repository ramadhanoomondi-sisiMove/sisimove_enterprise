// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand Detail Route Container
// -----------------------------------------------------------------------------
//
// Client-side container for one public Journey Demand.
//
// Responsibilities:
// - receive the route's publicId;
// - load the public Journey Demand projection;
// - delegate loading through useJourneyDemand;
// - throw query errors to the route error boundary;
// - handle the missing-resource case;
// - pass the loaded PublicJourneyDemand to JourneyDemandDetail.
//
// Non-responsibilities:
// - no detail presentation;
// - no projection mapping;
// - no mutation handling;
// - no authorization decisions;
// - no lifecycle reconstruction;
// - no route construction.
//
// Architecture:
//
//   /demands/[publicId]
//          ↓
//   JourneyDemandDetailRoute
//          ↓
//   useJourneyDemand(publicId)
//          ↓
//   PublicJourneyDemand
//          ↓
//   JourneyDemandDetail
// -----------------------------------------------------------------------------

'use client';

import { Skeleton } from '@/components/ui';

import { useJourneyDemand } from '@/features/journey-demand/hooks';

import { JourneyDemandDetail } from './journey-demand-detail';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDemandsDetailRouteProps {
  readonly publicId: string;
}

// -----------------------------------------------------------------------------
// Loading
// -----------------------------------------------------------------------------

function JourneyDemandDetailRouteLoading() {
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
                {/* Header */}

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

                {/* Requester */}

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

                {/* Route */}

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

                {/* Detail summaries */}

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

                {/* Actions */}

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

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandsDetailRoute({
  publicId,
}: JourneyDemandsDetailRouteProps) {
  const {
    data,
    isLoading,
    error,
  } = useJourneyDemand(publicId);

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return <JourneyDemandDetailRouteLoading />;
  }

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------
  //
  // Throwing allows the route-level error.tsx to own the public error surface.
  // The route container therefore does not duplicate error presentation.
  // ---------------------------------------------------------------------------

  if (error !== null) {
    throw error;
  }

  // ---------------------------------------------------------------------------
  // Missing resource
  // ---------------------------------------------------------------------------
  //
  // A successful request without a projection is still an invalid detail
  // resource for this route. The route error boundary handles it consistently.
  // ---------------------------------------------------------------------------

  if (data === null) {
    throw new Error(
      'Journey Demand was not found.',
    );
  }

  // ---------------------------------------------------------------------------
  // Loaded public projection
  // ---------------------------------------------------------------------------

  return (
    <JourneyDemandDetail
      demand={data}
    />
  );
}

