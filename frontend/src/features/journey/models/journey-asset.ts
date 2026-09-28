import type { JourneyAssetType } from './journey-asset-type';

// -----------------------------------------------------------------------------
// sisiMove — Journey Asset Model
// -----------------------------------------------------------------------------
//
// Frontend projection of JourneyAsset.
//
// JourneyAsset is a Journey-owned association to an Asset bounded context.
// `assetPublicId` is therefore an opaque reference to the Asset context; it
// is not a URL and must not be treated as one.
//
// The Asset itself is resolved through the Asset bounded context / its public
// projection when the UI needs asset data such as a URL.
//
// This model intentionally contains only fields exposed by the Journey
// read projections. Persistence IDs and timestamps are not exposed.
// -----------------------------------------------------------------------------

export interface JourneyAsset {
  /**
   * JourneyAsset public identifier.
   *
   * This identifies the Journey-owned asset association.
   */
  readonly publicId: string;

  /**
   * Opaque public identifier of the referenced Asset.
   */
  readonly assetPublicId: string;

  /**
   * The role of the asset within the Journey.
   */
  readonly type: JourneyAssetType;

  /**
   * Display ordering of this asset within the Journey asset collection.
   */
  readonly sortOrder: number;
}