// src/domains/trust/domain/events/trust-profile-restored.event.ts

import { TrustProfileDomainEvent } from './trust-profile-domain.event';

export class TrustProfileRestoredEvent extends TrustProfileDomainEvent {
  constructor(
    trustProfileId: string,
    publicId: string,
    public readonly previousStatus: string,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      trustProfileId,
      publicId,
      'TrustProfileRestored',
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
      previousStatus: this.previousStatus,
    };
  }
}
