// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Values
// -----------------------------------------------------------------------------

export const JOURNEY_BOOKING_CANCELLATION_REASONS = [
  'PASSENGER_REQUEST',
  'PROVIDER_REQUEST',
  'JOURNEY_CANCELLED',
  'NO_SHOW',
  'SYSTEM',
  'OTHER',
] as const;

export type JourneyBookingCancellationReasonValue =
  (typeof JOURNEY_BOOKING_CANCELLATION_REASONS)[number];

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyBookingCancellationReasonProps {
  value: JourneyBookingCancellationReasonValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Reason for cancelling a Journey Booking.
 */
export class JourneyBookingCancellationReason extends ValueObject<JourneyBookingCancellationReasonProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: JourneyBookingCancellationReasonValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(value: string): JourneyBookingCancellationReason {
    const normalized = value.trim().toUpperCase();

    if (!JourneyBookingCancellationReason.isValid(normalized)) {
      throw new Error(`Invalid Journey Booking cancellation reason: ${value}`);
    }

    return new JourneyBookingCancellationReason(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  public static isValid(
    value: string,
  ): value is JourneyBookingCancellationReasonValue {
    return JOURNEY_BOOKING_CANCELLATION_REASONS.includes(
      value as JourneyBookingCancellationReasonValue,
    );
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isPassengerRequest(): boolean {
    return this.props.value === 'PASSENGER_REQUEST';
  }

  public isProviderRequest(): boolean {
    return this.props.value === 'PROVIDER_REQUEST';
  }

  public isJourneyCancelled(): boolean {
    return this.props.value === 'JOURNEY_CANCELLED';
  }

  public isNoShow(): boolean {
    return this.props.value === 'NO_SHOW';
  }

  public isSystem(): boolean {
    return this.props.value === 'SYSTEM';
  }

  public isOther(): boolean {
    return this.props.value === 'OTHER';
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): JourneyBookingCancellationReasonValue {
    return this.props.value;
  }

  public override toString(): string {
    return this.props.value;
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyBookingCancellationReasonProps };
