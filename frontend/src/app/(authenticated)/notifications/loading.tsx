// -----------------------------------------------------------------------------
// sisiMove — Notifications Loading
// -----------------------------------------------------------------------------
//
// Next.js route-level loading boundary for the authenticated Notifications
// surface.
//
// This is a route transition/loading boundary only.
//
// Notification query loading remains owned by the Notification component
// hierarchy.
// -----------------------------------------------------------------------------

import {
  Card,
  Skeleton,
} from '@/components/ui';

export default function NotificationsLoading() {
  return (
    <main className="page-container py-6 sm:py-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-5">
          <Skeleton className="h-7 w-36" />

          <Skeleton className="mt-2 h-4 w-72" />
        </header>

        <Card padding="none">
          <div className="divide-y divide-[var(--border-subtle)]">
            {Array.from({ length: 5 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="p-4 sm:p-5"
                >
                  <div className="flex gap-3">
                    <Skeleton className="h-9 w-9 shrink-0 rounded-full" />

                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-4 w-40" />

                      <Skeleton className="h-4 w-full max-w-xl" />

                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}

