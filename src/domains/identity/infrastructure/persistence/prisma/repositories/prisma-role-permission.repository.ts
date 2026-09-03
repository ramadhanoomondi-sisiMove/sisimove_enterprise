// -----------------------------------------------------------------------------
// Identity — Prisma Role Permission Repository
// -----------------------------------------------------------------------------
//
// Infrastructure repository for the RolePermission aggregate.
//
// Aggregate:
//
// RolePermissionAggregate
// └── RolePermissionEntity
//
// Persistence:
//
// RolePermission
//
// RolePermission is an independent relationship aggregate representing one
// logical authorization relationship:
//
//     Role ───────────── Permission
//              │
//              ▼
//        RolePermission
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Persist RolePermission aggregates.
// - Retrieve RolePermission aggregates.
// - Resolve cross-aggregate public identifiers to persistence identifiers.
// - Support Role-scoped assignment lookup.
// - Support Permission-scoped assignment lookup.
// - Support Role/Permission relationship lookup.
// - Support entity-level persistence lookups.
// - Support existence checks.
// - Respect the UNIQUE(roleId, permissionId) persistence constraint.
//
// -----------------------------------------------------------------------------
//
// This repository does NOT:
//
// - Create or modify Role aggregates.
// - Create or modify Permission aggregates.
// - Decide whether a Role may receive a Permission.
// - Evaluate authorization.
// - Execute authorization policies.
// - Communicate with external systems.
//
// Cross-aggregate authorization coordination belongs to the appropriate
// application/domain boundary.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT
//
// RolePermissionPrismaMapper is responsible for translating between:
//
// Prisma RolePermission + relations
//              ↕
// RolePermissionEntity
//              ↕
// RolePermissionAggregate
//
// The repository therefore contains no domain reconstruction logic.
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
// Cross-aggregate identity:
//
// Domain:
//   RolePermissionRolePublicId
//   RolePermissionPermissionPublicId
//
// Persistence:
//
//   roleId
//   permissionId
//
// -----------------------------------------------------------------------------
//
// Uniqueness:
//
// The persistence model enforces:
//
//     UNIQUE(roleId, permissionId)
//
// The repository uses the compound unique selector for relationship lookup
// wherever the generated Prisma client exposes it.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import { PrismaService } from '../../../../../../infrastructure/database/prisma/prisma.service';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { RolePermissionAggregate } from '../../../../domain/aggregates/role-permission.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import type { RolePermissionEntity } from '../../../../domain/entities/role-permission.entity';

// -----------------------------------------------------------------------------
// Repository Contract
// -----------------------------------------------------------------------------

import type { RolePermissionRepository } from '../../../../domain/repositories/role-permission.repository';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import {
  RolePermissionPrismaMapper,
  type RolePermissionWithRelations,
} from '../mappers/role-permission-prisma.mapper';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { RolePermissionPublicId } from '../../../../domain/value-objects/role-permission-public-id.vo';

import type { RolePermissionRolePublicId } from '../../../../domain/value-objects/role-permission-role-public-id.vo';

import type { RolePermissionPermissionPublicId } from '../../../../domain/value-objects/role-permission-permission-public-id.vo';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// =============================================================================
// Repository
// =============================================================================

/**
 * Prisma infrastructure implementation of the RolePermission repository.
 *
 * RolePermission is a relationship aggregate between the independent
 * Role and Permission aggregates.
 *
 * The domain exposes only public identifiers for those cross-aggregate
 * references. Internal Prisma foreign keys remain inside this repository.
 */
