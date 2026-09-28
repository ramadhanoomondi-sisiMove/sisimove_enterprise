// -----------------------------------------------------------------------------
// sisiMove — Journey Capacity Mapper
// -----------------------------------------------------------------------------
//
// availableSeats is backend-derived state and is consumed as returned.
// The frontend must not calculate or overwrite it here.
//
// -----------------------------------------------------------------------------

import type { JourneyCapacity } from "../models/journey-capacity";

export interface JourneyCapacityResponse {
  readonly publicId: string;
  readonly totalSeats: number;
  readonly bookedSeats: number;
  readonly availableSeats: number;
}

export const JourneyCapacityMapper = {
  fromResponse(response: JourneyCapacityResponse): JourneyCapacity {
    return {
      publicId: response.publicId,
      totalSeats: response.totalSeats,
      bookedSeats: response.bookedSeats,
      availableSeats: response.availableSeats,
    };
  },
};