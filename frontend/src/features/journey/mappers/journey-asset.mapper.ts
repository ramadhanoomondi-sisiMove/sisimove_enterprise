// -----------------------------------------------------------------------------
// sisiMove — Journey Asset Mapper
// -----------------------------------------------------------------------------
//
// JourneyAsset is the Journey-owned association to an Asset bounded context.
// assetPublicId remains an opaque reference.
//
// This mapper does not fetch the Asset and does not turn assetPublicId into
// an asset URL. Asset resolution belongs to the Asset feature/API.
//
// -----------------------------------------------------------------------------

import type { JourneyAsset } from "../models/journey-asset";
import type { JourneyAssetType } from "../models/journey-asset-type";

export interface JourneyAssetResponse {
  readonly publicId: string;
  readonly assetPublicId: string;
  readonly type: string;
  readonly sortOrder: number;
}

export const JourneyAssetMapper = {
  fromResponse(response: JourneyAssetResponse): JourneyAsset {
    return {
      publicId: response.publicId,
      assetPublicId: response.assetPublicId,
      type: response.type as JourneyAssetType,
      sortOrder: response.sortOrder,
    };
  },

  fromResponses(
    responses: readonly JourneyAssetResponse[],
  ): JourneyAsset[] {
    return responses.map((response) =>
      JourneyAssetMapper.fromResponse(response),
    );
  },
};