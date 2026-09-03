// -----------------------------------------------------------------------------
// Identity — Get Roles Query
// -----------------------------------------------------------------------------
//
// Read-model query for retrieving Role aggregates.
//
// Aggregate ownership:
//
// RoleAggregate
// └── RoleEntity
//
// Query responsibility:
//
// - request a collection of Roles;
// - optionally constrain the collection through application-level filters;
// - remain immutable;
// - contain no business logic;
// - contain no persistence concerns;
// - contain no authorization logic;
// - contain no aggregate mutation logic.
//
// The query handler is responsible for:
//
// - selecting the appropriate RoleRepository query;
// - retrieving the Role aggregates;
// - translating them into application response/read models.
//
// This query does NOT:
//
// - assign Roles to Identities;
// - revoke Roles from Identities;
// - evaluate permissions;
// - manage IdentityRole;
// - manage RolePermission.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT
//
// The repository already exposes several semantically distinct collection
// queries:
//
// - findActive()
// - findInactive()
// - findAssignable()
// - findSystemRoles()
// - findActiveSystemRoles()
// - findCustomRoles()
// - findActiveCustomRoles()
// - findAllOrderedByDisplayOrder()
// - findActiveOrderedByDisplayOrder()
//
// The query therefore uses explicit filters rather than exposing repository
// or persistence concepts directly.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Query
// =============================================================================

/**
 * Filters supported when retrieving a collection of Roles.
 *
 * All properties are optional.
 *
 * When no filter is supplied, the handler should retrieve all Roles using
 * the repository's general Role collection strategy.
 */
export interface GetRolesQueryFilters {
  /**
   * Restricts the result to active or inactive Roles.
   */
  isActive?: boolean;

  /**
   * Restricts the result to system-defined or custom Roles.
   */
  isSystem?: boolean;

  /**
   * Restricts the result to Roles currently eligible for assignment.
   *
   * This is a domain-level read filter and should resolve to the repository's
   * assignment-eligibility query.
   */
  assignable?: boolean;

  /**
   * Orders the result by administrative display order.
   */
  orderByDisplayOrder?: boolean;
}

// =============================================================================
// Query
// =============================================================================

/**
 * Requests a collection of Role aggregates.
 */
export class GetRolesQuery {
  public constructor(
    /**
     * Optional Role collection filters.
     */
    public readonly filters: GetRolesQueryFilters = {},
  ) {}
}
