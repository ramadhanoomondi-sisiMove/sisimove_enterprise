// -----------------------------------------------------------------------------
// sisiMove — Journey Asset Schema
// -----------------------------------------------------------------------------
//
// Journey assets reference assets that already exist in the Assets domain.
//
// Uploading/replacing/deleting an Asset remains the responsibility of the
// generic Assets feature.
// -----------------------------------------------------------------------------

import { z } from 'zod';

import { JourneyAssetType } from '../models/journey-asset';

export const journeyAssetSchema = z.object({
  assetPublicId: z
    .string()
    .trim()
    .min(1, 'Asset is required'),

  type: z
    .nativeEnum(JourneyAssetType),

  sortOrder: z
    .number()
    .int()
    .nonnegative()
    .default(0),
});

export type JourneyAssetInput = z.infer<
  typeof journeyAssetSchema
>;