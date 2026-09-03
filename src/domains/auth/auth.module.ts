// -----------------------------------------------------------------------------
// Authentication — NestJS Module
// -----------------------------------------------------------------------------
//
// Central NestJS module for the Authentication bounded context.
//
// Registered capabilities:
//
// - Authentication
// - Session
// - Device
// - Recovery
// - OTP Challenge
//
// The module wires:
//
// - REST controllers;
// - infrastructure repository providers;
// - infrastructure security bridges;
// - application command handlers;
// - application query handlers.
//
// Domain behavior remains inside aggregate roots/entities.
//
// Application handlers coordinate application workflows and delegate business
// behavior to the appropriate aggregate boundary.
//
// Persistence remains behind domain repository contracts.
//
// Security implementations remain behind Foundation abstractions and are
// supplied by the infrastructure SecurityModule.
//
// -----------------------------------------------------------------------------
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
// Each aggregate is independently responsible for its own lifecycle.
//
// The module contains no domain business rules.
//
// -----------------------------------------------------------------------------
//
// Cross-context dependency:
//
// Authentication does not own Identity.
//
// Identity remains the authoritative source of digital identity.
//
// AuthenticateHandler needs IdentityRepository to resolve:
//
//     email / phone number
//             │
//             ▼
//     IdentityRepository
//             │
//             ▼
//     IdentityAggregate
//             │
//             ▼
//     identityPublicId
//             │
//             ▼
//     AuthenticationRepository
//
// Therefore AuthModule imports IdentityModule.
//
// IdentityModule exports:
//
//     IDENTITY_TOKENS.REPOSITORIES.IDENTITY
//
// AuthModule consumes that exported token through AuthenticateHandler.
//
// -----------------------------------------------------------------------------
//
// Application login orchestration:
//
// AuthenticateLoginHandler owns the complete login workflow:
//
//     credentials
//          │
//          ▼
//     AuthenticateHandler
//          │
//          ▼
//     authenticated identity
//          │
//          ├──────────────► Device
//          │
//          └──────────────► Session
//                              │
//                              ├── refresh token
//                              └── access token
//
// AuthenticateHandler is intentionally separate from AuthenticateLoginHandler.
//
// AuthenticateHandler:
//     - resolves identity;
//     - authenticates credentials;
//     - returns authentication result.
//
// AuthenticateLoginHandler:
//     - orchestrates the complete login use case;
//     - invokes AuthenticateHandler;
//     - creates/resolves Device;
//     - creates Session;
//     - generates access token;
//     - generates raw refresh token;
//     - hashes refresh token;
//     - returns AuthenticateLoginResult.
//
// -----------------------------------------------------------------------------
//
// Dependency direction:
//
// Presentation
//      │
//      ▼
// Application
//      │
//      ├── IdentityRepository abstraction
//      ├── AuthenticationRepository abstraction
//      ├── SessionRepository abstraction
//      ├── DeviceRepository abstraction
//      └── Security abstractions
//             │
//             ▼
// Infrastructure DI bridges
//             │
//             ├── Prisma repositories
//             └── SecurityModule
//
// Application handlers must not import concrete infrastructure security
// implementations.
//
// -----------------------------------------------------------------------------
//
// Security dependency bridge:
//
//     AUTH_TOKENS.APPLICATION_SERVICES.PASSWORD_HASHER
//                         │
//                         ▼
//             SECURITY_PASSWORD_HASHER
//                         │
//                         ▼
//             BcryptPasswordService
//
//     AUTH_TOKENS.APPLICATION_SERVICES.TOKEN_GENERATOR
//                         │
//                         ▼
//             SECURITY_TOKEN_GENERATOR
//                         │
//                         ▼
//             CryptoTokenGeneratorService
//
//     AUTH_TOKENS.APPLICATION_SERVICES.REFRESH_TOKEN_HASHER
//                         │
//                         ▼
//             SECURITY_REFRESH_TOKEN_HASHER
//                         │
//                         ▼
//             RefreshTokenHasherService
//
//     AUTH_TOKENS.APPLICATION_SERVICES.JWT_TOKEN_SERVICE
//                         │
//                         ▼
//             SECURITY_JWT_TOKEN_SERVICE
//                         │
//                         ▼
//             JwtTokenService
//
//     AUTH_TOKENS.APPLICATION_SERVICES.RECOVERY_TOKEN
//                         │
//                         ▼
//             SECURITY_RECOVERY_TOKEN_SERVICE
//                         │
//                         ▼
//             InfrastructureRecoveryTokenService
//
//     AUTH_TOKENS.APPLICATION_SERVICES.OTP
//                         │
//                         ▼
//             SECURITY_OTP_SERVICE
//                         │
//                         ▼
//             CryptoOtpService
//
// -----------------------------------------------------------------------------
//
// REFRESH TOKENS:
//
// Refresh tokens are opaque credentials.
//
// TokenGenerator creates the raw credential.
//
// RefreshTokenHasher hashes the credential before it enters Session
// persistence.
//
// JwtTokenService is responsible only for access JWTs.
//
// Therefore:
//
//     TokenGenerator
//          │
//          ▼
//     raw refresh token
//          │
//          ├──────────────► client
//          │
//          ▼
//     RefreshTokenHasher
//          │
//          ▼
//     SessionRefreshTokenHash
//          │
//          ▼
//     SessionAggregate
//
// The raw refresh token is never persisted by the Session aggregate.
//
// -----------------------------------------------------------------------------
//
// SecurityModule:
//
// SecurityModule owns concrete security implementations and infrastructure
// security tokens.
//
// AuthModule imports SecurityModule so AUTH_PROVIDERS can bridge:
//
//     application token
//             │
//             ▼
//     infrastructure security token
//             │
//             ▼
//     concrete implementation
//
// -----------------------------------------------------------------------------
//
// PrismaModule:
//
// PrismaModule provides PrismaService to the concrete Authentication
// repositories.
//
// Repository implementations remain infrastructure concerns and are hidden
// behind AUTH_TOKENS.REPOSITORIES.*.
//
// -----------------------------------------------------------------------------
//
// Module boundary:
//
// AuthModule exposes application-facing repository and handler tokens.
//
// It does not expose concrete Prisma repositories or concrete Security
// implementations.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Module } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Infrastructure — Database
// -----------------------------------------------------------------------------

