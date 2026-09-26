// -----------------------------------------------------------------------------
// sisiMove — Notification Priority
// -----------------------------------------------------------------------------
//
// Frontend representation of the backend NotificationPriority enum.
//
// Priority is presentation metadata for the member-facing notification UI.
//
// The frontend may use priority to influence:
// - visual emphasis;
// - priority indicators;
// - accessibility labels.
//
// The frontend must NOT interpret priority as a domain command or lifecycle
// instruction.
//
// Backend source of truth:
//
// NotificationPriority {
//   LOW
//   NORMAL
//   HIGH
//   CRITICAL
// }
// -----------------------------------------------------------------------------

export const NOTIFICATION_PRIORITIES = [
  'LOW',
  'NORMAL',
  'HIGH',
  'CRITICAL',
] as const;

export type NotificationPriority =
  (typeof NOTIFICATION_PRIORITIES)[number];