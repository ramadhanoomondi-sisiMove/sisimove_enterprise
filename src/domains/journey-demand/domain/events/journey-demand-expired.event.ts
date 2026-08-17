// src/domains/journey-demand/domain/events/journey-demand-expired.event.ts

import { JourneyDemandDomainEvent } from './journey-demand-domain.event';

export class JourneyDemandExpiredEvent extends JourneyDemandDomainEvent {
  constructor(
    journeyDemandId: string,
    publicId: string,
    requesterPublicId: string,
    public readonly expiredAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      journeyDemandId,
      publicId,
      requesterPublicId,
      'JourneyDemandExpired',
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
      expiredAt: this.expiredAt,
    };
  }
}
