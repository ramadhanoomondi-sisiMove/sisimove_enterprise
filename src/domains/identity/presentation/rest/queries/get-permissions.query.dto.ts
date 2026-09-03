// -----------------------------------------------------------------------------
// Identity — Get Permissions Query DTO
// -----------------------------------------------------------------------------
//
// Transport/query DTO for retrieving all Permission aggregates.
//
// The DTO maps transport input into:
//
//     GetPermissionsQuery
//
// Query responsibility:
//
// - request the complete Permission collection;
// - remain transport-focused;
// - contain no filtering semantics;
// - contain no business logic;
// - contain no persistence concerns;
// - contain no authorization logic;
// - contain no aggregate mutation logic.
//
// Specialized read intent should be expressed through dedicated queries such
// as:
//
// - GetActivePermissionsQuery
// - GetSystemPermissionsQuery
// - GetAssignablePermissionsQuery
//
// This DTO therefore intentionally contains no request properties.
//
// The query handler is responsible for:
//
// - retrieving the Permission aggregates through PermissionRepository;
// - translating them into the application response/read model.
//
// This DTO does NOT:
//
// - filter Permissions;
// - mutate Permission aggregates;
// - assign Permissions to Roles;
// - remove Permissions from Roles;
// - evaluate authorization;
// - manage RolePermission;
// - access Prisma or ORM models;
// - communicate with external systems.
//
// -----------------------------------------------------------------------------

// =============================================================================
// DTO
// =============================================================================

/**
 * Transport DTO for retrieving all Permission aggregates.
 *
 * This query has no transport parameters because GetPermissionsQuery
 * intentionally carries no filtering semantics.
 */
export class GetPermissionsQueryDto {}
