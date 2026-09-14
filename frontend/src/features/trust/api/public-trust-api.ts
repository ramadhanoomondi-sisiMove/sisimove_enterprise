// -----------------------------------------------------------------------------
// sisiMove — Public Trust API
// -----------------------------------------------------------------------------
//
// Frontend API adapter for the public Trust read boundary.
//
// The Trust backend exposes two different kinds of representations:
//
// 1. Operational TrustProfileResponse
//    - rich internal representation;
//    - contains profile metadata, ratings, reviews, events, badge catalogue
//      entries, profile-badge assignments, lifecycle fields, and internal IDs;
//    - intended for the Trust domain's broader presentation/API surface.
//
// 2. PublicTrustProfileResponse
//    - deliberately reduced marketplace representation;
//    - contains only information that is safe and useful for public traveller
//      discovery;
//    - already combines active profile badges with their badge definitions;
//    - already resolves public badge asset metadata.
//
// The public marketplace MUST consume the second representation.
//
// Architectural boundary:
//
//   Backend Trust domain
//          |
//          v
//   PublicTrustProfileResponse
//          |
//          v
//   this API adapter
//          |
//          v
//   PublicTravellerTrust
//          |
//          v
//   marketplace UI
//
// The frontend therefore does NOT:
//
// - consume TrustProfile internals;
// - join badge definitions with profile assignments;
// - inspect TrustProfileBadge records;
// - construct asset URLs;
// - expose backend database IDs;
// - reproduce backend Trust-domain business rules.
//
// Those responsibilities belong to the backend Trust public read boundary.
//
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { apiClient } from '@/foundation/http/api-client';


// -----------------------------------------------------------------------------
// Frontend Models
// -----------------------------------------------------------------------------

import type {
  PublicTravellerTrust,
  PublicTrustBadge,
  PublicTrustBadgeAsset,
} from '../models';


// -----------------------------------------------------------------------------
// API Paths
// -----------------------------------------------------------------------------

const TRUST_PROFILE_API_PATH = '/trust-profiles';


// -----------------------------------------------------------------------------
// Backend Public Transport Types
// -----------------------------------------------------------------------------
//
// These interfaces represent the dedicated public Trust REST contract.
//
// They intentionally remain local to this API adapter so the rest of the
// frontend is not coupled to backend presentation-layer structures.
//
// IMPORTANT:
//
// Do not replace these with the broader TrustProfileResponse.
//
// The public endpoint exists specifically so the frontend does not have to
// understand TrustProfile, TrustBadge, or TrustProfileBadge internals.
// -----------------------------------------------------------------------------


/**
 * Public asset metadata supplied by the backend Asset delivery boundary.
 *
 * The backend has already resolved the asset into a browser-consumable URL.
 *
 * The frontend must consume this URL as-is and must never reconstruct it from
 * `publicId`.
 */
interface PublicTrustBadgeAssetResponse {
  publicId: string;
  url: string;
  alt: string;
}


/**
 * Public Trust badge representation.
 *
 * This is already the badge actually awarded to the traveller. The backend
 * public Trust query has performed the necessary badge/profile-badge join.
 */
interface PublicTrustBadgeResponse {
  publicId: string;
  type: string;
  name: string;
  description: string | null;
  asset: PublicTrustBadgeAssetResponse | null;
}


/**
 * Deliberately reduced Trust representation intended for public marketplace
 * consumption.
 *
 * This is the transport contract exposed by:
 *
 *   GET /trust-profiles/public/member/:memberPublicId
 *
 * It must remain smaller than the operational TrustProfileResponse.
 */
interface PublicTrustProfileResponse {
  verificationLevel: string;

  ratingAverage: number;
  ratingCount: number;

  completedJourneys: number;

  badges: PublicTrustBadgeResponse[];
}


// -----------------------------------------------------------------------------
// Public Traveller Trust Query
// -----------------------------------------------------------------------------

