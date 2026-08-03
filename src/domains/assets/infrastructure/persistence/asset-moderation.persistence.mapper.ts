// src/domains/assets/infrastructure/persistence/asset-moderation.persistence.mapper.ts

import { Prisma } from '@prisma/client';
import type { AssetModeration as PrismaAssetModeration } from '@prisma/client';

import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import {
  AssetModerationEntity,
  type AssetModerationProps,
} from '../../domain/entities/asset-moderation.entity';

import type {
  AssetModerationStatus,
  AssetModerationType,
  JsonValue,
} from '../../domain/value-objects';

import {
  AssetId,
  AssetModerationId,
  AssetModeratorId,
  ModerationConfidence,
  ModerationReason,
} from '../../domain/value-objects';

export class AssetModerationPersistenceMapper {
  // ---------------------------------------------------------------------------
  // Entity
  // ---------------------------------------------------------------------------

  static toEntity(moderation: PrismaAssetModeration): AssetModerationEntity {
    const props: AssetModerationProps = {
      publicId: new AssetModerationId(moderation.publicId),

      assetId: new AssetId(moderation.assetId),

      type: moderation.type as AssetModerationType,
      status: moderation.status as AssetModerationStatus,

      moderatorId: moderation.moderatorIdentityId
        ? new AssetModeratorId(moderation.moderatorIdentityId)
        : undefined,

      confidence:
        moderation.confidence !== null
          ? new ModerationConfidence(moderation.confidence)
          : undefined,

      reason: moderation.reason
        ? new ModerationReason(moderation.reason)
        : undefined,

      metadata: (moderation.metadata as JsonValue | null) ?? undefined,

      moderatedAt: moderation.moderatedAt ?? undefined,

      createdAt: moderation.createdAt,
      updatedAt: moderation.updatedAt,
    };

    return AssetModerationEntity.rehydrate(
      props,
      new UniqueEntityId(moderation.id),
    );
  }

  // ---------------------------------------------------------------------------
  // Persistence
  // ---------------------------------------------------------------------------

  static toCreatePersistence(
    moderation: AssetModerationEntity,
  ): Prisma.AssetModerationCreateManyInput {
    return this.toPersistence(moderation);
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private static toPersistence(
    moderation: AssetModerationEntity,
  ): Prisma.AssetModerationCreateManyInput {
    return {
      id: moderation.id.value,
      publicId: moderation.publicId.value,

      assetId: moderation.assetId.value,

      type: moderation.type,
      status: moderation.status,

      moderatorIdentityId: moderation.moderatorId?.value ?? null,

      confidence: moderation.confidence?.value ?? null,

      reason: moderation.reason?.value ?? null,

      metadata:
        moderation.metadata === undefined
          ? Prisma.JsonNull
          : (moderation.metadata as Prisma.InputJsonValue),

      moderatedAt: moderation.moderatedAt ?? null,

      createdAt: moderation.createdAt,
      updatedAt: moderation.updatedAt,
    };
  }
}
