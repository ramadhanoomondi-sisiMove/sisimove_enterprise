// src/domains/trust/domain/events/trust-review-created.event.ts

import { TrustProfileDomainEvent } from './trust-profile-domain.event';

export class TrustReviewCreatedEvent extends TrustProfileDomainEvent {
  constructor(
    trustProfileId: string,
    publicId: string,
    public readonly reviewPublicId: string,
    public readonly ratingPublicId: string,
    public readonly content: string,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      trustProfileId,
      publicId,
      'TrustReviewCreated',
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
      reviewPublicId: this.reviewPublicId,
      ratingPublicId: this.ratingPublicId,
      content: this.content,
    };
  }
}
