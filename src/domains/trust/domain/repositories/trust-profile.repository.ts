// -----------------------------------------------------------------------------
// Trust Profile Repository
// -----------------------------------------------------------------------------

import type { TrustProfileAggregate } from '../aggregates/trust-profile.aggregate';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import type { TrustProfileEntity } from '../entities/trust-profile.entity';
import type { TrustRatingEntity } from '../entities/trust-rating.entity';
import type { TrustReviewEntity } from '../entities/trust-review.entity';
import type { TrustProfileBadgeEntity } from '../entities/trust-profile-badge.entity';
import type { TrustEventEntity } from '../entities/trust-event.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { TrustProfileId } from '../value-objects/trust-profile-id.vo';
import type { MemberPublicId } from '../value-objects/member-public-id.vo';
import type { TrustRatingId } from '../value-objects/trust-rating-id.vo';
import type { TrustReviewId } from '../value-objects/trust-review-id.vo';
import type { TrustProfileBadgeId } from '../value-objects/trust-profile-badge-id.vo';
import type { TrustEventId } from '../value-objects/trust-event-id.vo';

import type { JourneyPublicId } from '../value-objects/journey-public-id.vo';
import type { BookingPublicId } from '../value-objects/booking-public-id.vo';
import type { RatingPublicId } from '../value-objects/rating-public-id.vo';
import type { BadgePublicId } from '../value-objects/badge-public-id.vo';
import type { DisputePublicId } from '../value-objects/dispute-public-id.vo';

import type { TrustProfileStatusValueObject } from '../value-objects/trust-profile-status.vo';
import type { TrustVerificationLevelValueObject } from '../value-objects/trust-verification-level.vo';

/**
 * Repository abstraction for the Trust Profile aggregate.
 *
 * The domain layer depends only on this contract.
 * Infrastructure is responsible for implementing persistence.
 *
 * Aggregate boundary:
 *
 * TrustProfileAggregate
 * ├── TrustProfileEntity
 * ├── TrustRatingEntity[]
 * ├── TrustReviewEntity[]
 * ├── TrustProfileBadgeEntity[]
 * └── TrustEventEntity[]
 *
 * TrustBadgeEntity is intentionally NOT owned by this repository.
 * It belongs to the TrustBadgeAggregate.
 */
export interface TrustProfileRepository {
  // ===========================================================================
  // Aggregate Persistence
  // ===========================================================================

  /**
   * Persist the complete Trust Profile aggregate.
   *
   * The implementation is responsible for persisting:
   * - TrustProfileEntity
   * - TrustRatingEntity[]
   * - TrustReviewEntity[]
   * - TrustProfileBadgeEntity[]
   * - TrustEventEntity[]
   */
  save(aggregate: TrustProfileAggregate): Promise<void>;

  /**
   * Find a Trust Profile aggregate by its internal domain identifier.
   */
  findById(id: TrustProfileId): Promise<TrustProfileAggregate | null>;

  /**
   * Find a Trust Profile aggregate by its public identifier.
   */
  findByPublicId(
    publicId: TrustProfileId,
  ): Promise<TrustProfileAggregate | null>;

  /**
   * Find a Trust Profile aggregate by the owning member.
   */
  findByMemberPublicId(
    memberPublicId: MemberPublicId,
  ): Promise<TrustProfileAggregate | null>;

  /**
   * Delete a Trust Profile aggregate.
   *
   * Deletion semantics are determined by the application/domain lifecycle.
   */
  delete(id: TrustProfileId): Promise<void>;

  /**
   * Determine whether a Trust Profile exists.
   */
  exists(id: TrustProfileId): Promise<boolean>;

  /**
   * Determine whether a Trust Profile exists by public identifier.
   */
  existsByPublicId(publicId: TrustProfileId): Promise<boolean>;

  /**
   * Determine whether a Trust Profile exists for a member.
   */
  existsByMemberPublicId(memberPublicId: MemberPublicId): Promise<boolean>;

  // ===========================================================================
  // Profile Queries
  // ===========================================================================

  /**
   * Find only the Trust Profile entity by internal identifier.
   */
  findProfileById(id: TrustProfileId): Promise<TrustProfileEntity | null>;

  /**
   * Find only the Trust Profile entity by public identifier.
   */
  findProfileByPublicId(
    publicId: TrustProfileId,
  ): Promise<TrustProfileEntity | null>;

  /**
   * Find only the Trust Profile entity by owning member.
   */
  findProfileByMemberPublicId(
    memberPublicId: MemberPublicId,
  ): Promise<TrustProfileEntity | null>;

  /**
   * Find profiles by status.
   */
  findProfilesByStatus(
    status: TrustProfileStatusValueObject,
  ): Promise<TrustProfileEntity[]>;

  /**
   * Find profiles by verification level.
   */
  findProfilesByVerificationLevel(
    verificationLevel: TrustVerificationLevelValueObject,
  ): Promise<TrustProfileEntity[]>;

  // ===========================================================================
  // Ratings
  // ===========================================================================

  /**
   * Find a rating belonging to a Trust Profile.
   */
  findRatingById(
    profileId: TrustProfileId,
    ratingId: TrustRatingId,
  ): Promise<TrustRatingEntity | null>;

  /**
   * Find all ratings belonging to a Trust Profile.
   */
  findRatings(profileId: TrustProfileId): Promise<TrustRatingEntity[]>;

