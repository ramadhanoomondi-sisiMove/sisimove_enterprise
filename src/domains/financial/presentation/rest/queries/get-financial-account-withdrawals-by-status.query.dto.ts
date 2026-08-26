// -----------------------------------------------------------------------------
// Financial Account Withdrawals — Get By Status Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for retrieving Financial Account Withdrawals belonging to a
// Financial Account and matching a specific lifecycle status.
//
// Query semantics:
//
// - Read-only operation.
// - Does not mutate withdrawals.
// - Does not process withdrawals.
// - Does not move funds.
// - Does not modify Financial Account balances.
// - Does not create Financial Transactions.
// - Does not create or execute Financial Disbursements.
// - Does not call external providers.
//
// Transport-level validation is performed here.
//
// Conversion into:
//
// - FinancialAccountPublicId;
// - FinancialAccountWithdrawalStatus;
//
// belongs to the controller/application boundary.
//
// Lifecycle statuses:
//
// - PENDING
// - PROCESSING
// - COMPLETED
// - FAILED
// - CANCELLED
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS Swagger
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Class Transformer
// -----------------------------------------------------------------------------

import { Transform, type TransformFnParams } from 'class-transformer';

// -----------------------------------------------------------------------------
// Class Validator
// -----------------------------------------------------------------------------

import { IsIn, IsString, Matches, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

// =============================================================================
// DTO
// =============================================================================

/**
 * REST request for retrieving Financial Account Withdrawals by lifecycle
 * status.
 *
 * The transport values are converted by the application boundary into:
 *
 *     FinancialAccountPublicId
 *     FinancialAccountWithdrawalStatus
 *
 * before constructing GetFinancialAccountWithdrawalsByStatusQuery.
 */
export class GetFinancialAccountWithdrawalsByStatusQueryDto {
  // ===========================================================================
  // Financial Account
  // ===========================================================================

  @ApiProperty({
    example: 'FAC-WQC6Y7G',
    description:
      'Public identifier of the Financial Account whose withdrawals are requested.',
  })
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  @Matches(/^FAC-[A-Z0-9]+$/, {
    message:
      'accountPublicId must be a valid Financial Account public identifier.',
  })
  accountPublicId!: string;

  // ===========================================================================
  // Withdrawal Status
  // ===========================================================================

  @ApiProperty({
    example: 'PENDING',
    description:
      'Lifecycle status that returned Financial Account Withdrawals must match.',
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'],
  })
  @Transform(({ value }: TransformFnParams): unknown =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsString()
  @IsIn(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'], {
    message:
      'status must be PENDING, PROCESSING, COMPLETED, FAILED, or CANCELLED.',
  })
  status!: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialAccountWithdrawalsByStatusQueryDto;
