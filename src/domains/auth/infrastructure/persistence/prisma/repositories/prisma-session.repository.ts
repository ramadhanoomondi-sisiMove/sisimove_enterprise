// -----------------------------------------------------------------------------
// Session — Prisma Repository
// -----------------------------------------------------------------------------
//
// Infrastructure repository for the Session aggregate.
//
// Aggregate:
//
// SessionAggregate
// └── SessionEntity
//
// Persistence:
//
// Session
//
// Session is an independent aggregate responsible for the lifecycle and
// security state of one authenticated Session.
//
// Cross-aggregate references:
//
// - identityPublicId
// - devicePublicId
// - tokenFamilyPublicId
// - replacedBySessionPublicId
//
// These references remain opaque.
//
// This repository never:
// - loads Identity;
// - loads Device;
// - generates refresh tokens;
// - hashes refresh tokens;
// - compares plaintext refresh tokens;
// - signs JWTs;
// - verifies JWTs;
// - orchestrates token rotation;
// - revokes other Sessions;
// - revokes token families;
// - performs authorization.
//
// -----------------------------------------------------------------------------
//
// Infrastructure DI:
//
// PrismaService is the application's NestJS-managed Prisma dependency.
//
// The repository must NOT inject PrismaClient directly. PrismaService owns
// the configured Prisma client lifecycle and is the dependency exposed to
// infrastructure repositories.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { Session as PrismaSession } from '@prisma/client';

import { PrismaService } from '../../../../../../infrastructure/database/prisma/prisma.service';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { SessionAggregate } from '../../../../domain/aggregates/session.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import type { SessionEntity } from '../../../../domain/entities/session.entity';

// -----------------------------------------------------------------------------
// Repository Contract
// -----------------------------------------------------------------------------

import type { SessionRepository } from '../../../../domain/repositories/session.repository';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import {
  SessionPrismaMapper,
  type SessionPersistence,
} from '../mappers/session-prisma.mapper';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { SessionPublicId } from '../../../../domain/value-objects/session-public-id.vo';

import type { SessionIdentityPublicId } from '../../../../domain/value-objects/session-identity-public-id.vo';

import type { SessionDevicePublicId } from '../../../../domain/value-objects/session-device-public-id.vo';

import type { SessionStatus } from '../../../../domain/value-objects/session-status.vo';

import type { SessionRefreshTokenHash } from '../../../../domain/value-objects/session-refresh-token-hash.vo';

import type { SessionTokenFamilyPublicId } from '../../../../domain/value-objects/session-token-family-public-id.vo';

import type { SessionReplacedByPublicId } from '../../../../domain/value-objects/session-replaced-by-public-id.vo';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// =============================================================================
// Repository
// =============================================================================

/**
 * Prisma infrastructure implementation of the Session repository.
 *
 * Session is an independent aggregate responsible for one authenticated
 * Session lifecycle.
 *
 * The repository translates between:
 *
 *     SessionAggregate
 *              ↕
 *     SessionPrismaMapper
 *              ↕
 *     Prisma Session
 *
 * Cross-aggregate public identifiers remain opaque.
 *
 * NestJS owns the repository lifecycle and injects the application's
 * PrismaService instance.
 */
@Injectable()
export class PrismaSessionRepository implements SessionRepository {
  // ===========================================================================

  // Constructor

  // ===========================================================================

  /**
   * Creates a Prisma-backed Session repository.
   *
   * PrismaService is the application's NestJS-managed Prisma dependency.
   */
  public constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================

  // Persistence

  // ===========================================================================

  /**
   * Persists a Session aggregate.
   *
   * Session is a single-entity aggregate, therefore persistence is represented
   * by one Session upsert.
   */
  public async save(aggregate: SessionAggregate): Promise<void> {
    if (aggregate === undefined) {
      throw new Error('Session aggregate is required.');
    }

    const persistence: SessionPersistence =
      SessionPrismaMapper.toPersistence(aggregate);

    const session = persistence.session;

    await this.prisma.session.upsert({
      where: {
        id: session.id,
      },

      create: session,

      update: {
        publicId: session.publicId,
        identityPublicId: session.identityPublicId,
        devicePublicId: session.devicePublicId,
        status: session.status,
        refreshTokenHash: session.refreshTokenHash,
        tokenFamilyPublicId: session.tokenFamilyPublicId,
        replacedBySessionPublicId: session.replacedBySessionPublicId,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        countryCode: session.countryCode,
        city: session.city,
        authenticatedAt: session.authenticatedAt,
        lastActivityAt: session.lastActivityAt,
        expiresAt: session.expiresAt,
        revokedAt: session.revokedAt,
        revokedReason: session.revokedReason,
        updatedAt: session.updatedAt,
      },
    });
  }

