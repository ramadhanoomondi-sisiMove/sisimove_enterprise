// src/domains/trust/domain/events/trust-badge-awarded.event.ts

import { TrustProfileDomainEvent } from './trust-profile-domain.event';

export class TrustBadgeAwardedEvent extends TrustProfileDomainEvent {
  constructor(
    trustProfileId: string,
    publicId: string,
    public readonly profileBadgePublicId: string,
    public readonly badgePublicId: string,
    public readonly badgeType: string,
    public readonly awardedAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      trustProfileId,
      publicId,
      'TrustBadgeAwarded',
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
      profileBadgePublicId: this.profileBadgePublicId,
      badgePublicId: this.badgePublicId,
      badgeType: this.badgeType,
      awardedAt: this.awardedAt,
    };
  }
}
