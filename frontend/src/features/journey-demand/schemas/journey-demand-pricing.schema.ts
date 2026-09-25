// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Pricing Schema
// -----------------------------------------------------------------------------
//
// Validation schema for the requester's price constraints.
//
// Monetary amounts are represented as integer minor units at the API boundary.
//
// Example:
//
//     KES 1,500.00
//         → 150000
//
// The current backend pricing command exposes:
//
//     currency
//     maxFare
//
// The frontend model retains the clearer domain terminology:
//
//     maximumPricePerSeat
//     preferredPricePerSeat
//
// The API adapter is responsible for translating the frontend contract to the
// backend DTO until the backend command exposes the preferred price field.
//
// -----------------------------------------------------------------------------

import { z } from 'zod';

const moneyMinorUnitsSchema = z
  .number()
  .int()
  .min(0, 'Amount cannot be negative.');

export const journeyDemandPricingSchema = z
  .object({
    maximumPricePerSeat: moneyMinorUnitsSchema
      .nullable()
      .optional(),

    preferredPricePerSeat: moneyMinorUnitsSchema
      .nullable()
      .optional(),

    currency: z
      .string()
      .trim()
      .length(3, 'Currency must be a 3-letter ISO currency code.')
      .transform((value) => value.toUpperCase())
      .default('KES'),
  })
  .superRefine((value, context) => {
    if (
      value.maximumPricePerSeat != null &&
      value.preferredPricePerSeat != null &&
      value.preferredPricePerSeat > value.maximumPricePerSeat
    ) {
      context.addIssue({
        code: 'custom',
        path: ['preferredPricePerSeat'],
        message:
          'Preferred price cannot be greater than the maximum price.',
      });
    }
  });

export type JourneyDemandPricingInput = z.infer<
  typeof journeyDemandPricingSchema
>;