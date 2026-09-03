// -----------------------------------------------------------------------------
// Identity — Get Role Permissions Query DTO
// -----------------------------------------------------------------------------
//
// Transport/query DTO for retrieving all RolePermission assignments.
//
// The DTO maps transport input into:
//
//     GetRolePermissionsQuery
//
// Query:
//
// GetRolePermissionsQuery
//
// Purpose:
//
// - Retrieve all RolePermission assignments;
// - Provide a read-only transport boundary for RolePermission collection
//   retrieval;
// - Delegate query execution to the application/query layer;
// - Keep domain and persistence concerns outside the transport layer.
//
// This DTO does NOT:
//
// - mutate RolePermission aggregates;
// - create RolePermission assignments;
// - revoke RolePermission assignments;
// - create or modify Roles;
// - create or modify Permissions;
// - evaluate authorization;
// - determine Role or Permission eligibility;
// - access Prisma;
// - access ORM models;
// - communicate with external systems.
//
// -----------------------------------------------------------------------------
//
// Query semantics:
//
// No transport properties are required.
//
// GetRolePermissionsQuery intentionally has no filtering semantics.
//
// Specialized Role- or Permission-scoped retrieval should use explicitly
// named queries such as:
//
//     GetRolePermissionsByRoleQuery
//     GetRolePermissionsByPermissionQuery
//
// This keeps GetRolePermissionsQuery semantically precise and aligned with
// strict CQRS query naming.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * Transport DTO for retrieving all RolePermission assignments.
 *
 * This query intentionally carries no input properties because the underlying
 * GetRolePermissionsQuery represents an unfiltered collection retrieval.
 */
export class GetRolePermissionsQueryDto {}
