// -----------------------------------------------------------------------------
// Authentication Locked Until
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface AuthenticationLockedUntilProps {
  value: Date;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Timestamp representing when the current Authentication lock expires.
 *
 * The value is optional at the Authentication aggregate level because an
 * Authentication may be locked indefinitely or may not currently be locked.
 *
 * The value object itself always represents a concrete, valid timestamp.
 */
export class AuthenticationLockedUntil extends ValueObject<AuthenticationLockedUntilProps> {
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
   * Creates an Authentication locked-until value object.
   *
   * A defensive Date copy is created so callers cannot mutate the value object
   * through the original Date instance.
   */
  public static create(value: Date): AuthenticationLockedUntil {
    const normalized = AuthenticationLockedUntil.normalize(value);

    AuthenticationLockedUntil.validate(normalized);

    return new AuthenticationLockedUntil(normalized);
  }

  // ---------------------------------------------------------------------------
  // Normalization
  // ---------------------------------------------------------------------------

  private static normalize(value: Date): Date {
    if (!(value instanceof Date)) {
      throw new Error('Authentication locked until must be a Date.');
    }

    return new Date(value.getTime());
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: Date): void {
    if (Number.isNaN(value.getTime())) {
      throw new Error('Authentication locked until must be a valid date.');
    }
  }

  // ---------------------------------------------------------------------------
  // State Checks
  // ---------------------------------------------------------------------------

  /**
   * Determines whether the lock expiry time has already passed.
   */
  public isExpired(referenceDate: Date = new Date()): boolean {
    return this.props.value.getTime() <= referenceDate.getTime();
  }

  /**
   * Determines whether the lock is still active.
   */
  public isActive(referenceDate: Date = new Date()): boolean {
    return !this.isExpired(referenceDate);
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

export type { AuthenticationLockedUntilProps };
