// -----------------------------------------------------------------------------
// sisiMove — Journey Pricing Schema
// -----------------------------------------------------------------------------

import { z } from 'zod';

export const journeyPricingSchema = z.object({
  amount: z
    .number()
    .int()
    .nonnegative('Price cannot be negative'),

  currency: z
    .string()
    .trim()
    .length(3, 'Currency must be a 3-letter ISO code')
    .transform((value) => value.toUpperCase())
    .default('KES'),
});

export type JourneyPricingInput = z.infer<
  typeof journeyPricingSchema
>;