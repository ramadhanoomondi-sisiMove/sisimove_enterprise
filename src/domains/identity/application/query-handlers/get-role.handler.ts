// -----------------------------------------------------------------------------
// Identity — Get Role Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving a single Role aggregate.
//
// Aggregate:
//
// RoleAggregate
// └── RoleEntity
//
// Responsibilities:
//
// - resolve the Role aggregate by RolePublicId;
// - ensure the Role exists;
// - return the complete RoleAggregate.
//
// The handler does NOT:
//
// - mutate RoleEntity;
// - activate or deactivate the Role;
// - assign the Role to an Identity;
// - revoke IdentityRole assignments;
// - create RolePermission relationships;
// - evaluate permissions;
// - create domain events;
// - persist the aggregate;
// - access Prisma directly;
// - expose persistence models;
// - perform external side effects.
//
// Query behavior belongs to the application layer.
// Aggregate reconstruction belongs to the repository/infrastructure layer.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     GetRoleQuery
//          │
//          ▼
// roleRepository.findByPublicId()
//          │
//          ├── not found → throw
//          │
//          ▼
//      RoleAggregate
//          │
//          ▼
//         return
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

import type { GetRoleQuery } from '../queries/get-role.query';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { RoleAggregate } from '../../domain/aggregates/role.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { RoleRepository } from '../../domain/repositories/role.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { RoleNotFoundException } from '../../domain/exceptions/role-not-found.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Handles retrieval of a single Role aggregate.
 *
 * The repository is responsible for rehydrating the complete aggregate.
 *
 * No domain mutation occurs during query execution.
 */
@Injectable()
export class GetRoleHandler implements QueryHandler<
  GetRoleQuery,
  RoleAggregate
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
   * Executes the GetRoleQuery.
   *
   * Returns the requested Role aggregate when it exists.
   */
  public async execute(query: GetRoleQuery): Promise<RoleAggregate> {
    // -------------------------------------------------------------------------
    // 1. Query guard
    // -------------------------------------------------------------------------

    if (query === undefined) {
      throw new RoleNotFoundException('Get role query is required.');
    }

    // -------------------------------------------------------------------------
    // 2. Role public ID guard
    // -------------------------------------------------------------------------

    if (query.rolePublicId === undefined) {
      throw new RoleNotFoundException('Role public ID is required.');
    }

    // -------------------------------------------------------------------------
    // 3. Load aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.roleRepository.findByPublicId(
      query.rolePublicId,
    );

    // -------------------------------------------------------------------------
    // 4. Ensure Role exists
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new RoleNotFoundException(
        `Role ${query.rolePublicId.value} was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // 5. Return aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetRoleHandler;
