// src/domains/assets/domain/events/asset-uploaded.event.ts

import { AssetDomainEvent } from './asset-domain.event';

export class AssetUploadedEvent extends AssetDomainEvent {
  constructor(
    assetId: string,
    publicId: string,
    public readonly uploadedAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(assetId, publicId, 'AssetUploaded', correlationId, causationId);

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      uploadedAt: this.uploadedAt,
    };
  }
}
