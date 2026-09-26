// -----------------------------------------------------------------------------
// sisiMove — useNotification
// -----------------------------------------------------------------------------
//
// React Query boundary for one Notification.
//
// Responsibilities:
//
// - execute the Notification detail query;
// - map the backend response into the frontend Notification model;
// - expose React Query state;
// - maintain a stable cache key based on publicId.
//
// Non-responsibilities:
//
// - rendering;
// - authentication;
// - authorization;
// - marking the Notification as read;
// - lifecycle validation;
// - reference resolution;
// - navigation.
//
// The public Notification identifier is the frontend resource identity.
// -----------------------------------------------------------------------------

import {
  useQuery,
} from '@tanstack/react-query';

import {
  getNotification,
} from '../../api/notifications';

import {
  mapNotification,
} from '../../mappers';

// =============================================================================
// Query Key
// =============================================================================

/**
 * Builds the canonical cache key for one Notification.
 *
 * Keeping key construction in one place prevents detail components and
 * mutations from accidentally creating different cache identities.
 */
export function notificationQueryKey(
  notificationPublicId: string,
) {
  return [
    'notifications',
    notificationPublicId,
  ] as const;
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Loads one Notification by public identifier.
 *
 * The query remains disabled until a usable public identifier is available.
 * This prevents requests such as:
 *
 *     GET /notifications/undefined
 */
export function useNotification(
  notificationPublicId: string | undefined,
) {
  return useQuery({
    queryKey: notificationQueryKey(
      notificationPublicId ?? '',
    ),

    queryFn: async () => {
      /**
       * `enabled` prevents this function from normally executing without an
       * identifier. The guard remains here as a defensive boundary.
       */
      if (!notificationPublicId) {
        throw new Error(
          'Notification public identifier is required.',
        );
      }

      const response = await getNotification(
        notificationPublicId,
      );

      return mapNotification(response);
    },

    enabled: Boolean(notificationPublicId),
  });
}