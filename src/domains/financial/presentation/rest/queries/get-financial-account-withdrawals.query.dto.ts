// -----------------------------------------------------------------------------
// Financial Account Withdrawals — Get Request Query DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for retrieving Financial Account Withdrawals belonging to
// a Financial Account.
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
// The DTO contains transport-level primitives only.
//
// Conversion into FinancialAccountPublicId belongs to the
// controller/application boundary before constructing:
//
//     GetFinancialAccountWithdrawalsQuery
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
 * REST request for retrieving all Financial Account Withdrawals belonging to
 * a Financial Account.
 *
 * The account public identifier is converted by the application boundary
 * into:
 *
 *     FinancialAccountPublicId
 *
 * before constructing GetFinancialAccountWithdrawalsQuery.
 */
export class GetFinancialAccountWithdrawalsQueryDto {
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
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialAccountWithdrawalsQueryDto;
