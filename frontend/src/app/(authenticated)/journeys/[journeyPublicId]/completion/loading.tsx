// -----------------------------------------------------------------------------
// sisiMove — Journey Completion Loading State
// -----------------------------------------------------------------------------
//
// Route-level loading UI for:
//
//   /journeys/[journeyPublicId]/completion
//
// Responsibilities:
// - provide an immediate loading shell while the Completion page resolves;
// - mirror the compact authenticated Journey layout;
// - remain purely presentational.
//
// Non-responsibilities:
// - data fetching;
// - mutation handling;
// - completion-state decisions;
// - settlement-state decisions.
//
// The actual Completion page remains responsible for backend-derived state.
// -----------------------------------------------------------------------------

import { Card, Container, Skeleton } from '@/components/ui';

export default function JourneyCompletionLoading() {
  return (
    <div className="page-shell">
      <Container className="page-container">
        <div className="section-sm">
          <Skeleton className="h-4 w-32" />

          <div className="mt-4 flex flex-col gap-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>
        </div>

        <div className="section">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <main className="min-w-0">
              <div className="flex flex-col gap-4">
                <Card variant="default" padding="md">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-64 max-w-full" />
                      </div>

                      <Skeleton className="h-6 w-28 shrink-0" />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-2 w-full" />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  </div>
                </Card>

                <Card variant="default" padding="md">
                  <div className="flex flex-col gap-4">
                    <Skeleton className="h-6 w-32" />

                    <div className="flex flex-col gap-3">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  </div>
                </Card>

                <Card variant="default" padding="md">
                  <div className="flex flex-col gap-4">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </Card>
              </div>
            </main>

            <aside className="min-w-0">
              <div className="flex flex-col gap-4">
                <Card variant="default" padding="md">
                  <div className="flex flex-col gap-3">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </Card>

                <Card variant="default" padding="md">
                  <div className="flex flex-col gap-3">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </Container>
    </div>
  );
}