// src/domains/assets/domain/events/asset-created.event.ts

import type { AssetCategory, AssetType } from '../value-objects';
import { AssetDomainEvent } from './asset-domain.event';

export class AssetCreatedEvent extends AssetDomainEvent {
  constructor(
    assetId: string,
    publicId: string,
    public readonly ownerIdentityId: string | null,
    public readonly type: AssetType,
    public readonly category: AssetCategory,
    correlationId: string,
    causationId?: string,
  ) {
    super(assetId, publicId, 'AssetCreated', correlationId, causationId);

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      ownerIdentityId: this.ownerIdentityId,
      type: this.type,
      category: this.category,
    };
  }
}
