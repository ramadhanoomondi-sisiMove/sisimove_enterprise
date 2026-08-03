// src/domains/assets/infrastructure/persistence/asset-variant.persistence.mapper.ts

import type {
  AssetVariant as PrismaAssetVariant,
  AssetVariantStatus as PrismaAssetVariantStatus,
  AssetVariantType as PrismaAssetVariantType,
  StorageProvider as PrismaStorageProvider,
} from '@prisma/client';

import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import {
  AssetVariantEntity,
  type AssetVariantProps,
} from '../../domain/entities/asset-variant.entity';

import type {
  AssetVariantStatus,
  AssetVariantType,
  StorageProvider,
} from '../../domain/value-objects';

import {
  AssetId,
  AssetVariantId,
  FileMetadata,
  ImageDimensions,
  MediaMetadata,
  StorageLocation,
} from '../../domain/value-objects';

export class AssetVariantPersistenceMapper {
  static toEntity(variant: PrismaAssetVariant): AssetVariantEntity {
    const fileProps: ConstructorParameters<typeof FileMetadata>[0] = {
      mimeType: variant.mimeType,
      sizeBytes: variant.sizeBytes,
    };

    if (variant.extension !== null) {
      fileProps.extension = variant.extension;
    }

    const props: AssetVariantProps = {
      publicId: new AssetVariantId(variant.publicId),

      assetId: new AssetId(variant.assetId),

      variant: variant.variant as AssetVariantType,

      status: variant.status as AssetVariantStatus,

      isGenerated: variant.isGenerated,

      storage: new StorageLocation({
        provider: variant.storageProvider as StorageProvider,
        bucket: variant.bucket,
        objectKey: variant.objectKey,
      }),

      file: new FileMetadata(fileProps),

      createdAt: variant.createdAt,
      updatedAt: variant.updatedAt,
    };

    if (variant.width !== null && variant.height !== null) {
      props.image = new ImageDimensions({
        width: variant.width,
        height: variant.height,
      });
    }

    if (variant.durationSeconds !== null) {
      props.media = new MediaMetadata({
        durationSeconds: variant.durationSeconds,
      });
    }

    return AssetVariantEntity.rehydrate(props, new UniqueEntityId(variant.id));
  }

  static toPersistence(variant: AssetVariantEntity) {
    return {
      id: variant.id.value,
      publicId: variant.publicId.value,

      assetId: variant.assetId.value,

      variant: variant.variant as PrismaAssetVariantType,

      status: variant.status as PrismaAssetVariantStatus,

      isGenerated: variant.isGenerated,

      storageProvider: variant.storage.provider as PrismaStorageProvider,

      bucket: variant.storage.bucket,
      objectKey: variant.storage.objectKey,

      mimeType: variant.file.mimeType,
      extension: variant.file.extension ?? null,

      sizeBytes: variant.file.sizeBytes,

      width: variant.image?.width ?? null,
      height: variant.image?.height ?? null,

      durationSeconds: variant.media?.durationSeconds ?? null,

      createdAt: variant.createdAt,
      updatedAt: variant.updatedAt,
    };
  }
}
