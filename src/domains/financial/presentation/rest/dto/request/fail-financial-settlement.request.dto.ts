// -----------------------------------------------------------------------------
// Financial Settlement — Fail Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for failing an existing Financial Settlement.
//
// Expected lifecycle transitions:
//
//     PENDING    → FAILED
//     PROCESSING → FAILED
//
// The FinancialSettlementAggregate remains responsible for validating whether
// the Settlement is eligible for failure and for applying the failure
// timestamp.
//
// The failure reason is an operational/domain explanation only.
//
// Sensitive provider information MUST NOT be supplied in the reason,
// including:
//
// - provider credentials;
// - access tokens;
// - API secrets;
// - authentication material;
// - private provider payloads;
// - other sensitive financial-provider data.
//
// This DTO performs transport-level validation only.
//
// The DTO does NOT:
//
// - Reverse Financial Transactions.
// - Create Financial Transactions.
// - Modify Financial Account balances.
// - Execute disbursements.
// - Perform accounting.
// - Communicate with external financial providers.
// - Move money.
//
// Any required financial reversal or compensating movement belongs to the
// Financial Transaction lifecycle and appropriate application orchestration.
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
//     failure reason
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
 * REST request for failing a Financial Settlement.
 *
 * Represents the application-level intent to transition a Settlement into
 * FAILED state.
 *
 * Expected lifecycle transitions:
 *
 *     PENDING    → FAILED
 *     PROCESSING → FAILED
 *
 * The request intentionally does not supply:
 *
 * - target status;
 * - failure timestamp;
 * - reversal transaction;
 * - compensating transaction;
 * - provider response payload.
 *
 * The target status and lifecycle validity remain the responsibility of the
 * FinancialSettlementAggregate.
 */
export class FailFinancialSettlementRequestDto {
  // ===========================================================================
  // Financial Settlement
  // ===========================================================================

  /**
   * Public identifier of the Financial Settlement to fail.
   */
  @ApiProperty({
    example: 'FST-WQC6Y7G',
    description:
      'Public identifier of the Financial Settlement to transition into FAILED state.',
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
  // Failure Reason
  // ===========================================================================

  /**
   * Human-readable explanation of why the Financial Settlement failed.
   *
   * This field must contain operational/domain information only.
   *
   * Provider credentials, tokens, secrets, authentication material and
   * private provider payloads must never be included.
   */
  @ApiProperty({
    example: 'Settlement processing could not be completed.',
    description:
      'Human-readable operational reason explaining why the Financial Settlement failed. Do not include credentials, tokens, secrets, authentication material, or private provider payloads.',
    minLength: MIN_REASON_LENGTH,
    maxLength: MAX_REASON_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'reason must be a string.',
  })
  @MinLength(MIN_REASON_LENGTH, {
    message: 'reason must not be empty.',
  })
  @MaxLength(MAX_REASON_LENGTH, {
    message: `reason must not exceed ${MAX_REASON_LENGTH} characters.`,
  })
  reason!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the failure command and resulting domain
   * events.
   */
  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description:
      'Correlation identifier for the failure command and resulting domain events.',
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
   * failure command.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command or operation that caused this failure command.',
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
  MIN_PUBLIC_ID_LENGTH as FINANCIAL_SETTLEMENT_FAIL_PUBLIC_ID_MIN_LENGTH,
  MAX_PUBLIC_ID_LENGTH as FINANCIAL_SETTLEMENT_FAIL_PUBLIC_ID_MAX_LENGTH,
  MIN_REASON_LENGTH as FINANCIAL_SETTLEMENT_FAIL_REASON_MIN_LENGTH,
  MAX_REASON_LENGTH as FINANCIAL_SETTLEMENT_FAIL_REASON_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as FINANCIAL_SETTLEMENT_FAIL_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as FINANCIAL_SETTLEMENT_FAIL_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as FINANCIAL_SETTLEMENT_FAIL_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as FINANCIAL_SETTLEMENT_FAIL_CAUSATION_ID_MAX_LENGTH,
};
