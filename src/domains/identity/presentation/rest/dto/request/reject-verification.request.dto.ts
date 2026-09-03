// -----------------------------------------------------------------------------
// Verification — Reject Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for rejecting a Verification aggregate.
//
// Aggregate:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity[]
//
// This DTO represents the transport-level intent to transition a Verification
// aggregate into the REJECTED lifecycle state.
//
// IMPORTANT DISTINCTION
//
// This request targets aggregate-level Verification rejection.
//
// It is NOT:
//
// - rejection of a VerificationRequest;
// - deletion of verification evidence;
// - mutation of Identity;
// - authentication or session revocation.
//
// VerificationRequest rejection uses:
//
//     verificationAggregate.rejectRequest(...)
//
// Aggregate-level rejection uses:
//
//     verificationAggregate.reject(...)
//
// The application handler resolves the VerificationAggregate and converts this
// DTO into the domain-ready RejectVerificationCommand.
//
// The aggregate remains responsible for:
//
// - validating the lifecycle transition;
// - validating the reviewer;
// - validating the rejection reason;
// - resolving the supplied VerificationRequestEntity;
// - enforcing aggregate invariants;
// - changing the Verification lifecycle state;
// - recording VerificationRejectedEvent.
//
// -----------------------------------------------------------------------------
//
// Expected lifecycle:
//
// PENDING ───────► REJECTED
//
// REJECTED ──────► PENDING
//
// The aggregate itself enforces whether the requested transition is valid.
//
// -----------------------------------------------------------------------------
//
// Request association:
//
// `requestPublicId` identifies the VerificationRequest associated with the
// aggregate-level rejection decision.
//
// The request is not constructed or resolved by this DTO.
//
// -----------------------------------------------------------------------------
//
// Reviewer:
//
// The Identity performing the rejection is NOT supplied by the client.
//
// The application resolves the authenticated reviewer from:
//
//     req.user.sub
//
// -----------------------------------------------------------------------------
//
// Rejection reason:
//
// `reason` describes why the Verification aggregate was rejected.
//
// The aggregate remains responsible for domain-level normalization and
// validation.
//
// -----------------------------------------------------------------------------
//
// Application metadata:
//
// The application layer is responsible for establishing:
//
// - verificationPublicId from the route;
// - reviewedByPublicId from the authenticated security context;
// - correlationId;
// - causationId;
// - reviewedAt.
//
// These values are deliberately excluded from the request body.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "requestPublicId": "VRQ-01K3R8Y8M4",
//       "reason": "Submitted verification evidence does not satisfy the required criteria."
//     }
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS Swagger
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Class Transformer
// -----------------------------------------------------------------------------

import { Transform, type TransformFnParams } from 'class-transformer';

// -----------------------------------------------------------------------------
// Class Validator
// -----------------------------------------------------------------------------

import { IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_PUBLIC_ID_LENGTH = 1;
const MAX_PUBLIC_ID_LENGTH = 128;

const MIN_REASON_LENGTH = 1;
const MAX_REASON_LENGTH = 1000;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for rejecting a Verification aggregate.
 *
 * Represents the application-level intent to transition an eligible
 * Verification into the REJECTED lifecycle state.
 *
 * Required transport input:
 *
 * - requestPublicId;
 * - reason.
 *
 * The Verification aggregate is identified by the route parameter:
 *
 *     :verificationPublicId
 *
 * The authenticated reviewer is resolved from the security context.
 *
 * The following values are intentionally NOT supplied by the client:
 *
 * - verificationPublicId;
 * - identityPublicId;
 * - reviewedByPublicId;
 * - correlationId;
 * - causationId;
 * - reviewedAt;
 * - Verification status;
 * - Verification lifecycle state;
 * - VerificationRequestEntity;
 * - domain events;
 * - persistence/internal identifiers.
 *
 * Those concerns belong to the application and domain boundaries.
 */
export class RejectVerificationRequestDto {
  // ===========================================================================
  // Verification Request Public ID
  // ===========================================================================

  /**
   * Public identifier of the VerificationRequest associated with the
   * aggregate-level rejection decision.
   *
   * The VerificationAggregate is responsible for resolving the request and
   * validating that it belongs to the target Verification aggregate.
   */
  @ApiProperty({
    example: 'VRQ-01K3R8Y8M4',
    description:
      'Opaque public identifier of the VerificationRequest associated with the aggregate-level rejection decision.',
    minLength: MIN_PUBLIC_ID_LENGTH,
    maxLength: MAX_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'requestPublicId must be a string.',
  })
  @MinLength(MIN_PUBLIC_ID_LENGTH, {
    message: 'requestPublicId must not be empty.',
  })
  @MaxLength(MAX_PUBLIC_ID_LENGTH, {
    message: `requestPublicId must not exceed ${MAX_PUBLIC_ID_LENGTH} characters.`,
  })
  requestPublicId!: string;

  // ===========================================================================
  // Reason
  // ===========================================================================

  /**
   * Business reason for rejecting the Verification aggregate.
   *
   * The aggregate remains responsible for domain-level normalization and
   * validation of the rejection reason.
   */
  @ApiProperty({
    example:
      'Submitted verification evidence does not satisfy the required criteria.',
    description:
      'Business reason explaining why the Verification aggregate is being rejected.',
    minLength: MIN_REASON_LENGTH,
    maxLength: MAX_REASON_LENGTH,
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
  MIN_PUBLIC_ID_LENGTH as VERIFICATION_REJECT_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as VERIFICATION_REJECT_PUBLIC_ID_MAX_LENGTH,
  MIN_REASON_LENGTH as VERIFICATION_REJECT_REASON_MIN_LENGTH,
  MAX_REASON_LENGTH as VERIFICATION_REJECT_REASON_MAX_LENGTH,
};
