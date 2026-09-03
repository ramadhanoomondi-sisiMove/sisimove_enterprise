// -----------------------------------------------------------------------------
// Authentication — Prisma Mapper
// -----------------------------------------------------------------------------
//
// Maps the Authentication aggregate:
//
// AuthenticationAggregate
// └── AuthenticationEntity
//
// Persistence:
//
// Authentication
//
// Authentication is an independent aggregate root.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { Authentication as PrismaAuthentication } from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { AuthenticationAggregate } from '../../../../domain/aggregates/authentication.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { AuthenticationEntity } from '../../../../domain/entities/authentication.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  AuthenticationPublicId,
  AuthenticationIdentityPublicId,
  AuthenticationStatus,
  AuthenticationPasswordHash,
  AuthenticationPasswordVersion,
  AuthenticationPasswordChangedAt,
  AuthenticationPasswordMustChange,
  AuthenticationFailureCount,
  AuthenticationLastFailedAt,
  AuthenticationLockedAt,
  AuthenticationLockedUntil,
  AuthenticationFailureReason,
  AuthenticationLastAuthenticatedAt,
} from '../../../../domain/value-objects';

// =============================================================================
// Persistence Types
// =============================================================================

/**
 * Persistence representation of the Authentication aggregate.
 *
 * Authentication is a single-entity aggregate, therefore no child collection
 * is required in the persistence structure.
 */
export interface AuthenticationPersistence {
  authentication: ReturnType<
    typeof AuthenticationPrismaMapper.authenticationToPersistence
  >;
}

// =============================================================================
// Mapper
// =============================================================================

export class AuthenticationPrismaMapper {
  // ===========================================================================
  // Prisma → Domain Aggregate
  // ===========================================================================

  /**
   * Rehydrates a complete Authentication aggregate from a Prisma
   * Authentication record.
   *
   * Rehydration does not emit domain events.
   */
  public static toDomain(
    record: PrismaAuthentication,
  ): AuthenticationAggregate {
    return AuthenticationAggregate.rehydrate(
      this.authenticationToDomain(record),
    );
  }

  // ===========================================================================
  // Prisma → Domain Entity
  // ===========================================================================

  /**
   * Rehydrates an AuthenticationEntity from a persisted Prisma
   * Authentication record.
   *
   * Mapping:
   *
   * Prisma id
   *     ↓
   * UniqueEntityId
   *
   * Prisma publicId
   *     ↓
   * AuthenticationPublicId
   *
   * Prisma identityPublicId
   *     ↓
   * AuthenticationIdentityPublicId
   *
   * Prisma status
   *     ↓
   * AuthenticationStatus
   */
  public static authenticationToDomain(
    record: PrismaAuthentication,
  ): AuthenticationEntity {
    if (record === undefined || record === null) {
      throw new Error('Authentication Prisma record is required.');
    }

    // ---------------------------------------------------------------------------
    // Password State
    // ---------------------------------------------------------------------------
    //
    // The domain requires a password-backed Authentication.
    //
    // Prisma currently allows passwordHash to be nullable because the database
    // schema is more permissive than the domain model. The mapper therefore
    // protects the domain boundary by rejecting an invalid persisted state.
    //

    if (record.passwordHash === null) {
      throw new Error(
        `Authentication ${record.publicId} has no persisted password hash.`,
      );
    }

    if (record.passwordChangedAt === null) {
      throw new Error(
        `Authentication ${record.publicId} has no persisted password changed timestamp.`,
      );
    }

    // ---------------------------------------------------------------------------
    // Public Identity
    // ---------------------------------------------------------------------------

    const publicId = new AuthenticationPublicId(record.publicId);

    // ---------------------------------------------------------------------------
    // Domain Rehydration
    // ---------------------------------------------------------------------------

    return AuthenticationEntity.rehydrate(
      {
        // -----------------------------------------------------------------------
        // Identity
        // -----------------------------------------------------------------------

        identityPublicId: new AuthenticationIdentityPublicId(
          record.identityPublicId,
        ),

        // -----------------------------------------------------------------------
        // Authentication Status
        // -----------------------------------------------------------------------

        status: AuthenticationStatus.create(record.status),

        // -----------------------------------------------------------------------
        // Password
        // -----------------------------------------------------------------------

        passwordHash: AuthenticationPasswordHash.create(record.passwordHash),

        passwordVersion: AuthenticationPasswordVersion.create(
          record.passwordVersion,
        ),

        passwordChangedAt: AuthenticationPasswordChangedAt.create(
          record.passwordChangedAt,
        ),

        passwordMustChange: AuthenticationPasswordMustChange.create(
          record.passwordMustChange,
        ),

        // -----------------------------------------------------------------------
        // Authentication Failures
        // -----------------------------------------------------------------------

        failedAuthenticationCount: AuthenticationFailureCount.create(
          record.failedAuthenticationCount,
        ),

        lastFailedAuthenticationAt:
          record.lastFailedAuthenticationAt !== null
            ? AuthenticationLastFailedAt.create(
                record.lastFailedAuthenticationAt,
              )
            : undefined,

        // -----------------------------------------------------------------------
        // Lock State
        // -----------------------------------------------------------------------

        lockedAt:
          record.lockedAt !== null
            ? AuthenticationLockedAt.create(record.lockedAt)
            : undefined,

        lockedUntil:
          record.lockedUntil !== null
            ? AuthenticationLockedUntil.create(record.lockedUntil)
            : undefined,

        lockReason:
          record.lockReason !== null
            ? AuthenticationFailureReason.create(record.lockReason)
            : undefined,

        // -----------------------------------------------------------------------
        // Successful Authentication
        // -----------------------------------------------------------------------

        lastAuthenticatedAt:
          record.lastAuthenticatedAt !== null
            ? AuthenticationLastAuthenticatedAt.create(
                record.lastAuthenticatedAt,
              )
            : undefined,

        // -----------------------------------------------------------------------
        // Audit
        // -----------------------------------------------------------------------

        createdAt: new Date(record.createdAt.getTime()),

        updatedAt: new Date(record.updatedAt.getTime()),
      },

      // -------------------------------------------------------------------------
      // Entity Identity
      // -------------------------------------------------------------------------

      new UniqueEntityId(record.id),

      publicId,
    );
  }

