// -----------------------------------------------------------------------------
// sisiMove — Journey Vehicle Mapper
// -----------------------------------------------------------------------------

import type { JourneyVehicle } from "../models/journey-vehicle";

// -----------------------------------------------------------------------------
// Resolved Asset Reference
// -----------------------------------------------------------------------------

export interface JourneyVehicleAssetResponse {
  readonly publicId: string;

  readonly url: string;
}

// -----------------------------------------------------------------------------
// Vehicle Response
// -----------------------------------------------------------------------------

export interface JourneyVehicleResponse {
  readonly publicId: string;

  readonly make: string;

  readonly model: string;

  readonly year: number | null;

  readonly color: string | null;

  readonly registration: string | null;

  /**
   * Opaque reference to the Asset bounded context.
   */
  readonly assetPublicId: string | null;

  /**
   * Resolved browser-facing Asset reference.
   */
  readonly asset: JourneyVehicleAssetResponse | null;
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export const JourneyVehicleMapper = {
  fromResponse(response: JourneyVehicleResponse): JourneyVehicle {
    return {
      publicId: response.publicId,
      make: response.make,
      model: response.model,
      year: response.year,
      color: response.color,
      registration: response.registration,
      assetPublicId: response.assetPublicId,
      asset: response.asset,
    };
  },
};