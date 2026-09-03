// -----------------------------------------------------------------------------
// Recovery — Cancel Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for cancelling an existing Recovery.
//
// Aggregate:
//
// RecoveryAggregate
// └── RecoveryEntity
//
// This DTO contains transport-level primitive values only.
//
// All values remain primitive at the REST boundary:
//
//     recoveryPublicId → string
//     cancelledAt      → string
//     correlationId    → string
//     causationId      → string | undefined
//
// Conversion into domain Value Objects belongs at the
// presentation/application mapping boundary:
//
//     string → RecoveryPublicId
//     string → RecoveryCancelledAt
//
// This DTO does NOT:
//
// - import domain Value Objects;
// - cancel the Recovery directly;
// - modify Recovery state;
// - generate recovery tokens;
// - hash recovery tokens;
// - compare recovery tokens;
// - reset passwords;
// - modify Authentication;
// - revoke Sessions;
// - persist Recovery;
// - access Prisma;
// - send notifications;
// - perform external side effects.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "recoveryPublicId": "REC-01K3R8Y7Q2",
//       "cancelledAt": "2026-08-31T12:30:00.000Z",
//       "correlationId": "COR-01K3R8Y7Q2",
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
 * REST request for cancelling a Recovery.
 *
 * Required transport input:
 *
 * - recoveryPublicId;
 * - cancelledAt;
 * - correlationId.
 *
 * Optional transport input:
 *
 * - causationId.
 *
 * All properties are primitive transport values.
 *
 * Domain Value Objects are created only after the request crosses the
 * presentation/application mapping boundary.
 */
export class CancelRecoveryRequestDto {
  // ===========================================================================
  // Recovery Public ID
  // ===========================================================================

  /**
   * Public identifier of the Recovery aggregate to cancel.
   *
   * Transport type:
   *
   *     string
   *
   * Application mapping:
   *
   *     string → RecoveryPublicId
   */
  @ApiProperty({
    example: 'REC-01K3R8Y7Q2',
    description: 'Public identifier of the Recovery aggregate to cancel.',
    minLength: MIN_PUBLIC_ID_LENGTH,
    maxLength: MAX_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'recoveryPublicId must be a string.',
  })
  @MinLength(MIN_PUBLIC_ID_LENGTH, {
    message: 'recoveryPublicId must not be empty.',
  })
  @MaxLength(MAX_PUBLIC_ID_LENGTH, {
    message: `recoveryPublicId must not exceed ${MAX_PUBLIC_ID_LENGTH} characters.`,
  })
  recoveryPublicId!: string;

  // ===========================================================================
  // Cancelled At
  // ===========================================================================

  /**
   * Timestamp at which the Recovery is cancelled.
   *
   * Transport type:
   *
   *     ISO 8601 date-time string
   *
   * Application mapping:
   *
   *     string → RecoveryCancelledAt
   */
  @ApiProperty({
    example: '2026-08-31T12:30:00.000Z',
    description: 'ISO 8601 timestamp at which the Recovery is cancelled.',
    format: 'date-time',
  })
  @Transform(trimString)
  @IsString({
    message: 'cancelledAt must be a string.',
  })
  @IsDateString(
    {},
    {
      message: 'cancelledAt must be a valid ISO 8601 date-time string.',
    },
  )
  cancelledAt!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the Recovery-cancellation operation.
   *
   * This identifies the end-to-end business operation and is propagated to
   * the resulting domain event.
   */
  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description:
      'Correlation identifier for the Recovery-cancellation operation and resulting domain event.',
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
   * Optional identifier of the command, domain event, or workflow that caused
   * this Recovery-cancellation operation.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command, domain event, or workflow that caused this Recovery-cancellation operation.',
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
  MIN_PUBLIC_ID_LENGTH as RECOVERY_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as RECOVERY_PUBLIC_ID_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as RECOVERY_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as RECOVERY_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as RECOVERY_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as RECOVERY_CAUSATION_ID_MAX_LENGTH,
};

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CancelRecoveryRequestDto;
