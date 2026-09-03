// -----------------------------------------------------------------------------
// Session — Refresh Token Hash Value Object
// -----------------------------------------------------------------------------
//
// Represents the cryptographic hash of the refresh token associated with a
// Session.
//
// IMPORTANT:
//
// - Only the hash is persisted.
// - The plaintext refresh token MUST NEVER be persisted.
// - The plaintext refresh token MUST NOT enter the Session aggregate.
// - Hashing and verification belong to the security/application boundary.
// - This value object treats the resulting hash as opaque.
//
// Lifecycle:
//
//     TokenGenerator
//          │
//          ▼
//     Raw refresh token
//          │
//          ├──────────────────────────► Client
//          │
//          ▼
//     Security hashing
//          │
//          ▼
//     SessionRefreshTokenHash
//          │
//          ▼
//     Session
//
// During refresh:
//
//     Raw refresh token
//          │
//          ▼
//     Security verification
//          │
//          ▼
//     Existing SessionRefreshTokenHash
//
// A successful rotation produces a new raw refresh token and a new
// SessionRefreshTokenHash.
//
// The domain does not know or care which hashing algorithm is used.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface SessionRefreshTokenHashProps {
  readonly value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Cryptographic hash of the refresh token associated with a Session.
 *
 * The value is intentionally opaque to the domain.
 *
 * The Session aggregate stores this value object but does not:
 *
 * - generate refresh tokens;
 * - hash refresh tokens;
 * - verify refresh tokens;
 * - compare plaintext tokens;
 * - know the underlying hashing algorithm.
 *
 * Those responsibilities belong outside the domain boundary.
 */
export class SessionRefreshTokenHash extends ValueObject<SessionRefreshTokenHashProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: string) {
    super({
      value,
    });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Session refresh-token hash value object.
   *
   * The supplied value MUST already be a cryptographic hash.
   *
   * This method does not perform hashing.
   */
  public static create(value: string): SessionRefreshTokenHash {
    SessionRefreshTokenHash.validate(value);

    return new SessionRefreshTokenHash(value);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!value) {
      throw new Error('Session refresh token hash is required.');
    }

    if (value.trim().length === 0) {
      throw new Error('Session refresh token hash must not be empty.');
    }
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  /**
   * Returns the opaque cryptographic hash.
   */
  public get value(): string {
    return this.props.value;
  }

  // ---------------------------------------------------------------------------
  // Serialization
  // ---------------------------------------------------------------------------

  /**
   * Returns the persisted hash value.
   *
   * This is intended for trusted persistence/security infrastructure.
   *
   * The hash must never be:
   *
   * - returned in API responses;
   * - written to application logs;
   * - exposed to clients.
   */
  public override toString(): string {
    return this.props.value;
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------
