// src/domains/social/domain/events/traveller-profile-country-changed.event.ts

import { TravellerProfileDomainEvent } from './traveller-profile-domain.event';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

export class TravellerProfileCountryChangedEvent extends TravellerProfileDomainEvent {
  constructor(
    travellerProfileId: string,
    publicId: string,
    public readonly previousCountryCode: string,
    public readonly newCountryCode: string,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      travellerProfileId,
      publicId,
      'TravellerProfileCountryChanged',
      correlationId,
      causationId,
    );

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      previousCountryCode: this.previousCountryCode,
      newCountryCode: this.newCountryCode,
    };
  }
}
