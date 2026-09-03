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
     * Infrastructure bridges this token to the concrete password-hashing
     * implementation.
     */
    PASSWORD_HASHER: Symbol('PasswordHasher'),

    /**
     * Cryptographically secure opaque token generator.
     *
     * Used by authentication to generate raw refresh tokens.
     */
    TOKEN_GENERATOR: Symbol('TokenGenerator'),

    /**
     * Refresh-token hashing abstraction.
     *
     * Raw refresh tokens never enter the Session aggregate.
     */
    REFRESH_TOKEN_HASHER: Symbol('RefreshTokenHasher'),

    /**
     * Access JWT abstraction.
     *
     * Responsible only for access-token signing, verification, and decoding.
     */
    JWT_TOKEN_SERVICE: Symbol('JwtTokenService'),

    /**
     * Recovery-token service.
     */
    RECOVERY_TOKEN: Symbol('RecoveryTokenService'),

    /**
     * OTP service.
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

    CREATE_AUTHENTICATION: Symbol('CreateAuthenticationHandler'),

    ACTIVATE_AUTHENTICATION: Symbol('ActivateAuthenticationHandler'),

    LOCK_AUTHENTICATION: Symbol('LockAuthenticationHandler'),

    UNLOCK_AUTHENTICATION: Symbol('UnlockAuthenticationHandler'),

    DISABLE_AUTHENTICATION: Symbol('DisableAuthenticationHandler'),

    /**
     * Credential authentication only.
     *
     * This handler resolves Identity + Authentication and verifies the
     * supplied credentials.
     *
     * It does NOT create Devices or Sessions.
     */
    AUTHENTICATE: Symbol('AuthenticateHandler'),

    /**
     * Complete login workflow.
     *
     * Coordinates:
     *
     * Authentication
     *      ↓
     * Device
     *      ↓
     * Session
     *      ↓
     * access + refresh tokens
     */
    AUTHENTICATE_LOGIN: Symbol('AuthenticateLoginHandler'),

    RECORD_AUTHENTICATION_FAILURE: Symbol('RecordAuthenticationFailureHandler'),

    CHANGE_PASSWORD: Symbol('ChangePasswordHandler'),

    // =========================================================================
    // Session
    // =========================================================================

    CREATE_SESSION: Symbol('CreateSessionHandler'),

    REFRESH_SESSION: Symbol('RefreshSessionHandler'),

    REVOKE_SESSION: Symbol('RevokeSessionHandler'),

    EXPIRE_SESSION: Symbol('ExpireSessionHandler'),

    DETECT_SESSION_TOKEN_REUSE: Symbol('DetectSessionTokenReuseHandler'),

    // =========================================================================
    // Device
    // =========================================================================

    CREATE_DEVICE: Symbol('CreateDeviceHandler'),

    TRUST_DEVICE: Symbol('TrustDeviceHandler'),

    RECORD_DEVICE_SEEN: Symbol('RecordDeviceSeenHandler'),

    REVOKE_DEVICE: Symbol('RevokeDeviceHandler'),

    // =========================================================================
    // Recovery
    // =========================================================================

    CREATE_RECOVERY: Symbol('CreateRecoveryHandler'),

    COMPLETE_RECOVERY: Symbol('CompleteRecoveryHandler'),

    CANCEL_RECOVERY: Symbol('CancelRecoveryHandler'),

    EXPIRE_RECOVERY: Symbol('ExpireRecoveryHandler'),

    // =========================================================================
    // OTP Challenge
    // =========================================================================

    CREATE_OTP_CHALLENGE: Symbol('CreateOtpChallengeHandler'),

    VERIFY_OTP_CHALLENGE: Symbol('VerifyOtpChallengeHandler'),

    FAIL_OTP_CHALLENGE: Symbol('FailOtpChallengeHandler'),

    EXPIRE_OTP_CHALLENGE: Symbol('ExpireOtpChallengeHandler'),

    CANCEL_OTP_CHALLENGE: Symbol('CancelOtpChallengeHandler'),
  } as const,

  // ===========================================================================
  // Query Handlers
  // ===========================================================================

  QUERY_HANDLERS: {
    // =========================================================================
    // Authentication
    // =========================================================================

    GET_AUTHENTICATION: Symbol('GetAuthenticationHandler'),

    GET_AUTHENTICATION_BY_IDENTITY: Symbol(
      'GetAuthenticationByIdentityHandler',
    ),

    // =========================================================================
    // Session
    // =========================================================================

    GET_SESSION: Symbol('GetSessionHandler'),

    GET_SESSIONS: Symbol('GetSessionsHandler'),

    GET_ACTIVE_SESSIONS: Symbol('GetActiveSessionsHandler'),

    // =========================================================================
    // Device
    // =========================================================================

    GET_DEVICE: Symbol('GetDeviceHandler'),

    GET_DEVICES: Symbol('GetDevicesHandler'),

    GET_ACTIVE_DEVICES: Symbol('GetActiveDevicesHandler'),

    // =========================================================================
    // Recovery
    // =========================================================================

    GET_RECOVERY: Symbol('GetRecoveryHandler'),

    GET_RECOVERIES: Symbol('GetRecoveriesHandler'),

    // =========================================================================
    // OTP Challenge
    // =========================================================================

    GET_OTP_CHALLENGE: Symbol('GetOtpChallengeHandler'),

    GET_ACTIVE_OTP_CHALLENGES: Symbol('GetActiveOtpChallengesHandler'),
  } as const,
} as const;

export default AUTH_TOKENS;
