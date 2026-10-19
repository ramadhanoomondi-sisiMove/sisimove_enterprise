// -----------------------------------------------------------------------------
// Verification Request — Reject Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for rejecting a VerificationRequestEntity owned by a
// Verification aggregate.
//
// IMPORTANT DISTINCTION
//
// Request-level rejection:
//
//   PATCH /verifications/:verificationPublicId/requests/:verificationRequestPublicId/reject
//
// Aggregate-level rejection:
//
//   PATCH /verifications/:verificationPublicId/reject
//
// This DTO is exclusively for request-level rejection.
//
// The Verification aggregate and Verification Request public IDs are supplied
// through the route parameters. They must NOT be duplicated in this body.
//
// The authenticated reviewer is resolved from the security context.
//
// Request body:
//
//   {
//     "reason": "The submitted government ID could not be verified."
//   }
//
// Responsibilities:
//
// - Validate the transport-level rejection reason.
// - Reject missing, non-string, blank, or excessively long reasons.
// - Keep reviewer identity and application metadata out of the request body.
//
// The application handler and domain aggregate remain responsible for
// authorization, request ownership, lifecycle invariants, persistence,
// and domain events.
//
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';

import { Transform, type TransformFnParams } from 'class-transformer';

import { IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_REASON_LENGTH = 1;
const MAX_REASON_LENGTH = 1024;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for rejecting one VerificationRequestEntity.
 *
 * The target Verification aggregate is identified by:
 *
 *   :verificationPublicId
 *
 * The target Verification Request is identified by:
 *
 *   :verificationRequestPublicId
 *
 * The authenticated reviewer is resolved from the security context.
 *
 * The only client-supplied body property is `reason`.
 */
export class RejectVerificationRequestRequestDto {
  // ===========================================================================
  // Rejection Reason
  // ===========================================================================

  /**
   * Business reason explaining why the submitted Verification Request
   * was rejected.
   *
   * The domain aggregate remains responsible for authoritative domain
   * validation and lifecycle enforcement.
   */
  @ApiProperty({
    example: 'The submitted government ID could not be verified.',
    description:
      'Business reason explaining why the Verification Request was rejected.',
    minLength: MIN_REASON_LENGTH,
    maxLength: MAX_REASON_LENGTH,
    type: String,
    required: true,
  })
  @Transform(trimString)
  @IsString({
    message: 'reason must be a string.',
  })
  @MinLength(MIN_REASON_LENGTH, {
    message: 'reason must not be empty.',
  })
  @MaxLength(MAX_REASON_LENGTH, {
    message: `reason must not exceed ${MAX_REASON_LENGTH} characters.`,
  })
  reason!: string;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_REASON_LENGTH as VERIFICATION_REQUEST_REJECT_REASON_MIN_LENGTH,
  MAX_REASON_LENGTH as VERIFICATION_REQUEST_REJECT_REASON_MAX_LENGTH,
};
