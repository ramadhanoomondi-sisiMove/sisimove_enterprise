// src/domains/trust/presentation/rest/mappers/trust-profile-response.mapper.ts

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import type { TrustProfileAggregate } from '../../../domain/aggregates/trust-profile.aggregate';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import type { TrustProfileEntity } from '../../../domain/entities/trust-profile.entity';
import type { TrustRatingEntity } from '../../../domain/entities/trust-rating.entity';
import type { TrustReviewEntity } from '../../../domain/entities/trust-review.entity';
import type { TrustProfileBadgeEntity } from '../../../domain/entities/trust-profile-badge.entity';
import type { TrustBadgeEntity } from '../../../domain/entities/trust-badge.entity';
import type { TrustEventEntity } from '../../../domain/entities/trust-event.entity';

// -----------------------------------------------------------------------------
// Response Types
// -----------------------------------------------------------------------------

export interface TrustProfileResponse {
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

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Trust Badge Definition Response
// -----------------------------------------------------------------------------

export interface TrustBadgeResponse {
  id: string;
  publicId: string;

  type: string;

  name: string;
  description: string | null;

  assetPublicId: string | null;

  active: boolean;

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Trust Profile Badge Response
// -----------------------------------------------------------------------------

export interface TrustProfileBadgeResponse {
  id: string;
  publicId: string;

  profileId: string;
  badgeId: string;

  awardedAt: Date;
  revokedAt: Date | null;

  active: boolean;

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Trust Rating Response
// -----------------------------------------------------------------------------

export interface TrustRatingResponse {
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

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Trust Review Response
// -----------------------------------------------------------------------------

export interface TrustReviewResponse {
  id: string;
  publicId: string;

  ratingId: string;

  content: string;

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Trust Event Response
// -----------------------------------------------------------------------------

export interface TrustEventResponse {
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

  createdAt: Date;
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export class TrustProfileResponseMapper {
  // ===========================================================================
  // Aggregate
  // ===========================================================================

  static fromAggregate(aggregate: TrustProfileAggregate): TrustProfileResponse {
    return {
      ...this.fromEntity(aggregate.profile),

      ratings: aggregate.ratings.map((rating) => this.fromRatingEntity(rating)),

      reviews: aggregate.reviews.map((review) => this.fromReviewEntity(review)),

      badges: aggregate.badges.map((badge) => this.fromBadgeEntity(badge)),

      profileBadges: aggregate.profileBadges.map((profileBadge) =>
        this.fromProfileBadgeEntity(profileBadge),
      ),

      events: aggregate.events.map((event) => this.fromEventEntity(event)),
    };
  }

  // ===========================================================================
  // Profile
  // ===========================================================================

  static fromEntity(
    entity: TrustProfileEntity,
  ): Omit<
    TrustProfileResponse,
    'ratings' | 'reviews' | 'badges' | 'profileBadges' | 'events'
  > {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      memberPublicId: entity.memberPublicId.value,

      status: entity.status.value,

      verificationLevel: entity.verificationLevel.value,

      ratingAverage: entity.ratingAverage.value,

      ratingCount: entity.ratingCount.value,

      completedJourneys: entity.completedJourneys.value,

      providerJourneys: entity.providerJourneys.value,

      passengerJourneys: entity.passengerJourneys.value,

      completedProviderJourneys: entity.completedProviderJourneys.value,

      completedPassengerJourneys: entity.completedPassengerJourneys.value,

      cancelledJourneys: entity.cancelledJourneys.value,

      providerCancellations: entity.providerCancellations.value,

      passengerCancellations: entity.passengerCancellations.value,

      completionRate: entity.completionRate.value,

      cancellationRate: entity.cancellationRate.value,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Trust Badge
  // ===========================================================================

  static fromBadgeEntity(entity: TrustBadgeEntity): TrustBadgeResponse {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      type: entity.type.value,

      name: entity.name.value,

      description: entity.description?.value ?? null,

      assetPublicId: entity.assetPublicId?.value ?? null,

      active: entity.active,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Trust Profile Badge
  // ===========================================================================

  static fromProfileBadgeEntity(
    entity: TrustProfileBadgeEntity,
  ): TrustProfileBadgeResponse {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      profileId: entity.profileId.value,

      badgeId: entity.badgeId.value,

      awardedAt: entity.awardedAt,

      revokedAt: entity.revokedAt ?? null,

      active: entity.active,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Rating
  // ===========================================================================

  static fromRatingEntity(entity: TrustRatingEntity): TrustRatingResponse {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      reviewerPublicId: entity.reviewerPublicId.value,

      revieweePublicId: entity.revieweePublicId.value,

      journeyPublicId: entity.journeyPublicId.value,

      bookingPublicId: entity.bookingPublicId?.value ?? null,

      role: entity.role.value,

      score: entity.score.value,

      status: entity.status.value,

      reviewPublicId: entity.reviewPublicId?.value ?? null,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Review
  // ===========================================================================

  static fromReviewEntity(entity: TrustReviewEntity): TrustReviewResponse {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      ratingId: entity.ratingId.value,

      content: entity.content.value,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Event
  // ===========================================================================

  static fromEventEntity(entity: TrustEventEntity): TrustEventResponse {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      profileId: entity.profileId.value,

      type: entity.type.value,

      journeyPublicId: entity.journeyPublicId?.value ?? null,

      bookingPublicId: entity.bookingPublicId?.value ?? null,

      ratingPublicId: entity.ratingPublicId?.value ?? null,

      badgePublicId: entity.badgePublicId?.value ?? null,

      disputePublicId: entity.disputePublicId?.value ?? null,

      actorPublicId: entity.actorPublicId?.value ?? null,

      reason: entity.reason?.value ?? null,

      metadata: entity.metadata?.value ?? null,

      createdAt: entity.createdAt,
    };
  }

  // ===========================================================================
  // Individual Responses
  // ===========================================================================

  static fromBadge(entity: TrustBadgeEntity): TrustBadgeResponse {
    return this.fromBadgeEntity(entity);
  }

  static fromBadges(entities: TrustBadgeEntity[]): TrustBadgeResponse[] {
    return entities.map((entity) => this.fromBadgeEntity(entity));
  }

  static fromProfileBadge(
    entity: TrustProfileBadgeEntity,
  ): TrustProfileBadgeResponse {
    return this.fromProfileBadgeEntity(entity);
  }

  static fromProfileBadges(
    entities: TrustProfileBadgeEntity[],
  ): TrustProfileBadgeResponse[] {
    return entities.map((entity) => this.fromProfileBadgeEntity(entity));
  }

  static fromRating(entity: TrustRatingEntity): TrustRatingResponse {
    return this.fromRatingEntity(entity);
  }

  static fromRatings(entities: TrustRatingEntity[]): TrustRatingResponse[] {
    return entities.map((entity) => this.fromRatingEntity(entity));
  }

  static fromReview(entity: TrustReviewEntity): TrustReviewResponse {
    return this.fromReviewEntity(entity);
  }

  static fromReviews(entities: TrustReviewEntity[]): TrustReviewResponse[] {
    return entities.map((entity) => this.fromReviewEntity(entity));
  }

  static fromEvent(entity: TrustEventEntity): TrustEventResponse {
    return this.fromEventEntity(entity);
  }

  static fromEvents(entities: TrustEventEntity[]): TrustEventResponse[] {
    return entities.map((entity) => this.fromEventEntity(entity));
  }
}
