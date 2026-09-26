// -----------------------------------------------------------------------------
// sisiMove — Notification Mapper Exports
// -----------------------------------------------------------------------------
//
// Public mapper boundary for the Notification feature.
//
// Consumers should import mapper functions from this module rather than
// depending on individual mapper implementation paths.
//
// No transformation logic belongs in this barrel.
// -----------------------------------------------------------------------------

export {
  mapNotification,
  mapNotifications,
} from './notification.mapper';

export {
  mapNotificationPreferences,
} from './notification-preferences.mapper';