import { PrismaModule } from '../../infrastructure/database/prisma/prisma.module';

// -----------------------------------------------------------------------------
// Infrastructure — Security
// -----------------------------------------------------------------------------

import { SecurityModule } from '../../infrastructure/security/security.module';

// -----------------------------------------------------------------------------
// Cross-Context — Identity
// -----------------------------------------------------------------------------

import { IdentityModule } from '../identity/identity.module';

// -----------------------------------------------------------------------------
// Presentation — Controllers
// -----------------------------------------------------------------------------

import {
  AuthenticationsController,
  SessionsController,
  DevicesController,
  RecoveriesController,
  OtpChallengesController,
} from './presentation/rest/controllers';

// -----------------------------------------------------------------------------
// Infrastructure — Dependency Injection
// -----------------------------------------------------------------------------

import { AUTH_PROVIDERS } from './infrastructure/dependency-injection/auth.providers';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { AUTH_TOKENS } from './application/auth.tokens';

// -----------------------------------------------------------------------------
// Application — Command Handlers
// -----------------------------------------------------------------------------

import {
  // ===========================================================================
  // Authentication
  // ===========================================================================

  CreateAuthenticationHandler,
  ActivateAuthenticationHandler,
  LockAuthenticationHandler,
  UnlockAuthenticationHandler,
  DisableAuthenticationHandler,

  // Low-level credential authentication.
  AuthenticateHandler,

  // Complete login orchestration.
  AuthenticateLoginHandler,
  RecordAuthenticationFailureHandler,
  ChangePasswordHandler,

  // ===========================================================================
  // Session
  // ===========================================================================
  CreateSessionHandler,
  RefreshSessionHandler,
  RevokeSessionHandler,
  ExpireSessionHandler,
  DetectSessionTokenReuseHandler,

  // ===========================================================================
  // Device
  // ===========================================================================
  CreateDeviceHandler,
  TrustDeviceHandler,
  RecordDeviceSeenHandler,
  RevokeDeviceHandler,

  // ===========================================================================
  // Recovery
  // ===========================================================================
  CreateRecoveryHandler,
  CompleteRecoveryHandler,
  CancelRecoveryHandler,
  ExpireRecoveryHandler,

  // ===========================================================================
  // OTP Challenge
  // ===========================================================================
  CreateOtpChallengeHandler,
  VerifyOtpChallengeHandler,
  FailOtpChallengeHandler,
  ExpireOtpChallengeHandler,
  CancelOtpChallengeHandler,
} from './application/command-handlers';

