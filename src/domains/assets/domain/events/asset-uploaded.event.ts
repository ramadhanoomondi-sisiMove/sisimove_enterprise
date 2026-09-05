// -----------------------------------------------------------------------------
// Asset — Asset Uploaded Domain Event
// -----------------------------------------------------------------------------
//
// Raised when the physical asset has successfully been uploaded to the
// configured storage provider.
//
// This event does not mean that the asset has completed processing or is
// available for normal consumption.
//
// Lifecycle:
//
// UPLOADING
//     │
//     ▼
// UPLOADED
//
// Storage credentials, signed URLs, and other secret material must never be
// included in the event payload.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AssetDomainEvent } from './asset-domain.event';

// -----------------------------------------------------------------------------
// Asset Uploaded Event
// -----------------------------------------------------------------------------

export class AssetUploadedEvent extends AssetDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    aggregateId: string,
    public readonly publicId: string,
    public readonly storageProvider: string,
    public readonly bucket: string,
    public readonly objectKey: string,
    public readonly sizeBytes: number,
    public readonly uploadedAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      aggregateId,
      'AssetAggregate',
      'AssetUploaded',
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
      storageProvider: this.storageProvider,
      bucket: this.bucket,
      objectKey: this.objectKey,
      sizeBytes: this.sizeBytes,
      uploadedAt: new Date(this.uploadedAt.getTime()),
    };
  }
}
