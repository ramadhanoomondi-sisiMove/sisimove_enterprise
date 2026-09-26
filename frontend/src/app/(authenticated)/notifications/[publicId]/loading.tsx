import { Card, Skeleton } from '@/components/ui';

// -----------------------------------------------------------------------------
// sisiMove — Notification Detail Loading State
// -----------------------------------------------------------------------------

export default function NotificationDetailLoading() {
  return (
    <main className="page-container py-6 sm:py-8">
      <div className="mx-auto max-w-3xl">
        <Card padding="lg">
          <div className="flex items-start gap-3">
            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />

            <div className="min-w-0 flex-1 space-y-3">
              <Skeleton className="h-5 w-56" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <div className="mt-6 border-t border-[var(--border-subtle)] pt-4">
            <Skeleton className="h-3 w-32" />
          </div>
        </Card>
      </div>
    </main>
  );
}

