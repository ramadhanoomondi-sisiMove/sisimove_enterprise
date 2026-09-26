// -----------------------------------------------------------------------------
// sisiMove — Notification Query Hook Exports
// -----------------------------------------------------------------------------
//
// Public query-hook boundary for the Notification feature.
// -----------------------------------------------------------------------------

export {
  NOTIFICATIONS_QUERY_KEY,
  useNotifications,
} from './use-notifications';

export {
  notificationQueryKey,
  useNotification,
} from './use-notification';

export {
  notificationPreferencesQueryKey,
  useNotificationPreferences,
} from './use-notification-preferences';