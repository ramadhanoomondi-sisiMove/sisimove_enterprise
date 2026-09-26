// -----------------------------------------------------------------------------
// sisiMove — useUpdateNotificationPreferences
// -----------------------------------------------------------------------------
//
// React Query mutation boundary for complete Notification Preference updates.
//
// Backend operation:
//
//     PATCH /notification-preferences/:preferencePublicId
//
// The backend preference aggregate treats the update as a complete desired
// state. Therefore the mutation sends all nine preference values together.
//
// Responsibilities:
//
// - execute the backend preference update;
// - expose mutation state;
// - map the authoritative backend response;
// - update the corresponding React Query cache.
//
// Non-responsibilities:
//
// - calculating summary fields;
// - deciding defaults;
// - creating Notification Preferences;
// - issuing one request per toggle;
// - authentication;
// - authorization;
// - rendering.
//
// IMPORTANT:
//
// The backend returns authoritative summary state:
//
// - areAllEnabled
// - areAllDisabled
// - hasEnabledPreferences
// - enabledPreferenceCount
// - disabledPreferenceCount
//
// The mutation never calculates those values locally.
// -----------------------------------------------------------------------------

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  updateNotificationPreferences,
} from '../../api/preferences';

import {
  mapNotificationPreferences,
} from '../../mappers';

import {
  notificationPreferencesQueryKey,
} from '../queries';

import type {
  UpdateNotificationPreferencesRequest,
} from '../../models';

// =============================================================================
// Mutation Variables
// =============================================================================

export interface UpdateNotificationPreferencesVariables {
  /**
   * Public identifier of the Notification Preference resource.
   */
  preferencePublicId: string;

  /**
   * Complete desired preference state.
   */
  preferences: UpdateNotificationPreferencesRequest;

  /**
   * Member identity used by the preference query cache.
   *
   * This is supplied by the component because the preference resource is
   * queried by memberPublicId.
   */
  memberPublicId: string;
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Updates the complete Notification Preference state.
 *
 * The backend response becomes the new authoritative cache value.
 */
export function useUpdateNotificationPreferences() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async ({
      preferencePublicId,
      preferences,
    }: UpdateNotificationPreferencesVariables) => {
      if (!preferencePublicId) {
        throw new Error(
          'Notification preference public identifier is required.',
        );
      }

      const response =
        await updateNotificationPreferences(
          preferencePublicId,
          preferences,
        );

      return mapNotificationPreferences(
        response,
      );
    },

    onSuccess: async (
      updatedPreferences,
      variables,
    ) => {
      /**
       * The backend response is authoritative.
       *
       * Do not locally reconstruct:
       *
       * - areAllEnabled;
       * - areAllDisabled;
       * - hasEnabledPreferences;
       * - enabledPreferenceCount;
       * - disabledPreferenceCount.
       */
      queryClient.setQueryData(
        notificationPreferencesQueryKey(
          variables.memberPublicId,
        ),
        updatedPreferences,
      );

      /**
       * No additional mutation is required for each individual preference.
       *
       * One complete PATCH represents the aggregate update.
       */
      await queryClient.invalidateQueries({
        queryKey: notificationPreferencesQueryKey(
          variables.memberPublicId,
        ),
        exact: true,
      });
    },
  });
}