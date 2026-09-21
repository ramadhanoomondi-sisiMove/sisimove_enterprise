// -----------------------------------------------------------------------------
// sisiMove — Public Asset API
// -----------------------------------------------------------------------------
//
// Frontend adapter for the public Asset reference boundary.
//
// The frontend does not mirror the Asset aggregate. Public experiences consume
// only the reduced representation required for rendering:
//
//     PublicAsset
//     ├── publicId
//     ├── url
//     └── alt
//
// The public Asset reference endpoint is responsible for resolving the
// browser-facing delivery URL:
//
//     GET /assets/public/:assetPublicId/reference
//
// The returned URL is then used by the browser to retrieve the actual Asset:
//
//     GET /assets/public/:assetPublicId
//
// -----------------------------------------------------------------------------
//
// ARCHITECTURE
// -----------------------------------------------------------------------------
//
// Public Journey / Traveller / Trust read model
//       │
//       │ Asset public ID
//       ▼
// getPublicAsset()
//       │
//       ▼
// GET /assets/public/:assetPublicId/reference
//       │
//       ▼
// AssetsController
//       │
//       ▼
// GetPublicAssetReferenceQueryHandler
//       │
//       ├── AssetRepository
//       │
//       └── AssetDeliveryPort
//                  │
//                  ▼
//             public HTTP URL
//                  │
//                  ▼
//             PublicAsset
//                  │
//                  └── url
//                       │
//                       ▼
//             GET /assets/public/:assetPublicId
//                       │
//                       ▼
//             GetPublicAssetContentHandler
//                       │
//                       ▼
//                 AssetStoragePort
//                       │
//                       ▼
//                 physical storage
//
// -----------------------------------------------------------------------------
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// There are two separate public Asset operations.
//
// 1. PUBLIC ASSET REFERENCE
//
//     GET /assets/public/:assetPublicId/reference
//
// This is a JSON API operation.
//
// It resolves a public Asset into a reduced public reference:
//
//     {
//       publicId,
//       url
//     }
//
// The backend AssetDeliveryPort owns URL resolution.
//
// The frontend does not know whether the resulting URL points to:
//
// - the backend API;
// - a CDN;
// - Bunny;
// - S3;
// - another delivery infrastructure.
//
//
//
// 2. PUBLIC ASSET CONTENT
//
//     GET /assets/public/:assetPublicId
//
// This is the actual binary delivery endpoint.
//
// The browser uses the URL returned by the reference operation to retrieve
// the Asset content.
//
// The backend remains responsible for:
//
// - resolving the Asset;
// - checking public visibility;
// - checking Asset lifecycle state;
// - retrieving physical content;
// - streaming the content.
//
// -----------------------------------------------------------------------------
//
// AUTHENTICATED ASSET MANAGEMENT
// -----------------------------------------------------------------------------
//
// The authenticated Asset-domain endpoint:
//
//     GET /assets/:assetPublicId
//
// is NOT used here.
//
// That endpoint belongs to the authenticated Asset management boundary.
//
// Public Asset consumption is deliberately separated from authenticated Asset
// management.
//
// -----------------------------------------------------------------------------
//
// PUBLIC ASSET REPRESENTATION
// -----------------------------------------------------------------------------
//
// PublicAsset is a frontend render model:
//
//     PublicAsset
//     ├── publicId
//     ├── url
//     └── alt
//
// The backend public reference response may only contain:
//
//     publicId
//     url
//
// `alt` is presentation metadata owned by the consuming public read model.
//
// For example, a Journey read model may provide:
//
//     asset: {
//       publicId: "...",
//       url: "...",
//       alt: "Vehicle exterior"
//     }
//
// The Asset reference endpoint therefore does not need to invent semantic
// alternative text from an opaque Asset identifier.
//
// -----------------------------------------------------------------------------
//
// NO LOCAL URL CONSTRUCTION
// -----------------------------------------------------------------------------
//
// This adapter deliberately does NOT construct:
//
//     /assets/public/:assetPublicId
//
// from `apiConfig.baseUrl`.
//
// The backend now owns public Asset URL resolution through:
//
//     AssetDeliveryPort
//
// This is important because the physical delivery location may change without
// requiring frontend knowledge of the storage implementation.
//
// The frontend consumes the URL returned by the public reference endpoint.
//
// -----------------------------------------------------------------------------
//
// NO BINARY REQUEST HERE
// -----------------------------------------------------------------------------
//
// `getPublicAsset()` does not retrieve the Asset binary.
//
// It performs only the public reference request:
//
//     GET /assets/public/:assetPublicId/reference
//
// The returned `url` is subsequently consumed by the browser:
//
//     <img src={asset.url} />
//
//     <Image src={asset.url} ... />
//
//     background-image: url(...)
//
// The browser therefore performs the actual binary request independently.
//
// -----------------------------------------------------------------------------
//
// MULTIPLE PUBLIC ASSETS
// -----------------------------------------------------------------------------
//
// A public Journey may contain multiple Asset references:
//
//     Journey
//     ├── provider.avatar
//     ├── trust.badges[].asset
//     ├── vehicle.asset
//     └── journey.assets[]
//
// The public Journey read boundary should normally provide the complete
// reduced PublicAsset representation for these references.
//
// This adapter exists for cases where a public Asset reference genuinely needs
// to be resolved independently.
//
// It must NOT become an N+1 Asset-discovery mechanism for Journey cards.
//
// For example, a Journey listing containing 20 cards with provider avatars
// should not perform 20 independent Asset reference requests when the Journey
// public read model can already provide the required PublicAsset objects.
//
// -----------------------------------------------------------------------------
//
// TRUST USE CASE
// -----------------------------------------------------------------------------
//
// Trust badges are an important consumer of this boundary.
//
// Trust may store only:
//
//     assetPublicId
//
// as an opaque reference.
//
// When a public Trust representation needs to resolve that Asset independently,
// this adapter can consume:
//
//     GET /assets/public/:assetPublicId/reference
//
// and obtain the public delivery URL.
//
// The frontend Trust model should ultimately consume:
//
//     PublicAsset
//
// rather than exposing the internal Trust Badge asset reference mechanics to
// presentation components.
//
// -----------------------------------------------------------------------------
//
// API BASE URL
// -----------------------------------------------------------------------------
//
// The reference request uses the same configured API base URL as the rest of
// the frontend application.
//
// This prevents the frontend from assuming:
//
//     frontend origin === backend origin
//
// For example:
//
//     frontend → localhost:3000
//     backend  → localhost:3001/api/v1
//
// The shared API client remains responsible for applying the configured API
// base URL and HTTP behavior.
//
// -----------------------------------------------------------------------------
//
// HTTP CLIENT
// -----------------------------------------------------------------------------
//
// Unlike the previous URL-builder implementation, this adapter DOES use the
// shared `apiClient`.
//
// That is intentional.
//
// The public Asset reference endpoint is a genuine JSON API operation:
//
//     GET /assets/public/:assetPublicId/reference
//
// Therefore it belongs behind the shared frontend HTTP transport.
//
// The adapter does not instantiate its own fetch client.
//
// -----------------------------------------------------------------------------


