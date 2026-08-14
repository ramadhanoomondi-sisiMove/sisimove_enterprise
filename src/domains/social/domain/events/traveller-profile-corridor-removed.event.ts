// src/domains/social/domain/events/traveller-profile-corridor-removed.event.ts

import { TravellerProfileDomainEvent } from './traveller-profile-domain.event';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

export class TravellerProfileCorridorRemovedEvent extends TravellerProfileDomainEvent {
  constructor(
    travellerProfileId: string,
    publicId: string,
    public readonly corridorId: string,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      travellerProfileId,
      publicId,
      'TravellerProfileCorridorRemoved',
      correlationId,
      causationId,
    );

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      corridorId: this.corridorId,
    };
  }
}
