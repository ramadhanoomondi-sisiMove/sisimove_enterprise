// -----------------------------------------------------------------------------
// Path: src/domains/journey/domain/events/journey-domain.event.ts
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Domain Event
//
// Base event abstraction for Journey domain events.
//
// The concrete Journey event is responsible for freezing the completed event
// instance. This is intentional because TypeScript initializes subclass
// parameter properties only after `super()` returns.
//
// -----------------------------------------------------------------------------

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
  }

  protected getBasePayload(): Record<string, unknown> {
    return {
      journeyId: this.journeyId,
      publicId: this.publicId,
      providerPublicId: this.providerPublicId,
    };
  }
}
