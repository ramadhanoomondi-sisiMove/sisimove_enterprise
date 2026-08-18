// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyBookingSubtotalProps {
  value: number;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Booking subtotal before discounts and adjustments.
 */
export class JourneyBookingSubtotal extends ValueObject<JourneyBookingSubtotalProps> {
  public constructor(value: number) {
    JourneyBookingSubtotal.assertAmount(value);

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
      throw new Error('Journey Booking subtotal must be an integer.');
    }

    if (value < 0) {
      throw new Error('Journey Booking subtotal cannot be negative.');
    }
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyBookingSubtotalProps };
