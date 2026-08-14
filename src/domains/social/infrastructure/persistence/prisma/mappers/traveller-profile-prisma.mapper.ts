// src/domains/social/infrastructure/persistence/prisma/mappers/traveller-profile-prisma.mapper.ts

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

import { TravellerProfileEntity } from '../../../../domain/entities/traveller-profile.entity';

import type {
  TravellerProfileStatus,
  TravellerProfileVisibility,
} from '../../../../domain/value-objects';
import {
  AvatarAssetPublicId,
  CountryCode,
  MemberPublicId,
  TravellerBio,
  TravellerHandle,
  TravellerProfilePublicId,
  TravellerProfileStatusValueObject,
  TravellerProfileVisibilityValueObject,
} from '../../../../domain/value-objects';

import type { Prisma, TravellerProfile } from '@prisma/client';

export class TravellerProfilePrismaMapper {
  // ---------------------------------------------------------------------------
  // Prisma -> Domain
  // ---------------------------------------------------------------------------

  static toDomain(record: TravellerProfile): TravellerProfileEntity {
    return TravellerProfileEntity.rehydrate(
      {
        publicId: new TravellerProfilePublicId(record.publicId),

        memberPublicId: new MemberPublicId(record.memberPublicId),

        handle: new TravellerHandle(record.handle),

        bio: new TravellerBio(record.bio),

        avatarAssetPublicId:
          record.avatarAssetPublicId !== null
            ? new AvatarAssetPublicId(record.avatarAssetPublicId)
            : undefined,

        countryCode: new CountryCode(record.countryCode),

        status: new TravellerProfileStatusValueObject(
          record.status as TravellerProfileStatus,
        ),

        visibility: new TravellerProfileVisibilityValueObject(
          record.visibility as TravellerProfileVisibility,
        ),

        // ---------------------------------------------------------------------
        // Materialized journey statistics
        // ---------------------------------------------------------------------

        totalJourneys: record.totalJourneys,
        completedJourneys: record.completedJourneys,

        providerJourneys: record.providerJourneys,
        passengerJourneys: record.passengerJourneys,

        completedProviderJourneys: record.completedProviderJourneys,

        completedPassengerJourneys: record.completedPassengerJourneys,

        // ---------------------------------------------------------------------
        // Audit timestamps
        // ---------------------------------------------------------------------

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
    entity: TravellerProfileEntity,
  ): Prisma.TravellerProfileUncheckedCreateInput {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      memberPublicId: entity.memberPublicId.value,

      handle: entity.handle.value,

      bio: entity.bio.value,

      avatarAssetPublicId: entity.avatarAssetPublicId?.value ?? null,

      countryCode: entity.countryCode.value,

      status: entity.status.value,

      visibility: entity.visibility.value,

      // -----------------------------------------------------------------------
      // Materialized journey statistics
      // -----------------------------------------------------------------------

      totalJourneys: entity.totalJourneys,

      completedJourneys: entity.completedJourneys,

      providerJourneys: entity.providerJourneys,

      passengerJourneys: entity.passengerJourneys,

      completedProviderJourneys: entity.completedProviderJourneys,

      completedPassengerJourneys: entity.completedPassengerJourneys,

      // -----------------------------------------------------------------------
      // Audit timestamps
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ---------------------------------------------------------------------------
  // Domain -> Prisma Update
  // ---------------------------------------------------------------------------

  static toUpdate(
    entity: TravellerProfileEntity,
  ): Prisma.TravellerProfileUncheckedUpdateInput {
    return {
      publicId: entity.publicId.value,

      memberPublicId: entity.memberPublicId.value,

      handle: entity.handle.value,

      bio: entity.bio.value,

      avatarAssetPublicId: entity.avatarAssetPublicId?.value ?? null,

      countryCode: entity.countryCode.value,

      status: entity.status.value,

      visibility: entity.visibility.value,

      // -----------------------------------------------------------------------
      // Materialized journey statistics
      // -----------------------------------------------------------------------

      totalJourneys: entity.totalJourneys,

      completedJourneys: entity.completedJourneys,

      providerJourneys: entity.providerJourneys,

      passengerJourneys: entity.passengerJourneys,

      completedProviderJourneys: entity.completedProviderJourneys,

      completedPassengerJourneys: entity.completedPassengerJourneys,

      // -----------------------------------------------------------------------
      // Audit timestamp
      // -----------------------------------------------------------------------

      updatedAt: entity.updatedAt,
    };
  }
}
