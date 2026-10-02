// -----------------------------------------------------------------------------
// Path: src/domains/journey/domain/events/journey-created.event.ts
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Created Event
//
// Emitted when a Journey aggregate is created.
//
// The concrete event is frozen after construction so the completed event
// remains immutable.
//
// -----------------------------------------------------------------------------

import { JourneyDomainEvent } from './journey-domain.event';

// -----------------------------------------------------------------------------
// Journey Created Event
// -----------------------------------------------------------------------------

export class JourneyCreatedEvent extends JourneyDomainEvent {
  constructor(
    journeyId: string,
    publicId: string,
    providerPublicId: string,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      journeyId,
      publicId,
      providerPublicId,
      'JourneyCreated',
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
    };
  }
}
