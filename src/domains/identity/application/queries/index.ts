// -----------------------------------------------------------------------------
// Identity — Application Queries
// -----------------------------------------------------------------------------
//
// Barrel export for Identity application queries.
//
// Query groups:
//
// - Identity
// - Verification
// - Role
// - Permission
// - RolePermission
//
// This file intentionally exports query definitions only.
// Query handlers belong to their respective handler modules.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Identity
// =============================================================================

export * from './get-identity.query';
export * from './get-identity-by-email.query';
export * from './get-identity-by-phone-number.query';
export * from './get-identity-roles.query';

// =============================================================================
// Verification
// =============================================================================

export * from './get-verification.query';
export * from './get-verification-requests.query';
export * from './get-verification-request.query';

// =============================================================================
// Role
// =============================================================================

export * from './get-role.query';
export * from './get-roles.query';

// =============================================================================
// Permission
// =============================================================================

export * from './get-permission.query';
export * from './get-permissions.query';

// =============================================================================
// Role Permission
// =============================================================================

export * from './get-role-permission.query';
export * from './get-role-permissions.query';
