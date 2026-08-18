// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyBookingDiscountAmountProps {
  value: number;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Discount amount applied to the booking subtotal.
 *
 * A discount can only reduce the booking amount and therefore cannot be
 * negative.
 */
export class JourneyBookingDiscountAmount extends ValueObject<JourneyBookingDiscountAmountProps> {
  public constructor(value: number = 0) {
    JourneyBookingDiscountAmount.assertAmount(value);

    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Default
  // ---------------------------------------------------------------------------

  public static zero(): JourneyBookingDiscountAmount {
    return new JourneyBookingDiscountAmount(0);
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
      throw new Error('Journey Booking discount amount must be an integer.');
    }

    if (value < 0) {
      throw new Error('Journey Booking discount amount cannot be negative.');
    }
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyBookingDiscountAmountProps };
