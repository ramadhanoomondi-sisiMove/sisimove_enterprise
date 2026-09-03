// -----------------------------------------------------------------------------
// Identity — Get Role Permissions Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving RolePermission aggregates.
//
// Query:
// GetRolePermissionsQuery
//
// Purpose:
//
// - Retrieve all RolePermission assignments;
// - Provide a read-only application boundary for RolePermission collection
//   retrieval;
// - Delegate persistence lookup to RolePermissionRepository;
// - Keep infrastructure concerns outside the application layer.
//
// This query does NOT:
//
// - Mutate RolePermission aggregates.
// - Create RolePermission assignments.
// - Revoke RolePermission assignments.
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
// Query semantics:
//
// No filter:
//
//     Retrieve all RolePermission assignments.
//
// Specialized Role- or Permission-scoped retrieval should use explicitly
// named queries such as:
//
//     GetRolePermissionsByRole.query.ts
//     GetRolePermissionsByPermission.query.ts
//
// This keeps GetRolePermissionsQuery semantically precise and aligned with
// strict CQRS query naming.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation — Query
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';

// =============================================================================
// Query
// =============================================================================

export class GetRolePermissionsQuery implements Query {}
