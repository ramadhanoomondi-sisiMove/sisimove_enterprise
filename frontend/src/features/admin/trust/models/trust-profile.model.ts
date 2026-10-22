/**
 * sisiMove — Admin Trust Profile Model
 *
 * Represents full and summary Trust profiles in the admin frontend.
 *
 * Responsibilities:
 * - Define full and summary Trust profile models.
 * - Preserve profile metrics and lifecycle information.
 * - Represent related ratings, reviews, badges, badge assignments, and events.
 * - Map full and summary API responses into frontend models.
 *
 * Non-responsibilities:
 * - Performing HTTP requests.
 * - Managing Trust profile mutations or permissions.
 * - Defining backend domain rules.
 * - Introducing UI-specific presentation state.
 */

import type {
  TrustBadgeApiResponse,
  TrustEventApiResponse,
  TrustProfileApiResponse,
  TrustProfileSummaryApiResponse,
  TrustProfileBadgeApiResponse,
  TrustRatingApiResponse,
  TrustReviewApiResponse,
} from '../types/trust.types';

import type { TrustBadgeModel } from './trust-badge.model';

import { TrustBadgeModelMapper } from './trust-badge.model';

// -----------------------------------------------------------------------------
// Related Models
// -----------------------------------------------------------------------------

/**
 * Frontend representation of a Trust rating.
 */
export interface TrustRatingModel {
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

/**
 * Frontend representation of written feedback for a rating.
 */
export interface TrustReviewModel {
  id: string;
  publicId: string;

  ratingId: string;

  content: string;

  createdAt: string;
  updatedAt: string;
}

/**
 * Frontend representation of a badge awarded to a Trust profile.
 */
export interface TrustProfileBadgeModel {
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

/**
 * Frontend representation of a Trust profile event.
 */
export interface TrustEventModel {
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
// Trust Profile Models
// -----------------------------------------------------------------------------

/**
 * Full operational Trust profile used by the admin frontend.
 *
 * Corresponds to TrustProfileApiResponse, including related collections.
 * This is not the reduced public marketplace projection.
 */
export interface TrustProfileModel {
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

  ratings: TrustRatingModel[];
  reviews: TrustReviewModel[];
  badges: TrustBadgeModel[];
  profileBadges: TrustProfileBadgeModel[];
  events: TrustEventModel[];

  createdAt: string;
  updatedAt: string;
}

/**
 * Summary representation of a Trust profile for paginated admin lists.
 *
 * The collection endpoint omits related collections. Use
 * TrustProfileModel for full profile detail responses.
 */
export type TrustProfileSummaryModel = Pick<
  TrustProfileModel,
  | 'id'
  | 'publicId'
  | 'memberPublicId'
  | 'status'
  | 'verificationLevel'
  | 'ratingAverage'
  | 'ratingCount'
  | 'completedJourneys'
  | 'providerJourneys'
  | 'passengerJourneys'
  | 'completedProviderJourneys'
  | 'completedPassengerJourneys'
  | 'cancelledJourneys'
  | 'providerCancellations'
  | 'passengerCancellations'
  | 'completionRate'
  | 'cancellationRate'
  | 'createdAt'
  | 'updatedAt'
>;

// -----------------------------------------------------------------------------
// Related Model Mappers
// -----------------------------------------------------------------------------

export class TrustRatingModelMapper {
  static fromApi(response: TrustRatingApiResponse): TrustRatingModel {
    return {
      id: response.id,
      publicId: response.publicId,

      reviewerPublicId: response.reviewerPublicId,
      revieweePublicId: response.revieweePublicId,

      journeyPublicId: response.journeyPublicId,
      bookingPublicId: response.bookingPublicId,

      role: response.role,
      score: response.score,
      status: response.status,

      reviewPublicId: response.reviewPublicId,

      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }

  static fromApiList(
    responses: TrustRatingApiResponse[],
  ): TrustRatingModel[] {
    return responses.map((response) => this.fromApi(response));
  }
}

export class TrustReviewModelMapper {
  static fromApi(response: TrustReviewApiResponse): TrustReviewModel {
    return {
      id: response.id,
      publicId: response.publicId,

      ratingId: response.ratingId,

      content: response.content,

      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }

  static fromApiList(
    responses: TrustReviewApiResponse[],
  ): TrustReviewModel[] {
    return responses.map((response) => this.fromApi(response));
  }
}

export class TrustProfileBadgeModelMapper {
  static fromApi(
    response: TrustProfileBadgeApiResponse,
  ): TrustProfileBadgeModel {
    return {
      id: response.id,
      publicId: response.publicId,

      profileId: response.profileId,
      badgeId: response.badgeId,

      awardedAt: response.awardedAt,
      revokedAt: response.revokedAt,

      active: response.active,

      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }

  static fromApiList(
    responses: TrustProfileBadgeApiResponse[],
  ): TrustProfileBadgeModel[] {
    return responses.map((response) => this.fromApi(response));
  }
}

export class TrustEventModelMapper {
  static fromApi(response: TrustEventApiResponse): TrustEventModel {
    return {
      id: response.id,
      publicId: response.publicId,

      profileId: response.profileId,

      type: response.type,

      journeyPublicId: response.journeyPublicId,
      bookingPublicId: response.bookingPublicId,
      ratingPublicId: response.ratingPublicId,
      badgePublicId: response.badgePublicId,
      disputePublicId: response.disputePublicId,
      actorPublicId: response.actorPublicId,

      reason: response.reason,
      metadata: response.metadata,

      createdAt: response.createdAt,
    };
  }

