// -----------------------------------------------------------------------------
// sisiMove — Journey Schedule Mapper
// -----------------------------------------------------------------------------

import type { JourneySchedule } from "../models/journey-schedule";

export interface JourneyScheduleResponse {
  readonly publicId: string;
  readonly departureAt: string;
  readonly arrivalAt: string | null;
  readonly timezone: string;
}

export const JourneyScheduleMapper = {
  fromResponse(response: JourneyScheduleResponse): JourneySchedule {
    return {
      publicId: response.publicId,
      departureAt: response.departureAt,
      arrivalAt: response.arrivalAt,
      timezone: response.timezone,
    };
  },
};