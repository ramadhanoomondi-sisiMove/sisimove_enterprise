// -----------------------------------------------------------------------------
// Identity Prisma Mapper
// -----------------------------------------------------------------------------
//
// Maps:
//
// Domain
// IdentityAggregate
// └── IdentityEntity
//     └── IdentityRoleEntity[]
//
// Persistence
// Identity
// └── IdentityRole
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Prisma → Domain
// - Domain → persistence-neutral data
// - Complete aggregate rehydration
//
// This mapper does NOT:
//
// - access Prisma services;
// - perform database queries;
// - resolve foreign keys;
// - load relations;
// - emit domain events;
// - mutate aggregates;
// - perform application orchestration.
//
// -----------------------------------------------------------------------------
//
// Persistence IDs vs Public IDs
//
// Prisma internal IDs:
//
// - Identity.id
// - IdentityRole.id
// - Role.id
// - IdentityRole.assignedById
// - IdentityRole.revokedById
//
// Domain public IDs:
//
// - IdentityPublicId
// - IdentityRolePublicId
// - IdentityRoleIdentityPublicId
// - IdentityRoleRolePublicId
//
// The mapper preserves this separation.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type {
  Identity as PrismaIdentity,
  IdentityRole as PrismaIdentityRole,
  Role as PrismaRole,
  IdentityStatus as PrismaIdentityStatus,
} from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { IdentityAggregate } from '../../../../domain/aggregates/identity.aggregate';

// -----------------------------------------------------------------------------
// Entities
// -----------------------------------------------------------------------------

import { IdentityEntity } from '../../../../domain/entities/identity.entity';

import { IdentityRoleEntity } from '../../../../domain/entities/identity-role.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  IdentityPublicId,
  IdentityEmail,
  IdentityPhoneNumber,
  IdentityStatus,
  IdentityRolePublicId,
  IdentityRoleIdentityPublicId,
  IdentityRoleRolePublicId,
} from '../../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Domain Value Types
// -----------------------------------------------------------------------------

import type { IdentityStatusValue } from '../../../../domain/value-objects/identity-status.vo';

// =============================================================================
// Prisma Relation Types
// =============================================================================

/**
 * IdentityRole with all relations required for domain rehydration.
 *
 * identity:
 *   Required because it provides the owning Identity public ID.
 *
 * role:
 *   Required because it provides the assigned Role public ID.
 *
 * assignedBy:
 *   Optional audit actor.
 *
 * revokedBy:
 *   Optional audit actor.
 */
export type IdentityRoleWithRelations = PrismaIdentityRole & {
  identity: Pick<PrismaIdentity, 'id' | 'publicId'>;

  role: Pick<PrismaRole, 'id' | 'publicId'>;

  assignedBy: Pick<PrismaIdentity, 'id' | 'publicId'> | null;

  revokedBy: Pick<PrismaIdentity, 'id' | 'publicId'> | null;
};

/**
 * Identity with its aggregate-owned IdentityRole collection.
 *
 * Complete aggregate rehydration requires identityRoles to be loaded.
 */
export type IdentityWithRoles = PrismaIdentity & {
  identityRoles: IdentityRoleWithRelations[];
};

// =============================================================================
// Persistence Types
// =============================================================================

/**
 * Persistence-neutral Identity representation.
 *
 * These values correspond directly to IdentityEntity.
 */
export interface IdentityPersistence {
  id: string;

  publicId: string;

  email: string;

  phoneNumber: string;

  status: PrismaIdentityStatus;

  activatedAt: Date | null;

  suspendedAt: Date | null;

  closedAt: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

/**
 * Persistence-neutral IdentityRole representation.
 *
 * IMPORTANT:
 *
 * The role and identity references remain public IDs.
 *
 * The repository is responsible for resolving them into Prisma internal IDs.
 */
export interface IdentityRolePersistence {
  id: string;

  publicId: string;

  identityPublicId: string;

  rolePublicId: string;

  assignedByPublicId: string | null;

  assignedAt: Date;

  expiresAt: Date | null;

  revokedAt: Date | null;

  revokedByPublicId: string | null;

  createdAt: Date;

  updatedAt: Date;
}

/**
 * Complete Identity aggregate persistence representation.
 */
export interface IdentityAggregatePersistence {
  identity: IdentityPersistence;

