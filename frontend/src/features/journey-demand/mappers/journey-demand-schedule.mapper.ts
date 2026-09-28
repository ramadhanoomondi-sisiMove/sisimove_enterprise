// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Schedule Mapper
// -----------------------------------------------------------------------------
//
// Maps the backend JourneyDemandScheduleResponse contract into the frontend
// JourneyDemandSchedule model.
//
// The frontend model intentionally groups:
// - departure dates into `scheduleWindow`;
// - optional arrival dates into `arrivalWindow`.
//
// Backend-provided convenience flags are copied without recomputation.
// -----------------------------------------------------------------------------

import type { JourneyDemandSchedule } from '../models/journey-demand-schedule';

/**
 * Backend HTTP/application response consumed by this mapper.
 */
export interface JourneyDemandScheduleResponse {
  readonly publicId: string;

  readonly earliestDeparture: string | Date;
  readonly latestDeparture: string | Date;

  readonly targetArrival: string | Date | null;
  readonly maximumArrival: string | Date | null;

  readonly timezone: string;

  readonly hasTargetArrival: boolean;
  readonly hasMaximumArrival: boolean;
  readonly hasArrivalConstraint: boolean;
  readonly hasDepartureWindow: boolean;

  readonly isExactDepartureTime: boolean;
  readonly isExactArrivalTime: boolean;

  readonly createdAt: string | Date;
  readonly updatedAt: string | Date;
}

/**
 * Maps one backend Journey Demand schedule response.
 */
export function mapJourneyDemandSchedule(
  response: JourneyDemandScheduleResponse,
): JourneyDemandSchedule {
  return {
    publicId: response.publicId,

    scheduleWindow: {
      earliestDeparture: new Date(response.earliestDeparture),
      latestDeparture: new Date(response.latestDeparture),
    },

    arrivalWindow: {
      targetArrival:
        response.targetArrival === null
          ? undefined
          : new Date(response.targetArrival),

      maximumArrival:
        response.maximumArrival === null
          ? undefined
          : new Date(response.maximumArrival),
    },

    timezone: response.timezone,

    // These are backend facts. Do not derive them from the dates above.
    hasTargetArrival: response.hasTargetArrival,
    hasMaximumArrival: response.hasMaximumArrival,
    hasArrivalConstraint: response.hasArrivalConstraint,
    hasDepartureWindow: response.hasDepartureWindow,

    isExactDepartureTime: response.isExactDepartureTime,
    isExactArrivalTime: response.isExactArrivalTime,

    createdAt: new Date(response.createdAt),
    updatedAt: new Date(response.updatedAt),
  };
}