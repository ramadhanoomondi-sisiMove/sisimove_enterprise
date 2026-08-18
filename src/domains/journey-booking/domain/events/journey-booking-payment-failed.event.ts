// src/domains/journey-booking/domain/events/journey-booking-payment-failed.event.ts

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyBookingDomainEvent } from './journey-booking-domain.event';

// -----------------------------------------------------------------------------
// Journey Booking Payment Failed
// -----------------------------------------------------------------------------

export class JourneyBookingPaymentFailedEvent extends JourneyBookingDomainEvent {
  constructor(
    journeyBookingId: string,
    publicId: string,
    journeyPublicId: string,
    passengerPublicId: string,
    paymentPublicId: string,
    amount: number,
    currency: string,
    failureReason: string,
    failedAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      journeyBookingId,
      publicId,
      journeyPublicId,
      passengerPublicId,
      'JourneyBookingPaymentFailed',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.paymentPublicId = paymentPublicId;
    this.amount = amount;
    this.currency = currency;
    this.failureReason = failureReason;
    this.failedAt = new Date(failedAt.getTime());

    Object.freeze(this);
  }

  public readonly paymentPublicId: string;

  public readonly amount: number;

  public readonly currency: string;

  public readonly failureReason: string;

  public readonly failedAt: Date;

  override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      paymentPublicId: this.paymentPublicId,
      amount: this.amount,
      currency: this.currency,
      failureReason: this.failureReason,
      failedAt: this.failedAt,
    };
  }
}
