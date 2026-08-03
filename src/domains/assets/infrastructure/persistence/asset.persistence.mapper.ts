// src/domains/assets/infrastructure/persistence/asset.persistence.mapper.ts

import { Prisma } from '@prisma/client';
import type { Asset as PrismaAsset } from '@prisma/client';

import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import { AssetEntity } from '../../domain/entities/asset.entity';

import type {
  AssetCategory,
  AssetStatus,
  AssetType,
  AssetVisibility,
  ChecksumAlgorithm,
  JsonValue,
  StorageProvider,
} from '../../domain/value-objects';

import { AssetId, AssetOwnerIdentityId } from '../../domain/value-objects';

export class AssetPersistenceMapper {
  // ---------------------------------------------------------------------------
  // Entity
  // ---------------------------------------------------------------------------

  static toEntity(asset: PrismaAsset): AssetEntity {
    return AssetEntity.rehydrate(
      {
        publicId: new AssetId(asset.publicId),

        ownerIdentityId: asset.ownerIdentityId
          ? new AssetOwnerIdentityId(asset.ownerIdentityId)
          : undefined,

        type: asset.type as AssetType,
        category: asset.category as AssetCategory,
        status: asset.status as AssetStatus,
        visibility: asset.visibility as AssetVisibility,

        storageProvider: asset.storageProvider as StorageProvider,

        bucket: asset.bucket,
        objectKey: asset.objectKey,

        originalFilename: asset.originalFilename ?? undefined,
        storedFilename: asset.storedFilename ?? undefined,

        mimeType: asset.mimeType,
        extension: asset.extension ?? undefined,

        sizeBytes: asset.sizeBytes,

        checksumAlgorithm:
          (asset.checksumAlgorithm as ChecksumAlgorithm | null) ?? undefined,

        checksum: asset.checksum ?? undefined,

        width: asset.width ?? undefined,
        height: asset.height ?? undefined,
        colorDepth: asset.colorDepth ?? undefined,

        durationSeconds: asset.durationSeconds ?? undefined,
        bitrate: asset.bitrate ?? undefined,
        frameRate: asset.frameRate ?? undefined,

        blurHash: asset.blurHash ?? undefined,

        metadata: (asset.metadata as JsonValue | null) ?? undefined,

        uploadedAt: asset.uploadedAt ?? undefined,

        archivedAt: asset.archivedAt ?? undefined,
        deletedAt: asset.deletedAt ?? undefined,

        createdAt: asset.createdAt,
        updatedAt: asset.updatedAt,
      },
      new UniqueEntityId(asset.id),
    );
  }

  // ---------------------------------------------------------------------------
  // Persistence
  // ---------------------------------------------------------------------------

  static toCreatePersistence(
    asset: AssetEntity,
  ): Prisma.AssetUncheckedCreateInput {
    return this.toPersistence(asset);
  }

  static toUpdatePersistence(
    asset: AssetEntity,
  ): Prisma.AssetUncheckedUpdateInput {
    return this.toPersistence(asset);
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private static toPersistence(asset: AssetEntity) {
    return {
      id: asset.id.value,
      publicId: asset.publicId.value,

      ownerIdentityId: asset.ownerIdentityId?.value ?? null,

      type: asset.type,
      category: asset.category,
      status: asset.status,
      visibility: asset.visibility,

      storageProvider: asset.storageProvider,

      bucket: asset.bucket,
      objectKey: asset.objectKey,

      originalFilename: asset.originalFilename ?? null,
      storedFilename: asset.storedFilename ?? null,

      mimeType: asset.mimeType,
      extension: asset.extension ?? null,

      sizeBytes: asset.sizeBytes,

      checksumAlgorithm: asset.checksumAlgorithm ?? null,
      checksum: asset.checksum ?? null,

      width: asset.width ?? null,
      height: asset.height ?? null,
      colorDepth: asset.colorDepth ?? null,

      durationSeconds: asset.durationSeconds ?? null,
      bitrate: asset.bitrate ?? null,
      frameRate: asset.frameRate ?? null,

      blurHash: asset.blurHash ?? null,

      metadata: this.toPrismaJson(asset.metadata),

      uploadedAt: asset.uploadedAt ?? null,

      archivedAt: asset.archivedAt ?? null,
      deletedAt: asset.deletedAt ?? null,

      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt,
    };
  }

  private static toPrismaJson(
    value: JsonValue | undefined,
  ): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput {
    return value === undefined
      ? Prisma.JsonNull
      : (value as Prisma.InputJsonValue);
  }
}
