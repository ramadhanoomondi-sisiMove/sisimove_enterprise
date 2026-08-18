// src/domains/journey-booking/domain/events/journey-booking-created.event.ts

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyBookingDomainEvent } from './journey-booking-domain.event';

// -----------------------------------------------------------------------------
// Journey Booking Created
// -----------------------------------------------------------------------------

export class JourneyBookingCreatedEvent extends JourneyBookingDomainEvent {
  constructor(
    journeyBookingId: string,
    publicId: string,
    journeyPublicId: string,
    passengerPublicId: string,
    seats: number,
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
      'JourneyBookingCreated',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.seats = seats;

    Object.freeze(this);
  }

  public readonly seats: number;

  override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      seats: this.seats,
    };
  }
}
