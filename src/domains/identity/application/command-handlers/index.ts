// -----------------------------------------------------------------------------
// Identity — Application Command Handlers
// -----------------------------------------------------------------------------
//
// Barrel export for all Identity domain application command handlers.
//
// Handlers are grouped by their aggregate / relationship boundary:
//
// - Identity
// - Verification
// - Verification Request
// - Role
// - Permission
// - Role Permission
//
// Each handler is responsible for application-level orchestration:
// - loading the appropriate aggregate;
// - invoking aggregate behavior;
// - persisting the changed aggregate.
//
// Domain business rules remain inside the respective aggregates/entities.
//
// -----------------------------------------------------------------------------

// =============================================================================
// IDENTITY HANDLERS
// =============================================================================

export { default as CreateIdentityHandler } from './create-identity.handler';

export { default as ActivateIdentityHandler } from './activate-identity.handler';

export { default as SuspendIdentityHandler } from './suspend-identity.handler';

export { default as CloseIdentityHandler } from './close-identity.handler';

export { default as ChangeIdentityEmailHandler } from './change-identity-email.handler';

export { default as ChangeIdentityPhoneNumberHandler } from './change-identity-phone-number.handler';

export { default as AssignIdentityRoleHandler } from './assign-identity-role.handler';

export { default as RevokeIdentityRoleHandler } from './revoke-identity-role.handler';

// =============================================================================
// VERIFICATION HANDLERS
// =============================================================================

export { default as CreateVerificationHandler } from './create-verification.handler';

export { default as GrantMemberVerificationHandler } from './grant-member-verification.handler';

export { default as GrantDriverVerificationHandler } from './grant-driver-verification.handler';

export { default as RejectVerificationHandler } from './reject-verification.handler';

export { default as ReopenVerificationHandler } from './reopen-verification.handler';

export { default as ExpireVerificationHandler } from './expire-verification.handler';

export { default as RevokeVerificationHandler } from './revoke-verification.handler';

export { default as SubmitVerificationRequestHandler } from './submit-verification-request.handler';

// =============================================================================
// VERIFICATION REQUEST HANDLERS
// =============================================================================

export { default as CreateVerificationRequestHandler } from './create-verification-request.handler';

export { default as ApproveVerificationRequestHandler } from './approve-verification-request.handler';

export { default as RejectVerificationRequestHandler } from './reject-verification-request.handler';

export { default as CancelVerificationRequestHandler } from './cancel-verification-request.handler';

// =============================================================================
// ROLE HANDLERS
// =============================================================================

export { default as CreateRoleHandler } from './create-role.handler';

export { default as ActivateRoleHandler } from './activate-role.handler';

export { default as DeactivateRoleHandler } from './deactivate-role.handler';

// =============================================================================
// PERMISSION HANDLERS
// =============================================================================

export { default as CreatePermissionHandler } from './create-permission.handler';

export { default as ActivatePermissionHandler } from './activate-permission.handler';

export { default as DeactivatePermissionHandler } from './deactivate-permission.handler';

// =============================================================================
// ROLE PERMISSION HANDLERS
// =============================================================================

export { default as AssignRolePermissionHandler } from './assign-role-permission.handler';

export { default as RevokeRolePermissionHandler } from './revoke-role-permission.handler';
