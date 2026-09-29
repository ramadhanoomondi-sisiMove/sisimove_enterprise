// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Loading
// -----------------------------------------------------------------------------
//
// Route-level loading UI for:
//
//     /journeys/[journeyPublicId]/boarding
//
// Responsibilities:
// - Provide immediate visual feedback while the boarding page loads.
// - Match the authenticated SisiMove layout.
// - Reuse the frozen design-system tokens.
//
// This component intentionally contains no:
// - API calls,
// - authentication logic,
// - boarding state,
// - business rules,
// - mutation logic.
// -----------------------------------------------------------------------------

import { Container, Skeleton } from '@/components/ui';

// -----------------------------------------------------------------------------
// Loading
// -----------------------------------------------------------------------------

export default function Loading() {
  return (
    <div className="page-shell">
      <Container className="page-container">
        {/* ----------------------------------------------------------------- */}
        {/* Page heading                                                       */}
        {/* ----------------------------------------------------------------- */}

        <div className="section-sm">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32" />

            <Skeleton className="h-7 w-52" />

            <Skeleton className="h-4 w-80 max-w-full" />
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Boarding dashboard                                                 */}
        {/* ----------------------------------------------------------------- */}

        <div className="section">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
            {/* ------------------------------------------------------------- */}
            {/* Main column                                                     */}
            {/* ------------------------------------------------------------- */}

            <div className="flex min-w-0 flex-col gap-4">
              {/* Summary */}
              <Skeleton className="h-40 w-full rounded-[var(--radius-lg)]" />

              {/* Progress */}
              <Skeleton className="h-32 w-full rounded-[var(--radius-lg)]" />

              {/* Provider */}
              <Skeleton className="h-28 w-full rounded-[var(--radius-lg)]" />

              {/* Participants */}
              <Skeleton className="h-64 w-full rounded-[var(--radius-lg)]" />

              {/* Activity */}
              <Skeleton className="h-64 w-full rounded-[var(--radius-lg)]" />
            </div>

            {/* ------------------------------------------------------------- */}
            {/* Action column                                                   */}
            {/* ------------------------------------------------------------- */}

            <div className="flex min-w-0 flex-col gap-4">
              <Skeleton className="h-56 w-full rounded-[var(--radius-lg)]" />

              <Skeleton className="h-28 w-full rounded-[var(--radius-lg)]" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}