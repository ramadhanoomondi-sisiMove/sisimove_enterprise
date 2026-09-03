// -----------------------------------------------------------------------------
// Authentication — Application DI Tokens
// -----------------------------------------------------------------------------
//
// Central dependency-injection tokens for the Authentication application
// layer.
//
// Covers:
//
// - repositories;
// - application services;
// - command handlers;
// - query handlers.
//
// Aggregate boundaries:
//
// AuthenticationAggregate
// └── AuthenticationEntity
//
// SessionAggregate
// └── SessionEntity
//
// DeviceAggregate
// └── DeviceEntity
//
// RecoveryAggregate
// └── RecoveryEntity
//
// OtpChallengeAggregate
// └── OtpChallengeEntity
//
// IMPORTANT:
//
// Authentication is responsible for authentication credentials and their
// lifecycle.
//
// Session is responsible for authenticated sessions and session-token
// lifecycle.
//
// Device is responsible for recognized/trusted devices.
//
// Recovery is responsible for account recovery workflows.
//
// OtpChallenge is responsible for OTP challenge lifecycle.
//
// Application handlers coordinate use cases and delegate business rules
// to the appropriate aggregate/domain objects.
//
// Application-level security abstractions are represented by DI tokens here.
//
// Concrete infrastructure implementations are bound to these tokens by the
// infrastructure dependency-injection layer.
//
// The application layer MUST NOT import concrete infrastructure security
// implementations directly.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Authentication Tokens
// =============================================================================

