// -----------------------------------------------------------------------------
// Financial Account Withdrawal — Process Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for processing an existing Financial Account Withdrawal.
//
// Lifecycle transition:
//
//     PENDING -> PROCESSING
//
// The request identifies:
// - the Financial Account Withdrawal;
// - correlation metadata.
//
// Transport-level validation is performed here.
//
// Domain lifecycle rules remain inside:
// - FinancialAccountWithdrawalAggregate;
// - FinancialAccountWithdrawalEntity.
//
// This DTO does NOT:
// - create a withdrawal;
// - create a Financial Disbursement;
// - execute a provider;
// - confirm an external payout;
// - complete the withdrawal;
// - move funds;
// - modify Financial Account balances;
// - create a Financial Transaction;
// - perform settlement;
// - perform accounting.
//
// External disbursement execution belongs to the Financial Disbursement
// workflow and its Integration/application boundary.
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

// =============================================================================
// DTO
// =============================================================================

/**
 * REST request for processing a Financial Account Withdrawal.
 *
 * Represents the application-level intent to perform:
 *
 *     PENDING -> PROCESSING
 *
 * The FinancialAccountWithdrawalAggregate remains responsible for validating
 * whether the transition is currently permitted.
 */
export class ProcessFinancialAccountWithdrawalRequestDto {
  // ===========================================================================
  // Withdrawal
  // ===========================================================================

  @ApiProperty({
    example: 'FAW-WQC6Y7G',
    description:
      'Public identifier of the Financial Account Withdrawal to process.',
  })
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  @Matches(/^FAW-[A-Z0-9]+$/, {
    message:
      'withdrawalId must be a valid Financial Account Withdrawal public identifier.',
  })
  withdrawalId!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description:
      'Correlation identifier for the processing command and resulting domain event.',
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
      'Optional identifier of the command or operation that caused this processing request.',
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

export default ProcessFinancialAccountWithdrawalRequestDto;
