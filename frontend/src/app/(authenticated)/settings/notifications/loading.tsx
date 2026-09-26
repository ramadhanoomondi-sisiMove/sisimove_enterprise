import { Card, Skeleton } from '@/components/ui';

// -----------------------------------------------------------------------------
// sisiMove — Notification Settings Loading State
// -----------------------------------------------------------------------------

export default function NotificationSettingsLoading() {
  return (
    <main className="page-container py-6 sm:py-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-5">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="mt-2 h-4 w-80" />
        </header>

        <Card padding="lg">
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-56" />
                </div>

                <Skeleton className="h-6 w-11 shrink-0 rounded-full" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}

