// src/domains/trust/infrastructure/persistence/prisma/mappers/trust-event-prisma.mapper.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import { TrustEventEntity } from '../../../../domain/entities/trust-event.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type {
  TrustEventMetadataValue,
  TrustEventType,
} from '../../../../domain/value-objects';

import {
  ActorPublicId,
  BadgePublicId,
  BookingPublicId,
  DisputePublicId,
  JourneyPublicId,
  RatingPublicId,
  TrustEventId,
  TrustEventMetadata,
  TrustEventReason,
  TrustEventTypeValueObject,
  TrustProfileId,
} from '../../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import { Prisma } from '@prisma/client';
import type { TrustEvent } from '@prisma/client';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export class TrustEventPrismaMapper {
  // ===========================================================================
  // Prisma -> Domain
  // ===========================================================================

  static toDomain(record: TrustEvent): TrustEventEntity {
    return TrustEventEntity.rehydrate(
      {
        publicId: new TrustEventId(record.publicId),

        profileId: new TrustProfileId(record.profileId),

        type: new TrustEventTypeValueObject(record.type as TrustEventType),

        journeyPublicId:
          record.journeyPublicId !== null
            ? new JourneyPublicId(record.journeyPublicId)
            : undefined,

        bookingPublicId:
          record.bookingPublicId !== null
            ? new BookingPublicId(record.bookingPublicId)
            : undefined,

        ratingPublicId:
          record.ratingPublicId !== null
            ? new RatingPublicId(record.ratingPublicId)
            : undefined,

        badgePublicId:
          record.badgePublicId !== null
            ? new BadgePublicId(record.badgePublicId)
            : undefined,

        disputePublicId:
          record.disputePublicId !== null
            ? new DisputePublicId(record.disputePublicId)
            : undefined,

        actorPublicId:
          record.actorPublicId !== null
            ? new ActorPublicId(record.actorPublicId)
            : undefined,

        reason:
          record.reason !== null
            ? new TrustEventReason(record.reason)
            : undefined,

        metadata:
          record.metadata !== null
            ? new TrustEventMetadata(this.toDomainMetadata(record.metadata))
            : undefined,

        createdAt: record.createdAt,
      },
      new UniqueEntityId(record.id),
    );
  }

  // ===========================================================================
  // Domain -> Prisma Create
  // ===========================================================================

  static toPersistence(
    entity: TrustEventEntity,
    profileId: string,
  ): Prisma.TrustEventUncheckedCreateInput {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      profileId,

      type: entity.type.value,

      journeyPublicId: entity.journeyPublicId?.value ?? null,

      bookingPublicId: entity.bookingPublicId?.value ?? null,

      ratingPublicId: entity.ratingPublicId?.value ?? null,

      badgePublicId: entity.badgePublicId?.value ?? null,

      disputePublicId: entity.disputePublicId?.value ?? null,

      actorPublicId: entity.actorPublicId?.value ?? null,

      reason: entity.reason?.value ?? null,

      metadata:
        entity.metadata !== undefined ? entity.metadata.value : Prisma.JsonNull,

      createdAt: entity.createdAt,
    };
  }

  // ===========================================================================
  // Domain -> Prisma Update
  // ===========================================================================

  static toUpdate(
    entity: TrustEventEntity,
  ): Prisma.TrustEventUncheckedUpdateInput {
    return {
      publicId: entity.publicId.value,

      profileId: entity.profileId.value,

      type: entity.type.value,

      journeyPublicId: entity.journeyPublicId?.value ?? null,

      bookingPublicId: entity.bookingPublicId?.value ?? null,

      ratingPublicId: entity.ratingPublicId?.value ?? null,

      badgePublicId: entity.badgePublicId?.value ?? null,

      disputePublicId: entity.disputePublicId?.value ?? null,

      actorPublicId: entity.actorPublicId?.value ?? null,

      reason: entity.reason?.value ?? null,

      metadata:
        entity.metadata !== undefined ? entity.metadata.value : Prisma.JsonNull,
    };
  }

  // ===========================================================================
  // Prisma JSON -> Domain Metadata
  // ===========================================================================

  private static toDomainMetadata(
    value: Prisma.JsonValue,
  ): Record<string, TrustEventMetadataValue> {
    if (!this.isJsonObject(value)) {
      throw new Error('Invalid TrustEvent metadata: expected a JSON object.');
    }

    return value as Record<string, TrustEventMetadataValue>;
  }

  // ===========================================================================
  // JSON Object Guard
  // ===========================================================================

  private static isJsonObject(
    value: Prisma.JsonValue,
  ): value is Prisma.JsonObject {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}
