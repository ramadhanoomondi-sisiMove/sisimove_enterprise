// -----------------------------------------------------------------------------
// Identity — Application Commands
// -----------------------------------------------------------------------------
//
// Central barrel export for all Identity domain application commands.
//
// Commands are grouped by aggregate / relationship boundary:
//
// - Identity
// - Verification
// - VerificationRequest
// - Role
// - Permission
// - RolePermission
//
// Each command represents an application-level intent.
// Domain mutation remains inside the corresponding aggregate/entity boundary.
//
// -----------------------------------------------------------------------------

// =============================================================================
// IDENTITY COMMANDS
// =============================================================================

export { CreateIdentityCommand } from './create-identity.command';

export { ActivateIdentityCommand } from './activate-identity.command';

export { SuspendIdentityCommand } from './suspend-identity.command';

export { CloseIdentityCommand } from './close-identity.command';

export { ChangeIdentityEmailCommand } from './change-identity-email.command';

export { ChangeIdentityPhoneNumberCommand } from './change-identity-phone-number.command';

export { AssignIdentityRoleCommand } from './assign-identity-role.command';

export { RevokeIdentityRoleCommand } from './revoke-identity-role.command';

// =============================================================================
// VERIFICATION COMMANDS
// =============================================================================

export { CreateVerificationCommand } from './create-verification.command';

export { GrantMemberVerificationCommand } from './grant-member-verification.command';

export { GrantDriverVerificationCommand } from './grant-driver-verification.command';

export { RejectVerificationCommand } from './reject-verification.command';

export { ReopenVerificationCommand } from './reopen-verification.command';

export { ExpireVerificationCommand } from './expire-verification.command';

export { RevokeVerificationCommand } from './revoke-verification.command';

// =============================================================================
// VERIFICATION REQUEST COMMANDS
// =============================================================================

export { CreateVerificationRequestCommand } from './create-verification-request.command';

export { ApproveVerificationRequestCommand } from './approve-verification-request.command';

export { RejectVerificationRequestCommand } from './reject-verification-request.command';

export { CancelVerificationRequestCommand } from './cancel-verification-request.command';

// =============================================================================
// ROLE COMMANDS
// =============================================================================

export { CreateRoleCommand } from './create-role.command';

export { ActivateRoleCommand } from './activate-role.command';

export { DeactivateRoleCommand } from './deactivate-role.command';

// =============================================================================
// PERMISSION COMMANDS
// =============================================================================

export { CreatePermissionCommand } from './create-permission.command';

export { ActivatePermissionCommand } from './activate-permission.command';

export { DeactivatePermissionCommand } from './deactivate-permission.command';

// =============================================================================
// ROLE PERMISSION COMMANDS
// =============================================================================

export { AssignRolePermissionCommand } from './assign-role-permission.command';

export { RevokeRolePermissionCommand } from './revoke-role-permission.command';
