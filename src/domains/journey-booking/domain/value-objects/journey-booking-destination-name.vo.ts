// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MAX_DESTINATION_NAME_LENGTH = 200;

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Destination name captured in the Journey Booking snapshot.
 *
 * This represents the human-readable destination at booking time.
 */
export class JourneyBookingDestinationName extends ValueObject<{
  value: string;
}> {
  private constructor(value: string) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(value: string): JourneyBookingDestinationName {
    const normalized = value.trim();

    if (!normalized) {
      throw new Error('Journey Booking destination name cannot be empty.');
    }

    if (normalized.length > MAX_DESTINATION_NAME_LENGTH) {
      throw new Error(
        `Journey Booking destination name cannot exceed ${MAX_DESTINATION_NAME_LENGTH} characters.`,
      );
    }

    return new JourneyBookingDestinationName(normalized);
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
