// -----------------------------------------------------------------------------
// Financial Account Hold — Release Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for releasing an existing Financial Account Hold.
//
// Lifecycle transition:
//
//     ACTIVE -> RELEASED
//
// The request identifies:
//
// - the Financial Account Hold;
// - the Financial RELEASE transaction resolving the reservation;
// - the release timestamp;
// - correlation metadata.
//
// This DTO performs transport-level validation only.
//
// Domain lifecycle rules remain inside:
// - FinancialAccountHoldAggregate;
// - FinancialAccountHoldEntity.
//
// The DTO does NOT:
// - execute the RELEASE transaction;
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
 * REST request for releasing a Financial Account Hold.
 *
 * Represents the application-level intent:
 *
 *     ACTIVE -> RELEASED
 *
 * The corresponding Financial RELEASE transaction is identified by its
 * public identifier. The transaction itself is a separate Financial
 * aggregate and is not created or executed by this DTO.
 */
export class ReleaseFinancialAccountHoldRequestDto {
  // ===========================================================================
  // Financial Account Hold
  // ===========================================================================

  @ApiProperty({
    example: 'FAH-WQC6Y7G',
    description:
      'Public identifier of the Financial Account Hold being released.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^FAH-[A-Z0-9]+$/, {
    message:
      'publicId must be a valid Financial Account Hold public identifier.',
  })
  publicId!: string;

  // ===========================================================================
  // Release Transaction
  // ===========================================================================

  @ApiProperty({
    example: 'FTX-7H3K9P2',
    description:
      'Public identifier of the Financial RELEASE transaction that resolves the reserved funds.',
  })
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  @Matches(/^[A-Z0-9]+(?:-[A-Z0-9]+)+$/, {
    message:
      'releaseTransactionPublicId must be a valid Financial Transaction public identifier.',
  })
  releaseTransactionPublicId!: string;

  // ===========================================================================
  // Release Timestamp
  // ===========================================================================

  @ApiProperty({
    example: '2026-08-25T19:30:00.000Z',
    description:
      'Timestamp at which the Financial Account Hold enters RELEASED state.',
    format: 'date-time',
  })
  @Transform(trimString)
  @IsDateString(
    {},
    {
      message: 'releasedAt must be a valid ISO 8601 date-time.',
    },
  )
  releasedAt!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description:
      'Correlation identifier for the release command and resulting domain events.',
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
      'Optional identifier of the command or operation that caused this release.',
    nullable: true,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  causationId?: string;
}
