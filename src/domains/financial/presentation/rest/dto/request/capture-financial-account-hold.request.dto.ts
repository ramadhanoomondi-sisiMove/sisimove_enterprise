// -----------------------------------------------------------------------------
// Financial Account Hold — Capture Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for capturing an existing Financial Account Hold.
//
// Lifecycle transition:
//
//     ACTIVE -> CAPTURED
//
// The request identifies:
//
// - the Financial Account Hold;
// - the Financial CAPTURE transaction resolving the reservation;
// - the capture timestamp;
// - correlation metadata.
//
// This DTO performs transport-level validation only.
//
// Domain lifecycle rules remain inside:
// - FinancialAccountHoldAggregate;
// - FinancialAccountHoldEntity.
//
// The DTO does NOT:
// - execute the CAPTURE transaction;
// - modify Financial Account balances;
// - move money;
// - communicate with payment providers.
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
 * REST request for capturing a Financial Account Hold.
 *
 * Represents the application-level intent:
 *
 *     ACTIVE -> CAPTURED
 *
 * The corresponding Financial CAPTURE transaction is identified by its
 * public identifier. The transaction itself is a separate Financial
 * aggregate and is not created or executed by this DTO.
 */
export class CaptureFinancialAccountHoldRequestDto {
  // ===========================================================================
  // Financial Account Hold
  // ===========================================================================

  @ApiProperty({
    example: 'FAH-WQC6Y7G',
    description:
      'Public identifier of the Financial Account Hold being captured.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^FAH-[A-Z0-9]+$/, {
    message:
      'publicId must be a valid Financial Account Hold public identifier.',
  })
  publicId!: string;

  // ===========================================================================
  // Capture Transaction
  // ===========================================================================

  @ApiProperty({
    example: 'FTX-7H3K9P2',
    description:
      'Public identifier of the Financial CAPTURE transaction that resolves the reserved funds.',
  })
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  @Matches(/^[A-Z0-9]+(?:-[A-Z0-9]+)+$/, {
    message:
      'captureTransactionPublicId must be a valid Financial Transaction public identifier.',
  })
  captureTransactionPublicId!: string;

  // ===========================================================================
  // Capture Timestamp
  // ===========================================================================

  @ApiProperty({
    example: '2026-08-25T19:30:00.000Z',
    description:
      'Timestamp at which the Financial Account Hold enters CAPTURED state.',
    format: 'date-time',
  })
  @Transform(trimString)
  @IsDateString(
    {},
    {
      message: 'capturedAt must be a valid ISO 8601 date-time.',
    },
  )
  capturedAt!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description:
      'Correlation identifier for the capture command and resulting domain events.',
  })
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  correlationId!: string;

  // ===========================================================================
  // Causation
  // ===========================================================================

  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command or operation that caused this capture.',
    nullable: true,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  causationId?: string;
}