/**
 * Load the public Trust summary for a traveller/member.
 *
 * Backend endpoint:
 *
 *   GET /trust-profiles/public/member/:memberPublicId
 *
 * This is the preferred public Trust query for marketplace enrichment.
 *
 * The backend deliberately returns only the public Trust representation:
 *
 * - verification level;
 * - rating summary;
 * - completed journeys;
 * - active public badges;
 * - public badge asset metadata.
 *
 * No operational TrustProfile fields are transported into the marketplace.
 */
export async function getTravellerTrust(
  memberPublicId: string,
): Promise<PublicTravellerTrust> {
  const normalizedMemberPublicId = memberPublicId.trim();

  if (normalizedMemberPublicId.length === 0) {
    throw new Error('Member public ID is required.');
  }

  const response = await apiClient.get<PublicTrustProfileResponse>(
    `${TRUST_PROFILE_API_PATH}/public/member/${encodeURIComponent(
      normalizedMemberPublicId,
    )}`,
  );

  return mapPublicTrustProfileResponse(response);
}


// -----------------------------------------------------------------------------
// Public Trust Profile Query
// -----------------------------------------------------------------------------

/**
 * Load a Trust profile by its own public identifier.
 *
 * Backend endpoint:
 *
 *   GET /trust-profiles/public/:publicId
 *
 * NOTE:
 *
 * This endpoint is the existing Trust-profile resource endpoint and is
 * distinct from the dedicated marketplace endpoint above.
 *
 * The marketplace should normally use `getTravellerTrust()` because Journey
 * and Traveller public models already carry the member/traveller public ID.
 *
 * This function remains available for callers that genuinely have a Trust
 * profile public ID.
 */
export async function getPublicTrustProfile(
  trustProfilePublicId: string,
): Promise<PublicTravellerTrust> {
  const normalizedTrustProfilePublicId = trustProfilePublicId.trim();

  if (normalizedTrustProfilePublicId.length === 0) {
    throw new Error('Trust profile public ID is required.');
  }

  const response = await apiClient.get<TrustProfileResponse>(
    `${TRUST_PROFILE_API_PATH}/public/${encodeURIComponent(
      normalizedTrustProfilePublicId,
    )}`,
  );

  return mapLegacyTrustProfileResponse(response);
}


// -----------------------------------------------------------------------------
// Legacy Trust Profile Transport Contract
// -----------------------------------------------------------------------------
//
// This contract exists ONLY for `getPublicTrustProfile()` because that older
// endpoint still returns the broad TrustProfileResponse.
//
// It is deliberately isolated from the marketplace path.
//
// New public marketplace consumers MUST use `getTravellerTrust()` instead.
//
// Once the backend exposes a reduced public query by TrustProfile public ID,
// this legacy section can be removed entirely.
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
// Public Trust Mapper
// -----------------------------------------------------------------------------

/**
 * Map the dedicated backend public Trust representation into the frontend
 * marketplace model.
 *
 * There is intentionally very little transformation here.
 *
 * The backend public query has already performed the domain-level composition
 * required to determine:
 *
 * - the public Trust summary;
 * - which badges are actually awarded;
 * - which badge assets are publicly usable.
 *
 * The frontend therefore performs only transport-to-frontend-model mapping.
 */
function mapPublicTrustProfileResponse(
  response: PublicTrustProfileResponse,
): PublicTravellerTrust {
  return {
    verificationLevel: mapVerificationLevel(response.verificationLevel),

    ratingAverage: response.ratingAverage,

    ratingCount: response.ratingCount,

    completedJourneys: response.completedJourneys,

    badges: response.badges.map(mapPublicTrustBadgeResponse),
  };
}


// -----------------------------------------------------------------------------
// Public Trust Badge Mapper
// -----------------------------------------------------------------------------

/**
 * Map a backend public Trust badge into the frontend badge model.
 *
 * The backend has already resolved the public asset reference when one exists.
 *
 * Therefore:
 *
 *   response.asset.url
 *
 * is a genuine backend-provided delivery URL.
 *
 * The frontend does not derive or modify that URL.
 */
function mapPublicTrustBadgeResponse(
  response: PublicTrustBadgeResponse,
): PublicTrustBadge {
  return {
    publicId: response.publicId,

    type: mapTrustBadgeType(response.type),

    name: response.name,

    description: response.description,

    asset:
      response.asset === null
        ? null
        : mapPublicTrustBadgeAssetResponse(response.asset),
  };
}


