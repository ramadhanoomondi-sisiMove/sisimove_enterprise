// -----------------------------------------------------------------------------
// Asset — Asset Ready Domain Event
// -----------------------------------------------------------------------------
//
// Raised when an uploaded Asset has completed the processing required by the
// Asset bounded context and is ready for normal use.
//
// Lifecycle:
//
// UPLOADED
//     │
//     ▼
// READY
//
// This event does not generate or expose a public URL or signed URL.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AssetDomainEvent } from './asset-domain.event';

// -----------------------------------------------------------------------------
// Asset Ready Event
// -----------------------------------------------------------------------------

export class AssetReadyEvent extends AssetDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    aggregateId: string,
    public readonly publicId: string,
    public readonly type: string,
    public readonly category: string,
    public readonly visibility: string,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      aggregateId,
      'AssetAggregate',
      'AssetReady',
      correlationId,
      causationId,
    );
  }

  // ===========================================================================
  // Payload
  // ===========================================================================

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      publicId: this.publicId,
      type: this.type,
      category: this.category,
      visibility: this.visibility,
    };
  }
}
