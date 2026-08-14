// src/domains/social/domain/events/traveller-profile-corridor-added.event.ts

import { TravellerProfileDomainEvent } from './traveller-profile-domain.event';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

export class TravellerProfileCorridorAddedEvent extends TravellerProfileDomainEvent {
  constructor(
    travellerProfileId: string,
    publicId: string,
    public readonly corridorId: string,
    public readonly originName: string,
    public readonly destinationName: string,
    public readonly originLatitude: number,
    public readonly originLongitude: number,
    public readonly destinationLatitude: number,
    public readonly destinationLongitude: number,
    public readonly corridorKey: string | null,
    public readonly isPrimary: boolean,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      travellerProfileId,
      publicId,
      'TravellerProfileCorridorAdded',
      correlationId,
      causationId,
    );

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      corridorId: this.corridorId,
      originName: this.originName,
      destinationName: this.destinationName,
      originLatitude: this.originLatitude,
      originLongitude: this.originLongitude,
      destinationLatitude: this.destinationLatitude,
      destinationLongitude: this.destinationLongitude,
      corridorKey: this.corridorKey,
      isPrimary: this.isPrimary,
    };
  }
}
