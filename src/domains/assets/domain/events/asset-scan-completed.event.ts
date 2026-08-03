// src/domains/assets/domain/events/asset-scan-completed.event.ts

import type { AssetScanEngine, AssetScanStatus } from '../value-objects';
import { AssetDomainEvent } from './asset-domain.event';

export class AssetScanCompletedEvent extends AssetDomainEvent {
  constructor(
    assetId: string,
    publicId: string,
    public readonly engine: AssetScanEngine,
    public readonly status: AssetScanStatus,
    public readonly threatName: string | null,
    correlationId: string,
    causationId?: string,
  ) {
    super(assetId, publicId, 'AssetScanCompleted', correlationId, causationId);

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      engine: this.engine,
      status: this.status,
      threatName: this.threatName,
    };
  }
}
