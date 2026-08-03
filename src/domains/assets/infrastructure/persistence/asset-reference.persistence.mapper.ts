// src/domains/assets/infrastructure/persistence/asset-reference.persistence.mapper.ts

import type {
  AssetReference as PrismaAssetReference,
  AssetReferenceField as PrismaAssetReferenceField,
  AssetResourceType as PrismaAssetResourceType,
} from '@prisma/client';

import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import { AssetReferenceEntity } from '../../domain/entities/asset-reference.entity';

import type {
  AssetReferenceField,
  AssetResourceType,
} from '../../domain/value-objects';

import { AssetId, AssetReferenceId } from '../../domain/value-objects';

export class AssetReferencePersistenceMapper {
  static toEntity(reference: PrismaAssetReference): AssetReferenceEntity {
    return AssetReferenceEntity.rehydrate(
      {
        publicId: new AssetReferenceId(reference.publicId),

        assetId: new AssetId(reference.assetId),

        resourceType: reference.resourceType as AssetResourceType,

        resourcePublicId: reference.resourcePublicId,

        referenceField: reference.referenceField as AssetReferenceField,

        createdAt: reference.createdAt,
      },
      new UniqueEntityId(reference.id),
    );
  }

  static toPersistence(reference: AssetReferenceEntity) {
    return {
      id: reference.id.value,
      publicId: reference.publicId.value,

      assetId: reference.assetId.value,

      resourceType: reference.resourceType as PrismaAssetResourceType,

      resourcePublicId: reference.resourcePublicId,

      referenceField: reference.referenceField as PrismaAssetReferenceField,

      createdAt: reference.createdAt,
    };
  }
}
