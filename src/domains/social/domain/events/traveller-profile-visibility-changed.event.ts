// src/domains/social/domain/events/traveller-profile-visibility-changed.event.ts

import { TravellerProfileDomainEvent } from './traveller-profile-domain.event';

import type { TravellerProfileVisibility } from '../value-objects';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

export class TravellerProfileVisibilityChangedEvent extends TravellerProfileDomainEvent {
  constructor(
    travellerProfileId: string,
    publicId: string,
    public readonly previousVisibility: TravellerProfileVisibility,
    public readonly newVisibility: TravellerProfileVisibility,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      travellerProfileId,
      publicId,
      'TravellerProfileVisibilityChanged',
      correlationId,
      causationId,
    );

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      previousVisibility: this.previousVisibility,
      newVisibility: this.newVisibility,
    };
  }
}
