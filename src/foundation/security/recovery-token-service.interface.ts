// -----------------------------------------------------------------------------
// Foundation — Security — Recovery Token Service
// -----------------------------------------------------------------------------
//
// Application-facing abstraction for recovery-token security.
//
// Responsibilities:
//
// - generate a cryptographically secure raw recovery token;
// - generate a persistence-safe hash of that token;
// - compare a raw token against a persisted hash.
//
// The implementation belongs to infrastructure.
//
// The Foundation layer must not know:
//
// - bcrypt;
// - Argon2;
// - crypto implementation details;
// - Prisma;
// - JWT;
// - persistence;
// - notification providers.
// -----------------------------------------------------------------------------

// =============================================================================
// Generated Recovery Token
// =============================================================================

export interface GeneratedRecoveryToken {
  /**
   * Raw recovery token.
   *
   * Sensitive credential material.
   *
   * This value MUST NOT be persisted or logged.
   */
  readonly token: string;

  /**
   * Persistence-safe hash of the recovery token.
   *
   * Only this value may cross into the domain persistence model.
   */
  readonly hash: string;
}

// =============================================================================
// Recovery Token Service
// =============================================================================

export interface RecoveryTokenService {
  /**
   * Generates a new cryptographically secure recovery token and its
   * persistence-safe hash.
   *
   * The raw token exists only transiently and is returned so an application
   * workflow can deliver it through the appropriate notification mechanism.
   */
  generate(): GeneratedRecoveryToken;

  /**
   * Compares a raw recovery token against a persisted token hash.
   *
   * Returns true only when the supplied token matches the persisted hash.
   */
  verify(token: string, tokenHash: string): boolean;
}
