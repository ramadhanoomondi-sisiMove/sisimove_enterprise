// src/domains/journey-booking/domain/value-objects/journey-booking-status.vo.ts

// -----------------------------------------------------------------------------
// Journey Booking — Status Value Object
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export const JOURNEY_BOOKING_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'CANCELLED',
  'COMPLETED',
  'EXPIRED',
] as const;

export type JourneyBookingStatusValue =
  (typeof JOURNEY_BOOKING_STATUSES)[number];

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Lifecycle status of a Journey Booking.
 *
 * Represents the domain state of the booking and is intentionally independent
 * from the Prisma enum.
 */
export class JourneyBookingStatus extends ValueObject<{
  value: JourneyBookingStatusValue;
}> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(value: JourneyBookingStatusValue) {
    super({ value });
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  /**
   * Creates a Journey Booking status from an external/runtime string.
   *
   * The value is normalized and validated before entering the domain.
   */
  public static create(value: string): JourneyBookingStatus {
    const normalized = value.trim().toUpperCase();

    if (!JourneyBookingStatus.isValid(normalized)) {
      throw new Error(`Invalid Journey Booking status: ${value}`);
    }

    return new JourneyBookingStatus(normalized);
  }

  // ===========================================================================
  // Named Factories
  // ===========================================================================

  public static pending(): JourneyBookingStatus {
    return new JourneyBookingStatus('PENDING');
  }

  public static confirmed(): JourneyBookingStatus {
    return new JourneyBookingStatus('CONFIRMED');
  }

  public static cancelled(): JourneyBookingStatus {
    return new JourneyBookingStatus('CANCELLED');
  }

  public static completed(): JourneyBookingStatus {
    return new JourneyBookingStatus('COMPLETED');
  }

  public static expired(): JourneyBookingStatus {
    return new JourneyBookingStatus('EXPIRED');
  }

  // ===========================================================================
  // Validation
  // ===========================================================================

  public static isValid(value: string): value is JourneyBookingStatusValue {
    return JOURNEY_BOOKING_STATUSES.includes(
      value as JourneyBookingStatusValue,
    );
  }

  // ===========================================================================
  // Predicates
  // ===========================================================================

  public isPending(): boolean {
    return this.props.value === 'PENDING';
  }

  public isConfirmed(): boolean {
    return this.props.value === 'CONFIRMED';
  }

  public isCancelled(): boolean {
    return this.props.value === 'CANCELLED';
  }

  public isCompleted(): boolean {
    return this.props.value === 'COMPLETED';
  }

  public isExpired(): boolean {
    return this.props.value === 'EXPIRED';
  }

  public isTerminal(): boolean {
    return this.isCancelled() || this.isCompleted() || this.isExpired();
  }

  // ===========================================================================
  // Accessor
  // ===========================================================================

  public get value(): JourneyBookingStatusValue {
    return this.props.value;
  }

  // ===========================================================================
  // Serialization
  // ===========================================================================

  public override toString(): string {
    return this.props.value;
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type JourneyBookingStatusProps = {
  value: JourneyBookingStatusValue;
};
