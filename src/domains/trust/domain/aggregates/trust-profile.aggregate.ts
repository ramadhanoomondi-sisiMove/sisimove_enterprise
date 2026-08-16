// src/domains/trust/domain/aggregates/trust-profile.aggregate.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import type { TrustProfileEntity } from '../entities/trust-profile.entity';
import type { TrustRatingEntity } from '../entities/trust-rating.entity';
import type { TrustReviewEntity } from '../entities/trust-review.entity';
import type { TrustBadgeEntity } from '../entities/trust-badge.entity';
import type { TrustProfileBadgeEntity } from '../entities/trust-profile-badge.entity';
import type { TrustEventEntity } from '../entities/trust-event.entity';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import {
  TrustBadgeAwardedEvent,
  TrustBadgeRevokedEvent,
  TrustDisputeOpenedEvent,
  TrustDisputeResolvedEvent,
  TrustJourneyCancelledEvent,
  TrustJourneyCompletedEvent,
  TrustManualAdjustmentEvent,
  TrustProfileRestrictedEvent,
  TrustProfileRestoredEvent,
  TrustProfileStatusChangedEvent,
  TrustProfileSuspendedEvent,
  TrustRatingHiddenEvent,
  TrustRatingReceivedEvent,
  TrustRatingRemovedEvent,
  TrustRatingRestoredEvent,
  TrustReviewCreatedEvent,
  TrustReviewRemovedEvent,
  TrustReviewUpdatedEvent,
  TrustVerificationGrantedEvent,
  TrustVerificationRevokedEvent,
} from '../events';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { MemberPublicId } from '../value-objects/member-public-id.vo';
import type { TrustProfileId } from '../value-objects/trust-profile-id.vo';

import {
  TrustProfileStatus,
  TrustProfileStatusValueObject,
} from '../value-objects/trust-profile-status.vo';

import type { TrustVerificationLevelValueObject } from '../value-objects/trust-verification-level.vo';
import { TrustVerificationLevel } from '../value-objects/trust-verification-level.vo';

import type { TrustRatingId } from '../value-objects/trust-rating-id.vo';
import type { TrustReviewId } from '../value-objects/trust-review-id.vo';
import type { TrustBadgeId } from '../value-objects/trust-badge-id.vo';
import type { TrustProfileBadgeId } from '../value-objects/trust-profile-badge-id.vo';
import type { TrustEventId } from '../value-objects/trust-event-id.vo';

import type { ReviewerPublicId } from '../value-objects/reviewer-public-id.vo';
import type { RevieweePublicId } from '../value-objects/reviewee-public-id.vo';
import type { JourneyPublicId } from '../value-objects/journey-public-id.vo';
import type { BookingPublicId } from '../value-objects/booking-public-id.vo';
import type { RatingPublicId } from '../value-objects/rating-public-id.vo';
import type { BadgePublicId } from '../value-objects/badge-public-id.vo';
import type { DisputePublicId } from '../value-objects/dispute-public-id.vo';
import type { ActorPublicId } from '../value-objects/actor-public-id.vo';

import type { TrustRatingScore } from '../value-objects/trust-rating-score.vo';
import type { TrustReviewContent } from '../value-objects/trust-review-content.vo';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

export class TrustProfileAggregate extends AggregateRoot<TrustProfileEntity> {
  private readonly ratingEntities: TrustRatingEntity[] = [];

  private readonly reviewEntities: TrustReviewEntity[] = [];

  private readonly badgeEntities: TrustBadgeEntity[] = [];

  private readonly profileBadgeEntities: TrustProfileBadgeEntity[] = [];

