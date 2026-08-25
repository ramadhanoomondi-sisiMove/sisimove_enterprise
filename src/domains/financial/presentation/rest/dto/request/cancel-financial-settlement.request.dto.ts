// -----------------------------------------------------------------------------
// Financial Settlement — Cancel Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for cancelling an existing Financial Settlement.
//
// Expected lifecycle transitions:
//
//     PENDING    → CANCELLED
//     PROCESSING → CANCELLED
//
// The FinancialSettlementAggregate remains responsible for validating whether
// the Settlement is eligible for cancellation and for applying the
// cancellation timestamp.
//
// Cancellation records the Settlement lifecycle outcome only.
//
// This DTO performs transport-level validation only.
//
// The DTO does NOT:
//
// - Reverse previously executed Financial Transactions.
// - Modify Financial Account balances.
// - Create Financial Transactions.
// - Execute disbursements.
// - Perform accounting.
// - Communicate with external financial providers.
// - Automatically refund or reverse financial movements.
//
// Any required financial reversal must be performed explicitly through the
// Financial Transaction lifecycle and appropriate application orchestration.
//
// The cancellation reason is optional.
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
//     reason
//             │
//             ▼
//     optional cancellation reason
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

const MIN_REASON_LENGTH = 1;
const MAX_REASON_LENGTH = 500;

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
 * REST request for cancelling a Financial Settlement.
 *
 * Represents the application-level intent to transition a Settlement into
 * CANCELLED state.
 *
 * Expected lifecycle transitions:
 *
 *     PENDING    → CANCELLED
 *     PROCESSING → CANCELLED
 *
 * The request intentionally does not supply:
 *
 * - target status;
 * - cancellation timestamp;
 * - reversal transaction;
 * - refund transaction;
 * - compensating financial movement.
 *
 * The target status and lifecycle validity remain the responsibility of the
 * FinancialSettlementAggregate.
 */
export class CancelFinancialSettlementRequestDto {
  // ===========================================================================
  // Financial Settlement
  // ===========================================================================

  /**
   * Public identifier of the Financial Settlement to cancel.
   */
  @ApiProperty({
    example: 'FST-WQC6Y7G',
    description:
      'Public identifier of the Financial Settlement to transition into CANCELLED state.',
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
  // Cancellation Reason
  // ===========================================================================

  /**
   * Optional human-readable explanation of why the Financial Settlement was
   * cancelled.
   *
   * Sensitive provider credentials, tokens, secrets, authentication material,
   * or private provider payloads must not be supplied here.
   */
  @ApiPropertyOptional({
    example: 'Settlement cancelled before processing could be completed.',
    description:
      'Optional human-readable explanation for the Financial Settlement cancellation. Do not include credentials, tokens, secrets, authentication material, or private provider payloads.',
    nullable: true,
    minLength: MIN_REASON_LENGTH,
    maxLength: MAX_REASON_LENGTH,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString({
    message: 'reason must be a string.',
  })
  @MinLength(MIN_REASON_LENGTH, {
    message: 'reason must not be empty.',
  })
  @MaxLength(MAX_REASON_LENGTH, {
    message: `reason must not exceed ${MAX_REASON_LENGTH} characters.`,
  })
  reason?: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the cancellation command and resulting domain
   * events.
   */
  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description:
      'Correlation identifier for the cancellation command and resulting domain events.',
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
   * cancellation command.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command or operation that caused this cancellation command.',
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
  MIN_PUBLIC_ID_LENGTH as FINANCIAL_SETTLEMENT_CANCEL_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as FINANCIAL_SETTLEMENT_CANCEL_PUBLIC_ID_MAX_LENGTH,
  MIN_REASON_LENGTH as FINANCIAL_SETTLEMENT_CANCEL_REASON_MIN_LENGTH,
  MAX_REASON_LENGTH as FINANCIAL_SETTLEMENT_CANCEL_REASON_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as FINANCIAL_SETTLEMENT_CANCEL_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as FINANCIAL_SETTLEMENT_CANCEL_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as FINANCIAL_SETTLEMENT_CANCEL_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as FINANCIAL_SETTLEMENT_CANCEL_CAUSATION_ID_MAX_LENGTH,
};
