
/**
 * sisiMove — Admin Member Trust Model
 *
 * Frontend representation of the Trust domain responses.
 *
 * Based on:
 * - TrustProfileResponseMapper
 * - TrustBadgeResponseMapper
 *
 * Dates are strings because backend Date values are serialized to JSON.
 *
 * Trust indicators are informational. This model does not independently
 * determine member eligibility, authorization, or account lifecycle.
 */

export interface MemberTrustBadge {
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

export interface MemberTrustProfileBadge {
  id: string;
  publicId: string;

  profileId: string;
  badgeId: string;

  awardedAt: string;
  revokedAt: string | null;

  active: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface MemberTrustRating {
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

export interface MemberTrustReview {
  id: string;
  publicId: string;

  ratingId: string;
  content: string;

  createdAt: string;
  updatedAt: string;
}

export interface MemberTrustEvent {
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

export interface MemberTrustProfile {
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

  ratings: MemberTrustRating[];
  reviews: MemberTrustReview[];
  badges: MemberTrustBadge[];
  profileBadges: MemberTrustProfileBadge[];
  events: MemberTrustEvent[];

  createdAt: string;
  updatedAt: string;
}
