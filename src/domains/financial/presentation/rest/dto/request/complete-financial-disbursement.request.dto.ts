// -----------------------------------------------------------------------------
// Financial Disbursement — Complete Request DTO
// -----------------------------------------------------------------------------
//
// Presentation-layer request DTO for completing an existing Financial
// Disbursement.
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
// CompleteFinancialDisbursementCommand
//
// Domain value objects are intentionally NOT created inside this DTO.
//
// This DTO does NOT:
//
// - contain lifecycle state;
// - contain transaction identity;
// - contain attempt identity;
// - execute a provider;
// - create or post a Financial Transaction;
// - modify Financial Account balances;
// - create another execution attempt.
//
// Completion remains an aggregate operation and is permitted only when all
// FinancialDisbursementAggregate completion invariants are satisfied.
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

import { IsNotEmpty, IsString } from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class CompleteFinancialDisbursementRequestDto {
  // ===========================================================================
  // Financial Disbursement
  // ===========================================================================

  @ApiProperty({
    description: 'Public identity of the Financial Disbursement to complete.',
    example: '01J8Q8A1B2C3D4E5F6G7H8I9J0',
  })
  @IsString()
  @IsNotEmpty()
  readonly disbursementPublicId!: string;
}
