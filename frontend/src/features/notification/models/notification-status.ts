// -----------------------------------------------------------------------------
// sisiMove — Notification Status
// -----------------------------------------------------------------------------
//
// Frontend representation of the backend NotificationStatus enum.
//
// IMPORTANT:
//
// SENT is the member-facing unread state.
//
// PENDING is NOT unread. A PENDING notification has not yet reached the
// SENT state and therefore should not contribute to the unread count.
//
// READ is terminal from the member's perspective because the backend does not
// expose a READ -> SENT / unread transition.
//
// The frontend must not reproduce notification lifecycle transitions.
// The backend NotificationEntity / NotificationAggregate remains authoritative.
//
// Backend source of truth:
//
// NotificationStatus {
//   PENDING
//   SENT
//   READ
//   FAILED
//   CANCELLED
// }
// -----------------------------------------------------------------------------

export const NOTIFICATION_STATUSES = [
  'PENDING',
  'SENT',
  'READ',
  'FAILED',
  'CANCELLED',
] as const;

export type NotificationStatus = (typeof NOTIFICATION_STATUSES)[number];

/**
 * Determines whether a notification is currently unread from the member's
 * perspective.
 *
 * This is presentation/read-state interpretation only.
 *
 * PENDING intentionally returns false.
 */
export function isNotificationUnread(
  status: NotificationStatus,
): boolean {
  return status === 'SENT';
}