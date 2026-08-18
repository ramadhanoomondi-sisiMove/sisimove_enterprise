// src/domains/journey-booking/domain/events/journey-booking-payment-refunded.event.ts

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyBookingDomainEvent } from './journey-booking-domain.event';

// -----------------------------------------------------------------------------
// Journey Booking Payment Refunded
// -----------------------------------------------------------------------------

export class JourneyBookingPaymentRefundedEvent extends JourneyBookingDomainEvent {
  constructor(
    journeyBookingId: string,
    publicId: string,
    journeyPublicId: string,
    passengerPublicId: string,
    paymentPublicId: string,
    transactionPublicId: string,
    amount: number,
    currency: string,
    refundedAt: Date,
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
      'JourneyBookingPaymentRefunded',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.paymentPublicId = paymentPublicId;
    this.transactionPublicId = transactionPublicId;
    this.amount = amount;
    this.currency = currency;
    this.refundedAt = new Date(refundedAt.getTime());

    Object.freeze(this);
  }

  public readonly paymentPublicId: string;

  public readonly transactionPublicId: string;

  public readonly amount: number;

  public readonly currency: string;

  public readonly refundedAt: Date;

  override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      paymentPublicId: this.paymentPublicId,
      transactionPublicId: this.transactionPublicId,
      amount: this.amount,
      currency: this.currency,
      refundedAt: this.refundedAt,
    };
  }
}
