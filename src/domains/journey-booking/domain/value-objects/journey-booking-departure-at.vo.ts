// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Scheduled departure time captured in the Journey Booking snapshot.
 *
 * The Date represents an absolute point in time.
 * Timezone interpretation is handled separately by JourneyBookingTimezone.
 */
export class JourneyBookingDepartureAt extends ValueObject<{
  value: Date;
}> {
  private constructor(value: Date) {
    super({ value: new Date(value.getTime()) });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(value: Date): JourneyBookingDepartureAt {
    if (Number.isNaN(value.getTime())) {
      throw new Error('Journey Booking departure time must be a valid date.');
    }

    return new JourneyBookingDepartureAt(value);
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

  public isBefore(other: JourneyBookingDepartureAt): boolean {
    return this.props.value.getTime() < other.value.getTime();
  }

  public isAfter(other: JourneyBookingDepartureAt): boolean {
    return this.props.value.getTime() > other.value.getTime();
  }
}
