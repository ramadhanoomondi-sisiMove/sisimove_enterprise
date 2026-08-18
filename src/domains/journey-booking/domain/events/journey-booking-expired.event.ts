// src/domains/journey-booking/domain/events/journey-booking-expired.event.ts

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyBookingDomainEvent } from './journey-booking-domain.event';

// -----------------------------------------------------------------------------
// Journey Booking Expired
// -----------------------------------------------------------------------------

export class JourneyBookingExpiredEvent extends JourneyBookingDomainEvent {
  constructor(
    journeyBookingId: string,
    publicId: string,
    journeyPublicId: string,
    passengerPublicId: string,
    expiredAt: Date,
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
      'JourneyBookingExpired',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.expiredAt = new Date(expiredAt.getTime());

    Object.freeze(this);
  }

  public readonly expiredAt: Date;

  override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      expiredAt: this.expiredAt,
    };
  }
}
