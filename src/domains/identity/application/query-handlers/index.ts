// -----------------------------------------------------------------------------
// Identity Application — Query Handlers
// -----------------------------------------------------------------------------
//
// Central export surface for all Identity application query handlers.
//
// Handlers are grouped by their aggregate / responsibility boundary:
//
// - Identity
// - Verification
// - Role
// - Permission
// - Role Permission
//
// Consumers should import query handlers from this index rather than reaching
// into individual handler files.
//
// -----------------------------------------------------------------------------

// =============================================================================
// IDENTITY
// =============================================================================

export { GetIdentityHandler } from './get-identity.handler';

export { GetIdentityByEmailHandler } from './get-identity-by-email.handler';

export { GetIdentityByPhoneNumberHandler } from './get-identity-by-phone-number.handler';

export { GetIdentityRolesHandler } from './get-identity-roles.handler';

// =============================================================================
// VERIFICATION
// =============================================================================

export { GetVerificationHandler } from './get-verification.handler';

export { GetVerificationRequestsHandler } from './get-verification-requests.handler';

export { GetVerificationRequestHandler } from './get-verification-request.handler';

// =============================================================================
// ROLE
// =============================================================================

export { GetRoleHandler } from './get-role.handler';

export { GetRolesHandler } from './get-roles.handler';

// =============================================================================
// PERMISSION
// =============================================================================

export { GetPermissionHandler } from './get-permission.handler';

export { GetPermissionsHandler } from './get-permissions.handler';

// =============================================================================
// ROLE PERMISSION
// =============================================================================

export { GetRolePermissionHandler } from './get-role-permission.handler';

export { GetRolePermissionsHandler } from './get-role-permissions.handler';
