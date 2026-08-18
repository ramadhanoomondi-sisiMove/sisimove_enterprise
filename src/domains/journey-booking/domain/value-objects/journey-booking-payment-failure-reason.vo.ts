// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyBookingPaymentFailureReasonProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MAX_PAYMENT_FAILURE_REASON_LENGTH = 500;

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Human-readable reason explaining why a Journey Booking payment failed.
 *
 * This is informational state captured from the payment flow. It must not
 * contain sensitive payment credentials, card data, authentication secrets,
 * or other sensitive transaction information.
 */
export class JourneyBookingPaymentFailureReason extends ValueObject<JourneyBookingPaymentFailureReasonProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: string) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(value: string): JourneyBookingPaymentFailureReason {
    const normalized = value.trim();

    JourneyBookingPaymentFailureReason.assertValue(normalized);

    return new JourneyBookingPaymentFailureReason(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static assertValue(value: string): void {
    if (!value) {
      throw new Error(
        'Journey Booking payment failure reason cannot be empty.',
      );
    }

    if (value.length > MAX_PAYMENT_FAILURE_REASON_LENGTH) {
      throw new Error(
        `Journey Booking payment failure reason cannot exceed ${MAX_PAYMENT_FAILURE_REASON_LENGTH} characters.`,
      );
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

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyBookingPaymentFailureReasonProps };
