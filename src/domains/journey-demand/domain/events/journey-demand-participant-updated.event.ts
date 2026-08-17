// src/domains/journey-demand/domain/events/journey-demand-participant-updated.event.ts

import { JourneyDemandDomainEvent } from './journey-demand-domain.event';

export class JourneyDemandParticipantUpdatedEvent extends JourneyDemandDomainEvent {
  constructor(
    journeyDemandId: string,
    publicId: string,
    requesterPublicId: string,
    public readonly participantPublicId: string,
    public readonly memberPublicId: string,
    public readonly seats: number,
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
      'JourneyDemandParticipantUpdated',
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
      participantPublicId: this.participantPublicId,
      memberPublicId: this.memberPublicId,
      seats: this.seats,
      version: this.version,
    };
  }
}
