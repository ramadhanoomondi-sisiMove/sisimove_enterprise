// src/domains/trust/infrastructure/persistence/prisma/mappers/trust-profile-badge-prisma.mapper.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import { TrustProfileBadgeEntity } from '../../../../domain/entities/trust-profile-badge.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import {
  TrustBadgeId,
  TrustProfileBadgeId,
  TrustProfileId,
} from '../../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { Prisma, TrustProfileBadge } from '@prisma/client';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export class TrustProfileBadgePrismaMapper {
  // ===========================================================================
  // Prisma -> Domain
  // ===========================================================================

  static toDomain(record: TrustProfileBadge): TrustProfileBadgeEntity {
    return TrustProfileBadgeEntity.rehydrate(
      {
        publicId: new TrustProfileBadgeId(record.publicId),

        profileId: new TrustProfileId(record.profileId),

        badgeId: new TrustBadgeId(record.badgeId),

        awardedAt: record.awardedAt,

        revokedAt: record.revokedAt !== null ? record.revokedAt : undefined,

        active: record.active,

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
    entity: TrustProfileBadgeEntity,
  ): Prisma.TrustProfileBadgeUncheckedCreateInput {
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
  // Domain -> Prisma Update
  // ===========================================================================

  static toUpdate(
    entity: TrustProfileBadgeEntity,
  ): Prisma.TrustProfileBadgeUncheckedUpdateInput {
    return {
      publicId: entity.publicId.value,

      profileId: entity.profileId.value,

      badgeId: entity.badgeId.value,

      awardedAt: entity.awardedAt,

      revokedAt: entity.revokedAt ?? null,

      active: entity.active,

      updatedAt: entity.updatedAt,
    };
  }
}
