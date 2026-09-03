// -----------------------------------------------------------------------------
// Identity — Application Response Mappers
// -----------------------------------------------------------------------------
//
// Central export barrel for Identity application-layer response mappers.
//
// Response mappers:
// - IdentityResponseMapper
// - VerificationResponseMapper
// - RoleResponseMapper
// - PermissionResponseMapper
// - RolePermissionResponseMapper
//
// Responsibilities:
//
// - Provide a single import boundary for Identity response mappers.
// - Keep application consumers independent of mapper file locations.
// - Expose only application-facing response mapping contracts.
//
// This index does NOT:
//
// - Contain mapping logic.
// - Access domain entities directly.
// - Access Prisma.
// - Perform persistence operations.
// - Perform authorization decisions.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Identity
// -----------------------------------------------------------------------------

export { IdentityResponseMapper } from './identity.response.mapper';

export type { IdentityResponse } from './identity.response.mapper';

// -----------------------------------------------------------------------------
// Verification
// -----------------------------------------------------------------------------

export { VerificationResponseMapper } from './verification.response.mapper';

export type { VerificationResponse } from './verification.response.mapper';

// -----------------------------------------------------------------------------
// Role
// -----------------------------------------------------------------------------

export { RoleResponseMapper } from './role.response.mapper';

export type { RoleResponse } from './role.response.mapper';

// -----------------------------------------------------------------------------
// Permission
// -----------------------------------------------------------------------------

export { PermissionResponseMapper } from './permission.response.mapper';

export type { PermissionResponse } from './permission.response.mapper';

// -----------------------------------------------------------------------------
// Role Permission
// -----------------------------------------------------------------------------

export { RolePermissionResponseMapper } from './role-permission.response.mapper';

export type { RolePermissionResponse } from './role-permission.response.mapper';
