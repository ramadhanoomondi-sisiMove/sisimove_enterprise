// -----------------------------------------------------------------------------
// sisiMove — Journey Vehicle Mapper
// -----------------------------------------------------------------------------

import type { JourneyVehicle } from "../models/journey-vehicle";

export interface JourneyVehicleResponse {
  readonly publicId: string;
  readonly make: string;
  readonly model: string;
  readonly year: number | null;
  readonly color: string | null;
  readonly registration: string | null;
  readonly assetPublicId: string | null;
}

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
    };
  },
};