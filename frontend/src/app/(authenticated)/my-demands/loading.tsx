// -----------------------------------------------------------------------------
// sisiMove — My Journey Demands Loading State
// -----------------------------------------------------------------------------
//
// Route-segment loading UI for:
//
//   /my-demands
//
// This boundary covers the authenticated route while the route segment is
// loading. The Journey Demand route container also owns its client-side query
// loading state, so this skeleton intentionally mirrors the same compact
// presentation without introducing data-fetching logic.
//
// Non-responsibilities:
// - no data fetching;
// - no Journey Demand state;
// - no business-state derivation;
// - no authentication logic.
// -----------------------------------------------------------------------------

import { Skeleton } from '@/components/ui';

export default function MyJourneyDemandsLoading() {
  return (
    <main
      className="page-shell"
      aria-label="Loading your travel needs"
      aria-busy="true"
    >
      <div className="page-container">
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton
              className="h-7 w-44"
              radius="sm"
            />

            <Skeleton
              className="h-4 w-72 max-w-full"
              radius="sm"
            />
          </div>

          <div className="min-w-0 space-y-3">
            <Skeleton
              className="h-36 w-full"
              radius="lg"
            />

            <Skeleton
              className="h-36 w-full"
              radius="lg"
            />

            <Skeleton
              className="h-36 w-full"
              radius="lg"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

