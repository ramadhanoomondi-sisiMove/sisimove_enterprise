// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Creation Loading State
// -----------------------------------------------------------------------------
//
// Route-level loading UI for the Journey Demand creation entry point.
//
// This state is intentionally simple because the entry route immediately
// creates the server-side DRAFT and redirects into the creation wizard.
// -----------------------------------------------------------------------------

import { Skeleton } from '@/components/ui';

export default function JourneyDemandCreateLoading() {
  return (
    <div className="page-shell">
      <div className="page-container">
        <section className="section">
          <div className="mx-auto w-full max-w-3xl">
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton
                  width="10rem"
                  height="1.25rem"
                />

                <Skeleton
                  width="16rem"
                  height="0.875rem"
                />
              </div>

              <Skeleton
                width="100%"
                height="18rem"
                radius="lg"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}