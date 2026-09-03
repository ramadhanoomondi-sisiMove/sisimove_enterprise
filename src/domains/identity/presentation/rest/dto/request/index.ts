// -----------------------------------------------------------------------------
// Identity — Request DTO Exports
// -----------------------------------------------------------------------------
//
// Barrel exports for REST request DTOs across the Identity application
// boundaries.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Identity
// -----------------------------------------------------------------------------

export * from './create-identity.request.dto';
export * from './activate-identity.request.dto';
export * from './suspend-identity.request.dto';
export * from './close-identity.request.dto';
export * from './change-identity-email.request.dto';
export * from './change-identity-phone-number.request.dto';
export * from './assign-identity-role.request.dto';
export * from './revoke-identity-role.request.dto';

// -----------------------------------------------------------------------------
// Verification
// -----------------------------------------------------------------------------

export * from './create-verification.request.dto';
export * from './grant-member-verification.request.dto';
export * from './grant-driver-verification.request.dto';
export * from './reject-verification.request.dto';
export * from './reopen-verification.request.dto';
export * from './expire-verification.request.dto';
export * from './revoke-verification.request.dto';

// -----------------------------------------------------------------------------
// Verification Request
// -----------------------------------------------------------------------------

export * from './create-verification-request.request.dto';
export * from './approve-verification-request.request.dto';
export * from './reject-verification-request.request.dto';
export * from './cancel-verification-request.request.dto';

// -----------------------------------------------------------------------------
// Role
// -----------------------------------------------------------------------------

export * from './create-role.request.dto';
export * from './activate-role.request.dto';
export * from './deactivate-role.request.dto';

// -----------------------------------------------------------------------------
// Permission
// -----------------------------------------------------------------------------

export * from './create-permission.request.dto';
export * from './activate-permission.request.dto';
export * from './deactivate-permission.request.dto';

// -----------------------------------------------------------------------------
// Role Permission
// -----------------------------------------------------------------------------

export * from './assign-role-permission.request.dto';
export * from './revoke-role-permission.request.dto';
