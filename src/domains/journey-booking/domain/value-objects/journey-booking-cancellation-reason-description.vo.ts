// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyBookingCancellationReasonDescriptionProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MAX_CANCELLATION_REASON_DESCRIPTION_LENGTH = 1000;

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Optional human-readable explanation accompanying a cancellation reason.
 */
export class JourneyBookingCancellationReasonDescription extends ValueObject<JourneyBookingCancellationReasonDescriptionProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: string) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(
    value: string,
  ): JourneyBookingCancellationReasonDescription {
    const normalized = value.trim();

    JourneyBookingCancellationReasonDescription.assertValue(normalized);

    return new JourneyBookingCancellationReasonDescription(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static assertValue(value: string): void {
    if (!value) {
      throw new Error(
        'Journey Booking cancellation reason description cannot be empty.',
      );
    }

    if (value.length > MAX_CANCELLATION_REASON_DESCRIPTION_LENGTH) {
      throw new Error(
        `Journey Booking cancellation reason description cannot exceed ${MAX_CANCELLATION_REASON_DESCRIPTION_LENGTH} characters.`,
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

export type { JourneyBookingCancellationReasonDescriptionProps };
