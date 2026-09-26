'use client';

// -----------------------------------------------------------------------------
// sisiMove — Notification List
// -----------------------------------------------------------------------------
//
// Presentation/container boundary for the authenticated notification collection.
//
// Responsibilities:
// - load the current user's notifications through the React Query hook;
// - render loading, error, empty, and populated states;
// - delegate individual notification rendering to NotificationItem;
// - provide a stable collection-level layout.
//
// Non-responsibilities:
// - notification fetching implementation;
// - notification mutations;
// - notification content generation;
// - notification routing decisions;
// - authorization;
// - domain lifecycle decisions.
//
// Architecture:
// - This component owns the query because it requires notification data.
// - Route pages remain thin and do not orchestrate feature data.
// - NotificationItem owns notification-level interaction/mutations.
// -----------------------------------------------------------------------------

import type { HTMLAttributes } from 'react';

import { Card, Skeleton } from '@/components/ui';

import { useNotifications } from '@/features/notification/hooks';
import type { Notification } from '@/features/notification/models';

import { NotificationEmptyState } from '../notification-empty';
import { NotificationItem } from '../notification-item';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export type NotificationListProps =
  HTMLAttributes<HTMLDivElement>;

// -----------------------------------------------------------------------------
// Loading State
// -----------------------------------------------------------------------------

function NotificationListLoading() {
  return (
    <Card padding="none">
      <div className="divide-y divide-[var(--border-subtle)]">
        {Array.from({ length: 5 }).map((_, index) => (
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
        ))}
      </div>
    </Card>
  );
}

// -----------------------------------------------------------------------------
// Error State
// -----------------------------------------------------------------------------

function NotificationListError({
  onRetry,
}: {
  onRetry: () => void;
}) {
  return (
    <Card padding="lg">
      <div className="text-center">
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          Unable to load notifications
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--foreground-muted)]">
          Something went wrong while loading your notifications.
          Please try again.
        </p>

        <button
          type="button"
          className="mt-5 text-sm font-medium text-[var(--brand)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
          onClick={onRetry}
        >
          Try again
        </button>
      </div>
    </Card>
  );
}

// -----------------------------------------------------------------------------
// Notification Collection
// -----------------------------------------------------------------------------

function NotificationCollection({
  notifications,
}: {
  notifications: Notification[];
}) {
  if (notifications.length === 0) {
    return <NotificationEmptyState />;
  }

  return (
    <Card padding="none">
      <div className="divide-y divide-[var(--border-subtle)]">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.publicId}
            notification={notification}
          />
        ))}
      </div>
    </Card>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function NotificationList({
  className,
  ...props
}: NotificationListProps) {
  const {
    data: notifications = [],
    isLoading,
    isError,
    refetch,
  } = useNotifications();

  if (isLoading) {
    return (
      <div
        className={className}
        {...props}
      >
        <NotificationListLoading />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={className}
        {...props}
      >
        <NotificationListError
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  return (
    <div
      className={className}
      {...props}
    >
      <NotificationCollection
        notifications={notifications}
      />
    </div>
  );
}
