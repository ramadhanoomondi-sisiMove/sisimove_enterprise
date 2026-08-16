// src/domains/trust/domain/events/trust-rating-received.event.ts

import { TrustProfileDomainEvent } from './trust-profile-domain.event';

export class TrustRatingReceivedEvent extends TrustProfileDomainEvent {
  constructor(
    trustProfileId: string,
    publicId: string,
    public readonly ratingPublicId: string,
    public readonly reviewerPublicId: string,
    public readonly revieweePublicId: string,
    public readonly journeyPublicId: string,
    public readonly score: number,
    public readonly role: string,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      trustProfileId,
      publicId,
      'TrustRatingReceived',
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
      ratingPublicId: this.ratingPublicId,
      reviewerPublicId: this.reviewerPublicId,
      revieweePublicId: this.revieweePublicId,
      journeyPublicId: this.journeyPublicId,
      score: this.score,
      role: this.role,
    };
  }
}
