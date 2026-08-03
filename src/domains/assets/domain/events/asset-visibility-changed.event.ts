// src/domains/assets/domain/events/asset-visibility-changed.event.ts

import type { AssetVisibility } from '../value-objects';
import { AssetDomainEvent } from './asset-domain.event';

export class AssetVisibilityChangedEvent extends AssetDomainEvent {
  constructor(
    assetId: string,
    publicId: string,
    public readonly previousVisibility: AssetVisibility,
    public readonly currentVisibility: AssetVisibility,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      assetId,
      publicId,
      'AssetVisibilityChanged',
      correlationId,
      causationId,
    );

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      previousVisibility: this.previousVisibility,
      currentVisibility: this.currentVisibility,
    };
  }
}
