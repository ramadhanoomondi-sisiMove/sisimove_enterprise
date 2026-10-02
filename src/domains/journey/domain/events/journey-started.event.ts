// -----------------------------------------------------------------------------
// Path: src/domains/journey/domain/events/journey-started.event.ts
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Started Event
//
// Emitted when a Journey transitions to IN_PROGRESS.
//
// The concrete event is frozen only after all event-specific properties have
// been initialized.
//
// -----------------------------------------------------------------------------

import { JourneyDomainEvent } from './journey-domain.event';

// -----------------------------------------------------------------------------
// Journey Started Event
// -----------------------------------------------------------------------------

export class JourneyStartedEvent extends JourneyDomainEvent {
  constructor(
    journeyId: string,
    publicId: string,
    providerPublicId: string,
    public readonly startedAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      journeyId,
      publicId,
      providerPublicId,
      'JourneyStarted',
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
      startedAt: this.startedAt,
    };
  }
}
