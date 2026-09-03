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
// The application handler is responsible for converting this DTO into the
// domain-ready RejectVerificationCommand.
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
// `reviewedByPublicId` identifies the Identity that performed the rejection
// review.
//
// This is an opaque public identity reference.
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
// Example:
//
//     {
//       "identityPublicId": "IDN-01K3R8Y7Q2",
//       "requestPublicId": "VRQ-01K3R8Y8M4",
//       "reviewedByPublicId": "IDN-01K3R8Y6M2",
//       "reason": "Submitted verification evidence does not satisfy the required criteria.",
//       "correlationId": "COR-01K3R8Y9P6",
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

const MIN_REASON_LENGTH = 1;
const MAX_REASON_LENGTH = 1000;

const MIN_CORRELATION_ID_LENGTH = 1;
const MAX_CORRELATION_ID_LENGTH = 128;

const MIN_CAUSATION_ID_LENGTH = 1;
const MAX_CAUSATION_ID_LENGTH = 128;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for rejecting a Verification aggregate.
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
 * - Verification status;
 * - Verification lifecycle state transitions;
 * - VerificationRequestEntity;
 * - domain events;
 * - persistence identifiers.
 *
 * Those concerns belong to the application and domain boundaries.
 */
export class RejectVerificationRequestDto {
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
   * Public identifier of the VerificationRequest associated with the
   * aggregate-level rejection decision.
   *
   * The VerificationAggregate is responsible for resolving the request and
   * validating that it belongs to the aggregate.
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
  // Reviewed By Public ID
  // ===========================================================================

  /**
   * Public identifier of the Identity that performed the verification review
   * and rejection.
   *
   * This is an opaque actor reference. The reviewer Identity is not loaded or
   * mutated by this command.
   */
  @ApiProperty({
    example: 'IDN-01K3R8Y6M2',
    description:
      'Opaque public identifier of the Identity that performed the verification review and rejection.',
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

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the rejection operation and resulting domain
   * event.
   */
  @ApiProperty({
    example: 'COR-01K3R8Y9P6',
    description:
      'Correlation identifier for the rejection operation and resulting domain event.',
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
   * rejection request.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, event, or operation that caused this rejection request.',
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
   * Optional timestamp at which the rejection review is considered to have
   * occurred.
   *
   * When omitted, the application handler/aggregate uses the current time.
   *
   * The transport representation is an ISO 8601 date-time string and is
   * converted to a Date at the DTO transformation boundary.
   */
  @ApiPropertyOptional({
    example: '2026-08-28T13:30:00.000Z',
    description:
      'Optional ISO 8601 timestamp at which the rejection review is considered to have occurred. When omitted, the current time is used.',
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
  MIN_PUBLIC_ID_LENGTH as VERIFICATION_REJECT_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as VERIFICATION_REJECT_PUBLIC_ID_MAX_LENGTH,
  MIN_REASON_LENGTH as VERIFICATION_REJECT_REASON_MIN_LENGTH,
  MAX_REASON_LENGTH as VERIFICATION_REJECT_REASON_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as VERIFICATION_REJECT_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as VERIFICATION_REJECT_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as VERIFICATION_REJECT_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as VERIFICATION_REJECT_CAUSATION_ID_MAX_LENGTH,
};
