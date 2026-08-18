// src/domains/journey-booking/domain/events/journey-booking-pricing-set.event.ts

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyBookingDomainEvent } from './journey-booking-domain.event';

// -----------------------------------------------------------------------------
// Journey Booking Pricing Set
// -----------------------------------------------------------------------------

export class JourneyBookingPricingSetEvent extends JourneyBookingDomainEvent {
  constructor(
    journeyBookingId: string,
    publicId: string,
    journeyPublicId: string,
    passengerPublicId: string,
    pricingPublicId: string,
    seats: number,
    totalAmount: number,
    currency: string,
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
      'JourneyBookingPricingSet',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.pricingPublicId = pricingPublicId;
    this.seats = seats;
    this.totalAmount = totalAmount;
    this.currency = currency;

    Object.freeze(this);
  }

  public readonly pricingPublicId: string;

  public readonly seats: number;

  public readonly totalAmount: number;

  public readonly currency: string;

  override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      pricingPublicId: this.pricingPublicId,
      seats: this.seats,
      totalAmount: this.totalAmount,
      currency: this.currency,
    };
  }
}
