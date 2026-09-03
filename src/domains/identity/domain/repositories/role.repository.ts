// -----------------------------------------------------------------------------
// Identity — Role Repository
// -----------------------------------------------------------------------------
//
// Repository contract for the Role aggregate.
//
// Aggregate ownership:
//
// RoleAggregate
// └── RoleEntity
//
// Role is the authoritative owner of:
//
// - Role identity;
// - stable RoleCode;
// - human-readable RoleName;
// - optional description;
// - administrative display ordering;
// - system/custom designation;
// - active/inactive lifecycle.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Persist Role aggregates.
// - Retrieve Role aggregates.
// - Support Role public-identity lookup.
// - Support stable RoleCode lookup.
// - Support active/inactive queries.
// - Support system/custom Role queries.
// - Support assignment-eligibility queries.
// - Support display-order queries.
// - Support existence checks.
// - Support entity-level persistence lookups.
//
// -----------------------------------------------------------------------------
//
// This repository does NOT:
// - Depend on Prisma.
// - Depend on ORM models.
// - Assign Roles to Identities.
// - Revoke Roles from Identities.
// - Manage IdentityRole persistence.
// - Manage RolePermission persistence.
// - Evaluate authorization.
// - Evaluate Permission assignments.
// - Decide whether an Identity may receive a Role.
// - Communicate with external systems.
//
// IdentityRole and RolePermission are separate relationship boundaries.
// Cross-aggregate coordination belongs to the appropriate
// application/domain service boundary.
//
// -----------------------------------------------------------------------------
//
// Uniqueness:
//
// The persistence model should enforce uniqueness of the stable RoleCode:
//
//     UNIQUE(code)
//
// The repository therefore exposes RoleCode lookup and existence methods.
// The database remains the final persistence-level uniqueness guarantee.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { RoleAggregate } from '../aggregates/role.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import type { RoleEntity } from '../entities/role.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { RolePublicId } from '../value-objects/role-public-id.vo';

import type { RoleCode } from '../value-objects/role-code.vo';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// =============================================================================
// Repository
// =============================================================================

export interface RoleRepository {
  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists a Role aggregate.
   *
   * The repository implementation is responsible for translating the
   * aggregate into its persistence representation.
   */
  save(aggregate: RoleAggregate): Promise<void>;

  /**
   * Removes a Role aggregate.
   *
   * Application/domain policy is responsible for determining whether a
   * Role is eligible for deletion. The repository only performs the
   * persistence operation.
   */
  delete(aggregate: RoleAggregate): Promise<void>;

  // ===========================================================================
  // Aggregate Queries
  // ===========================================================================

  /**
   * Finds a Role aggregate by its public identifier.
   */
  findByPublicId(publicId: RolePublicId): Promise<RoleAggregate | null>;

  /**
   * Finds a Role aggregate by its stable machine-readable RoleCode.
   *
   * RoleCode is the domain-level stable identifier used by authorization
   * policies and application code.
   */
  findByCode(code: RoleCode): Promise<RoleAggregate | null>;

  // ===========================================================================
  // Entity Queries
  // ===========================================================================

  /**
   * Finds a Role entity by its public identifier.
   *
   * This returns the aggregate root entity without wrapping it in the
   * aggregate.
   */
  findEntityByPublicId(publicId: RolePublicId): Promise<RoleEntity | null>;

  /**
   * Finds a Role entity by its internal identifier.
   *
   * Intended primarily for persistence-oriented and infrastructure
   * operations.
   */
  findEntityById(id: UniqueEntityId): Promise<RoleEntity | null>;

  /**
   * Finds a Role entity by its stable RoleCode.
   *
   * Intended primarily for persistence-oriented lookup workflows.
   */
  findEntityByCode(code: RoleCode): Promise<RoleEntity | null>;

  // ===========================================================================
  // Lifecycle Queries
  // ===========================================================================

  /**
   * Finds all active Roles.
   *
   * Active Roles are eligible for new IdentityRole assignments,
   * subject to the authorization/application rules governing the
   * requesting operation.
   */
  findActive(): Promise<RoleAggregate[]>;

  /**
   * Finds all inactive Roles.
   *
   * Inactive Roles are not eligible for new assignments.
   */
  findInactive(): Promise<RoleAggregate[]>;

  /**
   * Finds all Roles currently eligible for assignment.
   *
   * At the Role level, assignment eligibility is equivalent to the
   * Role being active.
   */
  findAssignable(): Promise<RoleAggregate[]>;

  // ===========================================================================
  // System / Custom Queries
  // ===========================================================================

  /**
   * Finds all system-defined Roles.
   *
   * System Roles are protected by Role lifecycle rules.
   */
  findSystemRoles(): Promise<RoleAggregate[]>;

  /**
   * Finds all active system-defined Roles.
   */
  findActiveSystemRoles(): Promise<RoleAggregate[]>;

  /**
   * Finds all custom/application-defined Roles.
   */
  findCustomRoles(): Promise<RoleAggregate[]>;

  /**
   * Finds all active custom/application-defined Roles.
   */
  findActiveCustomRoles(): Promise<RoleAggregate[]>;

  // ===========================================================================
  // Ordering Queries
  // ===========================================================================

  /**
   * Finds all Roles ordered by their administrative display order.
   *
   * Implementations should order by displayOrder ascending.
   *
   * Where displayOrder values are equal, the implementation should apply
   * a deterministic secondary ordering.
   */
  findAllOrderedByDisplayOrder(): Promise<RoleAggregate[]>;

  /**
   * Finds all active Roles ordered by their administrative display order.
   *
   * Implementations should order by displayOrder ascending.
   */
  findActiveOrderedByDisplayOrder(): Promise<RoleAggregate[]>;

  // ===========================================================================
  // Existence
  // ===========================================================================

  /**
   * Returns true if a Role exists for the supplied public identifier.
   */
  existsByPublicId(publicId: RolePublicId): Promise<boolean>;

  /**
   * Returns true if a Role exists for the supplied internal identifier.
   */
  existsById(id: UniqueEntityId): Promise<boolean>;

  /**
   * Returns true if a Role exists for the supplied stable RoleCode.
   *
   * This corresponds to the persistence uniqueness invariant:
   *
   *     UNIQUE(code)
   */
  existsByCode(code: RoleCode): Promise<boolean>;

  /**
   * Returns true if an active Role exists for the supplied stable RoleCode.
   *
   * Useful when determining whether a specific role is currently available
   * for assignment.
   */
  existsActiveByCode(code: RoleCode): Promise<boolean>;

  /**
   * Returns true if at least one active Role exists.
   */
  existsActive(): Promise<boolean>;

  /**
   * Returns true if at least one inactive Role exists.
   */
  existsInactive(): Promise<boolean>;

  /**
   * Returns true if a system Role exists for the supplied RoleCode.
   */
  existsSystemByCode(code: RoleCode): Promise<boolean>;

  /**
   * Returns true if a custom/application-defined Role exists for the
   * supplied RoleCode.
   */
  existsCustomByCode(code: RoleCode): Promise<boolean>;
}
