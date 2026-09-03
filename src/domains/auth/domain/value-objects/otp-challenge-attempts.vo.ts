// -----------------------------------------------------------------------------
// OTP Challenge Attempts
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface OtpChallengeAttemptsProps {
  value: number;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Number of verification attempts made against an OTP Challenge.
 *
 * Represents the number of OTP verification attempts consumed by the
 * challenge.
 *
 * Attempts are incremented by the OTP Challenge aggregate when verification
 * fails. The value must never be negative.
 */
export class OtpChallengeAttempts extends ValueObject<OtpChallengeAttemptsProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly INITIAL = 0;

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
   * Creates an OTP Challenge attempts value object.
   */
  public static create(value: number): OtpChallengeAttempts {
    OtpChallengeAttempts.validate(value);

    return new OtpChallengeAttempts(value);
  }

  /**
   * Creates an attempts value representing a newly issued OTP Challenge.
   */
  public static initial(): OtpChallengeAttempts {
    return new OtpChallengeAttempts(OtpChallengeAttempts.INITIAL);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: number): void {
    if (!Number.isInteger(value)) {
      throw new Error('OTP Challenge attempts must be an integer.');
    }

    if (value < 0) {
      throw new Error('OTP Challenge attempts cannot be negative.');
    }

    if (value > OtpChallengeAttempts.MAX_VALUE) {
      throw new Error(
        'OTP Challenge attempts exceed the maximum safe integer.',
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Behavior
  // ---------------------------------------------------------------------------

  /**
   * Returns a new value object with one additional verification attempt.
   */
  public increment(): OtpChallengeAttempts {
    if (this.props.value >= OtpChallengeAttempts.MAX_VALUE) {
      throw new Error(
        'OTP Challenge attempts cannot be incremented beyond the maximum safe integer.',
      );
    }

    return new OtpChallengeAttempts(this.props.value + 1);
  }

  /**
   * Determines whether at least one verification attempt has been consumed.
   */
  public hasAttempts(): boolean {
    return this.props.value > 0;
  }

  /**
   * Determines whether the attempt count has reached the supplied maximum.
   */
  public hasReached(maxAttempts: number): boolean {
    if (!Number.isInteger(maxAttempts) || maxAttempts < 0) {
      throw new Error(
        'Maximum OTP Challenge attempts must be a non-negative integer.',
      );
    }

    return this.props.value >= maxAttempts;
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

export type { OtpChallengeAttemptsProps };
