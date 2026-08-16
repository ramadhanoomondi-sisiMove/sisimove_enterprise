// src/domains/trust/domain/events/trust-rating-restored.event.ts

import { TrustProfileDomainEvent } from './trust-profile-domain.event';

export class TrustRatingRestoredEvent extends TrustProfileDomainEvent {
  constructor(
    trustProfileId: string,
    publicId: string,
    public readonly ratingPublicId: string,
    public readonly revieweePublicId: string,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      trustProfileId,
      publicId,
      'TrustRatingRestored',
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
      revieweePublicId: this.revieweePublicId,
    };
  }
}
