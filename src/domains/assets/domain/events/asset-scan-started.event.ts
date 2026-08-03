// src/domains/assets/domain/events/asset-scan-started.event.ts

import type { AssetScanEngine } from '../value-objects';
import { AssetDomainEvent } from './asset-domain.event';

export class AssetScanStartedEvent extends AssetDomainEvent {
  constructor(
    assetId: string,
    publicId: string,
    public readonly engine: AssetScanEngine,
    correlationId: string,
    causationId?: string,
  ) {
    super(assetId, publicId, 'AssetScanStarted', correlationId, causationId);

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      engine: this.engine,
    };
  }
}
