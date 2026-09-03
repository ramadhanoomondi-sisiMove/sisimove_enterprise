// -----------------------------------------------------------------------------
// Identity — Role Permission Prisma Mapper
// -----------------------------------------------------------------------------
//
// Maps the RolePermission aggregate:
//
// RolePermissionAggregate
// └── RolePermissionEntity
//
// Persistence:
//
// RolePermission
//
// RolePermission is an independent relationship aggregate.
//
// -----------------------------------------------------------------------------
//
// Relationship:
//
// Role
//   │
//   └───────────────┐
//                   │
//             RolePermission
//                   │
//   ┌───────────────┘
//   │
// Permission
//
// -----------------------------------------------------------------------------
//
// Persistence identity:
//
// Prisma:
//   id
//   publicId
//
// Domain:
//   UniqueEntityId
//   RolePermissionPublicId
//
// Relationship references:
//
// Prisma:
//   roleId
//   permissionId
//
// Domain:
//
//   RolePermissionRolePublicId
//   RolePermissionPermissionPublicId
//
// The mapper resolves Prisma foreign-key relationships through:
//
//   role.publicId
//   permission.publicId
//
// -----------------------------------------------------------------------------
//
// This mapper does NOT:
//
// - map RoleEntity;
// - map PermissionEntity;
// - persist Role;
// - persist Permission;
// - evaluate Role eligibility;
// - evaluate Permission eligibility;
// - evaluate authorization;
// - manage revocation policy.
//
// Those concerns belong to their respective aggregate/application boundaries.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type {
  Permission as PrismaPermission,
  Role as PrismaRole,
  RolePermission as PrismaRolePermission,
} from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { RolePermissionAggregate } from '../../../../domain/aggregates/role-permission.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { RolePermissionEntity } from '../../../../domain/entities/role-permission.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  RolePermissionPermissionPublicId,
  RolePermissionPublicId,
  RolePermissionRolePublicId,
} from '../../../../domain/value-objects';

// =============================================================================
// Prisma Relation Types
// =============================================================================

/**
 * Prisma RolePermission record with the relations required to reconstruct
 * the domain-level public references.
 *
 * The foreign keys remain persistence concerns:
 *
 * - roleId;
 * - permissionId.
 *
 * The domain receives opaque public references:
 *
 * - role.publicId;
 * - permission.publicId.
 */
export type RolePermissionWithRelations = PrismaRolePermission & {
  role: Pick<PrismaRole, 'id' | 'publicId'>;

  permission: Pick<PrismaPermission, 'id' | 'publicId'>;
};

// =============================================================================
// Persistence Types
// =============================================================================

/**
 * Persistence representation of the RolePermission aggregate.
 *
 * The mapper exposes the domain-facing relationship references.
 *
 * The repository/infrastructure layer resolves:
 *
 *   rolePublicId       -> roleId
 *   permissionPublicId -> permissionId
 */
export interface RolePermissionPersistence {
  rolePermission: ReturnType<
    typeof RolePermissionPrismaMapper.rolePermissionToPersistence
  >;
}

// =============================================================================
// Mapper
// =============================================================================

export class RolePermissionPrismaMapper {
  // ===========================================================================
  // Prisma → Domain Aggregate
  // ===========================================================================

  /**
   * Rehydrates the complete RolePermission aggregate.
   *
   * Rehydration never emits domain events.
   */
  public static toDomain(
    record: RolePermissionWithRelations,
  ): RolePermissionAggregate {
    if (record === undefined) {
      throw new Error('RolePermission Prisma record is required.');
    }

    return RolePermissionAggregate.rehydrate(
      this.rolePermissionToDomain(record),
    );
  }

  // ===========================================================================
  // Prisma → Domain Entity
  // ===========================================================================

