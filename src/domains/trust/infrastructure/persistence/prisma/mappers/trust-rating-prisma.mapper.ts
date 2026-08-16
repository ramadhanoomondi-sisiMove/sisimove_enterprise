// src/domains/trust/infrastructure/persistence/prisma/mappers/trust-rating-prisma.mapper.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import { TrustRatingEntity } from '../../../../domain/entities/trust-rating.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type {
  TrustRatingRole,
  TrustRatingStatus,
} from '../../../../domain/value-objects';
import {
  BookingPublicId,
  JourneyPublicId,
  RatingPublicId,
  ReviewerPublicId,
  RevieweePublicId,
  TrustRatingId,
  TrustRatingRoleValueObject,
  TrustRatingScore,
  TrustRatingStatusValueObject,
} from '../../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { Prisma, TrustRating } from '@prisma/client';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export class TrustRatingPrismaMapper {
  // ===========================================================================
  // Prisma -> Domain
  // ===========================================================================

  static toDomain(record: TrustRating): TrustRatingEntity {
    return TrustRatingEntity.rehydrate(
      {
        publicId: new TrustRatingId(record.publicId),

        reviewerPublicId: new ReviewerPublicId(record.reviewerPublicId),

        revieweePublicId: new RevieweePublicId(record.revieweePublicId),

        journeyPublicId: new JourneyPublicId(record.journeyPublicId),

        bookingPublicId:
          record.bookingPublicId !== null
            ? new BookingPublicId(record.bookingPublicId)
            : undefined,

        role: new TrustRatingRoleValueObject(record.role as TrustRatingRole),

        score: new TrustRatingScore(record.score),

        status: new TrustRatingStatusValueObject(
          record.status as TrustRatingStatus,
        ),

        // ---------------------------------------------------------------------
        // Prisma TrustRating.review is a relation, while the domain entity
        // stores only the external/public review identifier.
        //
        // The scalar TrustReview.publicId is therefore populated by the
        // repository/mapper when the relation is included.
        // ---------------------------------------------------------------------

        reviewPublicId: undefined,

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },
      new UniqueEntityId(record.id),
    );
  }

  // ===========================================================================
  // Prisma -> Domain With Review
  // ===========================================================================

  static toDomainWithReview(
    record: TrustRating & {
      review?: {
        publicId: string;
      } | null;
    },
  ): TrustRatingEntity {
    return TrustRatingEntity.rehydrate(
      {
        publicId: new TrustRatingId(record.publicId),

        reviewerPublicId: new ReviewerPublicId(record.reviewerPublicId),

        revieweePublicId: new RevieweePublicId(record.revieweePublicId),

        journeyPublicId: new JourneyPublicId(record.journeyPublicId),

        bookingPublicId:
          record.bookingPublicId !== null
            ? new BookingPublicId(record.bookingPublicId)
            : undefined,

        role: new TrustRatingRoleValueObject(record.role as TrustRatingRole),

        score: new TrustRatingScore(record.score),

        status: new TrustRatingStatusValueObject(
          record.status as TrustRatingStatus,
        ),

        reviewPublicId:
          record.review !== undefined && record.review !== null
            ? new RatingPublicId(record.review.publicId)
            : undefined,

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },
      new UniqueEntityId(record.id),
    );
  }

  // ===========================================================================
  // Domain -> Prisma Create
  // ===========================================================================

  static toPersistence(
    entity: TrustRatingEntity,
    profileId: string,
  ): Prisma.TrustRatingUncheckedCreateInput {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      profileId,

      reviewerPublicId: entity.reviewerPublicId.value,

      revieweePublicId: entity.revieweePublicId.value,

      journeyPublicId: entity.journeyPublicId.value,

      bookingPublicId: entity.bookingPublicId?.value ?? null,

      role: entity.role.value,

      score: entity.score.value,

      status: entity.status.value,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Domain -> Prisma Update
  // ===========================================================================

  static toUpdate(
    entity: TrustRatingEntity,
  ): Prisma.TrustRatingUncheckedUpdateInput {
    return {
      publicId: entity.publicId.value,

      reviewerPublicId: entity.reviewerPublicId.value,

      revieweePublicId: entity.revieweePublicId.value,

      journeyPublicId: entity.journeyPublicId.value,

      bookingPublicId: entity.bookingPublicId?.value ?? null,

      role: entity.role.value,

      score: entity.score.value,

      status: entity.status.value,

      updatedAt: entity.updatedAt,
    };
  }
}
