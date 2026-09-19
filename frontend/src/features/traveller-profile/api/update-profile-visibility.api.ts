// -----------------------------------------------------------------------------
// sisiMove — Update Profile Visibility API
// -----------------------------------------------------------------------------
//
// Authenticated HTTP operation for changing the visibility of the currently
// authenticated traveller's Traveller Profile.
//
// Backend route:
//
//   PATCH /traveller-profiles/:travellerProfileId/visibility
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// The backend exposes visibility as a dedicated Traveller Profile command.
//
// Therefore this API module does NOT:
//
// - determine the current identity;
// - determine Traveller Profile ownership;
// - perform authorization;
// - recreate visibility rules;
// - update other Traveller Profile fields;
// - manage travel preferences;
// - manage travel corridors;
// - manage verification.
//
// The authenticated API client supplies the access token.
//
// The backend remains authoritative for authentication, authorization,
// validation, ownership, persistence, and domain behavior.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication — Authenticated HTTP
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

// -----------------------------------------------------------------------------
// Traveller Profile — Schemas
// -----------------------------------------------------------------------------

import type { UpdateProfileVisibilityInput } from '../schemas';

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
// Update Profile Visibility
// =============================================================================

/**
 * Update the visibility of a Traveller Profile.
 *
 * Backend route:
 *
 *     PATCH /traveller-profiles/:travellerProfileId/visibility
 *
 * The current backend controller dispatches:
 *
 *     ChangeTravellerProfileVisibilityCommand
 *
 * and returns no response body.
 *
 * Therefore this API function returns `void`.
 *
 * The visibility value is validated at the frontend boundary by the
 * corresponding Zod schema and validated again by the backend application
 * boundary.
 *
 * The backend remains the final authority.
 */
export async function updateProfileVisibility(
  travellerProfileId: string,
  input: UpdateProfileVisibilityInput,
): Promise<void> {
  const encodedTravellerProfileId = encodeURIComponent(travellerProfileId);

  await authenticatedApiClient.patch<void>(
    `${TRAVELLER_PROFILES_PATH}/${encodedTravellerProfileId}/visibility`,
    {
      visibility: input.visibility,
    },
  );
}