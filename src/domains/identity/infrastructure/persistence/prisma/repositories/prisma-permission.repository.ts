// -----------------------------------------------------------------------------
// Identity — Prisma Permission Repository
// -----------------------------------------------------------------------------
//
// Infrastructure repository for the Permission aggregate.
//
// Aggregate:
//
// PermissionAggregate
// └── PermissionEntity
//
// Persistence:
//
// Permission
//
// Permission is an independent aggregate root representing one authorization
// capability:
//
//     Resource ───────── Action
//             │
//             ▼
//         Permission
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Persist Permission aggregates.
// - Retrieve Permission aggregates.
// - Support Permission public-identity lookup.
// - Support stable PermissionCode lookup.
// - Support resource/action capability lookup.
// - Support resource-scoped lookup.
// - Support action-scoped lookup.
// - Support active/inactive lookup.
// - Support system/custom Permission lookup.
// - Support assignment-eligibility lookup.
// - Support entity-level persistence lookups.
// - Support existence checks.
// - Respect the UNIQUE(resource, action) persistence constraint.
//
// -----------------------------------------------------------------------------
//
// This repository does NOT:
//
// - Create or modify Role aggregates.
// - Create or modify RolePermission relationships.
// - Assign Permissions to Roles.
// - Remove Permissions from Roles.
// - Evaluate authorization.
// - Decide Role eligibility.
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
// PermissionPrismaMapper is responsible for translating between:
//
// Prisma Permission
//        ↕
// PermissionEntity
//        ↕
// PermissionAggregate
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
//   PermissionPublicId
//
// Stable capability identity:
//
// Prisma:
//   resource
//   action
//
// Domain:
//   PermissionResource
//   PermissionAction
//
// -----------------------------------------------------------------------------
//
// Uniqueness:
//
// The persistence model enforces:
//
//     UNIQUE(resource, action)
//
// The repository uses capability lookup and existence methods to expose this
// invariant at the persistence boundary.
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

import type { PermissionAggregate } from '../../../../domain/aggregates/permission.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import type { PermissionEntity } from '../../../../domain/entities/permission.entity';

// -----------------------------------------------------------------------------
// Repository Contract
// -----------------------------------------------------------------------------

import type { PermissionRepository } from '../../../../domain/repositories/permission.repository';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import { PermissionPrismaMapper } from '../mappers/permission-prisma.mapper';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { PermissionPublicId } from '../../../../domain/value-objects/permission-public-id.vo';

import type { PermissionCode } from '../../../../domain/value-objects/permission-code.vo';

import type { PermissionResource } from '../../../../domain/value-objects/permission-resource.vo';

import type { PermissionAction } from '../../../../domain/value-objects/permission-action.vo';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// =============================================================================
// Repository
// =============================================================================