// -----------------------------------------------------------------------------
// Application — Query Handlers
// -----------------------------------------------------------------------------

import {
  // ===========================================================================
  // Authentication
  // ===========================================================================

  GetAuthenticationHandler,
  GetAuthenticationByIdentityHandler,

  // ===========================================================================
  // Session
  // ===========================================================================
  GetSessionHandler,
  GetSessionsHandler,
  GetActiveSessionsHandler,

  // ===========================================================================
  // Device
  // ===========================================================================
  GetDeviceHandler,
  GetDevicesHandler,
  GetActiveDevicesHandler,

  // ===========================================================================
  // Recovery
  // ===========================================================================
  GetRecoveryHandler,
  GetRecoveriesHandler,

  // ===========================================================================
  // OTP Challenge
  // ===========================================================================
  GetOtpChallengeHandler,
  GetActiveOtpChallengesHandler,
} from './application/query-handlers';

// =============================================================================
// Authentication Module
// =============================================================================

@Module({
  // ===========================================================================
  // Imports
  // ===========================================================================

  imports: [PrismaModule, SecurityModule, IdentityModule],

  // ===========================================================================
  // Controllers
  // ===========================================================================

  controllers: [
    AuthenticationsController,
    SessionsController,
    DevicesController,
    RecoveriesController,
    OtpChallengesController,
  ],

  // ===========================================================================
  // Providers
  // ===========================================================================

  providers: [
    // =========================================================================
    // Infrastructure — Repository and Security Providers
    // =========================================================================

    ...AUTH_PROVIDERS,

    // =========================================================================
    // Authentication — Command Handlers
    // =========================================================================

    {
      provide: AUTH_TOKENS.COMMAND_HANDLERS.CREATE_AUTHENTICATION,
      useClass: CreateAuthenticationHandler,
    },

    {
      provide: AUTH_TOKENS.COMMAND_HANDLERS.ACTIVATE_AUTHENTICATION,
      useClass: ActivateAuthenticationHandler,
    },

    {
      provide: AUTH_TOKENS.COMMAND_HANDLERS.LOCK_AUTHENTICATION,
      useClass: LockAuthenticationHandler,
    },

    {
      provide: AUTH_TOKENS.COMMAND_HANDLERS.UNLOCK_AUTHENTICATION,
      useClass: UnlockAuthenticationHandler,
    },

    {
      provide: AUTH_TOKENS.COMMAND_HANDLERS.DISABLE_AUTHENTICATION,
      useClass: DisableAuthenticationHandler,
    },

    // -------------------------------------------------------------------------
    // Low-level credential authentication.
    //
    // This is intentionally separate from complete login orchestration.
    // -------------------------------------------------------------------------

    {
      provide: AUTH_TOKENS.COMMAND_HANDLERS.AUTHENTICATE,
      useClass: AuthenticateHandler,
    },

    // -------------------------------------------------------------------------
    // Complete login orchestration.
    //
    // This is the handler injected by:
    //
    //     AuthenticationsController.login()
    //
    // -------------------------------------------------------------------------

    {
      provide: AUTH_TOKENS.COMMAND_HANDLERS.AUTHENTICATE_LOGIN,
      useClass: AuthenticateLoginHandler,
    },

    {
      provide: AUTH_TOKENS.COMMAND_HANDLERS.RECORD_AUTHENTICATION_FAILURE,
      useClass: RecordAuthenticationFailureHandler,
    },

    {
      provide: AUTH_TOKENS.COMMAND_HANDLERS.CHANGE_PASSWORD,
      useClass: ChangePasswordHandler,
    },

    // =========================================================================
    // Authentication — Query Handlers
    // =========================================================================

    {
      provide: AUTH_TOKENS.QUERY_HANDLERS.GET_AUTHENTICATION,
      useClass: GetAuthenticationHandler,
    },

    {
      provide: AUTH_TOKENS.QUERY_HANDLERS.GET_AUTHENTICATION_BY_IDENTITY,
      useClass: GetAuthenticationByIdentityHandler,
    },

    // =========================================================================
    // Session — Command Handlers
    // =========================================================================

    {
      provide: AUTH_TOKENS.COMMAND_HANDLERS.CREATE_SESSION,
      useClass: CreateSessionHandler,
    },

    {
      provide: AUTH_TOKENS.COMMAND_HANDLERS.REFRESH_SESSION,
      useClass: RefreshSessionHandler,
    },

    {
      provide: AUTH_TOKENS.COMMAND_HANDLERS.REVOKE_SESSION,
      useClass: RevokeSessionHandler,
    },

    {
      provide: AUTH_TOKENS.COMMAND_HANDLERS.EXPIRE_SESSION,
      useClass: ExpireSessionHandler,
    },

    {
      provide: AUTH_TOKENS.COMMAND_HANDLERS.DETECT_SESSION_TOKEN_REUSE,
      useClass: DetectSessionTokenReuseHandler,
    },

    // =========================================================================
    // Session — Query Handlers
    // =========================================================================

    {
      provide: AUTH_TOKENS.QUERY_HANDLERS.GET_SESSION,
      useClass: GetSessionHandler,
    },

    {
      provide: AUTH_TOKENS.QUERY_HANDLERS.GET_SESSIONS,
      useClass: GetSessionsHandler,
    },

    {
      provide: AUTH_TOKENS.QUERY_HANDLERS.GET_ACTIVE_SESSIONS,
      useClass: GetActiveSessionsHandler,
    },

    // =========================================================================
    // Device — Command Handlers
    // =========================================================================

    {
      provide: AUTH_TOKENS.COMMAND_HANDLERS.CREATE_DEVICE,
      useClass: CreateDeviceHandler,
    },

    {
      provide: AUTH_TOKENS.COMMAND_HANDLERS.TRUST_DEVICE,
      useClass: TrustDeviceHandler,
    },

    {
      provide: AUTH_TOKENS.COMMAND_HANDLERS.RECORD_DEVICE_SEEN,
      useClass: RecordDeviceSeenHandler,
    },

    {
      provide: AUTH_TOKENS.COMMAND_HANDLERS.REVOKE_DEVICE,
      useClass: RevokeDeviceHandler,
    },

    // =========================================================================
    // Device — Query Handlers
    // =========================================================================

    {
      provide: AUTH_TOKENS.QUERY_HANDLERS.GET_DEVICE,
      useClass: GetDeviceHandler,
    },

    {
      provide: AUTH_TOKENS.QUERY_HANDLERS.GET_DEVICES,
      useClass: GetDevicesHandler,
    },

    {
      provide: AUTH_TOKENS.QUERY_HANDLERS.GET_ACTIVE_DEVICES,
      useClass: GetActiveDevicesHandler,
    },

    // =========================================================================
    // Recovery — Command Handlers
    // =========================================================================

    {
      provide: AUTH_TOKENS.COMMAND_HANDLERS.CREATE_RECOVERY,
      useClass: CreateRecoveryHandler,
    },

    {
      provide: AUTH_TOKENS.COMMAND_HANDLERS.COMPLETE_RECOVERY,
      useClass: CompleteRecoveryHandler,
    },

    {
      provide: AUTH_TOKENS.COMMAND_HANDLERS.CANCEL_RECOVERY,
      useClass: CancelRecoveryHandler,
    },

    {
      provide: AUTH_TOKENS.COMMAND_HANDLERS.EXPIRE_RECOVERY,
      useClass: ExpireRecoveryHandler,
    },

    // =========================================================================
    // Recovery — Query Handlers
    // =========================================================================

    {
      provide: AUTH_TOKENS.QUERY_HANDLERS.GET_RECOVERY,
      useClass: GetRecoveryHandler,
    },

    {
      provide: AUTH_TOKENS.QUERY_HANDLERS.GET_RECOVERIES,
      useClass: GetRecoveriesHandler,
    },

    // =========================================================================
    // OTP Challenge — Command Handlers
    // =========================================================================

    {
      provide: AUTH_TOKENS.COMMAND_HANDLERS.CREATE_OTP_CHALLENGE,
      useClass: CreateOtpChallengeHandler,
    },

    {
      provide: AUTH_TOKENS.COMMAND_HANDLERS.VERIFY_OTP_CHALLENGE,
      useClass: VerifyOtpChallengeHandler,
    },

    {
      provide: AUTH_TOKENS.COMMAND_HANDLERS.FAIL_OTP_CHALLENGE,
      useClass: FailOtpChallengeHandler,
    },

    {
      provide: AUTH_TOKENS.COMMAND_HANDLERS.EXPIRE_OTP_CHALLENGE,
      useClass: ExpireOtpChallengeHandler,
    },

    {
      provide: AUTH_TOKENS.COMMAND_HANDLERS.CANCEL_OTP_CHALLENGE,
      useClass: CancelOtpChallengeHandler,
    },

    // =========================================================================
    // OTP Challenge — Query Handlers
    // =========================================================================

    {
      provide: AUTH_TOKENS.QUERY_HANDLERS.GET_OTP_CHALLENGE,
      useClass: GetOtpChallengeHandler,
    },

    {
      provide: AUTH_TOKENS.QUERY_HANDLERS.GET_ACTIVE_OTP_CHALLENGES,
      useClass: GetActiveOtpChallengesHandler,
    },
  ],

  // ===========================================================================
  // Exports
  // ===========================================================================

  exports: [
    // -------------------------------------------------------------------------
    // Repository Providers
    // -------------------------------------------------------------------------

    AUTH_TOKENS.REPOSITORIES.AUTHENTICATION,
    AUTH_TOKENS.REPOSITORIES.SESSION,
    AUTH_TOKENS.REPOSITORIES.DEVICE,
    AUTH_TOKENS.REPOSITORIES.RECOVERY,
    AUTH_TOKENS.REPOSITORIES.OTP_CHALLENGE,

    // -------------------------------------------------------------------------
    // Authentication — Command Handlers
    // -------------------------------------------------------------------------

    AUTH_TOKENS.COMMAND_HANDLERS.CREATE_AUTHENTICATION,
    AUTH_TOKENS.COMMAND_HANDLERS.ACTIVATE_AUTHENTICATION,
    AUTH_TOKENS.COMMAND_HANDLERS.LOCK_AUTHENTICATION,
    AUTH_TOKENS.COMMAND_HANDLERS.UNLOCK_AUTHENTICATION,
    AUTH_TOKENS.COMMAND_HANDLERS.DISABLE_AUTHENTICATION,

    // Low-level credential authentication.
    AUTH_TOKENS.COMMAND_HANDLERS.AUTHENTICATE,

    // Complete login orchestration.
    AUTH_TOKENS.COMMAND_HANDLERS.AUTHENTICATE_LOGIN,

    AUTH_TOKENS.COMMAND_HANDLERS.RECORD_AUTHENTICATION_FAILURE,
    AUTH_TOKENS.COMMAND_HANDLERS.CHANGE_PASSWORD,

    // -------------------------------------------------------------------------
    // Session — Command Handlers
    // -------------------------------------------------------------------------

    AUTH_TOKENS.COMMAND_HANDLERS.CREATE_SESSION,
    AUTH_TOKENS.COMMAND_HANDLERS.REFRESH_SESSION,
    AUTH_TOKENS.COMMAND_HANDLERS.REVOKE_SESSION,
    AUTH_TOKENS.COMMAND_HANDLERS.EXPIRE_SESSION,
    AUTH_TOKENS.COMMAND_HANDLERS.DETECT_SESSION_TOKEN_REUSE,

    // -------------------------------------------------------------------------
    // Device — Command Handlers
    // -------------------------------------------------------------------------

    AUTH_TOKENS.COMMAND_HANDLERS.CREATE_DEVICE,
    AUTH_TOKENS.COMMAND_HANDLERS.TRUST_DEVICE,
    AUTH_TOKENS.COMMAND_HANDLERS.RECORD_DEVICE_SEEN,
    AUTH_TOKENS.COMMAND_HANDLERS.REVOKE_DEVICE,

    // -------------------------------------------------------------------------
    // Recovery — Command Handlers
    // -------------------------------------------------------------------------

    AUTH_TOKENS.COMMAND_HANDLERS.CREATE_RECOVERY,
    AUTH_TOKENS.COMMAND_HANDLERS.COMPLETE_RECOVERY,
    AUTH_TOKENS.COMMAND_HANDLERS.CANCEL_RECOVERY,
    AUTH_TOKENS.COMMAND_HANDLERS.EXPIRE_RECOVERY,

    // -------------------------------------------------------------------------
    // OTP Challenge — Command Handlers
    // -------------------------------------------------------------------------

    AUTH_TOKENS.COMMAND_HANDLERS.CREATE_OTP_CHALLENGE,
    AUTH_TOKENS.COMMAND_HANDLERS.VERIFY_OTP_CHALLENGE,
    AUTH_TOKENS.COMMAND_HANDLERS.FAIL_OTP_CHALLENGE,
    AUTH_TOKENS.COMMAND_HANDLERS.EXPIRE_OTP_CHALLENGE,
    AUTH_TOKENS.COMMAND_HANDLERS.CANCEL_OTP_CHALLENGE,

    // -------------------------------------------------------------------------
    // Authentication — Query Handlers
    // -------------------------------------------------------------------------

    AUTH_TOKENS.QUERY_HANDLERS.GET_AUTHENTICATION,
    AUTH_TOKENS.QUERY_HANDLERS.GET_AUTHENTICATION_BY_IDENTITY,

    // -------------------------------------------------------------------------
    // Session — Query Handlers
    // -------------------------------------------------------------------------

    AUTH_TOKENS.QUERY_HANDLERS.GET_SESSION,
    AUTH_TOKENS.QUERY_HANDLERS.GET_SESSIONS,
    AUTH_TOKENS.QUERY_HANDLERS.GET_ACTIVE_SESSIONS,

    // -------------------------------------------------------------------------
    // Device — Query Handlers
    // -------------------------------------------------------------------------

    AUTH_TOKENS.QUERY_HANDLERS.GET_DEVICE,
    AUTH_TOKENS.QUERY_HANDLERS.GET_DEVICES,
    AUTH_TOKENS.QUERY_HANDLERS.GET_ACTIVE_DEVICES,

    // -------------------------------------------------------------------------
    // Recovery — Query Handlers
    // -------------------------------------------------------------------------

    AUTH_TOKENS.QUERY_HANDLERS.GET_RECOVERY,
    AUTH_TOKENS.QUERY_HANDLERS.GET_RECOVERIES,

    // -------------------------------------------------------------------------
    // OTP Challenge — Query Handlers
    // -------------------------------------------------------------------------

    AUTH_TOKENS.QUERY_HANDLERS.GET_OTP_CHALLENGE,
    AUTH_TOKENS.QUERY_HANDLERS.GET_ACTIVE_OTP_CHALLENGES,
  ],
})
export class AuthModule {}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AuthModule;
