// src/domains/trust/domain/events/trust-profile-domain.event.ts

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

export abstract class TrustProfileDomainEvent extends DomainEvent {
  protected constructor(
    public readonly trustProfileId: string,
    public readonly publicId: string,
    eventName: string,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      trustProfileId,
      'TrustProfile',
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
      trustProfileId: this.trustProfileId,
      publicId: this.publicId,
    };
  }
}
