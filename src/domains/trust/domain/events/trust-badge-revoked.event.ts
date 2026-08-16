// src/domains/trust/domain/events/trust-badge-revoked.event.ts

import { TrustProfileDomainEvent } from './trust-profile-domain.event';

export class TrustBadgeRevokedEvent extends TrustProfileDomainEvent {
  constructor(
    trustProfileId: string,
    publicId: string,
    public readonly profileBadgePublicId: string,
    public readonly badgePublicId: string,
    public readonly reason: string | undefined,
    public readonly revokedAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      trustProfileId,
      publicId,
      'TrustBadgeRevoked',
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
      reason: this.reason,
      revokedAt: this.revokedAt,
    };
  }
}
