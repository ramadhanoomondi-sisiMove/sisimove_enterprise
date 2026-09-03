// -----------------------------------------------------------------------------
// Identity — Reopen Verification Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for reopening a Verification aggregate.
//
// Aggregate:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity[]
//
// Reopening starts a new verification cycle for a previously unsuccessful or
// expired Verification.
//
// This request targets the Verification aggregate lifecycle.
//
// It is NOT:
//
// - creation of a new Verification aggregate;
// - creation of a VerificationRequest;
// - approval of a VerificationRequest;
// - granting MEMBER verification;
// - granting DRIVER verification.
//
// The application handler resolves the VerificationAggregate and invokes:
//
//     verificationAggregate.renew(...)
//
// The aggregate is responsible for:
//
// - validating the current Verification lifecycle state;
// - allowing reopening only from REJECTED or EXPIRED;
// - resetting the lifecycle state to PENDING;
// - resetting the verification level to NONE;
// - clearing current review state;
// - clearing current aggregate verification timestamps;
// - preserving historical VerificationRequest records;
// - enforcing aggregate invariants.
//
// This DTO does NOT:
//
// - mutate VerificationEntity directly;
// - mutate VerificationRequestEntity directly;
// - construct entities;
// - delete historical requests;
// - modify Identity;
// - assign Roles;
// - authenticate the Identity;
// - create sessions;
// - perform external verification-provider operations;
// - send notifications;
// - perform external side effects.
//
// -----------------------------------------------------------------------------
//
// Expected lifecycle:
//
// REJECTED ───────► PENDING
//
// EXPIRED ────────► PENDING
//
// PENDING ─────────X
//
// VERIFIED ────────X
//
// REVOKED ─────────X
//
// REJECTED and EXPIRED are therefore recoverable lifecycle states.
//
// REVOKED remains terminal and cannot be reopened.
//
// -----------------------------------------------------------------------------
//
// Historical evidence:
//
// Reopening does not delete previous VerificationRequest records or historical
// evidence results.
//
// A subsequent verification cycle creates new VerificationRequest records
// through CreateVerificationRequestCommand.
//
// -----------------------------------------------------------------------------
//
// Correlation:
//
// `correlationId` identifies the application operation.
//
// `causationId`, when supplied, identifies the command, event, or operation
// that caused the reopen request.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "verificationPublicId": "VER-01K3R8Y8M4",
//       "correlationId": "COR-01K3R8Y9P6",
//       "reopenedAt": "2026-08-28T13:30:00.000Z",
//       "causationId": "CMD-01K3R8Y6M4"
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
 * REST request for reopening a Verification aggregate.
 *
 * Represents the application-level intent to start a new Verification cycle
 * from the REJECTED or EXPIRED lifecycle state.
 *
 * Required transport input:
 *
 * - verificationPublicId;
 * - correlationId.
 *
 * Optional transport input:
 *
 * - reopenedAt;
 * - causationId.
 *
 * The following values are intentionally NOT supplied:
 *
 * - Verification status;
 * - Verification level;
 * - historical VerificationRequest records;
 * - VerificationRequest evidence;
 * - domain events;
 * - persistence/internal identifiers.
 *
 * Those concerns belong to the application and domain boundaries.
 */
export class ReopenVerificationRequestDto {
  // ===========================================================================
  // Verification Public ID
  // ===========================================================================

  /**
   * Public identifier of the Verification aggregate to reopen.
   *
   * This is an opaque public identifier and not a persistence/internal
   * database identifier.
   */
  @ApiProperty({
    example: 'VER-01K3R8Y8M4',
    description:
      'Opaque public identifier of the Verification aggregate to reopen.',
    minLength: MIN_PUBLIC_ID_LENGTH,
    maxLength: MAX_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'verificationPublicId must be a string.',
  })
  @MinLength(MIN_PUBLIC_ID_LENGTH, {
    message: 'verificationPublicId must not be empty.',
  })
  @MaxLength(MAX_PUBLIC_ID_LENGTH, {
    message: `verificationPublicId must not exceed ${MAX_PUBLIC_ID_LENGTH} characters.`,
  })
  verificationPublicId!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the reopen operation.
   *
   * This identifies the application-level operation and is propagated to
   * resulting domain events.
   */
  @ApiProperty({
    example: 'COR-01K3R8Y9P6',
    description:
      'Correlation identifier for the reopen operation and resulting domain event.',
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
  // Reopened At
  // ===========================================================================

  /**
   * Optional timestamp at which the new Verification cycle is opened.
   *
   * When omitted, the application handler/aggregate uses the current time.
   *
   * The transport representation is an ISO 8601 date-time string and is
   * converted to a Date at the DTO transformation boundary.
   */
  @ApiPropertyOptional({
    example: '2026-08-28T13:30:00.000Z',
    description:
      'Optional ISO 8601 timestamp at which the new Verification cycle is opened. When omitted, the current time is used.',
    format: 'date-time',
    nullable: true,
  })
  @Transform(trimString)
  @IsOptional()
  @IsISO8601(
    {},
    {
      message: 'reopenedAt must be a valid ISO 8601 date-time.',
    },
  )
  @Type(() => Date)
  @IsDate({
    message: 'reopenedAt must be a valid date.',
  })
  reopenedAt?: Date;

  // ===========================================================================
  // Causation
  // ===========================================================================

  /**
   * Optional identifier of the command, event, or operation that caused this
   * reopen request.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, event, or operation that caused this reopen request.',
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
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_PUBLIC_ID_LENGTH as VERIFICATION_REOPEN_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as VERIFICATION_REOPEN_PUBLIC_ID_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as VERIFICATION_REOPEN_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as VERIFICATION_REOPEN_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as VERIFICATION_REOPEN_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as VERIFICATION_REOPEN_CAUSATION_ID_MAX_LENGTH,
};