@Injectable()
export class PrismaRolePermissionRepository implements RolePermissionRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists a RolePermission aggregate.
   *
   * Public Role and Permission identifiers are resolved to their internal
   * persistence identifiers before writing the relationship.
   *
   * The aggregate internal identifier is used as the upsert key.
   */
  public async save(aggregate: RolePermissionAggregate): Promise<void> {
    if (aggregate === undefined) {
      throw new Error('RolePermission aggregate is required.');
    }

    const persistence = RolePermissionPrismaMapper.toPersistence(aggregate);

    const rolePermission = persistence.rolePermission;

    const roleId = await this.resolveRoleId(rolePermission.rolePublicId);

    const permissionId = await this.resolvePermissionId(
      rolePermission.permissionPublicId,
    );

    await this.prisma.rolePermission.upsert({
      where: {
        id: rolePermission.id,
      },

      create: {
        id: rolePermission.id,
        publicId: rolePermission.publicId,
        roleId,
        permissionId,
        createdAt: rolePermission.createdAt,
        updatedAt: rolePermission.updatedAt,
      },

      update: {
        publicId: rolePermission.publicId,
        roleId,
        permissionId,
        updatedAt: rolePermission.updatedAt,
      },
    });
  }

  /**
   * Deletes a RolePermission aggregate.
   *
   * Physical deletion represents revocation when the persistence model uses
   * deletion as its revocation strategy.
   */
  public async delete(aggregate: RolePermissionAggregate): Promise<void> {
    if (aggregate === undefined) {
      throw new Error('RolePermission aggregate is required.');
    }

    await this.prisma.rolePermission.delete({
      where: {
        id: aggregate.id.toString(),
      },
    });
  }

  // ===========================================================================
  // Aggregate Queries
  // ===========================================================================

  /**
   * Finds a RolePermission aggregate by public identifier.
   */
  public async findByPublicId(
    publicId: RolePermissionPublicId,
  ): Promise<RolePermissionAggregate | null> {
    if (publicId === undefined) {
      throw new Error('RolePermission public ID is required.');
    }

    const record = await this.prisma.rolePermission.findUnique({
      where: {
        publicId: publicId.value,
      },

      include: {
        role: true,
        permission: true,
      },
    });

    if (record === null) {
      return null;
    }

    return RolePermissionPrismaMapper.toDomain(record);
  }

  /**
   * Finds a RolePermission aggregate by Role public ID and Permission public
   * ID.
   */
  public async findByRolePublicIdAndPermissionPublicId(
    rolePublicId: RolePermissionRolePublicId,
    permissionPublicId: RolePermissionPermissionPublicId,
  ): Promise<RolePermissionAggregate | null> {
    if (rolePublicId === undefined) {
      throw new Error('Role public ID is required.');
    }

    if (permissionPublicId === undefined) {
      throw new Error('Permission public ID is required.');
    }

    const role = await this.prisma.role.findUnique({
      where: {
        publicId: rolePublicId.value,
      },

      select: {
        id: true,
      },
    });

    if (role === null) {
      return null;
    }

    const permission = await this.prisma.permission.findUnique({
      where: {
        publicId: permissionPublicId.value,
      },

      select: {
        id: true,
      },
    });

    if (permission === null) {
      return null;
    }

    const record = await this.prisma.rolePermission.findUnique({
      where: {
        roleId_permissionId: {
          roleId: role.id,
          permissionId: permission.id,
        },
      },

      include: {
        role: true,
        permission: true,
      },
    });

    if (record === null) {
      return null;
    }

    return RolePermissionPrismaMapper.toDomain(record);
  }

  /**
   * Finds all RolePermission aggregates belonging to a Role.
   */
  public async findByRolePublicId(
    rolePublicId: RolePermissionRolePublicId,
  ): Promise<RolePermissionAggregate[]> {
    if (rolePublicId === undefined) {
      throw new Error('Role public ID is required.');
    }

    const role = await this.prisma.role.findUnique({
      where: {
        publicId: rolePublicId.value,
      },

      select: {
        id: true,
      },
    });

    if (role === null) {
      return [];
    }

    const records = await this.prisma.rolePermission.findMany({
      where: {
        roleId: role.id,
      },

      include: {
        role: true,
        permission: true,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) =>
      RolePermissionPrismaMapper.toDomain(
        record as RolePermissionWithRelations,
      ),
    );
  }

  /**
   * Finds all RolePermission aggregates referencing a Permission.
   */
  public async findByPermissionPublicId(
    permissionPublicId: RolePermissionPermissionPublicId,
  ): Promise<RolePermissionAggregate[]> {
    if (permissionPublicId === undefined) {
      throw new Error('Permission public ID is required.');
    }

    const permission = await this.prisma.permission.findUnique({
      where: {
        publicId: permissionPublicId.value,
      },

      select: {
        id: true,
      },
    });

    if (permission === null) {
      return [];
    }

    const records = await this.prisma.rolePermission.findMany({
      where: {
        permissionId: permission.id,
      },

      include: {
        role: true,
        permission: true,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) =>
      RolePermissionPrismaMapper.toDomain(
        record as RolePermissionWithRelations,
      ),
    );
  }

  // ===========================================================================
  // Entity Queries
  // ===========================================================================

  /**
   * Finds a RolePermission entity by public identifier.
   */
  public async findEntityByPublicId(
    publicId: RolePermissionPublicId,
  ): Promise<RolePermissionEntity | null> {
    if (publicId === undefined) {
      throw new Error('RolePermission public ID is required.');
    }

    const aggregate = await this.findByPublicId(publicId);

    return aggregate?.rolePermission ?? null;
  }

  /**
   * Finds a RolePermission entity by internal identifier.
   *
   * Internal identifiers remain infrastructure-oriented and are not used as
   * cross-aggregate references in the domain.
   */
  public async findEntityById(
    id: UniqueEntityId,
  ): Promise<RolePermissionEntity | null> {
    if (id === undefined) {
      throw new Error('RolePermission internal ID is required.');
    }

    const record = await this.prisma.rolePermission.findUnique({
      where: {
        id: id.toString(),
      },

      include: {
        role: true,
        permission: true,
      },
    });

    if (record === null) {
      return null;
    }

    return RolePermissionPrismaMapper.toRolePermissionDomain(record);
  }

  /**
   * Finds all RolePermission entities associated with a Role internal ID.
   */
  public async findEntityByRoleId(
    roleId: UniqueEntityId,
  ): Promise<RolePermissionEntity[]> {
    if (roleId === undefined) {
      throw new Error('Role internal ID is required.');
    }

    const records = await this.prisma.rolePermission.findMany({
      where: {
        roleId: roleId.toString(),
      },

      include: {
        role: true,
        permission: true,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) =>
      RolePermissionPrismaMapper.toRolePermissionDomain(
        record as RolePermissionWithRelations,
      ),
    );
  }

  /**
   * Finds all RolePermission entities associated with a Permission internal
   * ID.
   */
  public async findEntityByPermissionId(
    permissionId: UniqueEntityId,
  ): Promise<RolePermissionEntity[]> {
    if (permissionId === undefined) {
      throw new Error('Permission internal ID is required.');
    }

    const records = await this.prisma.rolePermission.findMany({
      where: {
        permissionId: permissionId.toString(),
      },

      include: {
        role: true,
        permission: true,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) =>
      RolePermissionPrismaMapper.toRolePermissionDomain(
        record as RolePermissionWithRelations,
      ),
    );
  }

  // ===========================================================================
  // Role Queries
  // ===========================================================================

  /**
   * Finds all assignments belonging to a Role.
   */
  public async findAssignmentsByRolePublicId(
    rolePublicId: RolePermissionRolePublicId,
  ): Promise<RolePermissionAggregate[]> {
    return this.findByRolePublicId(rolePublicId);
  }

  /**
   * Finds assignments between a Role and a collection of Permissions.
   */
  public async findByRolePublicIdAndPermissionPublicIds(
    rolePublicId: RolePermissionRolePublicId,
    permissionPublicIds: RolePermissionPermissionPublicId[],
  ): Promise<RolePermissionAggregate[]> {
    if (rolePublicId === undefined) {
      throw new Error('Role public ID is required.');
    }

    if (permissionPublicIds === undefined) {
      throw new Error('Permission public IDs are required.');
    }

    if (permissionPublicIds.length === 0) {
      return [];
    }

    const role = await this.prisma.role.findUnique({
      where: {
        publicId: rolePublicId.value,
      },

      select: {
        id: true,
      },
    });

    if (role === null) {
      return [];
    }

    const permissionPublicIdValues = permissionPublicIds.map(
      (permissionPublicId) => {
        if (permissionPublicId === undefined) {
          throw new Error('Permission public ID is required.');
        }

        return permissionPublicId.value;
      },
    );

    const records = await this.prisma.rolePermission.findMany({
      where: {
        roleId: role.id,

        permission: {
          publicId: {
            in: permissionPublicIdValues,
          },
        },
      },

      include: {
        role: true,
        permission: true,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) =>
      RolePermissionPrismaMapper.toDomain(
        record as RolePermissionWithRelations,
      ),
    );
  }

  // ===========================================================================
  // Permission Queries
  // ===========================================================================

  /**
   * Finds all assignments referencing a Permission.
   */
  public async findAssignmentsByPermissionPublicId(
    permissionPublicId: RolePermissionPermissionPublicId,
  ): Promise<RolePermissionAggregate[]> {
    return this.findByPermissionPublicId(permissionPublicId);
  }

  // ===========================================================================
  // Relationship Queries
  // ===========================================================================

  /**
   * Finds the assignment connecting a Role and Permission.
   */
  public async findAssignment(
    rolePublicId: RolePermissionRolePublicId,
    permissionPublicId: RolePermissionPermissionPublicId,
  ): Promise<RolePermissionAggregate | null> {
    return this.findByRolePublicIdAndPermissionPublicId(
      rolePublicId,
      permissionPublicId,
    );
  }

  /**
   * Returns true when a Role/Permission assignment already exists.
   *
   * The database UNIQUE(roleId, permissionId) constraint remains the final
   * persistence-level guarantee.
   */
  public async existsAssignment(
    rolePublicId: RolePermissionRolePublicId,
    permissionPublicId: RolePermissionPermissionPublicId,
  ): Promise<boolean> {
    if (rolePublicId === undefined) {
      throw new Error('Role public ID is required.');
    }

    if (permissionPublicId === undefined) {
      throw new Error('Permission public ID is required.');
    }

    const role = await this.prisma.role.findUnique({
      where: {
        publicId: rolePublicId.value,
      },

      select: {
        id: true,
      },
    });

    if (role === null) {
      return false;
    }

    const permission = await this.prisma.permission.findUnique({
      where: {
        publicId: permissionPublicId.value,
      },

      select: {
        id: true,
      },
    });

    if (permission === null) {
      return false;
    }

    const record = await this.prisma.rolePermission.findUnique({
      where: {
        roleId_permissionId: {
          roleId: role.id,
          permissionId: permission.id,
        },
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Existence
  // ===========================================================================

  /**
   * Returns true if a RolePermission exists by public identifier.
   */
  public async existsByPublicId(
    publicId: RolePermissionPublicId,
  ): Promise<boolean> {
    if (publicId === undefined) {
      throw new Error('RolePermission public ID is required.');
    }

    const count = await this.prisma.rolePermission.count({
      where: {
        publicId: publicId.value,
      },
    });

    return count > 0;
  }

  /**
   * Returns true if a RolePermission exists by internal identifier.
   */
  public async existsById(id: UniqueEntityId): Promise<boolean> {
    if (id === undefined) {
      throw new Error('RolePermission internal ID is required.');
    }

    const count = await this.prisma.rolePermission.count({
      where: {
        id: id.toString(),
      },
    });

    return count > 0;
  }

  /**
   * Returns true if at least one assignment exists for a Role.
   */
  public async existsByRolePublicId(
    rolePublicId: RolePermissionRolePublicId,
  ): Promise<boolean> {
    if (rolePublicId === undefined) {
      throw new Error('Role public ID is required.');
    }

    const role = await this.prisma.role.findUnique({
      where: {
        publicId: rolePublicId.value,
      },

      select: {
        id: true,
      },
    });

    if (role === null) {
      return false;
    }

    const count = await this.prisma.rolePermission.count({
      where: {
        roleId: role.id,
      },
    });

    return count > 0;
  }

  /**
   * Returns true if at least one assignment exists for a Permission.
   */
  public async existsByPermissionPublicId(
    permissionPublicId: RolePermissionPermissionPublicId,
  ): Promise<boolean> {
    if (permissionPublicId === undefined) {
      throw new Error('Permission public ID is required.');
    }

    const permission = await this.prisma.permission.findUnique({
      where: {
        publicId: permissionPublicId.value,
      },

      select: {
        id: true,
      },
    });

    if (permission === null) {
      return false;
    }

    const count = await this.prisma.rolePermission.count({
      where: {
        permissionId: permission.id,
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Aggregate Collection Queries
  // ===========================================================================

  /**
   * Finds all RolePermission aggregates.
   */
  public async findAll(): Promise<RolePermissionAggregate[]> {
    const records = await this.prisma.rolePermission.findMany({
      include: {
        role: true,
        permission: true,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) =>
      RolePermissionPrismaMapper.toDomain(
        record as RolePermissionWithRelations,
      ),
    );
  }

  /**
   * Returns true if the supplied Role and Permission already have an
   * authorization relationship.
   *
   * Corresponds to:
   *
   *     UNIQUE(roleId, permissionId)
   */
  public async existsByRolePublicIdAndPermissionPublicId(
    rolePublicId: RolePermissionRolePublicId,
    permissionPublicId: RolePermissionPermissionPublicId,
  ): Promise<boolean> {
    return this.existsAssignment(rolePublicId, permissionPublicId);
  }

  // ===========================================================================
  // Foreign-Key Resolution
  // ===========================================================================

  /**
   * Resolves a Role public identifier to its internal persistence identifier.
   *
   * The public identifier is the only Role identity exposed to the domain.
   */
  private async resolveRoleId(rolePublicId: string): Promise<string> {
    if (typeof rolePublicId !== 'string' || rolePublicId.trim().length === 0) {
      throw new Error('Role public ID is required.');
    }

    const role = await this.prisma.role.findUnique({
      where: {
        publicId: rolePublicId,
      },

      select: {
        id: true,
      },
    });

    if (role === null) {
      throw new Error(
        `Cannot persist RolePermission because Role "${rolePublicId}" does not exist.`,
      );
    }

    return role.id;
  }

  /**
   * Resolves a Permission public identifier to its internal persistence
   * identifier.
   *
   * The public identifier is the only Permission identity exposed to the
   * domain.
   */
  private async resolvePermissionId(
    permissionPublicId: string,
  ): Promise<string> {
    if (
      typeof permissionPublicId !== 'string' ||
      permissionPublicId.trim().length === 0
    ) {
      throw new Error('Permission public ID is required.');
    }

    const permission = await this.prisma.permission.findUnique({
      where: {
        publicId: permissionPublicId,
      },

      select: {
        id: true,
      },
    });

    if (permission === null) {
      throw new Error(
        `Cannot persist RolePermission because Permission "${permissionPublicId}" does not exist.`,
      );
    }

    return permission.id;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default PrismaRolePermissionRepository;
