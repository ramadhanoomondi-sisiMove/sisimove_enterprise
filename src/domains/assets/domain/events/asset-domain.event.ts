// src/domains/assets/domain/events/asset-domain.event.ts

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

export abstract class AssetDomainEvent extends DomainEvent {
  protected constructor(
    public readonly assetId: string,
    public readonly publicId: string,
    eventName: string,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      assetId,
      'Asset',
      eventName,
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    Object.freeze(this);
  }

  protected getBasePayload(): Record<string, unknown> {
    return {
      assetId: this.assetId,
      publicId: this.publicId,
    };
  }
}
