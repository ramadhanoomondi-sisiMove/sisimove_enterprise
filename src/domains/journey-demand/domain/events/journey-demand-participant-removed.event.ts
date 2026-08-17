// src/domains/journey-demand/domain/events/journey-demand-participant-removed.event.ts

import { JourneyDemandDomainEvent } from './journey-demand-domain.event';

export class JourneyDemandParticipantRemovedEvent extends JourneyDemandDomainEvent {
  constructor(
    journeyDemandId: string,
    publicId: string,
    requesterPublicId: string,
    public readonly participantPublicId: string,
    public readonly memberPublicId: string,
    public readonly removedAt: Date,
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
      'JourneyDemandParticipantRemoved',
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
      removedAt: this.removedAt,
      version: this.version,
    };
  }
}
