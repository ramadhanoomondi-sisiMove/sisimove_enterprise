// src/domains/social/infrastructure/persistence/prisma/mappers/traveller-profile-preferences-prisma.mapper.ts

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

import { TravellerProfilePreferencesEntity } from '../../../../domain/entities/traveller-profile-preferences.entity';

import {
  TravellerProfileId,
  TravellerProfilePreferencesId,
} from '../../../../domain/value-objects';

import type { Prisma, TravellerProfilePreferences } from '@prisma/client';

export class TravellerProfilePreferencesPrismaMapper {
  // ---------------------------------------------------------------------------
  // Prisma -> Domain
  // ---------------------------------------------------------------------------

  static toDomain(
    record: TravellerProfilePreferences,
  ): TravellerProfilePreferencesEntity {
    return TravellerProfilePreferencesEntity.rehydrate(
      {
        publicId: new TravellerProfilePreferencesId(record.publicId),

        profileId: new TravellerProfileId(record.profileId),

        showJourneyHistory: record.showJourneyHistory,

        showJourneyStatistics: record.showJourneyStatistics,

        allowJourneyInvites: record.allowJourneyInvites,

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
    entity: TravellerProfilePreferencesEntity,
  ): Prisma.TravellerProfilePreferencesUncheckedCreateInput {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      profileId: entity.profileId.value,

      showJourneyHistory: entity.showJourneyHistory,

      showJourneyStatistics: entity.showJourneyStatistics,

      allowJourneyInvites: entity.allowJourneyInvites,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ---------------------------------------------------------------------------
  // Domain -> Prisma Update
  // ---------------------------------------------------------------------------

  static toUpdate(
    entity: TravellerProfilePreferencesEntity,
  ): Prisma.TravellerProfilePreferencesUncheckedUpdateInput {
    return {
      publicId: entity.publicId.value,

      profileId: entity.profileId.value,

      showJourneyHistory: entity.showJourneyHistory,

      showJourneyStatistics: entity.showJourneyStatistics,

      allowJourneyInvites: entity.allowJourneyInvites,

      updatedAt: entity.updatedAt,
    };
  }
}
