// src/domains/journey/domain/events/journey-domain.event.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

// -----------------------------------------------------------------------------
// Journey Domain Event
// -----------------------------------------------------------------------------

export abstract class JourneyDomainEvent extends DomainEvent {
  protected constructor(
    public readonly journeyId: string,
    public readonly publicId: string,
    public readonly providerPublicId: string,
    eventName: string,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      journeyId,
      'Journey',
      eventName,
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    Object.freeze(this);
  }

  protected getBasePayload(): Record<string, unknown> {
    return {
      journeyId: this.journeyId,
      publicId: this.publicId,
      providerPublicId: this.providerPublicId,
    };
  }
}
