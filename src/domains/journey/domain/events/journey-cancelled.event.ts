// -----------------------------------------------------------------------------
// Path: src/domains/journey/domain/events/journey-cancelled.event.ts
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Cancelled Event
//
// Emitted when a Journey transitions to CANCELLED.
//
// The concrete event is frozen only after all event-specific properties have
// been initialized.
//
// -----------------------------------------------------------------------------

import { JourneyDomainEvent } from './journey-domain.event';

// -----------------------------------------------------------------------------
// Journey Cancelled Event
// -----------------------------------------------------------------------------

export class JourneyCancelledEvent extends JourneyDomainEvent {
  constructor(
    journeyId: string,
    publicId: string,
    providerPublicId: string,
    public readonly cancelledAt: Date,
    public readonly reason: string | undefined,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      journeyId,
      publicId,
      providerPublicId,
      'JourneyCancelled',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    Object.freeze(this);
  }

  override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      cancelledAt: this.cancelledAt,
      reason: this.reason,
    };
  }
}
