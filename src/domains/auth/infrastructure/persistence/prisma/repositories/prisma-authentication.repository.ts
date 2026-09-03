// -----------------------------------------------------------------------------
// Identity — Prisma Authentication Repository
// -----------------------------------------------------------------------------
//
// Infrastructure repository for the Authentication aggregate.
//
// Aggregate:
//
// AuthenticationAggregate
// └── AuthenticationEntity
//
// Persistence:
//
// Authentication
//
// Authentication is an independent aggregate.
//
// The Identity reference is opaque:
//
// Authentication
//     │
//     └── identityPublicId
//              │
//              ▼
//        Identity public ID
//
// This repository never loads or resolves the Identity aggregate.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { Authentication as PrismaAuthentication } from '@prisma/client';

import { PrismaService } from '../../../../../../infrastructure/database/prisma/prisma.service';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { AuthenticationAggregate } from '../../../../domain/aggregates/authentication.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import type { AuthenticationEntity } from '../../../../domain/entities/authentication.entity';

// -----------------------------------------------------------------------------
// Repository Contract
// -----------------------------------------------------------------------------

import type { AuthenticationRepository } from '../../../../domain/repositories/authentication.repository';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import {
  AuthenticationPrismaMapper,
  type AuthenticationPersistence,
} from '../mappers/authentication-prisma.mapper';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { AuthenticationPublicId } from '../../../../domain/value-objects/authentication-public-id.vo';

import type { AuthenticationIdentityPublicId } from '../../../../domain/value-objects/authentication-identity-public-id.vo';

import type { AuthenticationStatus } from '../../../../domain/value-objects/authentication-status.vo';

import type { AuthenticationPasswordVersion } from '../../../../domain/value-objects/authentication-password-version.vo';

import type { AuthenticationFailureCount } from '../../../../domain/value-objects/authentication-failure-count.vo';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// =============================================================================
// Repository
// =============================================================================

/**
 * Prisma infrastructure implementation of the Authentication repository.
 *
 * Authentication is an independent aggregate responsible for authentication
 * state and credential lifecycle.
 *
 * The repository translates between:
 *
 *     AuthenticationAggregate
 *              ↕
 *     AuthenticationPrismaMapper
 *              ↕
 *     Prisma Authentication
 *
 * The Identity public identifier remains an opaque cross-aggregate reference.
 *
 * Prisma access is provided through the application's NestJS-managed
 * PrismaService. The repository therefore participates correctly in NestJS
 * dependency injection and uses the same Prisma connection lifecycle as the
 * rest of the application.
 */
