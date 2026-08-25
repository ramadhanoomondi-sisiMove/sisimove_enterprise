// -----------------------------------------------------------------------------
// Financial Settlement — Complete Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for completing an existing Financial Settlement.
//
// Expected lifecycle transition:
//
//     PROCESSING → COMPLETED
//
// Completion is a domain lifecycle operation. The
// FinancialSettlementAggregate remains responsible for validating:
//
// - current Settlement lifecycle state;
// - presence of at least one Settlement Item;
// - Settlement Item allocation completeness;
// - Settlement Item settlement completeness;
// - full Settlement allocation;
// - all other Settlement completion invariants.
//
// This DTO performs transport-level validation only.
//
// The DTO does NOT:
//
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
// The command intentionally contains no timestamp. The completion timestamp
// is determined by the application/domain execution context rather than
// supplied by the REST request.
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
// Public ID Pattern
// -----------------------------------------------------------------------------

const FINANCIAL_SETTLEMENT_PUBLIC_ID_PATTERN = /^FST-[A-Z0-9]+$/;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for completing a Financial Settlement.
 *
 * Represents the application-level intent to complete a Settlement whose
 * lifecycle is currently PROCESSING.
 *
 * Expected lifecycle transition:
 *
 *     PROCESSING → COMPLETED
 *
 * The request intentionally does not supply:
 *
 * - target status;
 * - completion timestamp;
 * - allocated amount;
 * - settled amount;
 * - Settlement Items;
 * - Settlement Allocations;
 * - Financial Transactions.
 *
 * Those decisions and validations belong to the application/domain
 * boundaries.
 */
export class CompleteFinancialSettlementRequestDto {
  // ===========================================================================
  // Financial Settlement
  // ===========================================================================

  /**
   * Public identifier of the Financial Settlement to complete.
   */
  @ApiProperty({
    example: 'FST-WQC6Y7G',
    description: 'Public identifier of the Financial Settlement to complete.',
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
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the completion command and resulting domain
   * events.
   */
  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description:
      'Correlation identifier for the completion command and resulting domain events.',
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
   * completion command.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command or operation that caused this completion command.',
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
  MIN_PUBLIC_ID_LENGTH as FINANCIAL_SETTLEMENT_COMPLETE_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as FINANCIAL_SETTLEMENT_COMPLETE_PUBLIC_ID_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as FINANCIAL_SETTLEMENT_COMPLETE_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as FINANCIAL_SETTLEMENT_COMPLETE_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as FINANCIAL_SETTLEMENT_COMPLETE_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as FINANCIAL_SETTLEMENT_COMPLETE_CAUSATION_ID_MAX_LENGTH,
};
