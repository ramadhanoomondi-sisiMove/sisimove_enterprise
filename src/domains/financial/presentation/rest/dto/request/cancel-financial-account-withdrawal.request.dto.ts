// -----------------------------------------------------------------------------
// Financial Account Withdrawal — Cancel Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for cancelling an existing Financial Account Withdrawal.
//
// Valid lifecycle transitions:
//
//     PENDING    -> CANCELLED
//     PROCESSING -> CANCELLED
//
// The request identifies:
// - the Financial Account Withdrawal;
// - the cancellation reason;
// - the cancellation timestamp;
// - correlation metadata.
//
// DTO-to-command mapping:
//
//     withdrawalPublicId -> FinancialAccountWithdrawalPublicId
//     reason            -> reason
//     cancelledAt       -> Date
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
// - move money;
// - modify Financial Account balances;
// - create a Financial Transaction;
// - create or execute a Financial Disbursement;
// - call an external provider;
// - perform settlement;
// - perform accounting.
//
// Cancellation is an internal Financial-domain lifecycle transition.
// Provider-side cancellation, where applicable, belongs to the integration
// boundary.
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
 * REST request for cancelling a Financial Account Withdrawal.
 *
 * Represents the application-level intent to perform either:
 *
 *     PENDING -> CANCELLED
 *
 * or:
 *
 *     PROCESSING -> CANCELLED
 *
 * The FinancialAccountWithdrawalAggregate remains responsible for validating
 * whether the cancellation is currently permitted.
 */
export class CancelFinancialAccountWithdrawalRequestDto {
  // ===========================================================================
  // Withdrawal
  // ===========================================================================

  @ApiProperty({
    example: 'FAW-WQC6Y7G',
    description:
      'Public identifier of the Financial Account Withdrawal to cancel.',
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
  // Cancellation Reason
  // ===========================================================================

  @ApiProperty({
    example: 'User cancelled the withdrawal request.',
    description:
      'Safe human-readable reason explaining why the Financial Account Withdrawal was cancelled.',
    maxLength: 1024,
  })
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(1024)
  reason!: string;

  // ===========================================================================
  // Cancellation Timestamp
  // ===========================================================================

  @ApiProperty({
    example: '2026-08-26T10:30:00.000Z',
    description:
      'Timestamp at which the Financial Account Withdrawal enters CANCELLED state.',
    format: 'date-time',
  })
  @Transform(trimString)
  @IsDateString(
    {},
    {
      message: 'cancelledAt must be a valid ISO 8601 date-time.',
    },
  )
  cancelledAt!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description:
      'Correlation identifier for the cancellation command and resulting domain event.',
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
      'Optional identifier of the command or operation that caused this cancellation request.',
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

export default CancelFinancialAccountWithdrawalRequestDto;
