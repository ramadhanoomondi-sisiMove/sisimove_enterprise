'use client';

import { Button, Card } from '@/components/ui';

// -----------------------------------------------------------------------------
// sisiMove — Notification Detail Error State
// -----------------------------------------------------------------------------

interface NotificationDetailErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function NotificationDetailError({
  reset,
}: NotificationDetailErrorProps) {
  return (
    <main className="page-container py-6 sm:py-8">
      <div className="mx-auto max-w-3xl">
        <Card padding="lg">
          <div className="text-center">
            <h1 className="text-base font-semibold text-[var(--foreground)]">
              Unable to load notification
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--foreground-muted)]">
              Something went wrong while loading this notification.
              Please try again.
            </p>

            <div className="mt-5">
              <Button
                variant="outline"
                size="sm"
                onClick={reset}
              >
                Try again
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}

