// -----------------------------------------------------------------------------
// sisiMove — Notification Item
// -----------------------------------------------------------------------------
//
// Presentational notification entry.
//
// Responsibilities:
// - display backend-provided notification content;
// - communicate notification type and priority visually;
// - distinguish SENT notifications from terminal/read states;
// - provide navigation to a known notification detail route;
// - preserve accessible notification semantics.
//
// Non-responsibilities:
// - fetching notification data;
// - marking notifications as read;
// - generating notification content;
// - deciding notification lifecycle state;
// - resolving arbitrary reference URLs;
// - exposing notification delivery state.
//
// Important domain rule:
//
//     NotificationStatus.SENT === unread
//
// PENDING is intentionally not treated as unread.
//
// Navigation rule:
//
//     notification.publicId -> /notifications/:publicId
//
// Reference metadata is intentionally not converted into arbitrary URLs here.
// Reference-specific navigation belongs to the notification detail surface,
// where explicit supported reference types can be mapped safely.
//
// -----------------------------------------------------------------------------

'use client';

import Link from 'next/link';

import {
  Badge,
  Card,
} from '@/components/ui';

import type { Notification } from '@/features/notification/models';

import { isNotificationUnread } from '@/features/notification/models';

import { NotificationPriorityIndicator } from '../notification-priority';

import { NotificationTypeIcon } from '../notification-type';

import { cn } from '@/foundation/utils';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface NotificationItemProps {
  /**
   * Notification supplied by the notification query owner.
   */
  notification: Notification;

  /**
   * Optional class name applied to the notification entry.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatNotificationTime(
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

function getTypeLabel(
  type: Notification['type'],
): string {
  switch (type) {
    case 'JOURNEY':
      return 'Journey';

    case 'BOOKING':
      return 'Booking';

    case 'PAYMENT':
      return 'Payment';

    case 'WALLET':
      return 'Wallet';

    case 'TRUST':
      return 'Trust';

    case 'VERIFICATION':
      return 'Verification';

    case 'MESSAGE':
      return 'Message';

    case 'SUPPORT':
      return 'Support';

    case 'SYSTEM':
      return 'System';

    default:
      return type;
  }
}

// -----------------------------------------------------------------------------
// Notification Item
// -----------------------------------------------------------------------------

export function NotificationItem({
  notification,
  className,
}: NotificationItemProps) {
  const isUnread = isNotificationUnread(notification.status);
  const formattedTime = formatNotificationTime(
    notification.createdAt,
  );

  return (
    <Link
      href={`/notifications/${encodeURIComponent(notification.publicId)}`}
      className={cn(
        'block',
        'focus-visible:outline-2',
        'focus-visible:outline-[var(--brand)]',
        'focus-visible:outline-offset-[-2px]',
        className,
      )}
      aria-label={
        isUnread
          ? `${notification.title}. Unread notification.`
          : notification.title
      }
    >
      <Card
        variant="default"
        padding="none"
        className={cn(
          'rounded-none',
          'border-x-0',
          'border-t-0',
          'border-b',
          'border-[var(--border)]',
          'shadow-none',
          'transition-colors',
          'duration-150',
          'ease-out',
          'hover:bg-[var(--background-subtle)]',
          isUnread && 'bg-[var(--brand-soft)]/40',
        )}
      >
        <div
          className={[
            'flex',
            'gap-3',
            'px-4',
            'py-3.5',
            'sm:px-5',
          ].join(' ')}
        >
          <div className="shrink-0">
            <NotificationTypeIcon
              type={notification.type}
              priority={notification.priority}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p
                    className={cn(
                      'min-w-0',
                      'text-sm',
                      'leading-5',
                      isUnread
                        ? 'font-semibold text-[var(--foreground)]'
                        : 'font-medium text-[var(--foreground)]',
                    )}
                  >
                    {notification.title}
                  </p>

                  {isUnread && (
                    <span
                      aria-label="Unread"
                      className={[
                        'h-1.5',
                        'w-1.5',
                        'shrink-0',
                        'rounded-full',
                        'bg-[var(--brand)]',
                      ].join(' ')}
                    />
                  )}
                </div>
              </div>

              <time
                dateTime={notification.createdAt}
                className="shrink-0 text-xs text-[var(--foreground-muted)]"
              >
                {formattedTime}
              </time>
            </div>

            <p
              className={[
                'mt-1',
                'line-clamp-2',
                'text-sm',
                'leading-5',
                'text-[var(--foreground-secondary)]',
              ].join(' ')}
            >
              {notification.body}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                size="sm"
              >
                {getTypeLabel(notification.type)}
              </Badge>

              <NotificationPriorityIndicator
                priority={notification.priority}
              />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}