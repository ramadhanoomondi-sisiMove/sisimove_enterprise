// -----------------------------------------------------------------------------
// Identity — Get Role Permission Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving a single RolePermission aggregate.
//
// Aggregate:
//
// RolePermissionAggregate
// └── RolePermissionEntity
//
// The RolePermission aggregate represents one authorization relationship:
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
// - validate the query;
// - resolve one RolePermission aggregate by public identifier;
// - ensure the requested relationship exists;
// - return the complete aggregate.
//
// The handler does NOT:
//
// - mutate RolePermissionEntity;
// - assign a Permission to a Role;
// - revoke the relationship;
// - modify Role;
// - modify Permission;
// - evaluate authorization;
// - create domain events;
// - persist the aggregate;
// - access Prisma directly;
// - expose persistence/ORM models;
// - perform external side effects.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     GetRolePermissionQuery
//              │
//              ▼
//       validate query
//              │
//              ▼
// rolePermissionRepository.findByPublicId()
//              │
//              ├── null → RolePermissionNotFoundException
//              │
//              ▼
//      RolePermissionAggregate
//              │
//              ▼
//             return
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

import type { GetRolePermissionQuery } from '../queries/get-role-permission.query';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { RolePermissionAggregate } from '../../domain/aggregates/role-permission.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { RolePermissionRepository } from '../../domain/repositories/role-permission.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { RolePermissionNotFoundException } from '../../domain/exceptions/role-permission-not-found.exception';

import { RolePermissionException } from '../../domain/exceptions/role-permission.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Handles retrieval of a single RolePermission aggregate by public identity.
 *
 * The repository is responsible for retrieving and rehydrating the complete
 * RolePermission aggregate.
 *
 * The handler performs query orchestration only and does not mutate domain
 * state.
 */
@Injectable()
export class GetRolePermissionHandler implements QueryHandler<
  GetRolePermissionQuery,
  RolePermissionAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(IDENTITY_TOKENS.REPOSITORIES.ROLE_PERMISSION)
    private readonly rolePermissionRepository: RolePermissionRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes the GetRolePermissionQuery.
   *
   * Returns the requested RolePermission aggregate when it exists.
   */
  public async execute(
    query: GetRolePermissionQuery,
  ): Promise<RolePermissionAggregate> {
    // -------------------------------------------------------------------------
    // 1. Query guard
    // -------------------------------------------------------------------------

    if (query === undefined) {
      throw new RolePermissionException(
        'Get role permission query is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 2. Public identifier guard
    // -------------------------------------------------------------------------

    if (query.rolePermissionPublicId === undefined) {
      throw new RolePermissionException(
        'Role permission public ID is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 3. Load aggregate
    // -------------------------------------------------------------------------
    //
    // RolePermissionRepository is responsible for rehydrating:
    //
    // RolePermissionAggregate
    // └── RolePermissionEntity
    //
    // No persistence model crosses into the application layer.
    // -------------------------------------------------------------------------

    const aggregate = await this.rolePermissionRepository.findByPublicId(
      query.rolePermissionPublicId,
    );

    // -------------------------------------------------------------------------
    // 4. Ensure aggregate exists
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new RolePermissionNotFoundException(
        `Role permission ${query.rolePermissionPublicId.value} was not found.`,
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

export default GetRolePermissionHandler;
