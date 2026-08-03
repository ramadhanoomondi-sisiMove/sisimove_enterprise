// src/domains/assets/domain/events/asset-processing-completed.event.ts

import type {
  AssetProcessingOperation,
  AssetProcessor,
} from '../value-objects';
import { AssetDomainEvent } from './asset-domain.event';

export class AssetProcessingCompletedEvent extends AssetDomainEvent {
  constructor(
    assetId: string,
    publicId: string,
    public readonly operation: AssetProcessingOperation,
    public readonly processor: AssetProcessor,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      assetId,
      publicId,
      'AssetProcessingCompleted',
      correlationId,
      causationId,
    );

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      operation: this.operation,
      processor: this.processor,
    };
  }
}
