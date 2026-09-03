// -----------------------------------------------------------------------------
// Identity — Get Permission Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving a single Permission aggregate.
//
// Aggregate:
//
// PermissionAggregate
// └── PermissionEntity
//
// Responsibilities:
//
// - resolve the Permission aggregate by public identifier;
// - ensure the Permission exists;
// - return the complete PermissionAggregate.
//
// The handler does NOT:
//
// - mutate PermissionEntity;
// - activate or deactivate Permission;
// - assign Permission to a Role;
// - revoke RolePermission relationships;
// - evaluate authorization;
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
//     GetPermissionQuery
//              │
//              ▼
// permissionRepository.findByPublicId()
//              │
//              ├── not found → throw
//              │
//              ▼
//      PermissionAggregate
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

import type { GetPermissionQuery } from '../queries/get-permission.query';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { PermissionAggregate } from '../../domain/aggregates/permission.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { PermissionRepository } from '../../domain/repositories/permission.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { PermissionNotFoundException } from '../../domain/exceptions/permission-not-found.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Handles retrieval of a single Permission aggregate.
 *
 * The repository is responsible for rehydrating the complete aggregate.
 *
 * No domain mutation occurs during query execution.
 */
@Injectable()
export class GetPermissionHandler implements QueryHandler<
  GetPermissionQuery,
  PermissionAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(IDENTITY_TOKENS.REPOSITORIES.PERMISSION)
    private readonly permissionRepository: PermissionRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes the GetPermissionQuery.
   *
   * Returns the requested Permission aggregate when it exists.
   */
  public async execute(
    query: GetPermissionQuery,
  ): Promise<PermissionAggregate> {
    // -------------------------------------------------------------------------
    // 1. Query guard
    // -------------------------------------------------------------------------

    if (query === undefined) {
      throw new PermissionNotFoundException(
        'Get permission query is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 2. Permission public ID guard
    // -------------------------------------------------------------------------

    if (query.permissionPublicId === undefined) {
      throw new PermissionNotFoundException(
        'Permission public ID is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 3. Load aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.permissionRepository.findByPublicId(
      query.permissionPublicId,
    );

    // -------------------------------------------------------------------------
    // 4. Ensure Permission exists
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new PermissionNotFoundException(
        `Permission ${query.permissionPublicId.value} was not found.`,
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

export default GetPermissionHandler;