  /**
   * Rehydrates RolePermissionEntity from Prisma.
   *
   * Mapping:
   *
   * Prisma:
   *
   *   id
   *       ↓
   *   UniqueEntityId
   *
   *   publicId
   *       ↓
   *   RolePermissionPublicId
   *
   *   role.publicId
   *       ↓
   *   RolePermissionRolePublicId
   *
   *   permission.publicId
   *       ↓
   *   RolePermissionPermissionPublicId
   */
  public static rolePermissionToDomain(
    record: RolePermissionWithRelations,
  ): RolePermissionEntity {
    if (record === undefined) {
      throw new Error('RolePermission Prisma record is required.');
    }

    // -------------------------------------------------------------------------
    // Required Prisma identity
    // -------------------------------------------------------------------------

    if (typeof record.id !== 'string' || record.id.trim().length === 0) {
      throw new Error(
        'RolePermission Prisma record must contain a valid internal ID.',
      );
    }

    if (
      typeof record.publicId !== 'string' ||
      record.publicId.trim().length === 0
    ) {
      throw new Error(
        'RolePermission Prisma record must contain a valid public ID.',
      );
    }

    // -------------------------------------------------------------------------
    // Required relations
    // -------------------------------------------------------------------------

    if (record.role === undefined || record.role === null) {
      throw new Error(
        `RolePermission "${record.publicId}" cannot be rehydrated without its Role relation.`,
      );
    }

    if (record.permission === undefined || record.permission === null) {
      throw new Error(
        `RolePermission "${record.publicId}" cannot be rehydrated without its Permission relation.`,
      );
    }

    if (
      typeof record.role.publicId !== 'string' ||
      record.role.publicId.trim().length === 0
    ) {
      throw new Error(
        `RolePermission "${record.publicId}" cannot be rehydrated because its Role relation has no valid public ID.`,
      );
    }

    if (
      typeof record.permission.publicId !== 'string' ||
      record.permission.publicId.trim().length === 0
    ) {
      throw new Error(
        `RolePermission "${record.publicId}" cannot be rehydrated because its Permission relation has no valid public ID.`,
      );
    }

    // -------------------------------------------------------------------------
    // Timestamp validation
    // -------------------------------------------------------------------------

    this.ensureValidDate(
      record.createdAt,
      `RolePermission "${record.publicId}" has an invalid createdAt timestamp.`,
    );

    this.ensureValidDate(
      record.updatedAt,
      `RolePermission "${record.publicId}" has an invalid updatedAt timestamp.`,
    );

    // -------------------------------------------------------------------------
    // Value Objects
    // -------------------------------------------------------------------------

    const publicId = new RolePermissionPublicId(record.publicId);

    const rolePublicId = new RolePermissionRolePublicId(record.role.publicId);

    const permissionPublicId = new RolePermissionPermissionPublicId(
      record.permission.publicId,
    );

    // -------------------------------------------------------------------------
    // Entity rehydration
    // -------------------------------------------------------------------------

    return RolePermissionEntity.rehydrate(
      {
        rolePublicId,

        permissionPublicId,

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },

      new UniqueEntityId(record.id),

      publicId,
    );
  }

  // ===========================================================================
  // RolePermission Entity → Persistence
  // ===========================================================================

  /**
   * Converts RolePermissionEntity into the domain-facing persistence shape.
   *
   * The entity contains public references rather than Prisma foreign keys.
   *
   * Therefore this method intentionally returns:
   *
   *   rolePublicId
   *   permissionPublicId
   *
   * rather than fabricating:
   *
   *   roleId
   *   permissionId
   *
   * The repository resolves those public references into internal foreign keys.
   */
  public static rolePermissionToPersistence(entity: RolePermissionEntity): {
    id: string;
    publicId: string;
    rolePublicId: string;
    permissionPublicId: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    if (entity === undefined) {
      throw new Error('RolePermission entity is required.');
    }

    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      id: entity.id.toString(),

      publicId: entity.publicId.value,

      // -----------------------------------------------------------------------
      // Relationship References
      // -----------------------------------------------------------------------

      rolePublicId: entity.rolePublicId.value,

      permissionPublicId: entity.permissionPublicId.value,

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
   * Converts the complete RolePermission aggregate into its persistence
   * structure.
   */
  public static toPersistence(
    aggregate: RolePermissionAggregate,
  ): RolePermissionPersistence {
    if (aggregate === undefined) {
      throw new Error('RolePermission aggregate is required.');
    }

    return {
      rolePermission: this.rolePermissionToPersistence(
        aggregate.rolePermission,
      ),
    };
  }

  // ===========================================================================
  // Component Mapping
  // ===========================================================================

  /**
   * Maps a relation-expanded Prisma RolePermission record into
   * RolePermissionEntity.
   */
  public static toRolePermissionDomain(
    record: RolePermissionWithRelations,
  ): RolePermissionEntity {
    return this.rolePermissionToDomain(record);
  }

  /**
   * Maps a relation-expanded Prisma RolePermission record into
   * RolePermissionAggregate.
   */
  public static toRolePermissionAggregate(
    record: RolePermissionWithRelations,
  ): RolePermissionAggregate {
    return this.toDomain(record);
  }

  /**
   * Maps a relation-expanded Prisma RolePermission record into the
   * corresponding domain entity.
   */
  public static toDomainComponent(
    record: RolePermissionWithRelations,
  ): RolePermissionEntity {
    return this.rolePermissionToDomain(record);
  }

  // ===========================================================================
  // Validation Helpers
  // ===========================================================================

  /**
   * Validates a persisted Date value.
   */
  private static ensureValidDate(value: Date, message: string): void {
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
      throw new Error(message);
    }
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RolePermissionPrismaMapper;
