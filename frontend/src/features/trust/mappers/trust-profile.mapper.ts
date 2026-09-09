// -----------------------------------------------------------------------------
// sisiMove — Trust Profile Mapper
// -----------------------------------------------------------------------------
//
// Maps the public Trust API transport representation into the frontend
// Trust feature model.
//
// Responsibilities:
// - Normalize API transport values.
// - Protect the frontend model from malformed transport data.
// - Convert transport contracts into feature models.
//
// This mapper does not:
// - calculate ratings;
// - determine verification status;
// - award badges;
// - apply Trust business rules;
// - access Prisma or repositories;
// - expose private Trust information.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Trust Models
// -----------------------------------------------------------------------------

import type {
  TrustBadge,
  TrustJourneyHistory,
  TrustProfile,
  TrustRating,
  TrustVerification,
} from '../models';

// -----------------------------------------------------------------------------
// Trust API Types
// -----------------------------------------------------------------------------

import type {
  PublicTrustBadgeResponse,
  PublicTrustJourneyHistoryResponse,
  PublicTrustProfileResponse,
  PublicTrustRatingResponse,
  PublicTrustVerificationResponse,
} from '../api/trust-profile.types';

// -----------------------------------------------------------------------------
// Mapper Contract
// -----------------------------------------------------------------------------

/**
 * Maps a public Trust API response into the frontend Trust model.
 */
export interface TrustProfileMapper {
  map(response: PublicTrustProfileResponse): TrustProfile;
}

// -----------------------------------------------------------------------------
// String Normalization
// -----------------------------------------------------------------------------

/**
 * Normalizes a required string received from the API.
 *
 * Required strings remain strings in the frontend model. Empty values are
 * preserved rather than silently inventing fallback data.
 */
function normalizeRequiredString(
  value: string,
): string {
  return value.trim();
}

/**
 * Normalizes an optional string received from the API.
 *
 * Empty strings are represented as null so consumers do not need to handle
 * meaningless empty presentation values.
 */
function normalizeNullableString(
  value: string | null,
): string | null {
  if (value === null) {
    return null;
  }

  const normalizedValue = value.trim();

  return normalizedValue || null;
}

// -----------------------------------------------------------------------------
// Numeric Normalization
// -----------------------------------------------------------------------------

/**
 * Normalizes a non-negative integer.
 *
 * Trust counters are counts and therefore must never become negative or
 * fractional values in the frontend model.
 */
function normalizeNonNegativeInteger(
  value: number,
): number | null {
  if (!Number.isFinite(value)) {
    return null;
  }

  const normalizedValue = Math.floor(value);

  if (normalizedValue < 0) {
    return null;
  }

  return normalizedValue;
}

/**
 * Normalizes a public rating score.
 *
 * The Trust domain remains responsible for defining the valid rating scale.
 * The frontend therefore validates only that the value is finite and
 * non-negative rather than imposing a product-specific scale here.
 */
function normalizeRatingScore(
  value: number | null,
): number | null {
  if (value === null) {
    return null;
  }

  if (!Number.isFinite(value)) {
    return null;
  }

  if (value < 0) {
    return null;
  }

  return value;
}

// -----------------------------------------------------------------------------
// Verification Mapper
// -----------------------------------------------------------------------------

function mapTrustVerification(
  response: PublicTrustVerificationResponse,
): TrustVerification {
  return {
    verified: response.verified === true,
    level: normalizeNullableString(response.level),
  };
}

// -----------------------------------------------------------------------------
// Rating Mapper
// -----------------------------------------------------------------------------

function mapTrustRating(
  response: PublicTrustRatingResponse,
): TrustRating {
  return {
    score: normalizeRatingScore(response.score),
    count:
      normalizeNonNegativeInteger(response.count) ?? 0,
  };
}

// -----------------------------------------------------------------------------
// Journey History Mapper
// -----------------------------------------------------------------------------

function mapTrustJourneyHistory(
  response: PublicTrustJourneyHistoryResponse,
): TrustJourneyHistory {
  return {
    completedJourneys:
      normalizeNonNegativeInteger(
        response.completedJourneys,
      ) ?? 0,

    cancelledJourneys:
      response.cancelledJourneys === null
        ? null
        : normalizeNonNegativeInteger(
            response.cancelledJourneys,
          ),
  };
}

// -----------------------------------------------------------------------------
// Badge Mapper
// -----------------------------------------------------------------------------

function mapTrustBadge(
  response: PublicTrustBadgeResponse,
): TrustBadge {
  return {
    publicId: normalizeRequiredString(
      response.publicId,
    ),

    type: normalizeRequiredString(
      response.type,
    ),

    name: normalizeRequiredString(
      response.name,
    ),

    description: normalizeNullableString(
      response.description,
    ),

    assetUrl: normalizeNullableString(
      response.assetUrl,
    ),
  };
}

// -----------------------------------------------------------------------------
// Trust Profile Mapper
// -----------------------------------------------------------------------------

function mapTrustProfile(
  response: PublicTrustProfileResponse,
): TrustProfile {
  return {
    verification: mapTrustVerification(
      response.verification,
    ),

    rating: mapTrustRating(
      response.rating,
    ),

    journeyHistory: mapTrustJourneyHistory(
      response.journeyHistory,
    ),

    badges: response.badges.map(
      mapTrustBadge,
    ),
  };
}

// -----------------------------------------------------------------------------
// Default Mapper
// -----------------------------------------------------------------------------

class DefaultTrustProfileMapper
  implements TrustProfileMapper
{
  map(
    response: PublicTrustProfileResponse,
  ): TrustProfile {
    return mapTrustProfile(response);
  }
}

// -----------------------------------------------------------------------------
// Mapper Instance
// -----------------------------------------------------------------------------

export const trustProfileMapper: TrustProfileMapper =
  new DefaultTrustProfileMapper();