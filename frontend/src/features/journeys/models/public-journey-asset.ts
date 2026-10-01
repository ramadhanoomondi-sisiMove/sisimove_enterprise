// -----------------------------------------------------------------------------
// sisiMove — Public Journey Asset
// -----------------------------------------------------------------------------
//
// Public representation of an Asset attached to a Journey.
//
// JourneyAsset is the Journey-domain association.
// Asset is an independent aggregate.
//
// The public representation therefore keeps the association information while
// exposing only the safe, renderable Asset representation.
//
// Excluded Asset persistence information includes:
// - internal database ID
// - ownerIdentityId
// - storageProvider
// - bucket
// - objectKey
// - lifecycle state
// - storage metadata
// -----------------------------------------------------------------------------

import type { PublicAsset } from "../../assets/models/public-asset";

export type PublicJourneyAssetType =
  | "VEHICLE"
  | "ROUTE"
  | "OTHER";

export interface PublicJourneyAsset {
  publicId: string;

  type: PublicJourneyAssetType;

  sortOrder: number;

  asset: PublicAsset;
}