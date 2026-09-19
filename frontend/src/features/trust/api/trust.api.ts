// -----------------------------------------------------------------------------
// sisiMove — Trust API
// -----------------------------------------------------------------------------
//
// Frontend API adapter for the authenticated / operational Trust read boundary.
//
// Architectural boundary:
//
//   Authenticated UI
//          |
//          v
//   getTravellerTrust()
//          |
//          v
//   authenticatedApiClient
//          |
//          v
//   GET /trust-profiles/member/:memberPublicId
//          |
//          v
//   TrustProfileResponse
//          |
//          v
//   TravellerTrust
//
// This adapter intentionally consumes the broader TrustProfileResponse because
// the authenticated Trust surface may require information that is deliberately
// excluded from the public marketplace representation.
//
// Public marketplace consumers MUST use:
//
//   getPublicTravellerTrust()
//
// from `public-trust.api.ts` instead.
//
// This file therefore owns:
//
// - authenticated Trust profile reads;
// - transport-to-frontend Trust mapping;
// - conversion of backend Trust response values into frontend values;
// - isolation of backend TrustProfileResponse details from UI components.
//
// This file does NOT:
//
// - create or mutate Trust profiles;
// - submit ratings;
// - create reviews;
// - manage badges;
// - expose Prisma/database IDs to UI models;
// - construct asset URLs;
// - implement Trust business rules.
//
// IMPORTANT:
//
// The frontend TravellerTrust model intentionally exposes:
//
//     badges: readonly PublicTrustBadge[]
//
// The readonly collection is part of the application-model contract.
//
// This adapter may construct that collection using a mutable local
// `PublicTrustBadge[]`, but it must never weaken the frontend model simply to
// make the mapper convenient to implement.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

// -----------------------------------------------------------------------------
// Frontend Models
// -----------------------------------------------------------------------------

import type { PublicTrustBadge } from '../models/public-trust-badge';
import type { TravellerTrust } from '../models/traveller-trust';

// -----------------------------------------------------------------------------
// API Paths
// -----------------------------------------------------------------------------

const TRUST_PROFILE_API_PATH = '/trust-profiles';

// -----------------------------------------------------------------------------
// Backend Transport Types
// -----------------------------------------------------------------------------
//
// These interfaces represent the authenticated Trust REST response.
//
// They intentionally remain local to this adapter. The rest of the frontend
// consumes the application model `TravellerTrust` rather than coupling itself
// to the backend TrustProfileResponse shape.
//
// -----------------------------------------------------------------------------

interface TrustProfileResponse {
  id: string;
  publicId: string;

  memberPublicId: string;

  status: string;
  verificationLevel: string;

  ratingAverage: number;
  ratingCount: number;

  completedJourneys: number;
  providerJourneys: number;
  passengerJourneys: number;

  completedProviderJourneys: number;
  completedPassengerJourneys: number;

  cancelledJourneys: number;
  providerCancellations: number;
  passengerCancellations: number;

  completionRate: number;
  cancellationRate: number;

  ratings: TrustRatingResponse[];
  reviews: TrustReviewResponse[];

  badges: TrustBadgeResponse[];

  profileBadges: TrustProfileBadgeResponse[];

  events: TrustEventResponse[];

  createdAt: string;
  updatedAt: string;
}

interface TrustBadgeResponse {
  id: string;
  publicId: string;

  type: string;

  name: string;
  description: string | null;

  assetPublicId: string | null;

  active: boolean;

  createdAt: string;
  updatedAt: string;
}

interface TrustProfileBadgeResponse {
  id: string;
  profileId: string;
  badgeId: string;

  awardedAt: string;
  revokedAt: string | null;

  active: boolean;

  createdAt: string;
  updatedAt: string;
}

interface TrustRatingResponse {
  id: string;
  publicId: string;

  reviewerPublicId: string;
  revieweePublicId: string;

  journeyPublicId: string;
  bookingPublicId: string | null;

  role: string;
  score: number;

  status: string;

  reviewPublicId: string | null;

  createdAt: string;
  updatedAt: string;
}

interface TrustReviewResponse {
  id: string;
  publicId: string;

  ratingId: string;

  content: string;

  createdAt: string;
  updatedAt: string;
}

interface TrustEventResponse {
  id: string;
  publicId: string;

  profileId: string;

  type: string;

  journeyPublicId: string | null;
  bookingPublicId: string | null;
  ratingPublicId: string | null;
  badgePublicId: string | null;
  disputePublicId: string | null;
  actorPublicId: string | null;

  reason: string | null;
  metadata: Record<string, unknown> | null;

  createdAt: string;
}

