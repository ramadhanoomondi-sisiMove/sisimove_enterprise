// -----------------------------------------------------------------------------
// sisiMove — Assets
// Local Asset Delivery Service
// -----------------------------------------------------------------------------
//
// Infrastructure adapter responsible for resolving consumer-facing delivery
// URLs for Assets whose physical storage provider is LOCAL.
//
// This service implements AssetDeliveryPort.
//
// -----------------------------------------------------------------------------
//
// RESPONSIBILITY
//
// LocalAssetDeliveryService answers:
//
//     "What consumer-facing URL should represent this locally stored Asset?"
//
// It does NOT answer:
//
//     "How do we read the file from disk?"
//
// Physical file access remains the responsibility of AssetStoragePort.
//
// Therefore:
//
//     AssetStoragePort
//          = physical filesystem storage
//
//     AssetDeliveryPort
//          = consumer-facing delivery URL
//
// These responsibilities must remain separate.
//
// -----------------------------------------------------------------------------
//
// LOCAL DELIVERY MODEL
//
// A local filesystem path is never exposed to the consumer.
//
// For example:
//
//     ./storage/assets/vehicles/vehicle-123/image.jpg
//
// is an internal implementation detail.
//
// It must never become a public URL.
//
// Instead, the Asset is exposed through the application's public delivery
// boundary:
//
//     /api/v1/assets/public/{assetPublicId}
//
// The public Asset identifier is therefore the stable URL identity.
//
// -----------------------------------------------------------------------------
//
// WHY PUBLIC ID INSTEAD OF OBJECT KEY?
//
// Physical storage may change.
//
// Today:
//
//     LOCAL
//       └── ./storage/assets/...
//
// Later:
//
//     BUNNY
//       └── CDN
//
// Or:
//
//     AWS S3
//       └── CloudFront
//
// The Asset public identity must remain stable across those changes.
//
// Therefore:
//
//     AssetPublicId
//         = public identity
//
//     bucket + objectKey
//         = storage identity
//
// This adapter deliberately uses AssetPublicId for URL construction.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT
//
// This service does NOT:
//
// - access the filesystem;
// - create directories;
// - read files;
// - stream files;
// - generate signed URLs;
// - access Prisma;
// - access the Asset repository;
// - inspect Asset lifecycle;
// - inspect Asset visibility;
// - mutate Asset state;
// - expose bucket names;
// - expose object keys;
// - expose storage credentials.
//
// AssetDeliveryService has already established that the Asset is READY and
// PUBLIC before calling this adapter.
//
// -----------------------------------------------------------------------------
//
// DELIVERY FLOW
//
//     HTTP request
//          │
//          ▼
//     AssetDeliveryService
//          │
//          │ verifies:
//          │ - Asset exists
//          │ - Asset is usable
//          │ - Asset is public
//          │
//          ▼
//     AssetDeliveryPort
//          │
//          ▼
//     LocalAssetDeliveryService
//          │
//          ▼
//     /api/v1/assets/public/{assetPublicId}
//          │
//          ▼
//     Public Asset Controller
//          │
//          ▼
//     AssetStoragePort
//          │
//          ▼
//     LocalAssetStorageService
//          │
//          ▼
//     filesystem
//
// -----------------------------------------------------------------------------
//
// CONFIGURATION
//
// The public delivery base URL is configurable.
//
// Example:
//
//     ASSET_PUBLIC_BASE_URL=http://localhost:3001/api/v1
//
// This produces:
//
//     http://localhost:3001/api/v1/assets/public/AS-...
//
// In production:
//
//     ASSET_PUBLIC_BASE_URL=https://api.sisimove.com/api/v1
//
// The storage implementation does not need to change.
//
// -----------------------------------------------------------------------------
//
// URL SAFETY
//
// AssetPublicId is encoded before being placed into the URL path.
//
// Although the value object validates the public identity format, URL encoding
// keeps this adapter defensive and prevents the identifier from becoming
// interpreted as URL syntax.
//
// -----------------------------------------------------------------------------
//
// SYNCHRONOUS CONTRACT
//
// This adapter performs no I/O.
//
// It only constructs a URL from already available values.
//
// Therefore getUrl() is deliberately synchronous.
//
// The delivery port should use the same synchronous contract:
//
//     getUrl(request): AssetDeliveryResult
//
// This avoids artificial Promise.resolve() / Promise.reject() usage and keeps
// the abstraction aligned with the actual responsibility of this adapter.
//
// -----------------------------------------------------------------------------
//
// DEPENDENCY DIRECTION
//
//     Application
//          │
//          ▼
//     AssetDeliveryPort
//          ▲
//          │
//     Infrastructure
//          │
//          ▼
//     LocalAssetDeliveryService
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application
// -----------------------------------------------------------------------------

