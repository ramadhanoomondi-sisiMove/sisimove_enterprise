// -----------------------------------------------------------------------------
// Financial Settlement — Allocate Item Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for allocating an existing Financial Settlement Item.
//
// The request identifies:
//
// - the Financial Settlement aggregate;
// - the Financial Settlement Item;
// - correlation metadata.
//
// Expected Item lifecycle transition:
//
//     PENDING → ALLOCATED
//
// The Financial Settlement itself remains:
//
//     PROCESSING
//
// Allocation is a domain operation owned by the
// FinancialSettlementAggregate.
//
// This DTO performs transport-level validation only.
//
// The DTO does NOT:
//
// - Create Settlement Items.
// - Create Settlement Allocations.
// - Debit a Financial Account.
// - Credit a Financial Account.
// - Create or post Financial Transactions.
// - Execute payments.
// - Execute disbursements.
// - Modify Financial Account balances.
// - Perform accounting.
// - Communicate with external financial providers.
// - Move money.
//
// Domain lifecycle rules and allocation invariants remain inside the
// FinancialSettlementAggregate and its owned Settlement Item entities.
//
// -----------------------------------------------------------------------------
//
// DTO → Command mapping:
//
//     settlementPublicId
//             │
//             ▼
//     FinancialSettlementPublicId
//
//     itemPublicId
//             │
//             ▼
//     FinancialSettlementItemPublicId
//
//     correlationId
//             │
//             ▼
//     command correlation metadata
//
//     causationId
//             │
//             ▼
//     command causation metadata
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

const MIN_PUBLIC_ID_LENGTH = 1;
const MAX_PUBLIC_ID_LENGTH = 128;

const MIN_CORRELATION_ID_LENGTH = 1;
const MAX_CORRELATION_ID_LENGTH = 128;

const MIN_CAUSATION_ID_LENGTH = 1;
const MAX_CAUSATION_ID_LENGTH = 128;

// -----------------------------------------------------------------------------
// Public ID Patterns
// -----------------------------------------------------------------------------

/**
 * Financial Settlement public identifier.
 *
 * The domain public ID uses the Financial Settlement namespace prefix.
 */
const FINANCIAL_SETTLEMENT_PUBLIC_ID_PATTERN = /^FST-[A-Z0-9]+$/;

/**
 * Financial Settlement Item public identifier.
 *
 * The domain public ID uses the Financial Settlement Item namespace prefix.
 */
const FINANCIAL_SETTLEMENT_ITEM_PUBLIC_ID_PATTERN = /^FSI-[A-Z0-9]+$/;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for allocating a Financial Settlement Item.
 *
 * Represents the application-level intent to allocate one Settlement Item
 * belonging to a Financial Settlement.
 *
 * Expected Item lifecycle transition:
 *
 *     PENDING → ALLOCATED
 *
 * The Settlement remains in PROCESSING.
 *
 * The request intentionally does not supply:
 *
 * - allocation amount;
 * - target account;
 * - transaction;
 * - allocation status;
 * - allocation timestamp.
 *
 * Those values and decisions belong to the appropriate domain/application
 * workflow.
 */
export class AllocateFinancialSettlementItemRequestDto {
  // ===========================================================================
  // Financial Settlement
  // ===========================================================================

  /**
   * Public identifier of the Financial Settlement containing the Item.
   */
  @ApiProperty({
    example: 'FST-WQC6Y7G',
    description:
      'Public identifier of the Financial Settlement containing the Settlement Item to allocate.',
    minLength: MIN_PUBLIC_ID_LENGTH,
    maxLength: MAX_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'settlementPublicId must be a string.',
  })
  @MinLength(MIN_PUBLIC_ID_LENGTH, {
    message: 'settlementPublicId must not be empty.',
  })
  @MaxLength(MAX_PUBLIC_ID_LENGTH, {
    message: `settlementPublicId must not exceed ${MAX_PUBLIC_ID_LENGTH} characters.`,
  })
  @Matches(FINANCIAL_SETTLEMENT_PUBLIC_ID_PATTERN, {
    message:
      'settlementPublicId must be a valid Financial Settlement public identifier.',
  })
  settlementPublicId!: string;

  // ===========================================================================
  // Financial Settlement Item
  // ===========================================================================

  /**
   * Public identifier of the Settlement Item to allocate.
   */
  @ApiProperty({
    example: 'FSI-7H3K9P2',
    description:
      'Public identifier of the Financial Settlement Item to allocate.',
    minLength: MIN_PUBLIC_ID_LENGTH,
    maxLength: MAX_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'itemPublicId must be a string.',
  })
  @MinLength(MIN_PUBLIC_ID_LENGTH, {
    message: 'itemPublicId must not be empty.',
  })
  @MaxLength(MAX_PUBLIC_ID_LENGTH, {
    message: `itemPublicId must not exceed ${MAX_PUBLIC_ID_LENGTH} characters.`,
  })
  @Matches(FINANCIAL_SETTLEMENT_ITEM_PUBLIC_ID_PATTERN, {
    message:
      'itemPublicId must be a valid Financial Settlement Item public identifier.',
  })
  itemPublicId!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the allocation command and resulting domain
   * events.
   */
  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description:
      'Correlation identifier for the allocation command and resulting domain events.',
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
   * Optional identifier of the command or operation that caused this
   * allocation command.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command or operation that caused this allocation command.',
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
  MIN_PUBLIC_ID_LENGTH as FINANCIAL_SETTLEMENT_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as FINANCIAL_SETTLEMENT_PUBLIC_ID_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as FINANCIAL_SETTLEMENT_ALLOCATION_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as FINANCIAL_SETTLEMENT_ALLOCATION_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as FINANCIAL_SETTLEMENT_ALLOCATION_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as FINANCIAL_SETTLEMENT_ALLOCATION_CAUSATION_ID_MAX_LENGTH,
};
