// -----------------------------------------------------------------------------
// sisiMove — Notification Empty State
// -----------------------------------------------------------------------------
//
// Empty-state presentation for the notification centre.
//
// Responsibilities:
// - communicate that there are currently no notifications;
// - provide lightweight notification-specific visual context.
//
// Non-responsibilities:
// - fetching notifications;
// - deciding whether notifications exist;
// - mutating notification state;
// - navigation.
//
// -----------------------------------------------------------------------------

import {
  EmptyState,
} from '@/components/ui';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface NotificationEmptyStateProps {
  /**
   * Optional additional class name.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Icon
// -----------------------------------------------------------------------------

function NotificationEmptyIcon() {
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
// Notification Empty State
// -----------------------------------------------------------------------------

export function NotificationEmptyState({
  className,
}: NotificationEmptyStateProps) {
  return (
    <EmptyState
      className={className}
      icon={<NotificationEmptyIcon />}
      title="No notifications yet"
      description="Important updates about your journeys, bookings, payments, and account activity will appear here."
    />
  );
}