@Injectable()
export class PrismaPermissionRepository implements PermissionRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists a Permission aggregate.
   *
   * Permission is a single-entity aggregate, therefore the aggregate maps
   * directly to one Prisma Permission record.
   *
   * Upsert allows the repository to persist both newly-created and already
   * persisted aggregate instances.
   */
  public async save(aggregate: PermissionAggregate): Promise<void> {
    if (aggregate === undefined) {
      throw new Error('Permission aggregate is required.');
    }

    const persistence = PermissionPrismaMapper.toPersistence(aggregate);

    await this.prisma.permission.upsert({
      where: {
        id: persistence.permission.id,
      },

      create: {
        id: persistence.permission.id,
        publicId: persistence.permission.publicId,
        name: persistence.permission.name,
        code: persistence.permission.code,
        resource: persistence.permission.resource,
        action: persistence.permission.action,
        description: persistence.permission.description,
        isSystem: persistence.permission.isSystem,
        isActive: persistence.permission.isActive,
        createdAt: persistence.permission.createdAt,
        updatedAt: persistence.permission.updatedAt,
      },

      update: {
        publicId: persistence.permission.publicId,
        name: persistence.permission.name,
        code: persistence.permission.code,
        resource: persistence.permission.resource,
        action: persistence.permission.action,
        description: persistence.permission.description,
        isSystem: persistence.permission.isSystem,
        isActive: persistence.permission.isActive,
        updatedAt: persistence.permission.updatedAt,
      },
    });
  }

  /**
   * Deletes a Permission aggregate.
   *
   * Cross-aggregate deletion eligibility is intentionally not decided here.
   * The application/domain boundary is responsible for ensuring that the
   * Permission may be removed.
   */
  public async delete(aggregate: PermissionAggregate): Promise<void> {
    if (aggregate === undefined) {
      throw new Error('Permission aggregate is required.');
    }

    await this.prisma.permission.delete({
      where: {
        id: aggregate.id.toString(),
      },
    });
  }

  // ===========================================================================
  // Aggregate Queries
  // ===========================================================================

  /**
   * Finds a Permission aggregate by public identifier.
   */
  public async findByPublicId(
    publicId: PermissionPublicId,
  ): Promise<PermissionAggregate | null> {
    if (publicId === undefined) {
      throw new Error('Permission public ID is required.');
    }

    const record = await this.prisma.permission.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    return record === null ? null : PermissionPrismaMapper.toDomain(record);
  }

  /**
   * Finds a Permission aggregate by stable PermissionCode.
   */
  public async findByCode(
    code: PermissionCode,
  ): Promise<PermissionAggregate | null> {
    if (code === undefined) {
      throw new Error('Permission code is required.');
    }

    const record = await this.prisma.permission.findUnique({
      where: {
        code: code.value,
      },
    });

    return record === null ? null : PermissionPrismaMapper.toDomain(record);
  }

  /**
   * Finds a Permission aggregate by resource/action capability.
   *
   * The persistence model guarantees uniqueness of this combination.
   */
  public async findByResourceAndAction(
    resource: PermissionResource,
    action: PermissionAction,
  ): Promise<PermissionAggregate | null> {
    if (resource === undefined) {
      throw new Error('Permission resource is required.');
    }

    if (action === undefined) {
      throw new Error('Permission action is required.');
    }

    const record = await this.prisma.permission.findUnique({
      where: {
        resource_action: {
          resource: resource.value,
          action: action.value,
        },
      },
    });

    return record === null ? null : PermissionPrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Entity Queries
  // ===========================================================================

  /**
   * Finds a Permission entity by public identifier.
   */
  public async findEntityByPublicId(
    publicId: PermissionPublicId,
  ): Promise<PermissionEntity | null> {
    if (publicId === undefined) {
      throw new Error('Permission public ID is required.');
    }

    const record = await this.prisma.permission.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    return record === null
      ? null
      : PermissionPrismaMapper.toPermissionDomain(record);
  }

  /**
   * Finds a Permission entity by internal persistence identifier.
   */
  public async findEntityById(
    id: UniqueEntityId,
  ): Promise<PermissionEntity | null> {
    if (id === undefined) {
      throw new Error('Permission internal ID is required.');
    }

    const record = await this.prisma.permission.findUnique({
      where: {
        id: id.toString(),
      },
    });

    return record === null
      ? null
      : PermissionPrismaMapper.toPermissionDomain(record);
  }

  /**
   * Finds a Permission entity by stable PermissionCode.
   */
  public async findEntityByCode(
    code: PermissionCode,
  ): Promise<PermissionEntity | null> {
    if (code === undefined) {
      throw new Error('Permission code is required.');
    }

    const record = await this.prisma.permission.findUnique({
      where: {
        code: code.value,
      },
    });

    return record === null
      ? null
      : PermissionPrismaMapper.toPermissionDomain(record);
  }

  /**
   * Finds a Permission entity by resource/action capability.
   */
  public async findEntityByResourceAndAction(
    resource: PermissionResource,
    action: PermissionAction,
  ): Promise<PermissionEntity | null> {
    if (resource === undefined) {
      throw new Error('Permission resource is required.');
    }

    if (action === undefined) {
      throw new Error('Permission action is required.');
    }

    const record = await this.prisma.permission.findUnique({
      where: {
        resource_action: {
          resource: resource.value,
          action: action.value,
        },
      },
    });

    return record === null
      ? null
      : PermissionPrismaMapper.toPermissionDomain(record);
  }

  // ===========================================================================
  // Capability Queries
  // ===========================================================================

  /**
   * Finds all Permissions protecting a resource.
   */
  public async findByResource(
    resource: PermissionResource,
  ): Promise<PermissionAggregate[]> {
    if (resource === undefined) {
      throw new Error('Permission resource is required.');
    }

    const records = await this.prisma.permission.findMany({
      where: {
        resource: resource.value,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => PermissionPrismaMapper.toDomain(record));
  }

  /**
   * Finds all active Permissions protecting a resource.
   */
  public async findActiveByResource(
    resource: PermissionResource,
  ): Promise<PermissionAggregate[]> {
    if (resource === undefined) {
      throw new Error('Permission resource is required.');
    }

    const records = await this.prisma.permission.findMany({
      where: {
        resource: resource.value,
        isActive: true,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => PermissionPrismaMapper.toDomain(record));
  }

  /**
   * Finds all Permissions representing an action.
   */
  public async findByAction(
    action: PermissionAction,
  ): Promise<PermissionAggregate[]> {
    if (action === undefined) {
      throw new Error('Permission action is required.');
    }

    const records = await this.prisma.permission.findMany({
      where: {
        action: action.value,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => PermissionPrismaMapper.toDomain(record));
  }

  /**
   * Finds all active Permissions representing an action.
   */
  public async findActiveByAction(
    action: PermissionAction,
  ): Promise<PermissionAggregate[]> {
    if (action === undefined) {
      throw new Error('Permission action is required.');
    }

    const records = await this.prisma.permission.findMany({
      where: {
        action: action.value,
        isActive: true,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => PermissionPrismaMapper.toDomain(record));
  }

  /**
   * Finds the Permission matching a resource/action capability.
   *
   * The database uniqueness invariant guarantees at most one result.
   */
  public async findByCapability(
    resource: PermissionResource,
    action: PermissionAction,
  ): Promise<PermissionAggregate | null> {
    return this.findByResourceAndAction(resource, action);
  }

  // ===========================================================================
  // Lifecycle Queries
  // ===========================================================================

  /**
   * Finds all active Permissions.
   */
  public async findActive(): Promise<PermissionAggregate[]> {
    const records = await this.prisma.permission.findMany({
      where: {
        isActive: true,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => PermissionPrismaMapper.toDomain(record));
  }

  /**
   * Finds all inactive Permissions.
   */
  public async findInactive(): Promise<PermissionAggregate[]> {
    const records = await this.prisma.permission.findMany({
      where: {
        isActive: false,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => PermissionPrismaMapper.toDomain(record));
  }

  /**
   * Finds all Permissions currently eligible for authorization assignment.
   *
   * At the Permission level, assignability is equivalent to active state.
   */
  public async findAssignable(): Promise<PermissionAggregate[]> {
    return this.findActive();
  }

  // ===========================================================================
  // System / Custom Queries
  // ===========================================================================

  /**
   * Finds all system-defined Permissions.
   */
  public async findSystemPermissions(): Promise<PermissionAggregate[]> {
    const records = await this.prisma.permission.findMany({
      where: {
        isSystem: true,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => PermissionPrismaMapper.toDomain(record));
  }

  /**
   * Finds all active system-defined Permissions.
   */
  public async findActiveSystemPermissions(): Promise<PermissionAggregate[]> {
    const records = await this.prisma.permission.findMany({
      where: {
        isSystem: true,
        isActive: true,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => PermissionPrismaMapper.toDomain(record));
  }

  /**
   * Finds all custom/application-defined Permissions.
   */
  public async findCustomPermissions(): Promise<PermissionAggregate[]> {
    const records = await this.prisma.permission.findMany({
      where: {
        isSystem: false,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => PermissionPrismaMapper.toDomain(record));
  }

  /**
   * Finds all active custom/application-defined Permissions.
   */
  public async findActiveCustomPermissions(): Promise<PermissionAggregate[]> {
    const records = await this.prisma.permission.findMany({
      where: {
        isSystem: false,
        isActive: true,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => PermissionPrismaMapper.toDomain(record));
  }

  // ===========================================================================
  // Existence
  // ===========================================================================

  /**
   * Returns true if a Permission exists by public identifier.
   */
  public async existsByPublicId(
    publicId: PermissionPublicId,
  ): Promise<boolean> {
    if (publicId === undefined) {
      throw new Error('Permission public ID is required.');
    }

    const count = await this.prisma.permission.count({
      where: {
        publicId: publicId.value,
      },
    });

    return count > 0;
  }

  /**
   * Returns true if a Permission exists by internal identifier.
   */
  public async existsById(id: UniqueEntityId): Promise<boolean> {
    if (id === undefined) {
      throw new Error('Permission internal ID is required.');
    }

    const count = await this.prisma.permission.count({
      where: {
        id: id.toString(),
      },
    });

    return count > 0;
  }

  /**
   * Returns true if a Permission exists by stable PermissionCode.
   */
  public async existsByCode(code: PermissionCode): Promise<boolean> {
    if (code === undefined) {
      throw new Error('Permission code is required.');
    }

    const count = await this.prisma.permission.count({
      where: {
        code: code.value,
      },
    });

    return count > 0;
  }

  /**
   * Returns true if a Permission exists for a resource/action capability.
   */
  public async existsByResourceAndAction(
    resource: PermissionResource,
    action: PermissionAction,
  ): Promise<boolean> {
    if (resource === undefined) {
      throw new Error('Permission resource is required.');
    }

    if (action === undefined) {
      throw new Error('Permission action is required.');
    }

    const count = await this.prisma.permission.count({
      where: {
        resource: resource.value,
        action: action.value,
      },
    });

    return count > 0;
  }

  /**
   * Returns true if an active Permission exists for a resource/action
   * capability.
   */
  public async existsActiveByResourceAndAction(
    resource: PermissionResource,
    action: PermissionAction,
  ): Promise<boolean> {
    if (resource === undefined) {
      throw new Error('Permission resource is required.');
    }

    if (action === undefined) {
      throw new Error('Permission action is required.');
    }

    const count = await this.prisma.permission.count({
      where: {
        resource: resource.value,
        action: action.value,
        isActive: true,
      },
    });

    return count > 0;
  }

  /**
   * Returns true if an active Permission exists for a stable PermissionCode.
   */
  public async existsActiveByCode(code: PermissionCode): Promise<boolean> {
    if (code === undefined) {
      throw new Error('Permission code is required.');
    }

    const count = await this.prisma.permission.count({
      where: {
        code: code.value,
        isActive: true,
      },
    });

    return count > 0;
  }

  /**
   * Returns true if at least one Permission exists for a resource.
   */
  public async existsByResource(
    resource: PermissionResource,
  ): Promise<boolean> {
    if (resource === undefined) {
      throw new Error('Permission resource is required.');
    }

    const count = await this.prisma.permission.count({
      where: {
        resource: resource.value,
      },
    });

    return count > 0;
  }

  /**
   * Returns true if at least one Permission exists for an action.
   */
  public async existsByAction(action: PermissionAction): Promise<boolean> {
    if (action === undefined) {
      throw new Error('Permission action is required.');
    }

    const count = await this.prisma.permission.count({
      where: {
        action: action.value,
      },
    });

    return count > 0;
  }

  /**
   * Returns true if at least one active Permission exists for a resource.
   */
  public async existsActiveByResource(
    resource: PermissionResource,
  ): Promise<boolean> {
    if (resource === undefined) {
      throw new Error('Permission resource is required.');
    }

    const count = await this.prisma.permission.count({
      where: {
        resource: resource.value,
        isActive: true,
      },
    });

    return count > 0;
  }

  /**
   * Returns true if at least one active Permission exists for an action.
   */
  public async existsActiveByAction(
    action: PermissionAction,
  ): Promise<boolean> {
    if (action === undefined) {
      throw new Error('Permission action is required.');
    }

    const count = await this.prisma.permission.count({
      where: {
        action: action.value,
        isActive: true,
      },
    });

    return count > 0;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default PrismaPermissionRepository;
