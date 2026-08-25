// -----------------------------------------------------------------------------
// Financial Account Hold — Cancel Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for cancelling a Financial Account Hold.
//
// Responsibilities:
//
// - Validate incoming HTTP request data.
// - Normalize transport-level string values.
// - Document the request contract through Swagger.
//
// This DTO contains transport primitives only.
//
// Conversion into domain value objects and the application command belongs
// to the presentation/application boundary.
//
// The DTO does NOT:
//
// - Resolve the Financial Account Hold.
// - Validate aggregate lifecycle rules.
// - Execute a RELEASE transaction.
// - Modify Financial Account balances.
// - Move money.
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
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request DTO for cancelling a Financial Account Hold.
 *
 * Cancellation represents:
 *
 *     ACTIVE -> CANCELLED
 *
 * The cancellation requires a Financial RELEASE transaction because the
 * reserved funds must be resolved back to the Financial Account's available
 * balance.
 */
export class CancelFinancialAccountHoldRequestDto {
  // ===========================================================================
  // Financial Account Hold Public ID
  // ===========================================================================

  @ApiProperty({
    example: 'FAH-WQC6Y7G',
    description:
      'Public identifier of the Financial Account Hold being cancelled.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^FAH-[A-Z0-9]+$/, {
    message:
      'publicId must be a valid Financial Account Hold public identifier.',
  })
  publicId!: string;

  // ===========================================================================
  // RELEASE Transaction Public ID
  // ===========================================================================

  @ApiProperty({
    example: 'FTX-WQC6Y7G',
    description:
      'Public identifier of the Financial RELEASE transaction that resolves the reserved funds.',
  })
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  releaseTransactionPublicId!: string;

  // ===========================================================================
  // Cancellation Timestamp
  // ===========================================================================

  @ApiProperty({
    example: '2026-08-25T08:30:00.000Z',
    description:
      'ISO-8601 timestamp at which the Financial Account Hold enters CANCELLED state.',
    format: 'date-time',
  })
  @Transform(trimString)
  @IsString()
  @IsDateString()
  cancelledAt!: string;

  // ===========================================================================
  // Correlation ID
  // ===========================================================================

  @ApiProperty({
    example: 'COR-WQC6Y7G',
    description:
      'Correlation identifier used to correlate the cancellation command and resulting domain events.',
  })
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  correlationId!: string;

  // ===========================================================================
  // Causation ID
  // ===========================================================================

  @ApiPropertyOptional({
    example: 'CMD-WQC6Y7G',
    description:
      'Optional identifier of the command or operation that caused this cancellation.',
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  causationId?: string;
}
