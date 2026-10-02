// -----------------------------------------------------------------------------
// Path: src/domains/journey/domain/events/journey-published.event.ts
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Published Event
//
// Emitted when a Journey transitions to PUBLISHED.
//
// The complete concrete event is frozen only after all concrete-event
// properties have been initialized.
//
// -----------------------------------------------------------------------------

import { JourneyDomainEvent } from './journey-domain.event';

// -----------------------------------------------------------------------------
// Journey Published Event
// -----------------------------------------------------------------------------

export class JourneyPublishedEvent extends JourneyDomainEvent {
  constructor(
    journeyId: string,
    publicId: string,
    providerPublicId: string,
    public readonly publishedAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      journeyId,
      publicId,
      providerPublicId,
      'JourneyPublished',
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
      publishedAt: this.publishedAt,
    };
  }
}
