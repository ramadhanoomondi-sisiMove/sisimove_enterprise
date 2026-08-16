// src/domains/trust/domain/events/trust-profile-created.event.ts

// -----------------------------------------------------------------------------
// Domain Event
// -----------------------------------------------------------------------------

import { TrustProfileDomainEvent } from './trust-profile-domain.event';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

export class TrustProfileCreatedEvent extends TrustProfileDomainEvent {
  constructor(
    trustProfileId: string,
    publicId: string,
    public readonly memberPublicId: string,
    public readonly status: string,
    public readonly verificationLevel: string,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      trustProfileId,
      publicId,
      'TrustProfileCreated',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    Object.freeze(this);
  }

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      memberPublicId: this.memberPublicId,
      status: this.status,
      verificationLevel: this.verificationLevel,
    };
  }
}
