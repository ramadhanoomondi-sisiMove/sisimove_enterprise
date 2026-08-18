// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Values
// -----------------------------------------------------------------------------

export const JOURNEY_BOOKING_PAYMENT_STATUSES = [
  'PENDING',
  'AUTHORIZED',
  'CAPTURED',
  'FAILED',
  'REFUNDED',
  'PARTIALLY_REFUNDED',
] as const;

export type JourneyBookingPaymentStatusValue =
  (typeof JOURNEY_BOOKING_PAYMENT_STATUSES)[number];

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyBookingPaymentStatusProps {
  value: JourneyBookingPaymentStatusValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Payment lifecycle status associated with a Journey Booking.
 *
 * This represents the payment state recorded by Journey Booking.
 * The authoritative transaction remains owned by the Payment/Transaction
 * bounded context.
 */
export class JourneyBookingPaymentStatus extends ValueObject<JourneyBookingPaymentStatusProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: JourneyBookingPaymentStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a payment status from an external/runtime string.
   *
   * The string is normalized and validated before entering the domain.
   */
  public static create(value: string): JourneyBookingPaymentStatus {
    const normalized = value.trim().toUpperCase();

    if (!JourneyBookingPaymentStatus.isValid(normalized)) {
      throw new Error(`Invalid Journey Booking payment status: ${value}`);
    }

    return new JourneyBookingPaymentStatus(normalized);
  }

  // ---------------------------------------------------------------------------
  // Named Factories
  // ---------------------------------------------------------------------------

  public static pending(): JourneyBookingPaymentStatus {
    return new JourneyBookingPaymentStatus('PENDING');
  }

  public static authorized(): JourneyBookingPaymentStatus {
    return new JourneyBookingPaymentStatus('AUTHORIZED');
  }

  public static captured(): JourneyBookingPaymentStatus {
    return new JourneyBookingPaymentStatus('CAPTURED');
  }

  public static failed(): JourneyBookingPaymentStatus {
    return new JourneyBookingPaymentStatus('FAILED');
  }

  public static refunded(): JourneyBookingPaymentStatus {
    return new JourneyBookingPaymentStatus('REFUNDED');
  }

  public static partiallyRefunded(): JourneyBookingPaymentStatus {
    return new JourneyBookingPaymentStatus('PARTIALLY_REFUNDED');
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  public static isValid(
    value: string,
  ): value is JourneyBookingPaymentStatusValue {
    return JOURNEY_BOOKING_PAYMENT_STATUSES.includes(
      value as JourneyBookingPaymentStatusValue,
    );
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isPending(): boolean {
    return this.props.value === 'PENDING';
  }

  public isAuthorized(): boolean {
    return this.props.value === 'AUTHORIZED';
  }

  public isCaptured(): boolean {
    return this.props.value === 'CAPTURED';
  }

  public isFailed(): boolean {
    return this.props.value === 'FAILED';
  }

  public isRefunded(): boolean {
    return this.props.value === 'REFUNDED';
  }

  public isPartiallyRefunded(): boolean {
    return this.props.value === 'PARTIALLY_REFUNDED';
  }

  public isTerminal(): boolean {
    return this.isFailed() || this.isRefunded() || this.isPartiallyRefunded();
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): JourneyBookingPaymentStatusValue {
    return this.props.value;
  }

  // ---------------------------------------------------------------------------
  // Serialization
  // ---------------------------------------------------------------------------

  public override toString(): string {
    return this.props.value;
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyBookingPaymentStatusProps };
