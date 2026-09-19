'use client';

// -----------------------------------------------------------------------------
// sisiMove — Authenticated Notifications
// -----------------------------------------------------------------------------
//
// Notification control for the authenticated application header.
//
// Responsibilities:
// - Render the authenticated notification control.
// - Provide an accessible label for the notification action.
// - Provide a stable presentation boundary for future notification state.
//
// Non-responsibilities:
// - No notification fetching.
// - No notification state management.
// - No unread-count calculation.
// - No authentication state management.
// - No session management.
// - No authorization.
// - No marketplace logic.
//
// -----------------------------------------------------------------------------

import Link from 'next/link';

export interface AuthenticatedNotificationsProps {
  /**
   * Number of unread notifications.
   *
   * The authenticated shell does not calculate this value. A future
   * notification feature may provide it through the component boundary.
   */
  readonly unreadCount?: number;

  /**
   * Destination for the notification surface.
   */
  readonly href?: string;
}

export function AuthenticatedNotifications({
  unreadCount = 0,
  href = '/notifications',
}: AuthenticatedNotificationsProps) {
  const hasUnreadNotifications = unreadCount > 0;

  return (
    <Link
      href={href}
      aria-label={
        hasUnreadNotifications
          ? `Notifications, ${unreadCount} unread`
          : 'Notifications'
      }
      className={[
        'relative inline-flex size-9 items-center justify-center',
        'rounded-full',
        'transition-colors duration-150 ease-out',
        'hover:bg-[var(--brand-soft)]',
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-[var(--brand)]',
        'focus-visible:ring-offset-2',
        'focus-visible:ring-offset-[var(--surface)]',
      ].join(' ')}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--brand)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>

      {hasUnreadNotifications ? (
        <span
          aria-hidden="true"
          className={[
            'absolute right-1.5 top-1.5 size-2 rounded-full',
            'bg-[var(--brand)]',
            'ring-2 ring-[var(--surface)]',
          ].join(' ')}
        />
      ) : null}
    </Link>
  );
}

export default AuthenticatedNotifications;