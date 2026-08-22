// -----------------------------------------------------------------------------
// Commercial Booking Commission Base Amount
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface CommercialBookingCommissionBaseAmountProps {
  value: number;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_BASE_AMOUNT = 0;

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Base monetary amount used to calculate a Commercial Booking Commission.
 *
 * Represents the booking amount before the Commercial booking commission
 * is applied.
 *
 * The amount is expressed as an integer in the smallest monetary unit
 * supported by the domain.
 *
 * For example, for KES:
 *
 * 1000 = KES 1,000
 */
export class CommercialBookingCommissionBaseAmount extends ValueObject<CommercialBookingCommissionBaseAmountProps> {
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
   * Creates a booking commission base amount.
   *
   * The amount must be a finite, non-negative integer.
   */
  public static create(value: number): CommercialBookingCommissionBaseAmount {
    CommercialBookingCommissionBaseAmount.validate(value);

    return new CommercialBookingCommissionBaseAmount(value);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: number): void {
    if (!Number.isFinite(value)) {
      throw new Error(
        'Commercial Booking Commission base amount must be a finite number',
      );
    }

    if (!Number.isInteger(value)) {
      throw new Error(
        'Commercial Booking Commission base amount must be an integer',
      );
    }

    if (value < MIN_BASE_AMOUNT) {
      throw new Error(
        'Commercial Booking Commission base amount cannot be negative',
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isZero(): boolean {
    return this.props.value === 0;
  }

  public isPositive(): boolean {
    return this.props.value > 0;
  }

  public isNonNegative(): boolean {
    return this.props.value >= MIN_BASE_AMOUNT;
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
// Exported Constants
// -----------------------------------------------------------------------------

export { MIN_BASE_AMOUNT as COMMERCIAL_BOOKING_COMMISSION_BASE_AMOUNT_MIN };

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { CommercialBookingCommissionBaseAmountProps };
