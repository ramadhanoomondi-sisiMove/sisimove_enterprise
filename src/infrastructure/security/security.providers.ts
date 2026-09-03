// -----------------------------------------------------------------------------
// Infrastructure — Security — Providers
// -----------------------------------------------------------------------------
//
// Security dependency-injection configuration.
//
// Foundation abstractions:
//
//     EncryptionService
//     PasswordHasher
//     TokenGenerator
//     RefreshTokenHasher
//     RecoveryTokenHasher
//     RecoveryTokenService
//     OtpService
//     JwtTokenService
//
// are bound to concrete infrastructure implementations here.
//
// Dependency graph:
//
//     EncryptionService
//             │
//             ▼
//     AesEncryptionService
//
//     PasswordHasher
//             │
//             ▼
//     BcryptPasswordService
//
//     TokenGenerator
//             │
//             ▼
//     CryptoTokenGeneratorService
//
//     RefreshTokenHasher
//             │
//             ▼
//     RefreshTokenHasherService
//
//     RecoveryTokenHasher
//             │
//             ▼
//     RecoveryTokenHasherService
//
//     TokenGenerator + RecoveryTokenHasher
//             │
//             ▼
//     InfrastructureRecoveryTokenService
//
//     PasswordHasher
//             │
//             ▼
//     CryptoOtpService
//
//     JwtService
//             │
//             ▼
//     JwtTokenService
//
// IMPORTANT:
//
// - Foundation interfaces are type-only imports where required.
// - Concrete implementations are registered as Nest providers.
// - Injection tokens are used to depend on abstractions.
// - `useExisting` ensures the abstraction token and concrete class resolve to
//   the same singleton provider instance within the module scope.
// - Refresh-token hashing is deliberately separate from password hashing and
//   recovery-token hashing.
// -----------------------------------------------------------------------------

import type { Provider } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Concrete Security Implementations
// -----------------------------------------------------------------------------

import { AesEncryptionService } from './aes-encryption.service';
import { BcryptPasswordService } from './bcrypt-password.service';
import { CryptoOtpService } from './crypto-otp.service';
import { CryptoTokenGeneratorService } from './crypto-token-generator.service';
import { InfrastructureRecoveryTokenService } from './recovery-token.service';
import { RecoveryTokenHasherService } from './recovery-token-hasher.service';
import { RefreshTokenHasherService } from './refresh-token-hasher.service';
import { JwtTokenService } from './jwt-token.service';

// -----------------------------------------------------------------------------
// Security Tokens
// -----------------------------------------------------------------------------

import {
  SECURITY_ENCRYPTION,
  SECURITY_JWT_TOKEN_SERVICE,
  SECURITY_OTP_SERVICE,
  SECURITY_PASSWORD_HASHER,
  SECURITY_RECOVERY_TOKEN_HASHER,
  SECURITY_RECOVERY_TOKEN_SERVICE,
  SECURITY_REFRESH_TOKEN_HASHER,
  SECURITY_TOKEN_GENERATOR,
} from './security.tokens';

// =============================================================================
// Security Providers
// =============================================================================

export const securityProviders: Provider[] = [
  // ===========================================================================
  // Encryption
  // ===========================================================================

  AesEncryptionService,

  {
    provide: SECURITY_ENCRYPTION,
    useExisting: AesEncryptionService,
  },

  // ===========================================================================
  // Password Hashing
  // ===========================================================================
  //
  // Passwords are user-chosen credentials and therefore use an adaptive
  // password hashing algorithm.
  //
  // ---------------------------------------------------------------------------

  BcryptPasswordService,

  {
    provide: SECURITY_PASSWORD_HASHER,
    useExisting: BcryptPasswordService,
  },

  // ===========================================================================
  // Generic Token Generation
  // ===========================================================================
  //
  // Produces cryptographically secure opaque bearer credentials.
  //
  // Used by application workflows for credentials such as refresh tokens.
  //
  // ---------------------------------------------------------------------------

  CryptoTokenGeneratorService,

  {
    provide: SECURITY_TOKEN_GENERATOR,
    useExisting: CryptoTokenGeneratorService,
  },

  // ===========================================================================
  // Refresh Token Hashing
  // ===========================================================================
  //
  // Refresh tokens are high-entropy opaque credentials.
  //
  // Their lifecycle is intentionally separate from password hashing:
  //
  //     TokenGenerator
  //          │
  //          ▼
  //     Raw refresh token
  //          │
  //          ▼
  //     RefreshTokenHasherService
  //          │
  //          ▼
  //     Cryptographic hash
  //          │
  //          ▼
  //     SessionRefreshTokenHash
  //
  // The raw refresh token is never persisted.
  //
  // ---------------------------------------------------------------------------

  RefreshTokenHasherService,

  {
    provide: SECURITY_REFRESH_TOKEN_HASHER,
    useExisting: RefreshTokenHasherService,
  },

  // ===========================================================================
  // Recovery Token Hashing
  // ===========================================================================
  //
  // Recovery-token hashing remains a separate security concern from
  // refresh-token hashing.
  //
  // ---------------------------------------------------------------------------

  RecoveryTokenHasherService,

  {
    provide: SECURITY_RECOVERY_TOKEN_HASHER,
    useExisting: RecoveryTokenHasherService,
  },

  // ===========================================================================
  // Recovery Token Service
  // ===========================================================================
  //
  // InfrastructureRecoveryTokenService composes:
  //
  //     TokenGenerator
  //     RecoveryTokenHasher
  //
  // ---------------------------------------------------------------------------

  InfrastructureRecoveryTokenService,

  {
    provide: SECURITY_RECOVERY_TOKEN_SERVICE,
    useExisting: InfrastructureRecoveryTokenService,
  },

  // ===========================================================================
  // OTP Service
  // ===========================================================================
  //
  // CryptoOtpService depends on:
  //
  //     SECURITY_PASSWORD_HASHER
  //
  // which resolves to:
  //
  //     BcryptPasswordService
  //
  // Therefore:
  //
  //     SECURITY_OTP_SERVICE
  //             │
  //             ▼
  //       CryptoOtpService
  //             │
  //             ▼
  //     SECURITY_PASSWORD_HASHER
  //             │
  //             ▼
  //     BcryptPasswordService
  //
  // OTP remains deliberately separate from TokenGenerator.
  //
  // ---------------------------------------------------------------------------

  CryptoOtpService,

  {
    provide: SECURITY_OTP_SERVICE,
    useExisting: CryptoOtpService,
  },

  // ===========================================================================
  // JWT Token Service
  // ===========================================================================

  JwtTokenService,

  {
    provide: SECURITY_JWT_TOKEN_SERVICE,
    useExisting: JwtTokenService,
  },
];
