// -----------------------------------------------------------------------------
// sisiMove — Journey Capacity Mapper
// -----------------------------------------------------------------------------
//
// Maps the raw Journey capacity API representation into the stable frontend
// JourneyCapacity model.
//
// Architectural boundary:
//
//   HTTP API response
//       │
//       ▼
//   mapJourneyCapacity()
//       │
//       ▼
//   JourneyCapacity model
//       │
//       ▼
//   Hooks / Components
//
// Capacity is represented by the total number of passenger seats and the
// number already booked.
//
// `availableSeats` is intentionally derived here rather than treated as an
// authoritative backend field:
//
//   availableSeats = totalSeats - bookedSeats
//
// This keeps the frontend convenience value consistent with the two
// authoritative capacity values exposed by the backend.
//
// The mapper does NOT mutate or send this derived value back to the API.
//
// -----------------------------------------------------------------------------

import type { JourneyCapacity } from '../models';

/**
 * Raw Journey capacity representation returned by the HTTP API.
 */
export interface JourneyCapacityApiResponse {
  /**
   * Public identifier of the capacity configuration.
   */
  publicId: string;

  /**
   * Total passenger seats available for the Journey.
   */
  totalSeats: number;

  /**
   * Number of passenger seats currently booked.
   */
  bookedSeats: number;

  /**
   * Creation timestamp, when provided.
   */
  createdAt?: string;

  /**
   * Last update timestamp, when provided.
   */
  updatedAt?: string;
}

/**
 * Map a raw Journey capacity API representation into the frontend model.
 *
 * @param capacity Raw capacity representation returned by the Journey API.
 * @returns Stable frontend JourneyCapacity model.
 */
export function mapJourneyCapacity(
  capacity: JourneyCapacityApiResponse,
): JourneyCapacity {
  return {
    publicId: capacity.publicId,
    totalSeats: capacity.totalSeats,
    bookedSeats: capacity.bookedSeats,
    availableSeats: Math.max(
      capacity.totalSeats - capacity.bookedSeats,
      0,
    ),
    createdAt: capacity.createdAt,
    updatedAt: capacity.updatedAt,
  };
}