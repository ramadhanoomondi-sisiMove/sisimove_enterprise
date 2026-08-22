// -----------------------------------------------------------------------------
// Commercial Booking Commission Percentage
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface CommercialBookingCommissionPercentageProps {
  value: number;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_PERCENTAGE = 0;
const MAX_PERCENTAGE = 100;

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Commission percentage applied to a Commercial Booking Commission.
 *
 * Represents the percentage snapshot used when the booking commission
 * is assessed.
 *
 * The value is expressed as a percentage rather than a fractional rate.
 *
 * Examples:
 *
 * 5    = 5%
 * 10   = 10%
 * 12.5 = 12.5%
 */
export class CommercialBookingCommissionPercentage extends ValueObject<CommercialBookingCommissionPercentageProps> {
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
   * Creates a booking commission percentage.
   *
   * The supplied value must be finite and fall within the inclusive
   * range of 0% to 100%.
   */
  public static create(value: number): CommercialBookingCommissionPercentage {
    CommercialBookingCommissionPercentage.validate(value);

    return new CommercialBookingCommissionPercentage(value);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: number): void {
    if (!Number.isFinite(value)) {
      throw new Error(
        'Commercial Booking Commission percentage must be a finite number',
      );
    }

    if (value < MIN_PERCENTAGE || value > MAX_PERCENTAGE) {
      throw new Error(
        `Commercial Booking Commission percentage must be between ${MIN_PERCENTAGE} and ${MAX_PERCENTAGE}`,
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

  public isFull(): boolean {
    return this.props.value === 100;
  }

  public isWithinRange(): boolean {
    return (
      this.props.value >= MIN_PERCENTAGE && this.props.value <= MAX_PERCENTAGE
    );
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

export {
  MIN_PERCENTAGE as COMMERCIAL_BOOKING_COMMISSION_PERCENTAGE_MIN,
  MAX_PERCENTAGE as COMMERCIAL_BOOKING_COMMISSION_PERCENTAGE_MAX,
};

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { CommercialBookingCommissionPercentageProps };
