// -----------------------------------------------------------------------------
// Prisma Identity — Role Repository
// -----------------------------------------------------------------------------
//
// Infrastructure repository for the Role aggregate.
//
// Aggregate:
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
// Responsibilities:
//
// - Role aggregate persistence and rehydration
// - Role public-identity queries
// - Role code queries
// - Role lifecycle queries
// - System/custom Role queries
// - Assignment-eligibility queries
// - Display-order queries
// - Existence queries
// - Entity-level Role queries
//
// The repository does NOT:
//
// - persist IdentityRole;
// - persist RolePermission;
// - assign Roles to Identities;
// - revoke Roles from Identities;
// - evaluate permissions;
// - evaluate authorization;
// - emit domain events;
// - contain domain business rules;
// - resolve external domain concepts.
//
// IdentityRole and RolePermission are separate relationship boundaries.
//
// -----------------------------------------------------------------------------
//
// Public identity vs persistence identity:
//
// Domain:
//
// - UniqueEntityId
// - RolePublicId
// - RoleCode
//
// Prisma:
//
// - Role.id
// - Role.publicId
// - Role.code
//
// Public domain identifiers are mapped to persistence primitives only inside
// this infrastructure repository / mapper boundary.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation / Prisma
// -----------------------------------------------------------------------------
//
// IMPORTANT:
//
// PrismaService must be a runtime import because NestJS uses the constructor
// dependency at runtime for dependency injection.
//
// Do NOT use:
//
//     import type { PrismaService } ...
//
// -----------------------------------------------------------------------------

import { PrismaService } from '../../../../../../infrastructure/database/prisma/prisma.service';

