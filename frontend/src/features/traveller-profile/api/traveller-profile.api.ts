// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile API
// -----------------------------------------------------------------------------
//
// Typed API boundary for Traveller Profile operations.
//
// Responsibilities:
// - Define Traveller Profile endpoints.
// - Validate endpoint inputs.
// - Delegate HTTP transport to the shared ApiClient.
// - Return transport contracts to the mapper boundary.
//
// Non-responsibilities:
// - Authentication/authorization.
// - Business rules.
// - Domain logic.
// - Response normalization.
// - Feature-model mapping.
// - React state management.
//
// Public Traveller Profile endpoints are intentionally read-only.
//
// Authenticated profile mutations must be introduced separately once their
// request contracts, authorization boundaries, and feature requirements have
// been defined.
//
// Trust is intentionally NOT part of this API contract.
// Trust belongs to the dedicated features/trust feature.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { apiClient } from '../../../foundation/http/api-client';

// -----------------------------------------------------------------------------
// Transport Types
// -----------------------------------------------------------------------------

import type {
  PublicTravellerProfileResponse,
} from './traveller-profile.types';

// -----------------------------------------------------------------------------
// API Paths
// -----------------------------------------------------------------------------

const PUBLIC_TRAVELLER_PROFILE_PATH =
  '/public/travellers';

// -----------------------------------------------------------------------------
// Public Traveller Profile
// -----------------------------------------------------------------------------

/**
 * Retrieves a public traveller profile by social handle.
 *
 * The handle is the public social identity used by SisiMove.
 *
 * Internal Identity-domain identifiers are deliberately not required by the
 * public profile experience.
 *
 * The API returns the HTTP transport contract. Mapping into the canonical
 * TravellerProfile feature model is the responsibility of the mapper layer.
 *
 * @param handle Public traveller handle.
 * @returns Public Traveller Profile HTTP response.
 */
export async function getPublicTravellerProfile(
  handle: string,
): Promise<PublicTravellerProfileResponse> {
  const normalizedHandle = handle.trim();

  if (!normalizedHandle) {
    throw new Error(
      'Traveller handle is required.',
    );
  }

  const encodedHandle =
    encodeURIComponent(normalizedHandle);

  return apiClient.get<PublicTravellerProfileResponse>(
    `${PUBLIC_TRAVELLER_PROFILE_PATH}/${encodedHandle}`,
  );
}

// -----------------------------------------------------------------------------
// Public API
// -----------------------------------------------------------------------------

export const travellerProfileApi = {
  getPublic: getPublicTravellerProfile,
};