  private readonly eventEntities: TrustEventEntity[] = [];

  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(profile: TrustProfileEntity, id?: UniqueEntityId) {
    super(profile, id);
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  public static create(profile: TrustProfileEntity): TrustProfileAggregate {
    return new TrustProfileAggregate(profile, profile.id);
  }

  public static rehydrate(
    profile: TrustProfileEntity,
    ratings: TrustRatingEntity[] = [],
    reviews: TrustReviewEntity[] = [],
    badges: TrustBadgeEntity[] = [],
    profileBadges: TrustProfileBadgeEntity[] = [],
    events: TrustEventEntity[] = [],
  ): TrustProfileAggregate {
    const aggregate = new TrustProfileAggregate(profile, profile.id);

    aggregate.ratingEntities.push(...ratings);
    aggregate.reviewEntities.push(...reviews);
    aggregate.badgeEntities.push(...badges);
    aggregate.profileBadgeEntities.push(...profileBadges);
    aggregate.eventEntities.push(...events);

    return aggregate;
  }

  // ===========================================================================
  // Aggregate Identity
  // ===========================================================================

  public get profile(): TrustProfileEntity {
    return this.props;
  }

  public get aggregateId(): UniqueEntityId {
    return this.id;
  }

  public get trustProfileId(): TrustProfileId {
    return this.profile.publicId;
  }

  // ===========================================================================
  // Child Entities
  // ===========================================================================

  public get ratings(): readonly TrustRatingEntity[] {
    return this.ratingEntities;
  }

  public get reviews(): readonly TrustReviewEntity[] {
    return this.reviewEntities;
  }

  public get badges(): readonly TrustBadgeEntity[] {
    return this.badgeEntities;
  }

  public get profileBadges(): readonly TrustProfileBadgeEntity[] {
    return this.profileBadgeEntities;
  }

  public get events(): readonly TrustEventEntity[] {
    return this.eventEntities;
  }

  // ===========================================================================
  // Profile Identity
  // ===========================================================================

  public get memberPublicId(): MemberPublicId {
    return this.profile.memberPublicId;
  }

  // ===========================================================================
  // Trust State
  // ===========================================================================

  public get status(): TrustProfileStatusValueObject {
    return this.profile.status;
  }

  public get verificationLevel(): TrustVerificationLevelValueObject {
    return this.profile.verificationLevel;
  }

  // ===========================================================================
  // Rating Statistics
  // ===========================================================================

  public get ratingAverage() {
    return this.profile.ratingAverage;
  }

  public get ratingCount() {
    return this.profile.ratingCount;
  }

  // ===========================================================================
  // Journey Statistics
  // ===========================================================================

  public get completedJourneys() {
    return this.profile.completedJourneys;
  }

  public get providerJourneys() {
    return this.profile.providerJourneys;
  }

  public get passengerJourneys() {
    return this.profile.passengerJourneys;
  }

  public get completedProviderJourneys() {
    return this.profile.completedProviderJourneys;
  }

  public get completedPassengerJourneys() {
    return this.profile.completedPassengerJourneys;
  }

  public get cancelledJourneys() {
    return this.profile.cancelledJourneys;
  }

  public get providerCancellations() {
    return this.profile.providerCancellations;
  }

  public get passengerCancellations() {
    return this.profile.passengerCancellations;
  }

  public get completionRate() {
    return this.profile.completionRate;
  }

  public get cancellationRate() {
    return this.profile.cancellationRate;
  }

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  public changeStatus(
    status: TrustProfileStatus,
    correlationId: string,
    causationId?: string,
  ): void {
    const previousStatus = this.profile.status.value;

    if (previousStatus === status) {
      return;
    }

    this.validateStatusTransition(previousStatus, status);

    this.profile.setStatus(new TrustProfileStatusValueObject(status));

    this.addDomainEvent(
      new TrustProfileStatusChangedEvent(
        this.id.toString(),
        this.profile.publicId.value,
        previousStatus,
        status,
        correlationId,
        causationId,
      ),
    );

    if (status === TrustProfileStatus.RESTRICTED) {
      this.addDomainEvent(
        new TrustProfileRestrictedEvent(
          this.id.toString(),
          this.profile.publicId.value,
          undefined,
          correlationId,
          causationId,
        ),
      );
    }

    if (status === TrustProfileStatus.SUSPENDED) {
      this.addDomainEvent(
        new TrustProfileSuspendedEvent(
          this.id.toString(),
          this.profile.publicId.value,
          undefined,
          correlationId,
          causationId,
        ),
      );
    }

    if (
      status === TrustProfileStatus.ACTIVE &&
      previousStatus !== TrustProfileStatus.ACTIVE
    ) {
      this.addDomainEvent(
        new TrustProfileRestoredEvent(
          this.id.toString(),
          this.profile.publicId.value,
          previousStatus,
          correlationId,
          causationId,
        ),
      );
    }
  }

  public activate(correlationId: string, causationId?: string): void {
    this.changeStatus(TrustProfileStatus.ACTIVE, correlationId, causationId);
  }

  public restrict(
    correlationId: string,
    causationId?: string,
    reason?: string,
  ): void {
    const previousStatus = this.profile.status.value;

    if (previousStatus === TrustProfileStatus.RESTRICTED) {
      return;
    }

    this.validateStatusTransition(
      previousStatus,
      TrustProfileStatus.RESTRICTED,
    );

    this.profile.restrict();

    this.addDomainEvent(
      new TrustProfileStatusChangedEvent(
        this.id.toString(),
        this.profile.publicId.value,
        previousStatus,
        TrustProfileStatus.RESTRICTED,
        correlationId,
        causationId,
      ),
    );

    this.addDomainEvent(
      new TrustProfileRestrictedEvent(
        this.id.toString(),
        this.profile.publicId.value,
        reason,
        correlationId,
        causationId,
      ),
    );
  }

  public suspend(
    correlationId: string,
    causationId?: string,
    reason?: string,
  ): void {
    const previousStatus = this.profile.status.value;

    if (previousStatus === TrustProfileStatus.SUSPENDED) {
      return;
    }

    this.validateStatusTransition(previousStatus, TrustProfileStatus.SUSPENDED);

    this.profile.suspend();

    this.addDomainEvent(
      new TrustProfileStatusChangedEvent(
        this.id.toString(),
        this.profile.publicId.value,
        previousStatus,
        TrustProfileStatus.SUSPENDED,
        correlationId,
        causationId,
      ),
    );

    this.addDomainEvent(
      new TrustProfileSuspendedEvent(
        this.id.toString(),
        this.profile.publicId.value,
        reason,
        correlationId,
        causationId,
      ),
    );
  }

  public restore(correlationId: string, causationId?: string): void {
    const previousStatus = this.profile.status.value;

    if (previousStatus === TrustProfileStatus.ACTIVE) {
      return;
    }

    this.validateStatusTransition(previousStatus, TrustProfileStatus.ACTIVE);

    this.profile.activate();

    this.addDomainEvent(
      new TrustProfileStatusChangedEvent(
        this.id.toString(),
        this.profile.publicId.value,
        previousStatus,
        TrustProfileStatus.ACTIVE,
        correlationId,
        causationId,
      ),
    );

    this.addDomainEvent(
      new TrustProfileRestoredEvent(
        this.id.toString(),
        this.profile.publicId.value,
        previousStatus,
        correlationId,
        causationId,
      ),
    );
  }

  private validateStatusTransition(
    from: TrustProfileStatus,
    to: TrustProfileStatus,
  ): void {
    switch (from) {
      case TrustProfileStatus.ACTIVE:
        if (
          to !== TrustProfileStatus.RESTRICTED &&
          to !== TrustProfileStatus.SUSPENDED
        ) {
          throw new Error(
            `Invalid TrustProfile status transition: ${String(from)} -> ${String(to)}`,
          );
        }
        return;

      case TrustProfileStatus.RESTRICTED:
        if (
          to !== TrustProfileStatus.ACTIVE &&
          to !== TrustProfileStatus.SUSPENDED
        ) {
          throw new Error(
            `Invalid TrustProfile status transition: ${String(from)} -> ${String(to)}`,
          );
        }
        return;

      case TrustProfileStatus.SUSPENDED:
        if (to !== TrustProfileStatus.ACTIVE) {
          throw new Error(
            `Invalid TrustProfile status transition: ${String(from)} -> ${String(to)}`,
          );
        }
        return;

      default:
        throw new Error(
          `Invalid TrustProfile status transition: ${String(from)} -> ${String(to)}`,
        );
    }
  }
  // ===========================================================================
  // Verification
  // ===========================================================================

  public grantVerification(
    verificationLevel: TrustVerificationLevel,
    correlationId: string,
    causationId?: string,
  ): void {
    const previousLevel = this.profile.verificationLevel.value;

    if (previousLevel === verificationLevel) {
      return;
    }

    this.profile.setVerification(verificationLevel);

    this.addDomainEvent(
      new TrustVerificationGrantedEvent(
        this.id.toString(),
        this.profile.publicId.value,
        previousLevel,
        verificationLevel,
        correlationId,
        causationId,
      ),
    );
  }

  public revokeVerification(correlationId: string, causationId?: string): void {
    const previousLevel = this.profile.verificationLevel.value;

    if (previousLevel === TrustVerificationLevel.NONE) {
      return;
    }

    this.profile.clearVerification();

    this.addDomainEvent(
      new TrustVerificationRevokedEvent(
        this.id.toString(),
        this.profile.publicId.value,
        previousLevel,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Ratings
  // ===========================================================================

  public receiveRating(
    rating: TrustRatingEntity,
    correlationId: string,
    causationId?: string,
  ): void {
    const existing = this.getRatingByPublicId(rating.publicId.value);

    if (existing !== undefined) {
      return;
    }

    this.ratingEntities.push(rating);

    this.recalculateRatingStatistics();

    this.addDomainEvent(
      new TrustRatingReceivedEvent(
        this.id.toString(),
        this.profile.publicId.value,
        rating.publicId.value,
        rating.reviewerPublicId.value,
        rating.revieweePublicId.value,
        rating.journeyPublicId.value,
        rating.score.value,
        rating.role.value,
        correlationId,
        causationId,
      ),
    );
  }

  public hideRating(
    ratingId: TrustRatingId,
    correlationId: string,
    causationId?: string,
    reason?: string,
  ): void {
    const rating = this.requireRating(ratingId);

    if (rating.isHidden()) {
      return;
    }

    rating.hide();

    this.recalculateRatingStatistics();

    this.addDomainEvent(
      new TrustRatingHiddenEvent(
        this.id.toString(),
        this.profile.publicId.value,
        rating.publicId.value,
        rating.revieweePublicId.value,
        reason,
        correlationId,
        causationId,
      ),
    );
  }

  public removeRating(
    ratingId: TrustRatingId,
    correlationId: string,
    causationId?: string,
    reason?: string,
  ): void {
    const rating = this.requireRating(ratingId);

    if (rating.isRemoved()) {
      return;
    }

    rating.remove();

    this.recalculateRatingStatistics();

    this.addDomainEvent(
      new TrustRatingRemovedEvent(
        this.id.toString(),
        this.profile.publicId.value,
        rating.publicId.value,
        rating.revieweePublicId.value,
        reason,
        correlationId,
        causationId,
      ),
    );
  }

  public restoreRating(
    ratingId: TrustRatingId,
    correlationId: string,
    causationId?: string,
  ): void {
    const rating = this.requireRating(ratingId);

    if (rating.isActive()) {
      return;
    }

    rating.restore();

    this.recalculateRatingStatistics();

    this.addDomainEvent(
      new TrustRatingRestoredEvent(
        this.id.toString(),
        this.profile.publicId.value,
        rating.publicId.value,
        rating.revieweePublicId.value,
        correlationId,
        causationId,
      ),
    );
  }

  public changeRatingScore(
    ratingId: TrustRatingId,
    score: TrustRatingScore,
    correlationId: string,
    causationId?: string,
  ): void {
    const rating = this.requireRating(ratingId);

    if (rating.hasScore(score)) {
      return;
    }

    rating.setScore(score);

    this.recalculateRatingStatistics();

    // No domain event currently exists for a rating score change.
    // correlationId and causationId are intentionally accepted for
    // command/event consistency but are not used until such an event
    // is introduced.
    void correlationId;
    void causationId;
  }

  // ===========================================================================
  // Rating Queries
  // ===========================================================================

  public getRatingById(ratingId: TrustRatingId): TrustRatingEntity | undefined {
    return this.ratingEntities.find((rating) =>
      rating.publicId.equals(ratingId),
    );
  }

  public getRatingByPublicId(publicId: string): TrustRatingEntity | undefined {
    return this.ratingEntities.find(
      (rating) => rating.publicId.value === publicId,
    );
  }

  public getRatingsForReviewee(
    revieweePublicId: RevieweePublicId,
  ): readonly TrustRatingEntity[] {
    return this.ratingEntities.filter((rating) =>
      rating.belongsToReviewee(revieweePublicId),
    );
  }

  public getRatingsByReviewer(
    reviewerPublicId: ReviewerPublicId,
  ): readonly TrustRatingEntity[] {
    return this.ratingEntities.filter((rating) =>
      rating.belongsToReviewer(reviewerPublicId),
    );
  }

  public getRatingsForJourney(
    journeyPublicId: JourneyPublicId,
  ): readonly TrustRatingEntity[] {
    return this.ratingEntities.filter((rating) =>
      rating.belongsToJourney(journeyPublicId),
    );
  }

  public hasRating(ratingId: TrustRatingId): boolean {
    return this.getRatingById(ratingId) !== undefined;
  }

  public ratingCountInAggregate(): number {
    return this.ratingEntities.length;
  }

  private requireRating(ratingId: TrustRatingId): TrustRatingEntity {
    const rating = this.getRatingById(ratingId);

    if (rating === undefined) {
      throw new Error(`TrustRating not found: ${ratingId.value}`);
    }

    return rating;
  }

  private recalculateRatingStatistics(): void {
    const activeRatings = this.ratingEntities.filter((rating) =>
      rating.isActive(),
    );

    const count = activeRatings.length;

    if (count === 0) {
      return;
    }

    const total = activeRatings.reduce(
      (sum, rating) => sum + rating.score.value,
      0,
    );

    const average = total / count;

    this.profile.setRatingStatistics(
      new (
        this.profile.ratingAverage.constructor as new (
          value: number,
        ) => typeof this.profile.ratingAverage
      )(average),
      new (
        this.profile.ratingCount.constructor as new (
          value: number,
        ) => typeof this.profile.ratingCount
      )(count),
    );
  }

  // ===========================================================================
  // Reviews
  // ===========================================================================

  public createReview(
    review: TrustReviewEntity,
    correlationId: string,
    causationId?: string,
  ): void {
    const existing = this.getReviewByPublicId(review.publicId.value);

    if (existing !== undefined) {
      return;
    }

    const rating = this.getRatingById(review.ratingId);

    if (rating === undefined) {
      throw new Error(
        `TrustRating not found for review: ${review.ratingId.value}`,
      );
    }

    this.reviewEntities.push(review);

    rating.attachReview(review.publicId);

    this.addDomainEvent(
      new TrustReviewCreatedEvent(
        this.id.toString(),
        this.profile.publicId.value,
        review.publicId.value,
        review.ratingId.value,
        review.content.value,
        correlationId,
        causationId,
      ),
    );
  }

  public updateReview(
    reviewId: TrustReviewId,
    content: TrustReviewContent,
    correlationId: string,
    causationId?: string,
  ): void {
    const review = this.requireReview(reviewId);

    if (review.hasContentValue(content)) {
      return;
    }

    review.setContent(content);

    this.addDomainEvent(
      new TrustReviewUpdatedEvent(
        this.id.toString(),
        this.profile.publicId.value,
        review.publicId.value,
        review.ratingId.value,
        content.value,
        correlationId,
        causationId,
      ),
    );
  }

  public removeReview(
    reviewId: TrustReviewId,
    correlationId: string,
    causationId?: string,
    reason?: string,
  ): void {
    const review = this.requireReview(reviewId);

    const rating = this.getRatingById(review.ratingId);

    if (rating !== undefined) {
      rating.detachReview();
    }

    const index = this.reviewEntities.findIndex((entity) =>
      entity.publicId.equals(reviewId),
    );

    if (index !== -1) {
      this.reviewEntities.splice(index, 1);
    }

    this.addDomainEvent(
      new TrustReviewRemovedEvent(
        this.id.toString(),
        this.profile.publicId.value,
        review.publicId.value,
        review.ratingId.value,
        reason,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Review Queries
  // ===========================================================================

  public getReviewById(reviewId: TrustReviewId): TrustReviewEntity | undefined {
    return this.reviewEntities.find((review) =>
      review.publicId.equals(reviewId),
    );
  }

  public getReviewByPublicId(publicId: string): TrustReviewEntity | undefined {
    return this.reviewEntities.find(
      (review) => review.publicId.value === publicId,
    );
  }

  public getReviewForRating(
    ratingId: TrustRatingId,
  ): TrustReviewEntity | undefined {
    return this.reviewEntities.find((review) =>
      review.belongsToRating(ratingId),
    );
  }

  public hasReview(reviewId: TrustReviewId): boolean {
    return this.getReviewById(reviewId) !== undefined;
  }

  private requireReview(reviewId: TrustReviewId): TrustReviewEntity {
    const review = this.getReviewById(reviewId);

    if (review === undefined) {
      throw new Error(`TrustReview not found: ${reviewId.value}`);
    }

    return review;
  }

  // ===========================================================================
  // Badges
  // ===========================================================================

  public awardBadge(
    badge: TrustBadgeEntity,
    profileBadge: TrustProfileBadgeEntity,
    correlationId: string,
    causationId?: string,
  ): void {
    const existing = this.getProfileBadgeByBadgeId(badge.publicId);

    if (existing !== undefined) {
      if (existing.isActive()) {
        return;
      }

      existing.restore();

      this.addDomainEvent(
        new TrustBadgeAwardedEvent(
          this.id.toString(),
          this.profile.publicId.value,
          existing.publicId.value,
          badge.publicId.value,
          badge.type.value,
          existing.awardedAt,
          correlationId,
          causationId,
        ),
      );

      return;
    }

    if (!profileBadge.belongsToProfile(this.trustProfileId)) {
      throw new Error(
        'TrustProfileBadge does not belong to this TrustProfile.',
      );
    }

    if (!profileBadge.representsBadge(badge.publicId)) {
      throw new Error(
        'TrustProfileBadge does not represent the supplied TrustBadge.',
      );
    }

    this.badgeEntities.push(badge);
    this.profileBadgeEntities.push(profileBadge);

    this.addDomainEvent(
      new TrustBadgeAwardedEvent(
        this.id.toString(),
        this.profile.publicId.value,
        profileBadge.publicId.value,
        badge.publicId.value,
        badge.type.value,
        profileBadge.awardedAt,
        correlationId,
        causationId,
      ),
    );
  }

  public revokeBadge(
    profileBadgeId: TrustProfileBadgeId,
    correlationId: string,
    causationId?: string,
    reason?: string,
  ): void {
    const profileBadge = this.requireProfileBadge(profileBadgeId);

    if (!profileBadge.isActive()) {
      return;
    }

    profileBadge.revoke();

    this.addDomainEvent(
      new TrustBadgeRevokedEvent(
        this.id.toString(),
        this.profile.publicId.value,
        profileBadge.publicId.value,
        profileBadge.badgeId.value,
        reason,
        profileBadge.revokedAt ?? new Date(),
        correlationId,
        causationId,
      ),
    );
  }

  public restoreBadge(
    profileBadgeId: TrustProfileBadgeId,
    correlationId: string,
    causationId?: string,
  ): void {
    const profileBadge = this.requireProfileBadge(profileBadgeId);

    if (profileBadge.isActive()) {
      return;
    }

    const badge = this.getBadgeById(profileBadge.badgeId);

    if (badge === undefined) {
      throw new Error(`TrustBadge not found: ${profileBadge.badgeId.value}`);
    }

    profileBadge.restore();

    this.addDomainEvent(
      new TrustBadgeAwardedEvent(
        this.id.toString(),
        this.profile.publicId.value,
        profileBadge.publicId.value,
        badge.publicId.value,
        badge.type.value,
        profileBadge.awardedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Badge Queries
  // ===========================================================================

  public getBadgeById(badgeId: TrustBadgeId): TrustBadgeEntity | undefined {
    return this.badgeEntities.find((badge) => badge.publicId.equals(badgeId));
  }

  public getBadgeByPublicId(publicId: string): TrustBadgeEntity | undefined {
    return this.badgeEntities.find(
      (badge) => badge.publicId.value === publicId,
    );
  }

  public getProfileBadgeById(
    profileBadgeId: TrustProfileBadgeId,
  ): TrustProfileBadgeEntity | undefined {
    return this.profileBadgeEntities.find((profileBadge) =>
      profileBadge.publicId.equals(profileBadgeId),
    );
  }

  public getProfileBadgeByPublicId(
    publicId: string,
  ): TrustProfileBadgeEntity | undefined {
    return this.profileBadgeEntities.find(
      (profileBadge) => profileBadge.publicId.value === publicId,
    );
  }

  public getProfileBadgeByBadgeId(
    badgeId: TrustBadgeId,
  ): TrustProfileBadgeEntity | undefined {
    return this.profileBadgeEntities.find((profileBadge) =>
      profileBadge.badgeId.equals(badgeId),
    );
  }

  public getActiveProfileBadges(): readonly TrustProfileBadgeEntity[] {
    return this.profileBadgeEntities.filter((profileBadge) =>
      profileBadge.isActive(),
    );
  }

  public hasBadge(badgeId: TrustBadgeId): boolean {
    return this.getProfileBadgeByBadgeId(badgeId)?.isActive() ?? false;
  }

  public hasBadges(): boolean {
    return this.getActiveProfileBadges().length > 0;
  }

  private requireProfileBadge(
    profileBadgeId: TrustProfileBadgeId,
  ): TrustProfileBadgeEntity {
    const profileBadge = this.getProfileBadgeById(profileBadgeId);

    if (profileBadge === undefined) {
      throw new Error(`TrustProfileBadge not found: ${profileBadgeId.value}`);
    }

    return profileBadge;
  }

  // ===========================================================================
  // Journey Projection
  // ===========================================================================

  public applyJourneyCompleted(
    journeyPublicId: JourneyPublicId,
    role: string,
    correlationId: string,
    causationId?: string,
    bookingPublicId?: BookingPublicId,
  ): void {
    this.profile.incrementCompletedJourneys();

    if (role === 'PROVIDER') {
      this.profile.incrementCompletedProviderJourneys();
    }

    if (role === 'PASSENGER') {
      this.profile.incrementCompletedPassengerJourneys();
    }

    this.addDomainEvent(
      new TrustJourneyCompletedEvent(
        this.id.toString(),
        this.profile.publicId.value,
        journeyPublicId.value,
        bookingPublicId?.value,
        role,
        correlationId,
        causationId,
      ),
    );
  }

  public applyJourneyCancelled(
    journeyPublicId: JourneyPublicId,
    role: string,
    correlationId: string,
    causationId?: string,
    bookingPublicId?: BookingPublicId,
    reason?: string,
  ): void {
    this.profile.incrementCancelledJourneys();

    if (role === 'PROVIDER') {
      this.profile.incrementProviderCancellations();
    }

    if (role === 'PASSENGER') {
      this.profile.incrementPassengerCancellations();
    }

    this.addDomainEvent(
      new TrustJourneyCancelledEvent(
        this.id.toString(),
        this.profile.publicId.value,
        journeyPublicId.value,
        bookingPublicId?.value,
        role,
        reason,
        correlationId,
        causationId,
      ),
    );
  }

  public applyProviderJourney(): void {
    this.profile.incrementProviderJourneys();
  }

  public applyPassengerJourney(): void {
    this.profile.incrementPassengerJourneys();
  }

  // ===========================================================================
  // Disputes
  // ===========================================================================

  public applyDisputeOpened(
    disputePublicId: DisputePublicId,
    correlationId: string,
    causationId?: string,
    journeyPublicId?: JourneyPublicId,
    bookingPublicId?: BookingPublicId,
    actorPublicId?: ActorPublicId,
    reason?: string,
  ): void {
    this.addDomainEvent(
      new TrustDisputeOpenedEvent(
        this.id.toString(),
        this.profile.publicId.value,
        disputePublicId.value,
        journeyPublicId?.value,
        bookingPublicId?.value,
        actorPublicId?.value,
        reason,
        correlationId,
        causationId,
      ),
    );
  }

  public applyDisputeResolved(
    disputePublicId: DisputePublicId,
    correlationId: string,
    causationId?: string,
    journeyPublicId?: JourneyPublicId,
    bookingPublicId?: BookingPublicId,
    actorPublicId?: ActorPublicId,
    resolution?: string,
  ): void {
    this.addDomainEvent(
      new TrustDisputeResolvedEvent(
        this.id.toString(),
        this.profile.publicId.value,
        disputePublicId.value,
        journeyPublicId?.value,
        bookingPublicId?.value,
        actorPublicId?.value,
        resolution,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Manual Adjustment
  // ===========================================================================

  public applyManualAdjustment(
    actorPublicId: ActorPublicId,
    reason: string,
    adjustment: string,
    metadata: Record<string, unknown> | undefined,
    correlationId: string,
    causationId?: string,
  ): void {
    this.addDomainEvent(
      new TrustManualAdjustmentEvent(
        this.id.toString(),
        this.profile.publicId.value,
        actorPublicId.value,
        reason,
        adjustment,
        metadata,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Trust Event History
  // ===========================================================================

  public attachEvent(event: TrustEventEntity): void {
    if (!event.belongsToProfile(this.trustProfileId)) {
      throw new Error('TrustEvent does not belong to this TrustProfile.');
    }

    const existing = this.eventEntities.find((existingEvent) =>
      existingEvent.publicId.equals(event.publicId),
    );

    if (existing !== undefined) {
      return;
    }

    this.eventEntities.push(event);
  }

  public getEventById(eventId: TrustEventId): TrustEventEntity | undefined {
    return this.eventEntities.find((event) => event.publicId.equals(eventId));
  }

  public getEventByPublicId(publicId: string): TrustEventEntity | undefined {
    return this.eventEntities.find(
      (event) => event.publicId.value === publicId,
    );
  }

  public getEventsForJourney(
    journeyPublicId: JourneyPublicId,
  ): readonly TrustEventEntity[] {
    return this.eventEntities.filter((event) =>
      event.belongsToJourney(journeyPublicId),
    );
  }

  public getEventsForBooking(
    bookingPublicId: BookingPublicId,
  ): readonly TrustEventEntity[] {
    return this.eventEntities.filter((event) =>
      event.belongsToBooking(bookingPublicId),
    );
  }

  public getEventsForRating(
    ratingPublicId: RatingPublicId,
  ): readonly TrustEventEntity[] {
    return this.eventEntities.filter((event) =>
      event.referencesRating(ratingPublicId),
    );
  }

  public getEventsForBadge(
    badgePublicId: BadgePublicId,
  ): readonly TrustEventEntity[] {
    return this.eventEntities.filter((event) =>
      event.referencesBadge(badgePublicId),
    );
  }

  public getEventsForDispute(
    disputePublicId: DisputePublicId,
  ): readonly TrustEventEntity[] {
    return this.eventEntities.filter((event) =>
      event.referencesDispute(disputePublicId),
    );
  }

  // ===========================================================================
  // Aggregate Queries
  // ===========================================================================

  public isActive(): boolean {
    return this.profile.isActive();
  }

  public isRestricted(): boolean {
    return this.profile.isRestricted();
  }

  public isSuspended(): boolean {
    return this.profile.isSuspended();
  }

  public isVerified(): boolean {
    return this.profile.isVerified();
  }

  public isHighlyVerified(): boolean {
    return this.profile.isHighlyVerified();
  }

  public hasVerification(): boolean {
    return this.profile.hasVerification();
  }

  public hasRatings(): boolean {
    return this.profile.hasRatings();
  }

  public hasCompletedJourneys(): boolean {
    return this.profile.hasCompletedJourneys();
  }

  public hasProviderJourneys(): boolean {
    return this.profile.hasProviderJourneys();
  }

  public hasPassengerJourneys(): boolean {
    return this.profile.hasPassengerJourneys();
  }

  public hasProviderCancellations(): boolean {
    return this.profile.hasProviderCancellations();
  }

  public hasPassengerCancellations(): boolean {
    return this.profile.hasPassengerCancellations();
  }

  public hasCancellations(): boolean {
    return this.profile.hasCancellations();
  }

  public hasPerfectRating(): boolean {
    return this.profile.hasPerfectRating();
  }

  public hasPerfectCompletionRate(): boolean {
    return this.profile.hasPerfectCompletionRate();
  }

  public belongsToMember(memberPublicId: MemberPublicId): boolean {
    return this.profile.belongsToMember(memberPublicId);
  }

  // ===========================================================================
  // Event Recording
  // ===========================================================================

  public recordDomainEvent(event: TrustEventEntity): void {
    this.attachEvent(event);
  }
}