// -----------------------------------------------------------------------------
// Public Trust Badge Asset Mapper
// -----------------------------------------------------------------------------

/**
 * Map backend public badge asset metadata into the frontend asset model.
 *
 * Asset delivery remains owned by the backend Asset domain.
 *
 * The frontend deliberately does NOT construct:
 *
 *   /assets/public/:assetPublicId
 *
 * or any other URL from the opaque asset public ID.
 */
function mapPublicTrustBadgeAssetResponse(
  response: PublicTrustBadgeAssetResponse,
): PublicTrustBadgeAsset {
  return {
    publicId: response.publicId,
    url: response.url,
    alt: response.alt,
  };
}


// -----------------------------------------------------------------------------
// Verification Level
// -----------------------------------------------------------------------------

/**
 * Map the backend verification string into the finite frontend union.
 *
 * Unknown backend values intentionally degrade to NONE rather than allowing
 * an unexpected value to leak into the public UI model.
 */
function mapVerificationLevel(
  value: string,
): PublicTravellerTrust['verificationLevel'] {
  switch (value) {
    case 'BASIC':
      return 'BASIC';

    case 'VERIFIED':
      return 'VERIFIED';

    case 'HIGHLY_VERIFIED':
      return 'HIGHLY_VERIFIED';

    case 'NONE':
    default:
      return 'NONE';
  }
}


// -----------------------------------------------------------------------------
// Trust Badge Type
// -----------------------------------------------------------------------------

/**
 * Keep the frontend Trust model closed over the badge types it understands.
 *
 * Unknown backend badge types intentionally degrade to the existing neutral
 * frontend fallback rather than leaking arbitrary backend strings into the UI.
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


// -----------------------------------------------------------------------------
// Legacy Trust Profile Mapper
// -----------------------------------------------------------------------------
//
// This mapper exists only to preserve the existing `getPublicTrustProfile()`
// function while its backend endpoint still returns the broad operational
// TrustProfileResponse.
//
// It should NOT be used by the public marketplace Journey/Demand enrichment
// path.
//
// Unlike the new public endpoint, this legacy response does not provide a
// genuine public badge asset URL. Consequently badge assets remain null here.
// -----------------------------------------------------------------------------


function mapLegacyTrustProfileResponse(
  response: TrustProfileResponse,
): PublicTravellerTrust {
  return {
    verificationLevel: mapVerificationLevel(response.verificationLevel),

    ratingAverage: response.ratingAverage,

    ratingCount: response.ratingCount,

    completedJourneys: response.completedJourneys,

    badges: mapLegacyProfileBadges(
      response.badges,
      response.profileBadges,
    ),
  };
}


/**
 * Join legacy Trust badge definitions with profile assignments.
 *
 * This logic exists only because the legacy Trust endpoint exposes the two
 * collections separately.
 *
 * The dedicated public endpoint performs this composition on the backend and
 * therefore does not require this logic.
 */
function mapLegacyProfileBadges(
  badges: TrustBadgeResponse[],
  profileBadges: TrustProfileBadgeResponse[],
): PublicTrustBadge[] {
  const badgeById = new Map<string, TrustBadgeResponse>();

  for (const badge of badges) {
    badgeById.set(badge.id, badge);
  }

  const mappedBadges: PublicTrustBadge[] = [];

  for (const profileBadge of profileBadges) {
    if (!profileBadge.active || profileBadge.revokedAt !== null) {
      continue;
    }

    const badge = badgeById.get(profileBadge.badgeId);

    if (badge === undefined || !badge.active) {
      continue;
    }

    mappedBadges.push({
      publicId: badge.publicId,

      type: mapTrustBadgeType(badge.type),

      name: badge.name,

      description: badge.description,

      // The legacy endpoint exposes only assetPublicId. It does not provide
      // public delivery metadata, so the frontend must not fabricate a URL.
      asset: null,
    });
  }

  return mappedBadges;
}

