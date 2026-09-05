// -----------------------------------------------------------------------------
// Asset — Asset Deleted Domain Event
// -----------------------------------------------------------------------------
//
// Raised when an Asset is deleted from the Asset aggregate lifecycle.
//
// DELETED is a terminal Asset lifecycle state.
//
// Physical storage deletion, when required, is performed through the
// AssetStoragePort by the application/infrastructure boundary.
//
// This event does not contain storage credentials or signed URLs.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AssetDomainEvent } from './asset-domain.event';

// -----------------------------------------------------------------------------
// Asset Deleted Event
// -----------------------------------------------------------------------------

export class AssetDeletedEvent extends AssetDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    aggregateId: string,
    public readonly publicId: string,
    public readonly deletedAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      aggregateId,
      'AssetAggregate',
      'AssetDeleted',
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
      deletedAt: new Date(this.deletedAt.getTime()),
    };
  }
}