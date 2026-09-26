// -----------------------------------------------------------------------------
// sisiMove — Notification Panel
// -----------------------------------------------------------------------------
//
// Authenticated notification centre panel.
//
// Responsibilities:
// - load the authenticated user's notifications;
// - present notification loading, error, empty, and populated states;
// - compose the notification list;
// - provide navigation to the full notification centre.
//
// Non-responsibilities:
// - mutating notification lifecycle state;
// - marking notifications as read;
// - generating notification content;
// - resolving notification reference destinations;
// - fetching notifications through a parent page;
// - managing notification delivery state.
//
// Data ownership:
//
//     NotificationPanel
//         └── useNotifications()
//
// The panel owns its own notification query because notification data is a
// direct dependency of this component.
//
// -----------------------------------------------------------------------------

'use client';

import Link from 'next/link';

import {
  Card,
  Spinner,
} from '@/components/ui';

import { useNotifications } from '@/features/notification/hooks';

import { NotificationList } from '../notification-list';

import { cn } from '@/foundation/utils';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface NotificationPanelProps {
  /**
   * Optional class name applied to the panel container.
   */
  className?: string;

  /**
   * Maximum number of notifications displayed in the compact panel.
   *
   * The panel is intended as an authenticated-shell surface rather than the
   * complete notification centre.
   */
  limit?: number;

  /**
   * Whether to show the link to the complete notification centre.
   */
  showViewAll?: boolean;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const DEFAULT_LIMIT = 5;
const DEFAULT_NOTIFICATIONS_HREF = '/notifications';

// -----------------------------------------------------------------------------
// Loading State
// -----------------------------------------------------------------------------

function NotificationPanelLoading() {
  return (
    <Card
      variant="default"
      padding="none"
      className="overflow-hidden"
    >
      <div
        className={[
          'flex',
          'items-center',
          'justify-center',
          'px-5',
          'py-10',
        ].join(' ')}
      >
        <Spinner
          size="sm"
          aria-label="Loading notifications"
        />
      </div>
    </Card>
  );
}

// -----------------------------------------------------------------------------
// Error State
// -----------------------------------------------------------------------------

function NotificationPanelError() {
  return (
    <Card
      variant="default"
      padding="md"
      className="overflow-hidden"
    >
      <div className="space-y-1">
        <p className="text-sm font-medium text-[var(--foreground)]">
          Notifications are unavailable
        </p>

        <p className="text-sm text-[var(--foreground-muted)]">
          We could not load your notifications right now.
        </p>
      </div>
    </Card>
  );
}

// -----------------------------------------------------------------------------
// Empty State
// -----------------------------------------------------------------------------

function NotificationPanelEmpty() {
  return (
    <Card
      variant="default"
      padding="md"
      className="overflow-hidden"
    >
      <div className="px-1 py-5 text-center">
        <div
          className={[
            'mx-auto',
            'mb-3',
            'flex',
            'h-10',
            'w-10',
            'items-center',
            'justify-center',
            'rounded-[var(--radius-full)]',
            'bg-[var(--brand-soft)]',
            'text-[var(--brand)]',
          ].join(' ')}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            className="h-5 w-5"
          >
            <path
              d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 21h4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <p className="text-sm font-medium text-[var(--foreground)]">
          No notifications yet
        </p>

        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          Important updates about your journeys and activity will appear here.
        </p>
      </div>
    </Card>
  );
}

// -----------------------------------------------------------------------------
// Notification Panel
// -----------------------------------------------------------------------------

export function NotificationPanel({
  className,
  limit = DEFAULT_LIMIT,
  showViewAll = true,
}: NotificationPanelProps) {
  const {
    data: notifications,
    isLoading,
    isError,
  } = useNotifications();

  if (isLoading) {
    return (
      <div className={cn('w-full', className)}>
        <NotificationPanelLoading />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={cn('w-full', className)}>
        <NotificationPanelError />
      </div>
    );
  }

  const visibleNotifications = (notifications ?? []).slice(
    0,
    Math.max(0, limit),
  );

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
      <div
        className={[
          'flex',
          'items-center',
          'justify-between',
          'gap-3',
          'border-b',
          'border-[var(--border)]',
          'px-4',
          'py-3',
          'sm:px-5',
        ].join(' ')}
      >
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-[var(--foreground)]">
            Notifications
          </h2>

          <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">
            Your latest updates
          </p>
        </div>

        {showViewAll && (
          <Link
            href={DEFAULT_NOTIFICATIONS_HREF}
            className={[
              'shrink-0',
              'rounded-[var(--radius-sm)]',
              'px-2',
              'py-1.5',
              'text-sm',
              'font-medium',
              'text-[var(--brand)]',
              'transition-colors',
              'duration-150',
              'hover:text-[var(--brand-hover)]',
              'focus-visible:outline-2',
              'focus-visible:outline-[var(--brand)]',
              'focus-visible:outline-offset-2',
            ].join(' ')}
          >
            View all
          </Link>
        )}
      </div>

      {visibleNotifications.length > 0 ? (
        <>
          <NotificationList
            notifications={visibleNotifications}
          />

          {showViewAll && notifications && notifications.length > limit && (
            <div
              className={[
                'border-t',
                'border-[var(--border)]',
                'px-4',
                'py-3',
                'sm:px-5',
              ].join(' ')}
            >
              <Link
                href={DEFAULT_NOTIFICATIONS_HREF}
                className={[
                  'flex',
                  'min-h-9',
                  'w-full',
                  'items-center',
                  'justify-center',
                  'rounded-[var(--radius-md)]',
                  'border',
                  'border-transparent',
                  'px-3',
                  'text-sm',
                  'font-medium',
                  'text-[var(--foreground-secondary)]',
                  'transition-colors',
                  'duration-150',
                  'hover:bg-[var(--background-subtle)]',
                  'hover:text-[var(--foreground)]',
                  'focus-visible:outline-2',
                  'focus-visible:outline-[var(--brand)]',
                  'focus-visible:outline-offset-2',
                ].join(' ')}
              >
                View all notifications
              </Link>
            </div>
          )}
        </>
      ) : (
        <NotificationPanelEmpty />
      )}
    </Card>
  );
}