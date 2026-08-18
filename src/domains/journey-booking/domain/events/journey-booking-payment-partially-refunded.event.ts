// src/domains/journey-booking/domain/events/journey-booking-payment-partially-refunded.event.ts

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyBookingDomainEvent } from './journey-booking-domain.event';

// -----------------------------------------------------------------------------
// Journey Booking Payment Partially Refunded
// -----------------------------------------------------------------------------

export class JourneyBookingPaymentPartiallyRefundedEvent extends JourneyBookingDomainEvent {
  constructor(
    journeyBookingId: string,
    publicId: string,
    journeyPublicId: string,
    passengerPublicId: string,
    paymentPublicId: string,
    transactionPublicId: string,
    refundedAmount: number,
    remainingAmount: number,
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
      'JourneyBookingPaymentPartiallyRefunded',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.paymentPublicId = paymentPublicId;
    this.transactionPublicId = transactionPublicId;
    this.refundedAmount = refundedAmount;
    this.remainingAmount = remainingAmount;
    this.currency = currency;
    this.refundedAt = new Date(refundedAt.getTime());

    Object.freeze(this);
  }

  public readonly paymentPublicId: string;

  public readonly transactionPublicId: string;

  public readonly refundedAmount: number;

  public readonly remainingAmount: number;

  public readonly currency: string;

  public readonly refundedAt: Date;

  override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      paymentPublicId: this.paymentPublicId,
      transactionPublicId: this.transactionPublicId,
      refundedAmount: this.refundedAmount,
      remainingAmount: this.remainingAmount,
      currency: this.currency,
      refundedAt: this.refundedAt,
    };
  }
}
