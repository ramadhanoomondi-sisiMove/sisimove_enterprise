'use client';

// -----------------------------------------------------------------------------
// sisiMove — Notification Detail
// -----------------------------------------------------------------------------
//
// Detailed presentation of a single notification.
//
// Responsibilities:
// - display complete notification information;
// - communicate notification lifecycle state;
// - display optional reference/event metadata;
// - expose an explicit mark-as-read action when supplied by the consumer.
//
// Non-responsibilities:
// - fetching the notification;
// - resolving notification reference destinations;
// - deciding notification lifecycle rules;
// - directly owning the mark-read mutation.
//
// The page/container can compose:
//
//     useNotification()
//     useMarkNotificationRead()
//
// and pass the resulting notification and mutation callback into this
// component.
//
// -----------------------------------------------------------------------------

import type { Notification } from '@/features/notification/models';

import {
  Badge,
  Button,
  Card,
} from '@/components/ui';

import {
  NotificationPriorityIndicator,
} from '../notification-priority';

import {
  NotificationTypeIcon,
} from '../notification-type';

import { cn } from '@/foundation/utils';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface NotificationDetailProps {
  /**
   * Notification being displayed.
   */
  notification: Notification;

  /**
   * Optional callback used by the container to perform the backend
   * SENT -> READ transition.
   */
  onMarkAsRead?: () => void;

  /**
   * Whether the mark-as-read mutation is currently running.
   */
  markingAsRead?: boolean;

  /**
   * Optional additional class name.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatDateTime(
  value: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function getStatusLabel(
  status: Notification['status'],
): string {
  switch (status) {
    case 'PENDING':
      return 'Pending';

    case 'SENT':
      return 'Unread';

    case 'READ':
      return 'Read';

    case 'FAILED':
      return 'Failed';

    case 'CANCELLED':
      return 'Cancelled';

    default:
      return status;
  }
}

function getStatusVariant(
  status: Notification['status'],
): 'default' | 'brand' | 'success' | 'warning' | 'danger' {
  switch (status) {
    case 'PENDING':
      return 'warning';

    case 'SENT':
      return 'brand';

    case 'READ':
      return 'success';

    case 'FAILED':
      return 'danger';

    case 'CANCELLED':
      return 'default';

    default:
      return 'default';
  }
}

// -----------------------------------------------------------------------------
// Notification Detail
// -----------------------------------------------------------------------------

export function NotificationDetail({
  notification,
  onMarkAsRead,
  markingAsRead = false,
  className,
}: NotificationDetailProps) {
  const isUnread = notification.status === 'SENT';

  return (
    <Card
      variant="default"
      padding="none"
      className={cn(
        'w-full',
        'overflow-hidden',
        className,
      )}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={[
          'flex',
          'items-start',
          'gap-4',
          'border-b',
          'border-[var(--border)]',
          'px-4',
          'py-5',
          'sm:px-6',
          'sm:py-6',
        ].join(' ')}
      >
        <NotificationTypeIcon
          type={notification.type}
          priority={notification.priority}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-base font-semibold leading-6 text-[var(--foreground)] sm:text-lg">
              {notification.title}
            </h1>

            {isUnread && (
              <span
                className={[
                  'h-2',
                  'w-2',
                  'shrink-0',
                  'rounded-full',
                  'bg-[var(--brand)]',
                ].join(' ')}
                aria-label="Unread"
                title="Unread"
              />
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge
              variant={getStatusVariant(notification.status)}
              size="sm"
            >
              {getStatusLabel(notification.status)}
            </Badge>

            <NotificationPriorityIndicator
              priority={notification.priority}
            />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Body                                                                */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={[
          'px-4',
          'py-5',
          'sm:px-6',
          'sm:py-6',
        ].join(' ')}
      >
        <p className="whitespace-pre-wrap text-sm leading-6 text-[var(--foreground-secondary)]">
          {notification.body}
        </p>

        {/* ----------------------------------------------------------------- */}
        {/* Reference Context                                                 */}
        {/* ----------------------------------------------------------------- */}

        {(notification.referenceType ||
          notification.referencePublicId) && (
          <div
            className={[
              'mt-6',
              'rounded-[var(--radius-md)]',
              'border',
              'border-[var(--border-subtle)]',
              'bg-[var(--background-subtle)]',
              'p-4',
            ].join(' ')}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Reference
            </p>

            {notification.referenceType && (
              <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
                {notification.referenceType}
              </p>
            )}

            {notification.referencePublicId && (
              <p className="mt-1 break-all font-mono text-xs text-[var(--foreground-muted)]">
                {notification.referencePublicId}
              </p>
            )}
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Event Context                                                     */}
        {/* ----------------------------------------------------------------- */}

        {(notification.eventType ||
          notification.eventPublicId) && (
          <div
            className={[
              'mt-3',
              'rounded-[var(--radius-md)]',
              'border',
              'border-[var(--border-subtle)]',
              'bg-[var(--background-subtle)]',
              'p-4',
            ].join(' ')}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Event
            </p>

            {notification.eventType && (
              <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
                {notification.eventType}
              </p>
            )}

            {notification.eventPublicId && (
              <p className="mt-1 break-all font-mono text-xs text-[var(--foreground-muted)]">
                {notification.eventPublicId}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Footer                                                              */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={[
          'flex',
          'flex-col',
          'gap-3',
          'border-t',
          'border-[var(--border)]',
          'px-4',
          'py-4',
          'sm:flex-row',
          'sm:items-center',
          'sm:justify-between',
          'sm:px-6',
        ].join(' ')}
      >
        <div className="text-xs text-[var(--foreground-muted)]">
          <time dateTime={notification.createdAt}>
            {formatDateTime(notification.createdAt)}
          </time>
        </div>

        {isUnread && onMarkAsRead && (
          <Button
            variant="outline"
            size="sm"
            loading={markingAsRead}
            onClick={onMarkAsRead}
          >
            Mark as read
          </Button>
        )}
      </div>
    </Card>
  );
}