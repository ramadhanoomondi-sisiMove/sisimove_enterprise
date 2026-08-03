// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import { AssetAggregate } from '../../domain/aggregates/asset.aggregate';

import type { AssetRepository } from '../../domain/repositories/asset.repository';

import {
  AssetCategory,
  AssetId,
  AssetOwnerIdentityId,
  AssetReferenceField,
  AssetResourceType,
  AssetStatus,
  AssetType,
  AssetVariantType,
  ChecksumAlgorithm,
} from '../../domain/value-objects';

import type {
  AssetEntity,
  AssetModerationEntity,
  AssetProcessingEntity,
  AssetReferenceEntity,
  AssetScanEntity,
  AssetVariantEntity,
} from '../../domain/entities';

// -----------------------------------------------------------------------------
// Persistence Mappers
// -----------------------------------------------------------------------------

import { AssetPersistenceMapper } from './asset.persistence.mapper';
import { AssetModerationPersistenceMapper } from './asset-moderation.persistence.mapper';
import { AssetProcessingPersistenceMapper } from './asset-processing.persistence.mapper';
import { AssetReferencePersistenceMapper } from './asset-reference.persistence.mapper';
import { AssetScanPersistenceMapper } from './asset-scan.persistence.mapper';
import { AssetVariantPersistenceMapper } from './asset-variant.persistence.mapper';

// -----------------------------------------------------------------------------
// Aggregate Include
// -----------------------------------------------------------------------------

const ASSET_AGGREGATE_INCLUDE = {
  variants: true,
  references: true,
  processings: true,
  scans: true,
  moderations: true,
} satisfies Prisma.AssetInclude;

// -----------------------------------------------------------------------------
// Aggregate Payload
// -----------------------------------------------------------------------------

type PrismaAssetAggregate = Prisma.AssetGetPayload<{
  include: typeof ASSET_AGGREGATE_INCLUDE;
}>;

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

@Injectable()
export class PrismaAssetRepository implements AssetRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ---------------------------------------------------------------------------
  // Aggregate Mapper
  // ---------------------------------------------------------------------------

  private static toAggregate(asset: PrismaAssetAggregate): AssetAggregate {
    return AssetAggregate.rehydrate(
      AssetPersistenceMapper.toEntity(asset),

      asset.variants.map((variant) =>
        AssetVariantPersistenceMapper.toEntity(variant),
      ),

      asset.references.map((reference) =>
        AssetReferencePersistenceMapper.toEntity(reference),
      ),

      asset.processings.map((processing) =>
        AssetProcessingPersistenceMapper.toEntity(processing),
      ),

      asset.scans.map((scan) => AssetScanPersistenceMapper.toEntity(scan)),

      asset.moderations.map((moderation) =>
        AssetModerationPersistenceMapper.toEntity(moderation),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Aggregate Query Helper
  // ---------------------------------------------------------------------------

  private async findAggregate(
    where: Prisma.AssetWhereUniqueInput,
  ): Promise<AssetAggregate | null> {
    const asset = await this.prisma.asset.findUnique({
      where,
      include: ASSET_AGGREGATE_INCLUDE,
    });

    return asset ? PrismaAssetRepository.toAggregate(asset) : null;
  }

  // ---------------------------------------------------------------------------
  // Entity Query Helper
  // ---------------------------------------------------------------------------

  private async findEntity(
    where: Prisma.AssetWhereUniqueInput,
  ): Promise<AssetEntity | null> {
    const asset = await this.prisma.asset.findUnique({
      where,
    });

    return asset ? AssetPersistenceMapper.toEntity(asset) : null;
  }

  // ---------------------------------------------------------------------------
  // Exists Helper
  // ---------------------------------------------------------------------------

  private async exists(where: Prisma.AssetWhereInput): Promise<boolean> {
    const asset = await this.prisma.asset.findFirst({
      where,
      select: {
        id: true,
      },
    });

    return asset !== null;
  }

  // ---------------------------------------------------------------------------
  // Aggregate Queries
  // ---------------------------------------------------------------------------

  async findByPublicId(publicId: AssetId): Promise<AssetAggregate | null> {
    return this.findAggregate({
      publicId: publicId.value,
    });
  }

  async findByObjectKey(objectKey: string): Promise<AssetAggregate | null> {
    return this.findAggregate({
      objectKey,
    });
  }

  async findByOwnerIdentityId(
    ownerIdentityId: AssetOwnerIdentityId,
  ): Promise<AssetAggregate[]> {
    const assets = await this.prisma.asset.findMany({
      where: {
        ownerIdentityId: ownerIdentityId.value,
      },
      include: ASSET_AGGREGATE_INCLUDE,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return assets.map((asset) => PrismaAssetRepository.toAggregate(asset));
  }

  // ---------------------------------------------------------------------------
  // Entity Queries
  // ---------------------------------------------------------------------------

  async findEntityByPublicId(publicId: AssetId): Promise<AssetEntity | null> {
    return this.findEntity({
      publicId: publicId.value,
    });
  }

  async findEntityByObjectKey(objectKey: string): Promise<AssetEntity | null> {
    return this.findEntity({
      objectKey,
    });
  }

  async findEntitiesByOwnerIdentityId(
    ownerIdentityId: AssetOwnerIdentityId,
  ): Promise<AssetEntity[]> {
    const assets = await this.prisma.asset.findMany({
      where: {
        ownerIdentityId: ownerIdentityId.value,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return assets.map((asset) => AssetPersistenceMapper.toEntity(asset));
  }

  async findEntitiesByCategory(
    category: AssetCategory,
  ): Promise<AssetEntity[]> {
    const assets = await this.prisma.asset.findMany({
      where: {
        category,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return assets.map((asset) => AssetPersistenceMapper.toEntity(asset));
  }

  async findEntitiesByStatus(status: AssetStatus): Promise<AssetEntity[]> {
    const assets = await this.prisma.asset.findMany({
      where: {
        status,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return assets.map((asset) => AssetPersistenceMapper.toEntity(asset));
  }

  async findEntitiesByType(type: AssetType): Promise<AssetEntity[]> {
    const assets = await this.prisma.asset.findMany({
      where: {
        type,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return assets.map((asset) => AssetPersistenceMapper.toEntity(asset));
  }
  // ---------------------------------------------------------------------------
  // Variants
  // ---------------------------------------------------------------------------

  async findVariants(assetId: string): Promise<AssetVariantEntity[]> {
    const variants = await this.prisma.assetVariant.findMany({
      where: {
        assetId,
      },
      orderBy: [
        {
          variant: 'asc',
        },
        {
          createdAt: 'asc',
        },
      ],
    });

    return variants.map((variant) =>
      AssetVariantPersistenceMapper.toEntity(variant),
    );
  }

  async findVariant(
    assetId: string,
    variant: AssetVariantType,
  ): Promise<AssetVariantEntity | null> {
    const entity = await this.prisma.assetVariant.findFirst({
      where: {
        assetId,
        variant,
      },
    });

    return entity ? AssetVariantPersistenceMapper.toEntity(entity) : null;
  }

  // ---------------------------------------------------------------------------
  // References
  // ---------------------------------------------------------------------------

  async findReferences(assetId: string): Promise<AssetReferenceEntity[]> {
    const references = await this.prisma.assetReference.findMany({
      where: {
        assetId,
      },
      orderBy: [
        {
          resourceType: 'asc',
        },
        {
          resourcePublicId: 'asc',
        },
        {
          referenceField: 'asc',
        },
      ],
    });

    return references.map((reference) =>
      AssetReferencePersistenceMapper.toEntity(reference),
    );
  }

  async findReferencesByResource(
    resourceType: AssetResourceType,
    resourcePublicId: string,
  ): Promise<AssetReferenceEntity[]> {
    const references = await this.prisma.assetReference.findMany({
      where: {
        resourceType,
        resourcePublicId,
      },
      orderBy: [
        {
          assetId: 'asc',
        },
        {
          referenceField: 'asc',
        },
      ],
    });

    return references.map((reference) =>
      AssetReferencePersistenceMapper.toEntity(reference),
    );
  }

  async findReferencesByField(
    resourceType: AssetResourceType,
    resourcePublicId: string,
    referenceField: AssetReferenceField,
  ): Promise<AssetReferenceEntity[]> {
    const references = await this.prisma.assetReference.findMany({
      where: {
        resourceType,
        resourcePublicId,
        referenceField,
      },
      orderBy: {
        assetId: 'asc',
      },
    });

    return references.map((reference) =>
      AssetReferencePersistenceMapper.toEntity(reference),
    );
  }

  // ---------------------------------------------------------------------------
  // Processings
  // ---------------------------------------------------------------------------

  async findProcessings(assetId: string): Promise<AssetProcessingEntity[]> {
    const processings = await this.prisma.assetProcessing.findMany({
      where: {
        assetId,
      },
      orderBy: [
        {
          operation: 'asc',
        },
        {
          createdAt: 'asc',
        },
      ],
    });

    return processings.map((processing) =>
      AssetProcessingPersistenceMapper.toEntity(processing),
    );
  }

  // ---------------------------------------------------------------------------
  // Scans
  // ---------------------------------------------------------------------------

  async findScans(assetId: string): Promise<AssetScanEntity[]> {
    const scans = await this.prisma.assetScan.findMany({
      where: {
        assetId,
      },
      orderBy: [
        {
          engine: 'asc',
        },
        {
          createdAt: 'asc',
        },
      ],
    });

    return scans.map((scan) => AssetScanPersistenceMapper.toEntity(scan));
  }

  // ---------------------------------------------------------------------------
  // Moderations
  // ---------------------------------------------------------------------------

  async findModerations(assetId: string): Promise<AssetModerationEntity[]> {
    const moderations = await this.prisma.assetModeration.findMany({
      where: {
        assetId,
      },
      orderBy: [
        {
          type: 'asc',
        },
        {
          createdAt: 'asc',
        },
      ],
    });

    return moderations.map((moderation) =>
      AssetModerationPersistenceMapper.toEntity(moderation),
    );
  }
  // ---------------------------------------------------------------------------
  // Existence
  // ---------------------------------------------------------------------------

  async existsByPublicId(publicId: AssetId): Promise<boolean> {
    return this.exists({
      publicId: publicId.value,
    });
  }

  async existsByObjectKey(objectKey: string): Promise<boolean> {
    return this.exists({
      objectKey,
    });
  }

  async existsByChecksum(
    algorithm: ChecksumAlgorithm,
    checksum: string,
  ): Promise<boolean> {
    return this.exists({
      checksumAlgorithm: algorithm,
      checksum,
    });
  }

  async existsByOwnerIdentityId(
    ownerIdentityId: AssetOwnerIdentityId,
  ): Promise<boolean> {
    return this.exists({
      ownerIdentityId: ownerIdentityId.value,
    });
  }
  // ---------------------------------------------------------------------------
  // Persistence
  // ---------------------------------------------------------------------------

  async save(aggregate: AssetAggregate): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await this.persistAsset(tx, aggregate);
      await this.persistVariants(tx, aggregate);
      await this.persistReferences(tx, aggregate);
      await this.persistProcessings(tx, aggregate);
      await this.persistScans(tx, aggregate);
      await this.persistModerations(tx, aggregate);
    });
  }

  async delete(aggregate: AssetAggregate): Promise<void> {
    await this.prisma.asset.delete({
      where: {
        id: aggregate.id.value,
      },
    });
  }

  // ---------------------------------------------------------------------------
  // Transaction Helpers
  // ---------------------------------------------------------------------------

  private async persistAsset(
    tx: Prisma.TransactionClient,
    aggregate: AssetAggregate,
  ): Promise<void> {
    await tx.asset.upsert({
      where: {
        id: aggregate.id.value,
      },
      create: AssetPersistenceMapper.toCreatePersistence(aggregate.asset),
      update: AssetPersistenceMapper.toUpdatePersistence(aggregate.asset),
    });
  }

  private async persistVariants(
    tx: Prisma.TransactionClient,
    aggregate: AssetAggregate,
  ): Promise<void> {
    await tx.assetVariant.deleteMany({
      where: {
        assetId: aggregate.id.value,
      },
    });

    if (aggregate.variants.length === 0) {
      return;
    }

    await tx.assetVariant.createMany({
      data: aggregate.variants.map((variant) =>
        AssetVariantPersistenceMapper.toPersistence(variant),
      ),
    });
  }

  private async persistReferences(
    tx: Prisma.TransactionClient,
    aggregate: AssetAggregate,
  ): Promise<void> {
    await tx.assetReference.deleteMany({
      where: {
        assetId: aggregate.id.value,
      },
    });

    if (aggregate.references.length === 0) {
      return;
    }

    await tx.assetReference.createMany({
      data: aggregate.references.map((reference) =>
        AssetReferencePersistenceMapper.toPersistence(reference),
      ),
    });
  }

  private async persistProcessings(
    tx: Prisma.TransactionClient,
    aggregate: AssetAggregate,
  ): Promise<void> {
    await tx.assetProcessing.deleteMany({
      where: {
        assetId: aggregate.id.value,
      },
    });

    if (aggregate.processings.length === 0) {
      return;
    }

    await tx.assetProcessing.createMany({
      data: aggregate.processings.map((processing) =>
        AssetProcessingPersistenceMapper.toCreatePersistence(processing),
      ),
    });
  }

  private async persistScans(
    tx: Prisma.TransactionClient,
    aggregate: AssetAggregate,
  ): Promise<void> {
    await tx.assetScan.deleteMany({
      where: {
        assetId: aggregate.id.value,
      },
    });

    if (aggregate.scans.length === 0) {
      return;
    }

    await tx.assetScan.createMany({
      data: aggregate.scans.map((scan) =>
        AssetScanPersistenceMapper.toCreatePersistence(scan),
      ),
    });
  }

  private async persistModerations(
    tx: Prisma.TransactionClient,
    aggregate: AssetAggregate,
  ): Promise<void> {
    await tx.assetModeration.deleteMany({
      where: {
        assetId: aggregate.id.value,
      },
    });

    if (aggregate.moderations.length === 0) {
      return;
    }

    await tx.assetModeration.createMany({
      data: aggregate.moderations.map((moderation) =>
        AssetModerationPersistenceMapper.toCreatePersistence(moderation),
      ),
    });
  }
}
