// -----------------------------------------------------------------------------
// sisiMove — My Journey Mapper
// -----------------------------------------------------------------------------
//
// Maps the authenticated MyJourneyResponse projection into the frontend
// MyJourney model.
//
// Unlike the public Journey projection, this projection contains the owner's
// Journey lifecycle state and timestamps.
//
// Null component projections remain null. The frontend must not fabricate
// missing components or infer that a Journey is ready for publication.
//
// -----------------------------------------------------------------------------

import type { MyJourney } from "../models/my-journey";
import type { JourneyStatus } from "../models/journey-status";

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

export interface MyJourneyResponse {
  readonly publicId: string;
  readonly status: string;
  readonly publishedAt: string | null;
  readonly startedAt: string | null;
  readonly completionRequestedAt: string | null;
  readonly completedAt: string | null;
  readonly cancelledAt: string | null;
  readonly expiredAt: string | null;

  readonly route: JourneyRouteResponse | null;
  readonly schedule: JourneyScheduleResponse | null;
  readonly vehicle: JourneyVehicleResponse | null;
  readonly capacity: JourneyCapacityResponse | null;
  readonly pricing: JourneyPricingResponse | null;
  readonly preferences: JourneyPreferencesResponse | null;
  readonly assets: readonly JourneyAssetResponse[];

  readonly createdAt: string;
  readonly updatedAt: string;
}

export const MyJourneyMapper = {
  fromResponse(response: MyJourneyResponse): MyJourney {
    return {
      publicId: response.publicId,
      status: response.status as JourneyStatus,

      publishedAt: response.publishedAt,
      startedAt: response.startedAt,
      completionRequestedAt: response.completionRequestedAt,
      completedAt: response.completedAt,
      cancelledAt: response.cancelledAt,
      expiredAt: response.expiredAt,

      route: response.route
        ? JourneyRouteMapper.fromResponse(response.route)
        : null,

      schedule: response.schedule
        ? JourneyScheduleMapper.fromResponse(response.schedule)
        : null,

      vehicle: response.vehicle
        ? JourneyVehicleMapper.fromResponse(response.vehicle)
        : null,

      capacity: response.capacity
        ? JourneyCapacityMapper.fromResponse(response.capacity)
        : null,

      pricing: response.pricing
        ? JourneyPricingMapper.fromResponse(response.pricing)
        : null,

      preferences: response.preferences
        ? JourneyPreferencesMapper.fromResponse(response.preferences)
        : null,

      assets: JourneyAssetMapper.fromResponses(response.assets),

      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  },

  fromResponses(
    responses: readonly MyJourneyResponse[],
  ): MyJourney[] {
    return responses.map((response) =>
      MyJourneyMapper.fromResponse(response),
    );
  },
};