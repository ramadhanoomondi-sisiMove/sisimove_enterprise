// src/domains/trust/domain/events/trust-journey-completed.event.ts

import { TrustProfileDomainEvent } from './trust-profile-domain.event';

export class TrustJourneyCompletedEvent extends TrustProfileDomainEvent {
  constructor(
    trustProfileId: string,
    publicId: string,
    public readonly journeyPublicId: string,
    public readonly bookingPublicId: string | undefined,
    public readonly role: string,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      trustProfileId,
      publicId,
      'TrustJourneyCompleted',
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
      journeyPublicId: this.journeyPublicId,
      bookingPublicId: this.bookingPublicId,
      role: this.role,
    };
  }
}
