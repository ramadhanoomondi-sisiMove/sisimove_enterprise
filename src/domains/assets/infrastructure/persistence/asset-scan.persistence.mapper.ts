// src/domains/assets/infrastructure/persistence/asset-scan.persistence.mapper.ts

import { Prisma } from '@prisma/client';
import type { AssetScan as PrismaAssetScan } from '@prisma/client';

import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import {
  AssetScanEntity,
  type AssetScanProps,
} from '../../domain/entities/asset-scan.entity';

import type {
  AssetScanEngine,
  AssetScanStatus,
  JsonValue,
} from '../../domain/value-objects';

import {
  AssetId,
  AssetScanId,
  AssetThreatName,
} from '../../domain/value-objects';

export class AssetScanPersistenceMapper {
  // ---------------------------------------------------------------------------
  // Entity
  // ---------------------------------------------------------------------------

  static toEntity(scan: PrismaAssetScan): AssetScanEntity {
    const props: AssetScanProps = {
      publicId: new AssetScanId(scan.publicId),

      assetId: new AssetId(scan.assetId),

      engine: scan.engine as AssetScanEngine,
      status: scan.status as AssetScanStatus,

      scannedAt: scan.scannedAt ?? undefined,

      threatName: scan.threatName
        ? new AssetThreatName(scan.threatName)
        : undefined,

      metadata: (scan.metadata as JsonValue | null) ?? undefined,

      createdAt: scan.createdAt,
      updatedAt: scan.updatedAt,
    };

    return AssetScanEntity.rehydrate(props, new UniqueEntityId(scan.id));
  }

  // ---------------------------------------------------------------------------
  // Persistence
  // ---------------------------------------------------------------------------

  static toCreatePersistence(
    scan: AssetScanEntity,
  ): Prisma.AssetScanCreateManyInput {
    return this.toPersistence(scan);
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private static toPersistence(
    scan: AssetScanEntity,
  ): Prisma.AssetScanCreateManyInput {
    return {
      id: scan.id.value,
      publicId: scan.publicId.value,

      assetId: scan.assetId.value,

      engine: scan.engine,
      status: scan.status,

      scannedAt: scan.scannedAt ?? null,

      threatName: scan.threatName?.value ?? null,

      metadata:
        scan.metadata === undefined
          ? Prisma.JsonNull
          : (scan.metadata as Prisma.InputJsonValue),

      createdAt: scan.createdAt,
      updatedAt: scan.updatedAt,
    };
  }
}
