// -----------------------------------------------------------------------------
// Authentication Password Hash
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface AuthenticationPasswordHashProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Password hash associated with an Authentication.
 *
 * Represents the persisted cryptographic hash of an Authentication password.
 *
 * The value object never receives, stores, exposes, or transforms a plaintext
 * password. Password hashing and verification are responsibilities of the
 * authentication security infrastructure or an appropriate domain service.
 *
 * This value object exists to provide type safety around the opaque hash value
 * persisted by the Authentication aggregate.
 */
export class AuthenticationPasswordHash extends ValueObject<AuthenticationPasswordHashProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: string) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates an Authentication password hash value object.
   *
   * The supplied value is treated as an opaque cryptographic value.
   */
  public static create(value: string): AuthenticationPasswordHash {
    AuthenticationPasswordHash.validate(value);

    return new AuthenticationPasswordHash(value);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!value) {
      throw new Error('Authentication password hash is required.');
    }

    if (value.trim().length === 0) {
      throw new Error('Authentication password hash must not be empty.');
    }
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): string {
    return this.props.value;
  }

  // ---------------------------------------------------------------------------
  // Serialization
  // ---------------------------------------------------------------------------

  /**
   * Returns the persisted hash value.
   *
   * This should only be used by trusted infrastructure responsible for
   * persistence or password verification. The hash should never be exposed
   * through API response models or logs.
   */
  public override toString(): string {
    return this.props.value;
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { AuthenticationPasswordHashProps };
