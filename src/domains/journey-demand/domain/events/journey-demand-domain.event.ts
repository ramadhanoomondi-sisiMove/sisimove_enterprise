// src/domains/journey-demand/domain/events/journey-demand-domain.event.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

// -----------------------------------------------------------------------------
// Base Journey Demand Domain Event
// -----------------------------------------------------------------------------

export abstract class JourneyDemandDomainEvent extends DomainEvent {
  protected constructor(
    aggregateId: string,
    public readonly publicId: string,
    public readonly requesterPublicId: string,
    eventName: string,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'JourneyDemand',
      eventName,
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );
  }

  protected getBasePayload(): Record<string, unknown> {
    return {
      publicId: this.publicId,
      requesterPublicId: this.requesterPublicId,
    };
  }
}
