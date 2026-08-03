// src/domains/assets/domain/events/asset-deleted.event.ts

import { AssetDomainEvent } from './asset-domain.event';

export class AssetDeletedEvent extends AssetDomainEvent {
  constructor(
    assetId: string,
    publicId: string,
    public readonly deletedAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(assetId, publicId, 'AssetDeleted', correlationId, causationId);

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      deletedAt: this.deletedAt,
    };
  }
}
