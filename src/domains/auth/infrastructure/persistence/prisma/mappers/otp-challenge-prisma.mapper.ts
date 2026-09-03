// -----------------------------------------------------------------------------
// OTP Challenge — Prisma Mapper
// -----------------------------------------------------------------------------
//
// Maps the OtpChallenge aggregate:
//
// OtpChallengeAggregate
// └── OtpChallengeEntity
//
// Persistence:
//
// OtpChallenge
//
// OtpChallenge is an independent aggregate responsible for the lifecycle of
// one OTP verification challenge associated with an Identity.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Rehydrate OtpChallengeEntity from Prisma persistence.
// - Rehydrate OtpChallengeAggregate from Prisma persistence.
// - Serialize OtpChallengeEntity into Prisma persistence.
// - Serialize OtpChallengeAggregate into persistence.
// - Preserve domain value-object boundaries.
// - Preserve nullable lifecycle timestamps.
//
// -----------------------------------------------------------------------------
//
// Security:
//
// The mapper persists security-sensitive OTP material because the aggregate
// requires it for verification.
//
// However, the mapper:
//
// - does not generate OTPs;
// - does not hash OTPs;
// - does not compare OTPs;
// - does not publish OTP material;
// - does not create domain events;
// - does not send notifications.
//
// Raw OTP values must never reach this mapper.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { OtpChallenge as PrismaOtpChallenge } from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { OtpChallengeAggregate } from '../../../../domain/aggregates/otp-challenge.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { OtpChallengeEntity } from '../../../../domain/entities/otp-challenge.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  OtpChallengePublicId,
  OtpChallengeIdentityPublicId,
  OtpChallengePurpose,
  OtpChallengeStatus,
  OtpChallengeDestination,
  OtpChallengeHash,
  OtpChallengeAttempts,
  OtpChallengeMaxAttempts,
  OtpChallengeExpiresAt,
  OtpChallengeVerifiedAt,
} from '../../../../domain/value-objects';

// =============================================================================
// Persistence Types
// =============================================================================

/**
 * Persistence representation of the OTP Challenge aggregate.
 *
 * OtpChallenge is a single-entity aggregate, therefore no child collection
 * is required in the persistence structure.
 */
export interface OtpChallengePersistence {
  otpChallenge: ReturnType<
    typeof OtpChallengePrismaMapper.otpChallengeToPersistence
  >;
}

// =============================================================================
// Mapper
// =============================================================================

export class OtpChallengePrismaMapper {
  // ===========================================================================
  // Prisma → Domain Aggregate
  // ===========================================================================

  /**
   * Rehydrates a complete OtpChallenge aggregate from a Prisma
   * OtpChallenge record.
   *
   * Rehydration does not emit domain events.
   */
  public static toDomain(record: PrismaOtpChallenge): OtpChallengeAggregate {
    return OtpChallengeAggregate.rehydrate(this.otpChallengeToDomain(record));
  }

  // ===========================================================================
  // Prisma → Domain Entity
  // ===========================================================================

  /**
   * Rehydrates an OtpChallengeEntity from a persisted Prisma
   * OtpChallenge record.
   *
   * Mapping:
   *
   * Prisma id
   *     ↓
   * UniqueEntityId
   *
   * Prisma publicId
   *     ↓
   * OtpChallengePublicId
   *
   * Prisma identityPublicId
   *     ↓
   * OtpChallengeIdentityPublicId
   *
   * Prisma purpose
   *     ↓
   * OtpChallengePurpose
   *
   * Prisma status
   *     ↓
   * OtpChallengeStatus
   *
   * Prisma destination
   *     ↓
   * OtpChallengeDestination
   *
   * Prisma otpHash
   *     ↓
   * OtpChallengeOtpHash
   *
   * Prisma attempts
   *     ↓
   * OtpChallengeAttempts
   *
   * Prisma maxAttempts
   *     ↓
   * OtpChallengeMaxAttempts
   *
   * Prisma expiresAt
   *     ↓
   * OtpChallengeExpiresAt
   *
   * Prisma verifiedAt
   *     ↓
   * OtpChallengeVerifiedAt | undefined
   */
  public static otpChallengeToDomain(
    record: PrismaOtpChallenge,
  ): OtpChallengeEntity {
    if (record === undefined) {
      throw new Error('OTP Challenge Prisma record is required.');
    }

    const publicId = new OtpChallengePublicId(record.publicId);

    return OtpChallengeEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        identityPublicId: new OtpChallengeIdentityPublicId(
          record.identityPublicId,
        ),

        // ---------------------------------------------------------------------
        // Purpose
        // ---------------------------------------------------------------------

        purpose: OtpChallengePurpose.create(record.purpose),

        // ---------------------------------------------------------------------
        // Status
        // ---------------------------------------------------------------------

        status: OtpChallengeStatus.create(record.status),

        // ---------------------------------------------------------------------
        // Destination
        // ---------------------------------------------------------------------

        destination: OtpChallengeDestination.create(record.destination),

        // ---------------------------------------------------------------------
        // OTP Credential
        // ---------------------------------------------------------------------
        //
        // The persisted value is already a hash.
        // No hashing or plaintext OTP processing occurs here.
        //

        otpHash: OtpChallengeHash.create(record.otpHash),

        // ---------------------------------------------------------------------
        // Attempts
        // ---------------------------------------------------------------------

        attempts: OtpChallengeAttempts.create(record.attempts),

        maxAttempts: OtpChallengeMaxAttempts.create(record.maxAttempts),

        // ---------------------------------------------------------------------
        // Expiration
        // ---------------------------------------------------------------------

        expiresAt: OtpChallengeExpiresAt.create(record.expiresAt),

        // ---------------------------------------------------------------------
        // Verification Lifecycle
        // ---------------------------------------------------------------------

        verifiedAt:
          record.verifiedAt !== null
            ? OtpChallengeVerifiedAt.create(record.verifiedAt)
            : undefined,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },

