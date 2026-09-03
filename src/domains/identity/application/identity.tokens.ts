//domains/identity/application/identity.tokens.ts
// -----------------------------------------------------------------------------
// Identity Application Tokens
// -----------------------------------------------------------------------------
//
// Central dependency-injection tokens for the Identity application layer.
//
// Covers:
//
// - repositories;
// - command handlers;
// - query handlers.
//
// Aggregate / relationship boundaries:
//
// IdentityAggregate
// VerificationAggregate
// VerificationRequest (owned by VerificationAggregate)
// RoleAggregate
// PermissionAggregate
// RolePermissionAggregate
//
// IMPORTANT:
//
// Verification and VerificationRequest are distinct domain responsibilities.
//
// Verification commands operate on the Verification aggregate:
//
// - create verification;
// - grant MEMBER verification;
// - grant DRIVER verification;
// - reject verification;
// - reopen verification;
// - expire verification;
// - revoke verification.
//
// Verification Request commands operate on an individual child request:
//
// - create request;
// - approve request;
// - reject request;
// - cancel request.
//
// There is intentionally no generic `APPROVE_VERIFICATION` command because
// approving a VerificationRequest and granting Verification are different
// business operations.
//
// VerificationRequest expiration is intentionally not exposed as a separate
// application command.
//
// -----------------------------------------------------------------------------

export const IDENTITY_TOKENS = {
  // ===========================================================================
  // Repositories
  // ===========================================================================

  REPOSITORIES: {
    IDENTITY: Symbol('IdentityRepository'),

    VERIFICATION: Symbol('VerificationRepository'),

    ROLE: Symbol('RoleRepository'),

    PERMISSION: Symbol('PermissionRepository'),

    ROLE_PERMISSION: Symbol('RolePermissionRepository'),
  } as const,

  // ===========================================================================
  // Command Handlers
  // ===========================================================================

  COMMAND_HANDLERS: {
    // -------------------------------------------------------------------------
    // Identity
    // -------------------------------------------------------------------------

    CREATE_IDENTITY: Symbol('CreateIdentityHandler'),

    ACTIVATE_IDENTITY: Symbol('ActivateIdentityHandler'),

    SUSPEND_IDENTITY: Symbol('SuspendIdentityHandler'),

    CLOSE_IDENTITY: Symbol('CloseIdentityHandler'),

    CHANGE_IDENTITY_EMAIL: Symbol('ChangeIdentityEmailHandler'),

    CHANGE_IDENTITY_PHONE_NUMBER: Symbol('ChangeIdentityPhoneNumberHandler'),

    ASSIGN_IDENTITY_ROLE: Symbol('AssignIdentityRoleHandler'),

    REVOKE_IDENTITY_ROLE: Symbol('RevokeIdentityRoleHandler'),

    // -------------------------------------------------------------------------
    // Verification
    // -------------------------------------------------------------------------

    CREATE_VERIFICATION: Symbol('CreateVerificationHandler'),

    GRANT_MEMBER_VERIFICATION: Symbol('GrantMemberVerificationHandler'),

    GRANT_DRIVER_VERIFICATION: Symbol('GrantDriverVerificationHandler'),

    REJECT_VERIFICATION: Symbol('RejectVerificationHandler'),

    REOPEN_VERIFICATION: Symbol('ReopenVerificationHandler'),

    EXPIRE_VERIFICATION: Symbol('ExpireVerificationHandler'),

    REVOKE_VERIFICATION: Symbol('RevokeVerificationHandler'),

    // -------------------------------------------------------------------------
    // Verification Request
    // -------------------------------------------------------------------------

    CREATE_VERIFICATION_REQUEST: Symbol('CreateVerificationRequestHandler'),

    APPROVE_VERIFICATION_REQUEST: Symbol('ApproveVerificationRequestHandler'),

    REJECT_VERIFICATION_REQUEST: Symbol('RejectVerificationRequestHandler'),

    CANCEL_VERIFICATION_REQUEST: Symbol('CancelVerificationRequestHandler'),

    // -------------------------------------------------------------------------
    // Role
    // -------------------------------------------------------------------------

    CREATE_ROLE: Symbol('CreateRoleHandler'),

    ACTIVATE_ROLE: Symbol('ActivateRoleHandler'),

    DEACTIVATE_ROLE: Symbol('DeactivateRoleHandler'),

    // -------------------------------------------------------------------------
    // Permission
    // -------------------------------------------------------------------------

    CREATE_PERMISSION: Symbol('CreatePermissionHandler'),

    ACTIVATE_PERMISSION: Symbol('ActivatePermissionHandler'),

    DEACTIVATE_PERMISSION: Symbol('DeactivatePermissionHandler'),

    // -------------------------------------------------------------------------
    // Role Permission
    // -------------------------------------------------------------------------

    ASSIGN_ROLE_PERMISSION: Symbol('AssignRolePermissionHandler'),

    REVOKE_ROLE_PERMISSION: Symbol('RevokeRolePermissionHandler'),
  } as const,

  // ===========================================================================
  // Query Handlers
  // ===========================================================================

  QUERY_HANDLERS: {
    // -------------------------------------------------------------------------
    // Identity
    // -------------------------------------------------------------------------

    GET_IDENTITY: Symbol('GetIdentityHandler'),

    GET_IDENTITY_BY_EMAIL: Symbol('GetIdentityByEmailHandler'),

    GET_IDENTITY_BY_PHONE_NUMBER: Symbol('GetIdentityByPhoneNumberHandler'),

    GET_IDENTITY_ROLES: Symbol('GetIdentityRolesHandler'),

    // -------------------------------------------------------------------------
    // Verification
    // -------------------------------------------------------------------------

    GET_VERIFICATION: Symbol('GetVerificationHandler'),

    GET_VERIFICATION_REQUESTS: Symbol('GetVerificationRequestsHandler'),

    GET_VERIFICATION_REQUEST: Symbol('GetVerificationRequestHandler'),

    // -------------------------------------------------------------------------
    // Role
    // -------------------------------------------------------------------------

    GET_ROLE: Symbol('GetRoleHandler'),

    GET_ROLES: Symbol('GetRolesHandler'),

    // -------------------------------------------------------------------------
    // Permission
    // -------------------------------------------------------------------------

    GET_PERMISSION: Symbol('GetPermissionHandler'),

    GET_PERMISSIONS: Symbol('GetPermissionsHandler'),

    // -------------------------------------------------------------------------
    // Role Permission
    // -------------------------------------------------------------------------

    GET_ROLE_PERMISSION: Symbol('GetRolePermissionHandler'),

    GET_ROLE_PERMISSIONS: Symbol('GetRolePermissionsHandler'),
  } as const,
} as const;

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default IDENTITY_TOKENS;
