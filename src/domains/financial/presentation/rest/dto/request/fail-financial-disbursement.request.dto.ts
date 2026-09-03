// -----------------------------------------------------------------------------
// Financial Disbursement — Fail Request DTO
// -----------------------------------------------------------------------------
//
// Presentation-layer request DTO for permanently failing an existing
// Financial Disbursement.
//
// The DTO carries raw transport values received from an HTTP/API request.
//
// DTO responsibilities:
//
// - Validate incoming transport data.
// - Represent the API request shape.
// - Keep transport concerns outside the domain.
//
// The application layer converts this DTO into:
//
// FailFinancialDisbursementCommand
//
// Domain value objects are intentionally NOT created inside this DTO.
//
// This DTO does NOT:
//
// - contain lifecycle state;
// - contain attempt identity;
// - contain amount or currency;
// - contain provider information;
// - contain transaction identity;
// - execute a provider;
// - move funds;
// - create or post a Financial Transaction;
// - modify Financial Account balances;
// - create another execution attempt.
//
// Permanent parent failure is a FinancialDisbursementAggregate lifecycle
// operation. Failure of an individual execution attempt is a separate
// execution-attempt lifecycle operation.
//
// Correlation and causation identifiers are application-level tracing
// concerns and are intentionally not client-controlled request fields.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Swagger
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class FailFinancialDisbursementRequestDto {
  // ===========================================================================
  // Financial Disbursement
  // ===========================================================================

  @ApiProperty({
    description:
      'Public identity of the Financial Disbursement to permanently fail.',
    example: '01J8Q8A1B2C3D4E5F6G7H8I9J0',
  })
  @IsString()
  @IsNotEmpty()
  readonly disbursementPublicId!: string;

  // ===========================================================================
  // Failure Reason
  // ===========================================================================

  @ApiProperty({
    description: 'Reason for permanently failing the Financial Disbursement.',
    example: 'Maximum execution attempts reached without successful payout.',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  readonly reason!: string;
}
