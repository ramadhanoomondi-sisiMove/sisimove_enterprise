// src/domains/journey-demand/domain/events/journey-demand-updated.event.ts

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { JourneyDemandDomainEvent } from './journey-demand-domain.event';

// -----------------------------------------------------------------------------
// Journey Demand Updated
// -----------------------------------------------------------------------------

export class JourneyDemandUpdatedEvent extends JourneyDemandDomainEvent {
  constructor(
    journeyDemandId: string,
    publicId: string,
    requesterPublicId: string,
    public readonly version: number,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      journeyDemandId,
      publicId,
      requesterPublicId,
      'JourneyDemandUpdated',
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
      version: this.version,
    };
  }
}
