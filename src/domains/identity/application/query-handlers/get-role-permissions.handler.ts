// -----------------------------------------------------------------------------
// Identity — Get Role Permissions Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving all RolePermission aggregates.
//
// Aggregate:
//
// RolePermissionAggregate
// └── RolePermissionEntity
//
// Each RolePermission aggregate represents one logical authorization
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
//
// - execute GetRolePermissionsQuery;
// - retrieve all RolePermission aggregates through RolePermissionRepository;
// - return the complete collection.
//
// The handler does NOT:
//
// - mutate RolePermissionAggregate;
// - assign Permissions to Roles;
// - revoke RolePermission relationships;
// - create or modify Roles;
// - create or modify Permissions;
// - evaluate authorization;
// - determine Role or Permission eligibility;
// - create domain events;
// - persist aggregates;
// - access Prisma directly;
// - expose ORM/persistence models;
// - perform external side effects.
//
// -----------------------------------------------------------------------------
//
// Query semantics:
//
// GetRolePermissionsQuery intentionally has NO filters.
//
// Therefore:
//
//     GetRolePermissionsQuery
//              │
//              ▼
// rolePermissionRepository.findAll()
//              │
//              ▼
// RolePermissionAggregate[]
//
// Role-scoped and Permission-scoped retrieval should be expressed through
// explicitly named specialized queries rather than adding filtering semantics
// to this query.
//
// Examples:
//
// - GetRolePermissionsByRoleQuery
// - GetRolePermissionsByPermissionQuery
//
// -----------------------------------------------------------------------------
//
// CQRS boundary:
//
// The query handler performs read orchestration only.
//
// Repository access belongs to the application boundary through the repository
// abstraction.
//
// Aggregate rehydration remains the responsibility of the repository.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Application Tokens
// -----------------------------------------------------------------------------

import { IDENTITY_TOKENS } from '../identity.tokens';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetRolePermissionsQuery } from '../queries/get-role-permissions.query';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { RolePermissionAggregate } from '../../domain/aggregates/role-permission.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { RolePermissionRepository } from '../../domain/repositories/role-permission.repository';

// =============================================================================
// Handler
// =============================================================================

/**
 * Handles retrieval of all RolePermission aggregates.
 *
 * The repository is responsible for loading and rehydrating the complete
 * RolePermission aggregate collection.
 *
 * No domain mutation occurs during query execution.
 */
@Injectable()
export class GetRolePermissionsHandler implements QueryHandler<
  GetRolePermissionsQuery,
  RolePermissionAggregate[]
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
   * Executes the GetRolePermissionsQuery.
   *
   * Returns every RolePermission aggregate known to the repository.
   *
   * No filtering is applied because filtering belongs to explicitly named
   * specialized queries.
   */
  public async execute(
    query: GetRolePermissionsQuery,
  ): Promise<RolePermissionAggregate[]> {
    // -------------------------------------------------------------------------
    // Query guard
    // -------------------------------------------------------------------------

    if (query === undefined) {
      throw new Error('Get role permissions query is required.');
    }

    // -------------------------------------------------------------------------
    // Load all RolePermission aggregates
    // -------------------------------------------------------------------------

    return this.rolePermissionRepository.findAll();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetRolePermissionsHandler;
