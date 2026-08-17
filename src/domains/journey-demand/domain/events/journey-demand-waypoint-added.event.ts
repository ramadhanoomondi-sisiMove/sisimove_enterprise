// src/domains/journey-demand/domain/events/journey-demand-waypoint-added.event.ts

import { JourneyDemandDomainEvent } from './journey-demand-domain.event';

export class JourneyDemandWaypointAddedEvent extends JourneyDemandDomainEvent {
  constructor(
    journeyDemandId: string,
    publicId: string,
    requesterPublicId: string,
    public readonly waypointPublicId: string,
    public readonly corridorPublicId: string,
    public readonly sequence: number,
    public readonly version: number,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      journeyDemandId,
      publicId,
      requesterPublicId,
      'JourneyDemandWaypointAdded',
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
      waypointPublicId: this.waypointPublicId,
      corridorPublicId: this.corridorPublicId,
      sequence: this.sequence,
      version: this.version,
    };
  }
}
