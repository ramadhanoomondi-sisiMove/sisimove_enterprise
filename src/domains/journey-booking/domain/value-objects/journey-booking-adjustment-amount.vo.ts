// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyBookingAdjustmentAmountProps {
  value: number;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Additional pricing adjustment applied to the booking.
 *
 * Unlike a discount, an adjustment may either increase or decrease the
 * booking amount.
 *
 * Examples:
 *   positive -> surcharge
 *   negative -> reduction
 */
export class JourneyBookingAdjustmentAmount extends ValueObject<JourneyBookingAdjustmentAmountProps> {
  public constructor(value: number = 0) {
    JourneyBookingAdjustmentAmount.assertAmount(value);

    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Default
  // ---------------------------------------------------------------------------

  public static zero(): JourneyBookingAdjustmentAmount {
    return new JourneyBookingAdjustmentAmount(0);
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): number {
    return this.props.value;
  }

  // ---------------------------------------------------------------------------
  // Value
  // ---------------------------------------------------------------------------

  public toNumber(): number {
    return this.props.value;
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isPositive(): boolean {
    return this.props.value > 0;
  }

  public isNegative(): boolean {
    return this.props.value < 0;
  }

  public isZero(): boolean {
    return this.props.value === 0;
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static assertAmount(value: number): void {
    if (!Number.isInteger(value)) {
      throw new Error('Journey Booking adjustment amount must be an integer.');
    }
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyBookingAdjustmentAmountProps };
