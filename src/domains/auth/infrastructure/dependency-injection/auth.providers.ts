// -----------------------------------------------------------------------------
// Authentication — Dependency Injection Providers
// -----------------------------------------------------------------------------
//
// Infrastructure dependency-injection providers for the Authentication
// bounded context.
//
// The application layer depends on:
//
// - domain repository contracts;
// - application-level security abstractions.
//
// This provider file binds:
//
// - domain repository abstractions to concrete Prisma implementations;
// - application security abstractions to infrastructure-provided services.
//
// Covered aggregate boundaries:
//
// - AuthenticationAggregate
// - SessionAggregate
// - DeviceAggregate
// - RecoveryAggregate
// - OtpChallengeAggregate
//
// Each aggregate owns its own repository boundary.
//
// Command and query handlers are intentionally registered separately in the
// AuthenticationModule.
//
// -----------------------------------------------------------------------------
//
// Dependency direction:
//
//     Authentication Application
//              │
//              ▼
//     AUTH_TOKENS
//              │
//              ├── REPOSITORIES
//              │
//              └── APPLICATION_SERVICES
//                         │
//                         ▼
//              Infrastructure Security
//                         │
//                         ▼
//                  Concrete Services
//
// The Authentication bounded context does NOT import concrete security
// implementations merely to satisfy an application abstraction.
//
// Infrastructure security tokens are used as the composition-root bridge.
//
// -----------------------------------------------------------------------------
//
// Security bindings:
//
//     PasswordHasher
//          │
//          ▼
//     AUTH_TOKENS.APPLICATION_SERVICES.PASSWORD_HASHER
//          │
//          ▼
//     SECURITY_PASSWORD_HASHER
//          │
//          ▼
//     BcryptPasswordService
//
//     TokenGenerator
//          │
//          ▼
//     AUTH_TOKENS.APPLICATION_SERVICES.TOKEN_GENERATOR
//          │
//          ▼
//     SECURITY_TOKEN_GENERATOR
//          │
//          ▼
//     CryptoTokenGeneratorService
//
//     RefreshTokenHasher
//          │
//          ▼
//     AUTH_TOKENS.APPLICATION_SERVICES.REFRESH_TOKEN_HASHER
//          │
//          ▼
//     SECURITY_REFRESH_TOKEN_HASHER
//          │
//          ▼
//     RefreshTokenHasherService
//
//     JwtTokenService
//          │
//          ▼
//     AUTH_TOKENS.APPLICATION_SERVICES.JWT_TOKEN_SERVICE
//          │
//          ▼
//     SECURITY_JWT_TOKEN_SERVICE
//          │
//          ▼
//     JwtTokenService
//
//     RecoveryTokenService
//          │
//          ▼
//     AUTH_TOKENS.APPLICATION_SERVICES.RECOVERY_TOKEN
//          │
//          ▼
//     SECURITY_RECOVERY_TOKEN_SERVICE
//          │
//          ▼
//     InfrastructureRecoveryTokenService
//
//     OtpService
//          │
//          ▼
//     AUTH_TOKENS.APPLICATION_SERVICES.OTP
//          │
//          ▼
//     SECURITY_OTP_SERVICE
//          │
//          ▼
//     CryptoOtpService
//
// -----------------------------------------------------------------------------
//
// Token responsibilities:
//
// TokenGenerator
//
//     Generates opaque, cryptographically secure bearer credentials.
//     Authentication uses it for refresh-token generation.
//
// RefreshTokenHasher
//
//     Hashes opaque refresh tokens before they enter Session persistence.
//     It also verifies a presented refresh token against its persisted hash.
//
// JwtTokenService
//
//     Generates short-lived access JWTs.
//     It does NOT generate or manage refresh tokens.
//
// RecoveryTokenService
//
//     Owns recovery-token generation, hashing, and verification.
//
// OtpService
//
//     Owns numeric OTP generation, hashing, and verification.
//
// -----------------------------------------------------------------------------
//
// REFRESH TOKEN FLOW:
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
// The raw refresh token is never persisted.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT:
//
// `useExisting` is intentionally used for application security bridges.
//
// This guarantees that:
//
//     AUTH_TOKENS.APPLICATION_SERVICES.X
//
// resolves to the same infrastructure provider instance as:
//
//     SECURITY_X
//
// The Authentication application layer therefore remains independent from
// concrete infrastructure implementations.
//
// -----------------------------------------------------------------------------
//
// Repository ownership:
//
// AuthenticationRepository
//     └── AuthenticationAggregate
//
// SessionRepository
//     └── SessionAggregate
//
// DeviceRepository
//     └── DeviceAggregate
//
// RecoveryRepository
//     └── RecoveryAggregate
//
// OtpChallengeRepository
//     └── OtpChallengeAggregate
//
// Each repository is responsible for persistence of its own aggregate only.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import type { Provider } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { AUTH_TOKENS } from '../../application/auth.tokens';

