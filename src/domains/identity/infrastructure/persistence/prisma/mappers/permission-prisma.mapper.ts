// -----------------------------------------------------------------------------
// Identity — Permission Prisma Mapper
// -----------------------------------------------------------------------------
//
// Maps the Permission aggregate:
//
// PermissionAggregate
// └── PermissionEntity
//
// Persistence:
//
// Permission
//
// Permission is an independent aggregate root.
//
// -----------------------------------------------------------------------------
//
// Identity:
//
// Prisma:
//   id
//   publicId
//
// Domain:
//   UniqueEntityId
//   PermissionPublicId
//
// IMPORTANT:
//
// PermissionEntity.rehydrate() has the following shape:
//
//     PermissionEntity.rehydrate(
//       props,
//       id,
//       publicId,
//     )
//
// Therefore:
//
// - publicId MUST NOT be placed inside PermissionProps;
// - id MUST remain a UniqueEntityId;
// - publicId MUST remain a PermissionPublicId.
//
// -----------------------------------------------------------------------------
//
// Value-object mapping:
//
// Prisma primitive
//      ↓
// Domain value object
//
// code
//      → PermissionCode
//
// resource
//      → PermissionResource
//
// action
//      → PermissionAction
//
// name remains a domain primitive string.
//
// -----------------------------------------------------------------------------
//
// Persistence mapping:
//
// Domain value object
//      ↓
// Prisma primitive
//
// PermissionCode
//      → string
//
// PermissionResource
//      → string
//
// PermissionAction
//      → string
//
// -----------------------------------------------------------------------------
//
// This mapper does NOT map:
//
// - RolePermission;
// - Role;
// - Identity;
// - IdentityRole.
//
// Those belong to separate aggregate / relationship boundaries.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { Permission as PrismaPermission } from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { PermissionAggregate } from '../../../../domain/aggregates/permission.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { PermissionEntity } from '../../../../domain/entities/permission.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  PermissionPublicId,
  PermissionCode,
  PermissionResource,
  PermissionAction,
} from '../../../../domain/value-objects';

// =============================================================================
// Persistence Types
// =============================================================================

/**
 * Persistence representation of the Permission aggregate.
 *
 * Permission is a single-entity aggregate, therefore no child collection is
 * included in this persistence structure.
 */
export interface PermissionPersistence {
  permission: ReturnType<typeof PermissionPrismaMapper.permissionToPersistence>;
}

// =============================================================================
// Mapper
// =============================================================================

export class PermissionPrismaMapper {
  // ===========================================================================
  // Prisma → Domain Aggregate
  // ===========================================================================

  /**
   * Rehydrates a complete Permission aggregate from a Prisma Permission
   * record.
   *
   * Rehydration does not emit domain events.
   */
  public static toDomain(record: PrismaPermission): PermissionAggregate {
    return PermissionAggregate.rehydrate(this.permissionToDomain(record));
  }

  // ===========================================================================
  // Prisma → Domain Entity
  // ===========================================================================

  /**
   * Maps a persisted Prisma Permission into PermissionEntity.
   *
   * Mapping:
   *
   * Prisma id
   *     ↓
   * UniqueEntityId
   *
   * Prisma publicId
   *     ↓
   * PermissionPublicId
   *
   * Prisma code
   *     ↓
   * PermissionCode
   *
   * Prisma resource
   *     ↓
   * PermissionResource
   *
   * Prisma action
   *     ↓
   * PermissionAction
   */
  public static permissionToDomain(record: PrismaPermission): PermissionEntity {
    if (record === undefined) {
      throw new Error('Permission Prisma record is required.');
    }

    const publicId = new PermissionPublicId(record.publicId);

    return PermissionEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Permission
        // ---------------------------------------------------------------------

        code: PermissionCode.create(record.code),

        name: record.name,

        resource: PermissionResource.create(record.resource),

        action: PermissionAction.create(record.action),

        description:
          record.description !== null ? record.description : undefined,

        isSystem: record.isSystem,

        isActive: record.isActive,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: record.createdAt,

        updatedAt: record.updatedAt,
      },

      // -----------------------------------------------------------------------
      // Internal Persistence Identity
      // -----------------------------------------------------------------------

      new UniqueEntityId(record.id),

      // -----------------------------------------------------------------------
      // Public Domain Identity
      // -----------------------------------------------------------------------

      publicId,
    );
  }

  // ===========================================================================
  // Permission Entity → Prisma Persistence
  // ===========================================================================

  /**
   * Maps PermissionEntity into its Prisma persistence shape.
   *
   * Domain value objects are serialized into primitive persistence values.
   */
  public static permissionToPersistence(entity: PermissionEntity): {
    id: string;
    publicId: string;
    name: string;
    code: string;
    resource: string;
    action: string;
    description: string | null;
    isSystem: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  } {
    if (entity === undefined) {
      throw new Error('Permission entity is required.');
    }

    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      id: entity.id.toString(),

      publicId: entity.publicId.value,

      // -----------------------------------------------------------------------
      // Permission
      // -----------------------------------------------------------------------

      name: entity.name,

      code: entity.code.value,

      resource: entity.resource.value,

      action: entity.action.value,

      description: entity.description ?? null,

      isSystem: entity.isSystem,

      isActive: entity.isActive,

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
   * Converts the complete Permission aggregate into its persistence
   * structure.
   *
   * Permission is a single-entity aggregate, so the resulting structure
   * contains only the Permission root record.
   */
  public static toPersistence(
    aggregate: PermissionAggregate,
  ): PermissionPersistence {
    if (aggregate === undefined) {
      throw new Error('Permission aggregate is required.');
    }

    return {
      permission: this.permissionToPersistence(aggregate.permission),
    };
  }

  // ===========================================================================
  // Component Mapping
  // ===========================================================================

  /**
   * Maps a Prisma Permission record directly into PermissionEntity.
   *
   * Useful for repository-level component operations.
   */
  public static toPermissionDomain(record: PrismaPermission): PermissionEntity {
    return this.permissionToDomain(record);
  }

  /**
   * Maps a Prisma Permission record into PermissionAggregate.
   *
   * Equivalent to toDomain().
   */
  public static toPermissionAggregate(
    record: PrismaPermission,
  ): PermissionAggregate {
    return this.toDomain(record);
  }

  /**
   * Maps a supported Prisma Permission record into its corresponding domain
   * entity.
   *
   * Permission has only one aggregate-owned entity, so this resolves directly
   * to PermissionEntity.
   */
  public static toDomainComponent(record: PrismaPermission): PermissionEntity {
    return this.permissionToDomain(record);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default PermissionPrismaMapper;
