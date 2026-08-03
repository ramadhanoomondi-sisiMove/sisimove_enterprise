// src/domains/assets/domain/events/asset-moderation-rejected.event.ts

import type { AssetModerationType } from '../value-objects';

import { AssetDomainEvent } from './asset-domain.event';

export class AssetModerationRejectedEvent extends AssetDomainEvent {
  constructor(
    assetId: string,
    publicId: string,

    public readonly type: AssetModerationType,
    public readonly reason: string,

    public readonly moderatorId: string | null,
    public readonly confidence: number | null,

    public readonly moderatedAt: Date,

    correlationId: string,
    causationId?: string,
  ) {
    super(
      assetId,
      publicId,
      'AssetModerationRejected',
      correlationId,
      causationId,
    );

    Object.freeze(this);
  }

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      type: this.type,
      reason: this.reason,

      moderatorId: this.moderatorId,
      confidence: this.confidence,

      moderatedAt: this.moderatedAt,
    };
  }
}