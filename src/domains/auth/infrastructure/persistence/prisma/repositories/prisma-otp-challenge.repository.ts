// -----------------------------------------------------------------------------
// Identity — Prisma OTP Challenge Repository
// -----------------------------------------------------------------------------
//
// Infrastructure repository for the OtpChallenge aggregate.
//
// Aggregate:
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
// The Identity reference remains opaque:
//
// OtpChallenge
//     │
//     └── identityPublicId
//              │
//              ▼
//        Identity public ID
//
// This repository never loads, resolves, or mutates the Identity aggregate.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Persist OtpChallenge aggregates.
// - Delete OtpChallenge aggregates.
// - Retrieve aggregates by internal identity.
// - Retrieve aggregates by public identity.
// - Retrieve aggregates by Identity public identifier.
// - Retrieve aggregates by purpose.
// - Retrieve aggregates by lifecycle status.
// - Retrieve pending challenges.
// - Retrieve by Identity + purpose.
// - Retrieve by Identity + status.
// - Retrieve by purpose + status.
// - Retrieve by Identity + purpose + status.
// - Retrieve pending challenges by Identity + purpose.
// - Retrieve latest matching challenges deterministically.
// - Determine aggregate existence.
//
// -----------------------------------------------------------------------------
//
// Security:
//
// This repository persists the OTP hash as part of aggregate state.
//
// It never:
//
// - generates OTPs;
// - hashes OTPs;
// - compares OTPs;
// - accepts raw OTP values;
// - sends OTPs;
// - publishes OTP material.
//
// -----------------------------------------------------------------------------
//
// Query semantics:
//
// `findPending()` means persisted status = PENDING.
//
// Expiration is not dynamically inferred by this repository.
//
// A PENDING challenge remains PENDING until the appropriate
// domain/application workflow evaluates the challenge and transitions it.
//
// Latest queries are deterministic and ordered by createdAt DESC.
//
// -----------------------------------------------------------------------------
//
// Aggregate boundary:
//
// OtpChallengeAggregate
// └── OtpChallengeEntity
//
// The aggregate is persisted and rehydrated as a complete unit.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type {
  OtpChallenge as PrismaOtpChallenge,
  Prisma,
} from '@prisma/client';

import { PrismaService } from '../../../../../../infrastructure/database/prisma/prisma.service';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { OtpChallengeAggregate } from '../../../../domain/aggregates/otp-challenge.aggregate';

// -----------------------------------------------------------------------------
// Repository Contract
// -----------------------------------------------------------------------------

import type { OtpChallengeRepository } from '../../../../domain/repositories/otp-challenge.repository';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import {
  OtpChallengePrismaMapper,
  type OtpChallengePersistence,
} from '../mappers/otp-challenge-prisma.mapper';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { OtpChallengePublicId } from '../../../../domain/value-objects/otp-challenge-public-id.vo';

import type { OtpChallengeIdentityPublicId } from '../../../../domain/value-objects/otp-challenge-identity-public-id.vo';

import type { OtpChallengePurpose } from '../../../../domain/value-objects/otp-challenge-purpose.vo';

import type { OtpChallengeStatus } from '../../../../domain/value-objects/otp-challenge-status.vo';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// =============================================================================
// Repository
// =============================================================================

/**
 * Prisma infrastructure implementation of the OtpChallenge repository.
 *
 * OtpChallenge is a single-entity aggregate.
 *
 * The repository translates between:
 *
 *     OtpChallengeAggregate
 *              ↕
 *     OtpChallengePrismaMapper
 *              ↕
 *     Prisma OtpChallenge
 *
 * Identity remains an opaque cross-aggregate reference.
 *
 * Prisma access is provided through the application's NestJS-managed
 * PrismaService.
 */
