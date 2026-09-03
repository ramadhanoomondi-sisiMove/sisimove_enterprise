// -----------------------------------------------------------------------------
// Identity — Get Permissions Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving all Permission aggregates.
//
// Aggregate:
//
// PermissionAggregate
// └── PermissionEntity
//
// The current PermissionRepository intentionally exposes semantic collection
// queries rather than a generic findAll() method:
//
// - findActive()
// - findInactive()
//
// Because GetPermissionsQuery carries no filters, the handler composes those
// two repository queries into the complete Permission collection.
//
// Responsibilities:
//
// - retrieve all Permission aggregates;
// - combine active and inactive Permissions;
// - return the complete collection.
//
// The handler does NOT:
//
// - mutate PermissionEntity;
// - activate or deactivate Permissions;
// - assign Permissions to Roles;
// - revoke RolePermission relationships;
// - evaluate authorization;
// - create domain events;
// - persist aggregates;
// - access Prisma directly;
// - expose persistence models;
// - perform external side effects.
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

import type { GetPermissionsQuery } from '../queries/get-permissions.query';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { PermissionAggregate } from '../../domain/aggregates/permission.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { PermissionRepository } from '../../domain/repositories/permission.repository';

// =============================================================================
// Handler
// =============================================================================

/**
 * Handles retrieval of the complete Permission collection.
 *
 * Since the current repository contract does not expose a generic findAll()
 * method, active and inactive Permissions are loaded separately and composed
 * into one application-level result.
 */
@Injectable()
export class GetPermissionsHandler implements QueryHandler<
  GetPermissionsQuery,
  PermissionAggregate[]
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
   * Executes the GetPermissionsQuery.
   *
   * Returns all active and inactive Permission aggregates.
   */
  public async execute(
    query: GetPermissionsQuery,
  ): Promise<PermissionAggregate[]> {
    // -------------------------------------------------------------------------
    // 1. Query guard
    // -------------------------------------------------------------------------

    if (query === undefined) {
      throw new Error('Get permissions query is required.');
    }

    // -------------------------------------------------------------------------
    // 2. Load complete Permission collection
    // -------------------------------------------------------------------------
    //
    // The repository models lifecycle-specific queries:
    //
    //     ACTIVE
    //     INACTIVE
    //
    // Since these states are mutually exclusive, combining both collections
    // produces the complete Permission set.
    // -------------------------------------------------------------------------

    const [activePermissions, inactivePermissions] = await Promise.all([
      this.permissionRepository.findActive(),
      this.permissionRepository.findInactive(),
    ]);

    // -------------------------------------------------------------------------
    // 3. Compose collection
    // -------------------------------------------------------------------------
    //
    // Defensive de-duplication protects the application result if a repository
    // implementation unexpectedly returns overlapping results.
    //
    // Permission public identity is the aggregate-facing identity.
    // -------------------------------------------------------------------------

    const permissions = new Map<string, PermissionAggregate>();

    for (const permission of activePermissions) {
      permissions.set(permission.publicId.value, permission);
    }

    for (const permission of inactivePermissions) {
      permissions.set(permission.publicId.value, permission);
    }

    // -------------------------------------------------------------------------
    // 4. Return collection
    // -------------------------------------------------------------------------

    return [...permissions.values()];
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetPermissionsHandler;
