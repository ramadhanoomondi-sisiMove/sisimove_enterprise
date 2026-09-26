'use client';

// -----------------------------------------------------------------------------
// sisiMove — Notification Detail Page
// -----------------------------------------------------------------------------
//
// Authenticated route/container for a single notification.
//
// Responsibilities:
// - receive the notification public ID from the route;
// - load the notification through the feature query hook;
// - own the mark-as-read mutation;
// - pass notification state and mutation state to NotificationDetail.
//
// Non-responsibilities:
// - notification presentation;
// - notification lifecycle rules;
// - generating notification content;
// - resolving notification reference destinations.
//
// NotificationDetail remains a presentation component.
// -----------------------------------------------------------------------------

import {
  NotificationDetail,
} from '@/components/notification/notification-detail/notification-detail';

import {
  useMarkNotificationRead,
  useNotification,
} from '@/features/notification/hooks';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface NotificationDetailPageProps {
  params: {
    publicId: string;
  };
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function NotificationDetailPage({
  params,
}: NotificationDetailPageProps) {
  const {
    data: notification,
    isLoading,
    isError,
  } = useNotification(params.publicId);

  const markNotificationRead =
    useMarkNotificationRead();

  const handleMarkAsRead = () => {
    if (!notification) {
      return;
    }

    markNotificationRead.mutate(
      notification.publicId,
    );
  };

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <main className="page-container py-6 sm:py-8">
        <div className="mx-auto max-w-3xl">
          <div
            className={[
              'rounded-[var(--radius-lg)]',
              'border',
              'border-[var(--border)]',
              'bg-[var(--surface)]',
              'p-6',
            ].join(' ')}
          >
            <div className="animate-pulse space-y-4">
              <div className="h-5 w-48 rounded bg-[var(--background-subtle)]" />
              <div className="h-4 w-24 rounded bg-[var(--background-subtle)]" />
              <div className="h-20 w-full rounded bg-[var(--background-subtle)]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  if (isError) {
    return (
      <main className="page-container py-6 sm:py-8">
        <div className="mx-auto max-w-3xl">
          <div
            className={[
              'rounded-[var(--radius-lg)]',
              'border',
              'border-[var(--border)]',
              'bg-[var(--surface)]',
              'p-6',
              'text-center',
            ].join(' ')}
          >
            <h1 className="text-base font-semibold text-[var(--foreground)]">
              Unable to load notification
            </h1>

            <p className="mt-2 text-sm text-[var(--foreground-muted)]">
              Something went wrong while loading this notification.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Not Found
  // ---------------------------------------------------------------------------

  if (!notification) {
    return (
      <main className="page-container py-6 sm:py-8">
        <div className="mx-auto max-w-3xl">
          <div
            className={[
              'rounded-[var(--radius-lg)]',
              'border',
              'border-[var(--border)]',
              'bg-[var(--surface)]',
              'p-6',
              'text-center',
            ].join(' ')}
          >
            <h1 className="text-base font-semibold text-[var(--foreground)]">
              Notification not found
            </h1>

            <p className="mt-2 text-sm text-[var(--foreground-muted)]">
              This notification may no longer be available.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Detail
  // ---------------------------------------------------------------------------

  const isUnread = notification.status === 'SENT';

  return (
    <main className="page-container py-6 sm:py-8">
      <div className="mx-auto max-w-3xl">
        <NotificationDetail
          notification={notification}
          onMarkAsRead={
            isUnread
              ? handleMarkAsRead
              : undefined
          }
          markingAsRead={
            markNotificationRead.isPending
          }
        />
      </div>
    </main>
  );
}
