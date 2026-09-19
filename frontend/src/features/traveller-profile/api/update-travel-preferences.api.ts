// -----------------------------------------------------------------------------
// sisiMove — Update Travel Preferences API
// -----------------------------------------------------------------------------
//
// Authenticated HTTP operation for updating the Traveller Profile's travel
// preferences.
//
// Backend route:
//
//   PATCH /traveller-profiles/:travellerProfileId/preferences
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// This API module is a thin HTTP adapter around the existing Traveller
// Profile application command:
//
//   ChangeTravellerProfilePreferencesCommand
//
// It does NOT:
//
// - determine the current identity;
// - determine Traveller Profile ownership;
// - perform authorization;
// - apply business rules;
// - manage profile visibility;
// - manage travel corridors;
// - create or remove the preferences entity.
//
// Authentication is provided by authenticatedApiClient.
//
// The backend remains authoritative for authentication, authorization,
// ownership, validation, persistence, and domain behavior.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication — Authenticated HTTP
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

// -----------------------------------------------------------------------------
// Traveller Profile — Schemas
// -----------------------------------------------------------------------------

import type { UpdateTravelPreferencesInput } from '../schemas';

// =============================================================================
// Constants
// =============================================================================

/**
 * Base route for the Traveller Profile HTTP controller.
 *
 * NestJS:
 *
 *     @Controller('traveller-profiles')
 */
const TRAVELLER_PROFILES_PATH = '/traveller-profiles';

// =============================================================================
// Update Travel Preferences
// =============================================================================

/**
 * Update the persisted travel preferences for a Traveller Profile.
 *
 * Backend route:
 *
 *     PATCH /traveller-profiles/:travellerProfileId/preferences
 *
 * The current backend controller dispatches:
 *
 *     ChangeTravellerProfilePreferencesCommand
 *
 * and returns no response body.
 *
 * Therefore this API function returns `void`.
 *
 * The input schema defines the frontend write contract:
 *
 *     showJourneyHistory
 *     showJourneyStatistics
 *     allowJourneyInvites
 *
 * The backend remains the final authority for validation and persistence.
 */
export async function updateTravelPreferences(
  travellerProfileId: string,
  input: UpdateTravelPreferencesInput,
): Promise<void> {
  const encodedTravellerProfileId = encodeURIComponent(travellerProfileId);

  await authenticatedApiClient.patch<void>(
    `${TRAVELLER_PROFILES_PATH}/${encodedTravellerProfileId}/preferences`,
    {
      showJourneyHistory: input.showJourneyHistory,
      showJourneyStatistics: input.showJourneyStatistics,
      allowJourneyInvites: input.allowJourneyInvites,
    },
  );
}