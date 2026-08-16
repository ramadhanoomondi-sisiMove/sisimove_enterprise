// src/domains/trust/domain/events/trust-verification-revoked.event.ts

import { TrustProfileDomainEvent } from './trust-profile-domain.event';

export class TrustVerificationRevokedEvent extends TrustProfileDomainEvent {
  constructor(
    trustProfileId: string,
    publicId: string,
    public readonly previousVerificationLevel: string,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      trustProfileId,
      publicId,
      'TrustVerificationRevoked',
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
      previousVerificationLevel: this.previousVerificationLevel,
    };
  }
}
