// -----------------------------------------------------------------------------
// Identity — Permission Repository
// -----------------------------------------------------------------------------
//
// Repository contract for the Permission aggregate.
//
// Aggregate ownership:
//
// PermissionAggregate
// └── PermissionEntity
//
// Permission is the authoritative owner of:
//
// - Permission identity;
// - stable PermissionCode;
// - protected resource;
// - authorized action;
// - human-readable name;
// - optional description;
// - system/custom designation;
// - active/inactive lifecycle.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Persist Permission aggregates.
// - Retrieve Permission aggregates.
// - Support Permission public-identity lookup.
// - Support stable PermissionCode lookup.
// - Support resource/action capability lookup.
// - Support active/inactive queries.
// - Support system/custom Permission queries.
// - Support assignment-eligibility queries.
// - Support existence checks.
// - Support entity-level persistence lookups.
//
// -----------------------------------------------------------------------------
//
// This repository does NOT:
// - Depend on Prisma.
// - Depend on ORM models.
// - Depend on database-specific implementation details.
// - Assign Permissions to Roles.
// - Remove Permissions from Roles.
// - Manage RolePermission persistence.
// - Decide whether a Role may receive a Permission.
// - Evaluate authorization.
// - Execute authorization policies.
// - Communicate with external systems.
//
// RolePermission is a separate aggregate boundary. Permission/Role
// coordination belongs to the appropriate application/domain boundary.
//
// -----------------------------------------------------------------------------
//
// Uniqueness:
//
// The persistence model enforces:
//
//     UNIQUE(resource, action)
//
// The repository therefore exposes capability lookup and existence methods.
// The database remains the final persistence-level uniqueness guarantee.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { PermissionAggregate } from '../aggregates/permission.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import type { PermissionEntity } from '../entities/permission.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { PermissionPublicId } from '../value-objects/permission-public-id.vo';

import type { PermissionCode } from '../value-objects/permission-code.vo';

import type { PermissionResource } from '../value-objects/permission-resource.vo';

import type { PermissionAction } from '../value-objects/permission-action.vo';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// =============================================================================
// Repository
// =============================================================================

export interface PermissionRepository {
  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists a Permission aggregate.
   *
   * The repository implementation is responsible for translating the
   * aggregate into its persistence representation.
   */
  save(aggregate: PermissionAggregate): Promise<void>;

  /**
   * Removes a Permission aggregate.
   *
   * Application/domain policy is responsible for determining whether a
   * Permission is eligible for deletion. The repository only performs the
   * persistence operation.
   */
  delete(aggregate: PermissionAggregate): Promise<void>;

  // ===========================================================================
  // Aggregate Queries
  // ===========================================================================

  /**
   * Finds a Permission aggregate by its public identifier.
   */
  findByPublicId(
    publicId: PermissionPublicId,
  ): Promise<PermissionAggregate | null>;

  /**
   * Finds a Permission aggregate by its stable machine-readable code.
   *
   * PermissionCode is the domain-level stable identifier used by
   * authorization policies and application code.
   */
  findByCode(code: PermissionCode): Promise<PermissionAggregate | null>;

  /**
   * Finds a Permission aggregate by its protected resource and action.
   *
   * This corresponds to the persistence uniqueness invariant:
   *
   *     UNIQUE(resource, action)
   */
  findByResourceAndAction(
    resource: PermissionResource,
    action: PermissionAction,
  ): Promise<PermissionAggregate | null>;

  // ===========================================================================
  // Entity Queries
  // ===========================================================================

  /**
   * Finds a Permission entity by its public identifier.
   *
   * This returns the aggregate root entity without wrapping it in the
   * aggregate.
   */
  findEntityByPublicId(
    publicId: PermissionPublicId,
  ): Promise<PermissionEntity | null>;

  /**
   * Finds a Permission entity by its internal identifier.
   *
   * Intended primarily for persistence-oriented and infrastructure
   * operations.
   */
  findEntityById(id: UniqueEntityId): Promise<PermissionEntity | null>;

  /**
   * Finds a Permission entity by its stable PermissionCode.
   *
   * Intended primarily for persistence-oriented lookup workflows.
   */
  findEntityByCode(code: PermissionCode): Promise<PermissionEntity | null>;

  /**
   * Finds a Permission entity by its resource/action capability.
   *
   * Intended primarily for persistence-oriented and infrastructure
   * operations.
   */
  findEntityByResourceAndAction(
    resource: PermissionResource,
    action: PermissionAction,
  ): Promise<PermissionEntity | null>;

