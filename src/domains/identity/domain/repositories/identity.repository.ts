// -----------------------------------------------------------------------------
// Identity Repository
// -----------------------------------------------------------------------------
//
// Repository contract for the Identity aggregate.
//
// Aggregate ownership:
//
// IdentityAggregate
// └── IdentityEntity
//     └── IdentityRoleEntity[]
//
// Repository boundary:
//
// - IdentityAggregate is the unit of persistence.
// - IdentityEntity is the aggregate root entity.
// - IdentityRoleEntity is persisted as part of the aggregate.
// - Cross-aggregate references remain opaque public identities.
// - Infrastructure implementations must preserve aggregate invariants.
//
// This interface belongs to the Identity domain. It does not depend on
// Prisma, ORM models, HTTP DTOs, authentication, or other domains' internals.
//
// -----------------------------------------------------------------------------

import type { IdentityAggregate } from '../aggregates/identity.aggregate';

import type { IdentityPublicId } from '../value-objects/identity-public-id.vo';
import type { IdentityEmail } from '../value-objects/identity-email.vo';
import type { IdentityPhoneNumber } from '../value-objects/identity-phone-number.vo';
import type { IdentityStatus } from '../value-objects/identity-status.vo';
import type { IdentityRoleRolePublicId } from '../value-objects/identity-role-role-public-id.vo';

// =============================================================================
// Directory Search Contract
// =============================================================================

/**
 * Supported fields for deterministic Identity directory sorting.
 *
 * Keep this contract independent of HTTP query DTOs and Prisma types.
 */
export type IdentityDirectorySortField =
  'createdAt' | 'updatedAt' | 'email' | 'status';

export type IdentityDirectorySortDirection = 'asc' | 'desc';

/**
 * Criteria for searching the Identity directory.
 *
 * The application layer is responsible for validating and normalizing
 * incoming values before calling the repository.
 *
 * `createdFrom` and `createdTo` are inclusive date boundaries.
 * `rolePublicId`, when supplied, filters by a currently active role assignment.
 */

export interface IdentityDirectoryCriteria {
  readonly page: number;
  readonly pageSize: number;
  readonly search?: string | undefined;
  readonly status?: IdentityStatus | undefined;
  readonly rolePublicId?: IdentityRoleRolePublicId | undefined;
  readonly createdFrom?: Date | undefined;
  readonly createdTo?: Date | undefined;
  readonly sortBy: IdentityDirectorySortField;
  readonly sortDirection: IdentityDirectorySortDirection;
}


/**
 * One paginated result from the Identity directory.
 *
 * Items must be complete, rehydrated Identity aggregates, including their
 * aggregate-owned role assignments.
 */
export interface IdentityDirectoryPage {
  readonly items: IdentityAggregate[];
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly totalPages: number;
}

// =============================================================================
// Repository
// =============================================================================

export interface IdentityRepository {
  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists a new Identity aggregate and its owned role assignments atomically.
   */
  create(aggregate: IdentityAggregate): Promise<void>;

  /**
   * Persists an existing aggregate and synchronizes its owned role assignments
   * within the same persistence transaction.
   */
  save(aggregate: IdentityAggregate): Promise<void>;

  // ===========================================================================
  // Aggregate Retrieval
  // ===========================================================================

  /**
   * Finds a complete aggregate by its internal persistence identifier.
   *
   * Rehydration must use IdentityAggregate.rehydrate() and must not emit
   * creation or other domain events.
   */
  findById(id: string): Promise<IdentityAggregate | null>;

  /**
   * Finds a complete aggregate by its public identifier.
   */
  findByPublicId(publicId: IdentityPublicId): Promise<IdentityAggregate | null>;

  /**
   * Searches the Identity directory using database-side filtering, pagination,
   * and deterministic sorting.
   *
   * Implementations must:
   * - apply filters before pagination;
   * - use a stable tie-breaker when sorting;
   * - return complete, rehydrated aggregates with owned role assignments;
   * - calculate totalItems from the full filtered result set;
   * - avoid loading the entire Identity collection into memory;
   * - treat revoked and expired role assignments as inactive for role filters.
   *
   * This method does not define an HTTP endpoint. The application and HTTP
   * layers must expose it deliberately.
   */
  searchDirectory(
    criteria: IdentityDirectoryCriteria,
  ): Promise<IdentityDirectoryPage>;

  // ===========================================================================
  // Contact Identity
  // ===========================================================================

  /**
   * Finds an aggregate by email address.
   */
  findByEmail(email: IdentityEmail): Promise<IdentityAggregate | null>;

  /**
   * Finds an aggregate by phone number.
   */
  findByPhoneNumber(
    phoneNumber: IdentityPhoneNumber,
  ): Promise<IdentityAggregate | null>;

  // ===========================================================================
  // Lifecycle Queries
  // ===========================================================================

  /**
   * Counts all Identity records without rehydrating aggregates.
   */
  count(): Promise<number>;

  /**
   * Finds complete aggregates by lifecycle status.
   */
  findByStatus(status: IdentityStatus): Promise<IdentityAggregate[]>;

  findPending(): Promise<IdentityAggregate[]>;

  findActive(): Promise<IdentityAggregate[]>;

  findSuspended(): Promise<IdentityAggregate[]>;

  /**
   * CLOSED is the terminal Identity lifecycle state.
   */
  findClosed(): Promise<IdentityAggregate[]>;

  // ===========================================================================
  // Role Queries
  // ===========================================================================

  /**
   * Finds complete aggregates with a currently active assignment for the
   * supplied Role public identifier.
   */
  findByActiveRole(
    rolePublicId: IdentityRoleRolePublicId,
  ): Promise<IdentityAggregate[]>;

  // ===========================================================================
  // Existence
  // ===========================================================================

  existsByPublicId(publicId: IdentityPublicId): Promise<boolean>;

  existsByEmail(email: IdentityEmail): Promise<boolean>;

  existsByPhoneNumber(phoneNumber: IdentityPhoneNumber): Promise<boolean>;

  /**
   * Returns true only if an active assignment exists. Revoked or expired
   * assignments must not count as active.
   */
  existsByActiveRole(rolePublicId: IdentityRoleRolePublicId): Promise<boolean>;
}
