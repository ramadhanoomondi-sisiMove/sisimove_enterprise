// -----------------------------------------------------------------------------
// Financial Settlement — Get Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for retrieving an existing Financial Settlement.
//
// The request identifies the Financial Settlement through its public
// identifier.
//
// This DTO contains transport-level primitive values only.
//
// DTO-to-domain conversion belongs to the presentation/application boundary.
//
// This DTO does NOT:
//
// - Modify the Financial Settlement aggregate.
// - Change Settlement lifecycle state.
// - Create Settlement Items.
// - Allocate Settlement Items.
// - Create Financial Transactions.
// - Modify Financial Account balances.
// - Move money.
// - Execute disbursements.
// - Perform accounting.
// - Communicate with external financial providers.
//
// -----------------------------------------------------------------------------
//
// Expected request:
//
//     GET /financial-settlements/:settlementPublicId
//
// Example:
//
//     GET /financial-settlements/FST-WQC6Y7G
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

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_SETTLEMENT_PUBLIC_ID_LENGTH = 1;
const MAX_SETTLEMENT_PUBLIC_ID_LENGTH = 128;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for retrieving a Financial Settlement.
 *
 * Represents the transport-level identity of an existing Financial
 * Settlement.
 *
 * The application/query boundary converts the primitive `settlementPublicId`
 * into the FinancialSettlementPublicId value object before executing the
 * GetFinancialSettlementQuery.
 *
 * The DTO intentionally does not expose domain value objects.
 */
export class GetFinancialSettlementRequestDto {
  // ===========================================================================
  // Financial Settlement
  // ===========================================================================

  /**
   * Public identifier of the Financial Settlement to retrieve.
   *
   * Example:
   *
   *     FST-WQC6Y7G
   */
  @ApiProperty({
    example: 'FST-WQC6Y7G',
    description: 'Public identifier of the Financial Settlement to retrieve.',
    minLength: MIN_SETTLEMENT_PUBLIC_ID_LENGTH,
    maxLength: MAX_SETTLEMENT_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'settlementPublicId must be a string.',
  })
  @MinLength(MIN_SETTLEMENT_PUBLIC_ID_LENGTH, {
    message: 'settlementPublicId must not be empty.',
  })
  @MaxLength(MAX_SETTLEMENT_PUBLIC_ID_LENGTH, {
    message: `settlementPublicId must not exceed ${MAX_SETTLEMENT_PUBLIC_ID_LENGTH} characters.`,
  })
  @Matches(/^FST-[A-Z0-9]+$/, {
    message:
      'settlementPublicId must be a valid Financial Settlement public identifier.',
  })
  settlementPublicId!: string;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_SETTLEMENT_PUBLIC_ID_LENGTH as FINANCIAL_SETTLEMENT_PUBLIC_ID_MIN_LENGTH,
  MAX_SETTLEMENT_PUBLIC_ID_LENGTH as FINANCIAL_SETTLEMENT_PUBLIC_ID_MAX_LENGTH,
};

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialSettlementRequestDto;
