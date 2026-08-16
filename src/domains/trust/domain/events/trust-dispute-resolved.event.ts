// src/domains/trust/domain/events/trust-dispute-resolved.event.ts

import { TrustProfileDomainEvent } from './trust-profile-domain.event';

export class TrustDisputeResolvedEvent extends TrustProfileDomainEvent {
  constructor(
    trustProfileId: string,
    publicId: string,
    public readonly disputePublicId: string,
    public readonly journeyPublicId: string | undefined,
    public readonly bookingPublicId: string | undefined,
    public readonly actorPublicId: string | undefined,
    public readonly resolution: string | undefined,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      trustProfileId,
      publicId,
      'TrustDisputeResolved',
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
      disputePublicId: this.disputePublicId,
      journeyPublicId: this.journeyPublicId,
      bookingPublicId: this.bookingPublicId,
      actorPublicId: this.actorPublicId,
      resolution: this.resolution,
    };
  }
}
