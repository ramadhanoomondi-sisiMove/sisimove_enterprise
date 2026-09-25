// -----------------------------------------------------------------------------
// sisiMove — Attach / Configure Journey Preferences API
// -----------------------------------------------------------------------------
//
// HTTP adapter for configuring the preferences of a Journey.
//
// Backend endpoint:
//
//   POST /api/v1/journeys/:journeyPublicId/preferences
//
// Request body:
//
//   {
//     smoking: JourneySmokingPolicy;
//     pets: JourneyPetsPolicy;
//     luggage: JourneyLuggagePolicy;
//     conversation: JourneyConversationPreference;
//     music: JourneyMusicPreference;
//   }
//
// The Journey application handler owns the creation/configuration workflow:
//
//   1. Resolve the Journey aggregate.
//   2. Create the JourneyPreferences entity from the request.
//   3. Attach the preferences to the Journey aggregate.
//   4. Persist the Journey aggregate.
//
// Architectural boundary:
//
//   Preferences Form
//       │
//       ▼
//   attachJourneyPreferences()
//       │
//       ▼
//   AuthenticatedApiClient
//       │
//       ▼
//   POST /journeys/:journeyPublicId/preferences
//       │
//       ▼
//   AttachPreferencesCommand
//       │
//       ▼
//   Journey Aggregate
//
// This adapter does NOT:
// - create domain entities;
// - generate preference public identifiers;
// - apply Journey lifecycle rules;
// - make policy decisions;
// - persist the Journey;
// - navigate;
// - manage React Query state.
//
// The backend owns preference validation, domain invariants, lifecycle rules,
// Journey association, and aggregate persistence.
//
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

import type {
  JourneyConversationPreference,
  JourneyLuggagePolicy,
  JourneyMusicPreference,
  JourneyPetsPolicy,
  JourneySmokingPolicy,
} from '../../../models';

/**
 * Request accepted by the configure Journey preferences endpoint.
 *
 * These are transport-level fields required by the backend command.
 *
 * The backend owns preference creation, validation, Journey association,
// * lifecycle rules, and aggregate persistence.
 */
export interface AttachJourneyPreferencesRequest {
  /**
   * Smoking policy for the Journey.
   */
  smoking: JourneySmokingPolicy;

  /**
   * Pet policy for the Journey.
   */
  pets: JourneyPetsPolicy;

  /**
   * Luggage policy for the Journey.
   */
  luggage: JourneyLuggagePolicy;

  /**
   * Conversation preference for the Journey.
   */
  conversation: JourneyConversationPreference;

  /**
   * Music preference for the Journey.
   */
  music: JourneyMusicPreference;
}

/**
 * Configure and attach preferences to a Journey.
 *
 * The backend creates the JourneyPreferences entity, attaches it to the
 * Journey aggregate, and persists the aggregate.
 *
 * @param journeyPublicId Public identifier of the Journey.
 * @param request Preferences configuration data.
 */
export async function attachJourneyPreferences(
  journeyPublicId: string,
  request: AttachJourneyPreferencesRequest,
): Promise<void> {
  await authenticatedApiClient.post<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/preferences`,
    request,
  );
}