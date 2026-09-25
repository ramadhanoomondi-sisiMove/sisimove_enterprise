// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Capacity Schema
// -----------------------------------------------------------------------------
//
// Validation schema for requested passenger capacity.
//
// The frontend uses requestedSeats as the domain/UI terminology.
//
// The current backend command uses seatsRequired, so the API adapter should
// translate:
//
//     requestedSeats
//         ↓
//     seatsRequired
//
// -----------------------------------------------------------------------------

import { z } from 'zod';

export const journeyDemandCapacitySchema = z.object({
  requestedSeats: z
    .number()
    .int()
    .min(1, 'At least one seat is required.')
    .max(50, 'Requested seats cannot exceed 50.'),
});

export type JourneyDemandCapacityInput = z.infer<
  typeof journeyDemandCapacitySchema
>;