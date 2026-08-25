// -----------------------------------------------------------------------------
// Financial Settlement — Create Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for creating a Financial Settlement.
//
// A Financial Settlement represents a settlement batch for a single currency.
//
// Aggregate:
//
// FinancialSettlementAggregate
// └── FinancialSettlementEntity
//     └── FinancialSettlementItemEntity[]
//         └── FinancialSettlementAllocationEntity[]
//
// This DTO contains transport-level primitive values only.
//
// DTO-to-domain conversion belongs to the presentation/application mapping
// boundary.
//
// A newly created Financial Settlement is expected to:
//
// - start in PENDING status;
// - have a zero total amount;
// - contain no Settlement Items;
// - contain no Settlement Allocations;
// - use a single currency.
//
// The initial lifecycle status and total amount are NOT supplied by the
// request. They are determined by the FinancialSettlementAggregate creation
// policy.
//
// This DTO does NOT:
//
// - Begin Settlement processing.
// - Create Settlement Items.
// - Allocate Settlement Items.
// - Create Settlement Allocations.
// - Create Financial Transactions.
// - Execute Financial Transactions.
// - Modify Financial Account balances.
// - Execute disbursements.
// - Perform accounting.
// - Communicate with external financial providers.
// - Move money.
//
// Settlement financial movement belongs to the appropriate Financial
// Transaction, Financial Account, Disbursement, and Integration boundaries.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "currency": "KES",
//       "correlationId": "COR-01K3R8Y7Q2",
//       "causationId": "CMD-01K3R8Y6M4"
//     }
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

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_CURRENCY_LENGTH = 3;
const MAX_CURRENCY_LENGTH = 3;

const MIN_CORRELATION_ID_LENGTH = 1;
const MAX_CORRELATION_ID_LENGTH = 128;

const MIN_CAUSATION_ID_LENGTH = 1;
const MAX_CAUSATION_ID_LENGTH = 128;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for creating a Financial Settlement.
 *
 * Represents the application-level intent to create an empty Financial
 * Settlement batch in a single currency.
 *
 * Required transport input:
 *
 * - currency
 * - correlationId
 *
 * Optional transport input:
 *
 * - causationId
 *
 * The following values are intentionally NOT supplied:
 *
 * - settlement public ID;
 * - settlement status;
 * - total amount;
 * - settlement items;
 * - settlement allocations.
 *
 * Those values are determined by the Financial Settlement domain model and
 * subsequent Settlement workflows.
 */
export class CreateFinancialSettlementRequestDto {
  // ===========================================================================
  // Currency
  // ===========================================================================

  /**
   * ISO 4217 three-letter currency code of the Financial Settlement.
   *
   * A Financial Settlement is intentionally single-currency.
   *
   * Settlement Items subsequently added to the Settlement must use the same
   * currency.
   *
   * Examples:
   *
   * - KES
   * - USD
   * - EUR
   * - GBP
   */
  @ApiProperty({
    example: 'KES',
    description:
      'ISO 4217 three-letter currency code of the Financial Settlement. The Settlement is single-currency.',
    minLength: MIN_CURRENCY_LENGTH,
    maxLength: MAX_CURRENCY_LENGTH,
    pattern: '^[A-Z]{3}$',
  })
  @Transform(trimString)
  @IsString({
    message: 'currency must be a string.',
  })
  @MinLength(MIN_CURRENCY_LENGTH, {
    message: 'currency must be exactly 3 characters.',
  })
  @MaxLength(MAX_CURRENCY_LENGTH, {
    message: 'currency must be exactly 3 characters.',
  })
  @Matches(/^[A-Z]{3}$/, {
    message:
      'currency must be a valid three-letter uppercase ISO 4217 currency code.',
  })
  currency!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the create command and resulting domain
   * events.
   */
  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description:
      'Correlation identifier for the create command and resulting domain events.',
    minLength: MIN_CORRELATION_ID_LENGTH,
    maxLength: MAX_CORRELATION_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'correlationId must be a string.',
  })
  @MinLength(MIN_CORRELATION_ID_LENGTH, {
    message: 'correlationId must not be empty.',
  })
  @MaxLength(MAX_CORRELATION_ID_LENGTH, {
    message: `correlationId must not exceed ${MAX_CORRELATION_ID_LENGTH} characters.`,
  })
  correlationId!: string;

  // ===========================================================================
  // Causation
  // ===========================================================================

  /**
   * Optional identifier of the command or operation that caused this create
   * command.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command or operation that caused this create command.',
    nullable: true,
    minLength: MIN_CAUSATION_ID_LENGTH,
    maxLength: MAX_CAUSATION_ID_LENGTH,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString({
    message: 'causationId must be a string.',
  })
  @MinLength(MIN_CAUSATION_ID_LENGTH, {
    message: 'causationId must not be empty.',
  })
  @MaxLength(MAX_CAUSATION_ID_LENGTH, {
    message: `causationId must not exceed ${MAX_CAUSATION_ID_LENGTH} characters.`,
  })
  causationId?: string;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_CURRENCY_LENGTH as FINANCIAL_SETTLEMENT_CURRENCY_MIN_LENGTH,
  MAX_CURRENCY_LENGTH as FINANCIAL_SETTLEMENT_CURRENCY_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as FINANCIAL_SETTLEMENT_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as FINANCIAL_SETTLEMENT_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as FINANCIAL_SETTLEMENT_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as FINANCIAL_SETTLEMENT_CAUSATION_ID_MAX_LENGTH,
};
