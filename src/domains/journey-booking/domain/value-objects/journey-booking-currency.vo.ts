// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyBookingCurrencyProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const DEFAULT_JOURNEY_BOOKING_CURRENCY = 'KES';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * ISO 4217 currency code used by the Journey Booking pricing snapshot.
 *
 * The currency is persisted with the booking so historical pricing remains
 * independent of future platform currency configuration.
 */
export class JourneyBookingCurrency extends ValueObject<JourneyBookingCurrencyProps> {
  public constructor(value: string) {
    const normalized = value.trim().toUpperCase();

    JourneyBookingCurrency.assertCurrency(normalized);

    super({
      value: normalized,
    });
  }

  // ---------------------------------------------------------------------------
  // Default
  // ---------------------------------------------------------------------------

  public static default(): JourneyBookingCurrency {
    return new JourneyBookingCurrency(DEFAULT_JOURNEY_BOOKING_CURRENCY);
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): string {
    return this.props.value;
  }

  // ---------------------------------------------------------------------------
  // Value
  // ---------------------------------------------------------------------------

  public override toString(): string {
    return this.props.value;
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static assertCurrency(value: string): void {
    if (!value) {
      throw new Error('Journey Booking currency cannot be empty.');
    }

    if (!/^[A-Z]{3}$/.test(value)) {
      throw new Error(
        'Journey Booking currency must be a valid three-letter currency code.',
      );
    }
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyBookingCurrencyProps };
