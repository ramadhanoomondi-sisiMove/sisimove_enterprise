// src/domains/social/domain/events/traveller-profile-preferences-changed.event.ts

import { TravellerProfileDomainEvent } from './traveller-profile-domain.event';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

export class TravellerProfilePreferencesChangedEvent extends TravellerProfileDomainEvent {
  constructor(
    travellerProfileId: string,
    publicId: string,
    public readonly preferencesId: string,
    public readonly showJourneyHistory: boolean,
    public readonly showJourneyStatistics: boolean,
    public readonly allowJourneyInvites: boolean,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      travellerProfileId,
      publicId,
      'TravellerProfilePreferencesChanged',
      correlationId,
      causationId,
    );

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      preferencesId: this.preferencesId,
      showJourneyHistory: this.showJourneyHistory,
      showJourneyStatistics: this.showJourneyStatistics,
      allowJourneyInvites: this.allowJourneyInvites,
    };
  }
}
