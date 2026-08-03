// src/domains/assets/infrastructure/persistence/asset.aggregate.persistence.mapper.ts

import type {
  Asset as PrismaAsset,
  AssetModeration as PrismaAssetModeration,
  AssetProcessing as PrismaAssetProcessing,
  AssetReference as PrismaAssetReference,
  AssetScan as PrismaAssetScan,
  AssetVariant as PrismaAssetVariant,
} from '@prisma/client';

import { AssetAggregate } from '../../domain/aggregates/asset.aggregate';

import { AssetPersistenceMapper } from './asset.persistence.mapper';
import { AssetModerationPersistenceMapper } from './asset-moderation.persistence.mapper';
import { AssetProcessingPersistenceMapper } from './asset-processing.persistence.mapper';
import { AssetReferencePersistenceMapper } from './asset-reference.persistence.mapper';
import { AssetScanPersistenceMapper } from './asset-scan.persistence.mapper';
import { AssetVariantPersistenceMapper } from './asset-variant.persistence.mapper';

export class AssetAggregatePersistenceMapper {
  static toDomain(params: {
    asset: PrismaAsset;
    variants?: PrismaAssetVariant[];
    references?: PrismaAssetReference[];
    processings?: PrismaAssetProcessing[];
    scans?: PrismaAssetScan[];
    moderations?: PrismaAssetModeration[];
  }): AssetAggregate {
    return AssetAggregate.rehydrate(
      AssetPersistenceMapper.toEntity(params.asset),

      (params.variants ?? []).map((variant) =>
        AssetVariantPersistenceMapper.toEntity(variant),
      ),

      (params.references ?? []).map((reference) =>
        AssetReferencePersistenceMapper.toEntity(reference),
      ),

      (params.processings ?? []).map((processing) =>
        AssetProcessingPersistenceMapper.toEntity(processing),
      ),

      (params.scans ?? []).map((scan) =>
        AssetScanPersistenceMapper.toEntity(scan),
      ),

      (params.moderations ?? []).map((moderation) =>
        AssetModerationPersistenceMapper.toEntity(moderation),
      ),
    );
  }
}
