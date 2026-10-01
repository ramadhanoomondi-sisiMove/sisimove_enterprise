// -----------------------------------------------------------------------------
// Identity Application Tokens
// -----------------------------------------------------------------------------
//
// Central dependency-injection tokens for the Identity application layer.
//
// Covers:
//
// - repositories;
// - application services;
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
  // Application Services
  // ===========================================================================

  APPLICATION_SERVICES: {
    /**
     * Resolves the current authorization state of an Identity.
     *
     * Composition:
     *
     *     Identity
     *         ↓
     *     active identity roles
     *         ↓
     *     role permissions
     *         ↓
     *     active permissions
     *         ↓
     *     authorization snapshot
     *
     * The resulting snapshot is used when issuing access JWTs.
     *
     * The service is intentionally separate from:
     *
     * - IdentityRepository;
     * - RolePermissionRepository;
     * - PermissionRepository;
     * - authentication;
     * - session management.
     *
     * Those remain separate bounded responsibilities.
     */
    AUTHORIZATION_SNAPSHOT: Symbol('AuthorizationSnapshotService'),
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

    /**
     * User-facing verification evidence submission orchestrator.
     *
     * Coordinates:
     *
     * - Asset upload;
     * - Asset creation;
     * - Verification creation when required;
     * - VerificationRequest creation.
     *
     * This is the entry point for the complete verification evidence
     * submission workflow.
     */
    SUBMIT_VERIFICATION_REQUEST: Symbol('SubmitVerificationRequestHandler'),

    /**
     * Creates a VerificationRequest inside an existing Verification aggregate.
     *
     * This is the lower-level request creation operation.
     *
     * It receives an already-created Asset public ID and does not perform
     * physical asset storage operations.
     */
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

    /**
     * Retrieves the Verification aggregate belonging to an Identity.
     *
     * Application boundary:
     *
     *     IdentityPublicId
     *         → findByIdentityPublicId()
     *
     * Used by the authenticated self-service `/me` boundary.
     */
    GET_VERIFICATION: Symbol('GetVerificationHandler'),

    /**
     * Retrieves the Verification aggregate by its own public identifier.
     *
     * Application boundary:
     *
     *     VerificationPublicId
     *         → findByPublicId()
     *
     * This is intentionally separate from GET_VERIFICATION because the two
     * queries address the aggregate through different public-ID boundaries.
     */
    GET_VERIFICATION_BY_PUBLIC_ID: Symbol('GetVerificationByPublicIdHandler'),

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
