// src/domains/journey-demand/domain/events/journey-demand-fulfilled.event.ts

import { JourneyDemandDomainEvent } from './journey-demand-domain.event';

export class JourneyDemandFulfilledEvent extends JourneyDemandDomainEvent {
  constructor(
    journeyDemandId: string,
    publicId: string,
    requesterPublicId: string,
    public readonly fulfilledAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      journeyDemandId,
      publicId,
      requesterPublicId,
      'JourneyDemandFulfilled',
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
      fulfilledAt: this.fulfilledAt,
    };
  }
}
