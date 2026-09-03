// -----------------------------------------------------------------------------
// Verification Request — Approve Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for approving a VerificationRequestEntity owned by a
// Verification aggregate.
//
// Aggregate boundary:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity
//
// This DTO represents the transport-level intent to approve one submitted
// verification request.
//
// The DTO does NOT:
//
// - load the Verification aggregate;
// - construct VerificationEntity;
// - construct VerificationRequestEntity;
// - mutate either entity directly;
// - approve the VerificationRequestEntity directly;
// - approve the Verification aggregate directly;
// - perform persistence;
// - emit domain events;
// - modify Identity;
// - modify Identity roles;
// - perform asset-storage operations;
// - perform external verification-provider operations;
// - send notifications;
// - perform external side effects.
//
// The application layer converts this transport DTO into:
//
//     ApproveVerificationRequestCommand
//
// and the command handler invokes:
//
//     verificationAggregate.approveRequest(...)
//
// The aggregate remains responsible for all domain invariants and lifecycle
// transitions.
//
// -----------------------------------------------------------------------------
//
// Request lifecycle:
//
// PENDING ───────► APPROVED
//
// APPROVED is terminal.
//
// Only a currently reviewable PENDING request may be approved.
//
// A VerificationRequest does NOT expire.
//
// Expiration is not part of the VerificationRequest lifecycle and is not
// represented by VerificationRequestStatus.
//
// -----------------------------------------------------------------------------
//
// Verification lifecycle:
//
// Approval of a request may cause the parent Verification aggregate to
// advance:
//
// PENDING ───────► VERIFIED
//
// The aggregate determines whether the approved evidence satisfies the
// configured verification requirements.
//
// If the Verification aggregate has an expiration policy, that expiration
// belongs to the Verification lifecycle and is not supplied through this
// VerificationRequest approval DTO.
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
// Correlation / causation:
//
// - correlationId identifies the complete request-approval operation;
// - causationId optionally identifies the command, event, or operation that
//   caused this approval request.
//
// These values are application-level metadata.
//
// -----------------------------------------------------------------------------
//
// Timestamp:
//
// `reviewedAt` is optional.
//
// When omitted, the application handler/aggregate uses the current time.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "identityPublicId": "IDN-01K3R8Y7Q2",
//       "requestPublicId": "VRQ-01K3R8Y9P6",
//       "reviewedByPublicId": "IDN-01K3R8Z1M4",
//       "correlationId": "COR-01K3R8Z2N5",
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

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for approving a VerificationRequestEntity.
 *
 * Represents the transport-level intent to approve an existing submitted
 * VerificationRequest within a Verification aggregate.
 *
 * Required transport input:
 *
 * - identityPublicId;
 * - requestPublicId;
 * - reviewedByPublicId;
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
 * - approval state;
 * - verification level;
 * - verification evidence;
 * - Verification expiration;
 * - persistence/internal identifiers;
 * - domain events.
 *
 * Those values are established and validated by the aggregate.
 */
export class ApproveVerificationRequestRequestDto {
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
   * Public identifier of the VerificationRequest to approve.
   *
   * The VerificationAggregate resolves this request and validates that it
   * belongs to the target Verification aggregate.
   */
  @ApiProperty({
    example: 'VRQ-01K3R8Y9P6',
    description:
      'Opaque public identifier of the VerificationRequest to approve.',
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
   * This is an opaque public identity reference. The DTO does not resolve or
   * mutate the referenced Identity.
   */
  @ApiProperty({
    example: 'IDN-01K3R8Z1M4',
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
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the request-approval operation.
   */
  @ApiProperty({
    example: 'COR-01K3R8Z2N5',
    description:
      'Correlation identifier for the VerificationRequest approval operation and resulting domain events.',
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
   * approval request.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, event, or operation that caused this VerificationRequest approval.',
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
   * Optional timestamp at which the VerificationRequest approval is considered
   * to have occurred.
   *
   * When omitted, the application handler/aggregate uses the current time.
   *
   * The transport representation is an ISO 8601 date-time string and is
   * converted to a Date at the DTO transformation boundary.
   */
  @ApiPropertyOptional({
    example: '2026-08-28T13:30:00.000Z',
    description:
      'Optional ISO 8601 timestamp at which the VerificationRequest approval is considered to have occurred. When omitted, the current time is used.',
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
  MIN_PUBLIC_ID_LENGTH as VERIFICATION_REQUEST_APPROVE_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as VERIFICATION_REQUEST_APPROVE_PUBLIC_ID_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as VERIFICATION_REQUEST_APPROVE_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as VERIFICATION_REQUEST_APPROVE_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as VERIFICATION_REQUEST_APPROVE_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as VERIFICATION_REQUEST_APPROVE_CAUSATION_ID_MAX_LENGTH,
};