  identityRoles: IdentityRolePersistence[];
}

// =============================================================================
// Prisma → Domain Enum Conversion
// =============================================================================

/**
 * Converts Prisma IdentityStatus into the domain IdentityStatus value.
 *
 * Prisma enums must not leak into the domain layer.
 */
function toIdentityStatus(value: PrismaIdentityStatus): IdentityStatusValue {
  switch (value) {
    case 'PENDING':
      return 'PENDING';

    case 'ACTIVE':
      return 'ACTIVE';

    case 'SUSPENDED':
      return 'SUSPENDED';

    case 'CLOSED':
      return 'CLOSED';

    default:
      throw new Error(`Invalid persisted Identity status "${String(value)}".`);
  }
}

// =============================================================================
// Mapper
// =============================================================================

export class IdentityPrismaMapper {
  // ===========================================================================
  // Prisma Identity → Domain Aggregate
  // ===========================================================================

  /**
   * Rehydrates the complete Identity aggregate.
   *
   * Aggregate:
   *
   * IdentityAggregate
   * └── IdentityEntity
   *     └── IdentityRoleEntity[]
   */
  public static toDomain(record: IdentityWithRoles): IdentityAggregate {
    const identityRoles = record.identityRoles.map((identityRole) =>
      this.identityRoleToDomain(identityRole),
    );

    const publicId = new IdentityPublicId(record.publicId);

    const identity = IdentityEntity.rehydrate(
      {
        publicId,

        email: IdentityEmail.create(record.email),

        phoneNumber: IdentityPhoneNumber.create(record.phoneNumber),

        status: IdentityStatus.create(toIdentityStatus(record.status)),

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,

        ...(record.activatedAt !== null
          ? {
              activatedAt: record.activatedAt,
            }
          : {}),

        ...(record.suspendedAt !== null
          ? {
              suspendedAt: record.suspendedAt,
            }
          : {}),

        ...(record.closedAt !== null
          ? {
              closedAt: record.closedAt,
            }
          : {}),

        identityRoles,
      },

      new UniqueEntityId(record.id),

      publicId,
    );

    return IdentityAggregate.rehydrate(identity);
  }

  // ===========================================================================
  // Prisma Identity → Domain Entity
  // ===========================================================================

  /**
   * Maps a bare Prisma Identity record into IdentityEntity.
   *
   * IdentityRole children are intentionally excluded.
   */
  public static identityToDomain(record: PrismaIdentity): IdentityEntity {
    const publicId = new IdentityPublicId(record.publicId);

    return IdentityEntity.rehydrate(
      {
        publicId,

        email: IdentityEmail.create(record.email),

        phoneNumber: IdentityPhoneNumber.create(record.phoneNumber),

        status: IdentityStatus.create(toIdentityStatus(record.status)),

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,

        ...(record.activatedAt !== null
          ? {
              activatedAt: record.activatedAt,
            }
          : {}),

        ...(record.suspendedAt !== null
          ? {
              suspendedAt: record.suspendedAt,
            }
          : {}),

        ...(record.closedAt !== null
          ? {
              closedAt: record.closedAt,
            }
          : {}),

        identityRoles: [],
      },

      new UniqueEntityId(record.id),

      publicId,
    );
  }

  // ===========================================================================
  // Prisma IdentityRole → Domain Entity
  // ===========================================================================

  /**
   * Rehydrates a complete IdentityRoleEntity.
   *
   * Required relations:
   *
   * - identity
   * - role
   *
   * Optional relations:
   *
   * - assignedBy
   * - revokedBy
   */
  public static identityRoleToDomain(
    record: IdentityRoleWithRelations,
  ): IdentityRoleEntity {
    if (record.identity === null || record.identity === undefined) {
      throw new Error(
        `IdentityRole "${record.publicId}" cannot be rehydrated without its owning Identity relation.`,
      );
    }

    if (record.role === null || record.role === undefined) {
      throw new Error(
        `IdentityRole "${record.publicId}" cannot be rehydrated without its Role relation.`,
      );
    }

    const publicId = new IdentityRolePublicId(record.publicId);

    const identityPublicId = new IdentityRoleIdentityPublicId(
      record.identity.publicId,
    );

    const rolePublicId = new IdentityRoleRolePublicId(record.role.publicId);

    const assignedByPublicId =
      record.assignedBy !== null
        ? new IdentityPublicId(record.assignedBy.publicId)
        : undefined;

    const revokedByPublicId =
      record.revokedBy !== null
        ? new IdentityPublicId(record.revokedBy.publicId)
        : undefined;

    return IdentityRoleEntity.rehydrate(
      {
        publicId,

        identityPublicId,

        rolePublicId,

        ...(assignedByPublicId !== undefined
          ? {
              assignedByPublicId,
            }
          : {}),

        assignedAt: record.assignedAt,

        ...(record.expiresAt !== null
          ? {
              expiresAt: record.expiresAt,
            }
          : {}),

        ...(record.revokedAt !== null
          ? {
              revokedAt: record.revokedAt,
            }
          : {}),

        ...(revokedByPublicId !== undefined
          ? {
              revokedByPublicId,
            }
          : {}),

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },

      new UniqueEntityId(record.id),

      publicId,
    );
  }