import { apiClient } from '@/foundation/http/api-client';

import type { PublicAsset } from '../models';

// =============================================================================
// Public Asset API Response
// =============================================================================
//
// The backend public Asset reference operation deliberately exposes only the
// information required by public consumers.
//
// The backend reference contract is:
//
//     {
//       publicId: string;
//       url: string;
//     }
//
// Alternative text remains a presentation concern of the consuming public
// read model.
//
// =============================================================================

interface PublicAssetReferenceResponse {
  publicId: string;
  url: string;
}

// =============================================================================
// Public Asset Reference Route
// =============================================================================
//
// This route matches the backend AssetsController:
//
//     GET /assets/public/:assetPublicId/reference
//
// `apiClient` is responsible for combining this path with the configured API
// base URL.
//
// =============================================================================

const PUBLIC_ASSET_REFERENCE_API_PATH = '/assets/public';

// =============================================================================
// Get Public Asset
// =============================================================================

/**
 * Resolves a public Asset reference through the backend Asset delivery
 * boundary.
 *
 * This is a JSON API request. It does not retrieve the Asset binary.
 *
 * The backend is responsible for determining whether the Asset exists, is
 * publicly visible, is usable, and where it should be delivered.
 *
 * @param publicId
 * Opaque public Asset identifier.
 *
 * @param alt
 * Optional semantic alternative text supplied by the consuming public
 * presentation/read model.
 *
 * @returns
 * PublicAsset containing the backend-resolved delivery URL.
 *
 * @throws
 * Error when the Asset public identifier is empty or the public reference
 * request fails.
 */
export async function getPublicAsset(
  publicId: string,
  alt = '',
): Promise<PublicAsset> {
  const normalizedPublicId = publicId.trim();

  if (normalizedPublicId.length === 0) {
    throw new Error('Asset public ID is required.');
  }

  const reference = await apiClient.get<PublicAssetReferenceResponse>(
    `${PUBLIC_ASSET_REFERENCE_API_PATH}/${encodeURIComponent(normalizedPublicId)}/reference`,
  );

  return {
    publicId: reference.publicId,
    url: reference.url,
    alt,
  };
}