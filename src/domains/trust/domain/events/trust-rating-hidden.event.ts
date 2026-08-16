// src/domains/trust/domain/events/trust-rating-hidden.event.ts

import { TrustProfileDomainEvent } from './trust-profile-domain.event';

export class TrustRatingHiddenEvent extends TrustProfileDomainEvent {
  constructor(
    trustProfileId: string,
    publicId: string,
    public readonly ratingPublicId: string,
    public readonly revieweePublicId: string,
    public readonly reason: string | undefined,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      trustProfileId,
      publicId,
      'TrustRatingHidden',
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
      reason: this.reason,
    };
  }
}
