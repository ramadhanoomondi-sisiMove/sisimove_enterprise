// -----------------------------------------------------------------------------
// Identity — Get Role Permission Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving a single RolePermission aggregate.
//
// Query:
// GetRolePermissionQuery
//
// Purpose:
//
// - Retrieve one RolePermission assignment by its public identifier;
// - Provide a read-only application boundary for assignment retrieval;
// - Delegate persistence lookup to RolePermissionRepository;
// - Keep infrastructure concerns outside the application layer.
//
// This query does NOT:
//
// - Mutate the RolePermission aggregate.
// - Create or revoke assignments.
// - Create or modify Roles.
// - Create or modify Permissions.
// - Evaluate authorization.
// - Determine Role or Permission eligibility.
// - Access Prisma.
// - Access ORM models.
// - Communicate with external systems.
//
// -----------------------------------------------------------------------------
//
// Lookup:
//
// RolePermissionPublicId
//
// The public identifier identifies the RolePermission assignment itself.
// Role and Permission public identifiers are separate cross-aggregate
// references owned by the RolePermission aggregate.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation — Query
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

import type { RolePermissionPublicId } from '../../domain/value-objects/role-permission-public-id.vo';

// =============================================================================
// Query
// =============================================================================

export class GetRolePermissionQuery implements Query {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(public readonly rolePermissionPublicId: RolePermissionPublicId) {}
}