// -----------------------------------------------------------------------------
// Infrastructure — Security Tokens
// -----------------------------------------------------------------------------

import {
  SECURITY_JWT_TOKEN_SERVICE,
  SECURITY_OTP_SERVICE,
  SECURITY_PASSWORD_HASHER,
  SECURITY_RECOVERY_TOKEN_SERVICE,
  SECURITY_REFRESH_TOKEN_HASHER,
  SECURITY_TOKEN_GENERATOR,
} from '../../../../infrastructure/security/security.tokens';

// -----------------------------------------------------------------------------
// Infrastructure — Prisma Repositories
// -----------------------------------------------------------------------------

import {
  PrismaAuthenticationRepository,
  PrismaDeviceRepository,
  PrismaOtpChallengeRepository,
  PrismaRecoveryRepository,
  PrismaSessionRepository,
} from '../persistence/prisma/repositories';

// =============================================================================
// Providers
// =============================================================================

/**
 * Dependency-injection providers for the Authentication bounded context.
 *
 * Infrastructure is responsible for binding:
 *
 * - domain repository abstractions to concrete persistence implementations;
 * - application-level security abstractions to infrastructure security
 *   providers.
 *
 * The application layer depends only on the abstractions represented by
 * AUTH_TOKENS.
 *
 * Concrete security services remain owned by the Security infrastructure.
 *
 * `useExisting` is intentionally used for security bridges so that the
 * application token resolves to the exact same infrastructure provider
 * instance already registered under the corresponding security token.
 */