  /**
   * Find ratings for a specific reviewee.
   */
  findRatingsForReviewee(
    profileId: TrustProfileId,
    revieweePublicId: MemberPublicId,
  ): Promise<TrustRatingEntity[]>;

  /**
   * Find ratings created by a reviewer.
   */
  findRatingsByReviewer(
    profileId: TrustProfileId,
    reviewerPublicId: MemberPublicId,
  ): Promise<TrustRatingEntity[]>;

  /**
   * Find ratings associated with a journey.
   */
  findRatingsForJourney(
    profileId: TrustProfileId,
    journeyPublicId: JourneyPublicId,
  ): Promise<TrustRatingEntity[]>;

  /**
   * Determine whether a rating exists inside the aggregate.
   */
  existsRating(
    profileId: TrustProfileId,
    ratingId: TrustRatingId,
  ): Promise<boolean>;

  /**
   * Determine whether a rating already exists for a journey/reviewer/reviewee
   * combination.
   *
   * This mirrors the domain persistence constraint:
   *
   * journeyPublicId + reviewerPublicId + revieweePublicId
   */
  existsRatingForJourney(
    journeyPublicId: JourneyPublicId,
    reviewerPublicId: MemberPublicId,
    revieweePublicId: MemberPublicId,
  ): Promise<boolean>;

  // ===========================================================================
  // Reviews
  // ===========================================================================

  /**
   * Find a review belonging to a Trust Profile.
   */
  findReviewById(
    profileId: TrustProfileId,
    reviewId: TrustReviewId,
  ): Promise<TrustReviewEntity | null>;

  /**
   * Find all reviews belonging to a Trust Profile.
   */
  findReviews(profileId: TrustProfileId): Promise<TrustReviewEntity[]>;

  /**
   * Find the review attached to a rating.
   */
  findReviewForRating(
    profileId: TrustProfileId,
    ratingId: TrustRatingId,
  ): Promise<TrustReviewEntity | null>;

  /**
   * Determine whether a review exists.
   */
  existsReview(
    profileId: TrustProfileId,
    reviewId: TrustReviewId,
  ): Promise<boolean>;

  // ===========================================================================
  // Profile Badges
  // ===========================================================================

  /**
   * Find an awarded badge belonging to a Trust Profile.
   */
  findProfileBadgeById(
    profileId: TrustProfileId,
    profileBadgeId: TrustProfileBadgeId,
  ): Promise<TrustProfileBadgeEntity | null>;

  /**
   * Find all badge awards belonging to a Trust Profile.
   */
  findProfileBadges(
    profileId: TrustProfileId,
  ): Promise<TrustProfileBadgeEntity[]>;

  /**
   * Find active badge awards belonging to a Trust Profile.
   */
  findActiveProfileBadges(
    profileId: TrustProfileId,
  ): Promise<TrustProfileBadgeEntity[]>;

  /**
   * Find a profile badge by the referenced Trust Badge.
   */
  findProfileBadgeByBadgeId(
    profileId: TrustProfileId,
    badgeId: BadgePublicId,
  ): Promise<TrustProfileBadgeEntity | null>;

  /**
   * Determine whether a profile has been awarded a badge.
   */
  existsProfileBadgeByBadgeId(
    profileId: TrustProfileId,
    badgeId: BadgePublicId,
  ): Promise<boolean>;

  /**
   * Determine whether an active badge award exists.
   */
  existsActiveProfileBadgeByBadgeId(
    profileId: TrustProfileId,
    badgeId: BadgePublicId,
  ): Promise<boolean>;

  // ===========================================================================
  // Trust Events
  // ===========================================================================

  /**
   * Find a Trust Event belonging to a Trust Profile.
   */
  findEventById(
    profileId: TrustProfileId,
    eventId: TrustEventId,
  ): Promise<TrustEventEntity | null>;

  /**
   * Find all Trust Events belonging to a Trust Profile.
   */
  findEvents(profileId: TrustProfileId): Promise<TrustEventEntity[]>;

  /**
   * Find Trust Events associated with a journey.
   */
  findEventsForJourney(
    profileId: TrustProfileId,
    journeyPublicId: JourneyPublicId,
  ): Promise<TrustEventEntity[]>;

  /**
   * Find Trust Events associated with a booking.
   */
  findEventsForBooking(
    profileId: TrustProfileId,
    bookingPublicId: BookingPublicId,
  ): Promise<TrustEventEntity[]>;

  /**
   * Find Trust Events associated with a rating.
   */
  findEventsForRating(
    profileId: TrustProfileId,
    ratingPublicId: RatingPublicId,
  ): Promise<TrustEventEntity[]>;

  /**
   * Find Trust Events associated with a badge.
   */
  findEventsForBadge(
    profileId: TrustProfileId,
    badgePublicId: BadgePublicId,
  ): Promise<TrustEventEntity[]>;

  /**
   * Find Trust Events associated with a dispute.
   */
  findEventsForDispute(
    profileId: TrustProfileId,
    disputePublicId: DisputePublicId,
  ): Promise<TrustEventEntity[]>;

  /**
   * Determine whether a Trust Event exists.
   */
  existsEvent(
    profileId: TrustProfileId,
    eventId: TrustEventId,
  ): Promise<boolean>;
}
