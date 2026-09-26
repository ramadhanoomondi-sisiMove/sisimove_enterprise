// -----------------------------------------------------------------------------
// sisiMove — Notification Hook Public Boundary
// -----------------------------------------------------------------------------
//
// Public hook boundary for the Notification feature.
//
// Components should import Notification hooks through this module rather than
// depending on internal hook implementation paths.
//
// Dependency direction:
//
//     Notification Component
//             │
//             ▼
//     features/notifications/hooks
//             │
//             ├── queries
//             └── mutations
//             │
//             ▼
//     Notification API
//             │
//             ▼
//     authenticatedApiClient
// -----------------------------------------------------------------------------

export {
  NOTIFICATIONS_QUERY_KEY,
  notificationQueryKey,
  notificationPreferencesQueryKey,
  useNotifications,
  useNotification,
  useNotificationPreferences,
} from './queries';

export {
  useMarkNotificationRead,
  useUpdateNotificationPreferences,
  type UpdateNotificationPreferencesVariables,
} from './mutations';