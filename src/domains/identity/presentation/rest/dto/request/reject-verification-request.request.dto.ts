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
// - converting transport values into domain values;
// - invoking VerificationAggregate.rejectRequest(...);
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
// `reviewedByPublicId` identifies the Identity that performed the review.
//
// This is an opaque public identifier. The DTO does not resolve or mutate the
// reviewer Identity.
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
// Correlation / causation:
//
// - correlationId identifies the complete request-rejection operation;
// - causationId optionally identifies the command, event, or operation that
//   caused this rejection request.
//
// These values are application-level metadata propagated to the resulting
// domain event.
//
// -----------------------------------------------------------------------------
//
// Timestamp:
//
// `reviewedAt` is optional.
//
// When omitted, the application handler/aggregate uses the current time.
//
// The aggregate validates the resulting review timestamp.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "identityPublicId": "IDN-01K3R8Y7Q2",
//       "requestPublicId": "VRQ-01K3R8Y8N4",
//       "reviewedByPublicId": "IDN-01K3R9A1P6",
//       "reason": "The submitted government ID could not be verified.",
//       "correlationId": "COR-01K3R8Z1M4",
//       "causationId": "CMD-01K3R8Y6M4",
//       "reviewedAt": "2026-08-28T13:30:00.000Z"
//     }
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS Swagger
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Class Transformer
// -----------------------------------------------------------------------------

import { Transform, Type, type TransformFnParams } from 'class-transformer';

// -----------------------------------------------------------------------------
// Class Validator
// -----------------------------------------------------------------------------

