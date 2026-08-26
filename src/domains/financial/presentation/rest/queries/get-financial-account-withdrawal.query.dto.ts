// -----------------------------------------------------------------------------
// Financial Account Withdrawal — Get Request Query DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for retrieving an existing Financial Account Withdrawal.
//
// The request identifies the withdrawal through its public identifier.
//
// Query semantics:
//
// - Read-only operation.
// - Does not mutate the withdrawal.
// - Does not process the withdrawal.
// - Does not move funds.
// - Does not modify Financial Account balances.
// - Does not create Financial Transactions.
// - Does not create or execute Financial Disbursements.
// - Does not call external providers.
//
// Transport-level validation is performed here.
//
// Conversion into FinancialAccountWithdrawalPublicId belongs to the
// controller/application boundary.
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

import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

// =============================================================================
// DTO
// =============================================================================

/**
 * REST request for retrieving a Financial Account Withdrawal.
 *
 * The public identifier is converted by the application boundary into:
 *
 *     FinancialAccountWithdrawalPublicId
 *
 * before constructing GetFinancialAccountWithdrawalQuery.
 */
export class GetFinancialAccountWithdrawalQueryDto {
  // ===========================================================================
  // Withdrawal
  // ===========================================================================

  @ApiProperty({
    example: 'FAW-WQC6Y7G',
    description:
      'Public identifier of the Financial Account Withdrawal to retrieve.',
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
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialAccountWithdrawalQueryDto;
