// -----------------------------------------------------------------------------
// Path: src/domains/journey/domain/events/journey-completed.event.ts
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Completed Event
//
// Emitted when a Journey transitions to COMPLETED.
//
// The concrete event is frozen only after all event-specific properties have
// been initialized.
//
// -----------------------------------------------------------------------------

import { JourneyDomainEvent } from './journey-domain.event';

// -----------------------------------------------------------------------------
// Journey Completed Event
// -----------------------------------------------------------------------------

export class JourneyCompletedEvent extends JourneyDomainEvent {
  constructor(
    journeyId: string,
    publicId: string,
    providerPublicId: string,
    public readonly completedAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      journeyId,
      publicId,
      providerPublicId,
      'JourneyCompleted',
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
      completedAt: this.completedAt,
    };
  }
}
