// src/features/journey/api/preferences/attach-journey-preferences.ts

// -----------------------------------------------------------------------------
// sisiMove — Attach Journey Preferences API
// -----------------------------------------------------------------------------
//
// Mirrors:
//
//   POST /journeys/:journeyPublicId/preferences
//
// The backend creates the JourneyPreferencesEntity and delegates attachment
// and invariant enforcement to the Journey aggregate.
//
// The frontend sends only the preference configuration. The backend owns
// identifier generation, domain Value Objects, validation, and persistence.
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from "@/features/authentication/http/authenticated-api-client";
import type { RequestOptions } from "@/foundation/http";

import type { JourneySmokingPolicy } from "../../models/journey-smoking-policy";
import type { JourneyPetsPolicy } from "../../models/journey-pets-policy";
import type { JourneyLuggagePolicy } from "../../models/journey-luggage-policy";
import type { JourneyConversationPreference } from "../../models/journey-conversation-preference";
import type { JourneyMusicPreference } from "../../models/journey-music-preference";

// -----------------------------------------------------------------------------
// Request
// -----------------------------------------------------------------------------

/**
 * HTTP payload for attaching Journey preferences.
 *
 * These values mirror the Journey preferences domain contract.
 *
 * The frontend does not send a preferences public identifier because the
 * backend creates the JourneyPreferencesEntity.
 */
export interface AttachJourneyPreferencesRequest {
  readonly smoking: JourneySmokingPolicy;
  readonly pets: JourneyPetsPolicy;
  readonly luggage: JourneyLuggagePolicy;
  readonly conversation: JourneyConversationPreference;
  readonly music: JourneyMusicPreference;
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

/**
 * Attaches preferences to an existing Journey.
 *
 * Backend:
 *   POST /journeys/:journeyPublicId/preferences
 *
 * Request body:
 *   {
 *     smoking: JourneySmokingPolicy;
 *     pets: JourneyPetsPolicy;
 *     luggage: JourneyLuggagePolicy;
 *     conversation: JourneyConversationPreference;
 *     music: JourneyMusicPreference;
 *   }
 *
 * Response:
 *   no response body
 *
 * The resulting Journey state should be obtained through the canonical
 * authenticated Journey query rather than fabricated locally.
 */
export async function attachJourneyPreferences(
  journeyPublicId: string,
  request: AttachJourneyPreferencesRequest,
  options: RequestOptions = {},
): Promise<void> {
  await authenticatedApiClient.post<void>(
    `/journeys/${encodeURIComponent(journeyPublicId)}/preferences`,
    request,
    options,
  );
}