// -----------------------------------------------------------------------------
// Identity — Role Prisma Mapper
// -----------------------------------------------------------------------------
//
// Maps the Role aggregate:
//
// RoleAggregate
// └── RoleEntity
//
// Persistence:
//
// Role
//
// Role is an independent aggregate root.
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
//   RolePublicId
//
// IMPORTANT:
//
// RoleEntity.rehydrate() has the following shape:
//
//     RoleEntity.rehydrate(
//       props,
//       id,
//       publicId,
//     )
//
// Therefore:
//
// - publicId MUST NOT be placed inside RoleProps;
// - id MUST remain a UniqueEntityId;
// - publicId MUST remain a RolePublicId.
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
//      → RoleCode
//
// name
//      → RoleName
//
// -----------------------------------------------------------------------------
//
// Persistence mapping:
//
// Domain value object
//      ↓
// Prisma primitive
//
// RoleCode
//      → string
//
// RoleName
//      → string
//
// -----------------------------------------------------------------------------
//
// This mapper does NOT map:
//
// - IdentityRole;
// - RolePermission.
//
// Those are separate relationship / aggregate boundaries.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { Role as PrismaRole } from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { RoleAggregate } from '../../../../domain/aggregates/role.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { RoleEntity } from '../../../../domain/entities/role.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  RolePublicId,
  RoleCode,
  RoleName,
} from '../../../../domain/value-objects';

// =============================================================================
// Persistence Types
// =============================================================================

/**
 * Persistence representation of the Role aggregate.
 *
 * Role is a single-entity aggregate, therefore no child collection is
 * required in the persistence structure.
 */
export interface RolePersistence {
  role: ReturnType<typeof RolePrismaMapper.roleToPersistence>;
}

// =============================================================================
// Mapper
// =============================================================================

export class RolePrismaMapper {
  // ===========================================================================
  // Prisma → Domain Aggregate
  // ===========================================================================

  /**
   * Rehydrates a complete Role aggregate from a Prisma Role record.
   *
   * Rehydration does not emit domain events.
   */
  public static toDomain(record: PrismaRole): RoleAggregate {
    return RoleAggregate.rehydrate(this.roleToDomain(record));
  }

  // ===========================================================================
  // Prisma → Domain Entity
  // ===========================================================================

  /**
   * Rehydrates a RoleEntity from a persisted Prisma Role record.
   *
   * Mapping:
   *
   * Prisma id
   *     ↓
   * UniqueEntityId
   *
   * Prisma publicId
   *     ↓
   * RolePublicId
   *
   * Prisma code
   *     ↓
   * RoleCode
   *
   * Prisma name
   *     ↓
   * RoleName
   */
  public static roleToDomain(record: PrismaRole): RoleEntity {
    if (record === undefined) {
      throw new Error('Role Prisma record is required.');
    }

    const publicId = new RolePublicId(record.publicId);

    return RoleEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Role
        // ---------------------------------------------------------------------

        code: RoleCode.create(record.code),

        name: RoleName.create(record.name),

        description:
          record.description !== null ? record.description : undefined,

        displayOrder: record.displayOrder,

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
  // Domain Entity → Prisma Persistence
  // ===========================================================================

  /**
   * Maps RoleEntity into its Prisma persistence shape.
   *
   * Domain value objects are serialized into primitive persistence values.
   */
  public static roleToPersistence(entity: RoleEntity): {
    id: string;
    publicId: string;
    name: string;
    code: string;
    description: string | null;
    displayOrder: number;
    isSystem: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  } {
    if (entity === undefined) {
      throw new Error('Role entity is required.');
    }

    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      id: entity.id.toString(),

      publicId: entity.publicId.value,

      // -----------------------------------------------------------------------
      // Role
      // -----------------------------------------------------------------------

      name: entity.name.value,

      code: entity.code.value,

      description: entity.description ?? null,

      displayOrder: entity.displayOrder,

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
   * Converts the complete Role aggregate into its persistence structure.
   *
   * Role is a single-entity aggregate, so the aggregate persistence structure
   * contains only the Role root record.
   */
  public static toPersistence(aggregate: RoleAggregate): RolePersistence {
    if (aggregate === undefined) {
      throw new Error('Role aggregate is required.');
    }

    return {
      role: this.roleToPersistence(aggregate.role),
    };
  }

  // ===========================================================================
  // Component Mapping
  // ===========================================================================

  /**
   * Maps a Prisma Role record directly into RoleEntity.
   *
   * Useful for repository-level component operations.
   */
  public static toRoleDomain(record: PrismaRole): RoleEntity {
    return this.roleToDomain(record);
  }

  /**
   * Maps a Prisma Role record into RoleAggregate.
   *
   * Equivalent to toDomain().
   */
  public static toRoleAggregate(record: PrismaRole): RoleAggregate {
    return this.toDomain(record);
  }

  // ===========================================================================
  // Generic Domain Component Mapping
  // ===========================================================================

  /**
   * Maps a supported Prisma Role record into its corresponding domain
   * component.
   *
   * Role has only one aggregate-owned entity, so this method resolves directly
   * to RoleEntity.
   */
  public static toDomainComponent(record: PrismaRole): RoleEntity {
    return this.roleToDomain(record);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RolePrismaMapper;
