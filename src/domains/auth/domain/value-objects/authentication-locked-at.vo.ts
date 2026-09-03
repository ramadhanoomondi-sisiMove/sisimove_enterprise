// -----------------------------------------------------------------------------
// Authentication Locked At
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface AuthenticationLockedAtProps {
  value: Date;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Timestamp representing when an Authentication was locked.
 *
 * The value is optional at the Authentication aggregate level because an
 * Authentication does not necessarily have a lock applied.
 *
 * The value object itself always represents a concrete, valid timestamp.
 */
export class AuthenticationLockedAt extends ValueObject<AuthenticationLockedAtProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: Date) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates an Authentication locked-at value object.
   *
   * A defensive Date copy is created so callers cannot mutate the value object
   * through the original Date instance.
   */
  public static create(value: Date): AuthenticationLockedAt {
    const normalized = AuthenticationLockedAt.normalize(value);

    AuthenticationLockedAt.validate(normalized);

    return new AuthenticationLockedAt(normalized);
  }

  // ---------------------------------------------------------------------------
  // Normalization
  // ---------------------------------------------------------------------------

  private static normalize(value: Date): Date {
    if (!(value instanceof Date)) {
      throw new Error('Authentication locked at must be a Date.');
    }

    return new Date(value.getTime());
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: Date): void {
    if (Number.isNaN(value.getTime())) {
      throw new Error('Authentication locked at must be a valid date.');
    }
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  /**
   * Returns a defensive copy of the timestamp.
   */
  public get value(): Date {
    return new Date(this.props.value.getTime());
  }

  // ---------------------------------------------------------------------------
  // Serialization
  // ---------------------------------------------------------------------------

  public override toString(): string {
    return this.props.value.toISOString();
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { AuthenticationLockedAtProps };
