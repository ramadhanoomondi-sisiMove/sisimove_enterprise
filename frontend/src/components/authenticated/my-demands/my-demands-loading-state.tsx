// -----------------------------------------------------------------------------
// sisiMove — My Demands Loading State
// -----------------------------------------------------------------------------
//
// Loading presentation for the authenticated My Demands view.
//
// This component intentionally mirrors the general shape of the Journey
// Demand collection without knowing the Journey Demand feature model.
//
// It does not:
// - fetch data;
// - own loading state;
// - know about authentication;
// - know about verification;
// - know about Journey Demand lifecycle rules.
//
// The parent page decides when this state is displayed.
// -----------------------------------------------------------------------------

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const SKELETON_ITEMS = 3;

// -----------------------------------------------------------------------------
// My Demands Loading State
// -----------------------------------------------------------------------------

export function MyDemandsLoadingState() {
  return (
    <div
      className="grid gap-4"
      aria-label="Loading your travel demands"
      aria-busy="true"
    >
      {Array.from({ length: SKELETON_ITEMS }, (_, index) => (
        <Card
          key={index}
          padding="lg"
          aria-hidden="true"
        >
          <div className="space-y-5">
            {/* ---------------------------------------------------------------- */}
            {/* Header                                                           */}
            {/* ---------------------------------------------------------------- */}

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <Skeleton
                  className="h-5 w-40"
                  radius="sm"
                />

                <Skeleton
                  className="h-4 w-56"
                  radius="sm"
                />
              </div>

              <Skeleton
                className="h-6 w-20"
                radius="full"
              />
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* Demand details                                                   */}
            {/* ---------------------------------------------------------------- */}

            <div className="grid gap-4 sm:grid-cols-3">
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

              <div className="space-y-2">
                <Skeleton
                  className="h-3 w-16"
                  radius="sm"
                />

                <Skeleton
                  className="h-5 w-28"
                  radius="sm"
                />
              </div>

              <div className="space-y-2">
                <Skeleton
                  className="h-3 w-16"
                  radius="sm"
                />

                <Skeleton
                  className="h-5 w-24"
                  radius="sm"
                />
              </div>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* Actions                                                          */}
            {/* ---------------------------------------------------------------- */}

            <div className="flex justify-end gap-3 pt-1">
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