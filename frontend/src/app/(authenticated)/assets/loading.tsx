// -----------------------------------------------------------------------------
// sisiMove — Assets Loading State
// -----------------------------------------------------------------------------
//
// Route-level loading UI for the authenticated Assets page.
//
// The actual Asset collection skeleton is owned by AssetManager. This route
// loading boundary provides immediate feedback while the page segment is
// loading.
//
// -----------------------------------------------------------------------------

import { Card, Skeleton } from '@/components/ui';

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function AssetsLoading() {
  return (
    <div className="flex flex-col gap-6">
      {/* ----------------------------------------------------------------- */}
      {/* Header                                                            */}
      {/* ----------------------------------------------------------------- */}

      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton
            className="h-6 w-40"
            radius="sm"
          />

          <Skeleton
            className="h-4 w-72"
            radius="sm"
          />
        </div>

        <Skeleton
          className="h-10 w-28"
          radius="md"
        />
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Asset collection                                                  */}
      {/* ----------------------------------------------------------------- */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card
            key={index}
            padding="md"
          >
            <div className="flex flex-col gap-4">
              <Skeleton
                className="h-28 w-full"
                radius="lg"
              />

              <div className="flex flex-col gap-2">
                <Skeleton
                  className="h-4 w-3/4"
                  radius="sm"
                />

                <Skeleton
                  className="h-3.5 w-1/2"
                  radius="sm"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}