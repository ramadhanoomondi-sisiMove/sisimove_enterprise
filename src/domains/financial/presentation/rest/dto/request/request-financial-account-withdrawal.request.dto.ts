// -----------------------------------------------------------------------------
// Financial Account Withdrawal — Request DTO
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Transform, type TransformFnParams } from 'class-transformer';

import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

// =============================================================================
// Helpers
// =============================================================================

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

const trimUpperCaseString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim().toUpperCase() : value;

// =============================================================================
// DTO
// =============================================================================

/**
 * REST request for requesting a Financial Account Withdrawal.
 *
 * The request identifies:
 *
 * - the source Financial Account;
 * - the withdrawal amount;
 * - the withdrawal currency;
 * - the selected external destination;
 * - an optional originating business reference;
 * - correlation metadata.
 *
 * The destination is transported as:
 *
 * - destinationType;
 * - destinationValue.
 *
 * The application layer converts these values into the immutable
 * FinancialAccountWithdrawalDestination value object.
 *
 * This DTO performs transport-level validation only.
 *
 * Domain rules remain inside:
 *
 * - FinancialAccountWithdrawalAggregate;
 * - FinancialAccountWithdrawalEntity;
 * - FinancialAccountWithdrawalDestination;
 *
 * This DTO does NOT:
 *
 * - modify Financial Account balances;
 * - create Financial Transactions;
 * - create Financial Disbursements;
 * - execute provider payouts;
 * - perform settlement;
 * - perform accounting.
 */
export class RequestFinancialAccountWithdrawalRequestDto {
  // ===========================================================================
  // Financial Account
  // ===========================================================================

  @ApiProperty({
    example: 'FAC-WQC6Y7G',
    description:
      'Public identifier of the Financial Account from which funds are withdrawn.',
  })
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  @Matches(/^[A-Z0-9]+(?:-[A-Z0-9]+)+$/, {
    message: 'accountId must be a valid Financial Account public identifier.',
  })
  accountId!: string;

  // ===========================================================================
  // Amount
  // ===========================================================================

  @ApiProperty({
    example: 4254,
    description:
      'Positive withdrawal amount expressed in the specified currency.',
    minimum: 1,
    type: Number,
  })
  @IsInt()
  @Min(1)
  amount!: number;

  // ===========================================================================
  // Currency
  // ===========================================================================

  @ApiProperty({
    example: 'KES',
    description:
      'ISO 4217 three-letter currency code of the withdrawal amount.',
    minLength: 3,
    maxLength: 3,
  })
  @Transform(trimUpperCaseString)
  @IsString()
  @MinLength(3)
  @MaxLength(3)
  @Matches(/^[A-Z]{3}$/, {
    message: 'currency must be a valid three-letter uppercase currency code.',
  })
  currency!: string;

  // ===========================================================================
  // Destination Type
  // ===========================================================================

  @ApiProperty({
    example: 'MOBILE_MONEY',
    description: 'Type of external destination receiving the withdrawal.',
    enum: ['MOBILE_MONEY', 'BANK_ACCOUNT', 'OTHER'],
  })
  @Transform(trimUpperCaseString)
  @IsString()
  @IsIn(['MOBILE_MONEY', 'BANK_ACCOUNT', 'OTHER'], {
    message: 'destinationType must be MOBILE_MONEY, BANK_ACCOUNT, or OTHER.',
  })
  destinationType!: string;

  // ===========================================================================
  // Destination Value
  // ===========================================================================

  @ApiProperty({
    example: '254712345678',
    description:
      'External destination value captured as an immutable withdrawal snapshot.',
  })
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(256)
  destinationValue!: string;

  // ===========================================================================
  // Business Reference Type
  // ===========================================================================

  @ApiPropertyOptional({
    example: 'JOURNEY',
    description:
      'Optional type identifying the originating business object. Must be supplied together with referencePublicId.',
    nullable: true,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  referenceType?: string;

  // ===========================================================================
  // Business Reference Public ID
  // ===========================================================================

  @ApiPropertyOptional({
    example: 'JRN-01K3R8Y7Q2',
    description:
      'Optional public identifier of the originating business object. Must be supplied together with referenceType.',
    nullable: true,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  referencePublicId?: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description:
      'Correlation identifier for the withdrawal command and resulting domain events.',
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
      'Optional identifier of the command or operation that caused this withdrawal request.',
    nullable: true,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  causationId?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RequestFinancialAccountWithdrawalRequestDto;
