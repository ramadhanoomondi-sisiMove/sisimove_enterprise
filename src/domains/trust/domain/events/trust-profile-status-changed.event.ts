// src/domains/trust/domain/events/trust-profile-status-changed.event.ts

import { TrustProfileDomainEvent } from './trust-profile-domain.event';

export class TrustProfileStatusChangedEvent extends TrustProfileDomainEvent {
  constructor(
    trustProfileId: string,
    publicId: string,
    public readonly previousStatus: string,
    public readonly newStatus: string,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      trustProfileId,
      publicId,
      'TrustProfileStatusChanged',
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
      newStatus: this.newStatus,
    };
  }
}
