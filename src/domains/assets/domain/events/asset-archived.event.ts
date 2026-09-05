// -----------------------------------------------------------------------------
// Asset — Asset Archived Domain Event
// -----------------------------------------------------------------------------
//
// Raised when an Asset is intentionally archived.
//
// An archived Asset remains represented by the Asset aggregate but is no
// longer considered normally mutable or usable.
//
// Lifecycle:
//
// READY
//   │
//   ▼
// ARCHIVED
//
// Archiving does not physically delete the stored object.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AssetDomainEvent } from './asset-domain.event';

// -----------------------------------------------------------------------------
// Asset Archived Event
// -----------------------------------------------------------------------------

export class AssetArchivedEvent extends AssetDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    aggregateId: string,
    public readonly publicId: string,
    public readonly archivedAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      aggregateId,
      'AssetAggregate',
      'AssetArchived',
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
      archivedAt: new Date(this.archivedAt.getTime()),
    };
  }
}
