// -----------------------------------------------------------------------------
// sisiMove — Delete Travel Corridor API
// -----------------------------------------------------------------------------
//
// Authenticated HTTP operation for deleting an existing Traveller Profile
// travel corridor.
//
// Backend route:
//
//   DELETE /traveller-profiles/:travellerProfileId/corridors/:corridorId
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
// - apply corridor business rules;
// - update Traveller Profile preferences;
// - manage Traveller Profile visibility.
//
// Authentication is provided by authenticatedApiClient.
//
// The backend remains authoritative for authentication, authorization,
// ownership, validation, persistence, and domain behavior.
//
// The current backend controller returns no response body for this mutation.
// Therefore this API function returns `void`.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication — Authenticated HTTP
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

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
// Delete Travel Corridor
// =============================================================================

/**
 * Delete a travel corridor from a Traveller Profile.
 *
 * Backend route:
 *
 *     DELETE /traveller-profiles/:travellerProfileId/corridors/:corridorId
 *
 * The backend controller returns no response body.
 *
 * Therefore this API function returns `void`.
 */
export async function deleteTravelCorridor(
  travellerProfileId: string,
  corridorId: string,
): Promise<void> {
  const encodedTravellerProfileId = encodeURIComponent(travellerProfileId);
  const encodedCorridorId = encodeURIComponent(corridorId);

  await authenticatedApiClient.delete<void>(
    `${TRAVELLER_PROFILES_PATH}/${encodedTravellerProfileId}/corridors/${encodedCorridorId}`,
  );
}