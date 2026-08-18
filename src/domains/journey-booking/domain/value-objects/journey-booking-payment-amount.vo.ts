// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyBookingPaymentAmountProps {
  value: number;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Monetary amount associated with a Journey Booking payment.
 *
 * Monetary values follow the same integer representation used by the
 * Journey Booking persistence model.
 */
export class JourneyBookingPaymentAmount extends ValueObject<JourneyBookingPaymentAmountProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value: number) {
    JourneyBookingPaymentAmount.assertAmount(value);

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
      throw new Error('Journey Booking payment amount must be an integer.');
    }

    if (value < 0) {
      throw new Error('Journey Booking payment amount cannot be negative.');
    }
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyBookingPaymentAmountProps };
