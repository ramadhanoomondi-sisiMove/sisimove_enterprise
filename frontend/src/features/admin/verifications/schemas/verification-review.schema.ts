
import { z } from "zod";

const rejectionReasonSchema = z
  .string()
  .trim()
  .min(1, "A reason is required.")
  .max(1000, "The reason must not exceed 1000 characters.");

export const rejectVerificationSchema = z.object({
  rejectionReason: rejectionReasonSchema,
});

export const revokeVerificationSchema = z.object({
  rejectionReason: rejectionReasonSchema,
});

export const rejectVerificationRequestSchema = z.object({
  rejectionReason: rejectionReasonSchema,
});

export const verificationReviewSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("reject"),
    rejectionReason: rejectionReasonSchema,
  }),
  z.object({
    action: z.literal("revoke"),
    rejectionReason: rejectionReasonSchema,
  }),
  z.object({
    action: z.literal("reject-request"),
    rejectionReason: rejectionReasonSchema,
  }),
]);

export type RejectVerificationFormValues = z.infer<
  typeof rejectVerificationSchema
>;

export type RevokeVerificationFormValues = z.infer<
  typeof revokeVerificationSchema
>;

export type RejectVerificationRequestFormValues = z.infer<
  typeof rejectVerificationRequestSchema
>;

export type VerificationReviewFormValues = z.infer<
  typeof verificationReviewSchema
>;
