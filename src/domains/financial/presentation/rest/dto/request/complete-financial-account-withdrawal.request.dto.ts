// -----------------------------------------------------------------------------
// Financial Account Withdrawal — Complete Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for completing an existing Financial Account Withdrawal.
//
// Lifecycle transition:
//
//     PROCESSING -> COMPLETED
//
// The request identifies:
// - the Financial Account Withdrawal;
// - the completion timestamp;
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
// - execute an external provider;
// - move funds;
// - modify Financial Account balances;
// - create a Financial Transaction;
// - perform settlement;
// - perform accounting.
//
// Completion represents successful resolution of the withdrawal workflow.
// External provider execution belongs to the Financial Disbursement workflow.
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

// =============================================================================
// DTO
// =============================================================================

/**
 * REST request for completing a Financial Account Withdrawal.
 *
 * Represents the application-level intent to perform:
 *
 *     PROCESSING -> COMPLETED
 *
 * The FinancialAccountWithdrawalAggregate remains responsible for validating
 * whether the transition is currently permitted.
 */
export class CompleteFinancialAccountWithdrawalRequestDto {
  // ===========================================================================
  // Withdrawal
  // ===========================================================================

  @ApiProperty({
    example: 'FAW-WQC6Y7G',
    description:
      'Public identifier of the Financial Account Withdrawal to complete.',
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
  // Completion Timestamp
  // ===========================================================================

  @ApiProperty({
    example: '2026-08-26T10:30:00.000Z',
    description:
      'Timestamp at which the Financial Account Withdrawal enters COMPLETED state.',
    format: 'date-time',
  })
  @Transform(trimString)
  @IsDateString(
    {},
    {
      message: 'completedAt must be a valid ISO 8601 date-time.',
    },
  )
  completedAt!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description:
      'Correlation identifier for the completion command and resulting domain event.',
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
      'Optional identifier of the command or operation that caused this completion request.',
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

export default CompleteFinancialAccountWithdrawalRequestDto;
