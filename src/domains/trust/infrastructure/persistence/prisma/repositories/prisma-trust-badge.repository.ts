// src/domains/trust/infrastructure/persistence/prisma/repositories/prisma-trust-badge.repository.ts

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { Prisma } from '@prisma/client';

import type { PrismaService } from '../../../../../../infrastructure/database/prisma/prisma.service';

// -----------------------------------------------------------------------------
// Domain Repository
// -----------------------------------------------------------------------------

import type { TrustBadgeRepository } from '../../../../domain/repositories/trust-badge.repository';

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import { TrustBadgeAggregate } from '../../../../domain/aggregates/trust-badge.aggregate';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { TrustBadgeEntity } from '../../../../domain/entities/trust-badge.entity';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import { TrustBadgePrismaMapper } from '../mappers';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { TrustBadgeId } from '../../../../domain/value-objects/trust-badge-id.vo';
import type { TrustBadgeName } from '../../../../domain/value-objects/trust-badge-name.vo';
import type { TrustBadgeTypeValueObject } from '../../../../domain/value-objects/trust-badge-type.vo';
import type { AssetPublicId } from '../../../../domain/value-objects/asset-public-id.vo';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

export class PrismaTrustBadgeRepository implements TrustBadgeRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // Aggregate Persistence
  // ===========================================================================

  async save(aggregate: TrustBadgeAggregate): Promise<void> {
    const badge = aggregate.badge;

    await this.prisma.trustBadge.upsert({
      where: {
        id: badge.id.toString(),
      },

      create: TrustBadgePrismaMapper.toPersistence(badge),

      update: TrustBadgePrismaMapper.toUpdate(badge),
    });
  }

  // ===========================================================================
  // Aggregate Queries
  // ===========================================================================

  async findById(id: TrustBadgeId): Promise<TrustBadgeAggregate | null> {
    const record = await this.prisma.trustBadge.findUnique({
      where: {
        publicId: id.value,
      },
    });

    if (record === null) {
      return null;
    }

    return TrustBadgeAggregate.rehydrate(
      TrustBadgePrismaMapper.toDomain(record),
    );
  }

  async findByPublicId(
    publicId: TrustBadgeId,
  ): Promise<TrustBadgeAggregate | null> {
    const record = await this.prisma.trustBadge.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return TrustBadgeAggregate.rehydrate(
      TrustBadgePrismaMapper.toDomain(record),
    );
  }

  async findByType(
    type: TrustBadgeTypeValueObject,
  ): Promise<TrustBadgeAggregate | null> {
    const record = await this.prisma.trustBadge.findUnique({
      where: {
        type: type.value,
      },
    });

    if (record === null) {
      return null;
    }

    return TrustBadgeAggregate.rehydrate(
      TrustBadgePrismaMapper.toDomain(record),
    );
  }

  async findByName(name: TrustBadgeName): Promise<TrustBadgeAggregate | null> {
    const record = await this.prisma.trustBadge.findFirst({
      where: {
        name: name.value,
      },
    });

    if (record === null) {
      return null;
    }

    return TrustBadgeAggregate.rehydrate(
      TrustBadgePrismaMapper.toDomain(record),
    );
  }

  // ===========================================================================
  // Badge Entity Queries
  // ===========================================================================

  async findBadgeById(id: TrustBadgeId): Promise<TrustBadgeEntity | null> {
    const record = await this.prisma.trustBadge.findUnique({
      where: {
        publicId: id.value,
      },
    });

    if (record === null) {
      return null;
    }

    return TrustBadgePrismaMapper.toDomain(record);
  }

  async findBadgeByPublicId(
    publicId: TrustBadgeId,
  ): Promise<TrustBadgeEntity | null> {
    const record = await this.prisma.trustBadge.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return TrustBadgePrismaMapper.toDomain(record);
  }

  async findBadgeByType(
    type: TrustBadgeTypeValueObject,
  ): Promise<TrustBadgeEntity | null> {
    const record = await this.prisma.trustBadge.findUnique({
      where: {
        type: type.value,
      },
    });

    if (record === null) {
      return null;
    }

    return TrustBadgePrismaMapper.toDomain(record);
  }

  async findBadgeByName(
    name: TrustBadgeName,
  ): Promise<TrustBadgeEntity | null> {
    const record = await this.prisma.trustBadge.findFirst({
      where: {
        name: name.value,
      },
    });

    if (record === null) {
      return null;
    }

    return TrustBadgePrismaMapper.toDomain(record);
  }

  async findAll(): Promise<TrustBadgeEntity[]> {
    const records = await this.prisma.trustBadge.findMany({
      orderBy: [
        {
          active: 'desc',
        },
        {
          createdAt: 'asc',
        },
      ],
    });

    return records.map((record) => TrustBadgePrismaMapper.toDomain(record));
  }

  async findActive(): Promise<TrustBadgeEntity[]> {
    const records = await this.prisma.trustBadge.findMany({
      where: {
        active: true,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => TrustBadgePrismaMapper.toDomain(record));
  }

  async findInactive(): Promise<TrustBadgeEntity[]> {
    const records = await this.prisma.trustBadge.findMany({
      where: {
        active: false,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => TrustBadgePrismaMapper.toDomain(record));
  }

  async findByAssetPublicId(
    assetPublicId: AssetPublicId,
  ): Promise<TrustBadgeEntity[]> {
    const records = await this.prisma.trustBadge.findMany({
      where: {
        assetPublicId: assetPublicId.value,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => TrustBadgePrismaMapper.toDomain(record));
  }

  // ===========================================================================
  // Existence Queries
  // ===========================================================================

  async exists(id: TrustBadgeId): Promise<boolean> {
    const count = await this.prisma.trustBadge.count({
      where: {
        publicId: id.value,
      },
    });

    return count > 0;
  }

  async existsByPublicId(publicId: TrustBadgeId): Promise<boolean> {
    const count = await this.prisma.trustBadge.count({
      where: {
        publicId: publicId.value,
      },
    });

    return count > 0;
  }

  async existsByType(type: TrustBadgeTypeValueObject): Promise<boolean> {
    const count = await this.prisma.trustBadge.count({
      where: {
        type: type.value,
      },
    });

    return count > 0;
  }

  async existsByName(name: TrustBadgeName): Promise<boolean> {
    const count = await this.prisma.trustBadge.count({
      where: {
        name: name.value,
      },
    });

    return count > 0;
  }

  async existsByAssetPublicId(assetPublicId: AssetPublicId): Promise<boolean> {
    const count = await this.prisma.trustBadge.count({
      where: {
        assetPublicId: assetPublicId.value,
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Deletion
  // ===========================================================================

  async delete(id: TrustBadgeId): Promise<void> {
    const record = await this.prisma.trustBadge.findUnique({
      where: {
        publicId: id.value,
      },

      select: {
        id: true,
      },
    });

    if (record === null) {
      return;
    }

    await this.prisma.trustBadge.delete({
      where: {
        id: record.id,
      },
    });
  }
}
