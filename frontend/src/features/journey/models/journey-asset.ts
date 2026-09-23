// -----------------------------------------------------------------------------
// sisiMove — Journey Asset Model
// -----------------------------------------------------------------------------
//
// Journey-domain association to an Asset.
//
// The actual Asset entity belongs to the Assets domain. Therefore this model
// intentionally stores only assetPublicId and Journey-specific metadata.
//
// Do not create:
//   asset: Asset
//
// here. Cross-domain references remain opaque public identifiers.
// -----------------------------------------------------------------------------

export enum JourneyAssetType {
  VEHICLE = 'VEHICLE',
  ROUTE = 'ROUTE',
  OTHER = 'OTHER',
}

export interface JourneyAsset {
  publicId: string;

  assetPublicId: string;

  type: JourneyAssetType;

  sortOrder: number;
}