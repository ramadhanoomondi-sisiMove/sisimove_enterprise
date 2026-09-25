// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Detail Loading State
// -----------------------------------------------------------------------------
//
// Route-level loading UI for the authenticated Journey Demand detail surface.
// -----------------------------------------------------------------------------

import { Skeleton } from '@/components/ui';

export default function JourneyDemandDetailLoading() {
  return (
    <div className="page-shell">
      <div className="page-container">
        <section className="section">
          <div className="space-y-4">
            <Skeleton
              width="100%"
              height="9rem"
              radius="lg"
            />

            <Skeleton
              width="100%"
              height="12rem"
              radius="lg"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton
                width="100%"
                height="10rem"
                radius="lg"
              />

              <Skeleton
                width="100%"
                height="10rem"
                radius="lg"
              />
            </div>

            <Skeleton
              width="100%"
              height="10rem"
              radius="lg"
            />

            <Skeleton
              width="100%"
              height="10rem"
              radius="lg"
            />
          </div>
        </section>
      </div>
    </div>
  );
}