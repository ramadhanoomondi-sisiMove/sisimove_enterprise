// -----------------------------------------------------------------------------
// Identity — Role Permission Repository
// -----------------------------------------------------------------------------
//
// Repository contract for the RolePermission aggregate.
//
// Aggregate ownership:
//
// RolePermissionAggregate
// └── RolePermissionEntity
//
// The RolePermission aggregate represents one logical authorization
// relationship:
//
//     Role ───────────── Permission
//              │
//              ▼
//        RolePermission
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Persist RolePermission aggregates.
// - Retrieve RolePermission aggregates.
// - Support assignment identity lookup.
// - Support Role-scoped assignment lookup.
// - Support Permission-scoped assignment lookup.
// - Support Role + Permission relationship lookup.
// - Support entity-level persistence lookups.
// - Support assignment existence checks.
// - Support uniqueness checks for Role + Permission pairs.
//
// -----------------------------------------------------------------------------
//
// This repository does NOT:
// - Depend on Prisma.
// - Depend on ORM models.
// - Depend on database-specific identifiers outside persistence-oriented
//   entity lookup methods.
// - Create or modify Roles.
// - Create or modify Permissions.
// - Decide whether a Role may receive a Permission.
// - Decide whether a Permission is eligible for assignment.
// - Perform authorization checks.
// - Execute authorization policies.
// - Communicate with external systems.
//
// Cross-aggregate eligibility and authorization rules belong to the
// appropriate application/domain boundary.
//
// -----------------------------------------------------------------------------
//
// Uniqueness:
//
// The persistence model enforces:
//
//     UNIQUE(roleId, permissionId)
//
// Therefore the repository exposes a Role + Permission lookup and existence
// contract so the application/domain coordination layer can prevent duplicate
// logical assignments before persistence.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { RolePermissionAggregate } from '../aggregates/role-permission.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import type { RolePermissionEntity } from '../entities/role-permission.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { RolePermissionPublicId } from '../value-objects/role-permission-public-id.vo';

import type { RolePermissionRolePublicId } from '../value-objects/role-permission-role-public-id.vo';

import type { RolePermissionPermissionPublicId } from '../value-objects/role-permission-permission-public-id.vo';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// =============================================================================
// Repository
// =============================================================================

export interface RolePermissionRepository {
  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists a RolePermission aggregate.
   *
   * The repository implementation is responsible for translating the
   * aggregate into its persistence representation.
   */
  save(aggregate: RolePermissionAggregate): Promise<void>;

  /**
   * Removes a RolePermission aggregate.
   *
   * Removal represents revocation of the Role-to-Permission relationship
   * when the persistence model represents revocation through deletion.
   */
  delete(aggregate: RolePermissionAggregate): Promise<void>;

  // ===========================================================================
  // Aggregate Queries
  // ===========================================================================

  /**
   * Finds a RolePermission aggregate by its public identifier.
   *
   * The public identifier identifies the assignment itself.
   */
  findByPublicId(
    publicId: RolePermissionPublicId,
  ): Promise<RolePermissionAggregate | null>;

  /**
   * Finds the RolePermission aggregate representing the supplied
   * Role-to-Permission relationship.
   *
   * This is the primary logical uniqueness lookup for the aggregate.
   */
  findByRolePublicIdAndPermissionPublicId(
    rolePublicId: RolePermissionRolePublicId,
    permissionPublicId: RolePermissionPermissionPublicId,
  ): Promise<RolePermissionAggregate | null>;

  /**
   * Finds all RolePermission aggregates belonging to a Role.
   *
   * The Role is a separate aggregate and is referenced through its
   * public identity.
   */
  findByRolePublicId(
    rolePublicId: RolePermissionRolePublicId,
  ): Promise<RolePermissionAggregate[]>;

  /**
   * Finds all RolePermission aggregates referencing a Permission.
   *
   * The Permission is a separate aggregate and is referenced through its
   * public identity.
   */
  findByPermissionPublicId(
    permissionPublicId: RolePermissionPermissionPublicId,
  ): Promise<RolePermissionAggregate[]>;

  // ===========================================================================
  // Entity Queries
  // ===========================================================================

  /**
   * Finds a RolePermission entity by its public identifier.
   *
   * This returns the aggregate root entity without wrapping it in the
   * aggregate.
   */
  findEntityByPublicId(
    publicId: RolePermissionPublicId,
  ): Promise<RolePermissionEntity | null>;

  /**
   * Finds a RolePermission entity by its internal identifier.
   *
   * Intended primarily for persistence-oriented and infrastructure
   * operations.
   */
  findEntityById(id: UniqueEntityId): Promise<RolePermissionEntity | null>;

