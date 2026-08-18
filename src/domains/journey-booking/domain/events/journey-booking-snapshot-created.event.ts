// src/domains/journey-booking/domain/events/journey-booking-snapshot-created.event.ts

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyBookingDomainEvent } from './journey-booking-domain.event';

// -----------------------------------------------------------------------------
// Journey Booking Snapshot Created
// -----------------------------------------------------------------------------

export class JourneyBookingSnapshotCreatedEvent extends JourneyBookingDomainEvent {
  constructor(
    journeyBookingId: string,
    publicId: string,
    journeyPublicId: string,
    passengerPublicId: string,
    snapshotPublicId: string,
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
      'JourneyBookingSnapshotCreated',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.snapshotPublicId = snapshotPublicId;

    Object.freeze(this);
  }

  public readonly snapshotPublicId: string;

  override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      snapshotPublicId: this.snapshotPublicId,
    };
  }
}
