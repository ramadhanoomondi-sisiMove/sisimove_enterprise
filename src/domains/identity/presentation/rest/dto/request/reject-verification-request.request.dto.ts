// -----------------------------------------------------------------------------
// Verification Request — Reject Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for rejecting a VerificationRequestEntity owned by a
// Verification aggregate.
//
// Aggregate boundary:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity
//
// This DTO represents the transport-level intent to reject one submitted
// Verification Request.
//
// IMPORTANT:
//
// Rejecting a VerificationRequest is distinct from rejecting the parent
// Verification aggregate.
//
// Request rejection:
//
//     verificationAggregate.rejectRequest(...)
//
// Aggregate rejection:
//
//     verificationAggregate.reject(...)
//
// This request therefore targets only the VerificationRequest lifecycle.
//
// The application handler is responsible for:
//
// - resolving the VerificationAggregate;
// - resolving the authenticated reviewer from the security context;
// - converting transport values into domain values;
// - invoking VerificationAggregate.rejectRequest(...);
// - establishing application metadata;
// - persisting the aggregate.
//
// The aggregate is responsible for:
//
// - validating request ownership;
// - validating the reviewer;
// - validating the rejection reason;
// - validating the review timestamp;
// - enforcing the request lifecycle transition;
// - rejecting the VerificationRequestEntity;
// - recording VerificationRequestRejectedEvent.
//
// -----------------------------------------------------------------------------
//
// Request lifecycle:
//
// PENDING ───────► REJECTED
//
// REJECTED is terminal.
//
// The VerificationRequestEntity remains owned by the Verification aggregate
// and is retained as a historical record of the submitted evidence and its
// review outcome.
//
// A VerificationRequest does NOT expire.
//
// -----------------------------------------------------------------------------
//
// Important distinction:
//
// Rejecting a VerificationRequest does NOT:
//
// - reject the Verification aggregate;
// - cancel the Verification aggregate;
// - expire the Verification aggregate;
// - revoke the Verification aggregate;
// - modify Identity;
// - modify Identity roles;
// - modify authentication;
// - perform external side effects.
//
// The parent Verification aggregate remains governed by its own lifecycle.
//
// -----------------------------------------------------------------------------
//
// Reviewer:
//
// The Identity performing the review is NOT supplied by the client.
//
// The application resolves the authenticated reviewer from:
//
//     req.user.sub
//
// -----------------------------------------------------------------------------
//
// Rejection reason:
//
// `reason` describes why the VerificationRequest was rejected.
//
// The application boundary validates the transport representation while the
// aggregate performs the authoritative domain validation and normalization.
//
// -----------------------------------------------------------------------------
//
// Request identification:
//
// `requestPublicId` identifies the VerificationRequest being rejected.
//
// The Verification aggregate is identified by the route:
//
//     PATCH /verifications/:verificationPublicId/requests/:verificationRequestPublicId/reject
//
// -----------------------------------------------------------------------------
//
// Application metadata:
//
// The application layer is responsible for establishing:
//
// - verificationPublicId from the route;
// - reviewedByPublicId from the authenticated security context;
// - identityPublicId from the resolved Verification aggregate;
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
//       "requestPublicId": "VRQ-01K3R8Y8N4",
//       "reason": "The submitted government ID could not be verified."
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
const MAX_REASON_LENGTH = 1024;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for rejecting a VerificationRequestEntity.
 *
 * Represents the transport-level intent to reject a submitted Verification
 * Request belonging to an existing Verification aggregate.
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
 * - VerificationRequest status;
 * - VerificationRequest lifecycle state;
 * - persistence/internal identifiers;
 * - domain events;
 * - aggregate state.
 *
 * Those values are established and validated by the application and domain
 * boundaries.
 */
export class RejectVerificationRequestRequestDto {
  // ===========================================================================
  // Verification Request Public ID
  // ===========================================================================

  /**
   * Public identifier of the VerificationRequest to reject.
   *
   * The VerificationAggregate resolves this request and verifies that it
   * belongs to the target aggregate.
   *
   * This is an opaque public identifier and not a persistence/internal
   * database identifier.
   */
  @ApiProperty({
    example: 'VRQ-01K3R8Y8N4',
    description:
      'Opaque public identifier of the VerificationRequest to reject.',
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
  // Rejection Reason
  // ===========================================================================

  /**
   * Business reason for rejecting the VerificationRequest.
   *
   * The aggregate performs the authoritative domain validation and
   * normalization of this value.
   */
  @ApiProperty({
    example: 'The submitted government ID could not be verified.',
    description:
      'Business reason explaining why the VerificationRequest was rejected.',
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
  MIN_PUBLIC_ID_LENGTH as VERIFICATION_REQUEST_REJECT_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as VERIFICATION_REQUEST_REJECT_PUBLIC_ID_MAX_LENGTH,
  MIN_REASON_LENGTH as VERIFICATION_REQUEST_REJECT_REASON_MIN_LENGTH,
  MAX_REASON_LENGTH as VERIFICATION_REQUEST_REJECT_REASON_MAX_LENGTH,
};