export const AUTH_TOKENS = {
  // ===========================================================================
  // Repositories
  // ===========================================================================

  REPOSITORIES: {
    /**
     * Authentication aggregate repository.
     */
    AUTHENTICATION: Symbol('AuthenticationRepository'),

    /**
     * Session aggregate repository.
     */
    SESSION: Symbol('SessionRepository'),

    /**
     * Device aggregate repository.
     */
    DEVICE: Symbol('DeviceRepository'),

    /**
     * Recovery aggregate repository.
     */
    RECOVERY: Symbol('RecoveryRepository'),

    /**
     * OTP Challenge aggregate repository.
     */
    OTP_CHALLENGE: Symbol('OtpChallengeRepository'),
  } as const,

  // ===========================================================================
  // Application Services
  // ===========================================================================

  APPLICATION_SERVICES: {
    /**
     * Password hashing abstraction.
     *
     * Used when provisioning or changing authentication credentials.
     *
     * Concrete infrastructure implementation is supplied through DI.
     */
    PASSWORD_HASHER: Symbol('PasswordHasher'),

    /**
     * Cryptographically secure opaque token generator.
     *
     * Used for credentials such as raw refresh tokens.
     *
     * Raw tokens must never be persisted directly.
     */
    TOKEN_GENERATOR: Symbol('TokenGenerator'),

    /**
     * Refresh-token hashing abstraction.
     *
     * The raw refresh token is returned to the client but its hash is what
     * enters the Session aggregate/persistence boundary.
     */
    REFRESH_TOKEN_HASHER: Symbol('RefreshTokenHasher'),

    /**
     * Access JWT service abstraction.
     *
     * Responsible for access-token signing, verification, and decoding.
     *
     * This service does NOT own refresh-token persistence.
     */
    JWT_TOKEN_SERVICE: Symbol('JwtTokenService'),

    /**
     * Recovery-token service abstraction.
     */
    RECOVERY_TOKEN: Symbol('RecoveryTokenService'),

    /**
     * OTP service abstraction.
     */
    OTP: Symbol('OtpService'),
  } as const,

  // ===========================================================================
  // Command Handlers
  // ===========================================================================

  COMMAND_HANDLERS: {
    // =========================================================================
    // Authentication
    // =========================================================================

    /**
     * Creates an Authentication aggregate.
     */
    CREATE_AUTHENTICATION: Symbol('CreateAuthenticationHandler'),

    /**
     * Activates an Authentication aggregate.
     */
    ACTIVATE_AUTHENTICATION: Symbol('ActivateAuthenticationHandler'),

    /**
     * Locks an Authentication aggregate.
     */
    LOCK_AUTHENTICATION: Symbol('LockAuthenticationHandler'),

    /**
     * Unlocks an Authentication aggregate.
     */
    UNLOCK_AUTHENTICATION: Symbol('UnlockAuthenticationHandler'),

    /**
     * Disables an Authentication aggregate.
     */
    DISABLE_AUTHENTICATION: Symbol('DisableAuthenticationHandler'),

    /**
     * -----------------------------------------------------------------------
     * Credential Authentication
     * -----------------------------------------------------------------------
     *
     * Low-level authentication use case.
     *
     * Responsibilities:
     *
     * - resolve Identity;
     * - resolve Authentication;
     * - verify supplied credentials;
     * - return the credential-authentication result.
     *
     * This handler does NOT:
     *
     * - create Device;
     * - create Session;
     * - generate access tokens;
     * - generate refresh tokens.
     *
     * It is an application capability used by the complete login workflow.
     */
    AUTHENTICATE: Symbol('AuthenticateHandler'),

    /**
     * -----------------------------------------------------------------------
     * Complete Login
     * -----------------------------------------------------------------------
     *
     * Higher-level authentication workflow.
     *
     * Responsibilities:
     *
     *     credentials
     *          │
     *          ▼
     *     AuthenticateHandler
     *          │
     *          ▼
     *     authenticated identity
     *          │
     *          ├──────────────► Device
     *          │
     *          └──────────────► Session
     *                              │
     *                              ├── access token
     *                              └── refresh token
     *
     * This is the handler consumed by the public login endpoint.
     */
    AUTHENTICATE_LOGIN: Symbol('AuthenticateLoginHandler'),

    /**
     * Records an authentication failure.
     */
    RECORD_AUTHENTICATION_FAILURE: Symbol('RecordAuthenticationFailureHandler'),

    /**
     * Changes the authentication password.
     */
    CHANGE_PASSWORD: Symbol('ChangePasswordHandler'),

    // =========================================================================
    // Session
    // =========================================================================

    /**
     * Creates a Session aggregate.
     */
    CREATE_SESSION: Symbol('CreateSessionHandler'),

    /**
     * Refreshes an authenticated session.
     */
    REFRESH_SESSION: Symbol('RefreshSessionHandler'),

    /**
     * Revokes a Session aggregate.
     */
    REVOKE_SESSION: Symbol('RevokeSessionHandler'),

    /**
     * Expires a Session aggregate.
     */
    EXPIRE_SESSION: Symbol('ExpireSessionHandler'),

    /**
     * Handles refresh-token reuse detection.
     */
    DETECT_SESSION_TOKEN_REUSE: Symbol('DetectSessionTokenReuseHandler'),

    // =========================================================================
    // Device
    // =========================================================================

    /**
     * Creates a Device aggregate.
     */
    CREATE_DEVICE: Symbol('CreateDeviceHandler'),

    /**
     * Marks a Device as trusted.
     */
    TRUST_DEVICE: Symbol('TrustDeviceHandler'),

    /**
     * Records activity/observation of a Device.
     */
    RECORD_DEVICE_SEEN: Symbol('RecordDeviceSeenHandler'),

    /**
     * Revokes a Device.
     */
    REVOKE_DEVICE: Symbol('RevokeDeviceHandler'),

    // =========================================================================
    // Recovery
    // =========================================================================

    /**
     * Creates a Recovery aggregate.
     */
    CREATE_RECOVERY: Symbol('CreateRecoveryHandler'),

    /**
     * Completes a Recovery workflow.
     */
    COMPLETE_RECOVERY: Symbol('CompleteRecoveryHandler'),

    /**
     * Cancels a Recovery workflow.
     */
    CANCEL_RECOVERY: Symbol('CancelRecoveryHandler'),

    /**
     * Expires a Recovery workflow.
     */
    EXPIRE_RECOVERY: Symbol('ExpireRecoveryHandler'),

    // =========================================================================
    // OTP Challenge
    // =========================================================================

    /**
     * Creates an OTP Challenge aggregate.
     */
    CREATE_OTP_CHALLENGE: Symbol('CreateOtpChallengeHandler'),

    /**
     * Verifies an OTP Challenge.
     */
    VERIFY_OTP_CHALLENGE: Symbol('VerifyOtpChallengeHandler'),

    /**
     * Records an OTP Challenge failure.
     */
    FAIL_OTP_CHALLENGE: Symbol('FailOtpChallengeHandler'),

    /**
     * Expires an OTP Challenge.
     */
    EXPIRE_OTP_CHALLENGE: Symbol('ExpireOtpChallengeHandler'),

    /**
     * Cancels an OTP Challenge.
     */
    CANCEL_OTP_CHALLENGE: Symbol('CancelOtpChallengeHandler'),
  } as const,

  // ===========================================================================
  // Query Handlers
  // ===========================================================================

  QUERY_HANDLERS: {
    // =========================================================================
    // Authentication
    // =========================================================================

    /**
     * Retrieves an Authentication aggregate by public ID.
     */
    GET_AUTHENTICATION: Symbol('GetAuthenticationHandler'),

    /**
     * Retrieves an Authentication aggregate by Identity public ID.
     */
    GET_AUTHENTICATION_BY_IDENTITY: Symbol(
      'GetAuthenticationByIdentityHandler',
    ),

    // =========================================================================
    // Session
    // =========================================================================

    /**
     * Retrieves a Session aggregate by public ID.
     */
    GET_SESSION: Symbol('GetSessionHandler'),

    /**
     * Retrieves Sessions for an identity.
     */
    GET_SESSIONS: Symbol('GetSessionsHandler'),

    /**
     * Retrieves active Sessions for an identity.
     */
    GET_ACTIVE_SESSIONS: Symbol('GetActiveSessionsHandler'),

    // =========================================================================
    // Device
    // =========================================================================

    /**
     * Retrieves a Device aggregate by public ID.
     */
    GET_DEVICE: Symbol('GetDeviceHandler'),

    /**
     * Retrieves Devices for an identity.
     */
    GET_DEVICES: Symbol('GetDevicesHandler'),

    /**
     * Retrieves active Devices for an identity.
     */
    GET_ACTIVE_DEVICES: Symbol('GetActiveDevicesHandler'),

    // =========================================================================
    // Recovery
    // =========================================================================

    /**
     * Retrieves a Recovery aggregate by public ID.
     */
    GET_RECOVERY: Symbol('GetRecoveryHandler'),

    /**
     * Retrieves Recovery workflows for an identity.
     */
    GET_RECOVERIES: Symbol('GetRecoveriesHandler'),

    // =========================================================================
    // OTP Challenge
    // =========================================================================

    /**
     * Retrieves an OTP Challenge by public ID.
     */
    GET_OTP_CHALLENGE: Symbol('GetOtpChallengeHandler'),

    /**
     * Retrieves active OTP Challenges.
     */
    GET_ACTIVE_OTP_CHALLENGES: Symbol('GetActiveOtpChallengesHandler'),
  } as const,
} as const;

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AUTH_TOKENS;