import type {
  AssetDeliveryPort,
  AssetDeliveryRequest,
  AssetDeliveryResult,
} from '../../application/ports/asset-delivery.port';

// =============================================================================
// Local Asset Delivery Service
// =============================================================================

@Injectable()
export class LocalAssetDeliveryService implements AssetDeliveryPort {
  // ===========================================================================
  // Configuration
  // ===========================================================================

  /**
   * Base URL of the application's public API.
   *
   * The value is captured when the service is constructed so URL generation
   * remains deterministic for the lifetime of the NestJS application.
   */
  private readonly publicBaseUrl: string;

  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor() {
    this.publicBaseUrl = this.resolvePublicBaseUrl();
  }

  // ===========================================================================
  // Delivery URL
  // ===========================================================================

  /**
   * Resolves the consumer-facing URL for a locally stored Asset.
   *
   * This adapter performs no I/O.
   *
   * It only translates the Asset's stable public identity into the URL of
   * the application's public Asset delivery endpoint.
   *
   * The Asset public identity is used instead of the physical storage
   * location so that storage implementation details never become part of
   * the public API.
   */
  public getUrl(request: AssetDeliveryRequest): AssetDeliveryResult {
    // -------------------------------------------------------------------------
    // Provider validation
    // -------------------------------------------------------------------------
    //
    // This adapter represents LOCAL delivery only.
    //
    // It must fail explicitly if another storage provider reaches it.
    //
    // This protects the infrastructure boundary from accidental provider
    // misconfiguration.
    //

    if (!request.storageProvider.isLocal()) {
      throw new Error(
        `LocalAssetDeliveryService cannot deliver Asset "${request.assetPublicId.toString()}" ` +
          `because its storage provider is "${request.storageProvider.toString()}".`,
      );
    }

    // -------------------------------------------------------------------------
    // Public identity
    // -------------------------------------------------------------------------
    //
    // The public identity is the only Asset-specific value required to build
    // the public delivery route.
    //
    // bucket and objectKey intentionally remain unused here.
    //
    // They belong to physical storage and must not leak into the consumer
    // delivery contract.
    //

    const assetPublicId = encodeURIComponent(request.assetPublicId.toString());

    // -------------------------------------------------------------------------
    // Stable public delivery URL
    // -------------------------------------------------------------------------
    //
    // The controller responsible for this route will resolve the Asset public
    // ID back to the Asset aggregate and stream the physical object through
    // AssetStoragePort.
    //
    // Therefore this URL is a stable logical resource URL rather than a
    // filesystem URL.
    //

    return {
      url: `${this.publicBaseUrl}/assets/public/${assetPublicId}`,
    };
  }

  // ===========================================================================
  // Configuration
  // ===========================================================================

  /**
   * Resolves the public API base URL used for local Asset delivery.
   *
   * ASSET_PUBLIC_BASE_URL should contain the application's public API base,
   * but must not contain the Asset delivery route itself.
   *
   * Example:
   *
   *     ASSET_PUBLIC_BASE_URL=http://localhost:3001/api/v1
   *
   * Result:
   *
   *     http://localhost:3001/api/v1/assets/public/AS-...
   *
   * A production deployment should provide an explicit public base URL.
   */
  private resolvePublicBaseUrl(): string {
    const configuredBaseUrl = process.env.ASSET_PUBLIC_BASE_URL?.trim();

    if (configuredBaseUrl === undefined || configuredBaseUrl.length === 0) {
      throw new Error(
        'ASSET_PUBLIC_BASE_URL must be configured for local Asset delivery.',
      );
    }

    return configuredBaseUrl.replace(/\/+$/, '');
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default LocalAssetDeliveryService;
