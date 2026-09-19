// -----------------------------------------------------------------------------
// sisiMove — Submit Verification Request Schema
// -----------------------------------------------------------------------------
//
// Validation schema for submitting a new verification request.
//
// The frontend validates the user input before it crosses the API boundary.
// The backend remains authoritative for:
// - whether the verification type is currently required,
// - whether the user is eligible to submit it,
// - whether another request of the same type is already pending,
// - whether the referenced asset is valid and owned by the user.
//
// The asset itself is uploaded through the Assets feature. This schema only
// carries the resulting public identifier into the Verification workflow.
//
// -----------------------------------------------------------------------------

import { z } from 'zod';

const verificationRequestTypeValues = [
  'PROFILE_PHOTO',
  'GOVERNMENT_ID',
  'DRIVER_LICENSE',
] as const;

export const submitVerificationRequestSchema = z.object({
  type: z.enum(verificationRequestTypeValues),

  assetPublicId: z
    .string()
    .trim()
    .min(1, 'Verification asset is required.'),
});

export type SubmitVerificationRequestInput = z.infer<
  typeof submitVerificationRequestSchema
>;