import {
  IsDate,
  IsISO8601,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

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

const MIN_CORRELATION_ID_LENGTH = 1;
const MAX_CORRELATION_ID_LENGTH = 128;

const MIN_CAUSATION_ID_LENGTH = 1;
const MAX_CAUSATION_ID_LENGTH = 128;

const MIN_REASON_LENGTH = 1;
const MAX_REASON_LENGTH = 1024;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for rejecting a VerificationRequestEntity.
 *
 * Represents the transport-level intent to reject a submitted verification
 * request belonging to an existing Verification aggregate.
 *
 * Required transport input:
 *
 * - identityPublicId;
 * - requestPublicId;
 * - reviewedByPublicId;
 * - reason;
 * - correlationId.
 *
 * Optional transport input:
 *
 * - causationId;
 * - reviewedAt.
 *
 * The following values are intentionally NOT supplied:
 *
 * - VerificationRequest status;
 * - VerificationRequest lifecycle state;
 * - persistence/internal identifiers;
 * - domain events;
 * - aggregate state.
 *
 * Those values are established and validated by the domain model.
 */
export class RejectVerificationRequestRequestDto {
  // ===========================================================================
  // Identity Public ID
  // ===========================================================================

  /**
   * Public identifier of the Identity that owns the Verification aggregate.
   *
   * This is an opaque cross-aggregate public identifier and not a
   * persistence/internal database identifier.
   */
  @ApiProperty({
    example: 'IDN-01K3R8Y7Q2',
    description:
      'Opaque public identifier of the Identity that owns the Verification aggregate.',
    minLength: MIN_PUBLIC_ID_LENGTH,
    maxLength: MAX_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'identityPublicId must be a string.',
  })
  @MinLength(MIN_PUBLIC_ID_LENGTH, {
    message: 'identityPublicId must not be empty.',
  })
  @MaxLength(MAX_PUBLIC_ID_LENGTH, {
    message: `identityPublicId must not exceed ${MAX_PUBLIC_ID_LENGTH} characters.`,
  })
  identityPublicId!: string;

  // ===========================================================================
  // Verification Request Public ID
  // ===========================================================================

  /**
   * Public identifier of the VerificationRequest to reject.
   *
   * The VerificationAggregate resolves this request and verifies that it
   * belongs to the target aggregate.
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
  // Reviewer Public ID
  // ===========================================================================

  /**
   * Public identifier of the Identity that performed the verification review.
   *
   * This is an opaque public reference. The DTO does not resolve or mutate the
   * referenced Identity.
   */
  @ApiProperty({
    example: 'IDN-01K3R9A1P6',
    description:
      'Opaque public identifier of the Identity that performed the verification review.',
    minLength: MIN_PUBLIC_ID_LENGTH,
    maxLength: MAX_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'reviewedByPublicId must be a string.',
  })
  @MinLength(MIN_PUBLIC_ID_LENGTH, {
    message: 'reviewedByPublicId must not be empty.',
  })
  @MaxLength(MAX_PUBLIC_ID_LENGTH, {
    message: `reviewedByPublicId must not exceed ${MAX_PUBLIC_ID_LENGTH} characters.`,
  })
  reviewedByPublicId!: string;

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

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the request-rejection operation and resulting
   * domain event.
   */
  @ApiProperty({
    example: 'COR-01K3R8Z1M4',
    description:
      'Correlation identifier for the VerificationRequest rejection operation and resulting domain event.',
    minLength: MIN_CORRELATION_ID_LENGTH,
    maxLength: MAX_CORRELATION_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'correlationId must be a string.',
  })
  @MinLength(MIN_CORRELATION_ID_LENGTH, {
    message: 'correlationId must not be empty.',
  })
  @MaxLength(MAX_CORRELATION_ID_LENGTH, {
    message: `correlationId must not exceed ${MAX_CORRELATION_ID_LENGTH} characters.`,
  })
  correlationId!: string;

  // ===========================================================================
  // Causation
  // ===========================================================================

  /**
   * Optional identifier of the command, event, or operation that caused this
   * VerificationRequest rejection.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, event, or operation that caused this VerificationRequest rejection.',
    nullable: true,
    minLength: MIN_CAUSATION_ID_LENGTH,
    maxLength: MAX_CAUSATION_ID_LENGTH,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString({
    message: 'causationId must be a string.',
  })
  @MinLength(MIN_CAUSATION_ID_LENGTH, {
    message: 'causationId must not be empty.',
  })
  @MaxLength(MAX_CAUSATION_ID_LENGTH, {
    message: `causationId must not exceed ${MAX_CAUSATION_ID_LENGTH} characters.`,
  })
  causationId?: string;

  // ===========================================================================
  // Reviewed At
  // ===========================================================================

  /**
   * Optional timestamp at which the VerificationRequest rejection review is
   * considered to have occurred.
   *
   * When omitted, the current time is used.
   *
   * The transport representation is an ISO 8601 date-time string and is
   * converted to a Date at the DTO transformation boundary.
   */
  @ApiPropertyOptional({
    example: '2026-08-28T13:30:00.000Z',
    description:
      'Optional ISO 8601 timestamp at which the VerificationRequest rejection review is considered to have occurred. When omitted, the current time is used.',
    format: 'date-time',
    nullable: true,
  })
  @Transform(trimString)
  @IsOptional()
  @IsISO8601(
    {},
    {
      message: 'reviewedAt must be a valid ISO 8601 date-time.',
    },
  )
  @Type(() => Date)
  @IsDate({
    message: 'reviewedAt must be a valid date.',
  })
  reviewedAt?: Date;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_PUBLIC_ID_LENGTH as VERIFICATION_REQUEST_REJECT_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as VERIFICATION_REQUEST_REJECT_PUBLIC_ID_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as VERIFICATION_REQUEST_REJECT_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as VERIFICATION_REQUEST_REJECT_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as VERIFICATION_REQUEST_REJECT_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as VERIFICATION_REQUEST_REJECT_CAUSATION_ID_MAX_LENGTH,
  MIN_REASON_LENGTH as VERIFICATION_REQUEST_REJECT_REASON_MIN_LENGTH,
  MAX_REASON_LENGTH as VERIFICATION_REQUEST_REJECT_REASON_MAX_LENGTH,
};
