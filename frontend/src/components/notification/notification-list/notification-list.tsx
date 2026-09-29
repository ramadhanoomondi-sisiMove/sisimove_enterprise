'use client';

// -----------------------------------------------------------------------------
// sisiMove — Notification List
// -----------------------------------------------------------------------------
//
// Presentation boundary for an authenticated notification collection.
//
// Responsibilities:
// - render the supplied notification collection;
// - render the empty state when the collection contains no notifications;
// - delegate individual notification rendering to NotificationItem;
// - provide a stable collection-level layout.
//
// Non-responsibilities:
// - notification fetching;
// - notification mutations;
// - notification content generation;
// - notification routing decisions;
// - authorization;
// - notification lifecycle decisions.
//
// Data ownership:
//
//     Parent component
//         └── notifications
//               └── NotificationList
//
// The parent owns notification data. This component deliberately does not
// execute a notification query, allowing compact surfaces such as
// NotificationPanel to control their own result set and pagination/limit.
//
// -----------------------------------------------------------------------------

import type { HTMLAttributes } from 'react';

import { Card } from '@/components/ui';
import type { Notification } from '@/features/notification/models';

import { NotificationEmptyState } from '../notification-empty';
import { NotificationItem } from '../notification-item';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface NotificationListProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Notifications to render.
   *
   * The parent owns loading, error, filtering, limiting, and fetching.
   */
  readonly notifications: Notification[];
}

// -----------------------------------------------------------------------------
// Notification Collection
// -----------------------------------------------------------------------------

function NotificationCollection({
  notifications,
}: {
  readonly notifications: Notification[];
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
  notifications,
  className,
  ...props
}: NotificationListProps) {
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

