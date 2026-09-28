// -----------------------------------------------------------------------------
// sisiMove — Public Journey Mapper
// -----------------------------------------------------------------------------
//
// Maps the backend PublicJourneyResponse into the frontend PublicJourney
// marketplace/detail model.
//
// The backend public Journey query is the source of truth for this projection.
// The frontend does not reconstruct provider, trust, route, capacity, pricing,
// or other Journey information from separate raw domain objects.
//
// Public Journey intentionally does not contain Journey lifecycle status because
// the public projection does not expose it.
//
// -----------------------------------------------------------------------------

import type { PublicJourney } from "../models/public-journey";
import { JourneyProviderMapper } from "./journey-provider.mapper";
import { JourneyRouteMapper } from "./journey-route.mapper";
import type { JourneyRouteResponse } from "./journey-route.mapper";
import { JourneyScheduleMapper } from "./journey-schedule.mapper";
import type { JourneyScheduleResponse } from "./journey-schedule.mapper";
import { JourneyVehicleMapper } from "./journey-vehicle.mapper";
import type { JourneyVehicleResponse } from "./journey-vehicle.mapper";
import { JourneyCapacityMapper } from "./journey-capacity.mapper";
import type { JourneyCapacityResponse } from "./journey-capacity.mapper";
import { JourneyPricingMapper } from "./journey-pricing.mapper";
import type { JourneyPricingResponse } from "./journey-pricing.mapper";
import { JourneyPreferencesMapper } from "./journey-preferences.mapper";
import type { JourneyPreferencesResponse } from "./journey-preferences.mapper";
import { JourneyAssetMapper } from "./journey-asset.mapper";
import type { JourneyAssetResponse } from "./journey-asset.mapper";
import type { JourneyProviderResponse } from "./journey-provider.mapper";

export interface PublicJourneyResponse {
  readonly publicId: string;
  readonly provider: JourneyProviderResponse;
  readonly route: JourneyRouteResponse;
  readonly schedule: JourneyScheduleResponse;
  readonly vehicle: JourneyVehicleResponse;
  readonly capacity: JourneyCapacityResponse;
  readonly pricing: JourneyPricingResponse;
  readonly preferences: JourneyPreferencesResponse | null;
  readonly assets: readonly JourneyAssetResponse[];
}

export const PublicJourneyMapper = {
  fromResponse(response: PublicJourneyResponse): PublicJourney {
    return {
      publicId: response.publicId,
      provider: JourneyProviderMapper.fromResponse(response.provider),
      route: JourneyRouteMapper.fromResponse(response.route),
      schedule: JourneyScheduleMapper.fromResponse(response.schedule),
      vehicle: JourneyVehicleMapper.fromResponse(response.vehicle),
      capacity: JourneyCapacityMapper.fromResponse(response.capacity),
      pricing: JourneyPricingMapper.fromResponse(response.pricing),
      preferences: response.preferences
        ? JourneyPreferencesMapper.fromResponse(response.preferences)
        : null,
      assets: JourneyAssetMapper.fromResponses(response.assets),
    };
  },

  fromResponses(
    responses: readonly PublicJourneyResponse[],
  ): PublicJourney[] {
    return responses.map((response) =>
      PublicJourneyMapper.fromResponse(response),
    );
  },
};