// -----------------------------------------------------------------------------
// Get Traveller Trust
// -----------------------------------------------------------------------------

/**
 * Load the authenticated Trust profile associated with a traveller/member.
 *
 * Backend endpoint:
 *
 *   GET /trust-profiles/member/:memberPublicId
 *
 * This is intentionally different from the public marketplace endpoint:
 *
 *   GET /trust-profiles/public/member/:memberPublicId
 *
 * The authenticated endpoint returns the broader TrustProfileResponse, which
 * is mapped into the frontend TravellerTrust model.
 *
 * The caller must already have the appropriate authenticated session.
 */
export async function getTravellerTrust(
  memberPublicId: string,
): Promise<TravellerTrust | null> {
  const normalizedMemberPublicId = memberPublicId.trim();

  if (normalizedMemberPublicId.length === 0) {
    throw new Error('Member public ID is required.');
  }

  const response =
    await authenticatedApiClient.get<TrustProfileResponse | null>(
      `${TRUST_PROFILE_API_PATH}/member/${encodeURIComponent(
        normalizedMemberPublicId,
      )}`,
    );

  if (response === null) {
    return null;
  }

  return mapTrustProfileResponse(response);
}

// -----------------------------------------------------------------------------
// Trust Profile Mapper
// -----------------------------------------------------------------------------

/**
 * Map the authenticated backend TrustProfileResponse into the frontend
 * TravellerTrust application model.
 *
 * The frontend model deliberately excludes internal Trust-domain collections
 * such as:
 *
 * - ratings;
 * - reviews;
 * - events;
 * - badge assignments.
 *
 * Those are backend/domain representations.
 *
 * The frontend summary model only receives the badge definitions that are
 * currently active and actually awarded to this traveller.
 */
