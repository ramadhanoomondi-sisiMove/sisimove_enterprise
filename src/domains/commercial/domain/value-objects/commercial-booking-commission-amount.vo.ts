// -----------------------------------------------------------------------------
// Commercial Booking Commission Amount
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface CommercialBookingCommissionAmountProps {
  value: number;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_COMMISSION_AMOUNT = 0;

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Monetary commission amount assessed against a Booking.
 *
 * Represents the actual Commercial booking commission amount produced by
 * the applicable commercial commission rule.
 *
 * The amount is expressed as an integer in the smallest monetary unit
 * supported by the domain.
 *
 * For example, for KES:
 *
 * 150 = KES 150
 *
 * This value is an immutable historical assessment snapshot.
 *
 * It must not be recalculated from the current Commercial Commission Rule
 * after the commission assessment has been created.
 */
export class CommercialBookingCommissionAmount extends ValueObject<CommercialBookingCommissionAmountProps> {
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
   * Creates a Commercial Booking Commission Amount.
   *
   * The amount must be a finite, non-negative integer.
   */
  public static create(value: number): CommercialBookingCommissionAmount {
    CommercialBookingCommissionAmount.validate(value);

    return new CommercialBookingCommissionAmount(value);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: number): void {
    if (!Number.isFinite(value)) {
      throw new Error(
        'Commercial Booking Commission amount must be a finite number',
      );
    }

    if (!Number.isInteger(value)) {
      throw new Error(
        'Commercial Booking Commission amount must be an integer',
      );
    }

    if (value < MIN_COMMISSION_AMOUNT) {
      throw new Error(
        'Commercial Booking Commission amount cannot be negative',
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  /**
   * Determines whether the commission amount is zero.
   */
  public isZero(): boolean {
    return this.props.value === 0;
  }

  /**
   * Determines whether the commission amount is greater than zero.
   */
  public isPositive(): boolean {
    return this.props.value > 0;
  }

  /**
   * Determines whether the commission amount is non-negative.
   */
  public isNonNegative(): boolean {
    return this.props.value >= MIN_COMMISSION_AMOUNT;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  /**
   * Returns the commission amount in the smallest monetary unit.
   */
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
// Exported Constants
// -----------------------------------------------------------------------------

export { MIN_COMMISSION_AMOUNT as COMMERCIAL_BOOKING_COMMISSION_AMOUNT_MIN };

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { CommercialBookingCommissionAmountProps };