@Injectable()
export class PrismaOtpChallengeRepository implements OtpChallengeRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  /**
   * Creates a Prisma-backed OtpChallenge repository.
   */
  public constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists an OtpChallenge aggregate.
   *
   * OtpChallenge is a single-entity aggregate, therefore persistence is
   * represented by one Prisma upsert.
   */
  public async save(aggregate: OtpChallengeAggregate): Promise<void> {
    if (aggregate === undefined) {
      throw new Error('OTP Challenge aggregate is required.');
    }

    const persistence: OtpChallengePersistence =
      OtpChallengePrismaMapper.toPersistence(aggregate);

    const otpChallenge = persistence.otpChallenge;

    await this.prisma.otpChallenge.upsert({
      where: {
        id: otpChallenge.id,
      },

      create: otpChallenge,

      update: {
        publicId: otpChallenge.publicId,
        identityPublicId: otpChallenge.identityPublicId,
        purpose: otpChallenge.purpose,
        status: otpChallenge.status,
        destination: otpChallenge.destination,
        otpHash: otpChallenge.otpHash,
        attempts: otpChallenge.attempts,
        maxAttempts: otpChallenge.maxAttempts,
        expiresAt: otpChallenge.expiresAt,
        verifiedAt: otpChallenge.verifiedAt,
        updatedAt: otpChallenge.updatedAt,
      },
    });
  }

  /**
   * Deletes an OtpChallenge aggregate.
   *
   * Deletion policy belongs to the application/domain workflow.
   */
  public async delete(aggregate: OtpChallengeAggregate): Promise<void> {
    if (aggregate === undefined) {
      throw new Error('OTP Challenge aggregate is required.');
    }

    await this.prisma.otpChallenge.delete({
      where: {
        id: aggregate.id.toString(),
      },
    });
  }

  // ===========================================================================
  // Retrieval — Internal Identity
  // ===========================================================================

  /**
   * Finds an OtpChallenge aggregate by internal persistence identity.
   */
  public async findById(
    id: UniqueEntityId,
  ): Promise<OtpChallengeAggregate | null> {
    if (id === undefined) {
      throw new Error('OTP Challenge internal ID is required.');
    }

    const record = await this.prisma.otpChallenge.findUnique({
      where: {
        id: id.toString(),
      },
    });

    if (record === null) {
      return null;
    }

    return OtpChallengePrismaMapper.toDomain(record);
  }

  /**
   * Determines whether an OtpChallenge exists by internal identity.
   */
  public async existsById(id: UniqueEntityId): Promise<boolean> {
    if (id === undefined) {
      throw new Error('OTP Challenge internal ID is required.');
    }

    const record = await this.prisma.otpChallenge.findUnique({
      where: {
        id: id.toString(),
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Retrieval — Public Identity
  // ===========================================================================

  /**
   * Finds an OtpChallenge aggregate by public identifier.
   */
  public async findByPublicId(
    publicId: OtpChallengePublicId,
  ): Promise<OtpChallengeAggregate | null> {
    if (publicId === undefined) {
      throw new Error('OTP Challenge public ID is required.');
    }

    const record = await this.prisma.otpChallenge.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return OtpChallengePrismaMapper.toDomain(record);
  }

  /**
   * Determines whether an OtpChallenge exists by public identifier.
   */
  public async existsByPublicId(
    publicId: OtpChallengePublicId,
  ): Promise<boolean> {
    if (publicId === undefined) {
      throw new Error('OTP Challenge public ID is required.');
    }

    const record = await this.prisma.otpChallenge.findUnique({
      where: {
        publicId: publicId.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Retrieval — Identity
  // ===========================================================================

  /**
   * Finds all OTP Challenges belonging to an Identity.
   *
   * identityPublicId is treated as an opaque cross-aggregate reference.
   */
  public async findByIdentityPublicId(
    identityPublicId: OtpChallengeIdentityPublicId,
  ): Promise<OtpChallengeAggregate[]> {
    this.ensureIdentityPublicId(identityPublicId);

    const records = await this.prisma.otpChallenge.findMany({
      where: {
        identityPublicId: identityPublicId.value,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => OtpChallengePrismaMapper.toDomain(record));
  }

  /**
   * Finds the most recently created OTP Challenge belonging to an Identity.
   *
   * Latest semantics are based exclusively on createdAt DESC.
   */
  public async findLatestByIdentityPublicId(
    identityPublicId: OtpChallengeIdentityPublicId,
  ): Promise<OtpChallengeAggregate | null> {
    this.ensureIdentityPublicId(identityPublicId);

    return this.findLatestByWhere({
      identityPublicId: identityPublicId.value,
    });
  }

  /**
   * Determines whether an Identity has at least one OTP Challenge.
   */
  public async existsByIdentityPublicId(
    identityPublicId: OtpChallengeIdentityPublicId,
  ): Promise<boolean> {
    this.ensureIdentityPublicId(identityPublicId);

    const record = await this.prisma.otpChallenge.findFirst({
      where: {
        identityPublicId: identityPublicId.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Retrieval — Purpose
  // ===========================================================================

  /**
   * Finds OTP Challenges with the supplied purpose.
   */
  public async findByPurpose(
    purpose: OtpChallengePurpose,
  ): Promise<OtpChallengeAggregate[]> {
    this.ensurePurpose(purpose);

    const records = await this.prisma.otpChallenge.findMany({
      where: {
        purpose: purpose.value,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => OtpChallengePrismaMapper.toDomain(record));
  }

  /**
   * Determines whether at least one OTP Challenge exists with the supplied
   * purpose.
   */
  public async existsByPurpose(purpose: OtpChallengePurpose): Promise<boolean> {
    this.ensurePurpose(purpose);

    const record = await this.prisma.otpChallenge.findFirst({
      where: {
        purpose: purpose.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Retrieval — Status
  // ===========================================================================

  /**
   * Finds OTP Challenges with the supplied lifecycle status.
   */
  public async findByStatus(
    status: OtpChallengeStatus,
  ): Promise<OtpChallengeAggregate[]> {
    this.ensureStatus(status);

    return this.findByStatusValue(status.value);
  }

  /**
   * Finds OTP Challenges whose persisted lifecycle status is PENDING.
   *
   * Expiration is intentionally not evaluated here.
   */
  public async findPending(): Promise<OtpChallengeAggregate[]> {
    return this.findByStatusValue('PENDING');
  }

  /**
   * Determines whether at least one OTP Challenge exists with the supplied
   * lifecycle status.
   */
  public async existsByStatus(status: OtpChallengeStatus): Promise<boolean> {
    this.ensureStatus(status);

    return this.existsByStatusValue(status.value);
  }

  // ===========================================================================
  // Retrieval — Identity + Purpose
  // ===========================================================================

  /**
   * Finds OTP Challenges belonging to an Identity and created for a purpose.
   */
  public async findByIdentityPublicIdAndPurpose(
    identityPublicId: OtpChallengeIdentityPublicId,
    purpose: OtpChallengePurpose,
  ): Promise<OtpChallengeAggregate[]> {
    this.ensureIdentityPublicId(identityPublicId);
    this.ensurePurpose(purpose);

    const records = await this.prisma.otpChallenge.findMany({
      where: {
        identityPublicId: identityPublicId.value,
        purpose: purpose.value,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => OtpChallengePrismaMapper.toDomain(record));
  }

  /**
   * Finds the latest OTP Challenge belonging to an Identity and purpose.
   */
  public async findLatestByIdentityPublicIdAndPurpose(
    identityPublicId: OtpChallengeIdentityPublicId,
    purpose: OtpChallengePurpose,
  ): Promise<OtpChallengeAggregate | null> {
    this.ensureIdentityPublicId(identityPublicId);
    this.ensurePurpose(purpose);

    return this.findLatestByWhere({
      identityPublicId: identityPublicId.value,
      purpose: purpose.value,
    });
  }

  // ===========================================================================
  // Retrieval — Identity + Status
  // ===========================================================================

  /**
   * Finds OTP Challenges belonging to an Identity with the supplied status.
   */
  public async findByIdentityPublicIdAndStatus(
    identityPublicId: OtpChallengeIdentityPublicId,
    status: OtpChallengeStatus,
  ): Promise<OtpChallengeAggregate[]> {
    this.ensureIdentityPublicId(identityPublicId);
    this.ensureStatus(status);

    const records = await this.prisma.otpChallenge.findMany({
      where: {
        identityPublicId: identityPublicId.value,
        status: status.value,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => OtpChallengePrismaMapper.toDomain(record));
  }

  /**
   * Finds the latest OTP Challenge belonging to an Identity with the
   * supplied lifecycle status.
   */
  public async findLatestByIdentityPublicIdAndStatus(
    identityPublicId: OtpChallengeIdentityPublicId,
    status: OtpChallengeStatus,
  ): Promise<OtpChallengeAggregate | null> {
    this.ensureIdentityPublicId(identityPublicId);
    this.ensureStatus(status);

    return this.findLatestByWhere({
      identityPublicId: identityPublicId.value,
      status: status.value,
    });
  }

  // ===========================================================================
  // Retrieval — Purpose + Status
  // ===========================================================================

  /**
   * Finds OTP Challenges with the supplied purpose and lifecycle status.
   */
  public async findByPurposeAndStatus(
    purpose: OtpChallengePurpose,
    status: OtpChallengeStatus,
  ): Promise<OtpChallengeAggregate[]> {
    this.ensurePurpose(purpose);
    this.ensureStatus(status);

    const records = await this.prisma.otpChallenge.findMany({
      where: {
        purpose: purpose.value,
        status: status.value,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => OtpChallengePrismaMapper.toDomain(record));
  }

  /**
   * Finds the latest OTP Challenge with the supplied purpose and status.
   */
  public async findLatestByPurposeAndStatus(
    purpose: OtpChallengePurpose,
    status: OtpChallengeStatus,
  ): Promise<OtpChallengeAggregate | null> {
    this.ensurePurpose(purpose);
    this.ensureStatus(status);

    return this.findLatestByWhere({
      purpose: purpose.value,
      status: status.value,
    });
  }

  // ===========================================================================
  // Retrieval — Identity + Purpose + Status
  // ===========================================================================

  /**
   * Finds OTP Challenges belonging to an Identity and restricted by purpose
   * and lifecycle status.
   */
  public async findByIdentityPublicIdAndPurposeAndStatus(
    identityPublicId: OtpChallengeIdentityPublicId,
    purpose: OtpChallengePurpose,
    status: OtpChallengeStatus,
  ): Promise<OtpChallengeAggregate[]> {
    this.ensureIdentityPublicId(identityPublicId);
    this.ensurePurpose(purpose);
    this.ensureStatus(status);

    const records = await this.prisma.otpChallenge.findMany({
      where: {
        identityPublicId: identityPublicId.value,
        purpose: purpose.value,
        status: status.value,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => OtpChallengePrismaMapper.toDomain(record));
  }

  /**
   * Finds the latest OTP Challenge belonging to an Identity and restricted
   * by purpose and lifecycle status.
   */
  public async findLatestByIdentityPublicIdAndPurposeAndStatus(
    identityPublicId: OtpChallengeIdentityPublicId,
    purpose: OtpChallengePurpose,
    status: OtpChallengeStatus,
  ): Promise<OtpChallengeAggregate | null> {
    this.ensureIdentityPublicId(identityPublicId);
    this.ensurePurpose(purpose);
    this.ensureStatus(status);

    return this.findLatestByWhere({
      identityPublicId: identityPublicId.value,
      purpose: purpose.value,
      status: status.value,
    });
  }

  // ===========================================================================
  // Retrieval — Pending Identity + Purpose
  // ===========================================================================

  /**
   * Finds pending OTP Challenges belonging to an Identity and created for
   * the supplied purpose.
   *
   * Pending means persisted status = PENDING.
   *
   * Expiration is not dynamically evaluated.
   */
  public async findPendingByIdentityPublicIdAndPurpose(
    identityPublicId: OtpChallengeIdentityPublicId,
    purpose: OtpChallengePurpose,
  ): Promise<OtpChallengeAggregate[]> {
    this.ensureIdentityPublicId(identityPublicId);
    this.ensurePurpose(purpose);

    const records = await this.prisma.otpChallenge.findMany({
      where: {
        identityPublicId: identityPublicId.value,
        purpose: purpose.value,
        status: 'PENDING',
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => OtpChallengePrismaMapper.toDomain(record));
  }

  /**
   * Finds the latest pending OTP Challenge belonging to an Identity and
   * created for the supplied purpose.
   *
   * Pending means persisted status = PENDING.
   *
   * Expiration is not dynamically evaluated.
   */
  public async findLatestPendingByIdentityPublicIdAndPurpose(
    identityPublicId: OtpChallengeIdentityPublicId,
    purpose: OtpChallengePurpose,
  ): Promise<OtpChallengeAggregate | null> {
    this.ensureIdentityPublicId(identityPublicId);
    this.ensurePurpose(purpose);

    return this.findLatestByWhere({
      identityPublicId: identityPublicId.value,
      purpose: purpose.value,
      status: 'PENDING',
    });
  }

  // ===========================================================================
  // Private Helpers
  // ===========================================================================

  /**
   * Finds OTP Challenges by a Prisma lifecycle status.
   *
   * Ordering is ascending because collection retrieval methods return the
   * oldest challenge first unless a method explicitly requests latest
   * semantics.
   */
  private async findByStatusValue(
    status: PrismaOtpChallenge['status'],
  ): Promise<OtpChallengeAggregate[]> {
    const records = await this.prisma.otpChallenge.findMany({
      where: {
        status,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => OtpChallengePrismaMapper.toDomain(record));
  }

  /**
   * Determines whether at least one OTP Challenge exists for a Prisma
   * lifecycle status.
   */
  private async existsByStatusValue(
    status: PrismaOtpChallenge['status'],
  ): Promise<boolean> {
    const record = await this.prisma.otpChallenge.findFirst({
      where: {
        status,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Finds the most recently created OTP Challenge matching the supplied
   * Prisma filter.
   *
   * Latest semantics are deterministic:
   *
   *     createdAt DESC
   */
  private async findLatestByWhere(
    where: Prisma.OtpChallengeWhereInput,
  ): Promise<OtpChallengeAggregate | null> {
    const record = await this.prisma.otpChallenge.findFirst({
      where,

      orderBy: {
        createdAt: 'desc',
      },
    });

    if (record === null) {
      return null;
    }

    return OtpChallengePrismaMapper.toDomain(record);
  }

  /**
   * Validates the Identity public identifier value object.
   */
  private ensureIdentityPublicId(
    identityPublicId: OtpChallengeIdentityPublicId,
  ): void {
    if (identityPublicId === undefined) {
      throw new Error('OTP Challenge Identity public ID is required.');
    }
  }

  /**
   * Validates the OTP Challenge purpose value object.
   */
  private ensurePurpose(purpose: OtpChallengePurpose): void {
    if (purpose === undefined) {
      throw new Error('OTP Challenge purpose is required.');
    }
  }

  /**
   * Validates the OTP Challenge status value object.
   */
  private ensureStatus(status: OtpChallengeStatus): void {
    if (status === undefined) {
      throw new Error('OTP Challenge status is required.');
    }
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default PrismaOtpChallengeRepository;
