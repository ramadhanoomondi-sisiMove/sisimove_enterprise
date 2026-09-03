// -----------------------------------------------------------------------------
// Authentication Last Failed At
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface AuthenticationLastFailedAtProps {
  value: Date;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Timestamp representing the most recent failed authentication attempt.
 *
 * The value is optional at the Authentication aggregate level because an
 * Authentication may not have experienced a failed authentication attempt.
 *
 * The value object itself always represents a concrete, valid timestamp.
 */
export class AuthenticationLastFailedAt extends ValueObject<AuthenticationLastFailedAtProps> {
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
   * Creates an Authentication last-failed-at value object.
   *
   * A defensive Date copy is created so callers cannot mutate the value object
   * through the original Date instance.
   */
  public static create(value: Date): AuthenticationLastFailedAt {
    const normalized = AuthenticationLastFailedAt.normalize(value);

    AuthenticationLastFailedAt.validate(normalized);

    return new AuthenticationLastFailedAt(normalized);
  }

  // ---------------------------------------------------------------------------
  // Normalization
  // ---------------------------------------------------------------------------

  private static normalize(value: Date): Date {
    if (!(value instanceof Date)) {
      throw new Error('Authentication last failed at must be a Date.');
    }

    return new Date(value.getTime());
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: Date): void {
    if (Number.isNaN(value.getTime())) {
      throw new Error('Authentication last failed at must be a valid date.');
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

export type { AuthenticationLastFailedAtProps };
