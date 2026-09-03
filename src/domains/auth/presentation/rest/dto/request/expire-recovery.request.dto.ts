// -----------------------------------------------------------------------------
// Recovery — Expire Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for expiring a Recovery aggregate.
//
// Aggregate:
//
// RecoveryAggregate
// └── RecoveryEntity
//
// This DTO contains transport-level primitive values only.
//
// Domain Value Objects MUST NOT be used in this DTO.
//
// DTO-to-domain conversion belongs at the presentation/application boundary.
//
// -----------------------------------------------------------------------------
//
// ExpireRecoveryCommand:
//
//   recoveryPublicId
//   referenceDate
//   correlationId
//   causationId?
//
// The recoveryPublicId is supplied through the HTTP route:
//
//     PATCH /recoveries/:recoveryPublicId/expire
//
// Therefore it is intentionally NOT part of this request body DTO.
//
// -----------------------------------------------------------------------------
//
// Required:
//
// - referenceDate;
// - correlationId.
//
// Optional:
//
// - causationId.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "referenceDate": "2026-09-01T12:30:00.000Z",
//       "correlationId": "COR-01K3R8Y7Q2",
//       "causationId": "CMD-01K3R8Y6M4"
//     }
//
// -----------------------------------------------------------------------------
//
// This DTO does NOT:
//
// - determine whether the Recovery has expired;
// - modify Recovery state;
// - calculate the Recovery expiry timestamp;
// - construct RecoveryPublicId;
// - construct RecoveryExpiresAt;
// - generate recovery tokens;
// - hash recovery tokens;
// - validate recovery tokens;
// - reset passwords;
// - modify Authentication;
// - revoke Sessions;
// - access Prisma;
// - persist Recovery;
// - publish domain events;
// - perform external side effects.
//
// -----------------------------------------------------------------------------
//
// Reference date:
//
// `referenceDate` represents the point in time against which the Recovery
// aggregate evaluates its expiration rule.
//
// It is deliberately supplied by the caller rather than generated inside
// the controller or domain aggregate.
//
// The controller converts the validated ISO 8601 string into a native Date
// before constructing ExpireRecoveryCommand.
//
// -----------------------------------------------------------------------------
//
// Correlation / causation:
//
// correlationId is required and identifies the overall expiration operation.
//
// causationId is optional and identifies the command, event, or operation
// that caused this expiration request.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS Swagger
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Class Transformer
// -----------------------------------------------------------------------------

import { Transform, type TransformFnParams } from 'class-transformer';

// -----------------------------------------------------------------------------
// Class Validator
// -----------------------------------------------------------------------------

import {
  IsDateString,
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

const MIN_REFERENCE_DATE_LENGTH = 1;
const MAX_REFERENCE_DATE_LENGTH = 64;

const MIN_CORRELATION_ID_LENGTH = 1;
const MAX_CORRELATION_ID_LENGTH = 128;

const MIN_CAUSATION_ID_LENGTH = 1;
const MAX_CAUSATION_ID_LENGTH = 128;

// =============================================================================
// DTO
// =============================================================================

/**
 * REST request DTO for expiring a Recovery aggregate.
 *
 * All properties remain transport-level primitives.
 *
 * The application/presentation boundary is responsible for converting
 * `referenceDate` into the native Date required by ExpireRecoveryCommand.
 *
 * The Recovery aggregate remains responsible for determining whether
 * expiration is actually permitted or required.
 */
export class ExpireRecoveryRequestDto {
  // ===========================================================================

  // Reference Date
  // ===========================================================================

  /**
   * Point in time against which the Recovery expiration rule is evaluated.
   *
   * Transport type: ISO 8601 string.
   *
   * This is NOT the Recovery's configured expiration timestamp.
   *
   * `expiresAt` belongs to the Recovery itself and is established during
   * Recovery creation.
   *
   * `referenceDate` represents the caller-supplied time used to evaluate
   * whether expiration should occur.
   */
  @ApiProperty({
    example: '2026-09-01T12:30:00.000Z',
    description:
      'ISO 8601 timestamp used as the reference point for evaluating whether the Recovery has expired.',
    format: 'date-time',
  })
  @Transform(trimString)
  @IsString({
    message: 'referenceDate must be a string.',
  })
  @MinLength(MIN_REFERENCE_DATE_LENGTH, {
    message: 'referenceDate must not be empty.',
  })
  @MaxLength(MAX_REFERENCE_DATE_LENGTH, {
    message: `referenceDate must not exceed ${MAX_REFERENCE_DATE_LENGTH} characters.`,
  })
  @IsDateString(
    {},
    {
      message: 'referenceDate must be a valid ISO 8601 date-time.',
    },
  )
  referenceDate!: string;

  // ===========================================================================

  // Correlation ID
  // ===========================================================================

  /**
   * Correlation identifier for the Recovery expiration operation.
   *
   * Transport type: string.
   *
   * This value is propagated through the application workflow and may be
   * included in RecoveryExpiredEvent when the aggregate performs the
   * expiration transition.
   */
  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description:
      'Correlation identifier for the Recovery expiration operation and resulting domain events.',
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

  // Causation ID
  // ===========================================================================

  /**
   * Optional identifier of the command, event, or operation that caused
   * this Recovery expiration request.
   *
   * Transport type: string.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, event, or operation that caused this Recovery expiration request.',
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
  MIN_REFERENCE_DATE_LENGTH as RECOVERY_REFERENCE_DATE_MIN_LENGTH,
  MAX_REFERENCE_DATE_LENGTH as RECOVERY_REFERENCE_DATE_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as RECOVERY_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as RECOVERY_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as RECOVERY_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as RECOVERY_CAUSATION_ID_MAX_LENGTH,
};

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ExpireRecoveryRequestDto;
