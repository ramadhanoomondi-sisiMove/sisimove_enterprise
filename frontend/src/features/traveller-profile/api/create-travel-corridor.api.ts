// -----------------------------------------------------------------------------
// sisiMove — Create Travel Corridor API
// -----------------------------------------------------------------------------
//
// Authenticated HTTP operation for creating a Traveller Profile travel
// corridor.
//
// Backend route:
//
//   POST /traveller-profiles/:travellerProfileId/corridors
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// This API module is a thin HTTP adapter around the Traveller Profile
// application command:
//
//   CreateTravellerProfileCorridorCommand
//
// It does NOT:
//
// - determine the current identity;
// - determine Traveller Profile ownership;
// - perform authorization;
// - calculate coordinates;
// - normalize corridor names;
// - determine corridor matching behavior;
// - enforce domain rules;
// - update other Traveller Profile data.
//
// Authentication is provided by authenticatedApiClient.
//
// The backend remains authoritative for authentication, authorization,
// ownership, validation, persistence, and corridor business rules.
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

// -----------------------------------------------------------------------------
// Traveller Profile — Schemas
// -----------------------------------------------------------------------------

import type { CreateTravelCorridorInput } from '../schemas';

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
// Create Travel Corridor
// =============================================================================

/**
 * Create a new travel corridor for a Traveller Profile.
 *
 * Backend route:
 *
 *     POST /traveller-profiles/:travellerProfileId/corridors
 *
 * The backend creates and persists the TravellerProfileCorridor and returns
 * the created corridor.
 *
 * The frontend API therefore returns the created
 * `TravellerProfileCorridor` model.
 */
export async function createTravelCorridor(
  travellerProfileId: string,
  input: CreateTravelCorridorInput,
): Promise<TravellerProfileCorridor> {
  const encodedTravellerProfileId = encodeURIComponent(travellerProfileId);

  return authenticatedApiClient.post<TravellerProfileCorridor>(
    `${TRAVELLER_PROFILES_PATH}/${encodedTravellerProfileId}/corridors`,
    {
      originName: input.originName,
      destinationName: input.destinationName,
      originLatitude: input.originLatitude,
      originLongitude: input.originLongitude,
      destinationLatitude: input.destinationLatitude,
      destinationLongitude: input.destinationLongitude,
      corridorKey: input.corridorKey,
      isPrimary: input.isPrimary,
    },
  );
}