// src/domains/trust/infrastructure/persistence/prisma/mappers/trust-badge-prisma.mapper.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import { TrustBadgeEntity } from '../../../../domain/entities/trust-badge.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { TrustBadgeType } from '../../../../domain/value-objects/trust-badge-type.vo';

import {
  AssetPublicId,
  TrustBadgeDescription,
  TrustBadgeName,
  TrustBadgeId,
  TrustBadgeTypeValueObject,
} from '../../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { Prisma, TrustBadge } from '@prisma/client';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export class TrustBadgePrismaMapper {
  // ===========================================================================
  // Prisma -> Domain
  // ===========================================================================

  static toDomain(record: TrustBadge): TrustBadgeEntity {
    return TrustBadgeEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        publicId: new TrustBadgeId(record.publicId),

        // ---------------------------------------------------------------------
        // Badge Definition
        // ---------------------------------------------------------------------

        type: new TrustBadgeTypeValueObject(record.type as TrustBadgeType),

        name: new TrustBadgeName(record.name),

        description:
          record.description !== null
            ? new TrustBadgeDescription(record.description)
            : undefined,

        // ---------------------------------------------------------------------
        // Cross-domain Asset Reference
        // ---------------------------------------------------------------------

        assetPublicId:
          record.assetPublicId !== null
            ? new AssetPublicId(record.assetPublicId)
            : undefined,

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        active: record.active,

        // ---------------------------------------------------------------------
        // Audit timestamps
        // ---------------------------------------------------------------------

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
    entity: TrustBadgeEntity,
  ): Prisma.TrustBadgeUncheckedCreateInput {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      id: entity.id.toString(),

      publicId: entity.publicId.value,

      // -----------------------------------------------------------------------
      // Badge Definition
      // -----------------------------------------------------------------------

      type: entity.type.value,

      name: entity.name.value,

      description: entity.description?.value ?? null,

      // -----------------------------------------------------------------------
      // Cross-domain Asset Reference
      // -----------------------------------------------------------------------

      assetPublicId: entity.assetPublicId?.value ?? null,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      active: entity.active,

      // -----------------------------------------------------------------------
      // Audit timestamps
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Domain -> Prisma Update
  // ===========================================================================

  static toUpdate(
    entity: TrustBadgeEntity,
  ): Prisma.TrustBadgeUncheckedUpdateInput {
    return {
      // -----------------------------------------------------------------------
      // Badge Definition
      // -----------------------------------------------------------------------

      type: entity.type.value,

      name: entity.name.value,

      description: entity.description?.value ?? null,

      // -----------------------------------------------------------------------
      // Cross-domain Asset Reference
      // -----------------------------------------------------------------------

      assetPublicId: entity.assetPublicId?.value ?? null,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      active: entity.active,

      // -----------------------------------------------------------------------
      // Audit timestamp
      // -----------------------------------------------------------------------

      updatedAt: entity.updatedAt,
    };
  }
}