  // ===========================================================================
  // Capability Queries
  // ===========================================================================

  /**
   * Finds all Permissions protecting the supplied resource.
   *
   * Multiple actions may exist for the same protected resource.
   */
  findByResource(resource: PermissionResource): Promise<PermissionAggregate[]>;

  /**
   * Finds all active Permissions protecting the supplied resource.
   */
  findActiveByResource(
    resource: PermissionResource,
  ): Promise<PermissionAggregate[]>;

  /**
   * Finds all Permissions representing the supplied action.
   *
   * Actions may be shared across multiple protected resources.
   */
  findByAction(action: PermissionAction): Promise<PermissionAggregate[]>;

  /**
   * Finds all active Permissions representing the supplied action.
   */
  findActiveByAction(action: PermissionAction): Promise<PermissionAggregate[]>;

  /**
   * Finds all Permissions matching a resource/action capability.
   *
   * Under the resource/action uniqueness invariant this returns at most one
   * Permission.
   */
  findByCapability(
    resource: PermissionResource,
    action: PermissionAction,
  ): Promise<PermissionAggregate | null>;

  // ===========================================================================
  // Lifecycle Queries
  // ===========================================================================

  /**
   * Finds all active Permissions.
   *
   * Active Permissions are eligible for new authorization assignments,
   * subject to Role and authorization-boundary rules.
   */
  findActive(): Promise<PermissionAggregate[]>;

  /**
   * Finds all inactive Permissions.
   *
   * Inactive Permissions are not eligible for new authorization assignments.
   */
  findInactive(): Promise<PermissionAggregate[]>;

  /**
   * Finds all Permissions currently eligible for authorization assignment.
   *
   * At the Permission level, assignment eligibility is equivalent to the
   * Permission being active.
   */
  findAssignable(): Promise<PermissionAggregate[]>;

  // ===========================================================================
  // System / Custom Queries
  // ===========================================================================

  /**
   * Finds all system-defined Permissions.
   *
   * System Permissions are protected by Permission lifecycle rules.
   */
  findSystemPermissions(): Promise<PermissionAggregate[]>;

  /**
   * Finds all active system-defined Permissions.
   */
  findActiveSystemPermissions(): Promise<PermissionAggregate[]>;

  /**
   * Finds all custom/application-defined Permissions.
   */
  findCustomPermissions(): Promise<PermissionAggregate[]>;

  /**
   * Finds all active custom/application-defined Permissions.
   */
  findActiveCustomPermissions(): Promise<PermissionAggregate[]>;

  // ===========================================================================
  // Existence
  // ===========================================================================

  /**
   * Returns true if a Permission exists for the supplied public identifier.
   */
  existsByPublicId(publicId: PermissionPublicId): Promise<boolean>;

  /**
   * Returns true if a Permission exists for the supplied internal identifier.
   */
  existsById(id: UniqueEntityId): Promise<boolean>;

  /**
   * Returns true if a Permission exists for the supplied stable code.
   */
  existsByCode(code: PermissionCode): Promise<boolean>;

  /**
   * Returns true if a Permission exists for the supplied resource/action
   * capability.
   *
   * This corresponds to:
   *
   *     UNIQUE(resource, action)
   */
  existsByResourceAndAction(
    resource: PermissionResource,
    action: PermissionAction,
  ): Promise<boolean>;

  /**
   * Returns true if an active Permission exists for the supplied resource
   * and action.
   *
   * This is useful when determining whether an authorization capability is
   * currently available for assignment.
   */
  existsActiveByResourceAndAction(
    resource: PermissionResource,
    action: PermissionAction,
  ): Promise<boolean>;

  /**
   * Returns true if an active Permission exists for the supplied stable
   * PermissionCode.
   */
  existsActiveByCode(code: PermissionCode): Promise<boolean>;

  /**
   * Returns true if at least one Permission exists for the supplied resource.
   */
  existsByResource(resource: PermissionResource): Promise<boolean>;

  /**
   * Returns true if at least one Permission exists for the supplied action.
   */
  existsByAction(action: PermissionAction): Promise<boolean>;

  /**
   * Returns true if at least one active Permission exists for the supplied
   * resource.
   */
  existsActiveByResource(resource: PermissionResource): Promise<boolean>;

  /**
   * Returns true if at least one active Permission exists for the supplied
   * action.
   */
  existsActiveByAction(action: PermissionAction): Promise<boolean>;
}
