'use client';

// -----------------------------------------------------------------------------
// sisiMove — Authenticated Notifications
// -----------------------------------------------------------------------------
//
// Authenticated-shell adapter for the SisiMove notification feature.
//
// Responsibilities:
// - expose the notification feature through the authenticated shell;
// - provide the shell-level placement boundary for the notification control;
// - forward only presentation configuration to the notification feature.
//
// Non-responsibilities:
// - fetching notifications;
// - managing notification server state;
// - calculating unread notifications;
// - marking notifications as read;
// - authentication state management;
// - session management;
// - authorization;
// - marketplace logic.
//
// Architecture:
//
//     AuthenticatedHeader
//             │
//             └── AuthenticatedNotifications
//                       │
//                       └── NotificationBell
//                              │
//                              └── useNotifications()
//
// `NotificationBell` is the notification feature boundary. It owns notification
// state and derives unread state from the backend-authoritative Notification
// status.
//
// The authenticated shell must not receive or calculate `unreadCount`.
//
// -----------------------------------------------------------------------------

import { NotificationBell } from '@/components/notification';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface AuthenticatedNotificationsProps {
  /**
   * Optional class name forwarded to the notification control.
   *
   * This allows the authenticated shell to make layout-level presentation
   * adjustments without taking ownership of notification behavior.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function AuthenticatedNotifications({
  className,
}: AuthenticatedNotificationsProps) {
  return <NotificationBell className={className} />;
}

export default AuthenticatedNotifications;
