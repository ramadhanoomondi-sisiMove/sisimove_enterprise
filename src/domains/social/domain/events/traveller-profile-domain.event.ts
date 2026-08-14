// src/domains/social/domain/events/traveller-profile-domain.event.ts

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

export abstract class TravellerProfileDomainEvent extends DomainEvent {
  protected constructor(
    public readonly travellerProfileId: string,
    public readonly publicId: string,
    eventName: string,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      travellerProfileId,
      'TravellerProfile',
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
      travellerProfileId: this.travellerProfileId,
      publicId: this.publicId,
    };
  }
}
