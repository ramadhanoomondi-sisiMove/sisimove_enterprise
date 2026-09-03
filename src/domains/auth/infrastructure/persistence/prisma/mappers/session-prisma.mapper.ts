// -----------------------------------------------------------------------------
// Session — Prisma Mapper
// -----------------------------------------------------------------------------
//
// Maps the Session aggregate:
//
// SessionAggregate
// └── SessionEntity
//
// Persistence:
//
// Session
//
// Session is an independent aggregate root.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { Session as PrismaSession } from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { SessionAggregate } from '../../../../domain/aggregates/session.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { SessionEntity } from '../../../../domain/entities/session.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  SessionPublicId,
  SessionIdentityPublicId,
  SessionDevicePublicId,
  SessionStatus,
  SessionRefreshTokenHash,
  SessionTokenFamilyPublicId,
  SessionReplacedByPublicId,
  SessionIpAddress,
  SessionUserAgent,
  SessionCountryCode,
  SessionCity,
  SessionAuthenticatedAt,
  SessionLastActivityAt,
  SessionExpiresAt,
  SessionRevokedAt,
  SessionRevocationReason,
} from '../../../../domain/value-objects';

// =============================================================================
// Persistence Types
// =============================================================================

/**
 * Persistence representation of the Session aggregate.
 *
 * Session is a single-entity aggregate, therefore no child collection
 * is required in the persistence structure.
 */
export interface SessionPersistence {
  session: ReturnType<typeof SessionPrismaMapper.sessionToPersistence>;
}

// =============================================================================
// Mapper
// =============================================================================

export class SessionPrismaMapper {
  // ===========================================================================
  // Prisma → Domain Aggregate
  // ===========================================================================

  /**
   * Rehydrates a complete Session aggregate from a Prisma Session record.
   *
   * Rehydration does not emit domain events.
   */
  public static toDomain(record: PrismaSession): SessionAggregate {
    return SessionAggregate.rehydrate(this.sessionToDomain(record));
  }

  // ===========================================================================
  // Prisma → Domain Entity
  // ===========================================================================

