// src/domains/social/domain/events/traveller-profile-status-changed.event.ts

import { TravellerProfileDomainEvent } from './traveller-profile-domain.event';

import type { TravellerProfileStatus } from '../value-objects';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

export class TravellerProfileStatusChangedEvent extends TravellerProfileDomainEvent {
  constructor(
    travellerProfileId: string,
    publicId: string,
    public readonly previousStatus: TravellerProfileStatus,
    public readonly newStatus: TravellerProfileStatus,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      travellerProfileId,
      publicId,
      'TravellerProfileStatusChanged',
      correlationId,
      causationId,
    );

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      previousStatus: this.previousStatus,
      newStatus: this.newStatus,
    };
  }
}
