// src/domains/social/infrastructure/persistence/prisma/mappers/traveller-profile-corridor-prisma.mapper.ts

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

import { TravellerProfileCorridorEntity } from '../../../../domain/entities/traveller-profile-corridor.entity';

import {
  CorridorKey,
  TravellerProfileCorridorId,
  TravellerProfileId,
} from '../../../../domain/value-objects';

import type { Prisma, TravellerProfileCorridor } from '@prisma/client';

export class TravellerProfileCorridorPrismaMapper {
  // ---------------------------------------------------------------------------
  // Prisma -> Domain
  // ---------------------------------------------------------------------------

  static toDomain(
    record: TravellerProfileCorridor,
  ): TravellerProfileCorridorEntity {
    return TravellerProfileCorridorEntity.rehydrate(
      {
        publicId: new TravellerProfileCorridorId(record.publicId),

        profileId: new TravellerProfileId(record.profileId),

        originName: record.originName,

        destinationName: record.destinationName,

        originLatitude: Number(record.originLatitude),

        originLongitude: Number(record.originLongitude),

        destinationLatitude: Number(record.destinationLatitude),

        destinationLongitude: Number(record.destinationLongitude),

        corridorKey: new CorridorKey(record.corridorKey),

        isPrimary: record.isPrimary,

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },
      new UniqueEntityId(record.id),
    );
  }

  // ---------------------------------------------------------------------------
  // Domain -> Prisma Create
  // ---------------------------------------------------------------------------

  static toPersistence(
    entity: TravellerProfileCorridorEntity,
  ): Prisma.TravellerProfileCorridorUncheckedCreateInput {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      profileId: entity.profileId.value,

      originName: entity.originName,

      destinationName: entity.destinationName,

      originLatitude: entity.originLatitude,

      originLongitude: entity.originLongitude,

      destinationLatitude: entity.destinationLatitude,

      destinationLongitude: entity.destinationLongitude,

      corridorKey: entity.corridorKey.value,

      isPrimary: entity.isPrimary,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ---------------------------------------------------------------------------
  // Domain -> Prisma Update
  // ---------------------------------------------------------------------------

  static toUpdate(
    entity: TravellerProfileCorridorEntity,
  ): Prisma.TravellerProfileCorridorUncheckedUpdateInput {
    return {
      publicId: entity.publicId.value,

      profileId: entity.profileId.value,

      originName: entity.originName,

      destinationName: entity.destinationName,

      originLatitude: entity.originLatitude,

      originLongitude: entity.originLongitude,

      destinationLatitude: entity.destinationLatitude,

      destinationLongitude: entity.destinationLongitude,

      corridorKey: entity.corridorKey.value,

      isPrimary: entity.isPrimary,

      updatedAt: entity.updatedAt,
    };
  }
}