  /**
   * Rehydrates a SessionEntity from a persisted Prisma Session record.
   *
   * Prisma primitives are converted into dedicated domain value objects.
   *
   * Nullable Prisma fields are mapped to undefined in the domain model.
   */
  public static sessionToDomain(record: PrismaSession): SessionEntity {
    if (record === undefined) {
      throw new Error('Session Prisma record is required.');
    }

    const publicId = new SessionPublicId(record.publicId);

    return SessionEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        identityPublicId: new SessionIdentityPublicId(record.identityPublicId),

        devicePublicId:
          record.devicePublicId !== null
            ? new SessionDevicePublicId(record.devicePublicId)
            : undefined,

        // ---------------------------------------------------------------------
        // Session Status
        // ---------------------------------------------------------------------

        status: SessionStatus.create(record.status),

        // ---------------------------------------------------------------------
        // Refresh Token
        // ---------------------------------------------------------------------

        refreshTokenHash: SessionRefreshTokenHash.create(
          record.refreshTokenHash,
        ),

        tokenFamilyPublicId: new SessionTokenFamilyPublicId(
          record.tokenFamilyPublicId,
        ),

        replacedBySessionPublicId:
          record.replacedBySessionPublicId !== null
            ? new SessionReplacedByPublicId(record.replacedBySessionPublicId)
            : undefined,

        // ---------------------------------------------------------------------
        // Session Context
        // ---------------------------------------------------------------------

        ipAddress:
          record.ipAddress !== null
            ? SessionIpAddress.create(record.ipAddress)
            : undefined,

        userAgent:
          record.userAgent !== null
            ? SessionUserAgent.create(record.userAgent)
            : undefined,

        countryCode:
          record.countryCode !== null
            ? SessionCountryCode.create(record.countryCode)
            : undefined,

        city:
          record.city !== null ? SessionCity.create(record.city) : undefined,

        // ---------------------------------------------------------------------
        // Authentication
        // ---------------------------------------------------------------------

        authenticatedAt: SessionAuthenticatedAt.create(record.authenticatedAt),

        // ---------------------------------------------------------------------
        // Activity
        // ---------------------------------------------------------------------

        lastActivityAt: SessionLastActivityAt.create(record.lastActivityAt),

        // ---------------------------------------------------------------------
        // Expiry
        // ---------------------------------------------------------------------

        expiresAt: SessionExpiresAt.create(record.expiresAt),

        // ---------------------------------------------------------------------
        // Revocation
        // ---------------------------------------------------------------------

        revokedAt:
          record.revokedAt !== null
            ? SessionRevokedAt.create(record.revokedAt)
            : undefined,

        revokedReason:
          record.revokedReason !== null
            ? SessionRevocationReason.create(record.revokedReason)
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
   * Maps SessionEntity into its Prisma persistence shape.
   *
   * Domain value objects are serialized into primitive persistence values.
   *
   * Nullable Prisma fields receive null when the corresponding domain
   * value object is undefined.
   */
  public static sessionToPersistence(entity: SessionEntity): PrismaSession {
    if (entity === undefined) {
      throw new Error('Session entity is required.');
    }

    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      id: entity.id.toString(),

      publicId: entity.publicId.value,

      identityPublicId: entity.identityPublicId.value,

      devicePublicId: entity.devicePublicId?.value ?? null,

      // -----------------------------------------------------------------------
      // Session Status
      // -----------------------------------------------------------------------

      status: entity.status.value,

      // -----------------------------------------------------------------------
      // Refresh Token
      // -----------------------------------------------------------------------

      refreshTokenHash: entity.refreshTokenHash.value,

      tokenFamilyPublicId: entity.tokenFamilyPublicId.value,

      replacedBySessionPublicId:
        entity.replacedBySessionPublicId?.value ?? null,

      // -----------------------------------------------------------------------
      // Session Context
      // -----------------------------------------------------------------------

      ipAddress: entity.ipAddress?.value ?? null,

      userAgent: entity.userAgent?.value ?? null,

      countryCode: entity.countryCode?.value ?? null,

      city: entity.city?.value ?? null,

      // -----------------------------------------------------------------------
      // Authentication
      // -----------------------------------------------------------------------

      authenticatedAt: entity.authenticatedAt.value,

      // -----------------------------------------------------------------------
      // Activity
      // -----------------------------------------------------------------------

      lastActivityAt: entity.lastActivityAt.value,

      // -----------------------------------------------------------------------
      // Expiry
      // -----------------------------------------------------------------------

      expiresAt: entity.expiresAt.value,

      // -----------------------------------------------------------------------
      // Revocation
      // -----------------------------------------------------------------------

      revokedAt: entity.revokedAt?.value ?? null,

      revokedReason:
        (entity.revokedReason?.value as PrismaSession['revokedReason']) ?? null,

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
   * Converts the complete Session aggregate into its persistence structure.
   *
   * Session is a single-entity aggregate, so the aggregate persistence
   * structure contains only the Session root record.
   */
  public static toPersistence(aggregate: SessionAggregate): SessionPersistence {
    if (aggregate === undefined) {
      throw new Error('Session aggregate is required.');
    }

    return {
      session: this.sessionToPersistence(aggregate.session),
    };
  }

  // ===========================================================================
  // Component Mapping
  // ===========================================================================

  /**
   * Maps a Prisma Session record directly into SessionEntity.
   *
   * Useful for repository-level component operations.
   */
  public static toSessionDomain(record: PrismaSession): SessionEntity {
    return this.sessionToDomain(record);
  }

  /**
   * Maps a Prisma Session record into SessionAggregate.
   *
   * Equivalent to toDomain().
   */
  public static toSessionAggregate(record: PrismaSession): SessionAggregate {
    return this.toDomain(record);
  }

  // ===========================================================================
  // Generic Domain Component Mapping
  // ===========================================================================

  /**
   * Maps a supported Prisma Session record into its corresponding
   * domain component.
   *
   * Session has only one aggregate-owned entity, so this resolves directly
   * to SessionEntity.
   */
  public static toDomainComponent(record: PrismaSession): SessionEntity {
    return this.sessionToDomain(record);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default SessionPrismaMapper;
