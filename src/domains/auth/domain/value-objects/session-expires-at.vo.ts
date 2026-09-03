// -----------------------------------------------------------------------------
// Session Expires At
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface SessionExpiresAtProps {
  value: Date;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Timestamp representing when a Session expires.
 *
 * The expiration timestamp defines the point in time after which the Session
 * is no longer valid.
 *
 * The value is mandatory for a Session and must represent a concrete,
 * valid point in time.
 */
export class SessionExpiresAt extends ValueObject<SessionExpiresAtProps> {
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
   * Creates a Session expiration timestamp value object.
   *
   * A defensive Date copy is created so callers cannot mutate the value object
   * through the original Date instance.
   */
  public static create(value: Date): SessionExpiresAt {
    const normalized = SessionExpiresAt.normalize(value);

    SessionExpiresAt.validate(normalized);

    return new SessionExpiresAt(normalized);
  }

  // ---------------------------------------------------------------------------
  // Normalization
  // ---------------------------------------------------------------------------

  private static normalize(value: Date): Date {
    if (!(value instanceof Date)) {
      throw new Error('Session expires at must be a Date.');
    }

    return new Date(value.getTime());
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: Date): void {
    if (Number.isNaN(value.getTime())) {
      throw new Error('Session expires at must be a valid date.');
    }
  }

  // ---------------------------------------------------------------------------
  // State Checks
  // ---------------------------------------------------------------------------

  /**
   * Determines whether the Session has reached or passed its expiration time.
   */
  public isExpired(referenceDate: Date = new Date()): boolean {
    return this.props.value.getTime() <= referenceDate.getTime();
  }

  /**
   * Determines whether the Session has not yet reached its expiration time.
   */
  public isActive(referenceDate: Date = new Date()): boolean {
    return !this.isExpired(referenceDate);
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  /**
   * Returns a defensive copy of the expiration timestamp.
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

export type { SessionExpiresAtProps };
