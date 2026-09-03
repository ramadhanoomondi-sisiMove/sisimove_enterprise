// -----------------------------------------------------------------------------
// OTP Challenge Max Attempts
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface OtpChallengeMaxAttemptsProps {
  value: number;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Maximum number of verification attempts permitted for an OTP Challenge.
 *
 * Defines the security boundary for OTP verification attempts.
 *
 * The default value corresponds to the Authentication domain persistence
 * default of five attempts.
 *
 * Attempt consumption and challenge invalidation remain aggregate concerns.
 */
export class OtpChallengeMaxAttempts extends ValueObject<OtpChallengeMaxAttemptsProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly DEFAULT = 5;

  private static readonly MIN_VALUE = 1;

  private static readonly MAX_VALUE = Number.MAX_SAFE_INTEGER;

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: number) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates an OTP Challenge maximum-attempts value object.
   */
  public static create(value: number): OtpChallengeMaxAttempts {
    OtpChallengeMaxAttempts.validate(value);

    return new OtpChallengeMaxAttempts(value);
  }

  /**
   * Creates the default maximum-attempts value.
   */
  public static default(): OtpChallengeMaxAttempts {
    return new OtpChallengeMaxAttempts(OtpChallengeMaxAttempts.DEFAULT);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: number): void {
    if (!Number.isInteger(value)) {
      throw new Error('OTP Challenge max attempts must be an integer.');
    }

    if (value < OtpChallengeMaxAttempts.MIN_VALUE) {
      throw new Error(
        `OTP Challenge max attempts must be at least ${OtpChallengeMaxAttempts.MIN_VALUE}.`,
      );
    }

    if (value > OtpChallengeMaxAttempts.MAX_VALUE) {
      throw new Error(
        'OTP Challenge max attempts exceed the maximum safe integer.',
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Behavior
  // ---------------------------------------------------------------------------

  /**
   * Determines whether the supplied attempt count has reached the maximum.
   */
  public hasBeenReached(attempts: number): boolean {
    if (!Number.isInteger(attempts) || attempts < 0) {
      throw new Error('OTP Challenge attempts must be a non-negative integer.');
    }

    return attempts >= this.props.value;
  }

  /**
   * Determines whether another verification attempt is permitted.
   */
  public allowsAttempt(attempts: number): boolean {
    if (!Number.isInteger(attempts) || attempts < 0) {
      throw new Error('OTP Challenge attempts must be a non-negative integer.');
    }

    return attempts < this.props.value;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): number {
    return this.props.value;
  }

  // ---------------------------------------------------------------------------
  // Serialization
  // ---------------------------------------------------------------------------

  public override toString(): string {
    return this.props.value.toString();
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { OtpChallengeMaxAttemptsProps };
