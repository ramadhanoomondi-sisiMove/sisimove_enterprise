// src/domains/trust/infrastructure/persistence/prisma/mappers/trust-profile-prisma.mapper.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import { TrustProfileEntity } from '../../../../domain/entities/trust-profile.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import {
  MemberPublicId,
  TrustProfileId,
  TrustProfileStatusValueObject,
  TrustVerificationLevelValueObject,
  TrustRatingAverage,
  TrustRatingCount,
  CompletedJourneys,
  ProviderJourneys,
  PassengerJourneys,
  CompletedProviderJourneys,
  CompletedPassengerJourneys,
  CancelledJourneys,
  ProviderCancellations,
  PassengerCancellations,
  TrustCompletionRate,
  TrustCancellationRate,
} from '../../../../domain/value-objects';

import type {
  TrustProfileStatus,
  TrustVerificationLevel,
} from '../../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { Prisma, TrustProfile } from '@prisma/client';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export class TrustProfilePrismaMapper {
  // ===========================================================================
  // Prisma -> Domain
  // ===========================================================================

  static toDomain(record: TrustProfile): TrustProfileEntity {
    return TrustProfileEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        publicId: new TrustProfileId(record.publicId),

        memberPublicId: new MemberPublicId(record.memberPublicId),

        // ---------------------------------------------------------------------
        // Trust State
        // ---------------------------------------------------------------------

        status: new TrustProfileStatusValueObject(
          record.status as TrustProfileStatus,
        ),

        verificationLevel: new TrustVerificationLevelValueObject(
          record.verificationLevel as TrustVerificationLevel,
        ),

        // ---------------------------------------------------------------------
        // Rating Statistics
        // ---------------------------------------------------------------------

        ratingAverage: new TrustRatingAverage(record.ratingAverage.toNumber()),

        ratingCount: new TrustRatingCount(record.ratingCount),

        // ---------------------------------------------------------------------
        // Journey Statistics
        // ---------------------------------------------------------------------

        completedJourneys: new CompletedJourneys(record.completedJourneys),

        providerJourneys: new ProviderJourneys(record.providerJourneys),

        passengerJourneys: new PassengerJourneys(record.passengerJourneys),

        completedProviderJourneys: new CompletedProviderJourneys(
          record.completedProviderJourneys,
        ),

        completedPassengerJourneys: new CompletedPassengerJourneys(
          record.completedPassengerJourneys,
        ),

        cancelledJourneys: new CancelledJourneys(record.cancelledJourneys),

        providerCancellations: new ProviderCancellations(
          record.providerCancellations,
        ),

        passengerCancellations: new PassengerCancellations(
          record.passengerCancellations,
        ),

        // ---------------------------------------------------------------------
        // Rates
        // ---------------------------------------------------------------------

        completionRate: new TrustCompletionRate(
          record.completionRate.toNumber(),
        ),

        cancellationRate: new TrustCancellationRate(
          record.cancellationRate.toNumber(),
        ),

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },

      new UniqueEntityId(record.id),
    );
  }

  // ===========================================================================
  // Domain -> Prisma Create
  // ===========================================================================

  static toPersistence(
    entity: TrustProfileEntity,
  ): Prisma.TrustProfileUncheckedCreateInput {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      id: entity.id.toString(),

      publicId: entity.publicId.value,

      memberPublicId: entity.memberPublicId.value,

      // -----------------------------------------------------------------------
      // Trust State
      // -----------------------------------------------------------------------

      status: entity.status.value,

      verificationLevel: entity.verificationLevel.value,

      // -----------------------------------------------------------------------
      // Rating Statistics
      // -----------------------------------------------------------------------

      ratingAverage: entity.ratingAverage.value,

      ratingCount: entity.ratingCount.value,

      // -----------------------------------------------------------------------
      // Journey Statistics
      // -----------------------------------------------------------------------

      completedJourneys: entity.completedJourneys.value,

      providerJourneys: entity.providerJourneys.value,

      passengerJourneys: entity.passengerJourneys.value,

      completedProviderJourneys: entity.completedProviderJourneys.value,

      completedPassengerJourneys: entity.completedPassengerJourneys.value,

      cancelledJourneys: entity.cancelledJourneys.value,

      providerCancellations: entity.providerCancellations.value,

      passengerCancellations: entity.passengerCancellations.value,

      // -----------------------------------------------------------------------
      // Rates
      // -----------------------------------------------------------------------

      completionRate: entity.completionRate.value,

      cancellationRate: entity.cancellationRate.value,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Domain -> Prisma Update
  // ===========================================================================

  static toUpdate(
    entity: TrustProfileEntity,
  ): Prisma.TrustProfileUncheckedUpdateInput {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: entity.publicId.value,

      memberPublicId: entity.memberPublicId.value,

      // -----------------------------------------------------------------------
      // Trust State
      // -----------------------------------------------------------------------

      status: entity.status.value,

      verificationLevel: entity.verificationLevel.value,

      // -----------------------------------------------------------------------
      // Rating Statistics
      // -----------------------------------------------------------------------

      ratingAverage: entity.ratingAverage.value,

      ratingCount: entity.ratingCount.value,

      // -----------------------------------------------------------------------
      // Journey Statistics
      // -----------------------------------------------------------------------

      completedJourneys: entity.completedJourneys.value,

      providerJourneys: entity.providerJourneys.value,

      passengerJourneys: entity.passengerJourneys.value,

      completedProviderJourneys: entity.completedProviderJourneys.value,

      completedPassengerJourneys: entity.completedPassengerJourneys.value,

      cancelledJourneys: entity.cancelledJourneys.value,

      providerCancellations: entity.providerCancellations.value,

      passengerCancellations: entity.passengerCancellations.value,

      // -----------------------------------------------------------------------
      // Rates
      // -----------------------------------------------------------------------

      completionRate: entity.completionRate.value,

      cancellationRate: entity.cancellationRate.value,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      updatedAt: entity.updatedAt,
    };
  }
}