  /**
   * Deletes a Session aggregate.
   *
   * Deletion policy belongs to the application/domain workflow.
   */
  public async delete(aggregate: SessionAggregate): Promise<void> {
    if (aggregate === undefined) {
      throw new Error('Session aggregate is required.');
    }

    await this.prisma.session.delete({
      where: {
        id: aggregate.id.toString(),
      },
    });
  }

  // ===========================================================================

  // Aggregate Queries

  // ===========================================================================

  /**
   * Finds a Session aggregate by public identifier.
   */
  public async findByPublicId(
    publicId: SessionPublicId,
  ): Promise<SessionAggregate | null> {
    if (publicId === undefined) {
      throw new Error('Session public ID is required.');
    }

    const record = await this.prisma.session.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return SessionPrismaMapper.toDomain(record);
  }

  /**
   * Finds a Session aggregate by internal identifier.
   */
  public async findById(id: UniqueEntityId): Promise<SessionAggregate | null> {
    if (id === undefined) {
      throw new Error('Session internal ID is required.');
    }

    const record = await this.prisma.session.findUnique({
      where: {
        id: id.toString(),
      },
    });

    if (record === null) {
      return null;
    }

    return SessionPrismaMapper.toDomain(record);
  }

  /**
   * Finds all Sessions belonging to an Identity.
   *
   * identityPublicId is treated as an opaque cross-aggregate reference.
   */
  public async findByIdentityPublicId(
    identityPublicId: SessionIdentityPublicId,
  ): Promise<SessionAggregate[]> {
    if (identityPublicId === undefined) {
      throw new Error('Session Identity public ID is required.');
    }

    const records = await this.prisma.session.findMany({
      where: {
        identityPublicId: identityPublicId.value,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => SessionPrismaMapper.toDomain(record));
  }

  /**
   * Finds all Sessions associated with a Device.
   *
   * devicePublicId is treated as an opaque cross-aggregate reference.
   */
  public async findByDevicePublicId(
    devicePublicId: SessionDevicePublicId,
  ): Promise<SessionAggregate[]> {
    if (devicePublicId === undefined) {
      throw new Error('Session Device public ID is required.');
    }

    const records = await this.prisma.session.findMany({
      where: {
        devicePublicId: devicePublicId.value,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => SessionPrismaMapper.toDomain(record));
  }

  /**
   * Finds a Session by public identifier and owning Identity.
   */
  public async findByPublicIdAndIdentityPublicId(
    publicId: SessionPublicId,
    identityPublicId: SessionIdentityPublicId,
  ): Promise<SessionAggregate | null> {
    if (publicId === undefined) {
      throw new Error('Session public ID is required.');
    }

    if (identityPublicId === undefined) {
      throw new Error('Session Identity public ID is required.');
    }

    const record = await this.prisma.session.findFirst({
      where: {
        publicId: publicId.value,
        identityPublicId: identityPublicId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return SessionPrismaMapper.toDomain(record);
  }

  // ===========================================================================

  // Entity Queries

  // ===========================================================================

  /**
   * Finds a Session entity by public identifier.
   */
  public async findEntityByPublicId(
    publicId: SessionPublicId,
  ): Promise<SessionEntity | null> {
    const aggregate = await this.findByPublicId(publicId);

    return aggregate?.session ?? null;
  }

  /**
   * Finds a Session entity by internal identifier.
   */
  public async findEntityById(
    id: UniqueEntityId,
  ): Promise<SessionEntity | null> {
    if (id === undefined) {
      throw new Error('Session internal ID is required.');
    }

    const record = await this.prisma.session.findUnique({
      where: {
        id: id.toString(),
      },
    });

    if (record === null) {
      return null;
    }

    return SessionPrismaMapper.toSessionDomain(record);
  }

  /**
   * Finds a Session entity by Identity public identifier.
   *
   * Since one Identity can own many Sessions, this operation returns the
   * first Session according to creation order.
   */
  public async findEntityByIdentityPublicId(
    identityPublicId: SessionIdentityPublicId,
  ): Promise<SessionEntity | null> {
    if (identityPublicId === undefined) {
      throw new Error('Session Identity public ID is required.');
    }

    const record = await this.prisma.session.findFirst({
      where: {
        identityPublicId: identityPublicId.value,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    if (record === null) {
      return null;
    }

    return SessionPrismaMapper.toSessionDomain(record);
  }

  /**
   * Finds a Session entity by public identifier and owning Identity.
   */
  public async findEntityByPublicIdAndIdentityPublicId(
    publicId: SessionPublicId,
    identityPublicId: SessionIdentityPublicId,
  ): Promise<SessionEntity | null> {
    const aggregate = await this.findByPublicIdAndIdentityPublicId(
      publicId,
      identityPublicId,
    );

    return aggregate?.session ?? null;
  }

  // ===========================================================================

  // Status Queries

  // ===========================================================================

  /**
   * Finds all Sessions with the supplied lifecycle status.
   */
  public async findByStatus(
    status: SessionStatus,
  ): Promise<SessionAggregate[]> {
    if (status === undefined) {
      throw new Error('Session status is required.');
    }

    const records = await this.prisma.session.findMany({
      where: {
        status: status.value,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => SessionPrismaMapper.toDomain(record));
  }

  /**
   * Finds all active Sessions.
   */
  public async findActive(): Promise<SessionAggregate[]> {
    return this.findByStatusValue('ACTIVE');
  }

  /**
   * Finds all active Sessions belonging to an Identity.
   */
  public async findActiveByIdentityPublicId(
    identityPublicId: SessionIdentityPublicId,
  ): Promise<SessionAggregate[]> {
    if (identityPublicId === undefined) {
      throw new Error('Session Identity public ID is required.');
    }

    const records = await this.prisma.session.findMany({
      where: {
        identityPublicId: identityPublicId.value,
        status: 'ACTIVE',
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => SessionPrismaMapper.toDomain(record));
  }

  /**
   * Finds all Sessions with EXPIRED lifecycle status.
   */
  public async findExpired(): Promise<SessionAggregate[]> {
    return this.findByStatusValue('EXPIRED');
  }

  /**
   * Finds all revoked Sessions.
   */
  public async findRevoked(): Promise<SessionAggregate[]> {
    return this.findByStatusValue('REVOKED');
  }

  /**
   * Finds all Sessions that are not active.
   */
  public async findInactive(): Promise<SessionAggregate[]> {
    const records = await this.prisma.session.findMany({
      where: {
        status: {
          not: 'ACTIVE',
        },
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => SessionPrismaMapper.toDomain(record));
  }

  // ===========================================================================

  // Usability Queries

  // ===========================================================================

  /**
   * Finds all Sessions that are currently usable.
   *
   * Usability is represented by:
   *
   * - ACTIVE status;
   * - expiry timestamp greater than referenceDate;
   * - no revocation timestamp.
   *
   * The additional revokedAt condition protects the query from inconsistent
   * persisted state.
   */
  public async findUsable(
    referenceDate: Date = new Date(),
  ): Promise<SessionAggregate[]> {
    PrismaSessionRepository.ensureValidDate(
      referenceDate,
      'Session usability reference date',
    );

    const records = await this.prisma.session.findMany({
      where: {
        status: 'ACTIVE',

        expiresAt: {
          gt: referenceDate,
        },

        revokedAt: null,
      },

      orderBy: {
        expiresAt: 'asc',
      },
    });

    return records.map((record) => SessionPrismaMapper.toDomain(record));
  }

  /**
   * Finds a currently usable Session belonging to an Identity.
   *
   * If multiple usable Sessions exist, the most recently active Session is
   * returned.
   */
  public async findUsableByIdentityPublicId(
    identityPublicId: SessionIdentityPublicId,
    referenceDate: Date = new Date(),
  ): Promise<SessionAggregate | null> {
    PrismaSessionRepository.ensureValidDate(
      referenceDate,
      'Session usability reference date',
    );

    if (identityPublicId === undefined) {
      throw new Error('Session Identity public ID is required.');
    }

    const record = await this.prisma.session.findFirst({
      where: {
        identityPublicId: identityPublicId.value,
        status: 'ACTIVE',

        expiresAt: {
          gt: referenceDate,
        },

        revokedAt: null,
      },

      orderBy: {
        lastActivityAt: 'desc',
      },
    });

    if (record === null) {
      return null;
    }

    return SessionPrismaMapper.toDomain(record);
  }

  /**
   * Finds a currently usable Session by public identifier.
   */
  public async findUsableByPublicId(
    publicId: SessionPublicId,
    referenceDate: Date = new Date(),
  ): Promise<SessionAggregate | null> {
    PrismaSessionRepository.ensureValidDate(
      referenceDate,
      'Session usability reference date',
    );

    if (publicId === undefined) {
      throw new Error('Session public ID is required.');
    }

    const record = await this.prisma.session.findFirst({
      where: {
        publicId: publicId.value,
        status: 'ACTIVE',

        expiresAt: {
          gt: referenceDate,
        },

        revokedAt: null,
      },
    });

    if (record === null) {
      return null;
    }

    return SessionPrismaMapper.toDomain(record);
  }

  // ===========================================================================

  // Expiry Queries

  // ===========================================================================

  /**
   * Finds Sessions whose expiry timestamp has passed.
   *
   * This query is timestamp-based and does not require the persisted status
   * to already be EXPIRED.
   */
  public async findExpiredByDate(
    referenceDate: Date = new Date(),
  ): Promise<SessionAggregate[]> {
    PrismaSessionRepository.ensureValidDate(
      referenceDate,
      'Session expiry reference date',
    );

    const records = await this.prisma.session.findMany({
      where: {
        expiresAt: {
          lte: referenceDate,
        },
      },

      orderBy: {
        expiresAt: 'asc',
      },
    });

    return records.map((record) => SessionPrismaMapper.toDomain(record));
  }

  /**
   * Finds ACTIVE Sessions whose expiry timestamp has passed.
   *
   * These are the Sessions that can require explicit expiry reconciliation.
   */
  public async findActiveExpired(
    referenceDate: Date = new Date(),
  ): Promise<SessionAggregate[]> {
    PrismaSessionRepository.ensureValidDate(
      referenceDate,
      'Session expiry reference date',
    );

    const records = await this.prisma.session.findMany({
      where: {
        status: 'ACTIVE',

        expiresAt: {
          lte: referenceDate,
        },
      },

      orderBy: {
        expiresAt: 'asc',
      },
    });

    return records.map((record) => SessionPrismaMapper.toDomain(record));
  }

  /**
   * Finds Sessions expiring before the supplied timestamp.
   */
  public async findExpiringBefore(
    expiresBefore: Date,
  ): Promise<SessionAggregate[]> {
    PrismaSessionRepository.ensureValidDate(
      expiresBefore,
      'Session expiry boundary',
    );

    const records = await this.prisma.session.findMany({
      where: {
        expiresAt: {
          lt: expiresBefore,
        },

        status: 'ACTIVE',

        revokedAt: null,
      },

      orderBy: {
        expiresAt: 'asc',
      },
    });

    return records.map((record) => SessionPrismaMapper.toDomain(record));
  }

  // ===========================================================================

  // Revocation Queries

  // ===========================================================================

  /**
   * Finds all revoked Sessions belonging to an Identity.
   */
  public async findRevokedByIdentityPublicId(
    identityPublicId: SessionIdentityPublicId,
  ): Promise<SessionAggregate[]> {
    if (identityPublicId === undefined) {
      throw new Error('Session Identity public ID is required.');
    }

    const records = await this.prisma.session.findMany({
      where: {
        identityPublicId: identityPublicId.value,
        status: 'REVOKED',
      },

      orderBy: {
        revokedAt: 'desc',
      },
    });

    return records.map((record) => SessionPrismaMapper.toDomain(record));
  }

  /**
   * Finds all non-revoked Sessions belonging to an Identity.
   */
  public async findNonRevokedByIdentityPublicId(
    identityPublicId: SessionIdentityPublicId,
  ): Promise<SessionAggregate[]> {
    if (identityPublicId === undefined) {
      throw new Error('Session Identity public ID is required.');
    }

    const records = await this.prisma.session.findMany({
      where: {
        identityPublicId: identityPublicId.value,
        status: {
          not: 'REVOKED',
        },
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => SessionPrismaMapper.toDomain(record));
  }

  /**
   * Finds all currently usable Sessions belonging to an Identity.
   */
  public async findUsableByIdentity(
    identityPublicId: SessionIdentityPublicId,
    referenceDate: Date = new Date(),
  ): Promise<SessionAggregate[]> {
    PrismaSessionRepository.ensureValidDate(
      referenceDate,
      'Session usability reference date',
    );

    if (identityPublicId === undefined) {
      throw new Error('Session Identity public ID is required.');
    }

    const records = await this.prisma.session.findMany({
      where: {
        identityPublicId: identityPublicId.value,
        status: 'ACTIVE',

        expiresAt: {
          gt: referenceDate,
        },

        revokedAt: null,
      },

      orderBy: {
        lastActivityAt: 'desc',
      },
    });

    return records.map((record) => SessionPrismaMapper.toDomain(record));
  }

  // ===========================================================================

  // Refresh Token

  // ===========================================================================

  /**
   * Finds a Session by its persisted refresh-token hash.
   *
   * The repository receives only the already-hashed value object.
   */
  public async findByRefreshTokenHash(
    refreshTokenHash: SessionRefreshTokenHash,
  ): Promise<SessionAggregate | null> {
    if (refreshTokenHash === undefined) {
      throw new Error('Session refresh-token hash is required.');
    }

    const record = await this.prisma.session.findFirst({
      where: {
        refreshTokenHash: refreshTokenHash.value,
      },
    });

    if (record === null) {
      return null;
    }

    return SessionPrismaMapper.toDomain(record);
  }

  /**
   * Finds a Session by refresh-token hash only when active, unexpired,
   * and non-revoked.
   */
  public async findUsableByRefreshTokenHash(
    refreshTokenHash: SessionRefreshTokenHash,
    referenceDate: Date = new Date(),
  ): Promise<SessionAggregate | null> {
    PrismaSessionRepository.ensureValidDate(
      referenceDate,
      'Session refresh-token reference date',
    );

    if (refreshTokenHash === undefined) {
      throw new Error('Session refresh-token hash is required.');
    }

    const record = await this.prisma.session.findFirst({
      where: {
        refreshTokenHash: refreshTokenHash.value,
        status: 'ACTIVE',

        expiresAt: {
          gt: referenceDate,
        },

        revokedAt: null,
      },
    });

    if (record === null) {
      return null;
    }

    return SessionPrismaMapper.toDomain(record);
  }

  /**
   * Finds all Sessions using the supplied refresh-token hash.
   *
   * Normally the hash should be unique at the application/security level,
   * but this method intentionally supports duplicate detection.
   */
  public async findAllByRefreshTokenHash(
    refreshTokenHash: SessionRefreshTokenHash,
  ): Promise<SessionAggregate[]> {
    if (refreshTokenHash === undefined) {
      throw new Error('Session refresh-token hash is required.');
    }

    const records = await this.prisma.session.findMany({
      where: {
        refreshTokenHash: refreshTokenHash.value,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => SessionPrismaMapper.toDomain(record));
  }

  // ===========================================================================

  // Token Family

  // ===========================================================================

  /**
   * Finds all Sessions belonging to a token family.
   */
  public async findByTokenFamilyPublicId(
    tokenFamilyPublicId: SessionTokenFamilyPublicId,
  ): Promise<SessionAggregate[]> {
    if (tokenFamilyPublicId === undefined) {
      throw new Error('Session token-family public ID is required.');
    }

    const records = await this.prisma.session.findMany({
      where: {
        tokenFamilyPublicId: tokenFamilyPublicId.value,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => SessionPrismaMapper.toDomain(record));
  }

  /**
   * Finds all active Sessions belonging to a token family.
   */
  public async findActiveByTokenFamilyPublicId(
    tokenFamilyPublicId: SessionTokenFamilyPublicId,
  ): Promise<SessionAggregate[]> {
    if (tokenFamilyPublicId === undefined) {
      throw new Error('Session token-family public ID is required.');
    }

    const records = await this.prisma.session.findMany({
      where: {
        tokenFamilyPublicId: tokenFamilyPublicId.value,
        status: 'ACTIVE',
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => SessionPrismaMapper.toDomain(record));
  }

  /**
   * Finds all revoked Sessions belonging to a token family.
   */
  public async findRevokedByTokenFamilyPublicId(
    tokenFamilyPublicId: SessionTokenFamilyPublicId,
  ): Promise<SessionAggregate[]> {
    if (tokenFamilyPublicId === undefined) {
      throw new Error('Session token-family public ID is required.');
    }

    const records = await this.prisma.session.findMany({
      where: {
        tokenFamilyPublicId: tokenFamilyPublicId.value,
        status: 'REVOKED',
      },

      orderBy: {
        revokedAt: 'asc',
      },
    });

    return records.map((record) => SessionPrismaMapper.toDomain(record));
  }

  /**
   * Finds all non-revoked Sessions in a token family.
   */
  public async findNonRevokedByTokenFamilyPublicId(
    tokenFamilyPublicId: SessionTokenFamilyPublicId,
  ): Promise<SessionAggregate[]> {
    if (tokenFamilyPublicId === undefined) {
      throw new Error('Session token-family public ID is required.');
    }

    const records = await this.prisma.session.findMany({
      where: {
        tokenFamilyPublicId: tokenFamilyPublicId.value,
        status: {
          not: 'REVOKED',
        },
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => SessionPrismaMapper.toDomain(record));
  }

  // ===========================================================================

  // Token Rotation Lineage

  // ===========================================================================

  /**
   * Finds the Session that was replaced by the supplied Session public ID.
   *
   * Persistence field:
   *
   *     replacedBySessionPublicId
   */
  public async findByReplacedBySessionPublicId(
    replacedBySessionPublicId: SessionReplacedByPublicId,
  ): Promise<SessionAggregate | null> {
    if (replacedBySessionPublicId === undefined) {
      throw new Error('Session replaced-by public ID is required.');
    }

    const record = await this.prisma.session.findFirst({
      where: {
        replacedBySessionPublicId: replacedBySessionPublicId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return SessionPrismaMapper.toDomain(record);
  }

  /**
   * Finds all Sessions that have been replaced.
   */
  public async findReplaced(): Promise<SessionAggregate[]> {
    const records = await this.prisma.session.findMany({
      where: {
        replacedBySessionPublicId: {
          not: null,
        },
      },

      orderBy: {
        updatedAt: 'asc',
      },
    });

    return records.map((record) => SessionPrismaMapper.toDomain(record));
  }

  /**
   * Finds all Sessions that have not been replaced.
   */
  public async findNotReplaced(): Promise<SessionAggregate[]> {
    const records = await this.prisma.session.findMany({
      where: {
        replacedBySessionPublicId: null,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => SessionPrismaMapper.toDomain(record));
  }

  /**
   * Finds all replaced Sessions belonging to a token family.
   */
  public async findReplacedByTokenFamilyPublicId(
    tokenFamilyPublicId: SessionTokenFamilyPublicId,
  ): Promise<SessionAggregate[]> {
    if (tokenFamilyPublicId === undefined) {
      throw new Error('Session token-family public ID is required.');
    }

    const records = await this.prisma.session.findMany({
      where: {
        tokenFamilyPublicId: tokenFamilyPublicId.value,

        replacedBySessionPublicId: {
          not: null,
        },
      },

      orderBy: {
        updatedAt: 'asc',
      },
    });

    return records.map((record) => SessionPrismaMapper.toDomain(record));
  }

  // ===========================================================================

  // Device Queries

  // ===========================================================================

  /**
   * Finds all active Sessions associated with a Device.
   */
  public async findActiveByDevicePublicId(
    devicePublicId: SessionDevicePublicId,
  ): Promise<SessionAggregate[]> {
    if (devicePublicId === undefined) {
      throw new Error('Session Device public ID is required.');
    }

    const records = await this.prisma.session.findMany({
      where: {
        devicePublicId: devicePublicId.value,
        status: 'ACTIVE',
      },

      orderBy: {
        lastActivityAt: 'desc',
      },
    });

    return records.map((record) => SessionPrismaMapper.toDomain(record));
  }

  /**
   * Finds all currently usable Sessions associated with a Device.
   */
  public async findUsableByDevicePublicId(
    devicePublicId: SessionDevicePublicId,
    referenceDate: Date = new Date(),
  ): Promise<SessionAggregate[]> {
    PrismaSessionRepository.ensureValidDate(
      referenceDate,
      'Session usability reference date',
    );

    if (devicePublicId === undefined) {
      throw new Error('Session Device public ID is required.');
    }

    const records = await this.prisma.session.findMany({
      where: {
        devicePublicId: devicePublicId.value,
        status: 'ACTIVE',

        expiresAt: {
          gt: referenceDate,
        },

        revokedAt: null,
      },

      orderBy: {
        lastActivityAt: 'desc',
      },
    });

    return records.map((record) => SessionPrismaMapper.toDomain(record));
  }

  /**
   * Finds Sessions without an associated Device.
   */
  public async findWithoutDevice(): Promise<SessionAggregate[]> {
    const records = await this.prisma.session.findMany({
      where: {
        devicePublicId: null,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => SessionPrismaMapper.toDomain(record));
  }

  /**
   * Finds Sessions with an associated Device.
   */
  public async findWithDevice(): Promise<SessionAggregate[]> {
    const records = await this.prisma.session.findMany({
      where: {
        devicePublicId: {
          not: null,
        },
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => SessionPrismaMapper.toDomain(record));
  }

  // ===========================================================================

  // Audit Queries

  // ===========================================================================

  /**
   * Finds Sessions created after the supplied timestamp.
   */
  public async findCreatedAfter(
    createdAfter: Date,
  ): Promise<SessionAggregate[]> {
    PrismaSessionRepository.ensureValidDate(
      createdAfter,
      'Session creation audit date',
    );

    const records = await this.prisma.session.findMany({
      where: {
        createdAt: {
          gt: createdAfter,
        },
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => SessionPrismaMapper.toDomain(record));
  }

  /**
   * Finds Sessions created before the supplied timestamp.
   */
  public async findCreatedBefore(
    createdBefore: Date,
  ): Promise<SessionAggregate[]> {
    PrismaSessionRepository.ensureValidDate(
      createdBefore,
      'Session creation audit date',
    );

    const records = await this.prisma.session.findMany({
      where: {
        createdAt: {
          lt: createdBefore,
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => SessionPrismaMapper.toDomain(record));
  }

  /**
   * Finds Sessions updated after the supplied timestamp.
   */
  public async findUpdatedAfter(
    updatedAfter: Date,
  ): Promise<SessionAggregate[]> {
    PrismaSessionRepository.ensureValidDate(
      updatedAfter,
      'Session update audit date',
    );

    const records = await this.prisma.session.findMany({
      where: {
        updatedAt: {
          gt: updatedAfter,
        },
      },

      orderBy: {
        updatedAt: 'asc',
      },
    });

    return records.map((record) => SessionPrismaMapper.toDomain(record));
  }

  /**
   * Finds Sessions updated before the supplied timestamp.
   */
  public async findUpdatedBefore(
    updatedBefore: Date,
  ): Promise<SessionAggregate[]> {
    PrismaSessionRepository.ensureValidDate(
      updatedBefore,
      'Session update audit date',
    );

    const records = await this.prisma.session.findMany({
      where: {
        updatedAt: {
          lt: updatedBefore,
        },
      },

      orderBy: {
        updatedAt: 'desc',
      },
    });

    return records.map((record) => SessionPrismaMapper.toDomain(record));
  }

  /**
   * Finds all Sessions belonging to an Identity ordered by most recent
   * activity.
   */
  public async findByIdentityPublicIdOrderedByLastActivity(
    identityPublicId: SessionIdentityPublicId,
  ): Promise<SessionAggregate[]> {
    if (identityPublicId === undefined) {
      throw new Error('Session Identity public ID is required.');
    }

    const records = await this.prisma.session.findMany({
      where: {
        identityPublicId: identityPublicId.value,
      },

      orderBy: {
        lastActivityAt: 'desc',
      },
    });

    return records.map((record) => SessionPrismaMapper.toDomain(record));
  }

  // ===========================================================================

  // Existence

  // ===========================================================================

  /**
   * Returns true when a Session exists by public identifier.
   */
  public async existsByPublicId(publicId: SessionPublicId): Promise<boolean> {
    if (publicId === undefined) {
      throw new Error('Session public ID is required.');
    }

    const record = await this.prisma.session.findUnique({
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
   * Returns true when a Session exists by internal identifier.
   */
  public async existsById(id: UniqueEntityId): Promise<boolean> {
    if (id === undefined) {
      throw new Error('Session internal ID is required.');
    }

    const record = await this.prisma.session.findUnique({
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
   * Returns true when at least one Session exists for an Identity.
   */
  public async existsByIdentityPublicId(
    identityPublicId: SessionIdentityPublicId,
  ): Promise<boolean> {
    if (identityPublicId === undefined) {
      throw new Error('Session Identity public ID is required.');
    }

    const record = await this.prisma.session.findFirst({
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
   * Returns true when a Session exists with the supplied public identifier
   * and Identity.
   */
  public async existsByPublicIdAndIdentityPublicId(
    publicId: SessionPublicId,
    identityPublicId: SessionIdentityPublicId,
  ): Promise<boolean> {
    if (publicId === undefined) {
      throw new Error('Session public ID is required.');
    }

    if (identityPublicId === undefined) {
      throw new Error('Session Identity public ID is required.');
    }

    const record = await this.prisma.session.findFirst({
      where: {
        publicId: publicId.value,
        identityPublicId: identityPublicId.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Returns true when at least one Session exists for a Device.
   */
  public async existsByDevicePublicId(
    devicePublicId: SessionDevicePublicId,
  ): Promise<boolean> {
    if (devicePublicId === undefined) {
      throw new Error('Session Device public ID is required.');
    }

    const record = await this.prisma.session.findFirst({
      where: {
        devicePublicId: devicePublicId.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Returns true when at least one Session exists in a token family.
   */
  public async existsByTokenFamilyPublicId(
    tokenFamilyPublicId: SessionTokenFamilyPublicId,
  ): Promise<boolean> {
    if (tokenFamilyPublicId === undefined) {
      throw new Error('Session token-family public ID is required.');
    }

    const record = await this.prisma.session.findFirst({
      where: {
        tokenFamilyPublicId: tokenFamilyPublicId.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Returns true when a Session exists with the supplied refresh-token hash.
   */
  public async existsByRefreshTokenHash(
    refreshTokenHash: SessionRefreshTokenHash,
  ): Promise<boolean> {
    if (refreshTokenHash === undefined) {
      throw new Error('Session refresh-token hash is required.');
    }

    const record = await this.prisma.session.findFirst({
      where: {
        refreshTokenHash: refreshTokenHash.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Returns true when at least one Session exists with the supplied status.
   */
  public async existsByStatus(status: SessionStatus): Promise<boolean> {
    if (status === undefined) {
      throw new Error('Session status is required.');
    }

    return this.existsByStatusValue(status.value);
  }

  /**
   * Returns true when at least one active Session exists.
   */
  public async existsActive(): Promise<boolean> {
    return this.existsByStatusValue('ACTIVE');
  }

  /**
   * Returns true when at least one revoked Session exists.
   */
  public async existsRevoked(): Promise<boolean> {
    return this.existsByStatusValue('REVOKED');
  }

  /**
   * Returns true when at least one expired Session exists by persisted
   * lifecycle status.
   */
  public async existsExpired(): Promise<boolean> {
    return this.existsByStatusValue('EXPIRED');
  }

  /**
   * Returns true when at least one Session has passed its expiry timestamp.
   */
  public async existsExpiredByDate(
    referenceDate: Date = new Date(),
  ): Promise<boolean> {
    PrismaSessionRepository.ensureValidDate(
      referenceDate,
      'Session expiry reference date',
    );

    const record = await this.prisma.session.findFirst({
      where: {
        expiresAt: {
          lte: referenceDate,
        },
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Returns true when at least one Session has been replaced.
   */
  public async existsReplaced(): Promise<boolean> {
    const record = await this.prisma.session.findFirst({
      where: {
        replacedBySessionPublicId: {
          not: null,
        },
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Returns true when at least one active Session exists in a token family.
   */
  public async existsActiveByTokenFamilyPublicId(
    tokenFamilyPublicId: SessionTokenFamilyPublicId,
  ): Promise<boolean> {
    if (tokenFamilyPublicId === undefined) {
      throw new Error('Session token-family public ID is required.');
    }

    const record = await this.prisma.session.findFirst({
      where: {
        tokenFamilyPublicId: tokenFamilyPublicId.value,
        status: 'ACTIVE',
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Returns true when at least one currently usable Session exists for
   * an Identity.
   */
  public async existsUsableByIdentityPublicId(
    identityPublicId: SessionIdentityPublicId,
    referenceDate: Date = new Date(),
  ): Promise<boolean> {
    PrismaSessionRepository.ensureValidDate(
      referenceDate,
      'Session usability reference date',
    );

    if (identityPublicId === undefined) {
      throw new Error('Session Identity public ID is required.');
    }

    const record = await this.prisma.session.findFirst({
      where: {
        identityPublicId: identityPublicId.value,
        status: 'ACTIVE',

        expiresAt: {
          gt: referenceDate,
        },

        revokedAt: null,
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
   * Finds Sessions by a Prisma lifecycle status value.
   *
   * Used internally by status convenience methods.
   */
  private async findByStatusValue(
    status: PrismaSession['status'],
  ): Promise<SessionAggregate[]> {
    const records = await this.prisma.session.findMany({
      where: {
        status,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => SessionPrismaMapper.toDomain(record));
  }

  /**
   * Checks whether at least one Session exists with a Prisma lifecycle
   * status value.
   */
  private async existsByStatusValue(
    status: PrismaSession['status'],
  ): Promise<boolean> {
    const record = await this.prisma.session.findFirst({
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

export default PrismaSessionRepository;