@Injectable()
export class PrismaAuthenticationRepository implements AuthenticationRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists an Authentication aggregate.
   *
   * Authentication is a single-entity aggregate, therefore persistence is
   * represented by one Authentication upsert.
   *
   * identityPublicId is persisted directly because it is an opaque
   * cross-aggregate reference.
   */
  public async save(aggregate: AuthenticationAggregate): Promise<void> {
    if (aggregate === undefined) {
      throw new Error('Authentication aggregate is required.');
    }

    const persistence: AuthenticationPersistence =
      AuthenticationPrismaMapper.toPersistence(aggregate);

    const authentication = persistence.authentication;

    await this.prisma.authentication.upsert({
      where: {
        id: authentication.id,
      },

      create: authentication,

      update: {
        publicId: authentication.publicId,
        identityPublicId: authentication.identityPublicId,
        status: authentication.status,
        passwordHash: authentication.passwordHash,
        passwordVersion: authentication.passwordVersion,
        passwordChangedAt: authentication.passwordChangedAt,
        passwordMustChange: authentication.passwordMustChange,
        failedAuthenticationCount: authentication.failedAuthenticationCount,
        lastFailedAuthenticationAt: authentication.lastFailedAuthenticationAt,
        lockedAt: authentication.lockedAt,
        lockedUntil: authentication.lockedUntil,
        lockReason: authentication.lockReason,
        lastAuthenticatedAt: authentication.lastAuthenticatedAt,
        updatedAt: authentication.updatedAt,
      },
    });
  }

  /**
   * Deletes an Authentication aggregate.
   *
   * Deletion policy belongs to the application/domain workflow.
   */
  public async delete(aggregate: AuthenticationAggregate): Promise<void> {
    if (aggregate === undefined) {
      throw new Error('Authentication aggregate is required.');
    }

    await this.prisma.authentication.delete({
      where: {
        id: aggregate.id.toString(),
      },
    });
  }

  // ===========================================================================
  // Aggregate Queries
  // ===========================================================================

  /**
   * Finds an Authentication aggregate by public identifier.
   */
  public async findByPublicId(
    publicId: AuthenticationPublicId,
  ): Promise<AuthenticationAggregate | null> {
    if (publicId === undefined) {
      throw new Error('Authentication public ID is required.');
    }

    const record = await this.prisma.authentication.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return AuthenticationPrismaMapper.toDomain(record);
  }

  /**
   * Finds an Authentication aggregate by Identity public identifier.
   *
   * identityPublicId is treated as an opaque reference.
   */
  public async findByIdentityPublicId(
    identityPublicId: AuthenticationIdentityPublicId,
  ): Promise<AuthenticationAggregate | null> {
    if (identityPublicId === undefined) {
      throw new Error('Authentication Identity public ID is required.');
    }

    const record = await this.prisma.authentication.findUnique({
      where: {
        identityPublicId: identityPublicId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return AuthenticationPrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Entity Queries
  // ===========================================================================

  /**
   * Finds an Authentication entity by public identifier.
   */
  public async findEntityByPublicId(
    publicId: AuthenticationPublicId,
  ): Promise<AuthenticationEntity | null> {
    const aggregate = await this.findByPublicId(publicId);

    return aggregate?.authentication ?? null;
  }

  /**
   * Finds an Authentication entity by internal identifier.
   */
  public async findEntityById(
    id: UniqueEntityId,
  ): Promise<AuthenticationEntity | null> {
    if (id === undefined) {
      throw new Error('Authentication internal ID is required.');
    }

    const record = await this.prisma.authentication.findUnique({
      where: {
        id: id.toString(),
      },
    });

    if (record === null) {
      return null;
    }

    return AuthenticationPrismaMapper.toAuthenticationDomain(record);
  }

  /**
   * Finds an Authentication entity by Identity public identifier.
   */
  public async findEntityByIdentityPublicId(
    identityPublicId: AuthenticationIdentityPublicId,
  ): Promise<AuthenticationEntity | null> {
    const aggregate = await this.findByIdentityPublicId(identityPublicId);

    return aggregate?.authentication ?? null;
  }

  // ===========================================================================
  // Status Queries
  // ===========================================================================

  /**
   * Finds all Authentication aggregates with the supplied status.
   */
  public async findByStatus(
    status: AuthenticationStatus,
  ): Promise<AuthenticationAggregate[]> {
    if (status === undefined) {
      throw new Error('Authentication status is required.');
    }

    const records = await this.prisma.authentication.findMany({
      where: {
        status: status.value,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => AuthenticationPrismaMapper.toDomain(record));
  }

  /**
   * Finds all pending Authentication aggregates.
   */
  public async findPending(): Promise<AuthenticationAggregate[]> {
    const records = await this.prisma.authentication.findMany({
      where: {
        status: 'PENDING',
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => AuthenticationPrismaMapper.toDomain(record));
  }

  /**
   * Finds all active Authentication aggregates.
   */
  public async findActive(): Promise<AuthenticationAggregate[]> {
    const records = await this.prisma.authentication.findMany({
      where: {
        status: 'ACTIVE',
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => AuthenticationPrismaMapper.toDomain(record));
  }

  /**
   * Finds all locked Authentication aggregates.
   */
  public async findLocked(): Promise<AuthenticationAggregate[]> {
    const records = await this.prisma.authentication.findMany({
      where: {
        status: 'LOCKED',
      },

      orderBy: {
        lockedAt: 'asc',
      },
    });

    return records.map((record) => AuthenticationPrismaMapper.toDomain(record));
  }

  /**
   * Finds all disabled Authentication aggregates.
   */
  public async findDisabled(): Promise<AuthenticationAggregate[]> {
    const records = await this.prisma.authentication.findMany({
      where: {
        status: 'DISABLED',
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => AuthenticationPrismaMapper.toDomain(record));
  }

  // ===========================================================================
  // Lock Queries
  // ===========================================================================

  /**
   * Finds currently locked Authentication aggregates.
   *
   * Permanent lock:
   *
   *     status = LOCKED
   *     lockedUntil IS NULL
   *
   * Temporary active lock:
   *
   *     status = LOCKED
   *     lockedUntil > referenceDate
   */
  public async findCurrentlyLocked(
    referenceDate: Date = new Date(),
  ): Promise<AuthenticationAggregate[]> {
    PrismaAuthenticationRepository.ensureValidDate(
      referenceDate,
      'Authentication lock reference date',
    );

    const records = await this.prisma.authentication.findMany({
      where: {
        status: 'LOCKED',

        OR: [
          {
            lockedUntil: null,
          },
          {
            lockedUntil: {
              gt: referenceDate,
            },
          },
        ],
      },

      orderBy: {
        lockedAt: 'asc',
      },
    });

    return records.map((record) => AuthenticationPrismaMapper.toDomain(record));
  }

  /**
   * Finds Authentication aggregates whose temporary locks have expired.
   */
  public async findWithExpiredLocks(
    referenceDate: Date = new Date(),
  ): Promise<AuthenticationAggregate[]> {
    PrismaAuthenticationRepository.ensureValidDate(
      referenceDate,
      'Authentication lock reference date',
    );

    const records = await this.prisma.authentication.findMany({
      where: {
        status: 'LOCKED',

        lockedUntil: {
          not: null,
          lte: referenceDate,
        },
      },

      orderBy: {
        lockedUntil: 'asc',
      },
    });

    return records.map((record) => AuthenticationPrismaMapper.toDomain(record));
  }

  /**
   * Finds permanently locked Authentication aggregates.
   */
  public async findPermanentlyLocked(): Promise<AuthenticationAggregate[]> {
    const records = await this.prisma.authentication.findMany({
      where: {
        status: 'LOCKED',
        lockedUntil: null,
      },

      orderBy: {
        lockedAt: 'asc',
      },
    });

    return records.map((record) => AuthenticationPrismaMapper.toDomain(record));
  }

  /**
   * Finds temporarily locked Authentication aggregates.
   */
  public async findTemporarilyLocked(): Promise<AuthenticationAggregate[]> {
    const records = await this.prisma.authentication.findMany({
      where: {
        status: 'LOCKED',

        lockedUntil: {
          not: null,
        },
      },

      orderBy: {
        lockedAt: 'asc',
      },
    });

    return records.map((record) => AuthenticationPrismaMapper.toDomain(record));
  }

  // ===========================================================================
  // Password Queries
  // ===========================================================================

  /**
   * Finds all Authentication aggregates with an established password.
   */
  public async findWithPassword(): Promise<AuthenticationAggregate[]> {
    const records = await this.prisma.authentication.findMany({
      where: {
        passwordHash: {
          not: null,
        },
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => AuthenticationPrismaMapper.toDomain(record));
  }

  /**
   * Finds all Authentication aggregates without an established password.
   */
  public async findWithoutPassword(): Promise<AuthenticationAggregate[]> {
    const records = await this.prisma.authentication.findMany({
      where: {
        passwordHash: null,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => AuthenticationPrismaMapper.toDomain(record));
  }

  /**
   * Finds Authentication aggregates requiring a password change.
   */
  public async findRequiringPasswordChange(): Promise<
    AuthenticationAggregate[]
  > {
    const records = await this.prisma.authentication.findMany({
      where: {
        passwordMustChange: true,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => AuthenticationPrismaMapper.toDomain(record));
  }

  /**
   * Finds Authentication aggregates that do not require a password change.
   */
  public async findNotRequiringPasswordChange(): Promise<
    AuthenticationAggregate[]
  > {
    const records = await this.prisma.authentication.findMany({
      where: {
        passwordMustChange: false,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => AuthenticationPrismaMapper.toDomain(record));
  }

  // ===========================================================================
  // Password Version Queries
  // ===========================================================================

  /**
   * Finds Authentication aggregates using the supplied password version.
   */
  public async findByPasswordVersion(
    passwordVersion: AuthenticationPasswordVersion,
  ): Promise<AuthenticationAggregate[]> {
    if (passwordVersion === undefined) {
      throw new Error('Authentication password version is required.');
    }

    const records = await this.prisma.authentication.findMany({
      where: {
        passwordVersion: passwordVersion.value,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => AuthenticationPrismaMapper.toDomain(record));
  }

  // ===========================================================================
  // Authentication Failure Queries
  // ===========================================================================

  /**
   * Finds Authentication aggregates with one or more failures.
   */
  public async findWithAuthenticationFailures(): Promise<
    AuthenticationAggregate[]
  > {
    const records = await this.prisma.authentication.findMany({
      where: {
        failedAuthenticationCount: {
          gt: 0,
        },
      },

      orderBy: {
        failedAuthenticationCount: 'desc',
      },
    });

    return records.map((record) => AuthenticationPrismaMapper.toDomain(record));
  }

  /**
   * Finds Authentication aggregates without authentication failures.
   */
  public async findWithoutAuthenticationFailures(): Promise<
    AuthenticationAggregate[]
  > {
    const records = await this.prisma.authentication.findMany({
      where: {
        failedAuthenticationCount: 0,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => AuthenticationPrismaMapper.toDomain(record));
  }

  /**
   * Finds Authentication aggregates whose failure count is at least the
   * supplied count.
   */
  public async findWithFailureCountAtLeast(
    count: AuthenticationFailureCount,
  ): Promise<AuthenticationAggregate[]> {
    if (count === undefined) {
      throw new Error('Authentication failure count is required.');
    }

    const records = await this.prisma.authentication.findMany({
      where: {
        failedAuthenticationCount: {
          gte: count.value,
        },
      },

      orderBy: {
        failedAuthenticationCount: 'desc',
      },
    });

    return records.map((record) => AuthenticationPrismaMapper.toDomain(record));
  }

  /**
   * Finds Authentication aggregates whose failure count is below the
   * supplied count.
   */
  public async findWithFailureCountBelow(
    count: AuthenticationFailureCount,
  ): Promise<AuthenticationAggregate[]> {
    if (count === undefined) {
      throw new Error('Authentication failure count is required.');
    }

    const records = await this.prisma.authentication.findMany({
      where: {
        failedAuthenticationCount: {
          lt: count.value,
        },
      },

      orderBy: {
        failedAuthenticationCount: 'asc',
      },
    });

    return records.map((record) => AuthenticationPrismaMapper.toDomain(record));
  }

  // ===========================================================================
  // Authentication Audit Queries
  // ===========================================================================

  /**
   * Finds Authentication aggregates that authenticated before the supplied
   * date.
   */
  public async findAuthenticatedBefore(
    date: Date,
  ): Promise<AuthenticationAggregate[]> {
    PrismaAuthenticationRepository.ensureValidDate(
      date,
      'Authentication audit date',
    );

    const records = await this.prisma.authentication.findMany({
      where: {
        lastAuthenticatedAt: {
          not: null,
          lt: date,
        },
      },

      orderBy: {
        lastAuthenticatedAt: 'asc',
      },
    });

    return records.map((record) => AuthenticationPrismaMapper.toDomain(record));
  }

  /**
   * Finds Authentication aggregates that have never successfully
   * authenticated.
   */
  public async findNeverAuthenticated(): Promise<AuthenticationAggregate[]> {
    const records = await this.prisma.authentication.findMany({
      where: {
        lastAuthenticatedAt: null,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => AuthenticationPrismaMapper.toDomain(record));
  }

  // ===========================================================================
  // Existence
  // ===========================================================================

  /**
   * Returns true when an Authentication exists by public identifier.
   */
  public async existsByPublicId(
    publicId: AuthenticationPublicId,
  ): Promise<boolean> {
    if (publicId === undefined) {
      throw new Error('Authentication public ID is required.');
    }

    const record = await this.prisma.authentication.findUnique({
      where: {
        publicId: publicId.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Returns true when an Authentication exists by internal identifier.
   */
  public async existsById(id: UniqueEntityId): Promise<boolean> {
    if (id === undefined) {
      throw new Error('Authentication internal ID is required.');
    }

    const record = await this.prisma.authentication.findUnique({
      where: {
        id: id.toString(),
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Returns true when an Authentication exists for an Identity.
   */
  public async existsByIdentityPublicId(
    identityPublicId: AuthenticationIdentityPublicId,
  ): Promise<boolean> {
    if (identityPublicId === undefined) {
      throw new Error('Authentication Identity public ID is required.');
    }

    const record = await this.prisma.authentication.findUnique({
      where: {
        identityPublicId: identityPublicId.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Returns true when an active Authentication exists for an Identity.
   */
  public async existsActiveByIdentityPublicId(
    identityPublicId: AuthenticationIdentityPublicId,
  ): Promise<boolean> {
    if (identityPublicId === undefined) {
      throw new Error('Authentication Identity public ID is required.');
    }

    const record = await this.prisma.authentication.findFirst({
      where: {
        identityPublicId: identityPublicId.value,
        status: 'ACTIVE',
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Returns true when an Authentication exists with the supplied status.
   */
  public async existsByStatus(status: AuthenticationStatus): Promise<boolean> {
    if (status === undefined) {
      throw new Error('Authentication status is required.');
    }

    const record = await this.prisma.authentication.findFirst({
      where: {
        status: status.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Returns true when at least one pending Authentication exists.
   */
  public async existsPending(): Promise<boolean> {
    return this.existsByStatusValue('PENDING');
  }

  /**
   * Returns true when at least one active Authentication exists.
   */
  public async existsActive(): Promise<boolean> {
    return this.existsByStatusValue('ACTIVE');
  }

  /**
   * Returns true when at least one locked Authentication exists.
   */
  public async existsLocked(): Promise<boolean> {
    return this.existsByStatusValue('LOCKED');
  }

  /**
   * Returns true when at least one disabled Authentication exists.
   */
  public async existsDisabled(): Promise<boolean> {
    return this.existsByStatusValue('DISABLED');
  }

  /**
   * Returns true when at least one Authentication requires a password
   * change.
   */
  public async existsRequiringPasswordChange(): Promise<boolean> {
    const record = await this.prisma.authentication.findFirst({
      where: {
        passwordMustChange: true,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Returns true when at least one Authentication has recorded one or more
   * failures.
   */
  public async existsWithAuthenticationFailures(): Promise<boolean> {
    const record = await this.prisma.authentication.findFirst({
      where: {
        failedAuthenticationCount: {
          gt: 0,
        },
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Private Helpers
  // ===========================================================================

  /**
   * Finds Authentication aggregates by a Prisma status value.
   *
   * Used internally by the status convenience methods.
   */
  private async findByStatusValue(
    status: PrismaAuthentication['status'],
  ): Promise<AuthenticationAggregate[]> {
    const records = await this.prisma.authentication.findMany({
      where: {
        status,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => AuthenticationPrismaMapper.toDomain(record));
  }

  /**
   * Checks whether an Authentication exists for a Prisma status value.
   */
  private async existsByStatusValue(
    status: PrismaAuthentication['status'],
  ): Promise<boolean> {
    const record = await this.prisma.authentication.findFirst({
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
   * Validates a Date used as a persistence query boundary.
   */
  private static ensureValidDate(value: Date, fieldName: string): void {
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
      throw new Error(`${fieldName} must be a valid date.`);
    }
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default PrismaAuthenticationRepository;
