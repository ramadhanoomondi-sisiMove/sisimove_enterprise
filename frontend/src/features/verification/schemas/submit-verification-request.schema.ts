
import { z } from 'zod';

const verificationRequestTypeValues = [
  'PROFILE_PHOTO',
  'GOVERNMENT_ID',
  'DRIVER_LICENSE',
] as const;

export const submitVerificationRequestSchema = z.object({
  type: z.enum(verificationRequestTypeValues),
});

export type SubmitVerificationRequestInput = z.infer<
  typeof submitVerificationRequestSchema
>;
