//src/features/admin/trust/types/trust.types.ts
/**
 * sisiMove — Admin Trust API Types
 *
 * Defines the frontend transport contracts for Trust API responses.
 *
 * Source contracts:
 * - TrustBadgeResponseMapper
 * - TrustProfileResponseMapper
 *
 * Responsibilities:
 * - Represent the backend response payloads accurately.
 * - Preserve nullable fields from the backend contracts.
 * - Represent serialized timestamps as strings.
 * - Provide shared types for Trust API adapters and frontend models.
 *
 * Non-responsibilities:
 * - Mapping API responses into frontend models.
 * - Defining request payloads or mutation commands.
 * - Defining UI-specific state or presentation values.
 * - Reimplementing backend domain rules.
 */

// -----------------------------------------------------------------------------
// Shared API Types
// -----------------------------------------------------------------------------

/**
 * Dates are serialized to ISO 8601 strings when returned through JSON.
 */
export type TrustApiTimestamp = string;

/**
 * Metadata attached to a Trust event.
 *
 * The backend does not guarantee a fixed metadata schema.
 */
export type TrustApiMetadata = Record<string, unknown>;

// -----------------------------------------------------------------------------
// Trust Badge Response
// -----------------------------------------------------------------------------

/**
 * API representation of a Trust badge definition.
 *
 * Corresponds to the backend TrustBadgeResponse interface.
 */
export interface TrustBadgeApiResponse {
  id: string;
  publicId: string;

  type: string;

  name: string;
  description: string | null;

  assetPublicId: string | null;

  active: boolean;

  createdAt: TrustApiTimestamp;
  updatedAt: TrustApiTimestamp;
}

// -----------------------------------------------------------------------------
// Trust Profile Badge Response
// -----------------------------------------------------------------------------

/**
 * API representation of a badge assignment to a Trust profile.
 *
 * profileId and badgeId retain the identifiers returned by the backend.
 */
export interface TrustProfileBadgeApiResponse {
  id: string;
  publicId: string;

  profileId: string;
  badgeId: string;

  awardedAt: TrustApiTimestamp;
  revokedAt: TrustApiTimestamp | null;

  active: boolean;

  createdAt: TrustApiTimestamp;
  updatedAt: TrustApiTimestamp;
}

// -----------------------------------------------------------------------------
// Trust Rating Response
// -----------------------------------------------------------------------------

/**
 * API representation of a rating submitted for a member.
 */
export interface TrustRatingApiResponse {
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

  createdAt: TrustApiTimestamp;
  updatedAt: TrustApiTimestamp;
}

// -----------------------------------------------------------------------------
// Trust Review Response
// -----------------------------------------------------------------------------

/**
 * API representation of written feedback associated with a rating.
 */
export interface TrustReviewApiResponse {
  id: string;
  publicId: string;

  ratingId: string;

  content: string;

  createdAt: TrustApiTimestamp;
  updatedAt: TrustApiTimestamp;
}

// -----------------------------------------------------------------------------
// Trust Event Response
// -----------------------------------------------------------------------------

/**
 * API representation of an event in a Trust profile's history.
 */
export interface TrustEventApiResponse {
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
  metadata: TrustApiMetadata | null;

  createdAt: TrustApiTimestamp;
}

// -----------------------------------------------------------------------------
// Trust Profile Response
// -----------------------------------------------------------------------------

/**
 * Full API representation of a Trust profile.
 *
 * This is the operational response contract from the backend
 * TrustProfileResponseMapper, not the reduced public marketplace projection.
 */
export interface TrustProfileApiResponse {
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

  ratings: TrustRatingApiResponse[];
  reviews: TrustReviewApiResponse[];
  badges: TrustBadgeApiResponse[];
  profileBadges: TrustProfileBadgeApiResponse[];
  events: TrustEventApiResponse[];

  createdAt: TrustApiTimestamp;
  updatedAt: TrustApiTimestamp;
}
/**
 * Summary representation returned by GET /trust-profiles.
 *
 * The collection endpoint omits nested ratings, reviews, badges,
 * profile badge assignments, and events.
 */
export type TrustProfileSummaryApiResponse = Omit<
  TrustProfileApiResponse,
  | 'ratings'
  | 'reviews'
  | 'badges'
  | 'profileBadges'
  | 'events'
>;

/**
 * Paginated Trust profile collection response.
 */
export interface TrustProfilesPageApiResponse {
  profiles: TrustProfileSummaryApiResponse[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}