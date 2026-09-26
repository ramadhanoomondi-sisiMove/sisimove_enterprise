// -----------------------------------------------------------------------------
// sisiMove — Notification Model Exports
// -----------------------------------------------------------------------------
//
// Public model boundary for the Notification feature.
//
// Consumers should import Notification models through this module rather than
// depending on individual model file paths.
// -----------------------------------------------------------------------------

export {
  NOTIFICATION_TYPES,
  type NotificationType,
} from './notification-type';

export {
  NOTIFICATION_PRIORITIES,
  type NotificationPriority,
} from './notification-priority';

export {
  NOTIFICATION_STATUSES,
  isNotificationUnread,
  type NotificationStatus,
} from './notification-status';

export type {
  Notification,
  NotificationDelivery,
} from './notification';

export type {
  NotificationPreferences,
  UpdateNotificationPreferencesRequest,
} from './notification-preferences';