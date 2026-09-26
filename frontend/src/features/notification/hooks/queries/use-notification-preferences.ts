// -----------------------------------------------------------------------------
// sisiMove — useNotificationPreferences
// -----------------------------------------------------------------------------
//
// React Query boundary for Notification Preferences.
//
// Responsibilities:
//
// - execute the Notification Preference query;
// - map the backend response into NotificationPreferences;
// - expose React Query state;
// - provide refetch support;
// - maintain the preference cache identity.
//
// Non-responsibilities:
//
// - creating preferences;
// - deciding preference defaults;
// - calculating preference summaries;
// - updating preferences;
// - authentication;
// - authorization;
// - rendering.
//
// IMPORTANT:
//
// The preference resource belongs to a member through an opaque
// memberPublicId reference.
//
// The component supplies that identity from an existing authenticated
// Identity source. This hook does not invent or derive the member identity.
// -----------------------------------------------------------------------------

import {
  useQuery,
} from '@tanstack/react-query';

import {
  getNotificationPreferences,
} from '../../api/preferences';

import {
  mapNotificationPreferences,
} from '../../mappers';

// =============================================================================
// Query Key
// =============================================================================

/**
 * Builds the canonical React Query key for Notification Preferences belonging
 * to a member.
 */
export function notificationPreferencesQueryKey(
  memberPublicId: string,
) {
  return [
    'notification-preferences',
    memberPublicId,
  ] as const;
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Loads Notification Preferences for a member.
 *
 * The query remains disabled until memberPublicId is available.
 */
export function useNotificationPreferences(
  memberPublicId: string | undefined,
) {
  return useQuery({
    queryKey: notificationPreferencesQueryKey(
      memberPublicId ?? '',
    ),

    queryFn: async () => {
      if (!memberPublicId) {
        throw new Error(
          'Member public identifier is required.',
        );
      }

      const response =
        await getNotificationPreferences(
          memberPublicId,
        );

      return mapNotificationPreferences(
        response,
      );
    },

    enabled: Boolean(memberPublicId),
  });
}