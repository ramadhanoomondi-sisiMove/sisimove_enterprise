// -----------------------------------------------------------------------------
// sisiMove — Notification Bell
// -----------------------------------------------------------------------------
//
// Authenticated notification entry point for the sisiMove application.
//
// Responsibilities:
// - load the authenticated user's notifications;
// - derive unread state from backend-authoritative notification status;
// - expose an accessible notification navigation control;
// - display a compact unread indicator;
// - navigate the user to the notification centre.
//
// Important domain rule:
//
//     NotificationStatus.SENT === unread
//
// PENDING is intentionally NOT considered unread.
//
// Notification lifecycle:
//
//     PENDING -> SENT -> READ
//     PENDING -> FAILED
//     PENDING -> CANCELLED
//
// The frontend must not invent an independent unread flag or interpret PENDING
// as unread.
//
// Non-responsibilities:
// - mutating notification state;
// - deciding notification lifecycle rules;
// - generating notification content;
// - rendering the notification list;
// - resolving notification reference destinations;
// - authentication or session management.
//
// Data ownership:
//
//     NotificationBell
//         └── useNotifications()
//
// The bell owns its own query because it directly depends on notification
// collection state. Consumers do not need to fetch notifications merely to
// render authenticated navigation.
//
// Error behavior:
//
// The notification control remains navigable when the notification query
// fails. Notification loading is auxiliary to navigation to the notification
// centre, so a failed collection request must not disable or remove the
// navigation control.
//
// -----------------------------------------------------------------------------

'use client';

import type { ComponentPropsWithoutRef } from 'react';

import Link from 'next/link';

import { useNotifications } from '@/features/notification/hooks';
import { isNotificationUnread } from '@/features/notification/models';
import { cn } from '@/foundation/utils';
import { AUTHENTICATED_ROUTES } from '@/foundation/routing';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

/**
 * Props for the authenticated notification navigation control.
 *
 * The component renders a Next.js Link, therefore its public props are based
 * on link attributes rather than button attributes.
 *
 * Opening the notification centre is navigation, not a mutation.
 */
export interface NotificationBellProps
  extends Omit<
    ComponentPropsWithoutRef<typeof Link>,
    'children' | 'href'
  > {
  /**
   * Optional visual label shown beside the bell icon.
   *
   * The authenticated application shell uses the compact icon-only form.
   */
  readonly showLabel?: boolean;

  /**
   * Destination for the notification centre.
   *
   * Defaults to the canonical authenticated notification route.
   */
  readonly href?: string;
}

// -----------------------------------------------------------------------------
// Icons
// -----------------------------------------------------------------------------

/**
 * Notification bell icon.
 *
 * Kept local because it is notification-specific presentation rather than a
 * general-purpose design-system icon primitive.
 */
function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className="h-5 w-5"
      aria-hidden="true"
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
  );
}

// -----------------------------------------------------------------------------
// Loading Indicator
// -----------------------------------------------------------------------------

/**
 * Lightweight loading indicator shown while the initial notification
 * collection is loading.
 *
 * Navigation remains available while loading.
 */
function LoadingIndicator() {
  return (
    <span
      aria-hidden="true"
      className={[
        'absolute',
        'right-1',
        'top-1',
        'h-2',
        'w-2',
        'animate-pulse',
        'rounded-full',
        'bg-[var(--brand)]',
        'ring-2',
        'ring-[var(--surface)]',
      ].join(' ')}
    />
  );
}

// -----------------------------------------------------------------------------
// Unread Indicator
// -----------------------------------------------------------------------------

/**
 * Compact unread indicator.
 *
 * A dot is intentionally used instead of an unread count.
 *
 * The notification backend does not expose a dedicated unread-count
 * projection, and the authenticated shell should remain compact.
 */
function UnreadIndicator() {
  return (
    <span
      aria-hidden="true"
      className={[
        'absolute',
        'right-1',
        'top-1',
        'h-2',
        'w-2',
        'rounded-full',
        'bg-[var(--brand)]',
        'ring-2',
        'ring-[var(--surface)]',
      ].join(' ')}
    />
  );
}

// -----------------------------------------------------------------------------
// Notification Bell
// -----------------------------------------------------------------------------

export function NotificationBell({
  showLabel = false,
  href = AUTHENTICATED_ROUTES.NOTIFICATIONS,
  className,
  'aria-label': ariaLabel,
  ...props
}: NotificationBellProps) {
  // ---------------------------------------------------------------------------
  // Notification Query
  // ---------------------------------------------------------------------------
  //
  // Notification state belongs to the notification feature.
  //
  // The authenticated shell does not fetch, cache, count, or otherwise manage
  // notification state.
  //
  // ---------------------------------------------------------------------------

  const {
    data: notifications,
    isLoading,
  } = useNotifications();

  // ---------------------------------------------------------------------------
  // Unread State
  // ---------------------------------------------------------------------------
  //
  // Backend-authoritative rule:
  //
  //     SENT = unread
  //
  // PENDING is intentionally excluded.
  //
  // No separate frontend unread state is introduced.
  //
  // ---------------------------------------------------------------------------

  const hasUnreadNotifications =
    notifications?.some((notification) =>
      isNotificationUnread(notification.status),
    ) ?? false;

  // ---------------------------------------------------------------------------
  // Accessible Label
  // ---------------------------------------------------------------------------

  const accessibleLabel =
    ariaLabel ??
    (hasUnreadNotifications
      ? 'Open notifications. You have unread notifications.'
      : 'Open notifications');

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Link
      {...props}
      href={href}
      aria-label={accessibleLabel}
      aria-busy={isLoading || undefined}
      className={cn(
        'relative',
        'inline-flex',
        'min-h-10',
        'min-w-10',
        'items-center',
        'justify-center',
        'gap-2',
        'rounded-[var(--radius-md)]',
        'border',
        'border-transparent',
        'px-2.5',
        'text-[var(--foreground-secondary)]',
        'transition-colors',
        'duration-150',
        'ease-out',
        'hover:bg-[var(--background-subtle)]',
        'hover:text-[var(--foreground)]',
        'focus-visible:outline-2',
        'focus-visible:outline-[var(--brand)]',
        'focus-visible:outline-offset-2',
        showLabel && 'px-3',
        className,
      )}
    >
      <span className="relative inline-flex shrink-0">
        <BellIcon />

        {/* --------------------------------------------------------------- */}
        {/* Unread Indicator                                                */}
        {/* --------------------------------------------------------------- */}

        {hasUnreadNotifications && <UnreadIndicator />}

        {/* --------------------------------------------------------------- */}
        {/* Initial Loading Indicator                                       */}
        {/* --------------------------------------------------------------- */}

        {!hasUnreadNotifications && isLoading && <LoadingIndicator />}
      </span>

      {showLabel && (
        <span className="text-sm font-medium">
          Notifications
        </span>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Screen-reader Status                                             */}
      {/* ----------------------------------------------------------------- */}

      <span className="sr-only">
        {isLoading
          ? 'Loading notification status.'
          : hasUnreadNotifications
            ? 'Unread notifications available.'
            : 'No unread notifications.'}
      </span>
    </Link>
  );
}

export default NotificationBell;
