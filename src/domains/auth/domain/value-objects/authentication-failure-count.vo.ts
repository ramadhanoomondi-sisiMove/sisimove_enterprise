// -----------------------------------------------------------------------------
// Authentication Failure Count
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface AuthenticationFailureCountProps {
  value: number;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Number of consecutive failed authentication attempts associated with an
 * Authentication.
 *
 * The count is used by the Authentication aggregate to support authentication
 * failure tracking and account-locking policies.
 *
 * The value must always be a non-negative integer.
 */
export class AuthenticationFailureCount extends ValueObject<AuthenticationFailureCountProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly INITIAL = 0;

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
   * Creates an Authentication failure count value object.
   */
  public static create(value: number): AuthenticationFailureCount {
    AuthenticationFailureCount.validate(value);

    return new AuthenticationFailureCount(value);
  }

  /**
   * Creates the initial failure count.
   */
  public static initial(): AuthenticationFailureCount {
    return new AuthenticationFailureCount(AuthenticationFailureCount.INITIAL);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: number): void {
    if (!Number.isInteger(value)) {
      throw new Error('Authentication failure count must be an integer.');
    }

    if (value < AuthenticationFailureCount.INITIAL) {
      throw new Error('Authentication failure count cannot be negative.');
    }
  }

  // ---------------------------------------------------------------------------
  // Operations
  // ---------------------------------------------------------------------------

  /**
   * Returns a new failure count incremented by one.
   */
  public increment(): AuthenticationFailureCount {
    return new AuthenticationFailureCount(this.props.value + 1);
  }

  /**
   * Returns a new failure count reset to zero.
   */
  public reset(): AuthenticationFailureCount {
    return new AuthenticationFailureCount(AuthenticationFailureCount.INITIAL);
  }

  // ---------------------------------------------------------------------------
  // State Checks
  // ---------------------------------------------------------------------------

  public isZero(): boolean {
    return this.props.value === AuthenticationFailureCount.INITIAL;
  }

  public isPositive(): boolean {
    return this.props.value > AuthenticationFailureCount.INITIAL;
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
    return String(this.props.value);
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { AuthenticationFailureCountProps };
