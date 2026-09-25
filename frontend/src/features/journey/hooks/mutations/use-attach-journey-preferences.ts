// -----------------------------------------------------------------------------
// sisiMove — useAttachJourneyPreferences
// -----------------------------------------------------------------------------
//
// React Query mutation hook for configuring and attaching Preferences to a
// Journey.
//
// API boundary:
//     POST /api/v1/journeys/:journeyPublicId/preferences
//
// Request body:
//     {
//       smoking: JourneySmokingPolicy;
//       pets: JourneyPetsPolicy;
//       luggage: JourneyLuggagePolicy;
//       conversation: JourneyConversationPreference;
//       music: JourneyMusicPreference;
//     }
//
// IMPORTANT:
//
// Journey Preferences are Journey-owned configuration.
//
// The frontend does NOT create a standalone Preferences resource before this
// mutation. The backend application handler:
//
//   1. Resolves the Journey aggregate.
//   2. Creates the JourneyPreferences entity from the supplied configuration.
//   3. Attaches the preferences to the Journey aggregate.
//   4. Persists the Journey aggregate.
//
// Therefore this hook accepts the preference configuration itself.
//
// The backend remains authoritative for:
// - preference validation;
// - policy semantics;
// - Journey lifecycle rules;
// - authorization;
// - aggregate persistence.
//
// This hook is responsible for:
// - Executing the Preferences configuration API.
// - Managing mutation state through React Query.
// - Invalidating affected Journey Preferences queries.
// - Invalidating authenticated Journey collections.
//
// This hook intentionally does NOT:
// - Create domain entities.
// - Generate preference public identifiers.
// - Validate Journey lifecycle rules.
// - Perform authorization checks.
// - Modify other Journey components.
// - Navigate to another route.
// -----------------------------------------------------------------------------
//
// Architectural flow:
//
//   JourneyPreferencesStep
//          │
//          ▼
//   useAttachJourneyPreferences()
//          │
//          ▼
//   attachJourneyPreferences()
//          │
//          ▼
//   Journey HTTP Controller
//          │
//          ▼
//   AttachPreferencesCommand
//          │
//          ▼
//   Journey Aggregate
//          │
//          ▼
//        save()
// -----------------------------------------------------------------------------

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { attachJourneyPreferences } from '../../api/components/preferences';

import type {
  JourneyConversationPreference,
  JourneyLuggagePolicy,
  JourneyMusicPreference,
  JourneyPetsPolicy,
  JourneySmokingPolicy,
} from '../../models';

import {
  JOURNEY_PREFERENCES_QUERY_KEY,
  MY_JOURNEYS_QUERY_KEY,
  JOURNEYS_BY_PROVIDER_QUERY_KEY,
  JOURNEYS_BY_PROVIDER_STATUS_QUERY_KEY,
} from '../queries';

// -----------------------------------------------------------------------------
// Variables
// -----------------------------------------------------------------------------

/**
 * Variables accepted by the Preferences configuration mutation.
 *
 * `journeyPublicId` identifies the Journey being modified.
 *
 * The remaining fields represent the preference configuration that the
 * backend will create and attach to the Journey aggregate.
 */
export interface AttachJourneyPreferencesVariables {
  /**
   * Public identifier of the Journey being modified.
   */
  journeyPublicId: string;

  /**
   * Journey smoking policy.
   */
  smoking: JourneySmokingPolicy;

  /**
   * Journey pets policy.
   */
  pets: JourneyPetsPolicy;

  /**
   * Journey luggage policy.
   */
  luggage: JourneyLuggagePolicy;

  /**
   * Preferred level of conversation during the Journey.
   */
  conversation: JourneyConversationPreference;

  /**
   * Journey music preference.
   */
  music: JourneyMusicPreference;
}

// -----------------------------------------------------------------------------
// Mutation
// -----------------------------------------------------------------------------

/**
 * Configures and attaches Preferences to a Journey.
 *
 * The backend creates the JourneyPreferences entity, attaches it to the
 * Journey aggregate, and persists the aggregate.
 */
export function useAttachJourneyPreferences() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    AttachJourneyPreferencesVariables
  >({
    mutationFn: async ({
      journeyPublicId,
      smoking,
      pets,
      luggage,
      conversation,
      music,
    }) => {
      await attachJourneyPreferences(journeyPublicId, {
        smoking,
        pets,
        luggage,
        conversation,
        music,
      });
    },

    onSuccess: async () => {
      /**
       * Configuring Preferences changes the Journey's composed
       * representation.
       *
       * `JOURNEY_PREFERENCES_QUERY_KEY` is intentionally a static namespace:
       *
       *     ['journeys', 'preferences']
       *
       * It is therefore passed directly to React Query rather than invoked
       * as a function.
       *
       * React Query will invalidate queries whose keys begin with this
       * namespace, including Journey-specific preference queries such as:
       *
       *     ['journeys', 'preferences', journeyPublicId]
       */
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: JOURNEY_PREFERENCES_QUERY_KEY,
        }),

        queryClient.invalidateQueries({
          queryKey: MY_JOURNEYS_QUERY_KEY,
        }),

        queryClient.invalidateQueries({
          queryKey: JOURNEYS_BY_PROVIDER_QUERY_KEY,
        }),

        queryClient.invalidateQueries({
          queryKey: JOURNEYS_BY_PROVIDER_STATUS_QUERY_KEY,
        }),
      ]);
    },
  });
}