  /**
   * Finds all RolePermission entities associated with a Role internal
   * identifier.
   *
   * Intended primarily for infrastructure and persistence operations.
   *
   * The internal Role identifier must remain inside the persistence
   * boundary and must not become part of the domain's cross-aggregate
   * public reference model.
   */
  findEntityByRoleId(roleId: UniqueEntityId): Promise<RolePermissionEntity[]>;

  /**
   * Finds all RolePermission entities associated with a Permission
   * internal identifier.
   *
   * Intended primarily for infrastructure and persistence operations.
   */
  findEntityByPermissionId(
    permissionId: UniqueEntityId,
  ): Promise<RolePermissionEntity[]>;

  // ===========================================================================
  // Role Queries
  // ===========================================================================

  /**
   * Returns all permissions assigned to a Role.
   *
   * The repository returns RolePermission aggregates because each
   * assignment is an aggregate boundary.
   */
  findAssignmentsByRolePublicId(
    rolePublicId: RolePermissionRolePublicId,
  ): Promise<RolePermissionAggregate[]>;

  /**
   * Returns all assignments between a Role and a collection of Permissions.
   *
   * Useful for role authorization-management workflows.
   */
  findByRolePublicIdAndPermissionPublicIds(
    rolePublicId: RolePermissionRolePublicId,
    permissionPublicIds: RolePermissionPermissionPublicId[],
  ): Promise<RolePermissionAggregate[]>;

  // ===========================================================================
  // Permission Queries
  // ===========================================================================

  /**
   * Returns all Roles to which a Permission has been assigned.
   *
   * The repository returns RolePermission aggregates rather than Role
   * aggregates because Role is a separate aggregate boundary.
   */
  findAssignmentsByPermissionPublicId(
    permissionPublicId: RolePermissionPermissionPublicId,
  ): Promise<RolePermissionAggregate[]>;

  // ===========================================================================
  // Relationship Queries
  // ===========================================================================

  /**
   * Finds the assignment connecting a specific Role and Permission.
   *
   * This method is semantically equivalent to
   * findByRolePublicIdAndPermissionPublicId and provides an explicit
   * relationship-oriented name for authorization workflows.
   */
  findAssignment(
    rolePublicId: RolePermissionRolePublicId,
    permissionPublicId: RolePermissionPermissionPublicId,
  ): Promise<RolePermissionAggregate | null>;

  /**
   * Returns true when the supplied Role and Permission are already
   * connected by a RolePermission assignment.
   *
   * This supports duplicate-assignment prevention.
   *
   * The database UNIQUE(roleId, permissionId) constraint remains the
   * ultimate persistence-level guarantee.
   */
  existsAssignment(
    rolePublicId: RolePermissionRolePublicId,
    permissionPublicId: RolePermissionPermissionPublicId,
  ): Promise<boolean>;

  // ===========================================================================
  // Existence
  // ===========================================================================

  /**
   * Returns true if a RolePermission aggregate exists for the supplied
   * public identifier.
   */
  existsByPublicId(publicId: RolePermissionPublicId): Promise<boolean>;

  /**
   * Returns true if a RolePermission aggregate exists for the supplied
   * internal identifier.
   */
  existsById(id: UniqueEntityId): Promise<boolean>;

  /**
   * Returns true if at least one Permission assignment exists for the
   * supplied Role.
   */
  existsByRolePublicId(
    rolePublicId: RolePermissionRolePublicId,
  ): Promise<boolean>;

  /**
   * Returns true if at least one Role assignment exists for the supplied
   * Permission.
   */
  existsByPermissionPublicId(
    permissionPublicId: RolePermissionPermissionPublicId,
  ): Promise<boolean>;
  // ===========================================================================
  // Aggregate Collection Queries
  // ===========================================================================

  /**
   * Finds all RolePermission aggregates.
   *
   * Each returned aggregate represents one logical Role-to-Permission
   * authorization relationship.
   *
   * The repository implementation is responsible for rehydrating each complete
   * RolePermission aggregate.
   */
  findAll(): Promise<RolePermissionAggregate[]>;

  /**
   * Returns true if the supplied Role and Permission already have an
   * authorization relationship.
   *
   * This is the repository-level uniqueness check corresponding to:
   *
   *     UNIQUE(roleId, permissionId)
   */
  existsByRolePublicIdAndPermissionPublicId(
    rolePublicId: RolePermissionRolePublicId,
    permissionPublicId: RolePermissionPermissionPublicId,
  ): Promise<boolean>;
}
