// -----------------------------------------------------------------------------
// Identity — Get Permission Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving a single Permission aggregate.
//
// Query:
// GetPermissionQuery
//
// Purpose:
//
// - Retrieve one Permission by its public identifier;
// - Provide a read-only application boundary for Permission retrieval;
// - Delegate persistence lookup to PermissionRepository;
// - Keep infrastructure concerns outside the application layer.
//
// This query does NOT:
//
// - Mutate the Permission aggregate.
// - Evaluate authorization.
// - Assign Permissions to Roles.
// - Remove Permissions from Roles.
// - Manage RolePermission.
// - Access Prisma.
// - Access ORM models.
// - Communicate with external systems.
//
// -----------------------------------------------------------------------------
//
// Lookup:
//
// PermissionPublicId
//
// The public identifier is the external/application-facing identity of the
// Permission. Internal UniqueEntityId values remain infrastructure/domain
// persistence concerns.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation — Query
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

import type { PermissionPublicId } from '../../domain/value-objects/permission-public-id.vo';

// =============================================================================
// Query
// =============================================================================

export class GetPermissionQuery implements Query {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(public readonly permissionPublicId: PermissionPublicId) {}
}
