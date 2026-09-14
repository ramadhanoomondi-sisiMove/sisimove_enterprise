// -----------------------------------------------------------------------------
// sisiMove — Assets
// Asset Delivery Port
// -----------------------------------------------------------------------------
//
// Application-facing abstraction for resolving a consumer-facing delivery URL
// for an Asset.
//
// This port is deliberately separate from AssetStoragePort.
//
// AssetStoragePort:
//
//     Physical object storage
//
// AssetDeliveryPort:
//
//     Consumer-facing delivery
//
// -----------------------------------------------------------------------------
//
// IMPORTANT
//
// URL resolution itself is synchronous.
//
// Implementations that merely construct a URL must not be forced to pretend
// that asynchronous I/O is taking place.
//
// If a future delivery implementation genuinely requires asynchronous work,
// that implementation belongs behind an appropriately asynchronous application
// capability rather than making this basic URL-resolution contract
// artificially asynchronous.
//
// -----------------------------------------------------------------------------
//
// The application layer depends only on this abstraction.
//
// Concrete delivery mechanisms belong to infrastructure.
//
// -----------------------------------------------------------------------------
//
// Dependency direction:
//
//     Application
//          │
//          ▼
//     AssetDeliveryPort
//          ▲
//          │
//          └── Infrastructure
//                ├── LocalAssetDeliveryService
//                └── BunnyAssetDeliveryService
//
// -----------------------------------------------------------------------------

import type { AssetPublicId } from '../../domain/value-objects/asset-public-id.vo';
import type { AssetBucket } from '../../domain/value-objects/asset-bucket.vo';
import type { AssetObjectKey } from '../../domain/value-objects/asset-object-key.vo';
import type { AssetStorageProvider } from '../../domain/value-objects/asset-storage-provider.vo';

// =============================================================================
// Asset Delivery Request
// =============================================================================

export interface AssetDeliveryRequest {
  /**
   * Stable public identity of the Asset.
   *
   * This may be used to construct a stable consumer-facing delivery route.
   *
   * The public identity is intentionally separated from physical storage
   * identity so storage implementation details never become public API
   * contracts.
   */
  readonly assetPublicId: AssetPublicId;

  /**
   * Physical storage provider containing the Asset object.
   *
   * This is infrastructure metadata and is never exposed directly to the
   * consumer.
   */
  readonly storageProvider: AssetStorageProvider;

  /**
   * Physical storage bucket containing the Asset object.
   */
  readonly bucket: AssetBucket;

  /**
   * Physical object key identifying the Asset in storage.
   */
  readonly objectKey: AssetObjectKey;
}

// =============================================================================
// Asset Delivery Result
// =============================================================================

export interface AssetDeliveryResult {
  /**
   * Consumer-facing delivery URL.
   *
   * Examples include:
   *
   * - application HTTP route;
   * - CDN URL;
   * - another stable delivery endpoint.
   */
  readonly url: string;
}

// =============================================================================
// Asset Delivery Port
// =============================================================================

export interface AssetDeliveryPort {
  /**
   * Resolves a consumer-facing delivery URL.
   *
   * URL resolution is deliberately synchronous because this contract performs
   * no storage access and no external I/O.
   *
   * The caller is responsible for establishing that the Asset is eligible for
   * the requested delivery operation.
   */
  getUrl(request: AssetDeliveryRequest): AssetDeliveryResult;
}
