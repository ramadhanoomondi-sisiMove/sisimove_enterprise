// -----------------------------------------------------------------------------
// sisiMove — Journey Asset Mapper
// -----------------------------------------------------------------------------
//
// Maps the transport/API representation of a Journey Asset into the frontend
// JourneyAsset model.
//
// Architectural responsibility:
// - Normalize API response data into the frontend model.
// - Preserve opaque public identifiers.
// - Preserve the backend asset type and ordering.
// - Keep transport concerns outside UI components.
//
// This mapper intentionally does NOT:
// - Resolve the referenced Asset aggregate.
// - Fetch asset URLs.
// - Transform asset types into presentation labels.
// - Reorder assets.
// - Infer asset metadata.
// - Perform API requests.
// - Apply UI-specific formatting.
//
// JourneyAsset.assetPublicId is an opaque reference to the Asset domain.
// Resolving that reference belongs to the appropriate Asset API/application
// boundary, not to this mapper.
// -----------------------------------------------------------------------------

import type { JourneyAsset } from '../models';

// -----------------------------------------------------------------------------
// API Response
// -----------------------------------------------------------------------------

/**
 * Transport representation returned by the Journey Asset API.
 *
 * The Journey controller exposes the association between a Journey and an
 * Asset through public identifiers. The referenced Asset itself is not
 * embedded in this response.
 */
export interface JourneyAssetApiResponse {
  publicId: string;

  /**
   * Public identifier of the Asset domain resource.
   *
   * This remains opaque to the Journey feature.
   */
  assetPublicId: string;

  /**
   * Asset classification within the Journey aggregate.
   */
  type: JourneyAsset['type'];

  /**
   * Presentation/order hint owned by the Journey Asset association.
   */
  sortOrder: number;

  createdAt?: string;
  updatedAt?: string;
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

/**
 * Maps a Journey Asset API response into the frontend JourneyAsset model.
 *
 * The mapping is intentionally identity-like because the API already exposes
 * the fields in the shape required by the frontend model.
 */
export function mapJourneyAsset(
  asset: JourneyAssetApiResponse,
): JourneyAsset {
  return {
    publicId: asset.publicId,
    assetPublicId: asset.assetPublicId,
    type: asset.type,
    sortOrder: asset.sortOrder,
    createdAt: asset.createdAt,
    updatedAt: asset.updatedAt,
  };
}