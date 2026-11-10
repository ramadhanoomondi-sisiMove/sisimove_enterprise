// -----------------------------------------------------------------------------
// Financial Disbursement — Create Request DTO
// -----------------------------------------------------------------------------
//
// Presentation-layer request DTO for creating a Financial Disbursement.
//
// The DTO carries raw transport values received from an HTTP/API request.
//
// DTO responsibilities:
//
// - Validate incoming transport data.
// - Represent API request shape.
// - Keep transport concerns outside the domain.
//
// The application/presentation boundary converts these raw values into the
// appropriate domain value objects before dispatching the command.
//
// The destination is supplied directly as an immutable destination snapshot.
// It is not a public ID referring to a previously configured destination.
//
// The DTO does NOT:
//
// - create domain entities;
// - create aggregates;
// - determine lifecycle status;
// - execute providers;
// - modify Financial Account balances;
// - create Financial Transactions;
// - create Financial Disbursement Attempts.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Swagger
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Min,
  ValidateIf,
} from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class CreateFinancialDisbursementRequestDto {
  // ==========================================================================
  // Source Financial Account
  // ==========================================================================

  @ApiProperty({
    description:
      'Public identity of the Financial Account from which the disbursement is made.',
    example: '01J8Q7X8Y9Z0A1B2C3D4E5F6G7',
  })
  @IsString()
  @IsNotEmpty()
  readonly sourceAccountPublicId!: string;

  // ==========================================================================
  // Destination Snapshot
  // ==========================================================================

  @ApiProperty({
    description:
      'Type of the external destination receiving the funds. This is a destination type, not a payout provider.',
    example: 'MOBILE_MONEY',
  })
  @IsString()
  @IsNotEmpty()
  readonly destinationType!: string;

  @ApiProperty({
    description:
      'Actual external destination value supplied for this disbursement, such as a mobile-money number or bank-account identifier.',
    example: '+254712345678',
  })
  @IsString()
  @IsNotEmpty()
  readonly destinationValue!: string;

  // ==========================================================================
  // Amount
  // ==========================================================================

  @ApiProperty({
    description: 'Disbursement amount expressed in the smallest currency unit.',
    example: 250000,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  readonly amount!: number;

  // ==========================================================================
  // Currency
  // ==========================================================================

  @ApiProperty({
    description:
      'ISO-style currency code for the disbursement amount. The application layer converts this into the Currency value object.',
    example: 'KES',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  readonly currency!: string;

  // ==========================================================================
  // Business Reference Type
  // ==========================================================================

  @ApiPropertyOptional({
    description:
      'Optional opaque type identifying the originating business reference.',
    example: 'JOURNEY_BOOKING',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly referenceType?: string;

  // ==========================================================================
  // Business Reference Public Identity
  // ==========================================================================

  @ApiPropertyOptional({
    description:
      'Optional public identity of the originating business object. Must be supplied together with referenceType.',
    example: '01J8Q9K1L2M3N4O5P6Q7R8S9T0',
  })
  @ValidateIf(
    (dto: CreateFinancialDisbursementRequestDto) =>
      dto.referenceType !== undefined,
  )
  @IsString()
  @IsNotEmpty()
  readonly referencePublicId?: string;
}
