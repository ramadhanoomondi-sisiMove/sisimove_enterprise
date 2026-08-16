// src/domains/trust/domain/entities/trust-rating.entity.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';
import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { TrustRatingId } from '../value-objects/trust-rating-id.vo';
import type { ReviewerPublicId } from '../value-objects/reviewer-public-id.vo';
import type { RevieweePublicId } from '../value-objects/reviewee-public-id.vo';
import type { JourneyPublicId } from '../value-objects/journey-public-id.vo';
import type { BookingPublicId } from '../value-objects/booking-public-id.vo';
import type { RatingPublicId } from '../value-objects/rating-public-id.vo';

import type { TrustRatingRoleValueObject } from '../value-objects/trust-rating-role.vo';

import {
  TrustRatingStatus,
  TrustRatingStatusValueObject,
} from '../value-objects/trust-rating-status.vo';

import type { TrustRatingScore } from '../value-objects/trust-rating-score.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface TrustRatingProps {
  publicId: TrustRatingId;

  reviewerPublicId: ReviewerPublicId;
  revieweePublicId: RevieweePublicId;

  journeyPublicId: JourneyPublicId;
  bookingPublicId: BookingPublicId | undefined;

  role: TrustRatingRoleValueObject;
  score: TrustRatingScore;

  status: TrustRatingStatusValueObject;

  reviewPublicId: RatingPublicId | undefined;

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class TrustRatingEntity extends Entity<TrustRatingProps> {
  private constructor(props: TrustRatingProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: TrustRatingProps): TrustRatingEntity {
    return new TrustRatingEntity(props);
  }

  public static rehydrate(
    props: TrustRatingProps,
    id: UniqueEntityId,
  ): TrustRatingEntity {
    return new TrustRatingEntity(props, id);
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  override get publicId(): PublicEntityId {
    return this.props.publicId;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  get reviewerPublicId(): ReviewerPublicId {
    return this.props.reviewerPublicId;
  }

  get revieweePublicId(): RevieweePublicId {
    return this.props.revieweePublicId;
  }

  get journeyPublicId(): JourneyPublicId {
    return this.props.journeyPublicId;
  }

  get bookingPublicId(): BookingPublicId | undefined {
    return this.props.bookingPublicId;
  }

  get role(): TrustRatingRoleValueObject {
    return this.props.role;
  }

  get score(): TrustRatingScore {
    return this.props.score;
  }

  get status(): TrustRatingStatusValueObject {
    return this.props.status;
  }

  get reviewPublicId(): RatingPublicId | undefined {
    return this.props.reviewPublicId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Mutators
  // ---------------------------------------------------------------------------

  setScore(score: TrustRatingScore): void {
    this.props.score = score;
  }

  setRole(role: TrustRatingRoleValueObject): void {
    this.props.role = role;
  }

  setStatus(status: TrustRatingStatusValueObject): void {
    this.props.status = status;
  }

  setReviewPublicId(reviewPublicId: RatingPublicId | undefined): void {
    this.props.reviewPublicId = reviewPublicId;
  }

  setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  activate(): void {
    this.props.status = new TrustRatingStatusValueObject(
      TrustRatingStatus.ACTIVE,
    );
  }

  hide(): void {
    this.props.status = new TrustRatingStatusValueObject(
      TrustRatingStatus.HIDDEN,
    );
  }

  remove(): void {
    this.props.status = new TrustRatingStatusValueObject(
      TrustRatingStatus.REMOVED,
    );
  }

  restore(): void {
    this.props.status = new TrustRatingStatusValueObject(
      TrustRatingStatus.ACTIVE,
    );
  }

  // ---------------------------------------------------------------------------
  // Review
  // ---------------------------------------------------------------------------

  attachReview(reviewPublicId: RatingPublicId): void {
    this.props.reviewPublicId = reviewPublicId;
  }

  detachReview(): void {
    this.props.reviewPublicId = undefined;
  }

  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  isActive(): boolean {
    return this.props.status.isActive;
  }

  isHidden(): boolean {
    return this.props.status.isHidden;
  }

  isRemoved(): boolean {
    return this.props.status.isRemoved;
  }

  isProviderRating(): boolean {
    return this.props.role.isProvider;
  }

  isPassengerRating(): boolean {
    return this.props.role.isPassenger;
  }

  hasReview(): boolean {
    return this.props.reviewPublicId !== undefined;
  }

  hasBooking(): boolean {
    return this.props.bookingPublicId !== undefined;
  }

  isLowestScore(): boolean {
    return this.props.score.isLowest;
  }

  isHighestScore(): boolean {
    return this.props.score.isHighest;
  }

  belongsToReviewer(reviewerPublicId: ReviewerPublicId): boolean {
    return this.props.reviewerPublicId.equals(reviewerPublicId);
  }

  belongsToReviewee(revieweePublicId: RevieweePublicId): boolean {
    return this.props.revieweePublicId.equals(revieweePublicId);
  }

  belongsToJourney(journeyPublicId: JourneyPublicId): boolean {
    return this.props.journeyPublicId.equals(journeyPublicId);
  }

  belongsToBooking(bookingPublicId: BookingPublicId): boolean {
    return this.props.bookingPublicId?.equals(bookingPublicId) ?? false;
  }

  hasScore(score: TrustRatingScore): boolean {
    return this.props.score.equals(score);
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  override equals(other?: TrustRatingEntity): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { TrustRatingProps };
