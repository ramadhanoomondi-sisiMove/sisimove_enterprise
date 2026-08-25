// -----------------------------------------------------------------------------
// Financial Settlement — Process Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for beginning Financial Settlement processing.
//
// Lifecycle transition:
//
//     PENDING → PROCESSING
//
// This DTO represents transport-level intent only.
//
// The DTO does NOT:
//
// - Validate Settlement lifecycle state.
// - Validate Settlement Items.
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
// Those responsibilities belong to the appropriate application, aggregate,
// transaction, account, disbursement, accounting, and integration boundaries.
//
// The FinancialSettlementAggregate remains authoritative for determining
// whether processing is permitted.
//
// The request intentionally does NOT contain:
//
// - target status;
// - processing timestamp;
// - Settlement Items;
// - Settlement Allocations.
//
// The processing timestamp is determined by the application/domain execution
// context rather than supplied by this transport DTO.
//
// Correlation and causation identifiers are carried for application-level
// tracing and domain-event correlation.
//
// -----------------------------------------------------------------------------
//
// Example:
//
// {
//   "correlationId": "COR-01K3R8Y7Q2",
//   "causationId": "CMD-01K3R8Y6M4"
// }
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

const MIN_SETTLEMENT_PUBLIC_ID_LENGTH = 1;
const MAX_SETTLEMENT_PUBLIC_ID_LENGTH = 128;

const MIN_CORRELATION_ID_LENGTH = 1;
const MAX_CORRELATION_ID_LENGTH = 128;

const MIN_CAUSATION_ID_LENGTH = 1;
const MAX_CAUSATION_ID_LENGTH = 128;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for beginning Financial Settlement processing.
 *
 * Represents the application-level intent:
 *
 *     PENDING → PROCESSING
 *
 * The request identifies the Financial Settlement through its public
 * identifier and carries correlation metadata.
 *
 * The target lifecycle status is intentionally not supplied by the client.
 * The FinancialSettlementAggregate owns that transition.
 */
export class ProcessFinancialSettlementRequestDto {
  // ===========================================================================
  // Financial Settlement
  // ===========================================================================

  /**
   * Public identifier of the Financial Settlement to process.
   */
  @ApiProperty({
    example: 'FST-WQC6Y7G',
    description:
      'Public identifier of the Financial Settlement to begin processing.',
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

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the process command and resulting domain
   * events.
   */
  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description:
      'Correlation identifier for the process command and resulting domain events.',
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
   * Optional identifier of the command or operation that caused this process
   * command.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command or operation that caused this process command.',
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
  MIN_SETTLEMENT_PUBLIC_ID_LENGTH as FINANCIAL_SETTLEMENT_PROCESS_PUBLIC_ID_MIN_LENGTH,
  MAX_SETTLEMENT_PUBLIC_ID_LENGTH as FINANCIAL_SETTLEMENT_PROCESS_PUBLIC_ID_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as FINANCIAL_SETTLEMENT_PROCESS_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as FINANCIAL_SETTLEMENT_PROCESS_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as FINANCIAL_SETTLEMENT_PROCESS_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as FINANCIAL_SETTLEMENT_PROCESS_CAUSATION_ID_MAX_LENGTH,
};
