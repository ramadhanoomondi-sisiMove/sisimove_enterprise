// src/domains/journey-booking/domain/events/journey-booking-confirmed.event.ts

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyBookingDomainEvent } from './journey-booking-domain.event';

// -----------------------------------------------------------------------------
// Journey Booking Confirmed
// -----------------------------------------------------------------------------

export class JourneyBookingConfirmedEvent extends JourneyBookingDomainEvent {
  constructor(
    journeyBookingId: string,
    publicId: string,
    journeyPublicId: string,
    passengerPublicId: string,
    seats: number,
    confirmedAt: Date,
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
      'JourneyBookingConfirmed',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.seats = seats;
    this.confirmedAt = new Date(confirmedAt.getTime());

    Object.freeze(this);
  }

  public readonly seats: number;

  public readonly confirmedAt: Date;

  override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      seats: this.seats,
      confirmedAt: this.confirmedAt,
    };
  }
}
