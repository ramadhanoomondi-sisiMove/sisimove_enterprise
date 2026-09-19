// -----------------------------------------------------------------------------
// sisiMove — Update Traveller Profile API
// -----------------------------------------------------------------------------
//
// Authenticated HTTP operations for updating the currently authenticated
// traveller's editable profile fields.
//
// Backend routes:
//
//   PATCH /traveller-profiles/:travellerProfileId/handle
//   PATCH /traveller-profiles/:travellerProfileId/bio
//   PATCH /traveller-profiles/:travellerProfileId/avatar
//   PATCH /traveller-profiles/:travellerProfileId/country
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// The backend currently exposes profile-field mutations as separate commands.
// Therefore this API module does NOT invent:
//
//   PATCH /traveller-profiles/me
//
// Each changed field is delegated to its corresponding backend command
// endpoint.
//
// Authentication, authorization, ownership, validation, and domain rules
// remain backend responsibilities.
//
// This module does NOT:
//
// - determine the current identity;
// - determine Traveller Profile ownership;
// - perform authorization;
// - recreate domain validation;
// - manage profile visibility;
// - manage preferences;
// - manage verification;
// - manage travel corridors.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication — Authenticated HTTP
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

// -----------------------------------------------------------------------------
// Traveller Profile — Schemas
// -----------------------------------------------------------------------------

import type { UpdateTravellerProfileInput } from '../schemas';

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
// Update Traveller Profile
// =============================================================================

/**
 * Update the authenticated traveller's editable profile fields.
 *
 * Backend mutation endpoints:
 *
 *     PATCH /traveller-profiles/:travellerProfileId/handle
 *     PATCH /traveller-profiles/:travellerProfileId/bio
 *     PATCH /traveller-profiles/:travellerProfileId/country
 *
 * The current backend controller returns no response body from these
 * mutation endpoints.
 *
 * Therefore this API function returns `void`.
 *
 * The backend remains authoritative for:
 *
 * - authentication;
 * - authorization;
 * - profile ownership;
 * - validation;
 * - persistence;
 * - domain rules.
 *
 * The caller supplies the Traveller Profile ID because the current backend
 * mutation routes require `:travellerProfileId`.
 *
 * Avatar changes are intentionally excluded from this function because the
 * backend exposes avatar mutation through its own dedicated command:
 *
 *     PATCH /traveller-profiles/:travellerProfileId/avatar
 *
 * That operation should remain a separate API boundary.
 */
export async function updateTravellerProfile(
  travellerProfileId: string,
  input: UpdateTravellerProfileInput,
): Promise<void> {
  const encodedTravellerProfileId = encodeURIComponent(travellerProfileId);

  if (input.handle !== undefined) {
    await authenticatedApiClient.patch<void>(
      `${TRAVELLER_PROFILES_PATH}/${encodedTravellerProfileId}/handle`,
      {
        handle: input.handle,
      },
    );
  }

  if (input.bio !== undefined) {
    await authenticatedApiClient.patch<void>(
      `${TRAVELLER_PROFILES_PATH}/${encodedTravellerProfileId}/bio`,
      {
        bio: input.bio,
      },
    );
  }

  if (input.countryCode !== undefined) {
    await authenticatedApiClient.patch<void>(
      `${TRAVELLER_PROFILES_PATH}/${encodedTravellerProfileId}/country`,
      {
        countryCode: input.countryCode,
      },
    );
  }
}