export const AUTH_PROVIDERS: Provider[] = [
  // ===========================================================================
  // Authentication Repository
  // ===========================================================================

  {
    provide: AUTH_TOKENS.REPOSITORIES.AUTHENTICATION,
    useClass: PrismaAuthenticationRepository,
  },

  // ===========================================================================
  // Session Repository
  // ===========================================================================

  {
    provide: AUTH_TOKENS.REPOSITORIES.SESSION,
    useClass: PrismaSessionRepository,
  },

  // ===========================================================================
  // Device Repository
  // ===========================================================================

  {
    provide: AUTH_TOKENS.REPOSITORIES.DEVICE,
    useClass: PrismaDeviceRepository,
  },

  // ===========================================================================
  // Recovery Repository
  // ===========================================================================

  {
    provide: AUTH_TOKENS.REPOSITORIES.RECOVERY,
    useClass: PrismaRecoveryRepository,
  },

  // ===========================================================================
  // OTP Challenge Repository
  // ===========================================================================

  {
    provide: AUTH_TOKENS.REPOSITORIES.OTP_CHALLENGE,
    useClass: PrismaOtpChallengeRepository,
  },

  // ===========================================================================
  // Password Hasher
  // ===========================================================================
  //
  // Application abstraction:
  //
  //     AUTH_TOKENS.APPLICATION_SERVICES.PASSWORD_HASHER
  //
  // Infrastructure binding:
  //
  //     SECURITY_PASSWORD_HASHER
  //
  // Concrete implementation:
  //
  //     BcryptPasswordService
  //
  // Used by authentication credential workflows to hash and verify
  // passwords.
  //
  // ---------------------------------------------------------------------------

  {
    provide: AUTH_TOKENS.APPLICATION_SERVICES.PASSWORD_HASHER,
    useExisting: SECURITY_PASSWORD_HASHER,
  },

  // ===========================================================================
  // Generic Token Generator
  // ===========================================================================
  //
  // Application abstraction:
  //
  //     AUTH_TOKENS.APPLICATION_SERVICES.TOKEN_GENERATOR
  //
  // Infrastructure binding:
  //
  //     SECURITY_TOKEN_GENERATOR
  //
  // Concrete implementation:
  //
  //     CryptoTokenGeneratorService
  //
  // Used by authentication/session workflows to generate opaque,
  // cryptographically secure bearer credentials such as refresh tokens.
  //
  // IMPORTANT:
  //
  // The raw token is transient application data.
  //
  // The Session aggregate stores only the corresponding
  // SessionRefreshTokenHash.
  //
  // This service has no JWT responsibility.
  //
  // ---------------------------------------------------------------------------

  {
    provide: AUTH_TOKENS.APPLICATION_SERVICES.TOKEN_GENERATOR,
    useExisting: SECURITY_TOKEN_GENERATOR,
  },

  // ===========================================================================
  // Refresh Token Hasher
  // ===========================================================================
  //
  // Application abstraction:
  //
  //     AUTH_TOKENS.APPLICATION_SERVICES.REFRESH_TOKEN_HASHER
  //
  // Infrastructure binding:
  //
  //     SECURITY_REFRESH_TOKEN_HASHER
  //
  // Concrete implementation:
  //
  //     RefreshTokenHasherService
  //
  // Responsibilities:
  //
  // - hash raw refresh tokens before persistence;
  // - compare presented refresh tokens against persisted hashes.
  //
  // IMPORTANT:
  //
  // RefreshTokenHasher is deliberately separate from PasswordHasher.
  //
  // PasswordHasher is designed for user-chosen passwords and adaptive
  // password hashing.
  //
  // RefreshTokenHasher is designed for high-entropy opaque bearer
  // credentials.
  //
  // The raw refresh token MUST NOT enter SessionEntity.
  //
  // Only SessionRefreshTokenHash enters the Session aggregate.
  //
  // ---------------------------------------------------------------------------

  {
    provide: AUTH_TOKENS.APPLICATION_SERVICES.REFRESH_TOKEN_HASHER,
    useExisting: SECURITY_REFRESH_TOKEN_HASHER,
  },

  // ===========================================================================
  // JWT Access Token Service
  // ===========================================================================
  //
  // Application abstraction:
  //
  //     AUTH_TOKENS.APPLICATION_SERVICES.JWT_TOKEN_SERVICE
  //
  // Infrastructure binding:
  //
  //     SECURITY_JWT_TOKEN_SERVICE
  //
  // Concrete implementation:
  //
  //     JwtTokenService
  //
  // Used by the authentication workflow to issue short-lived access JWTs
  // after successful authentication and Session creation.
  //
  // IMPORTANT:
  //
  // This service MUST NOT be used to generate refresh tokens.
  //
  // Access tokens and refresh tokens have deliberately different security
  // responsibilities and lifecycles.
  //
  // ---------------------------------------------------------------------------

  {
    provide: AUTH_TOKENS.APPLICATION_SERVICES.JWT_TOKEN_SERVICE,
    useExisting: SECURITY_JWT_TOKEN_SERVICE,
  },

  // ===========================================================================
  // Recovery Token Service
  // ===========================================================================
  //
  // Application abstraction:
  //
  //     AUTH_TOKENS.APPLICATION_SERVICES.RECOVERY_TOKEN
  //
  // Infrastructure binding:
  //
  //     SECURITY_RECOVERY_TOKEN_SERVICE
  //
  // Concrete implementation:
  //
  //     InfrastructureRecoveryTokenService
  //
  // Responsible for recovery-token generation, hashing, and verification.
  //
  // Recovery credentials remain separate from authentication refresh tokens.
  //
  // ---------------------------------------------------------------------------

  {
    provide: AUTH_TOKENS.APPLICATION_SERVICES.RECOVERY_TOKEN,
    useExisting: SECURITY_RECOVERY_TOKEN_SERVICE,
  },

  // ===========================================================================
  // OTP Service
  // ===========================================================================
  //
  // Application abstraction:
  //
  //     AUTH_TOKENS.APPLICATION_SERVICES.OTP
  //
  // Infrastructure binding:
  //
  //     SECURITY_OTP_SERVICE
  //
  // Concrete implementation:
  //
  //     CryptoOtpService
  //
  // OTP remains deliberately separate from generic TokenGenerator.
  //
  // ---------------------------------------------------------------------------

  {
    provide: AUTH_TOKENS.APPLICATION_SERVICES.OTP,
    useExisting: SECURITY_OTP_SERVICE,
  },
];

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AUTH_PROVIDERS;
