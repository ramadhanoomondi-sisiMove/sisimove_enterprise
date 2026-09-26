// -----------------------------------------------------------------------------
// sisiMove — useNotifications
// -----------------------------------------------------------------------------
//
// React Query boundary for the authenticated user's Notification collection.
//
// Responsibilities:
//
// - execute the Notification collection query;
// - map backend responses into frontend Notification models;
// - provide React Query loading/error/data state;
// - provide explicit refetch support;
// - define the Notification collection cache identity.
//
// Non-responsibilities:
//
// - rendering;
// - authentication;
// - authorization;
// - Notification lifecycle decisions;
// - unread-state mutation;
// - navigation;
// - reference resolution;
// - notification orchestration.
//
// Component ownership:
//
// Components that need Notification collection data call this hook directly.
// Pages do not act as Notification data coordinators.
//
// Data flow:
//
//     Notification component
//             │
//             ▼
//     useNotifications()
//             │
//             ▼
//     getNotifications()
//             │
//             ▼
//     authenticatedApiClient
//             │
//             ▼
//     SisiMove API
// -----------------------------------------------------------------------------

import {
  useQuery,
} from '@tanstack/react-query';

import {
  getNotifications,
} from '../../api/notifications';

import {
  mapNotifications,
} from '../../mappers';

// =============================================================================
// Query Key
// =============================================================================

/**
 * Canonical React Query key for the authenticated user's Notifications.
 *
 * The backend derives the recipient from the authenticated session, so the
 * current collection does not require a recipientPublicId in its cache key.
 */
export const NOTIFICATIONS_QUERY_KEY = [
  'notifications',
] as const;

// =============================================================================
// Hook
// =============================================================================

/**
 * Loads the authenticated user's Notifications.
 */
export function useNotifications() {
  return useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,

    queryFn: async () => {
      const response = await getNotifications();

      return mapNotifications(response);
    },
  });
}