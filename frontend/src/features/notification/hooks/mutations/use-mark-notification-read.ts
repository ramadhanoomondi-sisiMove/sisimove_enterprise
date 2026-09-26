// -----------------------------------------------------------------------------
// sisiMove — useMarkNotificationRead
// -----------------------------------------------------------------------------
//
// React Query mutation boundary for the Notification READ lifecycle command.
//
// Backend transition:
//
//     SENT → READ
//
// Responsibilities:
//
// - execute the backend read command;
// - expose mutation state;
// - reconcile the affected Notification cache;
// - reconcile the Notification collection cache.
//
// Non-responsibilities:
//
// - deciding whether a Notification may be read;
// - setting readAt locally;
// - changing Notification status locally;
// - authorization;
// - authentication;
// - rendering;
// - navigation.
//
// The backend aggregate remains authoritative for the lifecycle transition.
//
// Cache strategy:
//
// The mutation receives the authoritative updated Notification response from
// the backend and writes that result into the detail cache.
//
// The Notification collection cache is then invalidated so any collection
// projection is refreshed from the backend.
//
// We deliberately do not optimistically change SENT → READ locally.
// -----------------------------------------------------------------------------

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  markNotificationRead,
} from '../../api/notifications';

import {
  mapNotification,
} from '../../mappers';

import {
  NOTIFICATIONS_QUERY_KEY,
  notificationQueryKey,
} from '../queries';

// =============================================================================
// Hook
// =============================================================================

/**
 * Marks a Notification as read.
 *
 * The backend returns the authoritative Notification response after applying
 * the lifecycle transition.
 */
export function useMarkNotificationRead() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async (
      notificationPublicId: string,
    ) => {
      if (!notificationPublicId) {
        throw new Error(
          'Notification public identifier is required.',
        );
      }

      const response =
        await markNotificationRead(
          notificationPublicId,
        );

      return mapNotification(response);
    },

    onSuccess: async (notification) => {
      /**
       * The detail cache can immediately use the authoritative response
       * returned by the backend.
       */
      queryClient.setQueryData(
        notificationQueryKey(
          notification.publicId,
        ),
        notification,
      );

      /**
       * The collection may contain the same Notification and its unread
       * presentation may therefore have changed.
       *
       * Refetch the collection rather than manually reconstructing it.
       */
      await queryClient.invalidateQueries({
        queryKey: NOTIFICATIONS_QUERY_KEY,
      });
    },
  });
}