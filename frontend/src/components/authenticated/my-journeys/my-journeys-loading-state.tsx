// -----------------------------------------------------------------------------
// sisiMove — My Journeys Loading State
// -----------------------------------------------------------------------------
//
// Loading presentation for the authenticated My Journeys view.
//
// This component intentionally mirrors the general shape of the journey
// collection without knowing the Journey feature model.
//
// It does not:
// - fetch data;
// - own loading state;
// - know about authentication;
// - know about Journey lifecycle rules.
//
// The parent page decides when this state is displayed.
//
// Design intent:
// - Follow the focused My Journeys content rail.
// - Keep skeleton cards compact on mobile.
// - Avoid excessive horizontal distribution.
// - Preserve the visual hierarchy of the eventual Journey cards.
// - Transition naturally from stacked mobile content to a denser desktop
//   presentation.
//
// -----------------------------------------------------------------------------

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const SKELETON_ITEMS = 3;

// -----------------------------------------------------------------------------
// My Journeys Loading State
// -----------------------------------------------------------------------------

export function MyJourneysLoadingState() {
  return (
    <div
      className="grid w-full gap-4"
      aria-label="Loading your journeys"
      aria-busy="true"
    >
      {Array.from({ length: SKELETON_ITEMS }, (_, index) => (
        <Card
          key={index}
          padding="lg"
          aria-hidden="true"
        >
          <div className="space-y-5">

            {/* -----------------------------------------------------------------
                Journey heading
                ----------------------------------------------------------------- */}

            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton
                  className="h-5 w-40 max-w-full"
                  radius="sm"
                />

                <Skeleton
                  className="h-4 w-56 max-w-full"
                  radius="sm"
                />
              </div>

              <Skeleton
                className="h-6 w-20 shrink-0"
                radius="full"
              />
            </div>

            {/* -----------------------------------------------------------------
                Journey details
                -----------------------------------------------------------------
                
                Details remain stacked on small screens and become a compact
                three-column layout only when there is enough horizontal space.
                ----------------------------------------------------------------- */}

            <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
              <div className="space-y-2">
                <Skeleton
                  className="h-3 w-16"
                  radius="sm"
                />

                <Skeleton
                  className="h-5 w-32 max-w-full"
                  radius="sm"
                />
              </div>

              <div className="space-y-2">
                <Skeleton
                  className="h-3 w-16"
                  radius="sm"
                />

                <Skeleton
                  className="h-5 w-28 max-w-full"
                  radius="sm"
                />
              </div>

              <div className="space-y-2">
                <Skeleton
                  className="h-3 w-16"
                  radius="sm"
                />

                <Skeleton
                  className="h-5 w-24 max-w-full"
                  radius="sm"
                />
              </div>
            </div>

            {/* -----------------------------------------------------------------
                Actions
                ----------------------------------------------------------------- */}

            <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border-subtle)] pt-4">
              <Skeleton
                className="h-10 w-24"
                radius="md"
              />

              <Skeleton
                className="h-10 w-20"
                radius="md"
              />
            </div>

          </div>
        </Card>
      ))}
    </div>
  );
}

export default MyJourneysLoadingState;