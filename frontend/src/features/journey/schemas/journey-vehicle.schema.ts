// -----------------------------------------------------------------------------
// sisiMove — Journey Vehicle Schema
// -----------------------------------------------------------------------------
//
// Frontend validation schema for attaching vehicle details to a Journey.
//
// This schema validates user input only.
// Server-owned Journey state is intentionally excluded.
//
// -----------------------------------------------------------------------------

import { z } from 'zod';

export const journeyVehicleSchema = z.object({
  make: z
    .string()
    .trim()
    .min(1, 'Vehicle make is required')
    .max(100, 'Vehicle make is too long'),

  model: z
    .string()
    .trim()
    .min(1, 'Vehicle model is required')
    .max(100, 'Vehicle model is too long'),

  year: z
    .number()
    .int()
    .min(1886, 'Vehicle year is invalid')
    .max(
      new Date().getFullYear() + 1,
      'Vehicle year is invalid',
    )
    .nullable()
    .optional(),

  color: z
    .string()
    .trim()
    .max(50, 'Vehicle color is too long')
    .nullable()
    .optional(),

  registration: z
    .string()
    .trim()
    .max(50, 'Vehicle registration is too long')
    .nullable()
    .optional(),

  assetPublicId: z
    .string()
    .trim()
    .min(1, 'Vehicle asset is invalid')
    .nullable()
    .optional(),
});

export type JourneyVehicleInput = z.infer<
  typeof journeyVehicleSchema
>;