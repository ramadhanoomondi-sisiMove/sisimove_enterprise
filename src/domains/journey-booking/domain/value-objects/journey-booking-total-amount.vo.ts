// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyBookingTotalAmountProps {
  value: number;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Final amount payable for the Journey Booking.
 */
export class JourneyBookingTotalAmount extends ValueObject<JourneyBookingTotalAmountProps> {
  public constructor(value: number) {
    JourneyBookingTotalAmount.assertAmount(value);

    super({ value });
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
  // Validation
  // ---------------------------------------------------------------------------

  private static assertAmount(value: number): void {
    if (!Number.isInteger(value)) {
      throw new Error('Journey Booking total amount must be an integer.');
    }

    if (value < 0) {
      throw new Error('Journey Booking total amount cannot be negative.');
    }
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyBookingTotalAmountProps };
