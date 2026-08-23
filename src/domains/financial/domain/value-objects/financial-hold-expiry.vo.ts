// -----------------------------------------------------------------------------
// Financial Hold Expiry
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialHoldExpiryProps {
  value: Date;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Expiration point of a Financial Account Hold.
 *
 * Represents the date and time after which an active hold is eligible
 * for expiration and release according to Financial domain policy.
 *
 * The expiry is optional at the entity level; this value object represents
 * only a valid expiry timestamp when one is defined.
 */
export class FinancialHoldExpiry extends ValueObject<FinancialHoldExpiryProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: Date) {
    super({
      value: new Date(value.getTime()),
    });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Financial Hold expiry.
   *
   * The supplied Date must represent a valid point in time.
   */
  public static create(value: Date): FinancialHoldExpiry {
    const normalized = new Date(value.getTime());

    FinancialHoldExpiry.validate(normalized);

    return new FinancialHoldExpiry(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: Date): void {
    if (Number.isNaN(value.getTime())) {
      throw new Error('Financial hold expiry must be a valid date');
    }
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  /**
   * Determines whether the hold has expired relative to the supplied
   * point in time.
   *
   * Defaults to the current time.
   */
  public isExpired(at: Date = new Date()): boolean {
    return this.props.value.getTime() <= at.getTime();
  }

  /**
   * Determines whether the hold is still active relative to the supplied
   * point in time.
   */
  public isActive(at: Date = new Date()): boolean {
    return !this.isExpired(at);
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

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

export type { FinancialHoldExpiryProps };
