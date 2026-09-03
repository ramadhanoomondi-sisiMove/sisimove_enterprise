// -----------------------------------------------------------------------------
// Authentication Password Changed At
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface AuthenticationPasswordChangedAtProps {
  value: Date;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Timestamp representing when the Authentication password was last changed.
 *
 * This value is used to record the effective time of the most recent password
 * change or password reset.
 *
 * The value is optional at the aggregate level because a newly created
 * Authentication may not have had a password assigned yet.
 *
 * The value object itself always represents a valid, concrete timestamp.
 */
export class AuthenticationPasswordChangedAt extends ValueObject<AuthenticationPasswordChangedAtProps> {
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
   * Creates an Authentication password-changed timestamp.
   *
   * A defensive Date copy is created so callers cannot mutate the value
   * object through the original Date instance.
   */
  public static create(value: Date): AuthenticationPasswordChangedAt {
    const normalized = AuthenticationPasswordChangedAt.normalize(value);

    AuthenticationPasswordChangedAt.validate(normalized);

    return new AuthenticationPasswordChangedAt(normalized);
  }

  // ---------------------------------------------------------------------------
  // Normalization
  // ---------------------------------------------------------------------------

  private static normalize(value: Date): Date {
    if (!(value instanceof Date)) {
      throw new Error('Authentication password changed at must be a Date.');
    }

    return new Date(value.getTime());
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: Date): void {
    if (Number.isNaN(value.getTime())) {
      throw new Error(
        'Authentication password changed at must be a valid date.',
      );
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

export type { AuthenticationPasswordChangedAtProps };
