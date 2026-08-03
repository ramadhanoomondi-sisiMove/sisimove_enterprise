// src/domains/assets/infrastructure/persistence/asset-processing.persistence.mapper.ts

import { Prisma } from '@prisma/client';
import type { AssetProcessing as PrismaAssetProcessing } from '@prisma/client';

import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import {
  AssetProcessingEntity,
  type AssetProcessingProps,
} from '../../domain/entities/asset-processing.entity';

import type {
  AssetProcessingOperation,
  AssetProcessingStatus,
  AssetProcessor,
  JsonValue,
} from '../../domain/value-objects';

import {
  AssetId,
  AssetProcessingFailureReason,
  AssetProcessingId,
} from '../../domain/value-objects';

export class AssetProcessingPersistenceMapper {
  // ---------------------------------------------------------------------------
  // Entity
  // ---------------------------------------------------------------------------

  static toEntity(processing: PrismaAssetProcessing): AssetProcessingEntity {
    const props: AssetProcessingProps = {
      publicId: new AssetProcessingId(processing.publicId),

      assetId: new AssetId(processing.assetId),

      operation: processing.operation as AssetProcessingOperation,

      status: processing.status as AssetProcessingStatus,

      processor: processing.processor as AssetProcessor | undefined,

      startedAt: processing.startedAt ?? undefined,
      completedAt: processing.completedAt ?? undefined,
      failedAt: processing.failedAt ?? undefined,

      failureReason: processing.failureReason
        ? new AssetProcessingFailureReason(processing.failureReason)
        : undefined,

      metadata: (processing.metadata as JsonValue | null) ?? undefined,

      createdAt: processing.createdAt,
      updatedAt: processing.updatedAt,
    };

    return AssetProcessingEntity.rehydrate(
      props,
      new UniqueEntityId(processing.id),
    );
  }

  // ---------------------------------------------------------------------------
  // Persistence
  // ---------------------------------------------------------------------------

  static toCreatePersistence(
    processing: AssetProcessingEntity,
  ): Prisma.AssetProcessingCreateManyInput {
    return this.toPersistence(processing);
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private static toPersistence(
    processing: AssetProcessingEntity,
  ): Prisma.AssetProcessingCreateManyInput {
    return {
      id: processing.id.value,
      publicId: processing.publicId.value,

      assetId: processing.assetId.value,

      operation: processing.operation,
      status: processing.status,

      processor: processing.processor ?? null,

      startedAt: processing.startedAt ?? null,
      completedAt: processing.completedAt ?? null,
      failedAt: processing.failedAt ?? null,

      failureReason: processing.failureReason?.value ?? null,

      metadata:
        processing.metadata === undefined
          ? Prisma.JsonNull
          : (processing.metadata as Prisma.InputJsonValue),

      createdAt: processing.createdAt,
      updatedAt: processing.updatedAt,
    };
  }
}