      new UniqueEntityId(record.id),

      publicId,
    );
  }

  // ===========================================================================
  // Domain Entity → Prisma Persistence
  // ===========================================================================

  /**
   * Maps OtpChallengeEntity into its Prisma persistence shape.
   *
   * Domain value objects are serialized into primitive persistence values.
   *
   * Undefined verifiedAt is persisted as null.
   */
  public static otpChallengeToPersistence(entity: OtpChallengeEntity): {
    id: string;
    publicId: string;
    identityPublicId: string;
    purpose: PrismaOtpChallenge['purpose'];
    status: PrismaOtpChallenge['status'];
    destination: string;
    otpHash: string;
    attempts: number;
    maxAttempts: number;
    expiresAt: Date;
    verifiedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  } {
    if (entity === undefined) {
      throw new Error('OTP Challenge entity is required.');
    }

    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      id: entity.id.toString(),

      publicId: entity.publicId.value,

      identityPublicId: entity.identityPublicId.value,

      // -----------------------------------------------------------------------
      // Purpose
      // -----------------------------------------------------------------------

      purpose: entity.purpose.value,

      // -----------------------------------------------------------------------
      // Status
      // -----------------------------------------------------------------------

      status: entity.status.value,

      // -----------------------------------------------------------------------
      // Destination
      // -----------------------------------------------------------------------

      destination: entity.destination.value,

      // -----------------------------------------------------------------------
      // OTP Credential
      // -----------------------------------------------------------------------

      otpHash: entity.otpHash.value,

      // -----------------------------------------------------------------------
      // Attempts
      // -----------------------------------------------------------------------

      attempts: entity.attempts.value,

      maxAttempts: entity.maxAttempts.value,

      // -----------------------------------------------------------------------
      // Expiration
      // -----------------------------------------------------------------------

      expiresAt: entity.expiresAt.value,

      // -----------------------------------------------------------------------
      // Verification Lifecycle
      // -----------------------------------------------------------------------

      verifiedAt: entity.verifiedAt?.value ?? null,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Aggregate → Persistence
  // ===========================================================================

  /**
   * Converts the complete OtpChallenge aggregate into its persistence
   * structure.
   *
   * OtpChallenge is a single-entity aggregate, so the aggregate persistence
   * structure contains only the OtpChallenge root record.
   */
  public static toPersistence(
    aggregate: OtpChallengeAggregate,
  ): OtpChallengePersistence {
    if (aggregate === undefined) {
      throw new Error('OTP Challenge aggregate is required.');
    }

    return {
      otpChallenge: this.otpChallengeToPersistence(aggregate.otpChallenge),
    };
  }

  // ===========================================================================
  // Component Mapping
  // ===========================================================================

  /**
   * Maps a Prisma OtpChallenge record directly into OtpChallengeEntity.
   *
   * Useful for repository-level component operations.
   */
  public static toOtpChallengeDomain(
    record: PrismaOtpChallenge,
  ): OtpChallengeEntity {
    return this.otpChallengeToDomain(record);
  }

  /**
   * Maps a Prisma OtpChallenge record into OtpChallengeAggregate.
   *
   * Equivalent to toDomain().
   */
  public static toOtpChallengeAggregate(
    record: PrismaOtpChallenge,
  ): OtpChallengeAggregate {
    return this.toDomain(record);
  }

  // ===========================================================================
  // Generic Domain Component Mapping
  // ===========================================================================

  /**
   * Maps a supported Prisma OtpChallenge record into its corresponding
   * domain component.
   *
   * OtpChallenge has only one aggregate-owned entity, so this resolves
   * directly to OtpChallengeEntity.
   */
  public static toDomainComponent(
    record: PrismaOtpChallenge,
  ): OtpChallengeEntity {
    return this.otpChallengeToDomain(record);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default OtpChallengePrismaMapper;
