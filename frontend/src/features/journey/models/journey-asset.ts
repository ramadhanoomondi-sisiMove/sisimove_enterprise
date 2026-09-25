// -----------------------------------------------------------------------------
// sisiMove — Journey Asset Model
// -----------------------------------------------------------------------------
//
// Frontend representation of a Journey asset attachment exposed by the
// Journey HTTP API.
//
// A JourneyAsset connects a Journey to an existing Asset domain resource using
// its public identifier. The underlying asset itself remains owned by the
// Assets domain.
//
// This model therefore represents the Journey-side attachment, not the full
// Asset resource.
//
// -----------------------------------------------------------------------------

import type { JourneyAssetType } from './journey-asset-type';

/**
 * Asset attached to a Journey.
 */
export interface JourneyAsset {
  /**
   * Public identifier of the Journey asset attachment.
   */
  publicId: string;

  /**
   * Public identifier of the underlying Asset domain resource.
   */
  assetPublicId: string;

  /**
   * Semantic role of the asset within the Journey.
   */
  type: JourneyAssetType;

  /**
   * Display ordering of the asset within its Journey.
   */
  sortOrder: number;

  /**
   * Creation timestamp returned by the API, when available.
   */
  createdAt?: string;

  /**
   * Last update timestamp returned by the API, when available.
   */
  updatedAt?: string;
}