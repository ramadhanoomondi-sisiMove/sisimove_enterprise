// src/domains/trust/infrastructure/persistence/prisma/mappers/trust-review-prisma.mapper.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import { TrustReviewEntity } from '../../../../domain/entities/trust-review.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import {
  TrustRatingId,
  TrustReviewContent,
  TrustReviewId,
} from '../../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { Prisma, TrustReview } from '@prisma/client';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export class TrustReviewPrismaMapper {
  // ===========================================================================
  // Prisma -> Domain
  // ===========================================================================

  static toDomain(record: TrustReview): TrustReviewEntity {
    return TrustReviewEntity.rehydrate(
      {
        publicId: new TrustReviewId(record.publicId),

        ratingId: new TrustRatingId(record.ratingId),

        content: new TrustReviewContent(record.content),

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
    entity: TrustReviewEntity,
  ): Prisma.TrustReviewUncheckedCreateInput {
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
  // Domain -> Prisma Update
  // ===========================================================================

  static toUpdate(
    entity: TrustReviewEntity,
  ): Prisma.TrustReviewUncheckedUpdateInput {
    return {
      publicId: entity.publicId.value,

      ratingId: entity.ratingId.value,

      content: entity.content.value,

      updatedAt: entity.updatedAt,
    };
  }
}
