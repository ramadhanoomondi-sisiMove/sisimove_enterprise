// -----------------------------------------------------------------------------
// sisiMove — Notifications Error Boundary
// -----------------------------------------------------------------------------
//
// Next.js route-level error boundary for the authenticated Notifications
// surface.
//
// Responsibilities:
// - present a recoverable route-level failure;
// - invoke the Next.js route recovery mechanism.
//
// Non-responsibilities:
// - fetching notifications;
// - interpreting notification API errors;
// - notification mutations;
// - authentication;
// - authorization.
// -----------------------------------------------------------------------------

'use client';

import {
  Button,
  Card,
} from '@/components/ui';

export default function NotificationsError({
  reset,
}: {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}) {
  return (
    <main className="page-container py-6 sm:py-8">
      <div className="mx-auto max-w-3xl">
        <Card padding="lg">
          <div className="text-center">
            <h1 className="text-base font-semibold text-[var(--foreground)]">
              Unable to load notifications
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--foreground-muted)]">
              Something went wrong while loading this page.
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

