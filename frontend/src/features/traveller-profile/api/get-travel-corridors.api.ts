// -----------------------------------------------------------------------------
// sisiMove — Get Travel Corridors API
// -----------------------------------------------------------------------------
//
// Authenticated HTTP operation for retrieving the Traveller Profile's
// frequent travel corridors.
//
// Backend route:
//
//   GET /traveller-profiles/:travellerProfileId/corridors
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// This API module is a thin HTTP adapter around the Traveller Profile
// application query:
//
//   GetTravellerProfileCorridorsQuery
//
// It does NOT:
//
// - determine the current identity;
// - determine Traveller Profile ownership;
// - perform authorization;
// - calculate corridors;
// - apply matching logic;
// - determine the primary corridor;
// - construct domain entities;
// - modify Traveller Profile state.
//
// Authentication is provided by authenticatedApiClient.
//
// The backend remains authoritative for authentication, authorization,
// ownership, validation, persistence, and corridor behavior.
//
// Empty collection:
//
//   []
//
// is a valid successful response and means that the Traveller Profile
// currently has no configured travel corridors.
//
// The presentation layer is responsible for the appropriate empty state.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication — Authenticated HTTP
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

// -----------------------------------------------------------------------------
// Traveller Profile — Models
// -----------------------------------------------------------------------------

import type { TravellerProfileCorridor } from '../models';

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
// Get Travel Corridors
// =============================================================================

/**
 * Retrieve the configured travel corridors for a Traveller Profile.
 *
 * Backend route:
 *
 *     GET /traveller-profiles/:travellerProfileId/corridors
 *
 * Authentication:
 *
 *     Bearer access token
 *
 * The backend currently returns:
 *
 *     TravellerProfileCorridorResponse[]
 *
 * Therefore the frontend API preserves the collection contract as a readonly
 * array.
 *
 * Empty collection:
 *
 *     []
 *
 * is a successful response and must not be converted into an error.
 */
export async function getTravelCorridors(
  travellerProfileId: string,
): Promise<readonly TravellerProfileCorridor[]> {
  const encodedTravellerProfileId = encodeURIComponent(travellerProfileId);

  return authenticatedApiClient.get<readonly TravellerProfileCorridor[]>(
    `${TRAVELLER_PROFILES_PATH}/${encodedTravellerProfileId}/corridors`,
  );
}