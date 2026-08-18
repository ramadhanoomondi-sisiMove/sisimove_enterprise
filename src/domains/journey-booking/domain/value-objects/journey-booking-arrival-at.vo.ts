// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Optional scheduled arrival time captured in the Journey Booking snapshot.
 *
 * The value represents an absolute point in time.
 */
export class JourneyBookingArrivalAt extends ValueObject<{
  value: Date;
}> {
  private constructor(value: Date) {
    super({ value: new Date(value.getTime()) });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(value: Date): JourneyBookingArrivalAt {
    if (Number.isNaN(value.getTime())) {
      throw new Error('Journey Booking arrival time must be a valid date.');
    }

    return new JourneyBookingArrivalAt(value);
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): Date {
    return new Date(this.props.value.getTime());
  }

  public toDate(): Date {
    return new Date(this.props.value.getTime());
  }

  public isBefore(other: JourneyBookingArrivalAt): boolean {
    return this.props.value.getTime() < other.value.getTime();
  }

  public isAfter(other: JourneyBookingArrivalAt): boolean {
    return this.props.value.getTime() > other.value.getTime();
  }
}
