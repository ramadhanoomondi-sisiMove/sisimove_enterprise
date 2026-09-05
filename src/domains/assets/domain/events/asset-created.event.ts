// -----------------------------------------------------------------------------
// Asset — Asset Created Domain Event
// -----------------------------------------------------------------------------
//
// Raised when a new Asset aggregate is created.
//
// This event represents creation of the Asset domain object and its initial
// metadata. It does not mean that the physical asset has been uploaded,
// processed, or made ready.
//
// Lifecycle:
//
// Asset aggregate created
//        │
//        ▼
//    UPLOADING
//
// Physical storage operations belong to the application/infrastructure
// boundary, not this event.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AssetDomainEvent } from './asset-domain.event';

// -----------------------------------------------------------------------------
// Asset Created Event
// -----------------------------------------------------------------------------

export class AssetCreatedEvent extends AssetDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    aggregateId: string,
    public readonly publicId: string,
    public readonly ownerIdentityPublicId: string | undefined,
    public readonly type: string,
    public readonly category: string,
    public readonly visibility: string,
    public readonly storageProvider: string,
    public readonly bucket: string,
    public readonly objectKey: string,
    public readonly originalFilename: string | undefined,
    public readonly mimeType: string,
    public readonly sizeBytes: number,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      aggregateId,
      'AssetAggregate',
      'AssetCreated',
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
      ownerIdentityPublicId: this.ownerIdentityPublicId,
      type: this.type,
      category: this.category,
      visibility: this.visibility,
      storageProvider: this.storageProvider,
      bucket: this.bucket,
      objectKey: this.objectKey,
      originalFilename: this.originalFilename,
      mimeType: this.mimeType,
      sizeBytes: this.sizeBytes,
    };
  }
}
