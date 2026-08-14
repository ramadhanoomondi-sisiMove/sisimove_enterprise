// src/domains/social/domain/events/traveller-profile-handle-changed.event.ts

import { TravellerProfileDomainEvent } from './traveller-profile-domain.event';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

export class TravellerProfileHandleChangedEvent extends TravellerProfileDomainEvent {
  constructor(
    travellerProfileId: string,
    publicId: string,
    public readonly previousHandle: string,
    public readonly newHandle: string,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      travellerProfileId,
      publicId,
      'TravellerProfileHandleChanged',
      correlationId,
      causationId,
    );

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      previousHandle: this.previousHandle,
      newHandle: this.newHandle,
    };
  }
}