  // ===========================================================================
  // Domain Entity → Prisma Persistence
  // ===========================================================================

  /**
   * Maps AuthenticationEntity into its Prisma persistence shape.
   *
   * Domain value objects are serialized into primitive persistence values.
   */
  public static authenticationToPersistence(entity: AuthenticationEntity): {
    id: string;
    publicId: string;
    identityPublicId: string;
    status: PrismaAuthentication['status'];
    passwordHash: string | null;
    passwordVersion: number;
    passwordChangedAt: Date | null;
    passwordMustChange: boolean;
    failedAuthenticationCount: number;
    lastFailedAuthenticationAt: Date | null;
    lockedAt: Date | null;
    lockedUntil: Date | null;
    lockReason: PrismaAuthentication['lockReason'];
    lastAuthenticatedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  } {
    if (entity === undefined) {
      throw new Error('Authentication entity is required.');
    }

    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      id: entity.id.toString(),

      publicId: entity.publicId.value,

      identityPublicId: entity.identityPublicId.value,

      // -----------------------------------------------------------------------
      // Authentication Status
      // -----------------------------------------------------------------------

      status: entity.status.value,

      // -----------------------------------------------------------------------
      // Password
      // -----------------------------------------------------------------------

      passwordHash: entity.passwordHash?.value ?? null,

      passwordVersion: entity.passwordVersion.value,

      passwordChangedAt: entity.passwordChangedAt?.value ?? null,

      passwordMustChange: entity.passwordMustChange.value,

      // -----------------------------------------------------------------------
      // Authentication Failures
      // -----------------------------------------------------------------------

      failedAuthenticationCount: entity.failedAuthenticationCount.value,

      lastFailedAuthenticationAt:
        entity.lastFailedAuthenticationAt?.value ?? null,

      // -----------------------------------------------------------------------
      // Lock State
      // -----------------------------------------------------------------------

      lockedAt: entity.lockedAt?.value ?? null,

      lockedUntil: entity.lockedUntil?.value ?? null,

      lockReason:
        (entity.lockReason?.value as PrismaAuthentication['lockReason']) ??
        null,

      // -----------------------------------------------------------------------
      // Successful Authentication
      // -----------------------------------------------------------------------

      lastAuthenticatedAt: entity.lastAuthenticatedAt?.value ?? null,

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
   * Converts the complete Authentication aggregate into its persistence
   * structure.
   *
   * Authentication is a single-entity aggregate, so the aggregate persistence
   * structure contains only the Authentication root record.
   */
  public static toPersistence(
    aggregate: AuthenticationAggregate,
  ): AuthenticationPersistence {
    if (aggregate === undefined) {
      throw new Error('Authentication aggregate is required.');
    }

    return {
      authentication: this.authenticationToPersistence(
        aggregate.authentication,
      ),
    };
  }

  // ===========================================================================
  // Component Mapping
  // ===========================================================================

  /**
   * Maps a Prisma Authentication record directly into AuthenticationEntity.
   *
   * Useful for repository-level component operations.
   */
  public static toAuthenticationDomain(
    record: PrismaAuthentication,
  ): AuthenticationEntity {
    return this.authenticationToDomain(record);
  }

  /**
   * Maps a Prisma Authentication record into AuthenticationAggregate.
   *
   * Equivalent to toDomain().
   */
  public static toAuthenticationAggregate(
    record: PrismaAuthentication,
  ): AuthenticationAggregate {
    return this.toDomain(record);
  }

  // ===========================================================================
  // Generic Domain Component Mapping
  // ===========================================================================

  /**
   * Maps a supported Prisma Authentication record into its corresponding
   * domain component.
   *
   * Authentication has only one aggregate-owned entity, so this resolves
   * directly to AuthenticationEntity.
   */
  public static toDomainComponent(
    record: PrismaAuthentication,
  ): AuthenticationEntity {
    return this.authenticationToDomain(record);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AuthenticationPrismaMapper;
