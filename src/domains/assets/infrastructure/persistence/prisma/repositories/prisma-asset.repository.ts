// -----------------------------------------------------------------------------
// Assets — Prisma Asset Repository
// -----------------------------------------------------------------------------
//
// Prisma implementation of the AssetRepository.
//
// Aggregate:
//
// AssetAggregate
// └── AssetEntity
//
// Persistence:
//
// Asset
//
// Responsibilities:
//
// - Persist Asset aggregates.
// - Retrieve Asset aggregates.
// - Retrieve Asset entities.
// - Query Assets by public identity.
// - Query Assets by owning Identity.
// - Query Assets by object key.
// - Query Assets by lifecycle status.
// - Query Assets by type.
// - Query Assets by category.
// - Query Assets by visibility.
// - Query Assets by storage provider.
// - Execute existence checks.
//
// This repository contains persistence concerns only.
//
// It does NOT:
//
// - Upload files.
// - Delete physical files.
// - Generate URLs.
// - Generate signed URLs.
// - Validate business policy.
// - Validate Identity state.
// - Load Identity aggregates.
// - Perform authorization.
// - Decide Asset lifecycle transitions.
//
// Physical storage operations belong to AssetStoragePort.
//
// -----------------------------------------------------------------------------
//
// Cross-aggregate Identity reference
//
// Domain:
//     AssetIdentityPublicId
//
// Prisma:
//     Asset.ownerIdentityId
//
// The Prisma Asset.ownerIdentityId field references:
//
//     Identity.id
//
// while the Asset domain intentionally works with:
//
//     Identity.publicId
//
// Therefore:
//
//     Domain AssetIdentityPublicId
//             ↓
//     Identity.publicId
//             ↓
//     Identity.id
//             ↓
//     Asset.ownerIdentityId
//
// and on reads:
//
//     Asset.ownerIdentityId
//             ↓
//     Identity.id
//             ↓
//     Identity.publicId
//             ↓
//     AssetIdentityPublicId
//
// The repository performs this persistence translation without loading an
// Identity aggregate.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import { Prisma, type Asset as PrismaAsset } from '@prisma/client';

import { PrismaService } from '../../../../../../infrastructure/database/prisma/prisma.service';

// -----------------------------------------------------------------------------
// Repository Contract
// -----------------------------------------------------------------------------

import type { AssetRepository } from '../../../../domain/repositories/asset.repository';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { AssetAggregate } from '../../../../domain/aggregates/asset.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { AssetEntity } from '../../../../domain/entities/asset.entity';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import { AssetPrismaMapper } from '../mappers/asset-prisma.mapper';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { AssetPublicId } from '../../../../domain/value-objects/asset-public-id.vo';

import type { AssetIdentityPublicId } from '../../../../domain/value-objects/asset-identity-public-id.vo';

import type { AssetType } from '../../../../domain/value-objects/asset-type.vo';

import type { AssetCategory } from '../../../../domain/value-objects/asset-category.vo';

import type { AssetStatus } from '../../../../domain/value-objects/asset-status.vo';

import type { AssetVisibility } from '../../../../domain/value-objects/asset-visibility.vo';

import type { AssetStorageProvider } from '../../../../domain/value-objects/asset-storage-provider.vo';

import type { AssetObjectKey } from '../../../../domain/value-objects/asset-object-key.vo';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Prisma Asset With Identity
// -----------------------------------------------------------------------------

type PrismaAssetWithIdentity = Prisma.AssetGetPayload<{
  include: {
    ownerIdentity: {
      select: {
        publicId: true;
      };
    };
  };
}>;

// =============================================================================
// Repository
// =============================================================================

