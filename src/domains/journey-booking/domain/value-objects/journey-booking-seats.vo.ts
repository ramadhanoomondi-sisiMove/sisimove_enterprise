// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_JOURNEY_BOOKING_SEATS = 1;

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Number of seats booked by the passenger.
 *
 * A Journey Booking must contain at least one seat.
 */
export class JourneyBookingSeats extends ValueObject<{
  value: number;
}> {
  private constructor(value: number) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(value: number): JourneyBookingSeats {
    if (!Number.isInteger(value)) {
      throw new Error('Journey Booking seats must be an integer.');
    }

    if (value < MIN_JOURNEY_BOOKING_SEATS) {
      throw new Error(
        `Journey Booking seats must be at least ${MIN_JOURNEY_BOOKING_SEATS}.`,
      );
    }

    return new JourneyBookingSeats(value);
  }

  // ---------------------------------------------------------------------------
  // Defaults
  // ---------------------------------------------------------------------------

  public static default(): JourneyBookingSeats {
    return new JourneyBookingSeats(MIN_JOURNEY_BOOKING_SEATS);
  }

  // ---------------------------------------------------------------------------
  // Accessors
  // ---------------------------------------------------------------------------

  public get value(): number {
    return this.props.value;
  }

  public toNumber(): number {
    return this.props.value;
  }

  // ---------------------------------------------------------------------------
  // Comparisons
  // ---------------------------------------------------------------------------

  public isGreaterThan(other: JourneyBookingSeats): boolean {
    return this.props.value > other.value;
  }

  public isLessThan(other: JourneyBookingSeats): boolean {
    return this.props.value < other.value;
  }

  public isEqualTo(other: JourneyBookingSeats): boolean {
    return this.props.value === other.value;
  }
}
