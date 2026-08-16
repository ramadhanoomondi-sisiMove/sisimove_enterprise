// src/domains/trust/domain/events/trust-manual-adjustment.event.ts

import { TrustProfileDomainEvent } from './trust-profile-domain.event';

export class TrustManualAdjustmentEvent extends TrustProfileDomainEvent {
  private readonly adjustmentMetadata: Record<string, unknown> | undefined;

  constructor(
    trustProfileId: string,
    publicId: string,
    public readonly actorPublicId: string,
    public readonly reason: string,
    public readonly adjustment: string,
    metadata: Record<string, unknown> | undefined,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      trustProfileId,
      publicId,
      'TrustManualAdjustment',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.adjustmentMetadata = metadata;

    Object.freeze(this);
  }

  override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      actorPublicId: this.actorPublicId,
      reason: this.reason,
      adjustment: this.adjustment,
      metadata: this.adjustmentMetadata,
    };
  }
}
