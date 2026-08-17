// src/domains/journey-demand/domain/events/journey-demand-cancelled.event.ts

import { JourneyDemandDomainEvent } from './journey-demand-domain.event';

export class JourneyDemandCancelledEvent extends JourneyDemandDomainEvent {
  constructor(
    journeyDemandId: string,
    publicId: string,
    requesterPublicId: string,
    public readonly cancelledAt: Date,
    public readonly reason: string | undefined,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      journeyDemandId,
      publicId,
      requesterPublicId,
      'JourneyDemandCancelled',
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
      cancelledAt: this.cancelledAt,
      ...(this.reason !== undefined && {
        reason: this.reason,
      }),
    };
  }
}
