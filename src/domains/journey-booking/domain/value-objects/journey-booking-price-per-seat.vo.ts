// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyBookingPricePerSeatProps {
  value: number;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Price charged for one booked seat.
 *
 * Monetary values in Journey Booking are represented as integer minor units
 * according to the booking currency's monetary convention.
 *
 * For KES this corresponds to whole Kenyan shillings because the persistence
 * model stores monetary values as Int.
 */
export class JourneyBookingPricePerSeat extends ValueObject<JourneyBookingPricePerSeatProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value: number) {
    JourneyBookingPricePerSeat.assertAmount(value);

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
      throw new Error('Journey Booking price per seat must be an integer.');
    }

    if (value < 0) {
      throw new Error('Journey Booking price per seat cannot be negative.');
    }
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyBookingPricePerSeatProps };
