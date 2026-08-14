// src/domains/social/domain/events/traveller-profile-avatar-changed.event.ts

import { TravellerProfileDomainEvent } from './traveller-profile-domain.event';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

export class TravellerProfileAvatarChangedEvent extends TravellerProfileDomainEvent {
  constructor(
    travellerProfileId: string,
    publicId: string,
    public readonly previousAvatarAssetPublicId: string | null,
    public readonly newAvatarAssetPublicId: string | null,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      travellerProfileId,
      publicId,
      'TravellerProfileAvatarChanged',
      correlationId,
      causationId,
    );

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      previousAvatarAssetPublicId: this.previousAvatarAssetPublicId,
      newAvatarAssetPublicId: this.newAvatarAssetPublicId,
    };
  }
}