  static fromApiList(
    responses: TrustEventApiResponse[],
  ): TrustEventModel[] {
    return responses.map((response) => this.fromApi(response));
  }
}

// -----------------------------------------------------------------------------
// Trust Profile Summary Mapper
// -----------------------------------------------------------------------------

/**
 * Maps paginated Trust profile summary responses.
 *
 * Does not attempt to map nested collections because the summary endpoint
 * intentionally excludes them.
 */
export class TrustProfileSummaryModelMapper {
  static fromApi(
    response: TrustProfileSummaryApiResponse,
  ): TrustProfileSummaryModel {
    return {
      id: response.id,
      publicId: response.publicId,

      memberPublicId: response.memberPublicId,

      status: response.status,
      verificationLevel: response.verificationLevel,

      ratingAverage: response.ratingAverage,
      ratingCount: response.ratingCount,

      completedJourneys: response.completedJourneys,
      providerJourneys: response.providerJourneys,
      passengerJourneys: response.passengerJourneys,

      completedProviderJourneys: response.completedProviderJourneys,
      completedPassengerJourneys: response.completedPassengerJourneys,

      cancelledJourneys: response.cancelledJourneys,
      providerCancellations: response.providerCancellations,
      passengerCancellations: response.passengerCancellations,

      completionRate: response.completionRate,
      cancellationRate: response.cancellationRate,

      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }

  static fromApiList(
    responses: TrustProfileSummaryApiResponse[],
  ): TrustProfileSummaryModel[] {
    return responses.map((response) => this.fromApi(response));
  }
}

// -----------------------------------------------------------------------------
// Full Trust Profile Mapper
// -----------------------------------------------------------------------------

export class TrustProfileModelMapper {
  /**
   * Maps an individual full Trust profile response.
   */
  static fromApi(response: TrustProfileApiResponse): TrustProfileModel {
    return {
      id: response.id,
      publicId: response.publicId,

      memberPublicId: response.memberPublicId,

      status: response.status,
      verificationLevel: response.verificationLevel,

      ratingAverage: response.ratingAverage,
      ratingCount: response.ratingCount,

      completedJourneys: response.completedJourneys,
      providerJourneys: response.providerJourneys,
      passengerJourneys: response.passengerJourneys,

      completedProviderJourneys: response.completedProviderJourneys,
      completedPassengerJourneys: response.completedPassengerJourneys,

      cancelledJourneys: response.cancelledJourneys,
      providerCancellations: response.providerCancellations,
      passengerCancellations: response.passengerCancellations,

      completionRate: response.completionRate,
      cancellationRate: response.cancellationRate,

      ratings: TrustRatingModelMapper.fromApiList(response.ratings),

      reviews: TrustReviewModelMapper.fromApiList(response.reviews),

      badges: response.badges.map((badge: TrustBadgeApiResponse) =>
        TrustBadgeModelMapper.fromApi(badge),
      ),

      profileBadges: TrustProfileBadgeModelMapper.fromApiList(
        response.profileBadges,
      ),

      events: TrustEventModelMapper.fromApiList(response.events),

      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }

  /**
   * Maps a collection of full Trust profile responses.
   */
  static fromApiList(
    responses: TrustProfileApiResponse[],
  ): TrustProfileModel[] {
    return responses.map((response) => this.fromApi(response));
  }
}
