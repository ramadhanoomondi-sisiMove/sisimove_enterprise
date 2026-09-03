// -----------------------------------------------------------------------------
// OTP Challenge Expires At
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface OtpChallengeExpiresAtProps {
  value: Date;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Timestamp representing when an OTP Challenge expires.
 *
 * The expiration timestamp defines the point in time after which the OTP
 * Challenge can no longer be successfully verified.
 *
 * The value is mandatory for an OTP Challenge and must represent a concrete,
 * valid point in time.
 */
export class OtpChallengeExpiresAt extends ValueObject<OtpChallengeExpiresAtProps> {
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
   * Creates an OTP Challenge expiration timestamp value object.
   *
   * A defensive Date copy is created so callers cannot mutate the value object
   * through the original Date instance.
   */
  public static create(value: Date): OtpChallengeExpiresAt {
    const normalized = OtpChallengeExpiresAt.normalize(value);

    OtpChallengeExpiresAt.validate(normalized);

    return new OtpChallengeExpiresAt(normalized);
  }

  // ---------------------------------------------------------------------------
  // Normalization
  // ---------------------------------------------------------------------------

  private static normalize(value: Date): Date {
    if (!(value instanceof Date)) {
      throw new Error('OTP Challenge expires at must be a Date.');
    }

    return new Date(value.getTime());
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: Date): void {
    if (Number.isNaN(value.getTime())) {
      throw new Error('OTP Challenge expires at must be a valid date.');
    }
  }

  // ---------------------------------------------------------------------------
  // State Checks
  // ---------------------------------------------------------------------------

  /**
   * Determines whether the OTP Challenge has reached or passed its
   * expiration timestamp.
   */
  public isExpired(referenceDate: Date = new Date()): boolean {
    if (!(referenceDate instanceof Date)) {
      throw new Error('Reference date must be a Date.');
    }

    if (Number.isNaN(referenceDate.getTime())) {
      throw new Error('Reference date must be a valid date.');
    }

    return this.props.value.getTime() <= referenceDate.getTime();
  }

  /**
   * Determines whether the OTP Challenge has not yet reached its expiration
   * timestamp.
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

export type { OtpChallengeExpiresAtProps };
