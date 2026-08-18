// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const DEFAULT_JOURNEY_BOOKING_TIMEZONE = 'Africa/Nairobi';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * IANA timezone captured with the Journey Booking snapshot.
 *
 * Example:
 * `Africa/Nairobi`
 */
export class JourneyBookingTimezone extends ValueObject<{
  value: string;
}> {
  private constructor(value: string) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(value: string): JourneyBookingTimezone {
    const normalized = value.trim();

    if (!normalized) {
      throw new Error('Journey Booking timezone cannot be empty.');
    }

    if (!JourneyBookingTimezone.isValid(normalized)) {
      throw new Error(`Invalid Journey Booking timezone: ${value}`);
    }

    return new JourneyBookingTimezone(normalized);
  }

  // ---------------------------------------------------------------------------
  // Defaults
  // ---------------------------------------------------------------------------

  public static default(): JourneyBookingTimezone {
    return new JourneyBookingTimezone(DEFAULT_JOURNEY_BOOKING_TIMEZONE);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  public static isValid(value: string): boolean {
    try {
      Intl.DateTimeFormat('en-US', {
        timeZone: value,
      });

      return true;
    } catch {
      return false;
    }
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): string {
    return this.props.value;
  }

  public override toString(): string {
    return this.props.value;
  }
}
