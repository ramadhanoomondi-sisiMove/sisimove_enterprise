// src/domains/social/domain/events/traveller-profile-created.event.ts

import { TravellerProfileDomainEvent } from './traveller-profile-domain.event';

import type {
  TravellerProfileStatus,
  TravellerProfileVisibility,
} from '../value-objects';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

export class TravellerProfileCreatedEvent extends TravellerProfileDomainEvent {
  constructor(
    travellerProfileId: string,
    publicId: string,
    public readonly memberPublicId: string,
    public readonly handle: string,
    public readonly bio: string | null,
    public readonly avatarAssetPublicId: string | null,
    public readonly countryCode: string,
    public readonly status: TravellerProfileStatus,
    public readonly visibility: TravellerProfileVisibility,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      travellerProfileId,
      publicId,
      'TravellerProfileCreated',
      correlationId,
      causationId,
    );

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      memberPublicId: this.memberPublicId,
      handle: this.handle,
      bio: this.bio,
      avatarAssetPublicId: this.avatarAssetPublicId,
      countryCode: this.countryCode,
      status: this.status,
      visibility: this.visibility,
    };
  }
}
