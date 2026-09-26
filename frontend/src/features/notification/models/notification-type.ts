// -----------------------------------------------------------------------------
// sisiMove — Notification Type
// -----------------------------------------------------------------------------
//
// Frontend representation of the backend NotificationType enum.
//
// The frontend uses this type for:
// - notification presentation;
// - notification type icons;
// - notification grouping;
// - type-specific UI treatment.
//
// The frontend does NOT use this type to:
// - create notifications;
// - determine whether a notification may be sent;
// - determine notification lifecycle transitions;
// - reproduce backend domain rules.
//
// Backend source of truth:
//
// NotificationType {
//   JOURNEY
//   BOOKING
//   PAYMENT
//   WALLET
//   TRUST
//   VERIFICATION
//   MESSAGE
//   SUPPORT
//   SYSTEM
// }
// -----------------------------------------------------------------------------

export const NOTIFICATION_TYPES = [
  'JOURNEY',
  'BOOKING',
  'PAYMENT',
  'WALLET',
  'TRUST',
  'VERIFICATION',
  'MESSAGE',
  'SUPPORT',
  'SYSTEM',
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];