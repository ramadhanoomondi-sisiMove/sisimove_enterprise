// -----------------------------------------------------------------------------
// Verification Request — Cancel Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for cancelling a VerificationRequestEntity owned by a
// Verification aggregate.
//
// Aggregate boundary:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity
//
// This DTO represents the transport-level intent to cancel one pending
// VerificationRequest.
//
// IMPORTANT:
//
// Cancelling a VerificationRequest is distinct from changing the lifecycle of
// the parent Verification aggregate.
//
// Request cancellation:
//
//     verificationAggregate.cancelRequest(...)
//
// This request therefore targets only the VerificationRequest lifecycle.
//
// The application handler is responsible for:
//
// - resolving the VerificationAggregate;
// - converting transport values into domain values;
// - invoking VerificationAggregate.cancelRequest(...);
// - persisting the aggregate.
//
// The aggregate is responsible for:
//
// - validating request ownership;
// - validating the request lifecycle transition;
// - cancelling the VerificationRequestEntity;
// - recording VerificationRequestCancelledEvent.
//
// -----------------------------------------------------------------------------
//
// Request lifecycle:
//
// PENDING ───────► CANCELLED
//
// CANCELLED is terminal.
//
// VerificationRequest does NOT expire.
//
// Expiration is not part of the VerificationRequest lifecycle and is not
// represented by this DTO.
//
// -----------------------------------------------------------------------------
//
// Important distinction:
//
// Cancelling a VerificationRequest does NOT:
//
// - cancel the Verification aggregate;
// - reject the Verification aggregate;
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
// Correlation / causation:
//
// - correlationId identifies the complete request-cancellation operation;
// - causationId optionally identifies the command, event, or operation that
//   caused this cancellation request.
//
// -----------------------------------------------------------------------------
//
// Timestamp:
//
// `cancelledAt` is optional.
//
// When omitted, the application handler/aggregate uses the current time.
//
// The aggregate validates the resulting cancellation timestamp.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "identityPublicId": "IDN-01K3R8Y7Q2",
//       "requestPublicId": "VRQ-01K3R8Y8N4",
//       "correlationId": "COR-01K3R8Z1M4",
//       "causationId": "CMD-01K3R8Y6M4",
//       "cancelledAt": "2026-08-28T13:30:00.000Z"
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
 * REST request for cancelling a VerificationRequestEntity.
 *
 * Represents the transport-level intent to cancel a pending VerificationRequest
 * belonging to an existing Verification aggregate.
 *
 * Required transport input:
 *
 * - identityPublicId;
 * - requestPublicId;
 * - correlationId.
 *
 * Optional transport input:
 *
 * - causationId;
 * - cancelledAt.
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
export class CancelVerificationRequestRequestDto {
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
   * Public identifier of the VerificationRequest to cancel.
   *
   * The VerificationAggregate resolves this request and verifies that it
   * belongs to the target aggregate.
   */
  @ApiProperty({
    example: 'VRQ-01K3R8Y8N4',
    description:
      'Opaque public identifier of the VerificationRequest to cancel.',
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
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the request-cancellation operation and
   * resulting domain event.
   */
  @ApiProperty({
    example: 'COR-01K3R8Z1M4',
    description:
      'Correlation identifier for the VerificationRequest cancellation operation and resulting domain event.',
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
   * VerificationRequest cancellation.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, event, or operation that caused this VerificationRequest cancellation.',
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
  // Cancelled At
  // ===========================================================================

  /**
   * Optional timestamp at which the VerificationRequest cancellation is
   * considered to have occurred.
   *
   * When omitted, the current time is used by the application/domain layer.
   *
   * The transport representation is an ISO 8601 date-time string and is
   * converted to a Date at the DTO transformation boundary.
   */
  @ApiPropertyOptional({
    example: '2026-08-28T13:30:00.000Z',
    description:
      'Optional ISO 8601 timestamp at which the VerificationRequest cancellation is considered to have occurred. When omitted, the current time is used.',
    format: 'date-time',
    nullable: true,
  })
  @Transform(trimString)
  @IsOptional()
  @IsISO8601(
    {},
    {
      message: 'cancelledAt must be a valid ISO 8601 date-time.',
    },
  )
  @Type(() => Date)
  @IsDate({
    message: 'cancelledAt must be a valid date.',
  })
  cancelledAt?: Date;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_PUBLIC_ID_LENGTH as VERIFICATION_REQUEST_CANCEL_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as VERIFICATION_REQUEST_CANCEL_PUBLIC_ID_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as VERIFICATION_REQUEST_CANCEL_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as VERIFICATION_REQUEST_CANCEL_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as VERIFICATION_REQUEST_CANCEL_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as VERIFICATION_REQUEST_CANCEL_CAUSATION_ID_MAX_LENGTH,
};
