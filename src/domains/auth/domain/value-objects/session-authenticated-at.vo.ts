// -----------------------------------------------------------------------------
// Session Authenticated At
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface SessionAuthenticatedAtProps {
  value: Date;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Timestamp representing when a Session was successfully authenticated.
 *
 * This records the point in time at which the Session was established
 * following successful authentication.
 *
 * The value is mandatory for a Session because every Session represents an
 * authenticated session.
 */
export class SessionAuthenticatedAt extends ValueObject<SessionAuthenticatedAtProps> {
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
   * Creates a Session authenticated-at value object.
   *
   * A defensive Date copy is created so callers cannot mutate the value object
   * through the original Date instance.
   */
  public static create(value: Date): SessionAuthenticatedAt {
    const normalized = SessionAuthenticatedAt.normalize(value);

    SessionAuthenticatedAt.validate(normalized);

    return new SessionAuthenticatedAt(normalized);
  }

  // ---------------------------------------------------------------------------
  // Normalization
  // ---------------------------------------------------------------------------

  private static normalize(value: Date): Date {
    if (!(value instanceof Date)) {
      throw new Error('Session authenticated at must be a Date.');
    }

    return new Date(value.getTime());
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: Date): void {
    if (Number.isNaN(value.getTime())) {
      throw new Error('Session authenticated at must be a valid date.');
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

export type { SessionAuthenticatedAtProps };
