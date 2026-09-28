// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Capacity Mapper
// -----------------------------------------------------------------------------
//
// Maps the backend JourneyDemandCapacityResponse contract into the frontend
// JourneyDemandCapacity model.
//
// IMPORTANT:
// The frontend model does NOT expose a persistence `id`. Only the publicId
// belongs in this application model.
//
// Capacity convenience flags are backend-provided and are copied directly.
// -----------------------------------------------------------------------------

import type { JourneyDemandCapacity } from '../models/journey-demand-capacity';

/**
 * Backend HTTP/application response consumed by this mapper.
 */
export interface JourneyDemandCapacityResponse {
  readonly publicId: string;

  readonly requestedSeats: number;
  readonly matchedSeats: number;
  readonly remainingSeats: number;

  readonly hasCapacity: boolean;
  readonly isFull: boolean;
  readonly isEmpty: boolean;
  readonly isPartiallyMatched: boolean;
  readonly isFullyMatched: boolean;

  readonly createdAt: string | Date;
  readonly updatedAt: string | Date;
}

/**
 * Maps one backend Journey Demand capacity response.
 */
export function mapJourneyDemandCapacity(
  response: JourneyDemandCapacityResponse,
): JourneyDemandCapacity {
  return {
    publicId: response.publicId,

    requestedSeats: response.requestedSeats,
    matchedSeats: response.matchedSeats,
    remainingSeats: response.remainingSeats,

    // Backend-provided capacity state.
    hasCapacity: response.hasCapacity,
    isFull: response.isFull,
    isEmpty: response.isEmpty,
    isPartiallyMatched: response.isPartiallyMatched,
    isFullyMatched: response.isFullyMatched,

    createdAt: new Date(response.createdAt),
    updatedAt: new Date(response.updatedAt),
  };
}