function mapTrustProfileResponse(
  response: TrustProfileResponse,
): TravellerTrust {
  return {
    publicId: response.publicId,

    status: mapTravellerTrustStatus(response.status),

    verificationLevel: mapTravellerTrustVerificationLevel(
      response.verificationLevel,
    ),

    // -------------------------------------------------------------------------
    // Rating statistics
    // -------------------------------------------------------------------------

    ratingAverage: response.ratingAverage,
    ratingCount: response.ratingCount,

    // -------------------------------------------------------------------------
    // Journey statistics
    // -------------------------------------------------------------------------

    completedJourneys: response.completedJourneys,

    providerJourneys: response.providerJourneys,
    passengerJourneys: response.passengerJourneys,

    completedProviderJourneys: response.completedProviderJourneys,
    completedPassengerJourneys: response.completedPassengerJourneys,

    // -------------------------------------------------------------------------
    // Cancellation statistics
    // -------------------------------------------------------------------------

    cancelledJourneys: response.cancelledJourneys,
    providerCancellations: response.providerCancellations,
    passengerCancellations: response.passengerCancellations,

    // -------------------------------------------------------------------------
    // Trust statistics
    // -------------------------------------------------------------------------

    completionRate: response.completionRate,
    cancellationRate: response.cancellationRate,

    // -------------------------------------------------------------------------
    // Badges
    // -------------------------------------------------------------------------

    badges: mapActiveProfileBadges(
      response.badges,
      response.profileBadges,
    ),

    // -------------------------------------------------------------------------
    // Lifecycle
    // -------------------------------------------------------------------------

    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
}

// -----------------------------------------------------------------------------
// Trust Status Mapper
// -----------------------------------------------------------------------------

/**
 * Map the backend TrustProfile status into the finite frontend model.
 *
 * Unknown values intentionally degrade to ACTIVE rather than allowing an
 * arbitrary backend string to escape into the application model.
 */
function mapTravellerTrustStatus(
  value: string,
): TravellerTrust['status'] {
  switch (value) {
    case 'ACTIVE':
      return 'ACTIVE';

    case 'SUSPENDED':
      return 'SUSPENDED';

    case 'REVOKED':
      return 'REVOKED';

    default:
      return 'ACTIVE';
  }
}

// -----------------------------------------------------------------------------
// Verification Level Mapper
// -----------------------------------------------------------------------------

/**
 * Map the backend Trust verification level into the frontend model.
 *
 * Supported frontend values:
 *
 *   NONE
 *   MEMBER
 *   DRIVER
 *
 * Unknown values intentionally degrade to NONE.
 */
function mapTravellerTrustVerificationLevel(
  value: string,
): TravellerTrust['verificationLevel'] {
  switch (value) {
    case 'MEMBER':
      return 'MEMBER';

    case 'DRIVER':
      return 'DRIVER';

    case 'NONE':
    default:
      return 'NONE';
  }
}

// -----------------------------------------------------------------------------
// Active Profile Badge Mapper
// -----------------------------------------------------------------------------

/**
 * Convert the backend's separate badge-definition and profile-assignment
 * collections into the frontend TravellerTrust badge collection.
 *
 * Backend:
 *
 *     badges
 *         +
 *     profileBadges
 *
 * Frontend:
 *
 *     TravellerTrust.badges
 *
 * A badge is included only when:
 *
 * 1. the profile assignment is active;
 * 2. the profile assignment has not been revoked;
 * 3. the referenced badge definition exists;
 * 4. the badge definition itself is active.
 *
 * -----------------------------------------------------------------------------
 *
 * READONLY MODEL BOUNDARY
 *
 * TravellerTrust declares:
 *
 *     badges: readonly PublicTrustBadge[]
 *
 * That readonly declaration is intentional.
 *
 * We therefore do NOT write:
 *
 *     const mappedBadges: TravellerTrust['badges'] = [];
 *
 * followed by:
 *
 *     mappedBadges.push(...)
 *
 * because TravellerTrust['badges'] is readonly.
 *
 * Instead, this mapper uses the concrete mutable construction type:
 *
 *     PublicTrustBadge[]
 *
 * Once construction is complete, the array is returned through the readonly
 * TravellerTrust contract.
 *
 * No cast is required.
 *
 * -----------------------------------------------------------------------------
 */
function mapActiveProfileBadges(
  badges: readonly TrustBadgeResponse[],
  profileBadges: readonly TrustProfileBadgeResponse[],
): TravellerTrust['badges'] {
  // ---------------------------------------------------------------------------
  // Build an efficient lookup table for badge definitions.
  //
  // The profile assignment references the badge by backend badge ID.
  // ---------------------------------------------------------------------------

  const badgeById = new Map<string, TrustBadgeResponse>();

  for (const badge of badges) {
    badgeById.set(badge.id, badge);
  }

  // ---------------------------------------------------------------------------
  // Mutable construction collection.
  //
  // This is deliberately NOT typed as TravellerTrust['badges'], because that
  // application-model type is readonly.
  // ---------------------------------------------------------------------------

  const mappedBadges: PublicTrustBadge[] = [];

  // ---------------------------------------------------------------------------
  // Resolve active profile assignments.
  // ---------------------------------------------------------------------------

  for (const profileBadge of profileBadges) {
    // An inactive assignment is not a currently awarded badge.
    if (!profileBadge.active) {
      continue;
    }

    // A revoked assignment is no longer an awarded badge.
    if (profileBadge.revokedAt !== null) {
      continue;
    }

    // Resolve the badge definition.
    const badge = badgeById.get(profileBadge.badgeId);

    // A missing definition cannot be safely exposed to the UI.
    if (badge === undefined) {
      continue;
    }

    // Inactive badge definitions are not publicly represented as active
    // traveller badges.
    if (!badge.active) {
      continue;
    }

    mappedBadges.push({
      publicId: badge.publicId,

      type: mapTrustBadgeType(badge.type),

      name: badge.name,

      description: badge.description,

      // -----------------------------------------------------------------------
      // Asset resolution deliberately remains outside this adapter.
      //
      // The Trust API only gives us assetPublicId. Constructing delivery URLs
      // belongs to the Assets feature, not the Trust feature.
      // -----------------------------------------------------------------------

      asset: null,
    });
  }

  return mappedBadges;
}

// -----------------------------------------------------------------------------
// Trust Badge Type Mapper
// -----------------------------------------------------------------------------

/**
 * Map backend badge types into the closed frontend Trust badge union.
 *
 * Unknown backend values intentionally fall back to a neutral known value
 * rather than leaking arbitrary backend strings into the UI model.
 */
function mapTrustBadgeType(
  value: string,
): PublicTrustBadge['type'] {
  switch (value) {
    case 'IDENTITY_VERIFIED':
      return 'IDENTITY_VERIFIED';

    case 'PHONE_VERIFIED':
      return 'PHONE_VERIFIED';

    case 'EXPERIENCED_PROVIDER':
      return 'EXPERIENCED_PROVIDER';

    case 'EXPERIENCED_TRAVELLER':
      return 'EXPERIENCED_TRAVELLER';

    case 'RELIABLE_PROVIDER':
      return 'RELIABLE_PROVIDER';

    case 'RELIABLE_TRAVELLER':
      return 'RELIABLE_TRAVELLER';

    case 'HIGHLY_RATED':
      return 'HIGHLY_RATED';

    default:
      return 'HIGHLY_RATED';
  }
}