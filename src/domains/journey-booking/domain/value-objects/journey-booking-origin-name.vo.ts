// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MAX_ORIGIN_NAME_LENGTH = 200;

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Origin name captured in the Journey Booking snapshot.
 *
 * This represents the human-readable origin at booking time.
 */
export class JourneyBookingOriginName extends ValueObject<{
  value: string;
}> {
  private constructor(value: string) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(value: string): JourneyBookingOriginName {
    const normalized = value.trim();

    if (!normalized) {
      throw new Error('Journey Booking origin name cannot be empty.');
    }

    if (normalized.length > MAX_ORIGIN_NAME_LENGTH) {
      throw new Error(
        `Journey Booking origin name cannot exceed ${MAX_ORIGIN_NAME_LENGTH} characters.`,
      );
    }

    return new JourneyBookingOriginName(normalized);
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
