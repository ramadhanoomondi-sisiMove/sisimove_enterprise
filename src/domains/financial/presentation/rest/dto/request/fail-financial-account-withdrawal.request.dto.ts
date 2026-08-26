// -----------------------------------------------------------------------------
// Financial Account Withdrawal — Fail Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for failing an existing Financial Account Withdrawal.
//
// Lifecycle transition:
//
//     PROCESSING -> FAILED
//
// The request identifies:
// - the Financial Account Withdrawal;
// - the failure reason;
// - the failure timestamp;
// - correlation metadata.
//
// DTO-to-command mapping:
//
//     withdrawalPublicId -> FinancialAccountWithdrawalPublicId
//     reason            -> reason
//     failedAt          -> Date
//     correlationId     -> correlationId
//     causationId       -> causationId
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
// Failure represents unsuccessful resolution of the withdrawal workflow.
// External provider execution and provider-specific failure classification
// remain outside this DTO.
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
 * REST request for failing a Financial Account Withdrawal.
 *
 * Represents the application-level intent to perform:
 *
 *     PROCESSING -> FAILED
 *
 * The FinancialAccountWithdrawalAggregate remains responsible for validating
 * whether the transition is currently permitted.
 */
export class FailFinancialAccountWithdrawalRequestDto {
  // ===========================================================================
  // Withdrawal
  // ===========================================================================

  @ApiProperty({
    example: 'FAW-WQC6Y7G',
    description:
      'Public identifier of the Financial Account Withdrawal to fail.',
  })
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  @Matches(/^FAW-[A-Z0-9]+$/, {
    message:
      'withdrawalPublicId must be a valid Financial Account Withdrawal public identifier.',
  })
  withdrawalPublicId!: string;

  // ===========================================================================
  // Failure Reason
  // ===========================================================================

  @ApiProperty({
    example: 'External disbursement could not be completed.',
    description:
      'Safe human-readable reason explaining why the Financial Account Withdrawal failed.',
    maxLength: 1024,
  })
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(1024)
  reason!: string;

  // ===========================================================================
  // Failure Timestamp
  // ===========================================================================

  @ApiProperty({
    example: '2026-08-26T10:30:00.000Z',
    description:
      'Timestamp at which the Financial Account Withdrawal enters FAILED state.',
    format: 'date-time',
  })
  @Transform(trimString)
  @IsDateString(
    {},
    {
      message: 'failedAt must be a valid ISO 8601 date-time.',
    },
  )
  failedAt!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description:
      'Correlation identifier for the failure command and resulting domain event.',
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
      'Optional identifier of the command or operation that caused this failure request.',
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

export default FailFinancialAccountWithdrawalRequestDto;
