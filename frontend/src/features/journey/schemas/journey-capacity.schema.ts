// -----------------------------------------------------------------------------
// sisiMove — Journey Capacity Schema
// -----------------------------------------------------------------------------

import { z } from 'zod';

export const journeyCapacitySchema = z.object({
  totalSeats: z
    .number()
    .int()
    .min(1, 'At least one seat is required')
    .max(100, 'Seat capacity is too large'),
});

export type JourneyCapacityInput = z.infer<
  typeof journeyCapacitySchema
>;