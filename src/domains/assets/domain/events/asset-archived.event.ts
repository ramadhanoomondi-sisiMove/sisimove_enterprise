// src/domains/assets/domain/events/asset-archived.event.ts

import { AssetDomainEvent } from './asset-domain.event';

export class AssetArchivedEvent extends AssetDomainEvent {
  constructor(
    assetId: string,
    publicId: string,
    public readonly archivedAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(assetId, publicId, 'AssetArchived', correlationId, causationId);

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      archivedAt: this.archivedAt,
    };
  }
}
