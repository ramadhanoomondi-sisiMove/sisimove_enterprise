// -----------------------------------------------------------------------------
// sisiMove — Trust API
// -----------------------------------------------------------------------------
//
// Public HTTP access boundary for the Trust feature.
//
// The API layer consumes the public Trust transport contract and maps it into
// the frontend Trust feature model.
//
// Architecture:
//
// HTTP response
//      ↓
// PublicTrustProfileResponse
//      ↓
// trustProfileMapper
//      ↓
// TrustProfile
//
// This layer does not:
// - access Prisma;
// - access repositories;
// - calculate ratings;
// - determine verification status;
// - award badges;
// - expose verification evidence;
// - expose internal risk or fraud information;
// - contain Trust business rules.
//
// The traveller is addressed using their public social handle rather than an
// internal Identity or Trust-domain identifier.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { apiClient } from '../../../foundation/http/api-client';

// -----------------------------------------------------------------------------
// Trust API Types
// -----------------------------------------------------------------------------

import type {
  PublicTrustProfileResponse,
} from './trust-profile.types';

// -----------------------------------------------------------------------------
// Trust Mapper
// -----------------------------------------------------------------------------

import {
  trustProfileMapper,
} from '../mappers';

// -----------------------------------------------------------------------------
// Trust Model
// -----------------------------------------------------------------------------

import type {
  TrustProfile,
} from '../models';

// -----------------------------------------------------------------------------
// API Paths
// -----------------------------------------------------------------------------

const PUBLIC_TRUST_PATH =
  '/public/travellers';

// -----------------------------------------------------------------------------
// Get Public Trust Profile
// -----------------------------------------------------------------------------

/**
 * Retrieves and maps the public Trust summary for a traveller.
 *
 * The HTTP transport representation is intentionally converted into the
 * frontend Trust model before leaving the API boundary.
 */
export async function getPublicTrustProfile(
  handle: string,
): Promise<TrustProfile> {
  const normalizedHandle =
    handle.trim();

  if (!normalizedHandle) {
    throw new Error(
      'Traveller handle is required.',
    );
  }

  const encodedHandle =
    encodeURIComponent(
      normalizedHandle,
    );

  const response =
    await apiClient.get<PublicTrustProfileResponse>(
      `${PUBLIC_TRUST_PATH}/${encodedHandle}/trust`,
    );

  return trustProfileMapper.map(
    response,
  );
}

// -----------------------------------------------------------------------------
// API Object
// -----------------------------------------------------------------------------

export const trustApi = {
  getPublic:
    getPublicTrustProfile,
};