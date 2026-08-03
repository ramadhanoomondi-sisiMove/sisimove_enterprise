// src/domains/assets/domain/events/asset-processing-started.event.ts

import type { AssetProcessingOperation } from '../value-objects';
import { AssetDomainEvent } from './asset-domain.event';

export class AssetProcessingStartedEvent extends AssetDomainEvent {
  constructor(
    assetId: string,
    publicId: string,
    public readonly operation: AssetProcessingOperation,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      assetId,
      publicId,
      'AssetProcessingStarted',
      correlationId,
      causationId,
    );

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      operation: this.operation,
    };
  }
}