import type { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { RoleAggregate } from '../../../../domain/aggregates/role.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import type { RoleEntity } from '../../../../domain/entities/role.entity';

// -----------------------------------------------------------------------------
// Repository Contract
// -----------------------------------------------------------------------------

import type { RoleRepository } from '../../../../domain/repositories/role.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { RolePublicId } from '../../../../domain/value-objects/role-public-id.vo';

import type { RoleCode } from '../../../../domain/value-objects/role-code.vo';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import { RolePrismaMapper } from '../../../persistence/prisma/mappers/role-prisma.mapper';

// =============================================================================
// Repository
// =============================================================================

/**
 * Prisma infrastructure implementation of the Role repository.
 *
 * Role is an independent aggregate root.
 *
 * The repository is responsible only for persistence and rehydration.
 *
 * Relationship boundaries such as IdentityRole and RolePermission are
 * intentionally excluded from this repository.
 */
@Injectable()
export class PrismaRoleRepository implements RoleRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists a Role aggregate.
   *
   * Role is a single-entity aggregate, therefore persistence consists only
   * of the Role root record.
   *
   * The repository does not persist IdentityRole or RolePermission.
   *
   * The persistence identity is checked before updating an existing record.
   * This prevents a Role aggregate from accidentally overwriting a different
   * public Role identity.
   */
  public async save(aggregate: RoleAggregate): Promise<void> {
    if (aggregate === undefined) {
      throw new Error('Role aggregate is required.');
    }

    const persistence = RolePrismaMapper.toPersistence(aggregate);

    const role = persistence.role;

    // -------------------------------------------------------------------------
    // Determine whether the Role already exists.
    // -------------------------------------------------------------------------

    const existing = await this.prisma.role.findUnique({
      where: {
        id: role.id,
      },

      select: {
        id: true,
        publicId: true,
      },
    });

    // -------------------------------------------------------------------------
    // Create
    // -------------------------------------------------------------------------

    if (existing === null) {
      await this.prisma.role.create({
        data: {
          id: role.id,

          publicId: role.publicId,

          name: role.name,

          code: role.code,

          description: role.description,

          displayOrder: role.displayOrder,

          isSystem: role.isSystem,

          isActive: role.isActive,

          createdAt: role.createdAt,

          updatedAt: role.updatedAt,
        },
      });

      return;
    }

    // -------------------------------------------------------------------------
    // Persistence identity safety check
    // -------------------------------------------------------------------------

    if (existing.publicId !== role.publicId) {
      throw new Error(
        `Cannot save Role "${role.publicId}": persistence Role "${role.id}" belongs to public Role "${existing.publicId}".`,
      );
    }

    // -------------------------------------------------------------------------
    // Update
    // -------------------------------------------------------------------------

    await this.prisma.role.update({
      where: {
        id: role.id,
      },

      data: {
        publicId: role.publicId,

        name: role.name,

        code: role.code,

        description: role.description,

        displayOrder: role.displayOrder,

        isSystem: role.isSystem,

        isActive: role.isActive,

        updatedAt: role.updatedAt,
      },
    });
  }

  // ===========================================================================
  // Delete
  // ===========================================================================

  /**
   * Deletes a Role aggregate.
   *
   * The repository does not explicitly delete IdentityRole or RolePermission.
   * Database referential-integrity rules and application/domain policy
   * determine whether the Role can be deleted.
   */
  public async delete(aggregate: RoleAggregate): Promise<void> {
    if (aggregate === undefined) {
      throw new Error('Role aggregate is required.');
    }

    const roleId = aggregate.id.toString();

    await this.prisma.role.delete({
      where: {
        id: roleId,
      },
    });
  }

  // ===========================================================================
  // Aggregate Queries
  // ===========================================================================

  /**
   * Finds a Role aggregate by public identifier.
   */
  public async findByPublicId(
    publicId: RolePublicId,
  ): Promise<RoleAggregate | null> {
    if (publicId === undefined) {
      throw new Error('Role public ID is required.');
    }

    const record = await this.prisma.role.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    return record === null ? null : RolePrismaMapper.toDomain(record);
  }

  /**
   * Finds a Role aggregate by stable RoleCode.
   */
  public async findByCode(code: RoleCode): Promise<RoleAggregate | null> {
    if (code === undefined) {
      throw new Error('Role code is required.');
    }

    const record = await this.prisma.role.findUnique({
      where: {
        code: code.value,
      },
    });

    return record === null ? null : RolePrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Entity Queries
  // ===========================================================================

  /**
   * Finds a Role entity by public identifier.
   *
   * The returned entity is the aggregate root entity without wrapping it
   * inside RoleAggregate.
   */
  public async findEntityByPublicId(
    publicId: RolePublicId,
  ): Promise<RoleEntity | null> {
    if (publicId === undefined) {
      throw new Error('Role public ID is required.');
    }

    const record = await this.prisma.role.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    return record === null ? null : RolePrismaMapper.toRoleDomain(record);
  }

  /**
   * Finds a Role entity by internal persistence identifier.
   */
  public async findEntityById(id: UniqueEntityId): Promise<RoleEntity | null> {
    if (id === undefined) {
      throw new Error('Role internal ID is required.');
    }

    const record = await this.prisma.role.findUnique({
      where: {
        id: id.toString(),
      },
    });

    return record === null ? null : RolePrismaMapper.toRoleDomain(record);
  }

  /**
   * Finds a Role entity by stable RoleCode.
   */
  public async findEntityByCode(code: RoleCode): Promise<RoleEntity | null> {
    if (code === undefined) {
      throw new Error('Role code is required.');
    }

    const record = await this.prisma.role.findUnique({
      where: {
        code: code.value,
      },
    });

    return record === null ? null : RolePrismaMapper.toRoleDomain(record);
  }

  // ===========================================================================
  // Lifecycle Queries
  // ===========================================================================

  /**
   * Finds all active Roles.
   *
   * Active Roles are eligible for assignment at the Role level.
   */
  public async findActive(): Promise<RoleAggregate[]> {
    const records = await this.prisma.role.findMany({
      where: {
        isActive: true,
      },

      orderBy: [
        {
          displayOrder: 'asc',
        },

        {
          createdAt: 'desc',
        },
      ],
    });

    return records.map((record) => RolePrismaMapper.toDomain(record));
  }

  /**
   * Finds all inactive Roles.
   */
  public async findInactive(): Promise<RoleAggregate[]> {
    const records = await this.prisma.role.findMany({
      where: {
        isActive: false,
      },

      orderBy: [
        {
          displayOrder: 'asc',
        },

        {
          createdAt: 'desc',
        },
      ],
    });

    return records.map((record) => RolePrismaMapper.toDomain(record));
  }

  /**
   * Finds all Roles currently eligible for assignment.
   *
   * Role-level assignment eligibility is equivalent to isActive = true.
   */
  public async findAssignable(): Promise<RoleAggregate[]> {
    return this.findActive();
  }

  // ===========================================================================
  // System / Custom Queries
  // ===========================================================================

  /**
   * Finds all system-defined Roles.
   */
  public async findSystemRoles(): Promise<RoleAggregate[]> {
    const records = await this.prisma.role.findMany({
      where: {
        isSystem: true,
      },

      orderBy: [
        {
          displayOrder: 'asc',
        },

        {
          createdAt: 'desc',
        },
      ],
    });

    return records.map((record) => RolePrismaMapper.toDomain(record));
  }

  /**
   * Finds all active system-defined Roles.
   */
  public async findActiveSystemRoles(): Promise<RoleAggregate[]> {
    const records = await this.prisma.role.findMany({
      where: {
        isSystem: true,

        isActive: true,
      },

      orderBy: [
        {
          displayOrder: 'asc',
        },

        {
          createdAt: 'desc',
        },
      ],
    });

    return records.map((record) => RolePrismaMapper.toDomain(record));
  }

  /**
   * Finds all custom/application-defined Roles.
   */
  public async findCustomRoles(): Promise<RoleAggregate[]> {
    const records = await this.prisma.role.findMany({
      where: {
        isSystem: false,
      },

      orderBy: [
        {
          displayOrder: 'asc',
        },

        {
          createdAt: 'desc',
        },
      ],
    });

    return records.map((record) => RolePrismaMapper.toDomain(record));
  }

  /**
   * Finds all active custom/application-defined Roles.
   */
  public async findActiveCustomRoles(): Promise<RoleAggregate[]> {
    const records = await this.prisma.role.findMany({
      where: {
        isSystem: false,

        isActive: true,
      },

      orderBy: [
        {
          displayOrder: 'asc',
        },

        {
          createdAt: 'desc',
        },
      ],
    });

    return records.map((record) => RolePrismaMapper.toDomain(record));
  }

  // ===========================================================================
  // Ordering Queries
  // ===========================================================================

  /**
   * Finds all Roles ordered by administrative display order.
   *
   * displayOrder is the primary ordering criterion.
   * createdAt provides deterministic secondary ordering.
   */
  public async findAllOrderedByDisplayOrder(): Promise<RoleAggregate[]> {
    const records = await this.prisma.role.findMany({
      orderBy: [
        {
          displayOrder: 'asc',
        },

        {
          createdAt: 'desc',
        },
      ],
    });

    return records.map((record) => RolePrismaMapper.toDomain(record));
  }

  /**
   * Finds all active Roles ordered by administrative display order.
   */
  public async findActiveOrderedByDisplayOrder(): Promise<RoleAggregate[]> {
    const records = await this.prisma.role.findMany({
      where: {
        isActive: true,
      },

      orderBy: [
        {
          displayOrder: 'asc',
        },

        {
          createdAt: 'desc',
        },
      ],
    });

    return records.map((record) => RolePrismaMapper.toDomain(record));
  }

  // ===========================================================================
  // Existence
  // ===========================================================================

  /**
   * Determines whether a Role exists by public identifier.
   */
  public async existsByPublicId(publicId: RolePublicId): Promise<boolean> {
    if (publicId === undefined) {
      throw new Error('Role public ID is required.');
    }

    const count = await this.prisma.role.count({
      where: {
        publicId: publicId.value,
      },
    });

    return count > 0;
  }

  /**
   * Determines whether a Role exists by internal persistence identifier.
   */
  public async existsById(id: UniqueEntityId): Promise<boolean> {
    if (id === undefined) {
      throw new Error('Role internal ID is required.');
    }

    const count = await this.prisma.role.count({
      where: {
        id: id.toString(),
      },
    });

    return count > 0;
  }

  /**
   * Determines whether a Role exists by stable RoleCode.
   */
  public async existsByCode(code: RoleCode): Promise<boolean> {
    if (code === undefined) {
      throw new Error('Role code is required.');
    }

    const count = await this.prisma.role.count({
      where: {
        code: code.value,
      },
    });

    return count > 0;
  }

  /**
   * Determines whether an active Role exists for the supplied RoleCode.
   */
  public async existsActiveByCode(code: RoleCode): Promise<boolean> {
    if (code === undefined) {
      throw new Error('Role code is required.');
    }

    const count = await this.prisma.role.count({
      where: {
        code: code.value,

        isActive: true,
      },
    });

    return count > 0;
  }

  /**
   * Determines whether at least one active Role exists.
   */
  public async existsActive(): Promise<boolean> {
    const count = await this.prisma.role.count({
      where: {
        isActive: true,
      },
    });

    return count > 0;
  }

  /**
   * Determines whether at least one inactive Role exists.
   */
  public async existsInactive(): Promise<boolean> {
    const count = await this.prisma.role.count({
      where: {
        isActive: false,
      },
    });

    return count > 0;
  }

  /**
   * Determines whether a system Role exists for the supplied RoleCode.
   */
  public async existsSystemByCode(code: RoleCode): Promise<boolean> {
    if (code === undefined) {
      throw new Error('Role code is required.');
    }

    const count = await this.prisma.role.count({
      where: {
        code: code.value,

        isSystem: true,
      },
    });

    return count > 0;
  }

  /**
   * Determines whether a custom/application-defined Role exists for the
   * supplied RoleCode.
   */
  public async existsCustomByCode(code: RoleCode): Promise<boolean> {
    if (code === undefined) {
      throw new Error('Role code is required.');
    }

    const count = await this.prisma.role.count({
      where: {
        code: code.value,

        isSystem: false,
      },
    });

    return count > 0;
  }
}
