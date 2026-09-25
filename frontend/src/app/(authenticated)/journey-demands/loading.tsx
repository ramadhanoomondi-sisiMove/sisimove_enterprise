// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Management Loading State
// -----------------------------------------------------------------------------
//
// Route-level loading UI for the authenticated Journey Demand management
// surface.
//
// Next.js renders this while the page segment is loading.
// -----------------------------------------------------------------------------

import { Skeleton } from '@/components/ui';

export default function JourneyDemandsLoading() {
  return (
    <div className="page-shell">
      <div className="page-container">
        <section className="section">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="space-y-2">
              <Skeleton
                width="12rem"
                height="1.75rem"
              />

              <Skeleton
                width="20rem"
                height="1rem"
              />
            </div>

            <Skeleton
              width="7.5rem"
              height="2.25rem"
              radius="md"
            />
          </div>

          <div className="space-y-3">
            <Skeleton
              width="100%"
              height="8rem"
              radius="lg"
            />

            <Skeleton
              width="100%"
              height="8rem"
              radius="lg"
            />

            <Skeleton
              width="100%"
              height="8rem"
              radius="lg"
            />
          </div>
        </section>
      </div>
    </div>
  );
}