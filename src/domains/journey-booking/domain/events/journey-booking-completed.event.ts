// src/domains/journey-booking/domain/events/journey-booking-completed.event.ts

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyBookingDomainEvent } from './journey-booking-domain.event';

// -----------------------------------------------------------------------------
// Journey Booking Completed
// -----------------------------------------------------------------------------

export class JourneyBookingCompletedEvent extends JourneyBookingDomainEvent {
  constructor(
    journeyBookingId: string,
    publicId: string,
    journeyPublicId: string,
    passengerPublicId: string,
    completedAt: Date,
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
      'JourneyBookingCompleted',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.completedAt = new Date(completedAt.getTime());

    Object.freeze(this);
  }

  public readonly completedAt: Date;

  override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      completedAt: this.completedAt,
    };
  }
}
