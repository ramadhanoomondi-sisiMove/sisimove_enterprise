// -----------------------------------------------------------------------------
// sisiMove — Get Travel Preferences API
// -----------------------------------------------------------------------------
//
// Authenticated HTTP operation for retrieving the Traveller Profile's travel
// preferences.
//
// Backend route:
//
//   GET /traveller-profiles/:travellerProfileId/preferences
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// This API module is a thin HTTP adapter.
//
// It does NOT:
//
// - determine the current identity;
// - determine Traveller Profile ownership;
// - perform authorization;
// - construct domain entities;
// - apply preference defaults;
// - manage profile updates;
// - manage travel corridors.
//
// Authentication is provided by authenticatedApiClient.
//
// The backend remains authoritative for authentication, authorization,
// ownership, persistence, and preference behavior.
//
// Empty preferences:
//
//   null
//
// is a valid response according to the current backend controller contract.
// It means the Traveller Profile does not currently have a persisted
// TravellerProfilePreferences record.
//
// The presentation layer decides how that state should be displayed.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication — Authenticated HTTP
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

// -----------------------------------------------------------------------------
// Traveller Profile — Models
// -----------------------------------------------------------------------------

import type { TravellerProfilePreferences } from '../models';

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
// Get Travel Preferences
// =============================================================================

/**
 * Retrieve the persisted travel preferences for a Traveller Profile.
 *
 * Backend route:
 *
 *     GET /traveller-profiles/:travellerProfileId/preferences
 *
 * Authentication:
 *
 *     Bearer access token
 *
 * The backend response is mapped to the frontend
 * `TravellerProfilePreferences` model by the authenticated API boundary.
 *
 * The backend currently returns:
 *
 *     TravellerProfilePreferencesResponse | null
 *
 * Therefore `null` is intentionally preserved as a valid result.
 */
export async function getTravelPreferences(
  travellerProfileId: string,
): Promise<TravellerProfilePreferences | null> {
  const encodedTravellerProfileId = encodeURIComponent(travellerProfileId);

  return authenticatedApiClient.get<TravellerProfilePreferences | null>(
    `${TRAVELLER_PROFILES_PATH}/${encodedTravellerProfileId}/preferences`,
  );
}