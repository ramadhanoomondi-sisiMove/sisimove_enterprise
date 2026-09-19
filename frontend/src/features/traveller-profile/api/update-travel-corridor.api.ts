// -----------------------------------------------------------------------------
// sisiMove — Update Travel Corridor API
// -----------------------------------------------------------------------------
//
// Authenticated HTTP operation for updating an existing Traveller Profile
// travel corridor.
//
// Backend route:
//
//   PATCH /traveller-profiles/:travellerProfileId/corridors/:corridorId
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// This API module is a thin HTTP adapter around the Traveller Profile
// application command.
//
// It does NOT:
//
// - determine the current identity;
// - determine Traveller Profile ownership;
// - perform authorization;
// - calculate coordinates;
// - normalize corridor names;
// - apply corridor business rules;
// - manage Traveller Profile preferences;
// - manage Traveller Profile visibility.
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

import type { UpdateTravelCorridorInput } from '../schemas';

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
// Update Travel Corridor
// =============================================================================

/**
 * Update an existing travel corridor.
 *
 * Backend route:
 *
 *     PATCH /traveller-profiles/:travellerProfileId/corridors/:corridorId
 *
 * The backend returns the updated TravellerProfileCorridor.
 *
 * The frontend API therefore returns the updated corridor model.
 */
export async function updateTravelCorridor(
  travellerProfileId: string,
  corridorId: string,
  input: UpdateTravelCorridorInput,
): Promise<TravellerProfileCorridor> {
  const encodedTravellerProfileId = encodeURIComponent(travellerProfileId);
  const encodedCorridorId = encodeURIComponent(corridorId);

  return authenticatedApiClient.patch<TravellerProfileCorridor>(
    `${TRAVELLER_PROFILES_PATH}/${encodedTravellerProfileId}/corridors/${encodedCorridorId}`,
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