  // ===========================================================================
  // Domain Identity → Persistence
  // ===========================================================================

  /**
   * Maps IdentityEntity into persistence-neutral data.
   *
   * This exactly matches the current Prisma Identity model.
   *
   * There is intentionally NO IdentityType here.
   */
  public static identityToPersistence(
    entity: IdentityEntity,
  ): IdentityPersistence {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      email: entity.email.value,

      phoneNumber: entity.phoneNumber.value,

      status: entity.status.value,

      activatedAt: entity.activatedAt ?? null,

      suspendedAt: entity.suspendedAt ?? null,

      closedAt: entity.closedAt ?? null,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Domain IdentityRole → Persistence
  // ===========================================================================

  /**
   * Maps IdentityRoleEntity into persistence-neutral data.
   *
   * This intentionally does NOT resolve:
   *
   * - identityPublicId → identityId
   * - rolePublicId → roleId
   * - assignedByPublicId → assignedById
   * - revokedByPublicId → revokedById
   *
   * Those are repository responsibilities.
   */
  public static identityRoleToPersistence(
    entity: IdentityRoleEntity,
  ): IdentityRolePersistence {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      identityPublicId: entity.identityPublicId.value,

      rolePublicId: entity.rolePublicId.value,

      assignedByPublicId: entity.assignedByPublicId?.value ?? null,

      assignedAt: entity.assignedAt,

      expiresAt: entity.expiresAt ?? null,

      revokedAt: entity.revokedAt ?? null,

      revokedByPublicId: entity.revokedByPublicId?.value ?? null,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Aggregate → Persistence
  // ===========================================================================

  /**
   * Converts the complete Identity aggregate into persistence-neutral data.
   */
  public static toPersistence(
    aggregate: IdentityAggregate,
  ): IdentityAggregatePersistence {
    return {
      identity: this.identityToPersistence(aggregate.identity),

      identityRoles: aggregate.identityRoles.map((identityRole) =>
        this.identityRoleToPersistence(identityRole),
      ),
    };
  }

  // ===========================================================================
  // Component Mapping
  // ===========================================================================

  /**
   * Maps a bare Prisma Identity into IdentityEntity.
   */
  public static toIdentityDomain(record: PrismaIdentity): IdentityEntity {
    return this.identityToDomain(record);
  }

  /**
   * Maps a relation-expanded Prisma IdentityRole into
   * IdentityRoleEntity.
   */
  public static toIdentityRoleDomain(
    record: IdentityRoleWithRelations,
  ): IdentityRoleEntity {
    return this.identityRoleToDomain(record);
  }

  // ===========================================================================
  // Prisma Record Guards
  // ===========================================================================

  /**
   * Determines whether a record is a Prisma Identity.
   */
  private static isIdentityRecord(
    record: PrismaIdentity | IdentityRoleWithRelations,
  ): record is PrismaIdentity {
    return 'email' in record && 'phoneNumber' in record && 'status' in record;
  }

  /**
   * Determines whether a record is a relation-expanded IdentityRole.
   */
  private static isIdentityRoleRecord(
    record: PrismaIdentity | IdentityRoleWithRelations,
  ): record is IdentityRoleWithRelations {
    return (
      'identityId' in record &&
      'roleId' in record &&
      'assignedAt' in record &&
      'identity' in record &&
      'role' in record
    );
  }

  // ===========================================================================
  // Generic Component Mapping
  // ===========================================================================

  /**
   * Maps a supported Prisma record into its domain entity.
   *
   * IdentityRole requires relation-expanded data.
   */
  public static toDomainComponent(
    record: PrismaIdentity | IdentityRoleWithRelations,
  ): IdentityEntity | IdentityRoleEntity {
    if (this.isIdentityRecord(record)) {
      return this.identityToDomain(record);
    }

    if (this.isIdentityRoleRecord(record)) {
      return this.identityRoleToDomain(record);
    }

    throw new Error('Unsupported Identity Prisma record supplied to mapper.');
  }
}