@Injectable()
export class PrismaAssetRepository implements AssetRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  /**
   * Prisma access is provided through the application's NestJS-managed
   * PrismaService.
   *
   * PrismaModule owns the lifecycle of PrismaService and exports it to
   * consuming modules, allowing this repository to participate correctly in
   * NestJS dependency injection.
   */
  public constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // Persistence
  // ===========================================================================

  public async save(aggregate: AssetAggregate): Promise<void> {
    if (aggregate === undefined || aggregate === null) {
      throw new Error('Asset aggregate is required.');
    }

    const persistence = AssetPrismaMapper.toPersistence(aggregate);

    const ownerIdentityId = await this.resolveIdentityId(
      persistence.asset.ownerIdentityId,
    );

    await this.prisma.asset.upsert({
      where: {
        id: persistence.asset.id,
      },

      create: {
        id: persistence.asset.id,
        publicId: persistence.asset.publicId,
        ownerIdentityId,

        type: persistence.asset.type,
        category: persistence.asset.category,
        status: persistence.asset.status,
        visibility: persistence.asset.visibility,

        storageProvider: persistence.asset.storageProvider,

        bucket: persistence.asset.bucket,
        objectKey: persistence.asset.objectKey,

        originalFilename: persistence.asset.originalFilename,
        mimeType: persistence.asset.mimeType,
        sizeBytes: persistence.asset.sizeBytes,

        uploadedAt: persistence.asset.uploadedAt,
        archivedAt: persistence.asset.archivedAt,
        deletedAt: persistence.asset.deletedAt,

        createdAt: persistence.asset.createdAt,
        updatedAt: persistence.asset.updatedAt,
      },

      update: {
        publicId: persistence.asset.publicId,
        ownerIdentityId,

        type: persistence.asset.type,
        category: persistence.asset.category,
        status: persistence.asset.status,
        visibility: persistence.asset.visibility,

        storageProvider: persistence.asset.storageProvider,

        bucket: persistence.asset.bucket,
        objectKey: persistence.asset.objectKey,

        originalFilename: persistence.asset.originalFilename,
        mimeType: persistence.asset.mimeType,
        sizeBytes: persistence.asset.sizeBytes,

        uploadedAt: persistence.asset.uploadedAt,
        archivedAt: persistence.asset.archivedAt,
        deletedAt: persistence.asset.deletedAt,

        updatedAt: persistence.asset.updatedAt,
      },
    });
  }

  public async delete(aggregate: AssetAggregate): Promise<void> {
    if (aggregate === undefined || aggregate === null) {
      throw new Error('Asset aggregate is required.');
    }

    await this.prisma.asset.delete({
      where: {
        id: aggregate.id.toString(),
      },
    });
  }

  // ===========================================================================
  // Aggregate Queries
  // ===========================================================================

  public async findByPublicId(
    publicId: AssetPublicId,
  ): Promise<AssetAggregate | null> {
    const record = await this.findRecordByPublicId(publicId.value);

    return record === null ? null : this.toAggregate(record);
  }

  public async findByObjectKey(
    objectKey: AssetObjectKey,
  ): Promise<AssetAggregate | null> {
    const record = await this.prisma.asset.findUnique({
      where: {
        objectKey: objectKey.value,
      },

      include: {
        ownerIdentity: {
          select: {
            publicId: true,
          },
        },
      },
    });

    return record === null ? null : this.toAggregate(record);
  }

  public async findByOwnerIdentityPublicId(
    identityPublicId: AssetIdentityPublicId,
  ): Promise<AssetAggregate[]> {
    const identityId = await this.findIdentityId(identityPublicId.value);

    if (identityId === null) {
      return [];
    }

    const records = await this.prisma.asset.findMany({
      where: {
        ownerIdentityId: identityId,
      },

      include: {
        ownerIdentity: {
          select: {
            publicId: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Entity Queries
  // ===========================================================================

  public async findEntityByPublicId(
    publicId: AssetPublicId,
  ): Promise<AssetEntity | null> {
    const record = await this.findRecordByPublicId(publicId.value);

    return record === null ? null : this.toEntity(record);
  }

  public async findEntityById(id: UniqueEntityId): Promise<AssetEntity | null> {
    const record = await this.prisma.asset.findUnique({
      where: {
        id: id.toString(),
      },

      include: {
        ownerIdentity: {
          select: {
            publicId: true,
          },
        },
      },
    });

    return record === null ? null : this.toEntity(record);
  }

  public async findEntityByObjectKey(
    objectKey: AssetObjectKey,
  ): Promise<AssetEntity | null> {
    const record = await this.prisma.asset.findUnique({
      where: {
        objectKey: objectKey.value,
      },

      include: {
        ownerIdentity: {
          select: {
            publicId: true,
          },
        },
      },
    });

    return record === null ? null : this.toEntity(record);
  }

  public async findEntityByOwnerIdentityPublicId(
    identityPublicId: AssetIdentityPublicId,
  ): Promise<AssetEntity[]> {
    const identityId = await this.findIdentityId(identityPublicId.value);

    if (identityId === null) {
      return [];
    }

    const records = await this.prisma.asset.findMany({
      where: {
        ownerIdentityId: identityId,
      },

      include: {
        ownerIdentity: {
          select: {
            publicId: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toEntity(record));
  }

  // ===========================================================================
  // Lifecycle Status Queries
  // ===========================================================================

  public async findByStatus(status: AssetStatus): Promise<AssetAggregate[]> {
    return this.findByStatusValue(status.value);
  }

  public async findUploading(): Promise<AssetAggregate[]> {
    return this.findByStatusValue('UPLOADING');
  }

  public async findUploaded(): Promise<AssetAggregate[]> {
    return this.findByStatusValue('UPLOADED');
  }

  public async findReady(): Promise<AssetAggregate[]> {
    return this.findByStatusValue('READY');
  }

  public async findArchived(): Promise<AssetAggregate[]> {
    return this.findByStatusValue('ARCHIVED');
  }

  public async findDeleted(): Promise<AssetAggregate[]> {
    return this.findByStatusValue('DELETED');
  }

  // ===========================================================================
  // Classification Queries
  // ===========================================================================

  public async findByType(type: AssetType): Promise<AssetAggregate[]> {
    const records = await this.prisma.asset.findMany({
      where: {
        type: type.value,
      },

      include: {
        ownerIdentity: {
          select: {
            publicId: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  public async findByCategory(
    category: AssetCategory,
  ): Promise<AssetAggregate[]> {
    const records = await this.prisma.asset.findMany({
      where: {
        category: category.value,
      },

      include: {
        ownerIdentity: {
          select: {
            publicId: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  public async findByTypeAndCategory(
    type: AssetType,
    category: AssetCategory,
  ): Promise<AssetAggregate[]> {
    const records = await this.prisma.asset.findMany({
      where: {
        type: type.value,
        category: category.value,
      },

      include: {
        ownerIdentity: {
          select: {
            publicId: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Ownership Queries
  // ===========================================================================

  public async findByOwner(
    identityPublicId: AssetIdentityPublicId,
  ): Promise<AssetAggregate[]> {
    return this.findByOwnerIdentityPublicId(identityPublicId);
  }

  public async findByOwnerAndStatus(
    identityPublicId: AssetIdentityPublicId,
    status: AssetStatus,
  ): Promise<AssetAggregate[]> {
    const identityId = await this.findIdentityId(identityPublicId.value);

    if (identityId === null) {
      return [];
    }

    const records = await this.prisma.asset.findMany({
      where: {
        ownerIdentityId: identityId,
        status: status.value,
      },

      include: {
        ownerIdentity: {
          select: {
            publicId: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  public async findByOwnerAndCategory(
    identityPublicId: AssetIdentityPublicId,
    category: AssetCategory,
  ): Promise<AssetAggregate[]> {
    const identityId = await this.findIdentityId(identityPublicId.value);

    if (identityId === null) {
      return [];
    }

    const records = await this.prisma.asset.findMany({
      where: {
        ownerIdentityId: identityId,
        category: category.value,
      },

      include: {
        ownerIdentity: {
          select: {
            publicId: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  public async findReadyByOwner(
    identityPublicId: AssetIdentityPublicId,
  ): Promise<AssetAggregate[]> {
    const identityId = await this.findIdentityId(identityPublicId.value);

    if (identityId === null) {
      return [];
    }

    const records = await this.prisma.asset.findMany({
      where: {
        ownerIdentityId: identityId,
        status: 'READY',
      },

      include: {
        ownerIdentity: {
          select: {
            publicId: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Visibility Queries
  // ===========================================================================

  public async findByVisibility(
    visibility: AssetVisibility,
  ): Promise<AssetAggregate[]> {
    const records = await this.prisma.asset.findMany({
      where: {
        visibility: visibility.value,
      },

      include: {
        ownerIdentity: {
          select: {
            publicId: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  public async findPublic(): Promise<AssetAggregate[]> {
    return this.findByVisibilityValue('PUBLIC');
  }

  public async findPrivate(): Promise<AssetAggregate[]> {
    return this.findByVisibilityValue('PRIVATE');
  }

  // ===========================================================================
  // Storage Queries
  // ===========================================================================

  public async findByStorageProvider(
    storageProvider: AssetStorageProvider,
  ): Promise<AssetAggregate[]> {
    const records = await this.prisma.asset.findMany({
      where: {
        storageProvider: storageProvider.value,
      },

      include: {
        ownerIdentity: {
          select: {
            publicId: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  public async findAll(): Promise<AssetAggregate[]> {
    const records = await this.prisma.asset.findMany({
      include: {
        ownerIdentity: {
          select: {
            publicId: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Existence
  // ===========================================================================

  public async existsByPublicId(publicId: AssetPublicId): Promise<boolean> {
    const record = await this.prisma.asset.findUnique({
      where: {
        publicId: publicId.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  public async existsById(id: UniqueEntityId): Promise<boolean> {
    const record = await this.prisma.asset.findUnique({
      where: {
        id: id.toString(),
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  public async existsByObjectKey(objectKey: AssetObjectKey): Promise<boolean> {
    const record = await this.prisma.asset.findUnique({
      where: {
        objectKey: objectKey.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  public async existsByOwnerIdentityPublicId(
    identityPublicId: AssetIdentityPublicId,
  ): Promise<boolean> {
    const identityId = await this.findIdentityId(identityPublicId.value);

    if (identityId === null) {
      return false;
    }

    const record = await this.prisma.asset.findFirst({
      where: {
        ownerIdentityId: identityId,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  public async existsByStatus(status: AssetStatus): Promise<boolean> {
    return this.existsByStatusValue(status.value);
  }

  public async existsByType(type: AssetType): Promise<boolean> {
    const record = await this.prisma.asset.findFirst({
      where: {
        type: type.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  public async existsByCategory(category: AssetCategory): Promise<boolean> {
    const record = await this.prisma.asset.findFirst({
      where: {
        category: category.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  public async existsByVisibility(
    visibility: AssetVisibility,
  ): Promise<boolean> {
    return this.existsByVisibilityValue(visibility.value);
  }

  public async existsByStorageProvider(
    storageProvider: AssetStorageProvider,
  ): Promise<boolean> {
    const record = await this.prisma.asset.findFirst({
      where: {
        storageProvider: storageProvider.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  public async existsUploading(): Promise<boolean> {
    return this.existsByStatusValue('UPLOADING');
  }

  public async existsUploaded(): Promise<boolean> {
    return this.existsByStatusValue('UPLOADED');
  }

  public async existsReady(): Promise<boolean> {
    return this.existsByStatusValue('READY');
  }

  public async existsArchived(): Promise<boolean> {
    return this.existsByStatusValue('ARCHIVED');
  }

  public async existsDeleted(): Promise<boolean> {
    return this.existsByStatusValue('DELETED');
  }

  public async existsPublic(): Promise<boolean> {
    return this.existsByVisibilityValue('PUBLIC');
  }

  public async existsPrivate(): Promise<boolean> {
    return this.existsByVisibilityValue('PRIVATE');
  }

  // ===========================================================================
  // Private — Prisma Queries
  // ===========================================================================

  private async findRecordByPublicId(
    publicId: string,
  ): Promise<PrismaAssetWithIdentity | null> {
    return this.prisma.asset.findUnique({
      where: {
        publicId,
      },

      include: {
        ownerIdentity: {
          select: {
            publicId: true,
          },
        },
      },
    });
  }

  /**
   * Resolves Identity.publicId to Identity.id for Asset persistence.
   *
   * This is persistence translation only and does not load an Identity
   * aggregate.
   */
  private async findIdentityId(
    identityPublicId: string,
  ): Promise<string | null> {
    const identity = await this.prisma.identity.findUnique({
      where: {
        publicId: identityPublicId,
      },

      select: {
        id: true,
      },
    });

    return identity?.id ?? null;
  }

  private async resolveIdentityId(
    identityPublicId: string | null,
  ): Promise<string | null> {
    if (identityPublicId === null) {
      return null;
    }

    const identityId = await this.findIdentityId(identityPublicId);

    if (identityId === null) {
      throw new Error(
        `Identity with public ID ${identityPublicId} was not found.`,
      );
    }

    return identityId;
  }

  // ===========================================================================
  // Private — Mapping
  // ===========================================================================

  private toAggregate(record: PrismaAssetWithIdentity): AssetAggregate {
    return AssetPrismaMapper.toDomain(this.toMapperRecord(record));
  }

  private toEntity(record: PrismaAssetWithIdentity): AssetEntity {
    return AssetPrismaMapper.toDomainComponent(this.toMapperRecord(record));
  }

  /**
   * Translates the relational Prisma representation into the mapper's current
   * persistence shape.
   *
   * The mapper receives Identity.publicId as ownerIdentityId because the domain
   * representation intentionally uses the public Identity reference.
   */
  private toMapperRecord(record: PrismaAssetWithIdentity): PrismaAsset {
    return {
      id: record.id,
      publicId: record.publicId,

      ownerIdentityId: record.ownerIdentity?.publicId ?? null,

      type: record.type,
      category: record.category,
      status: record.status,
      visibility: record.visibility,

      storageProvider: record.storageProvider,

      bucket: record.bucket,
      objectKey: record.objectKey,

      originalFilename: record.originalFilename,
      mimeType: record.mimeType,
      sizeBytes: record.sizeBytes,

      uploadedAt: record.uploadedAt,
      archivedAt: record.archivedAt,
      deletedAt: record.deletedAt,

      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  // ===========================================================================
  // Private — Status Helpers
  // ===========================================================================

  private async findByStatusValue(
    status: PrismaAsset['status'],
  ): Promise<AssetAggregate[]> {
    const records = await this.prisma.asset.findMany({
      where: {
        status,
      },

      include: {
        ownerIdentity: {
          select: {
            publicId: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  private async existsByStatusValue(
    status: PrismaAsset['status'],
  ): Promise<boolean> {
    const record = await this.prisma.asset.findFirst({
      where: {
        status,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  private async findByVisibilityValue(
    visibility: PrismaAsset['visibility'],
  ): Promise<AssetAggregate[]> {
    const records = await this.prisma.asset.findMany({
      where: {
        visibility,
      },

      include: {
        ownerIdentity: {
          select: {
            publicId: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  private async existsByVisibilityValue(
    visibility: PrismaAsset['visibility'],
  ): Promise<boolean> {
    const record = await this.prisma.asset.findFirst({
      where: {
        visibility,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default PrismaAssetRepository;
