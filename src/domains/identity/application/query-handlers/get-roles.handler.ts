// -----------------------------------------------------------------------------
// Identity — Get Roles Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving Role aggregates.
//
// Aggregate:
//
// RoleAggregate
// └── RoleEntity
//
// Responsibilities:
//
// - select the appropriate RoleRepository query;
// - combine repository results when multiple application filters are used;
// - apply application-level collection filtering where necessary;
// - return Role aggregates.
//
// The handler does NOT:
//
// - mutate RoleEntity;
// - activate or deactivate Roles;
// - assign Roles to Identities;
// - revoke IdentityRole assignments;
// - create RolePermission relationships;
// - evaluate authorization;
// - create domain events;
// - persist aggregates;
// - access Prisma directly;
// - expose persistence models;
// - perform external side effects.
//
// -----------------------------------------------------------------------------
//
// Supported query filters:
//
// - isActive
// - isSystem
// - assignable
// - orderByDisplayOrder
//
// Repository mapping:
//
// isActive = true
//     -> findActive()
//
// isActive = false
//     -> findInactive()
//
// assignable = true
//     -> findAssignable()
//
// isSystem = true
//     -> findSystemRoles()
//
// isSystem = false
//     -> findCustomRoles()
//
// orderByDisplayOrder = true
//     -> repository ordering methods where applicable
//
// -----------------------------------------------------------------------------
//
// Important:
//
// The RoleRepository does not expose a single "find all" method.
//
// Therefore, when no lifecycle filter is supplied, the handler uses:
//
//     findAllOrderedByDisplayOrder()
//
// as the canonical complete Role collection query.
//
// When application filters cannot be represented by one repository method,
// the handler composes repository results and applies the remaining filters
// in memory.
//
// This is application-level query orchestration, not domain logic.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { IDENTITY_TOKENS } from '../identity.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type {
  GetRolesQuery,
  GetRolesQueryFilters,
} from '../queries/get-roles.query';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { RoleAggregate } from '../../domain/aggregates/role.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { RoleRepository } from '../../domain/repositories/role.repository';

// =============================================================================
// Handler
// =============================================================================

/**
 * Handles retrieval of Role aggregates using application-level filters.
 */
@Injectable()
export class GetRolesHandler implements QueryHandler<
  GetRolesQuery,
  RoleAggregate[]
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(IDENTITY_TOKENS.REPOSITORIES.ROLE)
    private readonly roleRepository: RoleRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes the GetRolesQuery.
   *
   * The handler selects the narrowest repository query available and applies
   * remaining collection filters at the application boundary.
   */
  public async execute(query: GetRolesQuery): Promise<RoleAggregate[]> {
    // -------------------------------------------------------------------------
    // 1. Query guard
    // -------------------------------------------------------------------------

    if (query === undefined) {
      throw new Error('Get roles query is required.');
    }

    // -------------------------------------------------------------------------
    // 2. Normalize filters
    // -------------------------------------------------------------------------

    const filters: GetRolesQueryFilters = query.filters ?? {};

    // -------------------------------------------------------------------------
    // 3. Resolve initial repository collection
    // -------------------------------------------------------------------------
    //
    // Prefer a repository query that represents the strongest filter already
    // requested by the caller.
    // -------------------------------------------------------------------------

    let roles: RoleAggregate[];

    // -------------------------------------------------------------------------
    // Explicit assignability query
    // -------------------------------------------------------------------------

    if (filters.assignable === true) {
      roles = filters.orderByDisplayOrder
        ? await this.resolveAssignableOrdered()
        : await this.roleRepository.findAssignable();
    }

    // -------------------------------------------------------------------------
    // Explicit active/inactive lifecycle query
    // -------------------------------------------------------------------------
    else if (filters.isActive === true) {
      roles = filters.orderByDisplayOrder
        ? await this.roleRepository.findActiveOrderedByDisplayOrder()
        : await this.roleRepository.findActive();
    } else if (filters.isActive === false) {
      roles = await this.roleRepository.findInactive();
    }

    // -------------------------------------------------------------------------
    // Explicit system/custom query
    // -------------------------------------------------------------------------
    else if (filters.isSystem === true) {
      roles = filters.orderByDisplayOrder
        ? await this.roleRepository.findSystemRoles()
        : await this.roleRepository.findSystemRoles();
    } else if (filters.isSystem === false) {
      roles = await this.roleRepository.findCustomRoles();
    }

    // -------------------------------------------------------------------------
    // No narrowing filter
    // -------------------------------------------------------------------------
    else {
      roles = await this.roleRepository.findAllOrderedByDisplayOrder();
    }

    // -------------------------------------------------------------------------
    // 4. Apply remaining application-level filters
    // -------------------------------------------------------------------------

    roles = this.applyRemainingFilters(roles, filters);

    // -------------------------------------------------------------------------
    // 5. Apply requested ordering
    // -------------------------------------------------------------------------

    if (filters.orderByDisplayOrder) {
      roles = this.orderByDisplayOrder(roles);
    }

    // -------------------------------------------------------------------------
    // 6. Return Role aggregates
    // -------------------------------------------------------------------------

    return roles;
  }

  // ===========================================================================
  // Repository Composition
  // ===========================================================================

  /**
   * Resolves assignable Roles while retaining deterministic display ordering.
   *
   * The current RoleRepository does not expose an
   * `findAssignableOrderedByDisplayOrder()` method.
   *
   * Therefore ordering is applied at the application boundary.
   */
  private async resolveAssignableOrdered(): Promise<RoleAggregate[]> {
    const roles = await this.roleRepository.findAssignable();

    return this.orderByDisplayOrder(roles);
  }

  // ===========================================================================
  // Remaining Filters
  // ===========================================================================

  /**
   * Applies filters that were not already represented by the selected
   * repository query.
   *
   * The handler uses aggregate predicates rather than accessing RoleEntity
   * persistence state.
   */
  private applyRemainingFilters(
    roles: RoleAggregate[],
    filters: GetRolesQueryFilters,
  ): RoleAggregate[] {
    let result = roles;

    // -------------------------------------------------------------------------
    // Active / inactive
    // -------------------------------------------------------------------------

    if (filters.isActive !== undefined) {
      result = result.filter((role) => role.isActive === filters.isActive);
    }

    // -------------------------------------------------------------------------
    // System / custom
    // -------------------------------------------------------------------------

    if (filters.isSystem !== undefined) {
      result = result.filter((role) => role.isSystem === filters.isSystem);
    }

    // -------------------------------------------------------------------------
    // Assignment eligibility
    // -------------------------------------------------------------------------

    if (filters.assignable === true) {
      result = result.filter((role) => role.canBeAssigned());
    }

    return result;
  }

  // ===========================================================================
  // Ordering
  // ===========================================================================

  /**
   * Orders Roles by administrative display order.
   *
   * A deterministic secondary ordering is applied using Role public identity.
   */
  private orderByDisplayOrder(roles: RoleAggregate[]): RoleAggregate[] {
    return [...roles].sort((left, right) => {
      const displayOrderDifference = left.displayOrder - right.displayOrder;

      if (displayOrderDifference !== 0) {
        return displayOrderDifference;
      }

      return left.publicId.value.localeCompare(right.publicId.value);
    });
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetRolesHandler;
